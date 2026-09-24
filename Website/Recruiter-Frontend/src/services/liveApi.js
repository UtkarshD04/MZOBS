// Thin wrappers over the existing employer API (Backend/src/routes). Live
// mode only — demo mode never calls these.
import { apiClient } from '../lib/api'
import { TOKEN_KEY } from '../lib/config'
import { invalidatePool, fetchAll } from './talentService'

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

/**
 * Spends 1 CV credit (idempotent) → { candidate:{email,phone,resumeUrl,...}, wallet, alreadyUnlocked }.
 * A resume-database profile not yet in this company's pipeline is added to it
 * on unlock, so the backend needs the job they're being sourced for.
 */
export const unlockCandidate = (c, { jobId } = {}) => {
  const { kind, candidateId, employeeId } = c._live ?? {}
  const req = kind === 'resdex' ? apiClient.post(`/resume-search/${employeeId}/unlock`, jobId ? { jobId } : {}) : apiClient.post(`/candidates/${candidateId ?? c.id}/unlock`)
  return req.then((r) => {
    invalidatePool()
    return r.data
  })
}
export const setCandidateStage = (id, stage, rejectionReason) =>
  apiClient.patch(`/candidates/${id}/stage`, { stage, rejectionReason }).then((r) => {
    invalidatePool()
    return r.data
  })
const resumeError = (code) => Object.assign(new Error(code), { code })

/**
 * A fresh signed CV link → { url, fileName? }. Rejects with `code` 'LOCKED'
 * (needs a CV-credit unlock) or 'NO_RESUME'. A pipeline candidate's CV is open
 * to an active plan without a credit; a database profile's only after unlock.
 */
export async function getResumeLink(c) {
  const { candidateId, employeeId } = c._live ?? {}
  try {
    if (candidateId) {
      try {
        return (await apiClient.get(`/candidates/${candidateId}/resume-url`)).data
      } catch (e) {
        if (e.response?.status !== 403) throw e
      }
      const r = await apiClient.get(`/candidates/${candidateId}`)
      if (r.data.resumeUrl) return { url: r.data.resumeUrl }
      throw resumeError(r.data.unlocked ? 'NO_RESUME' : 'LOCKED')
    }
    return (await apiClient.get(`/resume-search/${employeeId}/resume-url`)).data
  } catch (e) {
    if (e.code === 'LOCKED' || e.code === 'NO_RESUME') throw e
    if (e.response?.status === 403) throw resumeError('LOCKED')
    if (e.response?.status === 404) throw resumeError('NO_RESUME')
    throw e
  }
}
/** Every CV this company has unlocked, newest first: { id, candidate:{id,name,headline,appliedFor}|null, job:{id,title}|null, creditsUsed, unlockedAt }. */
export const listUnlocks = () => fetchAll('/unlocks', 10)
export const getCredits = () => apiClient.get('/credits').then((r) => r.data)
export const listInterviews = () => apiClient.get('/interviews').then((r) => r.data)
export const scheduleInterview = (body) => apiClient.post('/interviews', body).then((r) => r.data)
