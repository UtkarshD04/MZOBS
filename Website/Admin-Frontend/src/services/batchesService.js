import { apiClient } from '../lib/api'

export function listBatches(params = {}) {
  return apiClient.get('/batches', { params: { limit: 200, ...params } }).then((r) => r.data)
}

export function getBatch(id) {
  return apiClient.get(`/batches/${id}`).then((r) => r.data)
}

export function listEligibleApplications(batchId) {
  return apiClient.get(`/batches/${batchId}/eligible-applications`).then((r) => r.data)
}

export function dispatchBatch(batchId, applicationIds) {
  return apiClient.patch(`/batches/${batchId}/dispatch`, { applicationIds }).then((r) => r.data)
}
