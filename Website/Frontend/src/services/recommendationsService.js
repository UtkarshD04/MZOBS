import { apiClient } from '../lib/api'

export function getRecommendedJobs(sort = 'match', signal) {
  return apiClient.get('/jobs/recommended', { params: { sort }, signal }).then((r) => r.data)
}
