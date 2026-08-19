import { apiClient } from '../lib/api'

export function listMockInterviews(params = {}) {
  return apiClient.get('/mock-interviews', { params: { limit: 200, ...params } }).then((r) => r.data)
}

export function scheduleMockInterview(input) {
  return apiClient.post('/mock-interviews', input).then((r) => r.data)
}

export function completeMockInterview(id, { scores, feedback }) {
  return apiClient.patch(`/mock-interviews/${id}/complete`, { scores, feedback }).then((r) => r.data)
}

export function markNoShow(id) {
  return apiClient.patch(`/mock-interviews/${id}/no-show`).then((r) => r.data)
}

export function assignSkillTrack(employeeId, { key, label, grade, note }) {
  return apiClient.patch(`/employees/${employeeId}/skill-track`, { key, label, grade, note }).then((r) => r.data)
}
