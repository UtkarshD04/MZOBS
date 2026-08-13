import { apiClient } from '../lib/api'

export function getSubscription() {
  return apiClient.get('/subscription').then((r) => r.data)
}

export function paySubscription() {
  return apiClient.post('/subscription/pay').then((r) => r.data)
}
