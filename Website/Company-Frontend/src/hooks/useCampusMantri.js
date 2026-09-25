import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import * as campusMantriService from '../services/campusMantriService'
import { queryKeys } from '../lib/queryClient'

export function useCampusMantriQuery(filters = {}) {
  return useQuery({ queryKey: queryKeys.campusMantri(filters), queryFn: () => campusMantriService.listApplications(filters) })
}

export function useCampusMantriStatsQuery() {
  return useQuery({ queryKey: ['campusMantri', 'stats'], queryFn: campusMantriService.getStats })
}

export function useUpdateCampusMantriMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, ...input }) => campusMantriService.updateApplication(id, input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['campusMantri'] }),
  })
}
