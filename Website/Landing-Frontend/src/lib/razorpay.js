// Wraps Razorpay's callback-based Checkout widget in a promise so callers
// can just `await` a result instead of juggling handler/ondismiss/on(fail).
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
      theme: { color: '#3d5c34' },
      handler: (response) => resolve(response),
      modal: { ondismiss: () => reject(new Error('Payment cancelled')) },
    })
    rzp.on('payment.failed', (response) => reject(new Error(response.error?.description || 'Payment failed')))
    rzp.open()
  })
}
