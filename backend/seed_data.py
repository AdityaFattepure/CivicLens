"""
CivicLens — DynamoDB Seed Script
Loads sample project data into DynamoDB for the live demo.

Usage:
  pip install boto3
  python seed_data.py

Requires AWS credentials configured (aws configure) and the SAM stack deployed.
"""
import boto3
import json
import hashlib
import time
from decimal import Decimal

# ─── Configuration ───────────────────────────────────────────
REGION = 'ap-south-1'
PROJECTS_TABLE = 'civiclens-projects-dev'
AUDITS_TABLE = 'civiclens-audits-dev'

dynamodb = boto3.resource('dynamodb', region_name=REGION)


def geohash_encode(lat, lng, precision=6):
    """Simple geohash for DynamoDB GSI."""
    return f"{round(lat, 2)}:{round(lng, 2)}"


# ─── Sample Projects ────────────────────────────────────────
PROJECTS = [
    {
        "id": "proj-aishbagh",
        "title": "Aishbagh Rail Over Bridge — The 90° Death Trap",
        "location_name": "Aishbagh Railway Station, Bhopal, Madhya Pradesh",
        "city": "Bhopal",
        "lat": Decimal("23.2569"),
        "lng": Decimal("77.4018"),
        "budget": 180000000,
        "deadline": "2024-06-30",
        "started": "2021-08-15",
        "contractor": "Local Contractor (Name withheld — under CBI probe)",
        "department": "Public Works Department — Madhya Pradesh",
        "officer": "Shri S.K. Verma",
        "official_status": "Completed",
        "ai_verdict": "Dangerous Design Flaw",
        "truth_check": "mismatch",
        "project_type": "Rail Over Bridge",
        "tender_ref": "PWD/MP/2021/ROB-017",
        "audits_count": 342,
        "upvotes": 4521,
        "is_real_incident": True,
        "news_source": "The Times of India, NDTV, India Today — 2024",
        "incident_summary": "A ₹18 crore Rail Over Bridge built with a nearly 90-degree turn forcing vehicles to make a dangerous sharp turn at elevation.",
    },
    {
        "id": "proj-bihar-clock",
        "title": "Araria Clock Tower — Stopped Working in 24 Hours",
        "location_name": "Town Center, Araria, Bihar",
        "city": "Patna",
        "lat": Decimal("26.1491"),
        "lng": Decimal("87.5157"),
        "budget": 4000000,
        "deadline": "2023-11-30",
        "started": "2023-05-01",
        "contractor": "M/s Rajput Construction",
        "department": "Urban Development Department — Bihar",
        "officer": "Shri A.K. Singh",
        "official_status": "Completed",
        "ai_verdict": "Non-Functional — Clock mechanism failure",
        "truth_check": "mismatch",
        "project_type": "Public Monument",
        "tender_ref": "UDD/BR/2023/CT-003",
        "audits_count": 187,
        "upvotes": 2891,
        "is_real_incident": True,
        "news_source": "Hindustan Times, India Today — 2023",
        "incident_summary": "A ₹40 lakh clock tower built in Araria district stopped working within 24 hours of inauguration.",
    },
    {
        "id": "proj-bellandur",
        "title": "Bellandur Lake Rejuvenation — Toxic Foam Continues",
        "location_name": "Bellandur Lake, Bangalore, Karnataka",
        "city": "Bangalore",
        "lat": Decimal("12.9352"),
        "lng": Decimal("77.6744"),
        "budget": 3000000000,
        "deadline": "2025-12-31",
        "started": "2018-01-15",
        "contractor": "Multiple agencies",
        "department": "BBMP & BDA — Karnataka",
        "officer": "Er. Manoj Kumar",
        "official_status": "In Progress",
        "ai_verdict": "Incomplete — Toxic foam still visible",
        "truth_check": "mismatch",
        "project_type": "Drainage",
        "tender_ref": "BBMP/KA/2018/ENV-042",
        "audits_count": 523,
        "upvotes": 7832,
        "is_real_incident": True,
        "news_source": "Deccan Herald, The Hindu, BBC India — 2018-2024",
        "incident_summary": "₹300 crore allocated for Bellandur Lake rejuvenation but toxic foam continues to appear regularly.",
    },
    {
        "id": "proj-nh48-widening",
        "title": "NH-48 Delhi-Gurgaon Road Widening",
        "location_name": "NH-48, Delhi-Gurgaon Border",
        "city": "New Delhi",
        "lat": Decimal("28.4817"),
        "lng": Decimal("77.0851"),
        "budget": 4500000000,
        "deadline": "2025-06-30",
        "started": "2022-04-01",
        "contractor": "Larsen & Toubro Ltd.",
        "department": "National Highways Authority of India",
        "officer": "Shri R.K. Sharma",
        "official_status": "In Progress",
        "ai_verdict": "Delayed — 40% behind schedule",
        "truth_check": "mismatch",
        "project_type": "Road Widening",
        "tender_ref": "NHAI/DL/2022/RW-112",
        "audits_count": 89,
        "upvotes": 1234,
        "is_real_incident": False,
    },
    {
        "id": "proj-pune-metro",
        "title": "Pune Metro Line 1 Extension — Vanaz to Ramwadi",
        "location_name": "Vanaz to Ramwadi, Pune",
        "city": "Pune",
        "lat": Decimal("18.5074"),
        "lng": Decimal("73.8077"),
        "budget": 11420000000,
        "deadline": "2026-03-31",
        "started": "2021-01-10",
        "contractor": "Tata Projects Ltd.",
        "department": "Pune Metropolitan Region Development Authority",
        "officer": "Er. Rajesh Patil",
        "official_status": "In Progress",
        "ai_verdict": "On Track",
        "truth_check": "match",
        "project_type": "BRT Corridor",
        "tender_ref": "PMRDA/2021/ML1-EXT",
        "audits_count": 45,
        "upvotes": 567,
        "is_real_incident": False,
    },
    {
        "id": "proj-hyd-flyover",
        "title": "Biodiversity Junction Flyover Repair",
        "location_name": "Biodiversity Junction, Hyderabad",
        "city": "Hyderabad",
        "lat": Decimal("17.3593"),
        "lng": Decimal("78.4023"),
        "budget": 250000000,
        "deadline": "2024-12-31",
        "started": "2024-03-01",
        "contractor": "NCC Ltd.",
        "department": "GHMC — Greater Hyderabad Municipal Corporation",
        "officer": "Shri Venkat Rao",
        "official_status": "Delayed",
        "ai_verdict": "Delayed by 6 months",
        "truth_check": "mismatch",
        "project_type": "Flyover Repair",
        "tender_ref": "GHMC/HYD/2024/FR-008",
        "audits_count": 34,
        "upvotes": 421,
        "is_real_incident": False,
    },
    {
        "id": "proj-chennai-drain",
        "title": "Adyar River Flood Mitigation Channel",
        "location_name": "Adyar River Basin, Chennai",
        "city": "Chennai",
        "lat": Decimal("13.0067"),
        "lng": Decimal("80.2564"),
        "budget": 1800000000,
        "deadline": "2025-09-30",
        "started": "2022-11-01",
        "contractor": "HCC Ltd.",
        "department": "Chennai Metropolitan Water Supply & Sewerage Board",
        "officer": "Er. Lakshmi Narayanan",
        "official_status": "In Progress",
        "ai_verdict": "On Track — 65% complete",
        "truth_check": "match",
        "project_type": "Drainage",
        "tender_ref": "CMWSSB/TN/2022/FM-015",
        "audits_count": 28,
        "upvotes": 312,
        "is_real_incident": False,
    },
    {
        "id": "proj-mumbai-coastal",
        "title": "Mumbai Coastal Road — South Section",
        "location_name": "Marine Drive to Worli, Mumbai",
        "city": "Mumbai",
        "lat": Decimal("18.9553"),
        "lng": Decimal("72.8136"),
        "budget": 128000000000,
        "deadline": "2025-12-31",
        "started": "2018-10-01",
        "contractor": "Afcons Infrastructure",
        "department": "BMC — Brihanmumbai Municipal Corporation",
        "officer": "Smt. Kavita Meena",
        "official_status": "In Progress",
        "ai_verdict": "Delayed — environmental concerns",
        "truth_check": "mismatch",
        "project_type": "Coastal Road",
        "tender_ref": "BMC/MH/2018/CR-001",
        "audits_count": 156,
        "upvotes": 2345,
        "is_real_incident": False,
    },
]

# ─── Sample Audits ───────────────────────────────────────────
AUDITS = [
    {
        "audit_id": "aud-aish-001",
        "project_id": "proj-aishbagh",
        "user": "Verified Citizen",
        "timestamp": "2024-11-15T10:30:00Z",
        "lat": Decimal("23.2571"),
        "lng": Decimal("77.4020"),
        "distance_m": 25,
        "ai_labels": ["Road", "Pothole", "Construction", "Vehicle"],
        "ai_verdict": "Dangerous Design Flaw — 90° turn detected",
        "ai_confidence": Decimal("94.8"),
        "upvotes": 1247,
    },
    {
        "audit_id": "aud-aish-002",
        "project_id": "proj-aishbagh",
        "user": "Verified Citizen",
        "timestamp": "2024-11-20T14:15:00Z",
        "lat": Decimal("23.2568"),
        "lng": Decimal("77.4019"),
        "distance_m": 18,
        "ai_labels": ["Debris", "Rubble", "Road"],
        "ai_verdict": "Incomplete — debris and rubble present",
        "ai_confidence": Decimal("91.2"),
        "upvotes": 856,
    },
    {
        "audit_id": "aud-bell-001",
        "project_id": "proj-bellandur",
        "user": "Verified Citizen",
        "timestamp": "2024-12-01T09:00:00Z",
        "lat": Decimal("12.9354"),
        "lng": Decimal("77.6746"),
        "distance_m": 30,
        "ai_labels": ["Water", "Foam", "Pollution"],
        "ai_verdict": "Toxic foam still visible — rejuvenation incomplete",
        "ai_confidence": Decimal("97.1"),
        "upvotes": 2103,
    },
]


def seed_projects():
    """Load projects into DynamoDB."""
    table = dynamodb.Table(PROJECTS_TABLE)
    count = 0
    for project in PROJECTS:
        item = {**project}
        item['geohash'] = geohash_encode(float(item['lat']), float(item['lng']))
        item['budget'] = int(item['budget'])
        item['audits_count'] = int(item.get('audits_count', 0))
        item['upvotes'] = int(item.get('upvotes', 0))
        item['is_real_incident'] = item.get('is_real_incident', False)

        table.put_item(Item=item)
        count += 1
        print(f"  ✓ {item['id']}: {item['title'][:50]}...")

    return count


def seed_audits():
    """Load sample audits into DynamoDB."""
    table = dynamodb.Table(AUDITS_TABLE)
    count = 0
    for audit in AUDITS:
        item = {**audit}
        # Table key is 'id', seed data uses 'audit_id'
        if 'audit_id' in item and 'id' not in item:
            item['id'] = item.pop('audit_id')
        item['distance_m'] = int(item['distance_m'])
        item['upvotes'] = int(item['upvotes'])

        table.put_item(Item=item)
        count += 1
        print(f"  ✓ {item['id']}: {item['ai_verdict'][:50]}...")

    return count


def main():
    print("=" * 60)
    print("CivicLens — DynamoDB Seed Script")
    print("=" * 60)
    print(f"Region: {REGION}")
    print(f"Projects Table: {PROJECTS_TABLE}")
    print(f"Audits Table: {AUDITS_TABLE}")
    print()

    try:
        print("Seeding projects...")
        proj_count = seed_projects()
        print(f"\n✅ {proj_count} projects loaded\n")

        print("Seeding audits...")
        audit_count = seed_audits()
        print(f"\n✅ {audit_count} audits loaded\n")

        print("=" * 60)
        print(f"Done! {proj_count} projects + {audit_count} audits seeded.")
        print("=" * 60)

    except Exception as e:
        print(f"\n❌ Error: {e}")
        print("\nMake sure:")
        print("  1. AWS credentials are configured (aws configure)")
        print("  2. The SAM stack is deployed (sam deploy)")
        print(f"  3. Tables exist: {PROJECTS_TABLE}, {AUDITS_TABLE}")
        raise


if __name__ == '__main__':
    main()
