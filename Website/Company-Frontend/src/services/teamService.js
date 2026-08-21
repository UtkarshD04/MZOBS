import { apiClient } from '../lib/api'

export function listTeam() {
  return apiClient.get('/team').then((r) => r.data)
}

export function createTeammate({ name, email, role, accessLevel }) {
  return apiClient.post('/team', { name, email, role, accessLevel }).then((r) => r.data)
}

export function updateTeammate(id, { accessLevel, status }) {
  return apiClient.patch(`/team/${id}`, { accessLevel, status }).then((r) => r.data)
}
