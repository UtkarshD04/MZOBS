import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import * as supportService from '../services/supportService'
import { queryKeys } from '../lib/queryClient'

export function useMyTicketsQuery() {
  return useQuery({ queryKey: queryKeys.supportTickets, queryFn: supportService.listMyTickets })
}

export function useSubmitTicketMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input) => supportService.submitTicket(input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.supportTickets }),
  })
}
