# CivicLens — Deployment Guide

## Prerequisites

- AWS CLI v2 installed and configured (`aws configure` with your credentials)
- AWS SAM CLI installed (`pip install aws-sam-cli`)
- Node.js 18+ and npm
- Python 3.12
- Your $200 AWS credits activated

---

## Step 1: Enable Bedrock Model Access

> **IMPORTANT**: Do this FIRST — it takes a few minutes to propagate.

1. Open AWS Console → **Amazon Bedrock** → **Model access** (left sidebar)
2. Region: **ap-south-1 (Mumbai)**
3. Click **Manage model access**
4. Enable: **Anthropic → Claude 3 Haiku** (`anthropic.claude-3-haiku-20240307-v1:0`)
5. Click **Save changes**
6. Wait for status to show **Access granted** ✅

---

## Step 2: Deploy Backend (SAM)

```powershell
cd backend

# Build the SAM application
sam build

# Deploy (first time — guided)
sam deploy --guided
```

When prompted:
- Stack name: `civiclens-dev`
- Region: `ap-south-1`
- Confirm changes: `Y`
- Allow SAM CLI IAM role creation: `Y`
- All other defaults: press Enter

After deployment completes, note the **API URL** from the Outputs:
```
Key: ApiUrl
Value: https://xxxxxxxx.execute-api.ap-south-1.amazonaws.com/prod
```

**Save this URL** — you'll need it for the frontend.

---

## Step 3: Seed DynamoDB with Sample Data

```powershell
cd backend
pip install boto3
python seed_data.py
```

This loads 8 projects and 3 audits into DynamoDB.

---

## Step 4: Test the API

```powershell
# Replace with your actual API URL
$API="https://xxxxxxxx.execute-api.ap-south-1.amazonaws.com/prod"

# Test projects endpoint
Invoke-RestMethod "$API/projects"

# Test stats endpoint
Invoke-RestMethod "$API/stats"

# Test accountability endpoint
Invoke-RestMethod "$API/accountability"
```

---

## Step 5: Build & Deploy Frontend

### Option A: AWS Amplify (Recommended — easiest)

1. Build the frontend:
```powershell
cd frontend
npm install

# Set the API URL from Step 2
$env:VITE_API_URL="https://xxxxxxxx.execute-api.ap-south-1.amazonaws.com/prod"

npm run build
```

2. Deploy to Amplify:
   - Open AWS Console → **AWS Amplify**
   - Click **Deploy without Git** (or **Host web app** → **Deploy without Git provider**)  
   - Drag & drop the `frontend/dist` folder
   - Done! Amplify gives you a URL like `https://main.dxxxxxxxxx.amplifyapp.com`

### Option B: S3 + CloudFront (Manual)

1. Create an S3 bucket for hosting:
```powershell
aws s3 mb s3://civiclens-frontend-prod --region ap-south-1
```

2. Enable static website hosting:
```powershell
aws s3 website s3://civiclens-frontend-prod --index-document index.html --error-document index.html
```

3. Upload the build:
```powershell
cd frontend
npm install
$env:VITE_API_URL="https://xxxxxxxx.execute-api.ap-south-1.amazonaws.com/prod"
npm run build
aws s3 sync dist/ s3://civiclens-frontend-prod --delete
```

4. Set bucket policy for public access (or use CloudFront OAI).

---

## Step 6: Upload a Sample Tender PDF (Test AI Pipeline)

1. Go to AWS Console → **S3** → find the `civiclens-tenders-*` bucket
2. Upload any government tender PDF
3. This triggers the `IngestTender` Lambda:
   - Textract OCR → Bedrock Claude 3 analysis → Location Service geocoding → DynamoDB save
4. Check DynamoDB → `civiclens-projects` table for the new entry

---

## Architecture Summary

```
┌─────────────────────────────────────────────────────────┐
│                    FRONTEND (React)                      │
│              Hosted on AWS Amplify / S3                  │
└──────────────────────┬──────────────────────────────────┘
                       │ HTTPS
┌──────────────────────▼──────────────────────────────────┐
│                  API Gateway (REST)                       │
│              /projects /stats /accountability             │
└──────────────────────┬──────────────────────────────────┘
                       │
┌──────────────────────▼──────────────────────────────────┐
│               AWS Lambda (Python 3.12)                   │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌────────────┐ │
│  │GetProjects│ │SubmitAudit│ │IngestTender│ │GetStats   │ │
│  └──────────┘ └──────────┘ └──────────┘ └────────────┘ │
└──┬──────────────┬──────────────┬──────────────┬────────┘
   │              │              │              │
   ▼              ▼              ▼              ▼
┌────────┐  ┌──────────┐  ┌──────────┐  ┌──────────────┐
│DynamoDB │  │Rekognition│  │ Textract  │  │   Bedrock    │
│(2 tables)│  │  (Vision) │  │  (OCR)    │  │ (Claude 3)   │
└────────┘  └──────────┘  └──────────┘  └──────────────┘
                                              │
                                    ┌─────────▼──────────┐
                                    │ Location Service    │
                                    │ (Geocoding)         │
                                    └────────────────────┘
```

---

## Cost Estimate (within $200 credits)

| Service | Estimated Cost | Notes |
|---------|---------------|-------|
| Lambda | ~$0-1 | Free tier: 1M requests/month |
| DynamoDB | ~$0-1 | PAY_PER_REQUEST, demo traffic |
| API Gateway | ~$0 | Free tier: 1M calls/month |
| S3 | ~$0.01 | A few MBs of PDFs + images |
| Bedrock (Claude 3 Haiku) | ~$0.50-2 | ~$0.00025/1K input tokens |
| Textract | ~$1-3 | $1.50 per 1000 pages |
| Rekognition | ~$0-1 | Free tier: 5000 images/month |
| Location Service | ~$0 | Free tier: 10K geocodes/month |
| Amplify | ~$0 | Free tier for small apps |
| **Total** | **~$2-8** | Well within $200 budget |

---

## Troubleshooting

### "Bedrock model access denied"
→ Go to Bedrock console → Model access → Enable Claude 3 Haiku for ap-south-1

### "CORS errors in browser"
→ The SAM template already configures CORS headers in Lambda responses. If you see CORS errors, check that your API Gateway has the right stage deployed.

### "sam build fails"
→ Make sure Python 3.12 is installed: `python --version`
→ On Windows, you may need: `sam build --use-container`

### "Frontend shows mock data instead of API data"
→ Check that `VITE_API_URL` was set BEFORE running `npm run build`
→ Verify: `cat dist/assets/*.js | Select-String "execute-api"`
