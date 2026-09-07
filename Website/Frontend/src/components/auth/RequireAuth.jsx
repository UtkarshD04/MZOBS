import { useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import { hasEmployeeToken, signInUrl } from '../../lib/auth'

export default function RequireAuth() {
  const authed = hasEmployeeToken()

  useEffect(() => {
    // Carries the page the visitor was headed to (e.g. a specific job to
    // apply to) through sign-in and back — EmployeeSigninForm reads this
    // same `redirect` param to send them on after login.
    if (!authed) window.location.href = signInUrl()
  }, [authed])

  if (!authed) return null
  return <Outlet />
}
