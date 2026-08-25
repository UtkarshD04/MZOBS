import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import * as jobsService from '../services/jobsService'
import { queryKeys } from '../lib/queryClient'

export function useJobsQuery(filters = {}) {
  return useQuery({ queryKey: queryKeys.jobs(filters), queryFn: () => jobsService.listJobs(filters) })
}

export function useApproveJobMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, ...input }) => jobsService.approveJob(id, input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['jobs'] }),
  })
}

export function useRecordJobPaymentMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, ...input }) => jobsService.recordJobPayment(id, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] })
      queryClient.invalidateQueries({ queryKey: ['batches'] })
    },
  })
}
