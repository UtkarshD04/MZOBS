import axios from 'axios'
import { apiClient } from '../lib/api'

export function listServiceRequests(params = {}) {
  return apiClient.get('/premium-services', { params: { limit: 200, ...params } }).then((r) => r.data)
}

export function getServiceRequestStats() {
  return apiClient.get('/premium-services/stats').then((r) => r.data)
}

export function updateServiceRequest(id, input) {
  return apiClient.patch(`/premium-services/${id}`, input).then((r) => r.data)
}

// The public plan (service labels/descriptions) lives on the employee API —
// same Backend origin, so it's derived from this portal's staff base URL.
export function getPremiumPlan() {
  const base = apiClient.defaults.baseURL.replace(/\/staff\/?$/, '/employee')
  return axios.get(`${base}/subscription/plan`).then((r) => r.data)
}
