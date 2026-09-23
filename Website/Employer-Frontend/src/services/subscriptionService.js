import { apiClient } from '../lib/api'

export function getSubscription() {
  return apiClient.get('/subscription').then((r) => r.data)
}

export function getAccessStatus() {
  return apiClient.get('/subscription/access-status').then((r) => r.data)
}

export function createSubscriptionOrder(planCode, couponCode) {
  return apiClient.post('/subscription/order', couponCode ? { planCode, couponCode } : { planCode }).then((r) => r.data)
}

// Prices a coupon against a specific plan tier without creating an order —
// used to show the discount as soon as the employer types a code.
export function previewSubscriptionCoupon(planCode, code) {
  return apiClient.post('/subscription/coupon/preview', { planCode, code }).then((r) => r.data)
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
