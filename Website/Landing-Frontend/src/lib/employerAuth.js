import { EMPLOYER_API_URL, EMPLOYER_APP_URL } from './config'

async function postJSON(path, body, token) {
  const headers = { 'Content-Type': 'application/json' }
  if (token) headers.Authorization = `Bearer ${token}`
  const res = await fetch(`${EMPLOYER_API_URL}${path}`, {
    method: 'POST',
    headers,
    body: JSON.stringify(body),
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(data.message ?? 'Something went wrong. Please try again.')
  return data
}

export function loginEmployer({ email, password }) {
  return postJSON('/auth/login', { email, password })
}

export function signupEmployer({ companyName, name, email, phone, password, industry, size, website, hq, phoneToken }) {
  return postJSON('/auth/signup', { companyName, name, email, phone, password, industry, size, website, hq, phoneToken })
}

export function loginEmployerWithGoogle({ credential }) {
  return postJSON('/auth/google-login', { credential })
}

export function signupEmployerWithGoogle({ credential, companyName, phone, industry, size, website, hq, phoneToken }) {
  return postJSON('/auth/google-signup', { credential, companyName, phone, industry, size, website, hq, phoneToken })
}

export function forgotPasswordEmployer({ email }) {
  return postJSON('/auth/forgot-password', { email })
}

export function resetPasswordEmployer({ token, password }) {
  return postJSON('/auth/reset-password', { token, password })
}

// MSG91 widget verifies the OTP itself client-side and hands back an
// access-token — this exchanges that for a short-lived phoneToken, after
// the backend confirms it with MSG91 server-to-server.
export function verifyEmployerPhoneWidget({ phone, accessToken }) {
  return postJSON('/auth/verify-phone-widget', { phone, accessToken })
}

// The pricing-page "pay, no signup form" flow: order first (no account
// needed yet)...
export function createGuestSubscriptionOrder() {
  return postJSON('/subscription/guest-order', {})
}

// ...then this single call both settles the payment and creates the
// Company + Admin account, returning a normal login token plus a one-time
// generated password (the account has no email the visitor chose, so this
// is their only way back in without the token).
export function guestSubscribeSignup({ phone, phoneToken, razorpay_order_id, razorpay_payment_id, razorpay_signature, mockOrderId }) {
  return postJSON('/subscription/guest-verify', { phone, phoneToken, razorpay_order_id, razorpay_payment_id, razorpay_signature, mockOrderId })
}

// A long-lived JWT in a redirect URL leaks into browser history, server
// access logs, Referer headers and analytics — so instead of handing the
// dashboard app the real token via `?token=`, trade it for a one-time,
// 60-second code via `?code=`. The dashboard exchanges that for the real
// token itself right after load.
export async function redirectToEmployerDashboard(token) {
  const { code } = await postJSON('/auth/handoff', {}, token)
  window.location.href = `${EMPLOYER_APP_URL}/dashboard?code=${encodeURIComponent(code)}`
}
