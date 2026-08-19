import { apiClient } from '../lib/api'

export function listTeam() {
  return apiClient.get('/team').then((r) => r.data)
}

export function createTeammate({ name, email, role }) {
  return apiClient.post('/team', { name, email, role }).then((r) => r.data)
}
