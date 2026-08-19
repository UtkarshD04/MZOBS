import { apiClient } from '../lib/api'

export function listJobs(filters = {}) {
  return apiClient.get('/jobs', { params: filters }).then((r) => r.data)
}

export function getJob(id) {
  return apiClient.get(`/jobs/${id}`).then((r) => r.data)
}

export function createJob(input) {
  return apiClient.post('/jobs', input).then((r) => r.data)
}

export function updateJob(id, input) {
  return apiClient.put(`/jobs/${id}`, input).then((r) => r.data)
}

export function setJobStatus(id, status) {
  return apiClient.patch(`/jobs/${id}/status`, { status }).then((r) => r.data)
}

/** Paying the per-opening invoice is what releases a requirement into sourcing. */
export function createJobPaymentOrder(id) {
  return apiClient.post(`/jobs/${id}/pay/order`).then((r) => r.data)
}

export function verifyJobPayment(id, payload) {
  return apiClient.post(`/jobs/${id}/pay/verify`, payload).then((r) => r.data)
}

export function duplicateJob(id) {
  return apiClient.post(`/jobs/${id}/duplicate`).then((r) => r.data)
}

export function deleteJob(id) {
  return apiClient.delete(`/jobs/${id}`).then((r) => r.data)
}
