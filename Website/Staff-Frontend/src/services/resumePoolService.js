import { apiClient } from '../lib/api'

// The backend auto-scopes both endpoints to the logged-in staff member's
// own assigned resumes — no assignedTo filter needed client-side here.
export function listResumePool(params = {}) {
  return apiClient.get('/resume-pool', { params: { limit: 200, ...params } }).then((r) => r.data)
}

export function getResumePoolStats() {
  return apiClient.get('/resume-pool/stats').then((r) => r.data)
}

export function reviewPoolResume(id, { decision, score, note }) {
  return apiClient.patch(`/resume-pool/${id}/review`, { decision, score, note }).then((r) => r.data)
}
