const CHECKOUT_SRC = 'https://checkout.razorpay.com/v1/checkout.js'
const LOAD_TIMEOUT_MS = 10000

// Cached across calls so a preload on page mount and the actual pay click
// share one in-flight load instead of injecting the script twice.
let loadPromise = null

// Injects Razorpay's Checkout script on demand — it used to be a blocking
// <script> tag in index.html loaded on every page, even ones that never
// take a payment. Callers await this right before opening checkout (and
// may also call it earlier, e.g. on mount of a pricing/subscription page,
// to get a head start — see EmployeeSubscription.jsx/EmployerGuestSubscribe.jsx).
export function loadRazorpay() {
  if (window.Razorpay) return Promise.resolve(window.Razorpay)
  if (loadPromise) return loadPromise

  loadPromise = new Promise((resolve, reject) => {
    const script = document.createElement('script')
    script.src = CHECKOUT_SRC
    script.async = true

    const timer = setTimeout(() => {
      script.remove()
      reject(new Error('Payment SDK timed out. Please check your connection and try again.'))
    }, LOAD_TIMEOUT_MS)

    script.onload = () => {
      clearTimeout(timer)
      if (window.Razorpay) resolve(window.Razorpay)
      else reject(new Error('Payment SDK failed to load. Please check your connection and try again.'))
    }
    script.onerror = () => {
      clearTimeout(timer)
      script.remove()
      reject(new Error('Payment SDK failed to load. Please check your connection and try again.'))
    }

    document.head.appendChild(script)
    // A failed/timed-out load shouldn't be cached — clear it so the next
    // caller (e.g. the user clicking "pay" again) gets a fresh attempt
    // instead of being stuck with a rejected promise forever.
  }).catch((err) => {
    loadPromise = null
    throw err
  })

  return loadPromise
}

// Wraps Razorpay's callback-based Checkout widget in a promise so callers
// can just `await` a result instead of juggling handler/ondismiss/on(fail).
// Same shape as Employer-Frontend/Frontend's copy. Callers must `await
// loadRazorpay()` first — this assumes window.Razorpay is already present.
export function openRazorpayCheckout(order) {
  return new Promise((resolve, reject) => {
    if (!window.Razorpay) {
      reject(new Error('Payment SDK failed to load. Please check your connection and try again.'))
      return
    }

    const rzp = new window.Razorpay({
      key: order.keyId,
      amount: order.amount,
      currency: order.currency,
      order_id: order.orderId,
      name: order.name,
      description: order.description,
      prefill: order.prefill,
      theme: { color: '#246B5A' },
      handler: (response) => resolve(response),
      modal: { ondismiss: () => reject(new Error('Payment cancelled')) },
    })
    rzp.on('payment.failed', (response) => reject(new Error(response.error?.description || 'Payment failed')))
    rzp.open()
  })
}
