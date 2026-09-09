import { apiClient } from '../lib/api'

// Bare-array response, used where callers just want "the jobs" with no
// pagination UI (e.g. Dashboard's recommended-jobs widget).
export function listJobs(params = {}, signal) {
  return apiClient.get('/jobs', { params, signal }).then((r) => r.data)
}

// Same endpoint, surfaced with its pagination headers — used by the job
// board, which renders page controls and a "N jobs found" summary.
export function listJobsPage(params = {}, signal) {
  return apiClient.get('/jobs', { params, signal }).then((r) => ({
    jobs: r.data,
    total: Number(r.headers['x-total-count'] ?? r.data.length),
    page: Number(r.headers['x-page'] ?? 1),
    limit: Number(r.headers['x-limit'] ?? r.data.length),
  }))
}

export function getJob(id, signal) {
  return apiClient.get(`/jobs/${id}`, { signal }).then((r) => r.data)
}

export function getJobFacets(params = {}, signal) {
  return apiClient.get('/jobs/facets', { params, signal }).then((r) => r.data)
}

// type: 'title' | 'location'. Returns { type, query, items: [{ value, count, source }] }.
export function getJobSuggestions(params = {}, signal) {
  return apiClient.get('/jobs/suggestions', { params, signal }).then((r) => r.data)
}

export function getAppliedBasedJobs(signal) {
  return apiClient.get('/jobs/based-on-applies', { signal }).then((r) => r.data)
}

export function getInstantHiringJobs(signal) {
  return apiClient.get('/jobs/instant-hiring', { signal }).then((r) => r.data)
}
