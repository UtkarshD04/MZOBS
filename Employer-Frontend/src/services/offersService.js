import { mockResolve } from '../lib/api'
import { OFFERS } from '../data/mock'

const store = [...OFFERS]
let seq = store.length + 1

export function listOffers() {
  const rows = [...store].sort((a, b) => new Date(b.sentOn).getTime() - new Date(a.sentOn).getTime())
  return mockResolve(rows)
}

export function createOffer(input) {
  const offer = { ...input, id: `OF-${seq++}`, status: 'pending', sentOn: new Date().toISOString() }
  store.unshift(offer)
  return mockResolve(offer, 550)
}

export function updateOfferStatus(id, status) {
  const idx = store.findIndex((o) => o.id === id)
  if (idx === -1) return mockResolve(null)
  store[idx] = { ...store[idx], status, respondedOn: ['accepted', 'rejected'].includes(status) ? new Date().toISOString() : store[idx].respondedOn }
  return mockResolve(store[idx], 400)
}
