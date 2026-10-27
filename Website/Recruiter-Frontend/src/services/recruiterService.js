// Recruiter workspace API (applicants pipeline, overview, scorecards, team, managed shortlisting, insights, messages).
// Live mode only: demo mode has no backend for these, so pages show an explanatory empty state.
import { useEffect, useState } from 'react'
import { apiClient } from '../lib/api'

const data = (r) => r.data

export const PIPELINE = [
  { key: 'new', label: 'New' },
  { key: 'reviewed', label: 'Reviewed' },
  { key: 'shortlisted', label: 'Shortlisted' },
  { key: 'interview', label: 'Interview' },
  { key: 'offer', label: 'Offer' },
  { key: 'hired', label: 'Hired' },
  { key: 'rejected', label: 'Rejected' },
]
export const STAGE_LABEL = Object.fromEntries(PIPELINE.map((s) => [s.key, s.label]))

export const apiMessage = (e, fallback = 'Something went wrong. Please try again.') => e?.response?.data?.message ?? (e?.response ? fallback : 'No response from the server. Check your connection and try again.')

// ---- overview
export const getOverview = () => apiClient.get('/overview').then(data)

// ---- applicants
export const getApplicantsSummary = () => apiClient.get('/applicants/summary').then(data)
export const listApplicants = (params) => apiClient.get('/applicants', { params }).then(data)
export const getApplicant = (id) => apiClient.get(`/applicants/${id}`).then(data)
export const moveApplicant = (id, stage) => apiClient.post(`/applicants/${id}/stage`, { stage }).then(data)
export const bulkUpdateApplicants = (body) => apiClient.post('/applicants/bulk', body).then(data)
export const updateApplicant = (id, body) => apiClient.patch(`/applicants/${id}`, body).then(data)
export const addApplicantNote = (id, text) => apiClient.post(`/applicants/${id}/notes`, { text }).then(data)
export const rejectApplicant = (id, body) => apiClient.post(`/applicants/${id}/reject`, body).then(data)
export const getRejectionOptions = () => apiClient.get('/applicants/rejection-options').then(data)
export async function exportApplicants(jobId) {
  const r = await apiClient.get('/applicants/export', { params: { jobId }, responseType: 'blob' })
  const url = URL.createObjectURL(r.data)
  const a = document.createElement('a')
  a.href = url
  a.download = 'applicants.csv'
  document.body.appendChild(a)
  a.click()
  a.remove()
  URL.revokeObjectURL(url)
}
export const compareApplicants = (ids) => apiClient.post('/applicants/compare', { ids }).then(data)

// ---- interviews
export const submitScorecard = (id, body) => apiClient.post(`/interviews/${id}/scorecard`, body).then(data)
export const updateInterviewPanel = (id, body) => apiClient.patch(`/interviews/${id}/panel`, body).then(data)

// ---- team & audit
export const getMe = () => apiClient.get('/team/me').then(data)
export const getRoleMatrix = () => apiClient.get('/team/roles').then(data)
export const listTeam = () => apiClient.get('/team').then(data)
export const inviteMember = (body) => apiClient.post('/team/invite', body).then(data)
export const setMemberRole = (id, role) => apiClient.patch(`/team/${id}/role`, { role }).then(data)
export const removeMember = (id) => apiClient.delete(`/team/${id}`).then(data)
export const listAudit = (params) => apiClient.get('/team/audit', { params }).then(data)

// ---- offers
export const listOffers = () => apiClient.get('/offers').then(data)
export const createOffer = (body) => apiClient.post('/offers', body).then(data)
export const setOfferStatus = (id, status) => apiClient.patch(`/offers/${id}/status`, { status }).then(data)

// ---- managed shortlisting
export const listManagedRequests = (jobId) => apiClient.get('/managed-shortlist', { params: jobId ? { jobId } : undefined }).then(data)
export const createManagedRequest = (body) => apiClient.post('/managed-shortlist', body).then(data)
export const closeManagedRequest = (id) => apiClient.post(`/managed-shortlist/${id}/close`).then(data)
export const MANAGED_STEPS = [
  { key: 'requested', label: 'Requested' },
  { key: 'in_review', label: 'In review' },
  { key: 'shortlisting', label: 'Shortlisting' },
  { key: 'shortlist_shared', label: 'Shortlist shared' },
  { key: 'closed', label: 'Closed' },
]

// ---- insights & communications
export const getJobInsights = (jobId) => apiClient.get(`/jobs/${jobId}/insights`).then(data)
export const listTemplates = () => apiClient.get('/communications/templates').then(data)
export const saveTemplate = (key, body) => apiClient.put(`/communications/templates/${key}`, body).then(data)
export const resetTemplate = (key) => apiClient.delete(`/communications/templates/${key}`).then(data)
export const previewMessage = (body) => apiClient.post('/communications/preview', body).then(data)
export const sendMessage = (body) => apiClient.post('/communications/send', body).then(data)
export const listCommLog = (candidateId) => apiClient.get('/communications/log', { params: candidateId ? { candidateId } : undefined }).then(data)

// ---- permissions
if (typeof window !== 'undefined') window.addEventListener('mzt-signed-out', () => { meCache = null })

let mePromise = null
let meCache = null
const ME_EVENT = 'mzt-me-changed'
export function loadMe({ force = false } = {}) {
  if (meCache && !force) return Promise.resolve(meCache)
  mePromise ??= getMe()
    .then((m) => {
      meCache = m
      window.dispatchEvent(new Event(ME_EVENT))
      return m
    })
    .finally(() => {
      mePromise = null
    })
  return mePromise
}
export function clearMe() {
  meCache = null
}

/** The signed-in user's role and permissions from the server. `can()` is false until they load, so nothing flashes enabled. */
export function usePermissions() {
  const [me, setMe] = useState(meCache)
  useEffect(() => {
    let live = true
    const sync = () => live && setMe(meCache)
    window.addEventListener(ME_EVENT, sync)
    loadMe().catch(() => {})
    return () => {
      live = false
      window.removeEventListener(ME_EVENT, sync)
    }
  }, [])
  return { me, role: me?.role ?? null, loaded: !!me, can: (p) => !!me?.permissions?.includes(p) }
}
