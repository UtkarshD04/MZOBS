import { mockResolve } from '../lib/api'
import { COMPANY } from '../data/mock'

let store = { ...COMPANY }

export function getCompany() {
  return mockResolve(store)
}

export function updateCompany(input) {
  store = { ...store, ...input }
  return mockResolve(store, 500)
}
