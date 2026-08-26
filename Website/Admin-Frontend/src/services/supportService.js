import { apiClient } from '../lib/api'

export function listTickets(params = {}) {
  return apiClient.get('/support', { params: { limit: 200, ...params } }).then((r) => r.data)
}

export function respondTicket(id, { status, reply }) {
  return apiClient.patch(`/support/${id}`, { status, reply }).then((r) => r.data)
}
