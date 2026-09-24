// Thin wrappers over the existing employer API (Backend/src/routes). Live
// mode only — demo mode never calls these.
import { apiClient } from '../lib/api'
import { TOKEN_KEY } from '../lib/config'
import { invalidatePool } from './talentService'

export const login = (email, password) =>
  apiClient.post('/auth/login', { email, password }).then((r) => {
    localStorage.setItem(TOKEN_KEY, r.data.token)
    localStorage.setItem('mzt-session', JSON.stringify({ user: r.data.user, company: r.data.company }))
    return r.data
  })

export const exchangeHandoff = (code) =>
  apiClient.post('/auth/exchange', { code }).then((r) => {
    localStorage.setItem(TOKEN_KEY, r.data.token)
    localStorage.setItem('mzt-session', JSON.stringify({ user: r.data.user, company: r.data.company }))
    return r.data
  })

export function logout() {
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem('mzt-session')
}

export const getSession = () => {
  try {
    return JSON.parse(localStorage.getItem('mzt-session') ?? 'null')
  } catch {
    return null
  }
}

/** Spends 1 CV credit (idempotent) → { candidate:{email,phone,resumeUrl,...}, wallet, alreadyUnlocked } */
export const unlockCandidate = (id) =>
  apiClient.post(`/candidates/${id}/unlock`).then((r) => {
    invalidatePool()
    return r.data
  })
export const setCandidateStage = (id, stage, rejectionReason) =>
  apiClient.patch(`/candidates/${id}/stage`, { stage, rejectionReason }).then((r) => {
    invalidatePool()
    return r.data
  })
export const getCandidateResumeUrl = (id) => apiClient.get(`/candidates/${id}/resume-url`).then((r) => r.data)
export const getCredits = () => apiClient.get('/credits').then((r) => r.data)
export const listInterviews = () => apiClient.get('/interviews').then((r) => r.data)
export const scheduleInterview = (body) => apiClient.post('/interviews', body).then((r) => r.data)
