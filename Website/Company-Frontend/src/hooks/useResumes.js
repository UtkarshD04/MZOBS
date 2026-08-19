import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import * as resumesService from '../services/resumesService'
import { queryKeys } from '../lib/queryClient'

export function useResumeQueueQuery(filters = {}) {
  return useQuery({ queryKey: queryKeys.resumes(filters), queryFn: () => resumesService.listResumeQueue(filters) })
}

export function useReviewResumeMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ employeeId, ...input }) => resumesService.reviewResume(employeeId, input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['resumes'] }),
  })
}
