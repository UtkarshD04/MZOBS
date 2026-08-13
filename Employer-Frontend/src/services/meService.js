import { apiClient } from '../lib/api'

export function getMe() {
  return apiClient.get('/auth/me').then((r) => r.data)
}

export function updateMe(input) {
  return apiClient.put('/auth/me', input).then((r) => r.data)
}
