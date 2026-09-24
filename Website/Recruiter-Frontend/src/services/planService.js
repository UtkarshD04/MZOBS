// Subscription + CV credits on the existing employer API (no backend changes):
//   GET  /subscription            plan state + pricing (GST-aware, from the server)
//   POST /subscription/order|verify-payment|mock-confirm
//   GET  /credits                 CV-credit wallet          GET /plans  purchasable packs
//   POST /payments/coupon/preview|create-order|verify|mock-confirm
//   GET  /credits/purchases       GET /unlocks              GET /payments (plan payments)
// Every number shown comes from these responses; nothing is hardcoded here.

import { apiClient } from '../lib/api'
import { IS_DEMO } from '../lib/config'

const get = (url, params) => apiClient.get(url, { params }).then((r) => r.data)

export const getSubscription = () => get('/subscription')
export const getWallet = () => get('/credits')
export const getPlans = () => get('/plans')
export const listPurchases = () => get('/credits/purchases', { limit: 50 })
export const listUnlocks = () => get('/unlocks', { limit: 50 })
export const listPlanPayments = () => get('/payments', { limit: 50 })

export const previewCoupon = (planId, code) => apiClient.post('/payments/coupon/preview', { planId, code }).then((r) => r.data)

// ---- live plan snapshot, shared by the nav pill, job form and unlock modal ----

let snapshot = null
const listeners = new Set()

/** { active, planName, expiresAt, credits } — null until first load. */
export function getPlanSnapshot() {
  return snapshot
}

export function subscribePlan(fn) {
  listeners.add(fn)
  return () => listeners.delete(fn)
}

/** Reloads subscription + wallet and notifies listeners (call after any purchase or unlock). */
export async function refreshPlan() {
  if (IS_DEMO) return null
  try {
    const [sub, wallet] = await Promise.all([getSubscription(), getWallet()])
    snapshot = {
      active: !!sub.isActive,
      planName: sub.subscription?.planName ?? null,
      expiresAt: sub.subscription?.expiresAt ?? null,
      credits: wallet.wallet?.remainingCredits ?? 0,
    }
  } catch {
    snapshot = null
  }
  listeners.forEach((fn) => fn(snapshot))
  return snapshot
}

// ---- checkout -------------------------------------------------------------

function loadRazorpay() {
  if (window.Razorpay) return Promise.resolve()
  return new Promise((resolve, reject) => {
    const s = document.createElement('script')
    s.src = 'https://checkout.razorpay.com/v1/checkout.js'
    s.onload = resolve
    s.onerror = () => reject(new Error('Payment SDK failed to load. Check your connection and try again.'))
    document.body.appendChild(s)
  })
}

async function openCheckout(order) {
  await loadRazorpay()
  return new Promise((resolve, reject) => {
    const rzp = new window.Razorpay({
      key: order.keyId,
      amount: order.amount,
      currency: order.currency,
      order_id: order.orderId,
      name: order.name,
      description: order.description,
      prefill: order.prefill,
      theme: { color: '#171a2b' },
      handler: resolve,
      modal: { ondismiss: () => reject(new Error('Payment cancelled')) },
    })
    rzp.on('payment.failed', (r) => reject(new Error(r.error?.description || 'Payment failed')))
    rzp.open()
  })
}

/**
 * Subscribes the company to the employer plan. `order.mock` is only true on a
 * dev backend without Razorpay keys, where the backend confirms a simulated payment.
 */
export async function purchaseSubscription() {
  const order = await apiClient.post('/subscription/order').then((r) => r.data)
  if (order.mock) await apiClient.post('/subscription/mock-confirm', { orderId: order.orderId })
  else {
    const res = await openCheckout(order)
    await apiClient.post('/subscription/verify-payment', res)
  }
  return refreshPlan()
}

export async function purchaseCredits(planId, couponCode) {
  const order = await apiClient.post('/payments/create-order', { planId, couponCode: couponCode || undefined }).then((r) => r.data)
  if (order.mock) await apiClient.post('/payments/mock-confirm', { orderId: order.orderId })
  else {
    const res = await openCheckout(order)
    await apiClient.post('/payments/verify', res)
  }
  return refreshPlan()
}

export const paymentError = (e) => e.response?.data?.message ?? e.message ?? 'Payment failed'
