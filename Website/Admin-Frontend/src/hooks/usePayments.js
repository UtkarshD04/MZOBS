import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import * as paymentsService from '../services/paymentsService'
import { queryKeys } from '../lib/queryClient'

export function usePaymentsQuery(filters = {}) {
  return useQuery({ queryKey: queryKeys.payments(filters), queryFn: () => paymentsService.listPayments(filters) })
}

export function useRecordSubscriptionPaymentMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: paymentsService.recordSubscriptionPayment,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['payments'] }),
  })
}

export function useSubscriptionTrendQuery(params) {
  return useQuery({ queryKey: queryKeys.subscriptionTrend(params), queryFn: () => paymentsService.getSubscriptionTrend(params) })
}

export function useEmployerRevenueTrendQuery(params) {
  return useQuery({ queryKey: queryKeys.employerRevenueTrend(params), queryFn: () => paymentsService.getEmployerRevenueTrend(params) })
}
