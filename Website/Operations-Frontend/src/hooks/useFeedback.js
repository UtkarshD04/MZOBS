import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import * as feedbackService from '../services/feedbackService'

const KEY = 'rejectionFeedback'

export function useFeedbackListQuery(status) {
  return useQuery({ queryKey: [KEY, 'list', status ?? 'all'], queryFn: () => feedbackService.listFeedback(status) })
}

export function useFeedbackCountsQuery() {
  return useQuery({ queryKey: [KEY, 'counts'], queryFn: feedbackService.getFeedbackCounts })
}

export function useFeedbackDetailQuery(id) {
  return useQuery({ queryKey: [KEY, 'detail', id], queryFn: () => feedbackService.getFeedback(id) })
}

function useInvalidating(mutationFn) {
  const queryClient = useQueryClient()
  return useMutation({ mutationFn, onSuccess: () => queryClient.invalidateQueries({ queryKey: [KEY] }) })
}

export const useReviewFeedbackMutation = () => useInvalidating(({ id, ...body }) => feedbackService.reviewFeedback(id, body))
export const useResolveDisputeMutation = () => useInvalidating(({ id, ...body }) => feedbackService.resolveFeedbackDispute(id, body))
