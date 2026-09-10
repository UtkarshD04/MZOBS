import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { queryKeys } from '../lib/queryClient'
import * as subscriptionService from '../services/subscriptionService'
import { openRazorpayCheckout } from '../lib/razorpay'

export function useSubscriptionQuery() {
  return useQuery({ queryKey: queryKeys.subscription, queryFn: subscriptionService.getSubscription })
}

// Cheap, frequently-checked flag used to gate the UI (job posting, resume
// actions) before firing a request that would just come back 403. The
// backend re-checks independently on every gated route regardless.
export function useAccessStatusQuery() {
  return useQuery({ queryKey: queryKeys.accessStatus, queryFn: subscriptionService.getAccessStatus, staleTime: 15_000 })
}

export function useSubscriptionPaymentsQuery() {
  return useQuery({ queryKey: queryKeys.subscriptionPayments, queryFn: subscriptionService.listSubscriptionPayments })
}

// Same order → Checkout → verify shape as usePayJobInvoice / the employee
// subscription flow: the amount is fixed server-side, Razorpay Checkout
// collects payment, and the plan only activates once the signature-verified
// response comes back (or, in dev without Razorpay keys, via mock-confirm).
export function useSubscribeToPlan() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async () => {
      const order = await subscriptionService.createSubscriptionOrder()
      if (order.mock) {
        return subscriptionService.confirmMockSubscriptionPayment(order.orderId)
      }
      const result = await openRazorpayCheckout(order)
      return subscriptionService.verifySubscriptionPayment({
        razorpay_order_id: result.razorpay_order_id,
        razorpay_payment_id: result.razorpay_payment_id,
        razorpay_signature: result.razorpay_signature,
      })
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['subscription'] })
      toast.success('Payment received — your MZOBS Employer Annual plan is now active')
    },
    onError: (err) => {
      const message = err.response?.data?.message ?? err.message
      if (message !== 'Payment cancelled') toast.error(message ?? 'Payment could not be processed.')
    },
  })
}
