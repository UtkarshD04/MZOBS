import { apiClient } from '../lib/api'

export function listPlanEnquiries(params = {}) {
  return apiClient.get('/plan-enquiries', { params: { limit: 200, ...params } }).then((r) => r.data)
}

export function getStats() {
  return apiClient.get('/plan-enquiries/stats').then((r) => r.data)
}

export function updatePlanEnquiry(id, { status, notes }) {
  return apiClient.patch(`/plan-enquiries/${id}`, { status, notes }).then((r) => r.data)
}
