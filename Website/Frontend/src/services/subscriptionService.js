import { apiClient } from '../lib/api'

export function getSubscription() {
  return apiClient.get('/subscription').then((r) => r.data)
}

// Triggers a browser download of the PDF — response comes back as a blob
// (not JSON) since it's a file, so it bypasses the usual `.then((r) => r.data)`
// JSON unwrap the other calls in this file use.
export async function downloadInvoice() {
  const res = await apiClient.get('/subscription/invoice', { responseType: 'blob' })
  const filenameMatch = res.headers['content-disposition']?.match(/filename="(.+)"/)
  const filename = filenameMatch?.[1] ?? 'mzobs-invoice.pdf'

  const url = window.URL.createObjectURL(res.data)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  link.remove()
  window.URL.revokeObjectURL(url)
}

export function createSubscriptionOrder(couponCode) {
  return apiClient.post('/subscription/order', couponCode ? { couponCode } : {}).then((r) => r.data)
}

// Prices a coupon against the fixed fee without creating an order — no auth
// required, so it works both from the signed-in account page and the guest
// "pay first" checkout on the marketing site.
export function previewCoupon(code) {
  return apiClient.post('/subscription/coupon/preview', { code }).then((r) => r.data)
}

export function verifySubscriptionPayment(payload) {
  return apiClient.post('/subscription/verify', payload).then((r) => r.data)
}

// Dev/testing shortcut used when the order came back with mock: true
// (Razorpay isn't configured on the server) — skips the Checkout widget
// entirely and just confirms the simulated order.
export function confirmMockSubscriptionPayment(orderId) {
  return apiClient.post('/subscription/mock-confirm', { orderId }).then((r) => r.data)
}
