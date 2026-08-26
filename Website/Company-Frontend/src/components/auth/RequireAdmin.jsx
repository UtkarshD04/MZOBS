import { Outlet } from 'react-router-dom'
import { Lock } from 'lucide-react'
import { useMeQuery } from '../../hooks/useAuth'
import { PageSkeleton } from '../ui/Skeleton'
import EmptyState from '../ui/EmptyState'

// Backend already rejects these routes for non-admin staff (403) — this just
// gives them a clean explanation instead of a failed request, for whoever
// lands here directly (bookmark, typed URL) rather than via the sidebar,
// which already hides the link for them.
export default function RequireAdmin() {
  const { data: me, isLoading } = useMeQuery()

  if (isLoading) return <PageSkeleton />
  if (me?.accessLevel !== 'admin') {
    return <EmptyState icon={Lock} tone="red" title="Admin access required" body="This section is only available to admin accounts. Ask an admin if you need something here." />
  }

  return <Outlet />
}
