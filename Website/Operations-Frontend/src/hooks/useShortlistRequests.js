import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import * as svc from '../services/shortlistRequestsService'

export const useShortlistRequestsQuery = (filters = {}) => useQuery({ queryKey: ['shortlist-requests', filters], queryFn: () => svc.listShortlistRequests(filters) })
export const useRequestCandidatesQuery = (id) => useQuery({ queryKey: ['shortlist-requests', 'candidates', id], queryFn: () => svc.listRequestCandidates(id), enabled: !!id })
export function useUpdateShortlistRequestMutation() {
  const qc = useQueryClient()
  return useMutation({ mutationFn: ({ id, ...body }) => svc.updateShortlistRequest(id, body), onSuccess: () => qc.invalidateQueries({ queryKey: ['shortlist-requests'] }) })
}
