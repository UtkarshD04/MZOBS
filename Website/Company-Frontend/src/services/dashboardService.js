import { apiClient } from '../lib/api'

export function getDashboard() {
  return apiClient.get('/dashboard').then((r) => r.data)
}
