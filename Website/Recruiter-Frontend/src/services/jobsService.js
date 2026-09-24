// Job posting on top of the existing employer API (Backend/src/routes/jobRoutes.js):
//   GET/POST /jobs, GET/PUT /jobs/:id, PATCH /jobs/:id/status,
//   POST /jobs/:id/duplicate, DELETE /jobs/:id
// Demo mode keeps jobs in localStorage with the same shape.
//
// Salaries are annual rupees in the API; the form works in LPA and converts here.

import axios from 'axios'
import { apiClient } from '../lib/api'
import { IS_DEMO, LANDING_APP_URL, API_URL } from '../lib/config'
import { readLocalJobs, writeLocalJobs } from '../lib/localJobs'
import { invalidatePool } from './talentService'

export const FEE_PER_OPENING = 2000 // mirrors Backend/src/utils/jobPricing.js — the server's feeTotal is authoritative
export const RESUMES_PER_OPENING = 5

export const EMPLOYMENT_TYPES = ['Full-time', 'Part-time', 'Contract', 'Internship']
export const WORK_MODES = ['On-site', 'Hybrid', 'Remote']
export const TRACKS = [
  { id: '', label: 'Not specified' },
  { id: 'tech', label: 'Tech' },
  { id: 'analytics', label: 'Analytics' },
  { id: 'design', label: 'Design' },
  { id: 'sales', label: 'Sales' },
  { id: 'marketing', label: 'Marketing' },
  { id: 'hr', label: 'HR' },
  { id: 'support', label: 'Support' },
  { id: 'ops', label: 'Operations' },
]

export const STATUS_META = {
  draft: { label: 'Draft', cls: 'bg-line-2 text-ink-2' },
  pending_review: { label: 'In review', cls: 'bg-warn-soft text-warn' },
  awaiting_payment: { label: 'Awaiting payment', cls: 'bg-warn-soft text-warn' },
  sourcing: { label: 'Live', cls: 'bg-ok-soft text-[#1a8f5a]' },
  delivered: { label: 'Delivered', cls: 'bg-blue-soft text-[#1f6fb2]' },
  closed: { label: 'Closed', cls: 'bg-line-2 text-muted' },
  archived: { label: 'Archived', cls: 'bg-line-2 text-muted' },
}

export const lpaToRupees = (lpa) => Math.round(Number(lpa) * 100000)
export const rupeesToLpa = (r) => (r == null ? '' : Math.round((r / 100000) * 100) / 100)

/** Form values → API body. */
export function toPayload(f) {
  return {
    title: f.title.trim(),
    department: f.department.trim(),
    employmentType: f.employmentType,
    experienceMin: Number(f.experienceMin),
    experienceMax: Number(f.experienceMax),
    salaryMin: lpaToRupees(f.salaryMin),
    salaryMax: lpaToRupees(f.salaryMax),
    vacancies: Number(f.vacancies),
    location: f.location.trim(),
    workMode: f.workMode,
    skills: f.skills,
    track: f.track,
    description: f.description.trim(),
    benefits: f.benefits,
    deadline: f.deadline,
  }
}

/** API job → form values. */
export function toForm(j) {
  return {
    title: j.title ?? '',
    department: j.department ?? '',
    employmentType: j.employmentType ?? 'Full-time',
    experienceMin: j.experienceMin ?? 0,
    experienceMax: j.experienceMax ?? 2,
    salaryMin: rupeesToLpa(j.salaryMin),
    salaryMax: rupeesToLpa(j.salaryMax),
    vacancies: j.vacancies ?? 1,
    location: j.location ?? '',
    workMode: j.workMode ?? 'Hybrid',
    skills: j.skills ?? [],
    track: j.track ?? '',
    description: j.description ?? '',
    benefits: j.benefits ?? [],
    deadline: j.deadline ?? '',
  }
}

export function validate(f) {
  const e = {}
  if (!f.title.trim()) e.title = 'Add a job title'
  if (!f.department.trim()) e.department = 'Add a department'
  if (!f.location.trim()) e.location = 'Add a location'
  if (f.experienceMin === '' || f.experienceMax === '' || Number(f.experienceMin) > Number(f.experienceMax)) e.experience = 'Minimum experience can’t exceed maximum'
  if (f.salaryMin === '' || f.salaryMax === '' || Number(f.salaryMin) > Number(f.salaryMax)) e.salary = 'Enter a salary range (minimum ≤ maximum)'
  if (!(Number(f.vacancies) >= 1)) e.vacancies = 'At least 1 opening'
  if (f.description.trim().length < 30) e.description = 'Describe the role in at least 30 characters'
  if (!f.deadline) e.deadline = 'Pick an application deadline'
  else if (f.deadline < new Date().toISOString().slice(0, 10)) e.deadline = 'Deadline is in the past'
  return e
}

const nowIso = () => new Date().toISOString()

function localCreate(body, publish) {
  const job = {
    id: `local-${Date.now().toString(36)}`,
    ...body,
    status: publish ? 'sourcing' : 'draft',
    feeTotal: body.vacancies * FEE_PER_OPENING,
    feeStatus: 'unpaid',
    resumesPromised: body.vacancies * RESUMES_PER_OPENING,
    candidatesShared: 0,
    postedOn: publish ? nowIso() : null,
    updatedOn: nowIso(),
  }
  writeLocalJobs([job, ...readLocalJobs()])
  return job
}

function localPatch(id, patch) {
  let out
  writeLocalJobs(readLocalJobs().map((j) => (j.id === id ? (out = { ...j, ...patch, updatedOn: nowIso() }) : j)))
  return out
}

export async function listMyJobs() {
  if (IS_DEMO) return readLocalJobs()
  const rows = []
  for (let page = 1; page <= 10; page++) {
    const r = await apiClient.get('/jobs', { params: { page, limit: 200 } })
    rows.push(...r.data)
    if (rows.length >= Number(r.headers['x-total-count'] ?? rows.length) || r.data.length < 200) break
  }
  return rows
}

export async function getJob(id) {
  if (IS_DEMO) return readLocalJobs().find((j) => j.id === id) ?? null
  return apiClient.get(`/jobs/${id}`).then((r) => r.data)
}

/** Saves a draft, or publishes straight away when `publish` is true (same as the employer portal: no approval step). */
export async function createJob(body, publish) {
  if (IS_DEMO) return localCreate(body, publish)
  const r = await apiClient.post('/jobs', { ...body, status: publish ? 'pending_review' : 'draft' })
  invalidatePool()
  return r.data
}

export async function updateJob(id, body) {
  if (IS_DEMO) return localPatch(id, body)
  const r = await apiClient.put(`/jobs/${id}`, body)
  invalidatePool()
  return r.data
}

export async function setJobStatus(id, status) {
  if (IS_DEMO) return localPatch(id, { status: status === 'pending_review' ? 'sourcing' : status, ...(status === 'pending_review' ? { postedOn: nowIso() } : {}) })
  const r = await apiClient.patch(`/jobs/${id}/status`, { status })
  invalidatePool()
  return r.data
}

export async function duplicateJob(id) {
  if (IS_DEMO) {
    const src = readLocalJobs().find((j) => j.id === id)
    return localCreate({ ...src, title: `${src.title} (Copy)` }, false)
  }
  const r = await apiClient.post(`/jobs/${id}/duplicate`)
  invalidatePool()
  return r.data
}

export async function deleteJob(id) {
  if (IS_DEMO) return writeLocalJobs(readLocalJobs().filter((j) => j.id !== id))
  await apiClient.delete(`/jobs/${id}`)
  invalidatePool()
}

/** Human message for an API failure, including the plan-required case. */
export function jobError(e) {
  const d = e.response?.data
  if (d?.code === 'EMPLOYER_SUBSCRIPTION_REQUIRED') return { plan: true, message: d.message }
  return { plan: false, message: d?.message ?? 'Something went wrong. Please try again.' }
}

/**
 * Ids of this company's jobs that candidates can actually see right now, read
 * from the public job feed (`GET /api/jobs`) — the same source the candidate
 * app and marketing site list from, so this confirms a posting really is live
 * there rather than assuming it.
 */
// The public feed lives beside the employer API (…/api/employer → …/api), so this works behind the dev proxy and against an absolute production URL alike.
const PUBLIC_API = API_URL.replace(/\/employer\/?$/, '')

export async function listPublicJobIds() {
  if (IS_DEMO) return new Set()
  const ids = new Set()
  // The public feed caps page size (currently 20), so page by the server's own headers.
  for (let page = 1; page <= 50; page++) {
    const r = await axios.get(`${PUBLIC_API}/jobs`, { params: { page, limit: 100 }, timeout: 15000 })
    const rows = Array.isArray(r.data) ? r.data : r.data.jobs ?? []
    rows.forEach((j) => ids.add(j.id))
    if (!rows.length || ids.size >= Number(r.headers['x-total-count'] ?? 0)) break
  }
  return ids
}

export const publicJobUrl = (id) => `${LANDING_APP_URL}/jobs/${id}`
