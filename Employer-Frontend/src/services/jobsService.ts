import { mockResolve } from '../lib/api'
import { JOBS, feeFor, resumesFor } from '../data/mock'
import type { Job, JobStatus } from '../types'

const store: Job[] = [...JOBS]
let seq = store.length + 1

export interface JobFilters {
  search?: string
  status?: JobStatus | 'all'
  department?: string
}

export function listJobs(filters: JobFilters = {}) {
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

export function getJob(id: string) {
  const job = store.find((j) => j.id === id)
  return mockResolve(job ?? null)
}

export type JobInput = Omit<
  Job,
  'id' | 'candidatesShared' | 'hiresSelected' | 'resumesPromised' | 'feeTotal' | 'feeStatus' | 'submittedOn' | 'postedOn' | 'updatedOn' | 'status'
> & {
  status?: JobStatus
}

export function createJob(input: JobInput) {
  const submitted = input.status === 'pending_review'
  const job: Job = {
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

export function updateJob(id: string, input: Partial<JobInput>) {
  const idx = store.findIndex((j) => j.id === id)
  if (idx === -1) return mockResolve(null)
  const next = { ...store[idx]!, ...input, updatedOn: new Date().toISOString() }
  if (input.vacancies !== undefined) {
    next.feeTotal = feeFor(input.vacancies)
    next.resumesPromised = resumesFor(input.vacancies)
  }
  store[idx] = next
  return mockResolve(store[idx], 500)
}

export function setJobStatus(id: string, status: JobStatus) {
  const idx = store.findIndex((j) => j.id === id)
  if (idx === -1) return mockResolve(null)
  const current = store[idx]!
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
export function payJobInvoice(id: string) {
  const idx = store.findIndex((j) => j.id === id)
  if (idx === -1) return mockResolve(null)
  store[idx] = {
    ...store[idx]!,
    feeStatus: 'paid',
    paidOn: new Date().toISOString(),
    status: 'sourcing',
    postedOn: store[idx]!.postedOn ?? new Date().toISOString(),
    updatedOn: new Date().toISOString(),
  }
  return mockResolve(store[idx], 500)
}

export function duplicateJob(id: string) {
  const src = store.find((j) => j.id === id)
  if (!src) return mockResolve(null)
  const copy: Job = {
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

export function deleteJob(id: string) {
  const idx = store.findIndex((j) => j.id === id)
  if (idx !== -1) store.splice(idx, 1)
  return mockResolve(true, 350)
}
