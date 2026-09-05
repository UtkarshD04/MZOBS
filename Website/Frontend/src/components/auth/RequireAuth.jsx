import { useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import { EMPLOYEE_SIGNIN_URL } from '../../lib/config'

export default function RequireAuth() {
  const token = localStorage.getItem('mzobs-employee-token')

  useEffect(() => {
    // Carries the page the visitor was headed to (e.g. a specific job to
    // apply to) through sign-in and back — EmployeeSigninForm reads this
    // same `redirect` param to send them on after login.
    if (!token) {
      const redirect = encodeURIComponent(window.location.pathname + window.location.search)
      window.location.href = `${EMPLOYEE_SIGNIN_URL}?redirect=${redirect}`
    }
  }, [token])

  if (!token) return null
  return <Outlet />
}
