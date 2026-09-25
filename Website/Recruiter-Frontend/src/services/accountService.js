// Notifications and support on the existing employer API:
//   GET /notifications · PATCH /notifications/:id/read · PATCH /notifications/read-all
//   POST /support/tickets  { subject, category, message }
import { apiClient } from '../lib/api'
import { IS_DEMO } from '../lib/config'

export const listNotifications = () => (IS_DEMO ? Promise.resolve([]) : apiClient.get('/notifications').then((r) => r.data))
export const markRead = (id) => apiClient.patch(`/notifications/${id}/read`)
export const markAllRead = () => apiClient.patch('/notifications/read-all')
export const submitTicket = (body) => apiClient.post('/support/tickets', body).then((r) => r.data)

// Where a notification's category leads inside the recruiter portal.
export const NOTIFICATION_ROUTES = {
  jobs: '/jobs',
  candidates: '/',
  batches: '/',
  interviews: '/interviews',
  offers: '/interviews',
  billing: '/credits',
  system: null,
}

export const TICKET_CATEGORIES = ['General', 'Billing', 'Candidate Quality', 'Technical Issue', 'Payment', 'Resume Verification']
