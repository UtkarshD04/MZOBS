import { EMPLOYEE_API_URL } from './config'

async function call(path, { token, method = 'GET', body, signal } = {}) {
  const headers = {}
  if (token) headers.Authorization = `Bearer ${token}`
  if (body !== undefined) headers['Content-Type'] = 'application/json'
  const res = await fetch(`${EMPLOYEE_API_URL}${path}`, { method, headers, body: body === undefined ? undefined : JSON.stringify(body), signal })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw Object.assign(new Error(data.message ?? 'Something went wrong. Please try again.'), { status: res.status, code: data.code })
  return data
}

// Public — { basic, premium, groups: [{ key, label, features }], services }.
// The single source of truth is Backend's config/premiumPlan.js.
export function fetchPlan({ signal } = {}) {
  return call('/subscription/plan', { signal })
}

// The signed-in candidate's Premium service requests, newest first.
export function fetchServiceRequests(token, { signal } = {}) {
  return call('/premium-services', { token, signal })
}

export function requestService(token, { service, note, preferredTime }) {
  return call('/premium-services', { token, method: 'POST', body: { service, note, preferredTime } })
}

export function cancelServiceRequest(token, id) {
  return call(`/premium-services/${encodeURIComponent(id)}/cancel`, { token, method: 'PATCH' })
}
