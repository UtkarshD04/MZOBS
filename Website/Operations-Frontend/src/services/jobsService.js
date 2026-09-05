import { apiClient } from '../lib/api'

export function listJobs(params = {}) {
  return apiClient.get('/jobs', { params: { limit: 200, ...params } }).then((r) => r.data)
}

export function getJob(id) {
  return apiClient.get(`/jobs/${id}`).then((r) => r.data)
}

export function createJob(input) {
  return apiClient.post('/jobs', input).then((r) => r.data)
}

export function approveJob(id, { vacancies, visibleToCandidates, track }) {
  return apiClient.patch(`/jobs/${id}/approve`, { vacancies, visibleToCandidates, track }).then((r) => r.data)
}

export function recordJobPayment(id, { paymentMode, reference }) {
  return apiClient.patch(`/jobs/${id}/payment`, { paymentMode, reference }).then((r) => r.data)
}

export function notifyHr(id) {
  return apiClient.post(`/jobs/${id}/notify-hr`).then((r) => r.data)
}
