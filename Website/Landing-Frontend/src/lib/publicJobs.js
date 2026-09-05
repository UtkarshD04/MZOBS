import { PUBLIC_JOBS_API_URL } from './config'

// Fetches the jobs admin/ops have approved and pushed live, for the home
// page's "Latest jobs" section. No auth — this is the same public feed
// anyone hitting the marketing site can see.
export async function fetchLatestJobs({ limit } = {}) {
  const qs = limit ? `?limit=${limit}` : ''
  const res = await fetch(`${PUBLIC_JOBS_API_URL}${qs}`)
  if (!res.ok) throw new Error('Failed to load latest jobs')
  return res.json()
}
