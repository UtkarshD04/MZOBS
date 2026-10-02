import { useEffect, useState } from 'react'
import { getEmployeeSession, onEmployeeSessionChange } from './employeeSession'

// This site's signed-in employee session, read after mount (localStorage
// doesn't exist during the prerender, and the first client paint has to
// match it), kept in sync with sign-in/out in this tab and others.
export function useEmployeeSession() {
  const [session, setSession] = useState(null)

  useEffect(() => {
    setSession(getEmployeeSession())
    return onEmployeeSessionChange(() => setSession(getEmployeeSession()))
  }, [])

  return { session }
}
