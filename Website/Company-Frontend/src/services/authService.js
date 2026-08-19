import { apiClient } from '../lib/api'

export function loginStaff({ email, password }) {
  return apiClient.post('/auth/login', { email, password }).then((r) => r.data)
}

export function getMe() {
  return apiClient.get('/auth/me').then((r) => r.data)
}
