# CivicLens — The Truth Engine

> **AI-Powered Civic Transparency Platform for India**
>
> _"30 days for an RTI reply. 3 seconds on CivicLens."_

Built for the **AWS AI for Bharat Hackathon 2025** | Region: `ap-south-1` (Mumbai)

**Live Demo**: [Deploy URL] | **Video Demo**: [YouTube URL]

---

## The Problem

India spends **₹15+ Lakh Crore** annually on infrastructure. Citizens face:
- **Zero visibility** into project budgets, deadlines, or contractor details
- **30-day RTI process** to get basic information about a single project
- **No accountability mapping** — who is actually responsible for a failed road?
- **No way to verify** if a "completed" project is actually done

Government data exists — in scattered PDFs, buried tenders, and opaque portals — but ordinary citizens cannot access, understand, or verify it.

## The Solution

CivicLens transforms raw government tender PDFs into an interactive transparency platform. Citizens can see every project on a map, trace accountability chains, submit photo evidence, and let AI detect when officials lie.

---

## Why AI is Required (Not Optional)

| Problem | Why AI is the Only Solution |
|---------|----------------------------|
| Government tenders are **unstructured scanned PDFs** | Amazon Textract OCR + Bedrock Claude 3 extracts structured data (budget, contractor, deadline, location) in seconds |
| Manual RTI takes **30+ days** per project | AI processes **thousands of tenders** automatically on S3 upload |
| No way to verify a road is actually repaired | Amazon Rekognition **detects potholes, debris, and road conditions** from citizen photos |
| Citizens don't know who is responsible | **NLP-extracted accountability chain** maps Ministry → Department → Officer → Contractor |
| Scale: India has **1000s of tenders per day** | Only AI can process this volume — human review is impossible |

**Without AI, this solution cannot exist.** The core value — transforming opaque government PDFs into transparent, verifiable data — requires Generative AI for information extraction and Computer Vision for ground-truth verification.

---

## AWS Services Used

### AI/ML Services (Core)

| Service | Role | How It's Used |
|---------|------|---------------|
| **Amazon Bedrock** (Claude 3 Haiku) | Generative AI | Extracts structured project data (title, budget, contractor, location, deadline) from raw OCR text. Processes unstructured government tender language into machine-readable JSON. |
| **Amazon Textract** | Document AI / OCR | Converts scanned government tender PDFs into machine-readable text. Handles Hindi/English mixed documents, stamps, and signatures. |
| **Amazon Rekognition** | Computer Vision | Analyzes citizen-uploaded photos to detect road conditions (potholes, debris, rubble, construction equipment). Labels compared against official project status. |
| **Amazon Location Service** | Geospatial AI | Geocodes location text from tenders into lat/lng coordinates. Validates citizen photo submissions are within 200m geofence of project site. |

### Infrastructure Services

| Service | Role | Configuration |
|---------|------|---------------|
| **AWS Lambda** | Compute | 6 Python 3.12 functions (ARM64 Graviton), 512MB-1024MB memory |
| **Amazon API Gateway** | API Layer | REST API with CORS, used by React frontend |
| **Amazon DynamoDB** | Database | 2 tables (Projects + Audits), PAY_PER_REQUEST, GSIs for geohash and city queries |
| **Amazon S3** | Storage | 2 buckets — tender PDFs (triggers Lambda) and citizen photos (CORS-enabled) |
| **AWS SAM** | IaC | Complete infrastructure defined in `template.yaml` (308 lines) |
| **AWS Amplify** | Hosting | Frontend static site deployment |

---

## Architecture

```
┌──────────────────────────────────────────────────────────────┐
│              FRONTEND — React 18 + Vite + TailwindCSS        │
│         AWS Amplify Hosting | Leaflet Map | Recharts         │
└─────────────────────────┬────────────────────────────────────┘
                          │ HTTPS (REST)
┌─────────────────────────▼────────────────────────────────────┐
│                    Amazon API Gateway                          │
│     /projects  /stats  /accountability  /audit  /upvote       │
└─────────────────────────┬────────────────────────────────────┘
                          │
    ┌─────────────────────┼─────────────────────┐
    │                     │                     │
    ▼                     ▼                     ▼
┌────────────┐   ┌──────────────┐   ┌───────────────────┐
│ GetProjects │   │ SubmitAudit  │   │ IngestTender      │
│ GetStats    │   │              │   │ (S3 trigger)      │
│ GetAccount. │   │ ┌──────────┐│   │ ┌───────────────┐ │
│ Upvote      │   │ │Rekognition││   │ │ 1. Textract   │ │
│             │   │ │(photo AI) ││   │ │ 2. Bedrock    │ │
│ DynamoDB ◄──│   │ │           ││   │ │    Claude 3   │ │
│ queries     │   │ │Labels →   ││   │ │ 3. Location   │ │
│             │   │ │Truth Check││   │ │    Service    │ │
└─────┬──────┘   │ └──────────┘│   │ │ 4. DynamoDB   │ │
      │          └──────┬──────┘   │ └───────────────┘ │
      │                 │          └─────────┬─────────┘
      ▼                 ▼                    ▼
┌─────────────────────────────────────────────────────┐
│                  Amazon DynamoDB                      │
│     ProjectsTable (geohash GSI, city GSI)            │
│     AuditsTable (project_id GSI)                     │
└─────────────────────────────────────────────────────┘
```

### AI Pipeline 1: Tender Ingestion (Automated)
```
PDF → S3 Bucket → Lambda Trigger → Textract OCR → Bedrock Claude 3
→ Structured JSON (title, budget, contractor, location, deadline)
→ Location Service Geocoding → DynamoDB (with geohash index)
```

### AI Pipeline 2: Citizen Verification (On Demand)
```
Photo + GPS → S3 Upload → Geofence Check (200m radius)
→ Rekognition Label Detection → Compare vs Official Status
→ Flag Mismatch → Update Truth Check → Notify Accountability Chain
```

---

## Key Features

| Feature | Description | AWS Services |
|---------|-------------|-------------|
| **Live Project Map** | 18+ projects across 8 Indian cities plotted on interactive dark map | DynamoDB + Location Service |
| **AI Tender Analysis** | Automated PDF → structured data pipeline | Textract + Bedrock + Location Service |
| **Truth Check Engine** | Official status vs AI-detected reality comparison | Rekognition + DynamoDB |
| **Accountability Chain** | Ministry → Department → Officer → Contractor hierarchy | DynamoDB |
| **Citizen Auditing** | Geo-tagged photo evidence with 200m geofence validation | S3 + Rekognition + Location Service |
| **AI Demo Page** | Interactive demo showing both pipelines in action | Frontend simulation of real pipeline |
| **Statistics Dashboard** | Budget analysis, status distribution, dispute ranking | DynamoDB aggregations |
| **Signal-Based Priority** | Upvote system — critical issues rise to top | Lambda + DynamoDB atomic operations |

---

## Quick Start

### Frontend Only (No AWS needed)
```bash
cd frontend
npm install
npm run dev
# Opens at http://localhost:3000 — works with embedded mock data
```

### Full AWS Deployment
See [DEPLOY.md](DEPLOY.md) for step-by-step deployment guide.

```bash
# 1. Deploy backend
cd backend && sam build && sam deploy --guided

# 2. Seed data
python seed_data.py

# 3. Build frontend with API URL
cd frontend
VITE_API_URL=https://xxx.execute-api.ap-south-1.amazonaws.com/prod npm run build

# 4. Deploy to Amplify (drag dist/ folder)
```

---

## Project Structure

```
Project/
├── frontend/                      # React 18 + Vite + TailwindCSS
│   ├── src/
│   │   ├── components/            # 9 reusable UI components
│   │   ├── pages/                 # 7 route pages (incl. AI Demo)
│   │   │   ├── Dashboard.jsx      # Map + project list
│   │   │   ├── ProjectDetail.jsx  # Full project detail + truth check
│   │   │   ├── Accountability.jsx # Government hierarchy explorer
│   │   │   ├── ReportIssue.jsx    # 4-step citizen audit wizard
│   │   │   ├── Stats.jsx          # Analytics dashboard
│   │   │   ├── AIDemo.jsx         # ★ Live AI pipeline demo
│   │   │   └── About.jsx          # Architecture, AWS services
│   │   ├── data/mockData.js       # 18 projects, accountability tree
│   │   └── utils/api.js           # API client with mock fallback
│   └── package.json
│
├── backend/
│   ├── functions/                 # 6 AWS Lambda handlers (Python 3.12)
│   │   ├── ingest_tender/         # ★ Textract → Bedrock → DynamoDB
│   │   ├── submit_audit/          # ★ Rekognition → Truth Check
│   │   ├── get_projects/          # DynamoDB query with geo-filters
│   │   ├── get_accountability/    # Hierarchy tree + entity lookup
│   │   ├── get_stats/             # Aggregated analytics
│   │   └── upvote/                # Atomic DynamoDB increment
│   ├── layers/common/utils.py     # Shared: CORS, geohash, haversine
│   ├── template.yaml              # SAM infrastructure (308 lines)
│   ├── seed_data.py               # DynamoDB data seeder
│   └── samconfig.toml             # Deploy config (ap-south-1)
│
├── DEPLOY.md                      # Step-by-step deployment guide
└── README.md                      # This file
```

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite 6.4, TailwindCSS 3.4, React-Leaflet, Recharts, Lucide React |
| Map | OpenStreetMap + CARTO dark basemap (zero API keys needed) |
| Backend | AWS Lambda (Python 3.12, ARM64 Graviton), API Gateway |
| Database | Amazon DynamoDB (PAY_PER_REQUEST, geohash GSI + city GSI) |
| AI/ML | Amazon Bedrock (Claude 3 Haiku), Textract, Rekognition |
| Storage | Amazon S3 (tender PDFs with Lambda trigger + citizen photos) |
| Geospatial | Amazon Location Service (Esri, geocoding + geofence) |
| Infrastructure | AWS SAM (IaC), AWS Amplify (hosting) |

---

## Cost Estimate

| Service | Monthly Cost | Notes |
|---------|-------------|-------|
| Lambda | ~$0 | Free tier: 1M requests/month |
| DynamoDB | ~$0 | PAY_PER_REQUEST, demo traffic |
| API Gateway | ~$0 | Free tier: 1M calls/month |
| S3 | ~$0.01 | A few MBs of storage |
| Bedrock | ~$0.50-2 | Claude 3 Haiku: $0.25/1M input tokens |
| Textract | ~$1-3 | $1.50 per 1000 pages |
| Rekognition | ~$0 | Free tier: 5000 images/month |
| Location Service | ~$0 | Free tier: 10K geocodes/month |
| **Total** | **< $5/month** | Well within $200 credits |

---

## Hackathon Evaluation Criteria

| Criteria | How CivicLens Addresses It |
|----------|---------------------------|
| **Uses AWS Generative AI** | Amazon Bedrock (Claude 3 Haiku) for structured extraction from unstructured tender PDFs |
| **AWS Infrastructure** | Lambda, API Gateway, DynamoDB, S3, Textract, Rekognition, Location Service, Amplify |
| **Why AI is required** | Government tenders are unstructured PDFs — only AI can extract structured data at scale. Photo verification requires CV. Manual RTI takes 30 days. |
| **Value AI adds** | Transforms opaque government processes into transparent, verifiable, searchable data accessible to every citizen |
| **MVP with live link** | Deployed on AWS Amplify with working API backend |
| **GitHub repository** | Complete codebase with documentation, IaC, and deployment guide |

---

## License

Built for the AWS AI for Bharat Hackathon 2025.
