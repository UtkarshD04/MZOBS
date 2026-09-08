// Powers the home page's own job search — the hero search bar, quick
// discovery pills, popular searches and the full "Filters" panel
// (JobSearchHero, QuickDiscoveryStrip, JobFiltersPanel) all filter the
// "Latest jobs" section (LatestJobs.jsx) in place instead of sending the
// visitor off to the employee dashboard app. LatestJobs asks Backend's
// GET /api/jobs to do the actual filtering (see lib/publicJobs.js) — the
// option lists and labels here exist purely for the "Filters" panel's UI
// (values/labels/chip text), not for any client-side filtering of jobs.
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
