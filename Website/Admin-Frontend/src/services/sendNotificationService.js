import { apiClient } from '../lib/api'

export function listRecipients({ audience, search }) {
  return apiClient.get('/notifications/recipients', { params: { audience, search: search || undefined } }).then((r) => r.data)
}

export function sendNotification({ audience, recipientIds, broadcast, title, body }) {
  return apiClient.post('/notifications/send', { audience, recipientIds, broadcast, title, body }).then((r) => r.data)
}
