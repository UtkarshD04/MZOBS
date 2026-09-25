// The profile page's Previous / Next steps through the last search's ranked
// results, in order, without going back to the list.
const KEY = 'mzt-last-results'

export function saveLastResults(ids) {
  try {
    sessionStorage.setItem(KEY, JSON.stringify(ids))
  } catch {
    /* session storage unavailable */
  }
}

export function loadLastResults() {
  try {
    const ids = JSON.parse(sessionStorage.getItem(KEY) ?? '[]')
    return Array.isArray(ids) ? ids : []
  } catch {
    return []
  }
}
