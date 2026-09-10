import { apiClient } from '../lib/api'

export function getSubscription() {
  return apiClient.get('/subscription').then((r) => r.data)
}

export function getAccessStatus() {
  return apiClient.get('/subscription/access-status').then((r) => r.data)
}

export function createSubscriptionOrder() {
  return apiClient.post('/subscription/order').then((r) => r.data)
}

export function verifySubscriptionPayment(payload) {
  return apiClient.post('/subscription/verify-payment', payload).then((r) => r.data)
}

export function confirmMockSubscriptionPayment(orderId) {
  return apiClient.post('/subscription/mock-confirm', { orderId }).then((r) => r.data)
}

export function listSubscriptionPayments() {
  return apiClient.get('/payments').then((r) => r.data)
}
