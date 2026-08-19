import { apiClient } from '../lib/api'

export function listApplications(params = {}) {
  return apiClient.get('/applications', { params: { limit: 200, ...params } }).then((r) => r.data)
}

export function updateApplication(id, { status, note }) {
  return apiClient.patch(`/applications/${id}`, { status, note }).then((r) => r.data)
}
