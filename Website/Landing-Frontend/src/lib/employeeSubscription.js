import { EMPLOYEE_API_URL } from './config'

async function authedJSON(path, token, options = {}) {
  const res = await fetch(`${EMPLOYEE_API_URL}${path}`, {
    ...options,
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}`, ...(options.headers ?? {}) },
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    const error = new Error(data.message ?? 'Something went wrong. Please try again.')
    error.status = res.status
    throw error
  }
  return data
}

export function createSubscriptionOrder(token, couponCode) {
  return authedJSON('/subscription/order', token, { method: 'POST', body: JSON.stringify({ couponCode: couponCode || undefined }) })
}

// No auth required (see Backend's employeeSubscriptionRoutes.js) — previews
// the discount a coupon would apply before an order is created, so the
// price can update as soon as the code is typed in.
export async function previewSubscriptionCoupon(code) {
  const res = await fetch(`${EMPLOYEE_API_URL}/subscription/coupon/preview`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ code }),
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok || !data.valid) {
    const error = new Error(data.message ?? 'Invalid coupon code')
    error.status = res.status
    throw error
  }
  return data
}

export function verifySubscriptionPayment(token, payload) {
  return authedJSON('/subscription/verify', token, { method: 'POST', body: JSON.stringify(payload) })
}

// Dev/testing shortcut used when the order came back with mock: true
// (Razorpay isn't configured on the server) — skips the Checkout widget
// entirely and just confirms the simulated order.
export function confirmMockSubscriptionPayment(token, orderId) {
  return authedJSON('/subscription/mock-confirm', token, { method: 'POST', body: JSON.stringify({ orderId }) })
}
