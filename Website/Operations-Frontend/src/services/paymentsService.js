import { apiClient } from '../lib/api'

export function listPayments(params = {}) {
  return apiClient.get('/payments', { params: { limit: 100, ...params } }).then((r) => r.data)
}

export function recordSubscriptionPayment(employeeId) {
  return apiClient.patch(`/payments/subscriptions/${employeeId}`).then((r) => r.data)
}
