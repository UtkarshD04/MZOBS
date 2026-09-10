import { useQuery } from '@tanstack/react-query'
import { queryKeys } from '../lib/queryClient'
import { getDashboard } from '../services/dashboardService'

export function useDashboardQuery() {
  return useQuery({ queryKey: queryKeys.dashboard, queryFn: getDashboard })
}
