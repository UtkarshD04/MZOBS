import { useQuery } from '@tanstack/react-query'
import { queryKeys } from '../lib/queryClient'
import * as batchesService from '../services/batchesService'

export function useBatchesQuery() {
  return useQuery({ queryKey: queryKeys.batches, queryFn: batchesService.listBatches })
}
