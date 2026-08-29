import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import * as supportService from '../services/supportService'
import { queryKeys } from '../lib/queryClient'

export function useTicketsQuery(filters = {}) {
  return useQuery({ queryKey: queryKeys.supportTickets(filters), queryFn: () => supportService.listTickets(filters) })
}

export function useRespondTicketMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, ...input }) => supportService.respondTicket(id, input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['supportTickets'] }),
  })
}
