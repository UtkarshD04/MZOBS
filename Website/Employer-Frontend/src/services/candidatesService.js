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

/** Requires an active employer plan — 403s with EMPLOYER_SUBSCRIPTION_REQUIRED otherwise. */
export function getCandidatePrivateDetails(id) {
  return apiClient.get(`/candidates/${id}/private-details`).then((r) => r.data)
}

/** Mints a fresh, short-lived resume link. Requires an active employer plan. */
export function getCandidateResumeUrl(id) {
  return apiClient.get(`/candidates/${id}/resume-url`).then((r) => r.data)
}
