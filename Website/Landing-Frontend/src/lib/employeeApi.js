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
  if (!res.ok) throw new Error(data.message ?? 'Something went wrong. Please try again.')
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
