import { EXPERIENCE_OPTIONS, SALARY_OPTIONS, POSTED_WITHIN_OPTIONS, DEPARTMENT_OPTIONS, experienceLabel, salaryLabel, postedWithinLabel, departmentLabel } from './jobFilters'

// Filter state for the home page's job marketplace (JobMarketplace.jsx). Every
// group except freshness and "my experience" is multi-select, Naukri-style, and
// the whole thing maps 1:1 onto Backend's GET /api/jobs (and /api/jobs/facets)
// query params, so what you tick is exactly what the server filters on.

export const MARKETPLACE_DEFAULTS = {
  tracks: [], // department  -> track
  jobTypes: [], // employmentType
  workModes: [], // workMode
  experience: [], // ranges: '0-1' | '1-3' | ...
  experienceYears: null, // "my experience is N years" -> jobs whose range contains N
  salary: [], // ranges: '0-3' | '3-6' | ...
  location: [], // city labels
  company: [], // company ids
  postedWithin: '', // '1' | '3' | '7' | '15' | '30'
}

export const MAX_EXPERIENCE_YEARS = 30

export const SORT_CHOICES = [
  { key: 'relevance', label: 'Relevance' },
  { key: 'newest', label: 'Newest' },
  { key: 'salary_desc', label: 'Highest salary' },
  { key: 'salary_asc', label: 'Lowest salary' },
  { key: 'nearest', label: 'Nearest to me' },
]

export const EXPERIENCE_CHOICES = EXPERIENCE_OPTIONS.filter((o) => o.value)
export const SALARY_CHOICES = SALARY_OPTIONS.filter((o) => o.value)
export const POSTED_CHOICES = POSTED_WITHIN_OPTIONS.filter((o) => o.value)
export const DEPARTMENT_CHOICES = DEPARTMENT_OPTIONS

export function toggleIn(list, value) {
  return list.includes(value) ? list.filter((v) => v !== value) : [...list, value]
}

// Params shared by the job list and the facet counts (never sort/page/limit —
// counts don't depend on those).
export function filterParams(state, search) {
  return {
    q: search?.trim() ? [search.trim()] : [],
    location: state.location,
    experience: state.experience,
    experienceYears: state.experienceYears,
    workMode: state.workModes,
    salary: state.salary,
    employmentType: state.jobTypes,
    track: state.tracks,
    company: state.company,
    postedWithin: state.postedWithin,
  }
}

// `coords` is only sent for "Nearest to me" — the backend ignores lat/lng otherwise.
export function listParams(state, { search, sort, coords, limit, page }) {
  const params = { ...filterParams(state, search), sort, limit, page }
  if (sort === 'nearest' && coords) {
    params.lat = coords.lat
    params.lng = coords.lng
  }
  return params
}

export function countMarketplaceFilters(state) {
  return (
    state.tracks.length +
    state.jobTypes.length +
    state.workModes.length +
    state.experience.length +
    (state.experienceYears != null ? 1 : 0) +
    state.salary.length +
    state.location.length +
    state.company.length +
    (state.postedWithin ? 1 : 0)
  )
}

// One removable chip per applied value; `clear` returns the next state.
export function marketplaceChips(state, { companyNameOf } = {}) {
  const chips = []
  const multi = (key, values, labelOf) =>
    values.forEach((v) => chips.push({ id: `${key}:${v}`, label: labelOf(v), clear: (s) => ({ ...s, [key]: s[key].filter((x) => x !== v) }) }))
  multi('tracks', state.tracks, departmentLabel)
  multi('workModes', state.workModes, (v) => v)
  multi('jobTypes', state.jobTypes, (v) => v)
  multi('experience', state.experience, experienceLabel)
  if (state.experienceYears != null) {
    const n = state.experienceYears
    chips.push({ id: 'experienceYears', label: `${n} ${n === 1 ? 'yr' : 'yrs'} experience`, clear: (s) => ({ ...s, experienceYears: null }) })
  }
  multi('salary', state.salary, salaryLabel)
  multi('location', state.location, (v) => v)
  multi('company', state.company, (v) => companyNameOf?.(v) ?? 'Company')
  if (state.postedWithin) chips.push({ id: 'postedWithin', label: postedWithinLabel(state.postedWithin), clear: (s) => ({ ...s, postedWithin: '' }) })
  return chips
}

export function countFor(rows, value) {
  return rows?.find((r) => String(r.value) === String(value))?.count
}
