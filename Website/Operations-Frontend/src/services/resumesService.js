import { apiClient } from '../lib/api'

export function listResumeQueue(params = {}) {
  return apiClient.get('/resumes', { params: { limit: 200, ...params } }).then((r) => r.data)
}

export function assignResume(employeeId, staffId) {
  return apiClient.patch(`/resumes/${employeeId}/assign`, { staffId }).then((r) => r.data)
}

export function bulkAssignResumes(employeeIds, staffId) {
  return apiClient.patch('/resumes/assign', { employeeIds, staffId }).then((r) => r.data)
}
