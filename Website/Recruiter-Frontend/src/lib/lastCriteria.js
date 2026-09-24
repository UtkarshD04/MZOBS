import { makeCriteria } from './talent/criteria'

// The profile page scores a candidate against whatever the recruiter last
// searched for, so "AI Match Analysis" stays consistent with the result card.
const KEY = 'mzt-last-criteria'

export function saveLastCriteria(criteria) {
  try {
    sessionStorage.setItem(KEY, JSON.stringify(criteria))
  } catch {
    /* session storage unavailable */
  }
}

export function loadLastCriteria() {
  try {
    return makeCriteria(JSON.parse(sessionStorage.getItem(KEY) ?? '{}'))
  } catch {
    return makeCriteria()
  }
}
