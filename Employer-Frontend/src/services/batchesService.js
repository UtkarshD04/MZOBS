import { mockResolve } from '../lib/api'
import { BATCHES } from '../data/mock'

const store = [...BATCHES]

export function listBatches() {
  return mockResolve([...store])
}

export function getBatch(id) {
  return mockResolve(store.find((b) => b.id === id) ?? null)
}
