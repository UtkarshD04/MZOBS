import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import * as premiumServicesService from '../services/premiumServicesService'
import { queryKeys } from '../lib/queryClient'

export function usePremiumServicesQuery(filters = {}) {
  return useQuery({ queryKey: queryKeys.premiumServices(filters), queryFn: () => premiumServicesService.listServiceRequests(filters) })
}

export function usePremiumServiceStatsQuery() {
  return useQuery({ queryKey: queryKeys.premiumServiceStats, queryFn: premiumServicesService.getServiceRequestStats })
}

export function usePremiumPlanQuery() {
  return useQuery({ queryKey: queryKeys.premiumPlan, queryFn: premiumServicesService.getPremiumPlan, staleTime: 10 * 60 * 1000 })
}

export function useUpdateServiceRequestMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, ...input }) => premiumServicesService.updateServiceRequest(id, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['premiumServices'] })
      queryClient.invalidateQueries({ queryKey: queryKeys.premiumServiceStats })
    },
  })
}
