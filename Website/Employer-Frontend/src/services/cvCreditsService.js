import { apiClient } from '../lib/api'

export function getCreditBalance() {
  return apiClient.get('/credits').then((r) => r.data)
}

export function listCreditPlans() {
  return apiClient.get('/plans').then((r) => r.data)
}

export function listCreditPurchases() {
  return apiClient.get('/credits/purchases').then((r) => r.data)
}

export function createCvCreditOrder(planId, couponCode) {
  return apiClient.post('/payments/create-order', couponCode ? { planId, couponCode } : { planId }).then((r) => r.data)
}

// Prices a coupon against a specific plan without creating an order — used
// to show the discount as soon as the employer types a code.
export function previewCvCreditCoupon(planId, code) {
  return apiClient.post('/payments/coupon/preview', { planId, code }).then((r) => r.data)
}

export function verifyCvCreditPayment(payload) {
  return apiClient.post('/payments/verify', payload).then((r) => r.data)
}

export function confirmMockCvCreditPayment(orderId) {
  return apiClient.post('/payments/mock-confirm', { orderId }).then((r) => r.data)
}

export function listUnlocks() {
  return apiClient.get('/unlocks').then((r) => r.data)
}

/** Spends 1 credit on first call for this candidate; free + idempotent on every call after. */
export function unlockCandidate(candidateId) {
  return apiClient.post(`/candidates/${candidateId}/unlock`).then((r) => r.data)
}
