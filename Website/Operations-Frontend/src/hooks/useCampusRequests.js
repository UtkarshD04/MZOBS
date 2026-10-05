import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import * as campusRequestsService from '../services/campusRequestsService'

// The submit form lives on a different site, so poll to pick up new requests.
const POLL_MS = 30_000

export function useCampusRequestsQuery(filters = {}) {
  return useQuery({
    queryKey: ['campusRequests', filters],
    queryFn: () => campusRequestsService.listCampusRequests(filters),
    refetchInterval: POLL_MS,
  })
}

export function useCampusRequestStatsQuery() {
  return useQuery({ queryKey: ['campusRequestStats'], queryFn: campusRequestsService.getCampusRequestStats, refetchInterval: POLL_MS })
}

export function useUpdateCampusRequestMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, ...input }) => campusRequestsService.updateCampusRequest(id, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['campusRequests'] })
      queryClient.invalidateQueries({ queryKey: ['campusRequestStats'] })
    },
  })
}
