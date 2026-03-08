/**
 * CivicLens API Client
 * Tries the mock API server first, then falls back to embedded mock data.
 */
import { projects, accountabilityTree, accountabilityMap, sampleAudits, stats } from '../data/mockData'

const API_BASE = import.meta.env.VITE_API_URL || '/api'
let apiAvailable = null // null = unknown, true/false after first check

async function request(endpoint, options = {}) {
  // Try real API first (mock server on :3001 or deployed API)
  if (apiAvailable !== false) {
    try {
      const url = `${API_BASE}${endpoint}`
      const res = await fetch(url, {
        headers: { 'Content-Type': 'application/json', ...options.headers },
        ...options,
      })
      if (res.ok) {
        apiAvailable = true
        return res.json()
      }
    } catch {
      apiAvailable = false
      console.info('CivicLens: API not reachable — using embedded mock data')
    }
  }
  // Return null to signal fallback
  return null
}

// ─── Projects API (with mock fallback) ──────────────────────
export const projectsApi = {
  getAll: async (filters = {}) => {
    const result = await request('/projects')
    if (result) return result

    let filtered = [...projects]
    if (filters.city) filtered = filtered.filter(p => p.city.toLowerCase() === filters.city.toLowerCase())
    if (filters.status) filtered = filtered.filter(p => p.official_status === filters.status)
    return { count: filtered.length, projects: filtered }
  },

  getById: async (id) => {
    const result = await request(`/projects/${id}`)
    if (result) return result

    const project = projects.find(p => p.id === id)
    if (!project) throw new Error('Project not found')
    const audits = sampleAudits[id] || []
    return { ...project, audits }
  },

  getByCity: async (city) => {
    const result = await request(`/projects?city=${encodeURIComponent(city)}`)
    if (result) return result

    const filtered = projects.filter(p => p.city.toLowerCase() === city.toLowerCase())
    return { count: filtered.length, projects: filtered }
  },

  getNearby: (lat, lng, radius = 50) =>
    request(`/projects?lat=${lat}&lng=${lng}&radius=${radius}`),
}

// ─── Accountability API (with mock fallback) ────────────────
export const accountabilityApi = {
  getTree: async () => {
    const result = await request('/accountability')
    if (result) return result
    return { tree: accountabilityTree, total_entities: Object.keys(accountabilityMap).length }
  },

  getEntity: async (id) => {
    const result = await request(`/accountability/${id}`)
    if (result) return result

    const entity = accountabilityMap[id]
    if (!entity) throw new Error('Entity not found')
    const associatedProjects = projects.filter(p =>
      p.accountability_chain && p.accountability_chain.includes(id)
    )
    return { ...entity, associated_projects: associatedProjects }
  },
}

// ─── Audits API (with mock fallback) ────────────────────────
export const auditsApi = {
  submit: async (projectId, data) => {
    const result = await request(`/projects/${projectId}/audit`, {
      method: 'POST',
      body: JSON.stringify(data),
    })
    if (result) return result

    // Mock submission
    return {
      audit_id: `aud-${Date.now().toString(36)}`,
      ai_verdict: 'Inconclusive',
      ai_confidence: 72,
      distance_m: 45,
      message: 'Audit submitted successfully (offline mock)',
    }
  },

  upvote: async (projectId, auditId) => {
    const result = await request(`/projects/${projectId}/audits/${auditId}/upvote`, {
      method: 'POST',
    })
    if (result) return result

    const audits = sampleAudits[projectId] || []
    const audit = audits.find(a => a.id === auditId)
    if (audit) audit.upvotes = (audit.upvotes || 0) + 1
    return { upvotes: audit?.upvotes || 1 }
  },

  getForProject: async (projectId) => {
    const result = await request(`/projects/${projectId}/audits`)
    if (result) return result
    return sampleAudits[projectId] || []
  },
}

// ─── Stats API (with mock fallback) ─────────────────────────
export const statsApi = {
  getOverview: async () => {
    const result = await request('/stats')
    if (result) return result
    return stats
  },
}
