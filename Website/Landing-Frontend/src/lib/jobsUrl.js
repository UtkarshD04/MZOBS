import { EMPLOYEE_APP_URL } from './config'

// The real job listing (Website/Frontend's /app/jobs route) only reads a
// `category` query param today — `q`/`location`/`experience` aren't consumed
// there yet, but passing them now means every search entry point on this
// marketing site (hero search, quick-discovery pills, popular searches) is
// forward-compatible with that page adding support later, without any
// change on this side.
export function buildJobsUrl({ q, location, experience } = {}) {
  const params = new URLSearchParams()
  if (q?.trim()) params.set('q', q.trim())
  if (location?.trim()) params.set('location', location.trim())
  if (experience) params.set('experience', experience)
  const qs = params.toString()
  return `${EMPLOYEE_APP_URL}/app/jobs${qs ? `?${qs}` : ''}`
}
