import { useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import { EMPLOYER_SIGNIN_URL } from '../../lib/config'

export default function RequireAuth() {
  const token = localStorage.getItem('mzobs-employer-token')

  useEffect(() => {
    if (!token) window.location.href = EMPLOYER_SIGNIN_URL
  }, [token])

  if (!token) return null
  return <Outlet />
}
