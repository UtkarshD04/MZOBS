import { apiClient } from '../lib/api'

export function getMockInterviewStats() {
  return apiClient.get('/mock-interviews/stats').then((r) => r.data)
}
