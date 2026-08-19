import { apiClient } from '../lib/api'

export function listCandidates(filters = {}) {
  return apiClient.get('/candidates', { params: filters }).then((r) => r.data)
}

export function getCandidate(id) {
  return apiClient.get(`/candidates/${id}`).then((r) => r.data)
}

export function setCandidateStage(id, stage, rejectionReason) {
  return apiClient.patch(`/candidates/${id}/stage`, { stage, rejectionReason }).then((r) => r.data)
}
