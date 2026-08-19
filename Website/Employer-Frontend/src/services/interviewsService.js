import { apiClient } from '../lib/api'

export function listInterviews() {
  return apiClient.get('/interviews').then((r) => r.data)
}

export function scheduleInterview(input) {
  return apiClient.post('/interviews', input).then((r) => r.data)
}

export function rescheduleInterview(id, startsAt) {
  return apiClient.patch(`/interviews/${id}/reschedule`, { startsAt }).then((r) => r.data)
}

export function cancelInterview(id) {
  return apiClient.patch(`/interviews/${id}/cancel`).then((r) => r.data)
}

export function submitFeedback(id, feedback) {
  return apiClient.post(`/interviews/${id}/feedback`, { feedback }).then((r) => r.data)
}
