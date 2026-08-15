import { apiClient } from '../lib/api'

export function getSubscription() {
  return apiClient.get('/subscription').then((r) => r.data)
}

export function createSubscriptionOrder() {
  return apiClient.post('/subscription/order').then((r) => r.data)
}

export function verifySubscriptionPayment(payload) {
  return apiClient.post('/subscription/verify', payload).then((r) => r.data)
}
