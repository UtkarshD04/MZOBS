import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import * as recentlyViewedService from '../services/recentlyViewedService'
import { queryKeys } from '../lib/queryClient'

export function useRecentlyViewedQuery(options = {}) {
  return useQuery({ queryKey: queryKeys.recentlyViewed, queryFn: recentlyViewedService.listRecentlyViewed, ...options })
}

export function useRecordViewMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: recentlyViewedService.recordView,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.recentlyViewed }),
  })
}
