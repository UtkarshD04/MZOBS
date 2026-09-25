import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import * as allyService from '../services/allyService'
import { queryKeys } from '../lib/queryClient'

export function useAllyQuery(filters = {}) {
  return useQuery({ queryKey: queryKeys.ally(filters), queryFn: () => allyService.listApplications(filters) })
}

export function useAllyStatsQuery() {
  return useQuery({ queryKey: ['ally', 'stats'], queryFn: allyService.getStats })
}

export function useUpdateAllyMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, ...input }) => allyService.updateApplication(id, input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['ally'] }),
  })
}
