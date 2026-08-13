import { apiClient } from '../lib/api'

export function listOffers() {
  return apiClient.get('/offers').then((r) => r.data)
}

export function createOffer(input) {
  return apiClient.post('/offers', input).then((r) => r.data)
}

export function updateOfferStatus(id, status) {
  return apiClient.patch(`/offers/${id}/status`, { status }).then((r) => r.data)
}
