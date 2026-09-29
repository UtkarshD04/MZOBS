import { useHiringCompanies, usePlatformStats } from './useHomeData'

// The platform's real, database-backed headline numbers as display rows —
// only those the API actually returned with a value above zero. Empty while
// loading or if the request fails; callers render nothing in that case.
export function useLiveStatRows() {
  const { data } = usePlatformStats()
  const { data: companies } = useHiringCompanies()
  return [
    { value: data?.liveJobs, label: 'Jobs open on Mzobs right now.' },
    { value: companies?.length, label: 'Companies hiring on Mzobs right now.' },
  ]
    .filter((s) => Number.isFinite(s.value) && s.value > 0)
    .map((s) => ({ number: s.value.toLocaleString('en-IN'), label: s.label }))
}
