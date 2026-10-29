import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { CLIENT_ONLY_ROUTES } from './routes'
import { track } from './analytics'

const SIGNUP_AUDIENCE = {
  [CLIENT_ONLY_ROUTES.employeeSignup]: 'employee',
  [CLIENT_ONLY_ROUTES.employerSignup]: 'employer',
}

// Records a page_view on every client-side navigation (pathname only — never
// the query string), plus signup_started when a signup page is opened.
export function useRouteAnalytics() {
  const { pathname } = useLocation()
  useEffect(() => {
    track('page_view', { path: pathname })
    const audience = SIGNUP_AUDIENCE[pathname.replace(/\/+$/, '') || '/']
    if (audience) track('signup_started', { audience })
  }, [pathname])
}
