const STORAGE_KEY = 'mzobs-saved-jobs'

// Visitor-local "save for later" list for the Latest jobs detail panel — no
// account needed, so this is plain localStorage rather than a Backend call.
// Jobs without a real `id` (the curated fallback sample) key off their
// title+company instead, so saving still works when the public API is down.
function readIds() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    const parsed = raw ? JSON.parse(raw) : []
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function writeIds(ids) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(ids))
  } catch {
    // Storage unavailable (private mode, quota) — save silently no-ops.
  }
}

export function jobSaveKey(job) {
  return job.id ?? `${job.title}::${job.company}`
}

export function isJobSaved(job) {
  return readIds().includes(jobSaveKey(job))
}

export function toggleJobSaved(job) {
  const key = jobSaveKey(job)
  const ids = readIds()
  const next = ids.includes(key) ? ids.filter((id) => id !== key) : [...ids, key]
  writeIds(next)
  return next.includes(key)
}
