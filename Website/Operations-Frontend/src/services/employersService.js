import { apiClient } from '../lib/api'

export function listEmployers(params = {}) {
  return apiClient.get('/employers', { params: { limit: 200, ...params } }).then((r) => r.data)
}
