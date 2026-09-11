import { apiClient } from '../lib/api'

export function listCoupons(params = {}) {
  return apiClient.get('/coupons', { params }).then((r) => r.data)
}

export function createCoupon(input) {
  return apiClient.post('/coupons', input).then((r) => r.data)
}

export function updateCoupon(id, input) {
  return apiClient.patch(`/coupons/${id}`, input).then((r) => r.data)
}

export function deleteCoupon(id) {
  return apiClient.delete(`/coupons/${id}`).then((r) => r.data)
}
