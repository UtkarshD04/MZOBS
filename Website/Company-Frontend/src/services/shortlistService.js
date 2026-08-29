import { apiClient } from '../lib/api'

export function listShortlisted(params = {}) {
  return apiClient.get('/shortlist', { params: { limit: 200, ...params } }).then((r) => r.data)
}

export function transferToOperations(employeeId) {
  return apiClient.patch(`/shortlist/${employeeId}/transfer`).then((r) => r.data)
}

export function bulkTransferToOperations(employeeIds) {
  return apiClient.patch('/shortlist/transfer', { employeeIds }).then((r) => r.data)
}
