import { Navigate, Outlet } from 'react-router-dom'
import { useProfileQuery } from '../../hooks/useProfile'
import { PageSkeleton } from '../ui/Skeleton'

// A freshly signed-up employee has no profile/resume/payment yet — send them
// through Onboarding before letting them into the rest of the app.
export default function RequireOnboarded() {
  const { data: profile, isLoading } = useProfileQuery()

  if (isLoading) return <PageSkeleton />
  if (profile && profile.subscription?.status !== 'paid') return <Navigate to="/onboarding" replace />

  return <Outlet />
}
