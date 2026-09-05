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

export function signupEmployee({ name, email, phone, password, experience, graduation, paymentOrderId, phoneToken }) {
  return postJSON('/auth/signup', { name, email, phone, password, experience, graduation, paymentOrderId, phoneToken })
}

export function loginEmployeeWithGoogle({ credential }) {
  return postJSON('/auth/google-login', { credential })
}

export function signupEmployeeWithGoogle({ credential, phone, experience, graduation, paymentOrderId, phoneToken }) {
  return postJSON('/auth/google-signup', { credential, phone, experience, graduation, paymentOrderId, phoneToken })
}

// The MSG91 widget verifies the OTP itself client-side and hands back an
// access-token — this exchanges that token for our own short-lived
// phoneToken, after the backend confirms it with MSG91 server-to-server.
export function verifyEmployeePhoneWidget({ phone, accessToken }) {
  return postJSON('/auth/verify-phone-widget', { phone, accessToken })
}

export function forgotPasswordEmployee({ email }) {
  return postJSON('/auth/forgot-password', { email })
}

export function resetPasswordEmployee({ token, password }) {
  return postJSON('/auth/reset-password', { token, password })
}
