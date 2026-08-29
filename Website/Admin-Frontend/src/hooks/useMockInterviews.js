import { useQuery } from '@tanstack/react-query'
import * as mockInterviewsService from '../services/mockInterviewsService'
import { queryKeys } from '../lib/queryClient'

export function useMockInterviewStatsQuery() {
  return useQuery({ queryKey: queryKeys.mockInterviewStats, queryFn: mockInterviewsService.getMockInterviewStats })
}
