// Build-time prerendering for every public static route (see
// src/lib/seoData.js's STATIC_PAGE_SEO) — run after both the client and SSR
// builds (see package.json's "build" script). Writes real, crawlable HTML
// for each route so server.js can serve them as plain static files at
// request time, no per-request render cost.
//
// The job-detail route (/jobs/:id) is NOT prerendered here — it's rendered
// per-request by server.js instead, since job data changes and expires.
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { buildHeadHtml } from '../src/lib/renderHead.js'
import { STATIC_PAGE_SEO } from '../src/lib/seoData.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.join(__dirname, '..')
const CLIENT_DIR = path.join(ROOT, 'dist/client')
const SERVER_ENTRY = path.join(ROOT, 'dist/server/entry-server.js')

const PUBLIC_JOBS_API_URL = process.env.PUBLIC_JOBS_API_URL || process.env.VITE_PUBLIC_JOBS_API_URL || 'http://localhost:4000/api/jobs'

const template = fs.readFileSync(path.join(CLIENT_DIR, 'index.html'), 'utf-8')
// Preserve the pristine, placeholder-bearing template as a hidden file —
// server.js needs it as-is for the job-detail SSR route and the client-only
// SPA shell (auth/dashboard routes), after this script overwrites
// dist/client/index.html itself with the prerendered homepage below.
fs.writeFileSync(path.join(CLIENT_DIR, '.shell.html'), template)

const { render } = await import(SERVER_ENTRY)

// The home page's job-count/city/category sections (JobMarketplace.jsx,
// HotJobsByCity.jsx, CategoryGrid.jsx) each fetch their own default,
// unfiltered data client-side inside a useEffect — which never runs during
// this build-time renderToString pass, so without this the shipped static
// HTML permanently freezes at each section's initial loading/zero state
// ("0 opportunities", empty city/category skeletons) even though the live
// API has real jobs. Fetch that same default data here and hand it to
// render()/entry-client.jsx (see initialHomeDataContext.js) so the static
// HTML — and every visitor and crawler that sees it before hydration
// refetches — shows real numbers instead. Best-effort: if the API is
// unreachable at build time, fall back to the previous (empty) behavior
// rather than failing the whole build.
async function fetchInitialHomeData() {
  try {
    const [jobsRes, categories, hotCities] = await Promise.all([
      fetch(`${PUBLIC_JOBS_API_URL}?sort=newest&limit=12&page=1`).then((r) => (r.ok ? r.json() : Promise.reject(r.status))),
      fetch(`${PUBLIC_JOBS_API_URL}/categories`).then((r) => (r.ok ? r.json() : Promise.reject(r.status))),
      fetch(`${PUBLIC_JOBS_API_URL}/hot-cities`).then((r) => (r.ok ? r.json() : Promise.reject(r.status))),
    ])
    return { jobs: jobsRes, total: jobsRes.length, categories, hotCities: hotCities.cities }
  } catch (err) {
    console.error('prerender: failed to fetch initial home data, falling back to empty state:', err)
    return null
  }
}

const initialHomeData = await fetchInitialHomeData()

for (const [route, seo] of Object.entries(STATIC_PAGE_SEO)) {
  const isHome = route === '/'
  const appHtml = render(route, isHome ? { initialHomeData } : {})
  const headHtml = buildHeadHtml({ title: seo.title, description: seo.description, canonical: `https://mzobs.com${route}` })
  // Hands the same data back to the client for hydration so JobMarketplace/
  // CategoryGrid/HotJobsByCity don't show a redundant loading flash before
  // their own useEffect re-fetches live data (see initialHomeDataContext.js).
  const tailHtml = isHome && initialHomeData
    ? `<script>window.__INITIAL_HOME_DATA__ = ${JSON.stringify(initialHomeData).replace(/</g, '\\u003c')}</script>`
    : ''
  const html = template.replace('<!--app-head-->', headHtml).replace('<!--app-html-->', appHtml).replace('<!--app-tail-->', tailHtml)

  const outFile = route === '/' ? path.join(CLIENT_DIR, 'index.html') : path.join(CLIENT_DIR, route.slice(1), 'index.html')
  fs.mkdirSync(path.dirname(outFile), { recursive: true })
  fs.writeFileSync(outFile, html)
  console.log(`prerendered ${route} -> ${path.relative(ROOT, outFile)}`)
}
