import { apiClient } from '../lib/api'

export function listShortlisted(params = {}) {
  return apiClient.get('/shortlist', { params: { limit: 200, ...params } }).then((r) => r.data)
}
