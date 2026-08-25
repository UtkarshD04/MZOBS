import { apiClient } from '../lib/api'

export function listNotifications() {
  return apiClient.get('/notifications').then((r) => r.data)
}

export function markAsRead(id) {
  return apiClient.patch(`/notifications/${id}/read`).then((r) => r.data)
}

export function markAllRead() {
  return apiClient.patch('/notifications/read-all').then((r) => r.data)
}

export function sendTestPushNotification() {
  return apiClient.post('/notifications/test-push').then((r) => r.data)
}
