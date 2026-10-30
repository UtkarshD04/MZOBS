import { useEffect, useState } from 'react'
import { fetchLatestJobs } from '../../lib/publicJobs'
import { useInitialHomeData } from '../../lib/initialHomeDataContext'

// The API sends a "Depends on…" sentence when a job has no salary range —
// that is left off, same as the rest of the site.
export function salaryText(job) {
  if (!job.salaryMin || !job.salaryMax) return ''
  const [lo, hi] = (job.salary ?? '').split(/\s*[–-]\s*/)
  return lo && lo === hi ? lo : job.salary
}

export function VerifiedBadge({ size = 16 }) {
  return (
    <svg viewBox="0 0 200 200" width={size} height={size} aria-hidden="true">
      <path d="M100 8 l20 14 24-2 8 23 21 12-5 24 12 21-17 18 2 24-23 8-12 21-24-5-21 12-18-17-24 2-8-23-21-12 5-24-12-21 17-18-2-24 23-8 12-21 24 5Z" fill="#0b7a6d" />
      <path d="M66 102 l22 22 46-48" fill="none" stroke="#ffffff" strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

// The default (unfiltered) newest jobs: seeded from the build-time prerender,
// refreshed live after mount. Feeds both the hero mockup and the job list.
export function useDefaultJobs(limit = 6) {
  const initial = useInitialHomeData()
  const [state, setState] = useState({ jobs: initial?.jobs?.slice(0, limit) ?? null, total: initial?.total ?? 0 })
  useEffect(() => {
    const controller = new AbortController()
    fetchLatestJobs({ urgent: 'exclude', sort: 'newest', limit }, { signal: controller.signal })
      .then(({ jobs, total }) => setState({ jobs, total }))
      .catch((err) => err?.name !== 'AbortError' && setState((s) => (s.jobs ? s : { jobs: [], total: 0 })))
    return () => controller.abort()
  }, [limit])
  return state
}
