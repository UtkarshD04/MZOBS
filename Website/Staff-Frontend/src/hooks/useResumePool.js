import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import * as resumePoolService from '../services/resumePoolService'
import { queryKeys } from '../lib/queryClient'

export function useResumePoolQuery(filters = {}) {
  return useQuery({ queryKey: queryKeys.resumePool(filters), queryFn: () => resumePoolService.listResumePool(filters) })
}

export function useResumePoolStatsQuery() {
  return useQuery({ queryKey: queryKeys.resumePoolStats, queryFn: resumePoolService.getResumePoolStats })
}

export function useReviewPoolResumeMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, ...input }) => resumePoolService.reviewPoolResume(id, input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['resumePool'] }),
  })
}
