import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import * as subscriptionService from '../services/subscriptionService'
import { queryKeys } from '../lib/queryClient'

export function useSubscriptionQuery() {
  return useQuery({ queryKey: queryKeys.subscription, queryFn: subscriptionService.getSubscription })
}

export function usePaySubscriptionMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: subscriptionService.paySubscription,
    onSuccess: (data) => queryClient.setQueryData(queryKeys.subscription, data),
  })
}
