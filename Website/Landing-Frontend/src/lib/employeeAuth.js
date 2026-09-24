import { EMPLOYEE_API_URL } from './config'

async function postJSON(path, body, token) {
  const headers = { 'Content-Type': 'application/json' }
  if (token) headers.Authorization = `Bearer ${token}`
  const res = await fetch(`${EMPLOYEE_API_URL}${path}`, {
    method: 'POST',
    headers,
    body: JSON.stringify(body),
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    const error = new Error(data.message ?? 'Something went wrong. Please try again.')
    error.status = res.status
    throw error
  }
  return data
}

// A long-lived JWT in a redirect URL leaks into browser history, server
// access logs, Referer headers and analytics — so instead of handing the
// dashboard app the real token via `?token=`, trade it for a one-time,
// 60-second code via `?code=`. The dashboard exchanges that for the real
// token itself right after load.
export async function createEmployeeHandoffCode(token) {
  const { code } = await postJSON('/auth/handoff', {}, token)
  return code
}

export function loginEmployee({ email, password }) {
  return postJSON('/auth/login', { email, password })
}

export function signupEmployee({ name, email, phone, password, experience, graduation, city, state, pincode, paymentOrderId, phoneToken, emailToken }) {
  return postJSON('/auth/signup', { name, email, phone, password, experience, graduation, city, state, pincode, paymentOrderId, phoneToken, emailToken })
}

// Logs an *existing* account in using nothing but a verified phoneToken — no
// password. A 404 just means this number isn't registered yet, which the
// phone-first auth flow reads as "show the signup details step".
export function phoneLoginEmployee({ phone, phoneToken }) {
  return postJSON('/auth/phone-login', { phone, phoneToken })
}

// Email sign-in: send a 6-digit code, verify it (returns a short-lived emailToken), then
// emailLoginEmployee opens the account for that address. A 404 means no account uses it
// yet, which the auth form reads as "collect name + mobile number".
export function sendEmployeeEmailOtp({ email }) {
  return postJSON('/auth/send-email-otp', { email })
}

export function verifyEmployeeEmailOtp({ email, otp }) {
  return postJSON('/auth/verify-email-otp', { email, otp })
}

export function emailLoginEmployee({ email, emailToken }) {
  return postJSON('/auth/email-login', { email, emailToken })
}

export function loginEmployeeWithGoogle({ credential }) {
  return postJSON('/auth/google-login', { credential })
}

export function signupEmployeeWithGoogle({ credential, phone, experience, graduation, city, state, pincode, paymentOrderId, phoneToken }) {
  return postJSON('/auth/google-signup', { credential, phone, experience, graduation, city, state, pincode, paymentOrderId, phoneToken })
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
