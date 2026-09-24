// The one seam between the recruiter UI and its data.
//
// demo  → searches the generated pool in lib/talent/demoPool.js.
// live  → reads the existing employer API (no backend changes): every page of
//         `GET /candidates` (people Mzobs shared with THIS company), and
//         `GET /jobs` for job-based search and the Job filter. There is no
//         cross-company talent index in the backend, so live search covers the
//         company's shared candidates; when a `GET /talent/search` exists,
//         replace `loadPool()` here — nothing else in the UI changes.

import { apiClient } from '../lib/api'
import { IS_DEMO } from '../lib/config'
import { DEMO_POOL } from '../lib/talent/demoPool'
import { rankPool, similarTo, computeMatch, computeTrust } from '../lib/talent/engine'
import { setVocabularyFrom } from '../lib/talent/vocab'
import { readLocalJobs } from '../lib/localJobs'

const DEMO_LATENCY = 320
const wait = (ms) => new Promise((r) => setTimeout(r, ms))

// ---- live mapping ---------------------------------------------------------

function firstNumber(s) {
  const m = String(s ?? '').replace(/,/g, '').match(/(\d+(?:\.\d+)?)/)
  return m ? Number(m[1]) : null
}

/** "₹500000" → 5, "8" → 8, "12 LPA" → 12. Backend stores annual rupees or lakhs depending on the source. */
export function toLpa(s) {
  const n = firstNumber(s)
  if (n == null) return null
  return n >= 1000 ? Math.round((n / 100000) * 10) / 10 : n
}

/** "Immediate" → 0, "15 days" → 15, "2 months" → 60, "30" → 30, "" → null (unknown, never guessed). */
export function toNoticeDays(s) {
  const t = String(s ?? '').toLowerCase()
  if (!t.trim()) return null
  if (/immediate|now|none/.test(t)) return 0
  const n = firstNumber(t)
  if (n == null) return null
  if (/month/.test(t)) return n * 30
  if (/week/.test(t)) return n * 7
  return n
}

const daysSince = (iso) => (iso ? Math.max(0, Math.floor((Date.now() - new Date(iso).getTime()) / 86400000)) : null)

/** Maps an API `Candidate` (Backend/src/models/Candidate.js) to the UI shape. Unknown → null/empty, never invented. */
export function mapApiCandidate(c, jobTitles = {}) {
  const hist = (c.workHistory ?? []).map((w) => {
    const yrs = String(w.duration ?? '').match(/(\d{4})\D+(\d{4}|present|current|now)/i)
    return { role: w.role, company: w.company, startYear: yrs ? Number(yrs[1]) : null, endYear: yrs && /\d/.test(yrs[2]) ? Number(yrs[2]) : null, duration: w.duration, skills: [], location: '' }
  })
  const filled = [c.headline, c.location, c.skills?.length, c.education?.length, c.workHistory?.length, c.projects?.length, c.expectedSalary, c.portfolioLink, c.hasVideoIntro]
  return {
    id: c.id,
    name: c.name,
    initials: c.initials,
    designation: c.headline || c.appliedFor || '',
    appliedFor: c.appliedFor || '',
    currentCompany: hist[0]?.company ?? '',
    experienceYears: c.experienceYears ?? 0,
    currentSalaryLPA: null,
    expectedSalaryLPA: toLpa(c.expectedSalary),
    location: c.location ?? '',
    preferredLocations: c.location ? [c.location] : [],
    noticePeriodDays: toNoticeDays(c.availability),
    skills: c.skills ?? [],
    industry: '',
    companyType: '',
    workMode: '',
    employmentType: '',
    education: (c.education ?? []).map((e) => ({ degree: e.degree, institute: e.institute, year: Number(e.year) || null })),
    workHistory: hist,
    projects: (c.projects ?? []).map((p) => ({ name: p.name, description: p.description })),
    certifications: c.certificates ? [`${c.certificates} certificate${c.certificates === 1 ? '' : 's'} on profile`] : [],
    languages: [],
    summary: '',
    hasPortfolio: !!(c.hasPortfolio || c.portfolioLink),
    portfolioLink: c.portfolioLink || '',
    hasVideo: !!c.hasVideoIntro,
    // The backend records when a profile was shared with the company, not when the candidate was last active.
    lastActiveDaysAgo: null,
    resumeUpdatedDaysAgo: null,
    sharedDaysAgo: daysSince(c.sharedOn ?? c.createdAt),
    profileCompleteness: Math.round((filled.filter(Boolean).length / filled.length) * 100),
    verification: {
      identity: c.identityVerified ? 'verified' : 'none',
      phone: 'none',
      email: 'none',
      education: 'none',
      employment: 'none',
      resumeConsistency: c.resumeVerified ? 'verified' : 'none',
    },
    source: c.source ?? 'Mzobs Verified Pool',
    jobId: c.jobId ?? null,
    jobTitle: jobTitles[c.jobId] ?? c.appliedFor ?? '',
    stage: c.stage ?? 'shared',
    rejectionReason: c.rejectionReason ?? null,
    contact: c.unlocked ? { email: c.email, phone: c.phone } : null,
    _live: { stage: c.stage, unlocked: !!c.unlocked, contactPreview: c.contactPreview },
  }
}

// ---- pool ----------------------------------------------------------------

/** What the loaded data can actually be filtered/sorted on — drives which filters the UI offers. */
export function poolMeta(pool, jobs = []) {
  const any = (fn) => pool.some(fn)
  const jobIds = new Set(pool.map((c) => c.jobId).filter(Boolean))
  return {
    total: pool.length,
    notice: any((c) => c.noticePeriodDays != null),
    salary: any((c) => c.expectedSalaryLPA != null),
    industry: any((c) => c.industry),
    companyType: any((c) => c.companyType),
    workMode: any((c) => c.workMode),
    activity: any((c) => c.lastActiveDaysAgo != null),
    resumeDate: any((c) => c.resumeUpdatedDaysAgo != null),
    contactVerified: any((c) => c.verification.phone !== 'none' || c.verification.email !== 'none'),
    education: any((c) => c.education.length),
    company: any((c) => c.currentCompany),
    prevCompany: any((c) => c.workHistory.length > 1),
    designation: any((c) => c.designation),
    department: any((c) => c.department),
    employmentType: any((c) => c.employmentType),
    gender: any((c) => c.gender),
    languages: any((c) => c.languages?.length),
    certifications: any((c) => c.certifications?.length),
    currentSalary: any((c) => c.currentSalaryLPA != null),
    gradYear: any((c) => c.education.some((e) => e.year)),
    institute: any((c) => c.education.some((e) => e.institute)),
    degree: any((c) => c.education.some((e) => e.degree)),
    relocation: any((c) => c.relocationOk != null || c.preferredLocations.length > 1),
    portfolio: any((c) => c.hasPortfolio),
    video: any((c) => c.hasVideo),
    pipeline: !IS_DEMO,
    jobs: IS_DEMO ? [] : jobs.filter((j) => jobIds.has(j.id)).map((j) => ({ id: j.id, title: j.title })),
    stages: [...new Set(pool.map((c) => c.stage).filter(Boolean))],
  }
}

let pool = null // { rows, jobs, at }
let poolPromise = null
const cache = new Map()
const POOL_TTL = 5 * 60_000

async function fetchAllCandidates() {
  const limit = 200
  const rows = []
  for (let page = 1; page <= 25; page++) {
    const r = await apiClient.get('/candidates', { params: { page, limit } })
    rows.push(...r.data)
    const total = Number(r.headers['x-total-count'] ?? rows.length)
    if (rows.length >= total || r.data.length < limit) break
  }
  return rows
}

async function fetchJobs() {
  const rows = []
  for (let page = 1; page <= 10; page++) {
    const r = await apiClient.get('/jobs', { params: { page, limit: 200 } })
    rows.push(...r.data)
    if (rows.length >= Number(r.headers['x-total-count'] ?? rows.length) || r.data.length < 200) break
  }
  return rows
}

function loadPool(force = false) {
  if (IS_DEMO) return wait(DEMO_LATENCY).then(() => ({ rows: DEMO_POOL, jobs: [], at: Date.now() }))
  if (!force && pool && Date.now() - pool.at < POOL_TTL) return Promise.resolve(pool)
  if (!force && poolPromise) return poolPromise
  poolPromise = Promise.all([fetchAllCandidates(), fetchJobs().catch(() => [])])
    .then(([cands, jobs]) => {
      const titles = Object.fromEntries(jobs.map((j) => [j.id, j.title]))
      const rows = cands.map((c) => mapApiCandidate(c, titles))
      setVocabularyFrom(rows)
      pool = { rows, jobs, at: Date.now() }
      cache.clear()
      return pool
    })
    .finally(() => {
      poolPromise = null
    })
  return poolPromise
}

/** Drops cached data (after unlock / stage change) so the next read is fresh. */
export function invalidatePool() {
  pool = null
  cache.clear()
}

export async function refreshPool() {
  invalidatePool()
  return getPoolMeta(true)
}

export async function getPoolMeta(force = false) {
  const p = await loadPool(force)
  if (IS_DEMO) setVocabularyFrom(p.rows)
  return { ...poolMeta(p.rows, p.jobs), syncedAt: p.at }
}

// ---- search ---------------------------------------------------------------

const CACHE_TTL = 60_000

/**
 * @returns {Promise<{items: {candidate, match, trust}[], total:number, page:number, hasMore:boolean}>}
 */
export async function searchTalent(criteria, { sort = 'relevance', page = 1, pageSize = 20, exclude = null } = {}) {
  const k = JSON.stringify([criteria, sort, exclude ? [...exclude].sort() : null])
  let hit = cache.get(k)
  if (!hit || Date.now() - hit.at > CACHE_TTL) {
    const p = await loadPool()
    hit = { at: Date.now(), rows: rankPool(p.rows, criteria, sort, exclude) }
    cache.set(k, hit)
    if (cache.size > 40) cache.delete(cache.keys().next().value)
  }
  const start = (page - 1) * pageSize
  return { items: hit.rows.slice(start, start + pageSize), total: hit.rows.length, page, hasMore: start + pageSize < hit.rows.length }
}

export async function getTalent(id) {
  const p = await loadPool()
  return p.rows.find((c) => c.id === id) ?? null
}

export async function getTalentMany(ids) {
  const p = await loadPool()
  const byId = new Map(p.rows.map((c) => [c.id, c]))
  return ids.map((id) => byId.get(id)).filter(Boolean)
}

export async function findSimilar(id, limit = 6) {
  const p = await loadPool()
  const target = p.rows.find((c) => c.id === id)
  if (!target) return []
  return similarTo(p.rows, target, limit).map(({ candidate, score }) => ({ candidate, score, trust: computeTrust(candidate) }))
}

export function scoreCandidate(candidate, criteria) {
  return { match: computeMatch(candidate, criteria), trust: computeTrust(candidate) }
}

// ---- jobs (job-based talent search) ----------------------------------------

const DEMO_JOBS = [
  { id: 'job-demo-1', title: 'Senior Python Developer', requiredSkills: ['Python', 'FastAPI', 'AWS'], preferredSkills: ['PostgreSQL', 'Docker'], experienceMin: 4, experienceMax: 8, locations: ['Bengaluru'], salaryMaxLPA: 30, education: 'B.Tech', noticeMax: 45 },
  { id: 'job-demo-2', title: 'React Developer', requiredSkills: ['React', 'TypeScript'], preferredSkills: ['Next.js', 'Jest'], experienceMin: 2, experienceMax: 5, locations: ['Hyderabad', 'Pune'], salaryMaxLPA: 22, education: '', noticeMax: 30 },
  { id: 'job-demo-3', title: 'DevOps Engineer', requiredSkills: ['AWS', 'Docker', 'Kubernetes'], preferredSkills: ['Terraform'], experienceMin: 3, experienceMax: 7, locations: ['Bengaluru', 'Delhi NCR'], salaryMaxLPA: 28, education: '', noticeMax: 60 },
]

/** Backend job → Job Talent shape. Salary is annual rupees in the API. */
export function mapApiJob(j) {
  const lpa = (n) => (n == null ? null : n >= 1000 ? Math.round((n / 100000) * 10) / 10 : n)
  return {
    id: j.id,
    title: j.title,
    status: j.status,
    requiredSkills: j.skills ?? [],
    preferredSkills: [],
    experienceMin: j.experienceMin,
    experienceMax: j.experienceMax,
    locations: j.location && !/^remote$/i.test(j.location) ? [j.location] : [],
    workMode: j.workMode,
    salaryMaxLPA: lpa(j.salaryMax),
    education: '',
    noticeMax: null,
  }
}

export async function listJobs() {
  if (IS_DEMO) return [...readLocalJobs().map(mapApiJob), ...DEMO_JOBS]
  const p = await loadPool()
  return p.jobs.map(mapApiJob)
}
