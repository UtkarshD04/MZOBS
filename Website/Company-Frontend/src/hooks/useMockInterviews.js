import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import * as mockInterviewsService from '../services/mockInterviewsService'
import { queryKeys } from '../lib/queryClient'

export function useMockInterviewsQuery(filters = {}) {
  return useQuery({ queryKey: queryKeys.mockInterviews(filters), queryFn: () => mockInterviewsService.listMockInterviews(filters) })
}

export function useScheduleMockInterviewMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: mockInterviewsService.scheduleMockInterview,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['mockInterviews'] }),
  })
}

export function useCompleteMockInterviewMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, ...input }) => mockInterviewsService.completeMockInterview(id, input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['mockInterviews'] }),
  })
}

export function useAssignSkillTrackMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ employeeId, ...input }) => mockInterviewsService.assignSkillTrack(employeeId, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['resumes'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
    },
  })
}

export function useSetTrustScoreMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ employeeId, ...input }) => mockInterviewsService.setTrustScore(employeeId, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['resumes'] })
      queryClient.invalidateQueries({ queryKey: ['shortlist'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
    },
  })
}
