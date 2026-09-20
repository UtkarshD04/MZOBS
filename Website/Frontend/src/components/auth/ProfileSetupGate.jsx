import { Navigate, Outlet } from 'react-router-dom'
import { hasEmployeeToken } from '../../lib/auth'
import { useProfileQuery } from '../../hooks/useProfile'

// Right after the one-time payment the backend flags the account
// (profile.profileSetupPending) until the full profile has been submitted. While that
// flag is up every dashboard page redirects to the mandatory /onboarding wizard.
// Guests (the public jobs page) and unpaid or already-complete accounts pass straight through.
export function ProfileSetupGate() {
  const authed = hasEmployeeToken()
  const { data: profile, isLoading } = useProfileQuery({ enabled: authed })
  if (!authed) return <Outlet />
  if (isLoading) return null
  if (profile?.profileSetupPending) return <Navigate to="/onboarding" replace />
  return <Outlet />
}

// /onboarding only makes sense while setup is pending; anyone else goes to the dashboard.
export function OnboardingGuard({ children }) {
  const { data: profile, isLoading } = useProfileQuery()
  if (isLoading) return null
  if (!profile?.profileSetupPending) return <Navigate to="/app/dashboard" replace />
  return children
}
