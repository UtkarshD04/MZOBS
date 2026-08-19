import { apiClient } from '../lib/api'

export function submitTicket(input) {
  return apiClient.post('/support/tickets', input).then((r) => r.data)
}
