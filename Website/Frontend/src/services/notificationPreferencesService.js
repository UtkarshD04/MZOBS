import { apiClient } from '../lib/api'

export function getNotificationPreferences() {
  return apiClient.get('/notification-preferences').then((r) => r.data)
}

export function updateNotificationPreferences(patch) {
  return apiClient.put('/notification-preferences', patch).then((r) => r.data)
}
