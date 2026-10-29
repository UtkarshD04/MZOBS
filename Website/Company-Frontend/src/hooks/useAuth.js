import { useQuery } from '@tanstack/react-query'
import * as authService from '../services/authService'
import { queryClient, queryKeys } from '../lib/queryClient'

export function useMeQuery({ enabled = true } = {}) {
  return useQuery({ queryKey: queryKeys.me, queryFn: authService.getMe, staleTime: 5 * 60_000, enabled })
}

// RequireAuth passes keepCache: clearing the cache there would refetch `me`, fail again and loop.
export function logout({ keepCache = false } = {}) {
  // Drop cached data too, or the next visitor in this tab would still pass RequireAuth on the cached `me`.
  if (!keepCache) queryClient.clear()
  // Clears the httpOnly session cookie server-side; nothing to remove locally.
  return authService.logoutStaff().catch(() => {})
}
