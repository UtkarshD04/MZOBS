import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { queryKeys } from '../lib/queryClient'
import * as notificationsService from '../services/notificationsService'

export function useNotificationsQuery() {
  return useQuery({
    queryKey: queryKeys.notifications,
    queryFn: notificationsService.listNotifications,
    refetchInterval: 30_000,
    refetchOnWindowFocus: true,
  })
}

export function useMarkAsRead() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id) => notificationsService.markAsRead(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.notifications }),
  })
}

export function useMarkAllRead() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: () => notificationsService.markAllRead(),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.notifications }),
  })
}

export function useSendCandidateNotification() {
  return useMutation({
    mutationFn: notificationsService.sendNotificationToCandidates,
    onSuccess: (data) => toast.success(`Notification sent to ${data.sent} candidate${data.sent === 1 ? '' : 's'}`),
    onError: () => toast.error('Could not send notification.'),
  })
}
