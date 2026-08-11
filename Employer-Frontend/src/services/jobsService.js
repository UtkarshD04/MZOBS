import { mockResolve } from '../lib/api'
import { JOBS, feeFor, resumesFor } from '../data/mock'

const store = [...JOBS]
let seq = store.length + 1

export function listJobs(filters = {}) {
  let rows = [...store]
  if (filters.search) {
    const q = filters.search.toLowerCase()
    rows = rows.filter((j) => j.title.toLowerCase().includes(q) || j.department.toLowerCase().includes(q) || j.location.toLowerCase().includes(q))
  }
  if (filters.status && filters.status !== 'all') rows = rows.filter((j) => j.status === filters.status)
  if (filters.department && filters.department !== 'all') rows = rows.filter((j) => j.department === filters.department)
  rows.sort((a, b) => new Date(b.updatedOn).getTime() - new Date(a.updatedOn).getTime())
  return mockResolve(rows)
}

export function getJob(id) {
  const job = store.find((j) => j.id === id)
  return mockResolve(job ?? null)
}

export function createJob(input) {
  const submitted = input.status === 'pending_review'
  const job = {
    ...input,
    id: `J-${100 + seq++}`,
    status: input.status ?? 'draft',
    // The commercials are derived from openings, never entered by hand.
    feeTotal: feeFor(input.vacancies),
    feeStatus: 'unpaid',
    resumesPromised: resumesFor(input.vacancies),
    candidatesShared: 0,
    hiresSelected: 0,
    submittedOn: submitted ? new Date().toISOString() : null,
    postedOn: null,
    updatedOn: new Date().toISOString(),
  }
  store.unshift(job)
  return mockResolve(job, 600)
}

export function updateJob(id, input) {
  const idx = store.findIndex((j) => j.id === id)
  if (idx === -1) return mockResolve(null)
  const next = { ...store[idx], ...input, updatedOn: new Date().toISOString() }
  if (input.vacancies !== undefined) {
    next.feeTotal = feeFor(input.vacancies)
    next.resumesPromised = resumesFor(input.vacancies)
  }
  store[idx] = next
  return mockResolve(store[idx], 500)
}

export function setJobStatus(id, status) {
  const idx = store.findIndex((j) => j.id === id)
  if (idx === -1) return mockResolve(null)
  const current = store[idx]
  store[idx] = {
    ...current,
    status,
    submittedOn: status === 'pending_review' && !current.submittedOn ? new Date().toISOString() : current.submittedOn,
    postedOn: status === 'sourcing' && !current.postedOn ? new Date().toISOString() : current.postedOn,
    updatedOn: new Date().toISOString(),
  }
  return mockResolve(store[idx], 350)
}

/** Paying the per-opening invoice is what releases a requirement into sourcing. */
export function payJobInvoice(id) {
  const idx = store.findIndex((j) => j.id === id)
  if (idx === -1) return mockResolve(null)
  store[idx] = {
    ...store[idx],
    feeStatus: 'paid',
    paidOn: new Date().toISOString(),
    status: 'sourcing',
    postedOn: store[idx].postedOn ?? new Date().toISOString(),
    updatedOn: new Date().toISOString(),
  }
  return mockResolve(store[idx], 500)
}

export function duplicateJob(id) {
  const src = store.find((j) => j.id === id)
  if (!src) return mockResolve(null)
  const copy = {
    ...src,
    id: `J-${100 + seq++}`,
    title: `${src.title} (Copy)`,
    status: 'draft',
    feeStatus: 'unpaid',
    candidatesShared: 0,
    hiresSelected: 0,
    submittedOn: null,
    postedOn: null,
    updatedOn: new Date().toISOString(),
  }
  delete copy.paidOn
  delete copy.invoiceId
  store.unshift(copy)
  return mockResolve(copy, 450)
}

export function deleteJob(id) {
  const idx = store.findIndex((j) => j.id === id)
  if (idx !== -1) store.splice(idx, 1)
  return mockResolve(true, 350)
}
