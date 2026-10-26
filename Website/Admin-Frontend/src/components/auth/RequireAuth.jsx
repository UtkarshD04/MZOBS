import { Navigate, Outlet } from 'react-router-dom'
import { useMeQuery } from '../../hooks/useAuth'
import { logout } from '../../hooks/useAuth'
import { PageSkeleton } from '../ui/Skeleton'

export default function RequireAuth() {
  const { data: me, isLoading, isError } = useMeQuery()

  if (isLoading) return <PageSkeleton />
  if (isError) {
    logout({ keepCache: true })
    return <Navigate to="/login" replace />
  }
  if (me?.accessLevel !== 'admin') {
    logout({ keepCache: true })
    return <Navigate to="/login" replace state={{ notAdmin: true }} />
  }

  return <Outlet />
}
