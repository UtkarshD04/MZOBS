// Production server: serves the prerendered static marketing pages and
// fingerprinted assets from dist/client, SSRs /jobs/:id per request against
// the live public jobs API, serves a dynamic sitemap.xml, and falls back to
// the plain client-only SPA shell (with a noindex tag on auth/dashboard
// routes) for everything else — see requirement notes in
// Website/Landing-Frontend/README.md.
import express from 'express'
import compression from 'compression'
import helmet from 'helmet'
import crypto from 'node:crypto'
import path from 'node:path'
import fs from 'node:fs'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { buildHeadHtml } from './src/lib/renderHead.js'
import { buildJobSeo, canonicalPath, NOINDEX_PREFIXES, SITE_URL, STATIC_PAGE_SEO } from './src/lib/seoData.js'
import { buildSitemapXml, fetchAllPublicJobIds } from './src/lib/sitemap.js'
import { CLIENT_ONLY_ROUTES } from './src/lib/routes.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const CLIENT_DIR = path.join(__dirname, 'dist/client')
const SERVER_ENTRY = path.join(__dirname, 'dist/server/entry-server.js')

// Non-VITE_-prefixed on purpose: Vite only inlines VITE_-prefixed vars into
// the client bundle at build time. This Node process runs after that build,
// so it reads its own env var at request time instead — falls back to the
// VITE_ one (useful for local `npm run build && npm start` against the same
// .env.local used for `npm run dev`).
const PUBLIC_JOBS_API_URL = process.env.PUBLIC_JOBS_API_URL || process.env.VITE_PUBLIC_JOBS_API_URL || 'http://localhost:4000/api/jobs'
// Same reasoning as PUBLIC_JOBS_API_URL above — read at request time from
// this process's own env, falling back to the VITE_-prefixed one so a local
// `npm run build && npm start` against the same .env.local still works.
// Only used to build the CSP's connect-src below (the client already reads
// its own copies of these via import.meta.env — see src/lib/config.js).
const EMPLOYER_API_URL = process.env.EMPLOYER_API_URL || process.env.VITE_EMPLOYER_API_URL || 'http://localhost:4000/api/employer'
const EMPLOYEE_API_URL = process.env.EMPLOYEE_API_URL || process.env.VITE_EMPLOYEE_API_URL || 'http://localhost:4000/api/employee'
const CONTACT_API_URL = process.env.CONTACT_API_URL || process.env.VITE_CONTACT_API_URL || 'http://localhost:4000/api/contact'
const ACCOUNT_DELETION_API_URL =
  process.env.ACCOUNT_DELETION_API_URL || process.env.VITE_ACCOUNT_DELETION_API_URL || 'http://localhost:4000/api/account-deletion'
const PORT = process.env.PORT || 8080

// Set to 'false' once the browser console is clean of CSP violations on the
// real pages (home, job detail, city pages, employee/employer sign-in and
// the Razorpay/Google/MSG91 payment+auth flows) — see the CSP comment below
// for the full switch-over note.
const CSP_REPORT_ONLY = process.env.CSP_REPORT_ONLY !== 'false'

function originOf(url) {
  try {
    return new URL(url).origin
  } catch {
    return null
  }
}
// This site's own backend may be split across a few different env-configured
// URLs (jobs/employer/employee/contact/account-deletion) that don't have to
// share an origin — de-duped so the same host isn't repeated in the header.
const API_ORIGINS = [...new Set([PUBLIC_JOBS_API_URL, EMPLOYER_API_URL, EMPLOYEE_API_URL, CONTACT_API_URL, ACCOUNT_DELETION_API_URL].map(originOf).filter(Boolean))]

// Matches SCRIPT_URLS in src/lib/msg91Widget.js exactly — the widget tries
// the first, falls back to the second, and does its own XHR config fetch
// against whichever one loaded, so both need script-src *and* connect-src.
const MSG91_WIDGET_ORIGINS = ['https://verify.msg91.com', 'https://verify.phone91.com']

// The pristine, placeholder-bearing template — written by scripts/prerender.js
// as a hidden file since dist/client/index.html itself gets overwritten with
// the prerendered homepage (see that script).
const shellTemplate = fs.readFileSync(path.join(CLIENT_DIR, '.shell.html'), 'utf-8')
// import() needs a file:// URL, not a raw filesystem path — a plain "C:\..."
// path throws ERR_UNSUPPORTED_ESM_URL_SCHEME on Windows.
const { render } = await import(pathToFileURL(SERVER_ENTRY).href)

function renderShell({ headHtml, appHtml = '', tailHtml = '' }) {
  return shellTemplate.replace('<!--app-head-->', headHtml).replace('<!--app-html-->', appHtml).replace('<!--app-tail-->', tailHtml)
}

const app = express()
app.use(compression())
app.disable('x-powered-by')

// A fresh per-request nonce for the one inline script this server ever
// injects (window.__INITIAL_JOB__ below) — must run before helmet() so its
// CSP directive functions (which read res.locals.cspNonce) see it.
app.use((req, res, next) => {
  res.locals.cspNonce = crypto.randomBytes(16).toString('base64')
  next()
})

app.use(
  helmet({
    contentSecurityPolicy: {
      // Report-only to start: nothing is blocked, but any violation a real
      // visitor's browser would have blocked gets logged to their devtools
      // console (Console tab, and Network > look for the CSP report if
      // report-to/report-uri is ever wired up). Browse the real pages this
      // way for a while — home, a job detail page, a city page, employee
      // and employer sign-in/sign-up, and an actual Razorpay checkout —
      // and once the console is clean, flip CSP_REPORT_ONLY to 'false' in
      // the environment (no code change) to start actually enforcing it.
      reportOnly: CSP_REPORT_ONLY,
      // helmet's default directives use hyphenated keys (getDefaultDirectives()
      // returns e.g. "default-src", not "defaultSrc") — stick to that same
      // convention for every key here too, camelCase and hyphenated forms of
      // the same directive are treated as distinct and helmet throws on the
      // resulting "duplicate directive" once both are present.
      directives: {
        ...helmet.contentSecurityPolicy.getDefaultDirectives(),
        'default-src': ["'self'"],
        // The nonce covers window.__INITIAL_JOB__ (see /jobs/:id below);
        // the rest are every third-party script this site actually loads —
        // Razorpay Checkout (src/lib/razorpay.js), Google Identity Services
        // (@react-oauth/google, used by GoogleAuthButton.jsx), and the
        // MSG91 OTP widget (src/lib/msg91Widget.js).
        'script-src': ["'self'", (req, res) => `'nonce-${res.locals.cspNonce}'`, 'https://checkout.razorpay.com', 'https://accounts.google.com', ...MSG91_WIDGET_ORIGINS],
        // Razorpay's checkout modal and Google's OAuth prompt both render
        // in an iframe.
        'frame-src': ["'self'", 'https://api.razorpay.com', 'https://accounts.google.com'],
        // This site's own backend(s) (API_ORIGINS), plus the XHR calls each
        // of those same three third parties makes on its own.
        'connect-src': [
          "'self'",
          ...API_ORIGINS,
          'https://checkout.razorpay.com',
          'https://api.razorpay.com',
          'https://accounts.google.com',
          ...MSG91_WIDGET_ORIGINS,
        ],
        'img-src': ["'self'", 'data:', 'https:'],
        // Tailwind/inline `style={...}` props throughout this codebase rely
        // on inline styles — no nonce on style-src, so this is a plain
        // allow, same tradeoff most React+Tailwind sites accept.
        'style-src': ["'self'", "'unsafe-inline'"],
        // All fonts are self-hosted @fontsource packages (see entry-client/
        // entry-server's font imports) — no external font CDN in use.
        'font-src': ["'self'"],
        // Nothing (including this site itself) should be able to frame this
        // site — belt-and-suspenders with the frameguard header below.
        'frame-ancestors': ["'none'"],
      },
    },
    hsts: { maxAge: 31536000, includeSubDomains: true },
    referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
    // helmet's default (`same-origin`) severs the link between this page and
    // any popup it opens. "Continue with Google" opens accounts.google.com in
    // a popup that reports the result back via window.postMessage, so with
    // `same-origin` that popup stays blank (accounts.google.com/gsi/transform)
    // and nothing happens. `same-origin-allow-popups` keeps the isolation for
    // everything else while letting our own popups talk back to us.
    crossOriginOpenerPolicy: { policy: 'same-origin-allow-popups' },
    // Legacy fallback for browsers that don't support frame-ancestors.
    frameguard: { action: 'deny' },
    // X-Content-Type-Options: nosniff is on by helmet's own default.
  })
)

// /about/ and /about are the same page to a user but distinct URLs to
// Google — collapse the trailing-slash form onto the canonical one instead
// of letting both get crawled/indexed separately.
app.use((req, res, next) => {
  if (req.path.length > 1 && req.path.endsWith('/')) {
    const query = req.url.slice(req.path.length)
    res.redirect(301, req.path.slice(0, -1) + query)
    return
  }
  next()
})

// Prerendered public static pages (written by scripts/prerender.js) — plain
// file sends, no per-request render cost.
for (const route of Object.keys(STATIC_PAGE_SEO)) {
  const file = route === '/' ? path.join(CLIENT_DIR, 'index.html') : path.join(CLIENT_DIR, route.slice(1), 'index.html')
  app.get(route, (req, res) => res.sendFile(file))
}

// Fingerprinted assets, images, favicons, robots.txt, sw.js, etc.
app.use(
  express.static(CLIENT_DIR, {
    index: false,
    maxAge: '1y',
    immutable: true,
    setHeaders(res, filePath) {
      if (filePath.endsWith('.html')) res.setHeader('Cache-Control', 'no-cache')
    },
  })
)

// Cached for a few minutes so a crawler hammering /sitemap.xml doesn't turn
// into N backend requests per hit — job listings don't change second to
// second.
let sitemapCache = { xml: null, expiresAt: 0 }
app.get('/sitemap.xml', async (req, res) => {
  if (!sitemapCache.xml || Date.now() > sitemapCache.expiresAt) {
    try {
      const jobIds = await fetchAllPublicJobIds(PUBLIC_JOBS_API_URL)
      sitemapCache = { xml: buildSitemapXml(jobIds), expiresAt: Date.now() + 10 * 60 * 1000 }
    } catch (err) {
      console.error('sitemap generation failed:', err)
      if (!sitemapCache.xml) {
        res.status(503).type('text/plain').send('Sitemap temporarily unavailable')
        return
      }
      // Otherwise fall through and serve the stale-but-still-valid sitemap
      // below — an out-of-date sitemap is far better for SEO than a 503 a
      // crawler might read as "this site is broken."
    }
  }
  res.set('Content-Type', 'application/xml').send(sitemapCache.xml)
})

// Keeps repeated crawler hits (and refreshes) on the same job off the
// backend — 60s TTL, capped so a long-lived process can't grow this
// unbounded under a slow crawl of many distinct job ids.
const JOB_CACHE_TTL_MS = 60 * 1000
const JOB_CACHE_MAX_ENTRIES = 500
const jobCache = new Map()

function getCachedJob(id) {
  const entry = jobCache.get(id)
  if (!entry) return null
  if (Date.now() > entry.expiresAt) {
    jobCache.delete(id)
    return null
  }
  return entry.job
}

function cacheJob(id, job) {
  // Map preserves insertion order, so the first key is the oldest — evict it
  // before adding a new one once the cap is hit.
  if (jobCache.size >= JOB_CACHE_MAX_ENTRIES && !jobCache.has(id)) {
    jobCache.delete(jobCache.keys().next().value)
  }
  jobCache.set(id, { job, expiresAt: Date.now() + JOB_CACHE_TTL_MS })
}

// Per-request SSR against the live job — needs to be fresh (a job can close
// or its deadline can pass between builds), so this isn't prerendered.
app.get('/jobs/:id', async (req, res) => {
  const { id } = req.params
  const url = req.originalUrl

  let job = getCachedJob(id)
  // Distinguishes "the job doesn't exist" (real 404, safe to noindex) from
  // "we couldn't find out" (backend down/slow/erroring — must NOT noindex,
  // or a brief outage would get every job page deindexed by Google).
  let unavailable = false

  if (!job) {
    try {
      const apiRes = await fetch(`${PUBLIC_JOBS_API_URL}/${encodeURIComponent(id)}`, { signal: AbortSignal.timeout(5000) })
      if (apiRes.ok) {
        job = await apiRes.json()
        cacheJob(id, job)
      } else if (apiRes.status === 404 || apiRes.status === 410) {
        job = null
      } else {
        unavailable = true
      }
    } catch (err) {
      console.error(`SSR fetch failed for job ${id}:`, err)
      unavailable = true
    }
  }

  if (unavailable) {
    const headHtml = buildHeadHtml({
      title: 'Job — Mzobs',
      description: 'This page is temporarily unavailable.',
      canonical: `${SITE_URL}${canonicalPath(req.path)}`,
    })
    res
      .status(503)
      .set('Retry-After', '120')
      .send(renderShell({ headHtml, appHtml: '<p>Temporarily unavailable, please retry.</p>' }))
    return
  }

  if (!job) {
    const headHtml = buildHeadHtml({
      title: 'Job — Mzobs',
      description: 'This job is no longer available.',
      canonical: `${SITE_URL}${canonicalPath(req.path)}`,
      noindex: true,
    })
    res.status(404).send(renderShell({ headHtml, appHtml: render(url, {}) }))
    return
  }

  const seo = buildJobSeo(job, req.path)
  const headHtml = buildHeadHtml({ title: seo.title, description: seo.description, canonical: seo.canonical, jsonLd: seo.jsonLd })
  const appHtml = render(url, { initialJob: job })
  // Hands the same job back to the client for hydration so JobDetail.jsx
  // doesn't re-fetch it (see src/lib/initialJobContext.js) — escape "<" so a
  // job field containing "</script>" can't break out of the tag. The nonce
  // is what lets the CSP above allow this one inline script without a
  // blanket 'unsafe-inline' on script-src.
  const tailHtml = `<script nonce="${res.locals.cspNonce}">window.__INITIAL_JOB__ = ${JSON.stringify(job).replace(/</g, '\\u003c')}</script>`
  res.send(renderShell({ headHtml, appHtml, tailHtml }))
})

// Every path App.jsx actually has a route for — the prerendered static
// pages plus the client-only ones below (imported from src/lib/routes.js so
// this list can't drift out of sync with App.jsx's own <Route> paths).
// Anything not in here is not a page this site has, and must not get a 200
// — Google reads a 200 with no real content as a soft 404, which is what
// this whole route is fixing.
const KNOWN_CLIENT_ROUTES = new Set([...Object.keys(STATIC_PAGE_SEO), ...Object.values(CLIENT_ONLY_ROUTES)])

app.get('*', (req, res) => {
  const url = req.originalUrl

  if (!KNOWN_CLIENT_ROUTES.has(req.path)) {
    // Covers both a path App.jsx has no route for at all (renders NotFound)
    // and a parameterized route matched with a value that doesn't exist —
    // e.g. /jobs/city/:citySlug for a city Mzobs doesn't have (CityJobs
    // already renders its own "not here" state for that). Either way, SSR
    // the real page so there's content immediately, but with a genuine 404
    // and noindex rather than the 200 that was getting read as a soft 404.
    const headHtml = buildHeadHtml({
      title: 'Page Not Found — Mzobs',
      description: "The page you're looking for doesn't exist or may have moved.",
      canonical: `${SITE_URL}${canonicalPath(req.path)}`,
      noindex: true,
    })
    res.status(404).send(renderShell({ headHtml, appHtml: render(url) }))
    return
  }

  // Auth/dashboard/forgot-reset-password/profile routes — real pages
  // App.jsx knows how to render, just not worth SSRing (requirement 3 keeps
  // these client-side rather than server-rendering forms/widgets that read
  // window/localStorage during their own initial render), so ship the plain
  // shell and let entry-client.jsx render it.
  const noindex = NOINDEX_PREFIXES.some((prefix) => req.path.startsWith(prefix))
  const headHtml = buildHeadHtml({
    title: 'Mzobs — Careers & Hiring Platform',
    description: 'Mzobs connects verified job seekers with employers hiring — one platform for candidates and companies.',
    canonical: `${SITE_URL}${canonicalPath(req.path)}`,
    noindex,
  })
  res.send(renderShell({ headHtml }))
})

app.listen(PORT, () => {
  console.log(`Landing Frontend SSR server listening on port ${PORT}`)
})
