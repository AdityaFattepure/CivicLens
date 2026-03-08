/**
 * CivicLens — Local Mock API Server
 * Serves mock data on port 3001 so the frontend works without AWS deployment.
 * Run: cd backend/mock-api && npm install && npm start
 */
const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json({ limit: '10mb' }));

// ─── Mock Data ──────────────────────────────────────────────
const accountabilityTree = require('./data/accountability.json');
const projects = require('./data/projects.json');
const audits = require('./data/audits.json');

// ─── Helpers ────────────────────────────────────────────────
function flattenTree(nodes, chain = []) {
  const result = {};
  for (const node of nodes) {
    const nodeChain = [...chain, { id: node.id, name: node.name, type: node.type }];
    result[node.id] = { ...node, chain: nodeChain };
    if (node.children) {
      Object.assign(result, flattenTree(node.children, nodeChain));
    }
  }
  return result;
}

const accountabilityMap = flattenTree(accountabilityTree);

// ─── Projects ───────────────────────────────────────────────
app.get('/api/projects', (req, res) => {
  let filtered = [...projects];
  const { city, status, lat, lng, radius = 50 } = req.query;

  if (city) filtered = filtered.filter(p => p.city.toLowerCase() === city.toLowerCase());
  if (status) filtered = filtered.filter(p => p.official_status === status);
  
  if (lat && lng) {
    const userLat = parseFloat(lat), userLng = parseFloat(lng), r = parseFloat(radius);
    filtered = filtered
      .map(p => ({ ...p, _dist: haversine(userLat, userLng, p.lat, p.lng) }))
      .filter(p => p._dist <= r)
      .sort((a, b) => a._dist - b._dist);
  }

  res.json({ count: filtered.length, projects: filtered });
});

app.get('/api/projects/:id', (req, res) => {
  const project = projects.find(p => p.id === req.params.id);
  if (!project) return res.status(404).json({ error: 'Project not found' });
  
  const projectAudits = audits.filter(a => a.project_id === project.id);
  res.json({ ...project, audits: projectAudits });
});

// ─── Accountability ─────────────────────────────────────────
app.get('/api/accountability', (req, res) => {
  res.json({ tree: accountabilityTree, total_entities: Object.keys(accountabilityMap).length });
});

app.get('/api/accountability/:entityId', (req, res) => {
  const entity = accountabilityMap[req.params.entityId];
  if (!entity) return res.status(404).json({ error: 'Entity not found' });
  
  // Attach associated projects
  const associatedProjects = projects.filter(p =>
    p.accountability_chain && p.accountability_chain.includes(req.params.entityId)
  );
  
  res.json({ ...entity, associated_projects: associatedProjects });
});

// ─── Audits / Submit ────────────────────────────────────────
app.post('/api/projects/:projectId/audit', (req, res) => {
  const project = projects.find(p => p.id === req.params.projectId);
  if (!project) return res.status(404).json({ error: 'Project not found' });

  const { lat, lng } = req.body;
  if (!lat || !lng) return res.status(400).json({ error: 'GPS coordinates required' });

  const dist = haversine(lat, lng, project.lat, project.lng);
  
  // For mock: accept any distance (skip geofence for demo)
  const auditId = `aud-${Date.now().toString(36)}`;
  const newAudit = {
    id: auditId,
    project_id: req.params.projectId,
    user_id: 'anonymous',
    lat, lng,
    distance_m: Math.round(dist * 1000),
    ai_verdict: 'Inconclusive',
    ai_confidence: 72,
    upvotes: 0,
    timestamp: new Date().toISOString(),
  };
  audits.push(newAudit);

  res.json({
    audit_id: auditId,
    ai_verdict: newAudit.ai_verdict,
    ai_confidence: newAudit.ai_confidence,
    distance_m: newAudit.distance_m,
    message: 'Audit submitted successfully (mock)',
  });
});

// ─── Upvote ─────────────────────────────────────────────────
app.post('/api/projects/:projectId/audits/:auditId/upvote', (req, res) => {
  const audit = audits.find(a => a.id === req.params.auditId);
  if (!audit) return res.status(404).json({ error: 'Audit not found' });
  audit.upvotes = (audit.upvotes || 0) + 1;
  res.json({ upvotes: audit.upvotes });
});

// ─── Stats ──────────────────────────────────────────────────
app.get('/api/stats', (req, res) => {
  const statusCount = {};
  const deptStats = {};
  let totalUpvotes = 0;

  for (const p of projects) {
    statusCount[p.official_status] = (statusCount[p.official_status] || 0) + 1;
    totalUpvotes += (p.upvotes || 0);
    
    const dept = p.department || 'Unknown';
    if (!deptStats[dept]) deptStats[dept] = { name: dept, projects: 0, flagged: 0, budget: 0 };
    deptStats[dept].projects++;
    deptStats[dept].budget += (p.budget || 0);
    if (p.truth_check === 'mismatch') deptStats[dept].flagged++;
  }

  const disputed = projects.filter(p => p.truth_check === 'mismatch');
  const cities = new Set(projects.map(p => p.city));

  res.json({
    total_projects: projects.length,
    total_audits: audits.length,
    total_upvotes: totalUpvotes,
    disputed_projects: disputed.length,
    cities_covered: cities.size,
    departments_tracked: Object.keys(deptStats).length,
    by_status: statusCount,
    by_department: Object.values(deptStats),
    top_disputed: disputed
      .sort((a, b) => (b.upvotes || 0) - (a.upvotes || 0))
      .slice(0, 5)
      .map(p => ({ id: p.id, title: p.title, upvotes: p.upvotes || 0, audits: p.audits_count || 0 })),
  });
});

// ─── Haversine ──────────────────────────────────────────────
function haversine(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

// ─── Start ──────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n  🏗️  CivicLens Mock API running at http://localhost:${PORT}`);
  console.log(`  📊 ${projects.length} projects | ${audits.length} audits | ${Object.keys(accountabilityMap).length} entities\n`);
});
