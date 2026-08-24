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

export function blockCompany(id, { reason }) {
  return apiClient.patch(`/companies/${id}/block`, { reason }).then((r) => r.data)
}

export function unblockCompany(id) {
  return apiClient.patch(`/companies/${id}/unblock`).then((r) => r.data)
}

export function deleteCompany(id) {
  return apiClient.delete(`/companies/${id}`).then((r) => r.data)
}
