import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import * as resumesService from '../services/resumesService'
import { queryKeys } from '../lib/queryClient'

export function useResumeQueueQuery(filters = {}) {
  return useQuery({ queryKey: queryKeys.resumes(filters), queryFn: () => resumesService.listResumeQueue(filters) })
}

export function useAssignResumeMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ employeeId, staffId }) => resumesService.assignResume(employeeId, staffId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['resumes'] }),
  })
}

export function useBulkAssignResumesMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ employeeIds, staffId }) => resumesService.bulkAssignResumes(employeeIds, staffId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['resumes'] }),
  })
}
