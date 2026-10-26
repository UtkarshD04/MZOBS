import { Navigate, Outlet } from 'react-router-dom'
import { useMeQuery } from '../../hooks/useAuth'
import { logout } from '../../hooks/useAuth'
import { PageSkeleton } from '../ui/Skeleton'

export default function RequireAuth() {
  const { isLoading, isError } = useMeQuery()

  if (isLoading) return <PageSkeleton />
  if (isError) {
    logout()
    return <Navigate to="/login" replace />
  }

  return <Outlet />
}
