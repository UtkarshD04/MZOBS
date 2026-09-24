import { apiClient } from '../lib/api'

export function listEmployees(params = {}) {
  return apiClient.get('/employees', { params: { limit: 200, ...params } }).then((r) => r.data)
}

// Full profile plus a fresh ~10-minute resume link (resume.url).
export function getEmployee(id) {
  return apiClient.get(`/employees/${id}`).then((r) => r.data)
}

export function createEmployee({ name, email, phone, graduation, experience }) {
  return apiClient.post('/employees', { name, email, phone, graduation, experience }).then((r) => r.data)
}

export function setEmployeeStatus(id, status) {
  return apiClient.patch(`/employees/${id}/status`, { status }).then((r) => r.data)
}

export function deleteEmployee(id) {
  return apiClient.delete(`/employees/${id}`).then((r) => r.data)
}
