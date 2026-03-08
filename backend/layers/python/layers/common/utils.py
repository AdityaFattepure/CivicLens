"""
CivicLens — Common utilities for Lambda functions
"""
import json
import os
import decimal
from datetime import datetime, timezone

# CORS headers for API Gateway
CORS_HEADERS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type,Authorization',
    'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
    'Content-Type': 'application/json',
}


def api_response(status_code, body):
    """Create a standard API Gateway response."""
    return {
        'statusCode': status_code,
        'headers': CORS_HEADERS,
        'body': json.dumps(body, cls=DecimalEncoder, default=str),
    }


def success(body):
    return api_response(200, body)


def error(status_code, message):
    return api_response(status_code, {'error': message})


class DecimalEncoder(json.JSONEncoder):
    """Handle Decimal types from DynamoDB."""
    def default(self, o):
        if isinstance(o, decimal.Decimal):
            return float(o) if o % 1 else int(o)
        if isinstance(o, datetime):
            return o.isoformat()
        return super().default(o)


def get_table(table_name):
    """Get a DynamoDB table resource."""
    import boto3
    dynamodb = boto3.resource('dynamodb', region_name=os.environ.get('AWS_REGION', 'ap-south-1'))
    return dynamodb.Table(os.environ.get(table_name, table_name))


def now_iso():
    """Current UTC timestamp in ISO format."""
    return datetime.now(timezone.utc).isoformat()


def encode_geohash(lat, lng, precision=6):
    """Encode lat/lng to a geohash string."""
    try:
        import geohash
        return geohash.encode(lat, lng, precision=precision)
    except ImportError:
        # Fallback: simple grid-based hash
        lat_bin = int((lat + 90) * 100)
        lng_bin = int((lng + 180) * 100)
        return f"{lat_bin:05d}{lng_bin:05d}"


def decode_geohash(ghash):
    """Decode a geohash string to lat/lng."""
    try:
        import geohash
        return geohash.decode(ghash)
    except ImportError:
        lat = int(ghash[:5]) / 100 - 90
        lng = int(ghash[5:]) / 100 - 180
        return (lat, lng)


def geohash_neighbors(lat, lng, precision=4):
    """Get the geohash of the point and its 8 neighbors for range queries."""
    try:
        import geohash
        center = geohash.encode(lat, lng, precision=precision)
        neighbors = geohash.neighbors(center)
        return [center] + neighbors
    except ImportError:
        return [encode_geohash(lat, lng, precision)]


def haversine_km(lat1, lon1, lat2, lon2):
    """Calculate the Haversine distance between two points in km."""
    import math
    R = 6371
    dLat = math.radians(lat2 - lat1)
    dLon = math.radians(lon2 - lon1)
    a = (math.sin(dLat / 2) ** 2 +
         math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) *
         math.sin(dLon / 2) ** 2)
    return R * 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
