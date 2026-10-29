// Grafana Cloud Frontend Observability (Faro) — the one place analytics lives.
// Components and API helpers call track()/trackOnSuccess(); nothing else
// touches the Faro SDK. Everything here is a silent no-op when analytics is
// disabled, on the server (SSR/prerender), or if the SDK fails to load.
//
// Privacy: events carry only the allowlisted, non-identifying attributes in
// ALLOWED_ATTRS below (ids, audience, plan code). Never pass emails, phones,
// names, tokens, resume URLs or payment details — they're dropped anyway.

const FARO_URL = import.meta.env.VITE_PUBLIC_GRAFANA_FARO_URL
const APP_NAME = import.meta.env.VITE_PUBLIC_GRAFANA_FARO_APP_NAME || 'mzobs-landing'
const APP_ENV = import.meta.env.VITE_PUBLIC_GRAFANA_FARO_ENV || (import.meta.env.PROD ? 'production' : 'development')
// Off in `npm run dev` unless explicitly switched on.
const DEV_ENABLED = import.meta.env.VITE_PUBLIC_GRAFANA_FARO_ENABLE_DEV === 'true'

export const ANALYTICS_EVENTS = Object.freeze([
  'page_view',
  'job_viewed',
  'job_saved',
  'signup_started',
  'signup_completed',
  'resume_uploaded',
  'job_applied',
  'employer_signup_completed',
  'subscription_checkout_started',
  'payment_success',
])

const ALLOWED_ATTRS = new Set(['path', 'job_id', 'audience', 'method', 'plan'])
const MAX_QUEUE = 50

let faro = null
let started = false
let queue = []

export function isAnalyticsEnabled() {
  return typeof window !== 'undefined' && Boolean(FARO_URL) && (import.meta.env.PROD || DEV_ENABLED)
}

// Query strings carry one-time codes/tokens on some routes (e.g. ?code=) — keep
// only origin + pathname in anything Faro records.
function stripQuery(url) {
  if (typeof url !== 'string') return url
  return url.replace(/[?#].*$/, '')
}

function scrub(item) {
  const page = item?.meta?.page
  if (page?.url) page.url = stripQuery(page.url)
  const payload = item?.payload
  if (payload && typeof payload === 'object') {
    if (typeof payload.url === 'string') payload.url = stripQuery(payload.url)
    if (typeof payload.request?.url === 'string') payload.request.url = stripQuery(payload.request.url)
  }
  return item
}

function cleanAttrs(attrs = {}) {
  const out = {}
  for (const [key, value] of Object.entries(attrs)) {
    if (!ALLOWED_ATTRS.has(key) || value == null || value === '') continue
    out[key] = String(value).slice(0, 120)
  }
  return out
}

function send(name, attrs) {
  try {
    faro.api.pushEvent(name, attrs)
  } catch {
    // Analytics must never break the page.
  }
}

export function initAnalytics() {
  if (started || !isAnalyticsEnabled()) return
  started = true
  import('@grafana/faro-web-sdk')
    .then(({ initializeFaro, getWebInstrumentations }) => {
      faro = initializeFaro({
        url: FARO_URL,
        app: { name: APP_NAME, environment: APP_ENV },
        // Console capture would forward arbitrary log text (possibly PII).
        instrumentations: [...getWebInstrumentations({ captureConsole: false })],
        beforeSend: scrub,
      })
      queue.forEach(([name, attrs]) => send(name, attrs))
      queue = []
    })
    .catch(() => {
      started = false
      queue = []
    })
}

export function track(name, attrs) {
  if (!isAnalyticsEnabled() || !ANALYTICS_EVENTS.includes(name)) return
  const clean = cleanAttrs(attrs)
  if (faro) send(name, clean)
  else if (queue.length < MAX_QUEUE) queue.push([name, clean])
}

// Fires `name` after `promise` resolves and hands back the original result
// (or rejection) untouched, so wrapping an API call can't change its behavior.
export function trackOnSuccess(promise, name, attrs) {
  return promise.then((result) => {
    track(name, typeof attrs === 'function' ? attrs(result) : attrs)
    return result
  })
}

export function trackError(error, context) {
  if (!faro) return
  try {
    faro.api.pushError(error instanceof Error ? error : new Error(String(error)), { context: cleanAttrs(context) })
  } catch {
    // ignore
  }
}
