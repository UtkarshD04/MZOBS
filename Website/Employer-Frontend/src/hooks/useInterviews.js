import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { queryKeys } from '../lib/queryClient'
import * as interviewsService from '../services/interviewsService'

export function useInterviewsQuery() {
  return useQuery({ queryKey: queryKeys.interviews, queryFn: interviewsService.listInterviews })
}

export function useScheduleInterview() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (input) => interviewsService.scheduleInterview(input),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.interviews })
      toast.success('Interview scheduled')
    },
    onError: () => toast.error('Could not schedule the interview.'),
  })
}

export function useRescheduleInterview() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, startsAt }) => interviewsService.rescheduleInterview(id, startsAt),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.interviews })
      toast.success('Interview rescheduled')
    },
  })
}

export function useCancelInterview() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id) => interviewsService.cancelInterview(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.interviews })
      toast.success('Interview cancelled')
    },
  })
}

export function useSubmitFeedback() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, feedback }) => interviewsService.submitFeedback(id, feedback),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.interviews })
      toast.success('Feedback submitted')
    },
  })
}
