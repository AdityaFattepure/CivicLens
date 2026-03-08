"""
CivicLens — GET /stats
Returns platform-wide analytics and statistics.
"""
import os
import json
from collections import Counter
from layers.common.utils import success, get_table


def handler(event, context):
    """Lambda handler for statistics endpoint."""
    projects_table = get_table('PROJECTS_TABLE')
    audits_table = get_table('AUDITS_TABLE')
    
    # Scan all projects
    projects = projects_table.scan().get('Items', [])
    audits = audits_table.scan().get('Items', [])
    
    # Calculate stats
    total_projects = len(projects)
    total_audits = len(audits)
    total_upvotes = sum(int(p.get('upvotes', 0)) for p in projects)
    
    # Status distribution
    status_counter = Counter(p.get('official_status', 'Unknown') for p in projects)
    
    # Disputed projects
    disputed = [p for p in projects if p.get('truth_check') == 'mismatch']
    
    # By department
    dept_stats = {}
    for p in projects:
        dept = p.get('department', 'Unknown')
        if dept not in dept_stats:
            dept_stats[dept] = {'name': dept, 'projects': 0, 'flagged': 0, 'budget': 0}
        dept_stats[dept]['projects'] += 1
        dept_stats[dept]['budget'] += int(p.get('budget', 0))
        if p.get('truth_check') == 'mismatch':
            dept_stats[dept]['flagged'] += 1
    
    # Cities
    cities = set(p.get('city', 'Unknown') for p in projects)
    
    # Top disputed by upvotes
    top_disputed = sorted(disputed, key=lambda p: int(p.get('upvotes', 0)), reverse=True)[:5]
    
    return success({
        'total_projects': total_projects,
        'total_audits': total_audits,
        'total_upvotes': total_upvotes,
        'disputed_projects': len(disputed),
        'cities_covered': len(cities),
        'departments_tracked': len(dept_stats),
        'by_status': dict(status_counter),
        'by_department': list(dept_stats.values()),
        'top_disputed': [
            {
                'id': p['id'],
                'title': p.get('title', 'Untitled'),
                'upvotes': int(p.get('upvotes', 0)),
                'audits': int(p.get('audits_count', 0)),
            }
            for p in top_disputed
        ],
    })
