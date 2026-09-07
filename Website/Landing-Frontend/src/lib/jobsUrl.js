import { EMPLOYEE_APP_URL } from './config'

// The real job listing (Website/Frontend's /app/jobs route, see JobMatching.jsx
// + lib/jobFilters.js there) reads these same param names — `category`, `q`,
// `location`, `experience`, `workMode`, `salary`, `employmentType`, `track`,
// `postedWithin` — to filter its already-fetched job list, so every search
// entry point on this marketing site (hero search, quick-discovery pills,
// popular searches, category cards, the Latest jobs "Filters" panel) lands
// pre-filtered when a visitor clicks through to "View all jobs".
export function buildJobsUrl({ q, location, experience, workMode, salary, employmentType, track, postedWithin } = {}) {
  const params = new URLSearchParams()
  // q/location are multi-tag lists on this page's own search box, but the
  // dashboard's filter parsing (Website/Frontend/src/lib/jobFilters.js) only
  // understands one q/location value, not a comma list — so when several
  // tags are selected, only the first carries over. There's no clean way to
  // express "any of these" once you've left the multi-tag box behind.
  const qFirst = (Array.isArray(q) ? q[0] : q) ?? ''
  const locationFirst = (Array.isArray(location) ? location[0] : location) ?? ''
  if (qFirst.trim()) params.set('q', qFirst.trim())
  if (locationFirst.trim()) params.set('location', locationFirst.trim())
  if (experience) params.set('experience', experience)
  if (workMode?.length) params.set('workMode', workMode.join(','))
  if (salary) params.set('salary', salary)
  if (employmentType?.length) params.set('employmentType', employmentType.join(','))
  if (track?.length) params.set('track', track.join(','))
  if (postedWithin) params.set('postedWithin', postedWithin)
  const qs = params.toString()
  return `${EMPLOYEE_APP_URL}/app/jobs${qs ? `?${qs}` : ''}`
}
