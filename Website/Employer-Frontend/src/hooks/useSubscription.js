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

// Prices a coupon against one specific plan tier without creating an order —
// so the price can update as soon as the employer types a code. Matches
// CouponBox's generic `preview.mutate(code)` contract (planCode is bound by
// the caller, one instance per plan card — see Subscription.jsx).
export function usePreviewSubscriptionCoupon(planCode) {
  return useMutation({ mutationFn: (code) => subscriptionService.previewSubscriptionCoupon(planCode, code) })
}

// Same order → Checkout → verify shape as usePayJobInvoice / the employee
// subscription flow: the amount is fixed server-side for whichever plan tier
// was chosen (and, if a coupon was applied, re-validated and re-priced
// server-side too — never trusts the preview alone), Razorpay Checkout
// collects payment, and the plan only activates once the signature-verified
// response comes back (or, in dev without Razorpay keys, via mock-confirm).
export function useSubscribeToPlan() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({ planCode, couponCode } = {}) => {
      const order = await subscriptionService.createSubscriptionOrder(planCode, couponCode)
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
      toast.success('Payment received — your MZOBS Employer plan is now active')
    },
    onError: (err) => {
      const message = err.response?.data?.message ?? err.message
      if (message !== 'Payment cancelled') toast.error(message ?? 'Payment could not be processed.')
    },
  })
}
