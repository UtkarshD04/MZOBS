import { apiClient } from '../lib/api'

export function listCampusRequests(params = {}) {
  return apiClient.get('/campus-requests', { params: { limit: 200, ...params } }).then((r) => r.data)
}

export function getCampusRequestStats() {
  return apiClient.get('/campus-requests/stats').then((r) => r.data)
}

export function updateCampusRequest(id, { status, notes }) {
  return apiClient.patch(`/campus-requests/${id}`, { status, notes }).then((r) => r.data)
}
