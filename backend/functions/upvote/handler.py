"""
CivicLens — POST /projects/{projectId}/audits/{auditId}/upvote
Atomic increment of upvote counter.
"""
import os
import json
from layers.common.utils import success, error, get_table


def handler(event, context):
    """Lambda handler for upvoting an audit."""
    path_params = event.get('pathParameters') or {}
    project_id = path_params.get('projectId')
    audit_id = path_params.get('auditId')
    
    if not project_id or not audit_id:
        return error(400, 'Missing projectId or auditId')
    
    table = get_table('AUDITS_TABLE')
    
    try:
        response = table.update_item(
            Key={'id': audit_id, 'project_id': project_id},
            UpdateExpression='SET upvotes = if_not_exists(upvotes, :zero) + :inc',
            ExpressionAttributeValues={':inc': 1, ':zero': 0},
            ReturnValues='UPDATED_NEW',
        )
        new_count = int(response['Attributes']['upvotes'])
        
        # Also increment project-level upvotes
        projects_table = get_table('PROJECTS_TABLE')
        projects_table.update_item(
            Key={'id': project_id},
            UpdateExpression='SET upvotes = if_not_exists(upvotes, :zero) + :inc',
            ExpressionAttributeValues={':inc': 1, ':zero': 0},
        )
        
        return success({'upvotes': new_count})
    except Exception as e:
        return error(500, f'Failed to upvote: {str(e)}')
