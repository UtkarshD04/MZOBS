import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import * as resumePoolService from '../services/resumePoolService'
import { queryKeys } from '../lib/queryClient'

export function useResumePoolQuery(filters = {}) {
  return useQuery({ queryKey: queryKeys.resumePool(filters), queryFn: () => resumePoolService.listResumePool(filters) })
}

export function useResumePoolStatsQuery() {
  return useQuery({ queryKey: queryKeys.resumePoolStats, queryFn: resumePoolService.getResumePoolStats })
}

function invalidatePool(queryClient) {
  queryClient.invalidateQueries({ queryKey: ['resumePool'] })
}

export function useBulkUploadResumesMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: resumePoolService.bulkUploadResumes,
    onSuccess: () => invalidatePool(queryClient),
  })
}

export function useAssignResumeMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, staffId }) => resumePoolService.assignResume(id, staffId),
    onSuccess: () => invalidatePool(queryClient),
  })
}

export function useBulkAssignResumesMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ resumeIds, staffId }) => resumePoolService.bulkAssignResumes(resumeIds, staffId),
    onSuccess: () => invalidatePool(queryClient),
  })
}

export function useReviewPoolResumeMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, ...input }) => resumePoolService.reviewPoolResume(id, input),
    onSuccess: () => invalidatePool(queryClient),
  })
}
