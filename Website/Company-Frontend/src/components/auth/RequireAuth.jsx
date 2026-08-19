import { Navigate, Outlet } from 'react-router-dom'

export default function RequireAuth() {
  const token = localStorage.getItem('mzobs-staff-token')
  if (!token) return <Navigate to="/login" replace />
  return <Outlet />
}
