import { apiClient } from '../lib/api'

export function listTeam() {
  return apiClient.get('/team').then((r) => r.data)
}

export function inviteMember(input) {
  return apiClient.post('/team/invite', input).then((r) => r.data)
}

export function updateMemberRole(id, role) {
  return apiClient.patch(`/team/${id}/role`, { role }).then((r) => r.data)
}

export function removeMember(id) {
  return apiClient.delete(`/team/${id}`).then((r) => r.data)
}
