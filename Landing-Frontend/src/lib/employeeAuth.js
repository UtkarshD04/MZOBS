import { EMPLOYEE_API_URL } from './config'

async function postJSON(path, body) {
  const res = await fetch(`${EMPLOYEE_API_URL}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(data.message ?? 'Something went wrong. Please try again.')
  return data
}

export function loginEmployee({ email, password }) {
  return postJSON('/auth/login', { email, password })
}

export function signupEmployee({ name, email, password, experience, graduation }) {
  return postJSON('/auth/signup', { name, email, password, experience, graduation })
}
