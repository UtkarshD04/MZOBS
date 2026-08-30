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

export function signupEmployee({ name, email, phone, password, experience, graduation, paymentOrderId }) {
  return postJSON('/auth/signup', { name, email, phone, password, experience, graduation, paymentOrderId })
}

export function loginEmployeeWithGoogle({ credential }) {
  return postJSON('/auth/google-login', { credential })
}

export function signupEmployeeWithGoogle({ credential, phone, experience, graduation, paymentOrderId }) {
  return postJSON('/auth/google-signup', { credential, phone, experience, graduation, paymentOrderId })
}

export function forgotPasswordEmployee({ email }) {
  return postJSON('/auth/forgot-password', { email })
}

export function resetPasswordEmployee({ token, password }) {
  return postJSON('/auth/reset-password', { token, password })
}
