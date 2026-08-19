import { useQuery } from '@tanstack/react-query'
import * as authService from '../services/authService'
import { queryKeys } from '../lib/queryClient'

export function useMeQuery() {
  return useQuery({ queryKey: queryKeys.me, queryFn: authService.getMe, staleTime: 5 * 60_000 })
}

export function logout() {
  localStorage.removeItem('mzobs-staff-token')
}
