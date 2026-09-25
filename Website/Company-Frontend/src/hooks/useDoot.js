import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import * as dootService from '../services/dootService'
import { queryKeys } from '../lib/queryClient'

export function useDootQuery(filters = {}) {
  return useQuery({ queryKey: queryKeys.doot(filters), queryFn: () => dootService.listApplications(filters) })
}

export function useDootStatsQuery() {
  return useQuery({ queryKey: ['doot', 'stats'], queryFn: dootService.getStats })
}

export function useUpdateDootMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, ...input }) => dootService.updateApplication(id, input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['doot'] }),
  })
}
