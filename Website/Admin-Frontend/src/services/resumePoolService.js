import { apiClient } from '../lib/api'

export function listResumePool(params = {}) {
  return apiClient.get('/resume-pool', { params: { limit: 200, ...params } }).then((r) => r.data)
}

export function getResumePoolStats() {
  return apiClient.get('/resume-pool/stats').then((r) => r.data)
}

export function bulkUploadResumes(files) {
  const form = new FormData()
  for (const file of files) form.append('resumes', file)
  return apiClient.post('/resume-pool/bulk-upload', form).then((r) => r.data)
}

export function assignResume(id, staffId) {
  return apiClient.patch(`/resume-pool/${id}/assign`, { staffId }).then((r) => r.data)
}

export function bulkAssignResumes(resumeIds, staffId) {
  return apiClient.patch('/resume-pool/assign', { resumeIds, staffId }).then((r) => r.data)
}

export function reviewPoolResume(id, { decision, score, note }) {
  return apiClient.patch(`/resume-pool/${id}/review`, { decision, score, note }).then((r) => r.data)
}
