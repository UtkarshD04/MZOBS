import { mockResolve } from '../lib/api'
import { BATCHES } from '../data/mock'
import type { ResumeBatch } from '../types'

const store: ResumeBatch[] = [...BATCHES]

export function listBatches(): Promise<ResumeBatch[]> {
  return mockResolve([...store])
}

export function getBatch(id: string) {
  return mockResolve(store.find((b) => b.id === id) ?? null)
}
