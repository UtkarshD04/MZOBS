import { apiClient } from '../lib/api'

// Rejection-feedback review queue (admin-only on the API).
export function listFeedback(status) {
  return apiClient.get('/rejection-feedback', { params: { limit: 100, ...(status ? { status } : {}) } }).then((r) => r.data)
}

export function getFeedbackCounts() {
  return apiClient.get('/rejection-feedback/counts').then((r) => r.data)
}

export function getFeedback(id) {
  return apiClient.get(`/rejection-feedback/${id}`).then((r) => r.data)
}

export function reviewFeedback(id, body) {
  return apiClient.post(`/rejection-feedback/${id}/review`, body).then((r) => r.data)
}

export function resolveFeedbackDispute(id, body) {
  return apiClient.post(`/rejection-feedback/${id}/resolve-dispute`, body).then((r) => r.data)
}
