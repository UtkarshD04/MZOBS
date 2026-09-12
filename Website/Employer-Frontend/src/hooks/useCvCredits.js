import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { queryKeys } from '../lib/queryClient'
import * as cvCreditsService from '../services/cvCreditsService'
import { openRazorpayCheckout } from '../lib/razorpay'

export function useCreditBalanceQuery() {
  return useQuery({ queryKey: queryKeys.cvCredits, queryFn: cvCreditsService.getCreditBalance, staleTime: 15_000 })
}

export function useCreditPlansQuery() {
  return useQuery({ queryKey: queryKeys.cvCreditPlans, queryFn: cvCreditsService.listCreditPlans })
}

export function useCreditPurchasesQuery() {
  return useQuery({ queryKey: queryKeys.cvCreditPurchases, queryFn: cvCreditsService.listCreditPurchases })
}

export function useUnlocksQuery() {
  return useQuery({ queryKey: queryKeys.cvUnlocks, queryFn: cvCreditsService.listUnlocks })
}

// Prices a coupon against a specific plan without creating an order — so
// the price can update as soon as the employer types a code.
export function usePreviewCvCreditCoupon() {
  return useMutation({ mutationFn: ({ planId, code }) => cvCreditsService.previewCvCreditCoupon(planId, code) })
}

// Same order -> Checkout -> verify shape as useSubscribeToPlan: the price is
// fixed server-side from the chosen plan id (and, if a coupon was applied,
// re-validated and re-priced server-side too — never trusts the preview
// alone), Razorpay Checkout collects payment, and credits only land once
// the signature-verified response comes back (or, in dev without Razorpay
// keys, via mock-confirm).
export function useBuyCreditPlan() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({ planId, couponCode }) => {
      const order = await cvCreditsService.createCvCreditOrder(planId, couponCode)
      if (order.mock) {
        return cvCreditsService.confirmMockCvCreditPayment(order.orderId)
      }
      const result = await openRazorpayCheckout(order)
      return cvCreditsService.verifyCvCreditPayment({
        razorpay_order_id: result.razorpay_order_id,
        razorpay_payment_id: result.razorpay_payment_id,
        razorpay_signature: result.razorpay_signature,
      })
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.cvCredits })
      qc.invalidateQueries({ queryKey: queryKeys.cvCreditPurchases })
      toast.success('Payment received — CV credits added to your balance')
    },
    onError: (err) => {
      const message = err.response?.data?.message ?? err.message
      if (message !== 'Payment cancelled') toast.error(message ?? 'Payment could not be processed.')
    },
  })
}

export function useUnlockCandidate() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: cvCreditsService.unlockCandidate,
    onSuccess: (data, candidateId) => {
      qc.invalidateQueries({ queryKey: queryKeys.cvCredits })
      qc.invalidateQueries({ queryKey: queryKeys.cvUnlocks })
      qc.invalidateQueries({ queryKey: ['candidates'] })
      qc.invalidateQueries({ queryKey: queryKeys.candidate(candidateId) })
      qc.setQueryData(queryKeys.candidate(candidateId), data.candidate)
    },
    onError: (err) => {
      if (err.response?.data?.code === 'INSUFFICIENT_CREDITS') return // handled inline by the caller (redirect to Buy Credits)
      toast.error(err.response?.data?.message ?? 'Could not unlock this candidate.')
    },
  })
}
