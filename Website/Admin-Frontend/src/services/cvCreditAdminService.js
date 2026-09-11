import { apiClient } from '../lib/api'

export function creditSummary() {
  return apiClient.get('/cv-credits/summary').then((r) => r.data)
}

export function listCreditPurchases(params = {}) {
  return apiClient.get('/cv-credits/purchases', { params: { limit: 100, ...params } }).then((r) => r.data)
}

export function listCvUnlocks(params = {}) {
  return apiClient.get('/cv-credits/unlocks', { params: { limit: 100, ...params } }).then((r) => r.data)
}

export function listCreditLedger(params = {}) {
  return apiClient.get('/cv-credits/ledger', { params: { limit: 100, ...params } }).then((r) => r.data)
}

export function adjustCredits({ companyId, delta, reason }) {
  return apiClient.post('/cv-credits/adjust', { companyId, delta, reason }).then((r) => r.data)
}

export function listCreditPlans() {
  return apiClient.get('/cv-credits/plans').then((r) => r.data)
}

export function createCreditPlan(input) {
  return apiClient.post('/cv-credits/plans', input).then((r) => r.data)
}

export function updateCreditPlan(id, input) {
  return apiClient.patch(`/cv-credits/plans/${id}`, input).then((r) => r.data)
}
