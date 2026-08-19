import { apiClient } from '../lib/api'

export function listBatches() {
  return apiClient.get('/batches').then((r) => r.data)
}

export function getBatch(id) {
  return apiClient.get(`/batches/${id}`).then((r) => r.data)
}
