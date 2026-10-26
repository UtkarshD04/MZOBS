import { useQuery } from '@tanstack/react-query'
import * as authService from '../services/authService'
import { queryKeys } from '../lib/queryClient'

export function useMeQuery({ enabled = true } = {}) {
  return useQuery({ queryKey: queryKeys.me, queryFn: authService.getMe, staleTime: 5 * 60_000, enabled })
}

export function logout() {
  // Clears the httpOnly session cookie server-side; nothing to remove locally.
  return authService.logoutStaff().catch(() => {})
}
