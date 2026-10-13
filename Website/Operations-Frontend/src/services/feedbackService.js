import { apiClient } from '../lib/api'

// Rejection-feedback review queues, follow-ups and actions (admin-only on the API).
const BASE = '/rejection-feedback'
const clean = (params = {}) => Object.fromEntries(Object.entries(params).filter(([, v]) => v !== '' && v !== null && v !== undefined))

// → { rows, total } — filtering, search and paging all happen on the server.
export function listFeedback(params) {
  return apiClient.get(BASE, { params: clean(params) }).then((r) => ({ rows: r.data, total: Number(r.headers['x-total-count'] ?? r.data.length) }))
}
export const getFeedbackCounts = () => apiClient.get(`${BASE}/counts`).then((r) => r.data)
export const getFeedbackFilters = () => apiClient.get(`${BASE}/filters`).then((r) => r.data)
export const getFeedback = (id) => apiClient.get(`${BASE}/${id}`).then((r) => r.data)
export const reviewFeedback = (id, body) => apiClient.post(`${BASE}/${id}/review`, body).then((r) => r.data)
export const addFeedbackNote = (id, text) => apiClient.post(`${BASE}/${id}/notes`, { text }).then((r) => r.data)
export const retryFeedbackNotification = (id) => apiClient.post(`${BASE}/${id}/retry-notification`).then((r) => r.data)
export const resolveFeedbackDispute = (id, body) => apiClient.post(`${BASE}/${id}/resolve-dispute`, body).then((r) => r.data)

export function listFollowUps(params) {
  return apiClient.get(`${BASE}/follow-ups`, { params: clean(params) }).then((r) => ({ rows: r.data, total: Number(r.headers['x-total-count'] ?? r.data.length) }))
}
export const notifyFollowUp = (id) => apiClient.post(`${BASE}/follow-ups/${id}/notify`).then((r) => r.data)
export const recordFollowUpContact = (id, body) => apiClient.post(`${BASE}/follow-ups/${id}/contact`, body).then((r) => r.data)
export const addFollowUpNote = (id, text) => apiClient.post(`${BASE}/follow-ups/${id}/notes`, { text }).then((r) => r.data)
export const setFollowUpNext = (id, nextFollowUpAt) => apiClient.patch(`${BASE}/follow-ups/${id}/next`, { nextFollowUpAt }).then((r) => r.data)
export const completeFollowUp = (id) => apiClient.post(`${BASE}/follow-ups/${id}/complete`).then((r) => r.data)
