import { EMPLOYEE_API_URL } from './config'

// Authenticated employee-profile read, for the local /employees/profile page
// (Website/Frontend, which used to own this, was removed — session already
// lives in this site's own localStorage via employeeSession.js, so no
// cross-app ?token= handoff is needed here).
export async function getEmployeeProfile(token) {
  const res = await fetch(`${EMPLOYEE_API_URL}/profile`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    const error = new Error(data.message ?? 'Could not load your profile. Please try again.')
    error.status = res.status
    throw error
  }
  return data
}

export async function updateEmployeeProfile(token, fields) {
  const res = await fetch(`${EMPLOYEE_API_URL}/profile`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(fields),
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    const error = new Error(data.message ?? 'Could not save your changes. Please try again.')
    error.status = res.status
    throw error
  }
  return data
}
