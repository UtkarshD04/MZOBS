import { apiClient } from '../lib/api'

export function getResume() {
  return apiClient.get('/resume').then((r) => r.data)
}

export function uploadResume(file) {
  const formData = new FormData()
  formData.append('resume', file)
  return apiClient.post('/resume', formData, { headers: { 'Content-Type': 'multipart/form-data' } }).then((r) => r.data)
}
