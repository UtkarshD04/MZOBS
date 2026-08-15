import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import * as subscriptionService from '../services/subscriptionService'
import { queryKeys } from '../lib/queryClient'

export function useSubscriptionQuery() {
  return useQuery({ queryKey: queryKeys.subscription, queryFn: subscriptionService.getSubscription })
}

export function useCreateSubscriptionOrderMutation() {
  return useMutation({ mutationFn: subscriptionService.createSubscriptionOrder })
}

export function useVerifySubscriptionPaymentMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: subscriptionService.verifySubscriptionPayment,
    onSuccess: (data) => queryClient.setQueryData(queryKeys.subscription, data),
  })
}
