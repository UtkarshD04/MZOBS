import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import * as feedbackService from '../services/feedbackService'

const KEY = 'rejectionFeedback'

export const useFeedbackListQuery = (params) =>
  useQuery({ queryKey: [KEY, 'list', params], queryFn: () => feedbackService.listFeedback(params), placeholderData: keepPreviousData })

export const useFeedbackCountsQuery = ({ enabled = true } = {}) => useQuery({ queryKey: [KEY, 'counts'], queryFn: feedbackService.getFeedbackCounts, enabled, refetchOnWindowFocus: true })

export const useFeedbackFiltersQuery = () => useQuery({ queryKey: [KEY, 'filters'], queryFn: feedbackService.getFeedbackFilters, staleTime: 5 * 60 * 1000 })

export const useFeedbackDetailQuery = (id) => useQuery({ queryKey: [KEY, 'detail', id], queryFn: () => feedbackService.getFeedback(id), gcTime: 0 })

export const useFollowUpsQuery = (params, enabled = true) =>
  useQuery({ queryKey: [KEY, 'followUps', params], queryFn: () => feedbackService.listFollowUps(params), enabled, placeholderData: keepPreviousData })

// Every action refreshes the queues, the counts and any open detail, so nothing on screen can go stale.
function useAction(mutationFn) {
  const queryClient = useQueryClient()
  return useMutation({ mutationFn, onSettled: () => queryClient.invalidateQueries({ queryKey: [KEY] }) })
}

export const useReviewFeedbackMutation = () => useAction(({ id, ...body }) => feedbackService.reviewFeedback(id, body))
export const useResolveDisputeMutation = () => useAction(({ id, ...body }) => feedbackService.resolveFeedbackDispute(id, body))
export const useAddFeedbackNoteMutation = () => useAction(({ id, text }) => feedbackService.addFeedbackNote(id, text))
export const useRetryNotificationMutation = () => useAction((id) => feedbackService.retryFeedbackNotification(id))

export const useNotifyFollowUpMutation = () => useAction((id) => feedbackService.notifyFollowUp(id))
export const useRecordContactMutation = () => useAction(({ id, ...body }) => feedbackService.recordFollowUpContact(id, body))
export const useAddFollowUpNoteMutation = () => useAction(({ id, text }) => feedbackService.addFollowUpNote(id, text))
export const useSetNextFollowUpMutation = () => useAction(({ id, nextFollowUpAt }) => feedbackService.setFollowUpNext(id, nextFollowUpAt))
export const useCompleteFollowUpMutation = () => useAction((id) => feedbackService.completeFollowUp(id))
