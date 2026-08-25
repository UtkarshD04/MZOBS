import { apiClient } from '../lib/api'

export function listResumeQueue(params = {}) {
  return apiClient.get('/resumes', { params: { limit: 200, ...params } }).then((r) => r.data)
}

export function reviewResume(employeeId, { decision, score, note }) {
  return apiClient.patch(`/resumes/${employeeId}`, { decision, score, note }).then((r) => r.data)
}

export function getResumeQueueStats() {
  return apiClient.get('/resumes/stats').then((r) => r.data)
}

export function assignResume(employeeId, staffId) {
  return apiClient.patch(`/resumes/${employeeId}/assign`, { staffId }).then((r) => r.data)
}

export function bulkAssignResumes(employeeIds, staffId) {
  return apiClient.patch('/resumes/assign', { employeeIds, staffId }).then((r) => r.data)
}
