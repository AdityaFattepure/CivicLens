"""
CivicLens — GET /accountability/tree and GET /accountability/{entityId}
Returns the full government accountability hierarchy.
"""
import os
import json
from layers.common.utils import success, error, get_table


# For the MVP, the accountability hierarchy is served from a static JSON.
# In production, this would be stored in DynamoDB with parent-child relationships.
ACCOUNTABILITY_TREE = None


def load_tree():
    """Load the accountability tree from the bundled JSON file."""
    global ACCOUNTABILITY_TREE
    if ACCOUNTABILITY_TREE is None:
        tree_path = os.path.join(os.path.dirname(__file__), 'accountability_data.json')
        with open(tree_path, 'r') as f:
            ACCOUNTABILITY_TREE = json.load(f)
    return ACCOUNTABILITY_TREE


def flatten_tree(nodes, parent_chain=None):
    """Flatten the tree into a dict keyed by entity id."""
    if parent_chain is None:
        parent_chain = []
    result = {}
    for node in nodes:
        chain = parent_chain + [{'id': node['id'], 'name': node['name'], 'type': node['type']}]
        result[node['id']] = {**node, 'chain': chain}
        if node.get('children'):
            result.update(flatten_tree(node['children'], chain))
    return result


def handler(event, context):
    """Lambda handler for accountability endpoints."""
    tree = load_tree()
    
    path = event.get('pathParameters') or {}
    entity_id = path.get('entityId')
    
    if entity_id:
        # Return specific entity with its chain + children
        flat = flatten_tree(tree)
        entity = flat.get(entity_id)
        if not entity:
            return error(404, f'Entity {entity_id} not found')
        return success(entity)
    
    # Return full tree
    return success({
        'tree': tree,
        'total_entities': len(flatten_tree(tree)),
    })
