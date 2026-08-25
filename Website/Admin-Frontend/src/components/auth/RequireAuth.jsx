import { Navigate, Outlet } from 'react-router-dom'
import { useMeQuery } from '../../hooks/useAuth'
import { logout } from '../../hooks/useAuth'
import { PageSkeleton } from '../ui/Skeleton'

export default function RequireAuth() {
  const token = localStorage.getItem('mzobs-staff-token')
  const { data: me, isLoading, isError } = useMeQuery({ enabled: !!token })

  if (!token) return <Navigate to="/login" replace />
  if (isLoading) return <PageSkeleton />
  if (isError) {
    logout()
    return <Navigate to="/login" replace />
  }
  if (me?.accessLevel !== 'admin') {
    logout()
    return <Navigate to="/login" replace state={{ wrongPortal: true }} />
  }

  return <Outlet />
}
