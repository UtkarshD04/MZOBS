import { apiClient } from '../lib/api'

export function listRecentlyViewed() {
  return apiClient.get('/recently-viewed').then((r) => r.data)
}

export function recordView(jobId) {
  return apiClient.post('/recently-viewed', { jobId })
}
