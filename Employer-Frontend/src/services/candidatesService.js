import { mockResolve } from '../lib/api'
import { CANDIDATES } from '../data/mock'

const store = [...CANDIDATES]

export function listCandidates(filters = {}) {
  let rows = [...store]
  if (filters.search) {
    const q = filters.search.toLowerCase()
    rows = rows.filter((c) => c.name.toLowerCase().includes(q) || c.appliedFor.toLowerCase().includes(q) || c.skills.some((s) => s.toLowerCase().includes(q)))
  }
  if (filters.jobId && filters.jobId !== 'all') rows = rows.filter((c) => c.jobId === filters.jobId)
  if (filters.stage && filters.stage !== 'all') rows = rows.filter((c) => c.stage === filters.stage)
  rows.sort((a, b) => new Date(b.sharedOn).getTime() - new Date(a.sharedOn).getTime())
  return mockResolve(rows)
}

export function getCandidate(id) {
  return mockResolve(store.find((c) => c.id === id) ?? null)
}

export function setCandidateStage(id, stage, rejectionReason) {
  const idx = store.findIndex((c) => c.id === id)
  if (idx === -1) return mockResolve(null)
  store[idx] = { ...store[idx], stage, ...(rejectionReason ? { rejectionReason } : {}) }
  return mockResolve(store[idx], 400)
}
