import { apiClient } from '../lib/api'

export const listShortlistRequests = (params = {}) => apiClient.get('/managed-shortlists', { params }).then((r) => r.data)
export const listRequestCandidates = (id) => apiClient.get(`/managed-shortlists/${id}/candidates`).then((r) => r.data)
export const updateShortlistRequest = (id, body) => apiClient.patch(`/managed-shortlists/${id}`, body).then((r) => r.data)
