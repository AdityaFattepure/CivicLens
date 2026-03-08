"""
CivicLens — GET /projects
Fetch all projects or filter by proximity/city/status.
"""
import os
import json
from layers.common.utils import success, error, get_table, haversine_km


def handler(event, context):
    """Lambda handler for GET /projects."""
    params = event.get('queryStringParameters') or {}
    
    table = get_table('PROJECTS_TABLE')
    
    # Fetch all projects (for MVP — production would use GSI + pagination)
    response = table.scan()
    projects = response.get('Items', [])
    
    # Filter by city
    city = params.get('city')
    if city:
        projects = [p for p in projects if p.get('city', '').lower() == city.lower()]
    
    # Filter by status
    status = params.get('status')
    if status:
        projects = [p for p in projects if p.get('official_status') == status]
    
    # Filter by proximity
    lat = params.get('lat')
    lng = params.get('lng')
    radius = float(params.get('radius', 50))  # km
    
    if lat and lng:
        lat, lng = float(lat), float(lng)
        projects = [
            p for p in projects
            if haversine_km(lat, lng, float(p['lat']), float(p['lng'])) <= radius
        ]
        # Sort by distance
        projects.sort(key=lambda p: haversine_km(lat, lng, float(p['lat']), float(p['lng'])))
    
    return success({
        'count': len(projects),
        'projects': projects,
    })
