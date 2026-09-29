import { useEffect, useState } from 'react'
import { fetchCategoryCounts, fetchHiringCompanies, fetchHotCities, fetchLatestJobs, fetchPlatformStats } from './publicJobs'
import { useInitialHomeData } from './initialHomeDataContext'

// Loads one home-page data source: seeded from the build-time prerender
// (`initial`, if it carried this source), then always refreshed live after
// mount. `status` is 'loading' | 'ready' | 'error'; `data` stays at the last
// good value so a failed refresh never blanks a section that already has
// real numbers.
function useLive(fetcher, initial) {
  const [data, setData] = useState(initial ?? null)
  const [status, setStatus] = useState(initial ? 'ready' : 'loading')

  useEffect(() => {
    const controller = new AbortController()
    fetcher({ signal: controller.signal })
      .then((result) => {
        setData(result)
        setStatus('ready')
      })
      .catch((err) => {
        if (err?.name === 'AbortError') return
        setStatus((s) => (s === 'ready' ? s : 'error'))
      })
    return () => controller.abort()
    // fetcher is a module-level function; it never changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return { data, status }
}

// { verifiedCandidates, verifiedEmployers, liveJobs } — real counts from the DB.
export function usePlatformStats() {
  const initial = useInitialHomeData()?.stats
  return useLive(fetchPlatformStats, initial)
}

// { tracks: { tech, sales, ... }, finance, freshers, remote }
export function useCategoryCounts() {
  const initial = useInitialHomeData()?.categories
  return useLive(fetchCategoryCounts, initial)
}

// [{ city, slug, byFilter: { all: { openings, topCategories, ... } } }]
export function useHotCities() {
  const initial = useInitialHomeData()?.hotCities
  const { data, status } = useLive(async (opts) => (await fetchHotCities(opts)).cities, initial)
  return { data, status }
}

// [{ id, name, logo, verified, activeJobs, ... }]
export function useHiringCompanies() {
  const { data, status } = useLive(async (opts) => (await fetchHiringCompanies(opts)).companies, null)
  return { data, status }
}

// Real opening counts for the categories that have no Job.track of their own
// (AI & ML, Cybersecurity) — counted by running the same keyword search a
// click on the tile runs, and reading the total it returns.
export const KEYWORD_CATEGORIES = {
  ai: ['Machine Learning', 'AI Engineer', 'ML Engineer', 'Deep Learning', 'NLP', 'Computer Vision'],
  cyber: ['Cyber', 'Information Security', 'Security Analyst', 'Security Engineer'],
}

export function useKeywordCategoryCounts() {
  const [counts, setCounts] = useState({})
  useEffect(() => {
    const controller = new AbortController()
    Object.entries(KEYWORD_CATEGORIES).forEach(([key, q]) => {
      fetchLatestJobs({ q, limit: 1 }, { signal: controller.signal })
        .then(({ total }) => setCounts((c) => ({ ...c, [key]: total })))
        .catch((err) => err?.name !== 'AbortError' && setCounts((c) => ({ ...c, [key]: null })))
    })
    return () => controller.abort()
  }, [])
  return counts
}

// Real, live open-role counts for the "Companies hiring through Mzobs"
// section's curated logo wall (see COMPANIES_HIRING_DATA in lib/content.js)
// — one company-name search per company, same total the "View company jobs"
// click on a card would return, so the number is never a fixed/illustrative
// figure. `names` should be a stable array (module-level constant is fine).
export function useCompanyJobCounts(names) {
  const [counts, setCounts] = useState({})
  useEffect(() => {
    const controller = new AbortController()
    names.forEach((name) => {
      fetchLatestJobs({ q: [name], limit: 1 }, { signal: controller.signal })
        .then(({ total }) => setCounts((c) => ({ ...c, [name]: total })))
        .catch((err) => err?.name !== 'AbortError' && setCounts((c) => ({ ...c, [name]: null })))
    })
    return () => controller.abort()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return counts
}
