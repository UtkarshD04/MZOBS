import { apiClient } from '../lib/api'

export function listSavedJobs() {
  return apiClient.get('/saved-jobs').then((r) => r.data)
}

export function saveJob(jobId) {
  return apiClient.post('/saved-jobs', { jobId }).then((r) => r.data)
}

export function unsaveJob(jobId) {
  return apiClient.delete(`/saved-jobs/${jobId}`).then((r) => r.data)
}
