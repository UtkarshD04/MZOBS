import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import * as subscriptionService from '../services/subscriptionService'
import { queryKeys } from '../lib/queryClient'

export function useSubscriptionQuery() {
  return useQuery({ queryKey: queryKeys.subscription, queryFn: subscriptionService.getSubscription })
}

export function useCreateSubscriptionOrderMutation() {
  return useMutation({ mutationFn: (couponCode) => subscriptionService.createSubscriptionOrder(couponCode) })
}

export function usePreviewCouponMutation() {
  return useMutation({ mutationFn: subscriptionService.previewCoupon })
}

export function useVerifySubscriptionPaymentMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: subscriptionService.verifySubscriptionPayment,
    // A paid account is sent to the mandatory profile setup (ProfileSetupGate reads
    // profile.profileSetupPending), so the profile has to be refetched right away.
    onSuccess: (data) => {
      queryClient.setQueryData(queryKeys.subscription, data)
      queryClient.invalidateQueries({ queryKey: queryKeys.profile })
    },
  })
}

export function useConfirmMockSubscriptionPaymentMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: subscriptionService.confirmMockSubscriptionPayment,
    onSuccess: (data) => {
      queryClient.setQueryData(queryKeys.subscription, data)
      queryClient.invalidateQueries({ queryKey: queryKeys.profile })
    },
  })
}
