import { apiClient } from '../lib/api'

export function listCompanies(params = {}) {
  return apiClient.get('/companies', { params: { limit: 200, ...params } }).then((r) => r.data)
}

export function getCompany(id) {
  return apiClient.get(`/companies/${id}`).then((r) => r.data)
}

export function verifyCompany(id, { method, note }) {
  return apiClient.patch(`/companies/${id}/verify`, { method, note }).then((r) => r.data)
}

export function rejectCompany(id, { note }) {
  return apiClient.patch(`/companies/${id}/reject`, { note }).then((r) => r.data)
}
