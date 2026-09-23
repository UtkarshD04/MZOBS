import { apiClient } from '../lib/api'

// Resdex-style resume database search — every candidate on the platform,
// not just applicants to this company's own postings (that's
// candidatesService.js). Reads pagination off headers (X-Total-Count/
// X-Page/X-Limit), same contract as every other paginated employer list.
export async function searchResumeDatabase(filters = {}) {
  const res = await apiClient.get('/resume-search', { params: filters })
  return {
    data: res.data,
    total: Number(res.headers['x-total-count'] ?? res.data.length),
    page: Number(res.headers['x-page'] ?? filters.page ?? 1),
    limit: Number(res.headers['x-limit'] ?? filters.limit ?? res.data.length),
  }
}

export function getResumeDatabaseCandidate(employeeId) {
  return apiClient.get(`/resume-search/${employeeId}`).then((r) => r.data)
}

/** jobId is only required the first time this employee is unlocked (see backend comment). */
export function unlockResumeSearchCandidate(employeeId, jobId) {
  return apiClient.post(`/resume-search/${employeeId}/unlock`, jobId ? { jobId } : {}).then((r) => r.data)
}
