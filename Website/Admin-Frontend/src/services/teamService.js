import { apiClient } from '../lib/api'

export function listTeam(params = {}) {
  return apiClient.get('/team', { params }).then((r) => r.data)
}

export function createTeammate({ name, email, password, role, accessLevel }) {
  return apiClient.post('/team', { name, email, password, role, accessLevel }).then((r) => r.data)
}

export function updateTeammate(id, { name, email, role, accessLevel, status }) {
  return apiClient.patch(`/team/${id}`, { name, email, role, accessLevel, status }).then((r) => r.data)
}

export function resetTeammatePassword(id, password) {
  return apiClient.post(`/team/${id}/reset-password`, { password }).then((r) => r.data)
}

export function deleteTeammate(id) {
  return apiClient.delete(`/team/${id}`).then((r) => r.data)
}
