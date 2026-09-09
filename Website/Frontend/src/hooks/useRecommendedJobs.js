import { useQuery } from '@tanstack/react-query'
import * as recommendationsService from '../services/recommendationsService'
import { queryKeys } from '../lib/queryClient'

export function useRecommendedJobsQuery(sort = 'match', options = {}) {
  return useQuery({
    queryKey: queryKeys.recommendedJobs(sort),
    queryFn: ({ signal }) => recommendationsService.getRecommendedJobs(sort, signal),
    placeholderData: (prev) => prev,
    ...options,
  })
}
