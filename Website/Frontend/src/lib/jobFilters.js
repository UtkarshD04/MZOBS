// Canonical MZOBS job-filter definitions, shared between the sidebar/drawer
// UI, the URL <-> filter-state mapping, and the params sent to the server
// (which re-validates everything server-side — see Backend's
// src/utils/jobQueryFilters.js, which mirrors these same range keys).
//
// URL query params stay the single source of truth: `?q=react&location=
// Bengaluru&workMode=Remote,Hybrid&experience=1-3&salary=6-10&employmentType=
// Full-time&skills=React,JavaScript&postedWithin=7&track=tech&sort=newest`.
// Legacy marketing-site links keep working: `?q=`, `?location=Remote`,
// `?experience=0-1`, `?category=Technology`, `?jobId=`.

import { CATEGORIES } from './category'

export const WORK_MODES = ['Remote', 'Hybrid', 'On-site']
export const EMPLOYMENT_TYPES = ['Full-time', 'Part-time', 'Contract', 'Internship']

// '0-1' (rather than a plain '0') matches the value the Landing Frontend's
// "Freshers" card already links with — keeping it means that URL needs no
// server- or client-side aliasing.
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

export const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest first' },
  { value: 'salary_desc', label: 'Salary: high to low' },
  { value: 'salary_asc', label: 'Salary: low to high' },
  { value: 'relevance', label: 'Most relevant' },
]

export const DEPARTMENT_OPTIONS = Object.entries(CATEGORIES).map(([value, c]) => ({ value, label: c.label }))

const EXPERIENCE_LABELS = Object.fromEntries(EXPERIENCE_OPTIONS.map((o) => [o.value, o.label]))
const SALARY_LABELS = Object.fromEntries(SALARY_OPTIONS.map((o) => [o.value, o.label]))
const POSTED_WITHIN_LABELS = Object.fromEntries(POSTED_WITHIN_OPTIONS.map((o) => [o.value, o.label]))
const DEPARTMENT_LABELS = Object.fromEntries(DEPARTMENT_OPTIONS.map((o) => [o.value, o.label]))

export const experienceLabel = (value) => EXPERIENCE_LABELS[value] || value
export const salaryLabel = (value) => SALARY_LABELS[value] || value
export const postedWithinLabel = (value) => POSTED_WITHIN_LABELS[value] || value
export const departmentLabel = (value) => DEPARTMENT_LABELS[value] || value

export const DEFAULT_FILTERS = {
  q: '',
  location: '',
  workMode: [],
  experience: '',
  salary: '',
  employmentType: [],
  track: [],
  skills: [],
  postedWithin: '',
  company: [],
  sort: 'newest',
}

function csvParam(searchParams, key) {
  const raw = searchParams.get(key)
  if (!raw) return []
  return [...new Set(raw.split(',').map((v) => v.trim()).filter(Boolean))]
}

function singleParam(searchParams, key, allowedLabels) {
  const v = searchParams.get(key) ?? ''
  return allowedLabels[v] ? v : ''
}

export function parseFiltersFromParams(searchParams) {
  return {
    q: searchParams.get('q') ?? '',
    location: searchParams.get('location') ?? '',
    workMode: csvParam(searchParams, 'workMode').filter((v) => WORK_MODES.includes(v)),
    experience: singleParam(searchParams, 'experience', EXPERIENCE_LABELS),
    salary: singleParam(searchParams, 'salary', SALARY_LABELS),
    employmentType: csvParam(searchParams, 'employmentType').filter((v) => EMPLOYMENT_TYPES.includes(v)),
    track: csvParam(searchParams, 'track').filter((v) => DEPARTMENT_LABELS[v]),
    skills: csvParam(searchParams, 'skills'),
    postedWithin: singleParam(searchParams, 'postedWithin', POSTED_WITHIN_LABELS),
    company: csvParam(searchParams, 'company'),
    sort: SORT_OPTIONS.some((o) => o.value === searchParams.get('sort')) ? searchParams.get('sort') : 'newest',
  }
}

// Shared by both the address-bar URL and the API request — same param names,
// so the current URL is always exactly what was sent to the server.
export function toParams(filters) {
  const params = {}
  if (filters.q) params.q = filters.q
  if (filters.location) params.location = filters.location
  if (filters.workMode?.length) params.workMode = filters.workMode.join(',')
  if (filters.experience) params.experience = filters.experience
  if (filters.salary) params.salary = filters.salary
  if (filters.employmentType?.length) params.employmentType = filters.employmentType.join(',')
  if (filters.track?.length) params.track = filters.track.join(',')
  if (filters.skills?.length) params.skills = filters.skills.join(',')
  if (filters.postedWithin) params.postedWithin = filters.postedWithin
  if (filters.company?.length) params.company = filters.company.join(',')
  if (filters.sort && filters.sort !== 'newest') params.sort = filters.sort
  return params
}

export function toggleValue(list, value) {
  return list.includes(value) ? list.filter((v) => v !== value) : [...list, value]
}

export function countActiveFilters(filters) {
  let n = 0
  if (filters.location) n++
  if (filters.workMode.length) n++
  if (filters.experience) n++
  if (filters.salary) n++
  if (filters.employmentType.length) n++
  if (filters.track.length) n++
  if (filters.skills.length) n++
  if (filters.postedWithin) n++
  if (filters.company.length) n++
  return n
}

export function hasAnyFilter(filters) {
  return countActiveFilters(filters) > 0 || !!filters.q
}

// One removable chip per active selection. `clear` returns the next filters
// object with just that selection removed — the caller applies it.
export function buildFilterChips(filters, { companyNameOf } = {}) {
  const chips = []
  if (filters.q) chips.push({ id: 'q', label: `“${filters.q}”`, clear: (f) => ({ ...f, q: '' }) })
  if (filters.location) chips.push({ id: 'location', label: filters.location, clear: (f) => ({ ...f, location: '' }) })
  filters.workMode.forEach((v) => chips.push({ id: `workMode:${v}`, label: v, clear: (f) => ({ ...f, workMode: f.workMode.filter((x) => x !== v) }) }))
  if (filters.experience) chips.push({ id: 'experience', label: experienceLabel(filters.experience), clear: (f) => ({ ...f, experience: '' }) })
  if (filters.salary) chips.push({ id: 'salary', label: salaryLabel(filters.salary), clear: (f) => ({ ...f, salary: '' }) })
  filters.employmentType.forEach((v) => chips.push({ id: `employmentType:${v}`, label: v, clear: (f) => ({ ...f, employmentType: f.employmentType.filter((x) => x !== v) }) }))
  filters.track.forEach((v) => chips.push({ id: `track:${v}`, label: departmentLabel(v), clear: (f) => ({ ...f, track: f.track.filter((x) => x !== v) }) }))
  filters.skills.forEach((v) => chips.push({ id: `skills:${v}`, label: v, clear: (f) => ({ ...f, skills: f.skills.filter((x) => x !== v) }) }))
  if (filters.postedWithin) chips.push({ id: 'postedWithin', label: postedWithinLabel(filters.postedWithin), clear: (f) => ({ ...f, postedWithin: '' }) })
  filters.company.forEach((v) => chips.push({ id: `company:${v}`, label: companyNameOf?.(v) ?? v, clear: (f) => ({ ...f, company: f.company.filter((x) => x !== v) }) }))
  return chips
}

export function resultContextLabel(filters) {
  const parts = []
  if (filters.q) parts.push(`“${filters.q}”`)
  if (filters.location) parts.push(`in ${filters.location}`)
  return parts.length ? `for ${parts.join(' ')}` : ''
}
