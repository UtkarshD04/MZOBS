import { useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import { EMPLOYEE_SIGNIN_URL } from '../../lib/config'

export default function RequireAuth() {
  const token = localStorage.getItem('mzobs-employee-token')

  useEffect(() => {
    if (!token) window.location.href = EMPLOYEE_SIGNIN_URL
  }, [token])

  if (!token) return null
  return <Outlet />
}
