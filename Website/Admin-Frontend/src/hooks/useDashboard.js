import { useQuery } from '@tanstack/react-query'
import * as dashboardService from '../services/dashboardService'
import { queryKeys } from '../lib/queryClient'

export function useDashboardQuery() {
  return useQuery({ queryKey: queryKeys.dashboard, queryFn: dashboardService.getDashboard })
}
