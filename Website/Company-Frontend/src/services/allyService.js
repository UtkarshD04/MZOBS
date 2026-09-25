import { apiClient } from '../lib/api'

export function listApplications(params = {}) {
  return apiClient.get('/campus-mantri', { params: { limit: 200, ...params } }).then((r) => r.data)
}

export function getStats() {
  return apiClient.get('/campus-mantri/stats').then((r) => r.data)
}

export function updateApplication(id, { status, notes }) {
  return apiClient.patch(`/campus-mantri/${id}`, { status, notes }).then((r) => r.data)
}
