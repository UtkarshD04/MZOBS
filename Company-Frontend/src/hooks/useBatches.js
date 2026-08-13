import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import * as batchesService from '../services/batchesService'
import { queryKeys } from '../lib/queryClient'

export function useBatchesQuery(filters = {}) {
  return useQuery({ queryKey: queryKeys.batches(filters), queryFn: () => batchesService.listBatches(filters) })
}

export function useBatchQuery(id) {
  return useQuery({ queryKey: queryKeys.batch(id), queryFn: () => batchesService.getBatch(id), enabled: !!id })
}

export function useEligibleApplicationsQuery(batchId) {
  return useQuery({
    queryKey: queryKeys.eligibleApplications(batchId),
    queryFn: () => batchesService.listEligibleApplications(batchId),
    enabled: !!batchId,
  })
}

export function useDispatchBatchMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ batchId, applicationIds }) => batchesService.dispatchBatch(batchId, applicationIds),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['batches'] })
      queryClient.invalidateQueries({ queryKey: ['applications'] })
    },
  })
}
