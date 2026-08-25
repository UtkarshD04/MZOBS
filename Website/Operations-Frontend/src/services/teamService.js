import { apiClient } from '../lib/api'

export function listTeam() {
  return apiClient.get('/team').then((r) => r.data)
}
