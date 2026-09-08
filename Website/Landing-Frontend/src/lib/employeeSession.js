// Minimal logged-in-state tracking for this site's own navbar. The
// dashboard app isn't wired up yet (signin/signup land back on this site's
// home page instead of handing off there — see EmployeeSign{in,up}Form.jsx),
// so this is the only place an employee's session lives for now.
const STORAGE_KEY = 'mzobs-employee-session'
// Same-tab components (e.g. Navbar) can't rely on the browser's `storage`
// event — that only fires in *other* tabs — so a custom event covers this
// tab too, right after a successful login/signup/logout.
const CHANGE_EVENT = 'mzobs-employee-session-changed'

export function saveEmployeeSession({ token, employee }) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ token, employee }))
  } catch {
    // Private browsing / storage disabled — session just won't persist across reloads.
  }
  window.dispatchEvent(new Event(CHANGE_EVENT))
}

export function getEmployeeSession() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function clearEmployeeSession() {
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch {
    // Nothing to clean up if storage isn't available.
  }
  window.dispatchEvent(new Event(CHANGE_EVENT))
}

// Subscribes to same-tab session changes (login/signup/logout) plus
// cross-tab changes via the native `storage` event. Returns an unsubscribe function.
export function onEmployeeSessionChange(callback) {
  function handleStorage(e) {
    if (e.key === STORAGE_KEY) callback()
  }
  window.addEventListener(CHANGE_EVENT, callback)
  window.addEventListener('storage', handleStorage)
  return () => {
    window.removeEventListener(CHANGE_EVENT, callback)
    window.removeEventListener('storage', handleStorage)
  }
}
