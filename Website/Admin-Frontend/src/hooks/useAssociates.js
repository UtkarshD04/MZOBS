import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import * as associatesService from '../services/associatesService'
import { queryKeys } from '../lib/queryClient'

export function useAssociatesQuery(filters = {}) {
  return useQuery({ queryKey: queryKeys.associates(filters), queryFn: () => associatesService.listAssociates(filters) })
}

export function useAssociatesStatsQuery() {
  return useQuery({ queryKey: ['associates', 'stats'], queryFn: associatesService.getStats })
}

export function useUpdateAssociateMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, ...input }) => associatesService.updateAssociate(id, input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['associates'] }),
  })
}
