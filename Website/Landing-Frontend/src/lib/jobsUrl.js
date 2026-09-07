import { EMPLOYEE_APP_URL } from './config'

// The real job listing (Website/Frontend's /app/jobs route, see JobMatching.jsx
// + lib/jobSearchFilters.js there) reads these same param names — `category`,
// `q`, `location`, `experience` — to filter its already-fetched job list, so
// every search entry point on this marketing site (hero search, quick-
// discovery pills, popular searches, category cards) lands pre-filtered.
export function buildJobsUrl({ q, location, experience } = {}) {
  const params = new URLSearchParams()
  if (q?.trim()) params.set('q', q.trim())
  if (location?.trim()) params.set('location', location.trim())
  if (experience) params.set('experience', experience)
  const qs = params.toString()
  return `${EMPLOYEE_APP_URL}/app/jobs${qs ? `?${qs}` : ''}`
}
