import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import * as cvCreditAdminService from '../services/cvCreditAdminService'
import { queryKeys } from '../lib/queryClient'

export function useCreditSummaryQuery() {
  return useQuery({ queryKey: queryKeys.cvCreditSummary, queryFn: cvCreditAdminService.creditSummary })
}

export function useCreditPurchasesQuery(filters = {}) {
  return useQuery({ queryKey: queryKeys.cvCreditPurchases(filters), queryFn: () => cvCreditAdminService.listCreditPurchases(filters) })
}

export function useCvUnlocksQuery(filters = {}) {
  return useQuery({ queryKey: queryKeys.cvUnlocks(filters), queryFn: () => cvCreditAdminService.listCvUnlocks(filters) })
}

export function useCreditLedgerQuery(filters = {}) {
  return useQuery({ queryKey: queryKeys.cvCreditLedger(filters), queryFn: () => cvCreditAdminService.listCreditLedger(filters), enabled: !!filters.companyId })
}

export function useCreditPlansQuery() {
  return useQuery({ queryKey: queryKeys.cvCreditPlans, queryFn: cvCreditAdminService.listCreditPlans })
}

export function useAdjustCreditsMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: cvCreditAdminService.adjustCredits,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cvCreditSummary'] })
      queryClient.invalidateQueries({ queryKey: ['cvCreditPurchases'] })
      queryClient.invalidateQueries({ queryKey: ['cvCreditLedger'] })
    },
  })
}

export function useCreateCreditPlanMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: cvCreditAdminService.createCreditPlan,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.cvCreditPlans }),
  })
}

export function useUpdateCreditPlanMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, ...input }) => cvCreditAdminService.updateCreditPlan(id, input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.cvCreditPlans }),
  })
}
