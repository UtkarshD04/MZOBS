import { apiClient } from '../lib/api'

export function listAssociates(params = {}) {
  return apiClient.get('/associates', { params: { limit: 200, ...params } }).then((r) => r.data)
}

export function getStats() {
  return apiClient.get('/associates/stats').then((r) => r.data)
}

export function updateAssociate(id, { status, notes }) {
  return apiClient.patch(`/associates/${id}`, { status, notes }).then((r) => r.data)
}
