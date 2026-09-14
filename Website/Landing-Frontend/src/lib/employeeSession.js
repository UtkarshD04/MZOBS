import { EMPLOYEE_APP_URL } from './config'

// Minimal logged-in-state tracking for this site's own navbar. Only used
// when signin/signup happen with no `?redirect=` (a direct visit to this
// site) — arriving via the dashboard app's handoff (see
// EmployeeSign{in,up}Form.jsx) skips this and uses buildAppRedirectUrl below instead.
const STORAGE_KEY = 'mzobs-employee-session'
// Same-tab components (e.g. Navbar) can't rely on the browser's `storage`
// event — that only fires in *other* tabs — so a custom event covers this
// tab too, right after a successful login/signup/logout.
const CHANGE_EVENT = 'mzobs-employee-session-changed'

// The dashboard app (Frontend) sends employees here via `?redirect=<path>`
// when it needs them signed in (see Website/Frontend/src/lib/auth.js
// signInUrl()) — since localStorage isn't shared across origins/ports, the
// token has to be handed off as a `?token=` query param instead. Frontend's
// main.jsx reads it once on load and stores it there.
export function buildAppRedirectUrl(redirectPath, token) {
  const url = new URL(redirectPath, EMPLOYEE_APP_URL)
  url.searchParams.set('token', token)
  return url.toString()
}

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
