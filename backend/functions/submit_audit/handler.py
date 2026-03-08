"""
CivicLens — POST /projects/{projectId}/audit
Submit citizen photo evidence for a project.
Includes geofence validation and AI analysis.
"""
import os
import json
import uuid
import base64
from layers.common.utils import success, error, get_table, now_iso, haversine_km


def handler(event, context):
    """Lambda handler for submitting an audit."""
    path_params = event.get('pathParameters') or {}
    project_id = path_params.get('projectId')
    
    if not project_id:
        return error(400, 'Missing projectId')
    
    # Parse body
    try:
        body = json.loads(event.get('body', '{}'))
    except json.JSONDecodeError:
        return error(400, 'Invalid JSON body')
    
    user_lat = body.get('lat')
    user_lng = body.get('lng')
    image_base64 = body.get('image')  # Base64-encoded image
    
    if not user_lat or not user_lng:
        return error(400, 'GPS coordinates (lat, lng) are required')
    
    # Get the project to validate geofence
    projects_table = get_table('PROJECTS_TABLE')
    project_resp = projects_table.get_item(Key={'id': project_id})
    project = project_resp.get('Item')
    
    if not project:
        return error(404, f'Project {project_id} not found')
    
    # Geofence check — user must be within 200m of project site
    project_lat = float(project['lat'])
    project_lng = float(project['lng'])
    distance_km = haversine_km(float(user_lat), float(user_lng), project_lat, project_lng)
    
    if distance_km > 0.2:  # 200 meters
        return error(403, f'Too far from project site. You are {distance_km*1000:.0f}m away. Must be within 200m.')
    
    # Store image in S3 (if provided)
    image_s3_url = None
    if image_base64:
        import boto3
        s3 = boto3.client('s3')
        bucket = os.environ.get('IMAGES_BUCKET', 'civiclens-images')
        key = f"audits/{project_id}/{uuid.uuid4()}.jpg"
        s3.put_object(
            Bucket=bucket,
            Key=key,
            Body=base64.b64decode(image_base64),
            ContentType='image/jpeg',
        )
        image_s3_url = f"s3://{bucket}/{key}"
    
    # AI Analysis with Amazon Rekognition
    ai_verdict = 'Inconclusive'
    ai_confidence = 0
    ai_labels = []
    
    if image_base64:
        try:
            import boto3
            rekognition = boto3.client('rekognition', region_name=os.environ.get('AWS_REGION', 'ap-south-1'))
            response = rekognition.detect_labels(
                Image={'Bytes': base64.b64decode(image_base64)},
                MaxLabels=20,
                MinConfidence=60,
            )
            labels = response.get('Labels', [])
            ai_labels = [{'name': l['Name'], 'confidence': l['Confidence']} for l in labels]
            
            # Determine verdict based on labels
            negative_labels = {'Pothole', 'Rubble', 'Debris', 'Construction', 'Demolition', 'Dirt Road', 'Mud'}
            positive_labels = {'Road', 'Asphalt', 'Highway', 'Street', 'Pavement', 'Tarmac'}
            
            label_names = {l['Name'] for l in labels}
            neg_match = label_names & negative_labels
            pos_match = label_names & positive_labels
            
            if neg_match and not pos_match:
                ai_verdict = 'Incomplete'
                ai_confidence = max(l['Confidence'] for l in labels if l['Name'] in neg_match)
            elif pos_match and not neg_match:
                ai_verdict = 'Complete'
                ai_confidence = max(l['Confidence'] for l in labels if l['Name'] in pos_match)
            else:
                ai_verdict = 'Inconclusive'
                ai_confidence = 50
        except Exception as e:
            print(f"Rekognition error: {e}")
            ai_verdict = 'Inconclusive'
    
    # Save audit to DynamoDB
    audits_table = get_table('AUDITS_TABLE')
    audit_id = f"aud-{uuid.uuid4().hex[:8]}"
    audit = {
        'id': audit_id,
        'project_id': project_id,
        'user_id': 'anonymous',
        'lat': str(user_lat),
        'lng': str(user_lng),
        'distance_m': int(distance_km * 1000),
        'image_url': image_s3_url,
        'ai_verdict': ai_verdict,
        'ai_confidence': str(ai_confidence),
        'ai_labels': json.dumps(ai_labels),
        'upvotes': 0,
        'timestamp': now_iso(),
    }
    audits_table.put_item(Item=audit)
    
    # Truth Check: Compare AI verdict with official status
    truth_status = None
    if project.get('official_status') == 'Completed' and ai_verdict == 'Incomplete':
        truth_status = 'Disputed'
        # Update project status to Disputed
        projects_table.update_item(
            Key={'id': project_id},
            UpdateExpression='SET truth_check = :tc, ai_verdict = :av',
            ExpressionAttributeValues={':tc': 'mismatch', ':av': ai_verdict},
        )
    
    return success({
        'audit_id': audit_id,
        'ai_verdict': ai_verdict,
        'ai_confidence': ai_confidence,
        'distance_m': int(distance_km * 1000),
        'truth_status': truth_status,
        'message': 'Audit submitted successfully',
    })
