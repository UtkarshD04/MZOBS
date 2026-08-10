import { mockResolve } from '../lib/api'
import { COMPANY } from '../data/mock'
import type { Company } from '../types'

let store: Company = { ...COMPANY }

export function getCompany() {
  return mockResolve(store)
}

export function updateCompany(input: Partial<Company>) {
  store = { ...store, ...input }
  return mockResolve(store, 500)
}
