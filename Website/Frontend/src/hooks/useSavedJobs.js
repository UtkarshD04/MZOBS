import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import * as savedJobsService from '../services/savedJobsService'
import { queryKeys } from '../lib/queryClient'

export function useSavedJobsQuery(options = {}) {
  return useQuery({ queryKey: queryKeys.savedJobs, queryFn: savedJobsService.listSavedJobs, ...options })
}

export function useSaveJobMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: savedJobsService.saveJob,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.savedJobs }),
  })
}

export function useUnsaveJobMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: savedJobsService.unsaveJob,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.savedJobs }),
  })
}
