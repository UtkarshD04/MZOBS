import { EMPLOYEE_API_URL, EMPLOYEE_APP_URL } from './config'
import { createEmployeeHandoffCode } from './employeeAuth'

// Minimal logged-in-state tracking for this site's own navbar. Only used
// when signin/signup happen with no `?redirect=` (a direct visit to this
// site) — arriving via the dashboard app's handoff (see
// EmployeeSign{in,up}Form.jsx) skips this and uses buildAppRedirectUrl below instead.
const STORAGE_KEY = 'mzobs-employee-session'
// The real JWT lives in an httpOnly cookie set by the API, so page script (and
// any XSS) can never read it. `session.token` is only this opaque marker —
// callers keep using it as "signed in" and pass it along unchanged; the fetch
// helpers ignore its value and let the browser attach the cookie.
export const SESSION_MARKER = 'cookie-session'
// Same-tab components (e.g. Navbar) can't rely on the browser's `storage`
// event — that only fires in *other* tabs — so a custom event covers this
// tab too, right after a successful login/signup/logout.
const CHANGE_EVENT = 'mzobs-employee-session-changed'

// ApplyPanel used to keep its own token under this key instead of going
// through this module, so it never got cleared on logout — a signed-out
// visitor could still load the previous user's profile/resume there. One-time
// cleanup for anyone who still has it: drop it rather than trust it.
const LEGACY_TOKEN_KEY = 'mzobs-employee-token'
if (typeof window !== 'undefined') {
  try {
    if (localStorage.getItem(LEGACY_TOKEN_KEY)) localStorage.removeItem(LEGACY_TOKEN_KEY)
  } catch {
    // Storage unavailable — nothing to migrate.
  }
}

// The dashboard app (Frontend) sends employees here via `?redirect=<path>`
// when it needs them signed in (see Website/Frontend/src/lib/auth.js
// signInUrl()) — since localStorage isn't shared across origins/ports, the
// token has to be handed off some other way. A long-lived JWT sitting in the
// URL would leak into browser history, server logs, Referer headers and
// analytics, so this trades it for a one-time, 60-second `?code=` instead —
// Frontend's main.jsx exchanges that for the real token on load.
// `?redirect=` is attacker-controllable (anyone can craft a sign-in link), and
// `new URL('https://evil.example', base)` ignores the base — so the one-time
// handoff code would be delivered to the attacker's site. Only paths that
// resolve to the dashboard app's own origin are honoured; anything else falls
// back to its home page.
function safeAppUrl(redirectPath) {
  const base = new URL(EMPLOYEE_APP_URL)
  try {
    const url = new URL(String(redirectPath ?? ''), base)
    if (url.origin === base.origin) return url
  } catch {
    // malformed — fall through
  }
  return new URL('/', base)
}

export async function buildAppRedirectUrl(redirectPath, token) {
  const code = await createEmployeeHandoffCode(token)
  const url = safeAppUrl(redirectPath)
  url.searchParams.set('code', code)
  return url.toString()
}

export function saveEmployeeSession({ employee }) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ token: SESSION_MARKER, employee }))
  } catch {
    // Private browsing / storage disabled — session just won't persist across reloads.
  }
  window.dispatchEvent(new Event(CHANGE_EVENT))
}

export function getEmployeeSession() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    const session = raw ? JSON.parse(raw) : null
    // A session saved before cookie auth holds a raw JWT — purge it rather than keep it readable.
    if (session && session.token !== SESSION_MARKER) {
      localStorage.removeItem(STORAGE_KEY)
      return null
    }
    return session
  } catch {
    return null
  }
}

export function clearEmployeeSession() {
  // Ends the cookie session server-side (keepalive: survives a navigation right after).
  fetch(`${EMPLOYEE_API_URL}/auth/logout`, {
    method: 'POST',
    credentials: 'include',
    keepalive: true,
    headers: { 'X-Requested-With': 'mzobs-web' },
  }).catch(() => {})
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
