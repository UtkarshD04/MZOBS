import { PUBLIC_JOBS_API_URL } from './config'

function buildQueryString(params = {}) {
  const qs = new URLSearchParams()
  Object.entries(params).forEach(([key, value]) => {
    if (value == null || value === '') return
    if (Array.isArray(value)) {
      if (value.length) qs.set(key, value.join(','))
      return
    }
    qs.set(key, String(value))
  })
  return qs.toString()
}

// Fetches jobs admin/ops have approved and pushed live, filtered server-side
// — powers the home page's "Latest jobs" section for both the default
// (unfiltered) view and every search entry point (hero search, quick-
// discovery pills, the Filters panel). No auth — this is the same public
// feed anyone hitting the marketing site can see. `params` maps 1:1 onto
// Backend's parseJobFilters (see Backend/src/utils/jobQueryFilters.js):
// q, location, experience, workMode, salary, employmentType, track,
// postedWithin, sort, page, limit.
//
// Returns `{ jobs, total }` — `total` comes off the X-Total-Count response
// header (the full match count; `jobs` itself is capped to `limit`), used
// for the "N jobs found" result summary.
export async function fetchLatestJobs(params = {}, { signal } = {}) {
  const qs = buildQueryString(params)
  const res = await fetch(`${PUBLIC_JOBS_API_URL}${qs ? `?${qs}` : ''}`, { signal })
  if (!res.ok) throw new Error('Failed to load latest jobs')
  const jobs = await res.json()
  const total = Number(res.headers.get('X-Total-Count'))
  return { jobs, total: Number.isFinite(total) ? total : jobs.length }
}

// One job, by id — backs the standalone job description page
// (pages/JobDetail.jsx) when it has no router-state job to show (a direct
// link or a refresh). Returns null on a 404 (unknown id, or a job that's no
// longer candidate-visible) instead of throwing, since "not found" is a
// normal, expected outcome here, not a fetch failure.
export async function fetchJobById(id, { signal } = {}) {
  const res = await fetch(`${PUBLIC_JOBS_API_URL}/${encodeURIComponent(id)}`, { signal })
  if (res.status === 404) return null
  if (!res.ok) throw new Error('Failed to load job')
  return res.json()
}

// Job title/skill/company and city/location autocomplete for the home-page
// search bar — see Backend's getPublicJobSuggestions
// (GET /api/jobs/suggestions). `type` is 'all' (title+skill+company,
// grouped), 'title', or 'location'.
export async function fetchJobSuggestions({ q = '', type = 'all', limit } = {}, { signal } = {}) {
  const qs = buildQueryString({ q, type, limit })
  const res = await fetch(`${PUBLIC_JOBS_API_URL}/suggestions${qs ? `?${qs}` : ''}`, { signal })
  if (!res.ok) throw new Error('Failed to load suggestions')
  const data = await res.json()
  return data.items ?? []
}

// Real, live opening counts for the home page's "Explore jobs by category"
// section — see Backend's getPublicCategoryCounts. `tracks` keys match the
// Job.track enum (tech/sales/marketing/design/hr/ops/support); `freshers`
// and `remote` are counted the same way those two tiles' own filters would
// count them (experience=0-1 / location=Remote).
export async function fetchCategoryCounts({ signal } = {}) {
  const res = await fetch(`${PUBLIC_JOBS_API_URL}/categories`, { signal })
  if (!res.ok) throw new Error('Failed to load category counts')
  return res.json()
}
