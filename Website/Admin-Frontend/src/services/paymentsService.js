import { apiClient } from '../lib/api'

export function listPayments(params = {}) {
  return apiClient.get('/payments', { params: { limit: 100, ...params } }).then((r) => r.data)
}

export function recordSubscriptionPayment(employeeId) {
  return apiClient.patch(`/payments/subscriptions/${employeeId}`).then((r) => r.data)
}

export function getSubscriptionTrend(params) {
  return apiClient.get('/payments/subscriptions/trend', { params }).then((r) => r.data)
}

export function getEmployerRevenueTrend(params) {
  return apiClient.get('/payments/employer/trend', { params }).then((r) => r.data)
}
