import { apiClient } from '../lib/api'

export function getCompany() {
  return apiClient.get('/company').then((r) => r.data)
}

export function updateCompany(input) {
  return apiClient.put('/company', input).then((r) => r.data)
}
