import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import * as planEnquiriesService from '../services/planEnquiriesService'
import { queryKeys } from '../lib/queryClient'

export function usePlanEnquiriesQuery(filters = {}) {
  return useQuery({ queryKey: queryKeys.planEnquiries(filters), queryFn: () => planEnquiriesService.listPlanEnquiries(filters) })
}

export function usePlanEnquiriesStatsQuery() {
  return useQuery({ queryKey: ['plan-enquiries', 'stats'], queryFn: planEnquiriesService.getStats })
}

export function useUpdatePlanEnquiryMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, ...input }) => planEnquiriesService.updatePlanEnquiry(id, input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['plan-enquiries'] }),
  })
}
