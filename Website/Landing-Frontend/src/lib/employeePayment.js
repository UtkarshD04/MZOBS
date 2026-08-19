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

// Guest checkout — creates and verifies the ₹99 order before an account
// exists. The verified order id gets handed to signupEmployee(), which
// claims it onto the new account.
export function createGuestSubscriptionOrder() {
  return postJSON('/subscription/guest-order', {})
}

export function verifyGuestSubscriptionPayment(payload) {
  return postJSON('/subscription/guest-verify', payload)
}

// Dev/testing shortcut used when the order came back with mock: true
// (Razorpay isn't configured on the server) — skips the Checkout widget
// entirely and just confirms the simulated order.
export function confirmGuestMockSubscriptionPayment(orderId) {
  return postJSON('/subscription/guest-mock-confirm', { orderId })
}
