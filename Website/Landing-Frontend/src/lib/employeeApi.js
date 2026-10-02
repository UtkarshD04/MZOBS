import { EMPLOYEE_API_URL } from './config'

async function request(path, { method = 'GET', token, body, isFormData } = {}) {
  const headers = {}
  if (token) headers.Authorization = `Bearer ${token}`
  if (!isFormData && body !== undefined) headers['Content-Type'] = 'application/json'

  const res = await fetch(`${EMPLOYEE_API_URL}${path}`, {
    method,
    headers,
    body: body === undefined ? undefined : isFormData ? body : JSON.stringify(body),
  })
  const data = await res.json().catch(() => ({}))
  // `code` (e.g. FREE_APPLICATION_LIMIT_REACHED) lets callers react to a specific refusal.
  if (!res.ok) throw Object.assign(new Error(data.message ?? 'Something went wrong. Please try again.'), { status: res.status, code: data.code })
  return data
}

// Full employee document — subscription.status and resume.status are what
// the inline apply flow gates on.
export function fetchEmployeeProfile(token) {
  return request('/profile', { token })
}

export function uploadEmployeeResume(token, file) {
  const formData = new FormData()
  formData.append('resume', file)
  return request('/resume', { method: 'POST', token, body: formData, isFormData: true })
}

export function applyToJob(token, jobId) {
  return request('/applications', { method: 'POST', token, body: { jobId } })
}

// How many applications this employee has sent — read off the paginated
// list's X-Total-Count header, so only one row is ever transferred.
export async function fetchApplicationCount(token, { signal } = {}) {
  const res = await fetch(`${EMPLOYEE_API_URL}/applications?limit=1`, { headers: { Authorization: `Bearer ${token}` }, signal })
  if (!res.ok) throw new Error('Failed to load applications')
  const total = Number(res.headers.get('X-Total-Count'))
  if (Number.isFinite(total)) return total
  const rows = await res.json()
  return Array.isArray(rows) ? rows.length : 0
}

// One page of this employee's applications, newest first, each with its job
// (title/location/workMode/company) populated. `total` is the full count.
export async function fetchApplications(token, { page = 1, limit = 50 } = {}, { signal } = {}) {
  const res = await fetch(`${EMPLOYEE_API_URL}/applications?page=${page}&limit=${limit}`, { headers: { Authorization: `Bearer ${token}` }, signal })
  const data = await res.json().catch(() => [])
  if (!res.ok) throw Object.assign(new Error(data.message ?? 'Couldn’t load your applications.'), { status: res.status })
  const total = Number(res.headers.get('X-Total-Count'))
  return { applications: data, total: Number.isFinite(total) ? total : data.length }
}

export function withdrawApplication(token, id) {
  return request(`/applications/${encodeURIComponent(id)}/withdraw`, { method: 'PATCH', token })
}

// Interviews employers have scheduled with this employee (soonest first).
export function fetchInterviews(token) {
  return request('/interviews', { token })
}

// The latest MZOBS mock interview — `{ status: 'not_scheduled' }` when none.
export function fetchMockInterview(token) {
  return request('/mock-interview', { token })
}
