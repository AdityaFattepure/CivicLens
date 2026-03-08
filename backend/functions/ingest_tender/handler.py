"""
CivicLens — Tender Ingestion Lambda
Triggered by S3 event when a new tender PDF is uploaded.
Uses Textract + Bedrock to extract structured data.
"""
import os
import json
import uuid
import boto3
from layers.common.utils import get_table, now_iso, encode_geohash


def handler(event, context):
    """Lambda handler for processing uploaded tender PDFs."""
    # Get S3 event details
    record = event['Records'][0]
    bucket = record['s3']['bucket']['name']
    key = record['s3']['object']['key']
    
    print(f"Processing tender: s3://{bucket}/{key}")
    
    region = os.environ.get('AWS_REGION', 'ap-south-1')
    
    # Step 1: Extract text from PDF using Textract
    textract = boto3.client('textract', region_name=region)
    
    textract_response = textract.detect_document_text(
        Document={'S3Object': {'Bucket': bucket, 'Name': key}}
    )
    
    # Combine all detected text blocks
    full_text = '\n'.join(
        block['Text']
        for block in textract_response.get('Blocks', [])
        if block['BlockType'] == 'LINE'
    )
    
    print(f"Extracted {len(full_text)} characters from PDF")
    
    # Step 2: Use Amazon Bedrock (Claude 3 Haiku) to extract structured data
    bedrock = boto3.client('bedrock-runtime', region_name=region)
    
    prompt = f"""You are a government tender document analyst specializing in Indian public infrastructure projects.

Analyze the following tender document text and extract these fields as valid JSON:

{{
  "project_title": "Short descriptive title of the project",
  "budget_inr": <number in INR, e.g., 15000000>,
  "deadline_date": "YYYY-MM-DD",
  "start_date": "YYYY-MM-DD or null if not mentioned",
  "contractor_name": "Name of the contractor/company awarded",
  "department": "Government department issuing the tender",
  "officer_name": "Responsible officer (if mentioned)",
  "location_description": "Street/area/ward name where work happens",
  "city": "City name",
  "state": "State name",
  "project_type": "One of: Road Repair, Road Widening, Flyover, Bridge, Drainage, Water Pipeline, Sewage Treatment, Lake Restoration, Smart Lighting, Other",
  "tender_reference": "Official tender/contract number"
}}

Think step by step. If a field is not found in the document, use null.

Tender Document Text:
---
{full_text[:8000]}
---

Respond with ONLY the JSON object, no other text."""

    bedrock_response = bedrock.invoke_model(
        modelId='anthropic.claude-3-haiku-20240307-v1:0',
        contentType='application/json',
        accept='application/json',
        body=json.dumps({
            'anthropic_version': 'bedrock-2023-05-31',
            'max_tokens': 1024,
            'messages': [
                {'role': 'user', 'content': prompt}
            ],
        }),
    )
    
    bedrock_body = json.loads(bedrock_response['body'].read())
    extracted_text = bedrock_body['content'][0]['text']
    
    # Parse the JSON output
    try:
        # Handle potential markdown code blocks
        if '```json' in extracted_text:
            extracted_text = extracted_text.split('```json')[1].split('```')[0].strip()
        elif '```' in extracted_text:
            extracted_text = extracted_text.split('```')[1].split('```')[0].strip()
        
        extracted = json.loads(extracted_text)
    except json.JSONDecodeError as e:
        print(f"Failed to parse Bedrock output: {e}")
        print(f"Raw output: {extracted_text}")
        return {'statusCode': 500, 'body': f'Failed to parse AI output: {e}'}
    
    # Step 3: Geocode the location
    lat, lng = None, None
    location_desc = extracted.get('location_description', '')
    city = extracted.get('city', '')
    
    if location_desc or city:
        try:
            location_service = boto3.client('location', region_name=region)
            search_text = f"{location_desc}, {city}, {extracted.get('state', 'India')}"
            
            geo_response = location_service.search_place_index_for_text(
                IndexName=os.environ.get('PLACE_INDEX', 'civiclens-places'),
                Text=search_text,
                MaxResults=1,
            )
            
            if geo_response.get('Results'):
                point = geo_response['Results'][0]['Place']['Geometry']['Point']
                lng, lat = point[0], point[1]  # Location Service returns [lng, lat]
        except Exception as e:
            print(f"Geocoding failed: {e}")
    
    # Step 4: Save to DynamoDB
    project_id = f"proj-{uuid.uuid4().hex[:8]}"
    project = {
        'id': project_id,
        'title': extracted.get('project_title', 'Untitled Project'),
        'location_name': location_desc or 'Unknown Location',
        'city': city or 'Unknown',
        'lat': str(lat) if lat else '0',
        'lng': str(lng) if lng else '0',
        'geohash': encode_geohash(lat or 0, lng or 0),
        'budget': extracted.get('budget_inr', 0),
        'deadline': extracted.get('deadline_date'),
        'started': extracted.get('start_date'),
        'contractor': extracted.get('contractor_name', 'Unknown'),
        'department': extracted.get('department', 'Unknown'),
        'officer': extracted.get('officer_name'),
        'official_status': 'In Progress',
        'ai_verdict': None,
        'truth_check': None,
        'project_type': extracted.get('project_type', 'Other'),
        'tender_ref': extracted.get('tender_reference', f'AUTO/{project_id}'),
        'source_pdf': f"s3://{bucket}/{key}",
        'audits_count': 0,
        'upvotes': 0,
        'created_at': now_iso(),
    }
    
    table = get_table('PROJECTS_TABLE')
    table.put_item(Item=project)
    
    print(f"Project {project_id} saved: {project['title']}")
    
    return {
        'statusCode': 200,
        'body': json.dumps({
            'project_id': project_id,
            'title': project['title'],
            'status': 'ingested',
        }),
    }
