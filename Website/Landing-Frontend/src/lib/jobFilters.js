// Powers the home page's own job search — the hero search bar, quick
// discovery pills, popular searches and the full "Filters" panel
// (JobSearchHero, QuickDiscoveryStrip, JobFiltersPanel) all filter the
// "Latest jobs" section (LatestJobs.jsx) in place instead of sending the
// visitor off to the employee dashboard app. LatestJobs asks Backend's
// GET /api/jobs to do the actual filtering (see lib/publicJobs.js) — the
// option lists, labels and `matchesJobSearch` here exist for two things:
// the "Filters" panel's UI, and a client-side fallback filter over the
// curated LATEST_JOBS_DATA sample for the rare case the public API itself
// is unreachable (never mixed with real API results — see LatestJobs.jsx).
//
// Option lists and matching rules mirror Website/Frontend's own
// src/lib/jobFilters.js (the dashboard's filter sidebar) *and* Backend's
// src/utils/jobQueryFilters.js (same bucket ranges, same param names) so a
// value picked here means the same thing everywhere — including when
// "View all jobs" carries the current search into the dashboard via
// buildJobsUrl().

export const WORK_MODES = ['Remote', 'Hybrid', 'On-site']
export const EMPLOYMENT_TYPES = ['Full-time', 'Part-time', 'Contract', 'Internship']

export const EXPERIENCE_OPTIONS = [
  { value: '', label: 'Any experience' },
  { value: '0-1', label: 'Fresher · 0–1 years' },
  { value: '1-3', label: '1–3 years' },
  { value: '3-5', label: '3–5 years' },
  { value: '5-10', label: '5–10 years' },
  { value: '10+', label: '10+ years' },
]

export const SALARY_OPTIONS = [
  { value: '', label: 'Any salary' },
  { value: '0-3', label: 'Up to ₹3 LPA' },
  { value: '3-6', label: '₹3 – 6 LPA' },
  { value: '6-10', label: '₹6 – 10 LPA' },
  { value: '10-15', label: '₹10 – 15 LPA' },
  { value: '15+', label: '₹15 LPA+' },
]

export const POSTED_WITHIN_OPTIONS = [
  { value: '', label: 'Any time' },
  { value: '1', label: 'Last 24 hours' },
  { value: '3', label: 'Last 3 days' },
  { value: '7', label: 'Last 7 days' },
  { value: '30', label: 'Last 30 days' },
]

// Keys match Website/Frontend's lib/category.js CATEGORIES / job.track.
export const DEPARTMENT_OPTIONS = [
  { value: 'tech', label: 'Engineering' },
  { value: 'sales', label: 'Sales & BD' },
  { value: 'marketing', label: 'Marketing' },
  { value: 'analytics', label: 'Analytics & Data' },
  { value: 'design', label: 'Design & Creative' },
  { value: 'hr', label: 'HR & Recruitment' },
  { value: 'ops', label: 'Operations' },
  { value: 'support', label: 'Customer Success' },
]

const EXPERIENCE_LABELS = Object.fromEntries(EXPERIENCE_OPTIONS.map((o) => [o.value, o.label]))
const SALARY_LABELS = Object.fromEntries(SALARY_OPTIONS.map((o) => [o.value, o.label]))
const POSTED_WITHIN_LABELS = Object.fromEntries(POSTED_WITHIN_OPTIONS.map((o) => [o.value, o.label]))
const DEPARTMENT_LABELS = Object.fromEntries(DEPARTMENT_OPTIONS.map((o) => [o.value, o.label]))

export const experienceLabel = (value) => EXPERIENCE_LABELS[value] || value
export const salaryLabel = (value) => SALARY_LABELS[value] || value
export const postedWithinLabel = (value) => POSTED_WITHIN_LABELS[value] || value
export const departmentLabel = (value) => DEPARTMENT_LABELS[value] || value

// q and location are each a *list* of terms — the home-page search box lets
// a visitor tag on several job titles/skills/companies, or several
// cities/"Remote", and searches for a job matching any one of them (OR),
// same as Backend's parseJobFilters (jobQueryFilters.js).
export const DEFAULT_FILTERS = {
  q: [],
  location: [],
  experience: '',
  workMode: [],
  salary: '',
  employmentType: [],
  track: [],
  postedWithin: '',
}

export function toggleValue(list, value) {
  return list.includes(value) ? list.filter((v) => v !== value) : [...list, value]
}

// '10+' style values are open-ended on the top end; plain 'a-b' values parse
// straight into { min, max }. Shared by the experience (years) and salary
// (lakhs) buckets, which use the same "a-b" / "n+" shape.
function parseRange(value) {
  if (!value) return null
  if (value.endsWith('+')) return { min: Number(value.slice(0, -1)), max: Infinity }
  const match = /^(\d+(?:\.\d+)?)-(\d+(?:\.\d+)?)$/.exec(value)
  if (!match) return null
  return { min: Number(match[1]), max: Number(match[2]) }
}

function rangesOverlap(aMin, aMax, bMin, bMax) {
  return aMax >= bMin && (!Number.isFinite(bMax) || aMin <= bMax)
}

export function matchesJobSearch(job, filters = {}) {
  const { q = [], location = [], experience, workMode = [], salary, employmentType = [], track = [], postedWithin } = filters

  if (q.length) {
    const haystack = [job.title, job.company, ...(job.skills ?? [])].join(' ').toLowerCase()
    if (!q.some((term) => haystack.includes(term.trim().toLowerCase()))) return false
  }

  if (location.length) {
    // "Remote"/"Hybrid"/"On-site" come in through this same param
    // (QuickDiscoveryStrip's "Remote jobs" pill, CATEGORY_DATA's Remote Jobs
    // card) even though they describe workMode, not the location string —
    // match either field. A job matches if ANY selected term matches.
    const jobLocation = (job.location ?? '').toLowerCase()
    const jobWorkMode = (job.workMode ?? '').toLowerCase()
    const matches = location.some((term) => {
      const needle = term.trim().toLowerCase()
      return jobLocation.includes(needle) || jobWorkMode === needle
    })
    if (!matches) return false
  }

  if (experience) {
    const range = parseRange(experience)
    // Jobs with no numeric experience data (the curated fallback sample —
    // see LATEST_JOBS_DATA) are never excluded by this filter, only real
    // jobs the public feed has real min/max years for.
    if (range && job.experienceMin != null && job.experienceMax != null) {
      if (!rangesOverlap(job.experienceMin, job.experienceMax, range.min, range.max)) return false
    }
  }

  if (workMode.length && !workMode.includes(job.workMode)) return false
  if (employmentType.length && !employmentType.includes(job.employmentType)) return false
  if (track.length && !track.includes(job.track)) return false

  if (salary) {
    const range = parseRange(salary)
    if (range && job.salaryMin != null && job.salaryMax != null) {
      // Bucket bounds are in lakhs, job.salaryMin/Max are raw rupees.
      if (!rangesOverlap(job.salaryMin, job.salaryMax, range.min * 100000, Number.isFinite(range.max) ? range.max * 100000 : Infinity)) return false
    }
  }

  if (postedWithin) {
    const days = Number(postedWithin)
    if (Number.isFinite(days) && job.postedDaysAgo != null && job.postedDaysAgo > days) return false
  }

  return true
}

export function countActiveFilters(filters = {}) {
  let n = 0
  if (filters.q?.length) n++
  if (filters.location?.length) n++
  if (filters.experience) n++
  if (filters.workMode?.length) n++
  if (filters.salary) n++
  if (filters.employmentType?.length) n++
  if (filters.track?.length) n++
  if (filters.postedWithin) n++
  return n
}

export function hasActiveFilters(filters) {
  return countActiveFilters(filters) > 0
}

// One removable chip per active selection — click clears just that one
// filter and hands the caller the next filters object to apply.
export function buildFilterChips(filters = {}) {
  const chips = []
  ;(filters.q ?? []).forEach((v) =>
    chips.push({ id: `q:${v}`, label: `“${v}”`, clear: (f) => ({ ...f, q: f.q.filter((x) => x !== v) }) })
  )
  ;(filters.location ?? []).forEach((v) =>
    chips.push({ id: `location:${v}`, label: v, clear: (f) => ({ ...f, location: f.location.filter((x) => x !== v) }) })
  )
  if (filters.experience) chips.push({ id: 'experience', label: experienceLabel(filters.experience), clear: (f) => ({ ...f, experience: '' }) })
  ;(filters.workMode ?? []).forEach((v) =>
    chips.push({ id: `workMode:${v}`, label: v, clear: (f) => ({ ...f, workMode: f.workMode.filter((x) => x !== v) }) })
  )
  if (filters.salary) chips.push({ id: 'salary', label: salaryLabel(filters.salary), clear: (f) => ({ ...f, salary: '' }) })
  ;(filters.employmentType ?? []).forEach((v) =>
    chips.push({ id: `employmentType:${v}`, label: v, clear: (f) => ({ ...f, employmentType: f.employmentType.filter((x) => x !== v) }) })
  )
  ;(filters.track ?? []).forEach((v) =>
    chips.push({ id: `track:${v}`, label: departmentLabel(v), clear: (f) => ({ ...f, track: f.track.filter((x) => x !== v) }) })
  )
  if (filters.postedWithin) chips.push({ id: 'postedWithin', label: postedWithinLabel(filters.postedWithin), clear: (f) => ({ ...f, postedWithin: '' }) })
  return chips
}
