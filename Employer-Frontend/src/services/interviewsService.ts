import { mockResolve } from '../lib/api'
import { INTERVIEWS } from '../data/mock'
import type { Interview } from '../types'

const store: Interview[] = [...INTERVIEWS]
let seq = store.length + 1

export function listInterviews() {
  const rows = [...store].sort((a, b) => new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime())
  return mockResolve(rows)
}

export type ScheduleInterviewInput = Omit<Interview, 'id' | 'status' | 'feedback'>

export function scheduleInterview(input: ScheduleInterviewInput) {
  const interview: Interview = { ...input, id: `I-${100 + seq++}`, status: 'Confirmed' }
  store.push(interview)
  return mockResolve(interview, 550)
}

export function rescheduleInterview(id: string, startsAt: string) {
  const idx = store.findIndex((i) => i.id === id)
  if (idx === -1) return mockResolve(null)
  store[idx] = { ...store[idx]!, startsAt, status: 'Rescheduled' }
  return mockResolve(store[idx], 450)
}

export function cancelInterview(id: string) {
  const idx = store.findIndex((i) => i.id === id)
  if (idx === -1) return mockResolve(null)
  store[idx] = { ...store[idx]!, status: 'Cancelled' }
  return mockResolve(store[idx], 350)
}

export function submitFeedback(id: string, feedback: NonNullable<Interview['feedback']>) {
  const idx = store.findIndex((i) => i.id === id)
  if (idx === -1) return mockResolve(null)
  store[idx] = { ...store[idx]!, status: 'Completed', feedback }
  return mockResolve(store[idx], 500)
}
