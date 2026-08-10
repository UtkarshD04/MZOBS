import { mockResolve } from '../lib/api'
import { OFFERS } from '../data/mock'
import type { Offer, OfferStatus } from '../types'

const store: Offer[] = [...OFFERS]
let seq = store.length + 1

export function listOffers() {
  const rows = [...store].sort((a, b) => new Date(b.sentOn).getTime() - new Date(a.sentOn).getTime())
  return mockResolve(rows)
}

export type CreateOfferInput = Omit<Offer, 'id' | 'status' | 'sentOn' | 'respondedOn'>

export function createOffer(input: CreateOfferInput) {
  const offer: Offer = { ...input, id: `OF-${seq++}`, status: 'pending', sentOn: new Date().toISOString() }
  store.unshift(offer)
  return mockResolve(offer, 550)
}

export function updateOfferStatus(id: string, status: OfferStatus) {
  const idx = store.findIndex((o) => o.id === id)
  if (idx === -1) return mockResolve(null)
  store[idx] = { ...store[idx]!, status, respondedOn: ['accepted', 'rejected'].includes(status) ? new Date().toISOString() : store[idx]!.respondedOn }
  return mockResolve(store[idx], 400)
}
