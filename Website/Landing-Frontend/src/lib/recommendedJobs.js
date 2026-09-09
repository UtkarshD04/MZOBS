import { EMPLOYEE_API_URL } from './config'
import { getEmployeeSession } from './employeeSession'

// Powers the home page's "Jobs matching your profile" section — the same
// rule-based match endpoint the dashboard app's Recommended tab uses
// (Backend's employeeRecommendationsController + jobMatching.js), so a
// visitor sees identical jobs/reasons/order whether they're on this
// marketing site or already in the app. Requires a signed-in employee
// session (this site's own localStorage one, see employeeSession.js) —
// returns [] with no session rather than throwing, since "not signed in" is
// an expected, normal state here, not a fetch failure.
export async function fetchRecommendedJobs({ sort = 'match', limit } = {}, { signal } = {}) {
  const session = getEmployeeSession()
  if (!session?.token) return []

  const res = await fetch(`${EMPLOYEE_API_URL}/jobs/recommended?${new URLSearchParams({ sort })}`, {
    headers: { Authorization: `Bearer ${session.token}` },
    signal,
  })
  if (!res.ok) throw new Error('Failed to load recommended jobs')
  const jobs = await res.json()
  return limit ? jobs.slice(0, limit) : jobs
}
