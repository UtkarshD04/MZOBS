import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import * as shortlistService from '../services/shortlistService'
import { queryKeys } from '../lib/queryClient'

export function useShortlistQuery(filters = {}) {
  return useQuery({ queryKey: queryKeys.shortlist(filters), queryFn: () => shortlistService.listShortlisted(filters) })
}

export function useTransferToOperationsMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (employeeId) => shortlistService.transferToOperations(employeeId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shortlist'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
    },
  })
}

export function useBulkTransferToOperationsMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (employeeIds) => shortlistService.bulkTransferToOperations(employeeIds),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shortlist'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
    },
  })
}
