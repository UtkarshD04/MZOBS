import { apiClient } from '../lib/api'

export function loginStaff({ email, password }) {
  return apiClient.post('/auth/login', { email, password }).then((r) => r.data)
}

export function signupStaff({ name, email, password, role }) {
  return apiClient.post('/auth/signup', { name, email, password, role }).then((r) => r.data)
}

export function getMe() {
  return apiClient.get('/auth/me').then((r) => r.data)
}

export function forgotPasswordStaff({ email }) {
  return apiClient.post('/auth/forgot-password', { email }).then((r) => r.data)
}

export function resetPasswordStaff({ token, password }) {
  return apiClient.post('/auth/reset-password', { token, password }).then((r) => r.data)
}
