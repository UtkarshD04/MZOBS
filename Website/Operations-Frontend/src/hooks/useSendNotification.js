import { useMutation, useQuery } from '@tanstack/react-query'
import * as sendNotificationService from '../services/sendNotificationService'

export function useRecipientsQuery({ audience, search }) {
  return useQuery({
    queryKey: ['notificationRecipients', audience, search],
    queryFn: () => sendNotificationService.listRecipients({ audience, search }),
  })
}

export function useSendNotificationMutation() {
  return useMutation({ mutationFn: sendNotificationService.sendNotification })
}
