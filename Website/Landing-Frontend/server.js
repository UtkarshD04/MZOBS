// Production server: serves the prerendered static marketing pages and
// fingerprinted assets from dist/client, SSRs /jobs/:id per request against
// the live public jobs API, serves a dynamic sitemap.xml, and falls back to
// the plain client-only SPA shell (with a noindex tag on auth/dashboard
// routes) for everything else — see requirement notes in
// Website/Landing-Frontend/README.md.
import express from 'express'
import compression from 'compression'
import path from 'node:path'
import fs from 'node:fs'
import { fileURLToPath } from 'node:url'
import { buildHeadHtml } from './src/lib/renderHead.js'
import { buildJobSeo, NOINDEX_PREFIXES, SITE_URL, STATIC_PAGE_SEO } from './src/lib/seoData.js'
import { buildSitemapXml, fetchAllPublicJobIds } from './src/lib/sitemap.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const CLIENT_DIR = path.join(__dirname, 'dist/client')
const SERVER_ENTRY = path.join(__dirname, 'dist/server/entry-server.js')

// Non-VITE_-prefixed on purpose: Vite only inlines VITE_-prefixed vars into
// the client bundle at build time. This Node process runs after that build,
// so it reads its own env var at request time instead — falls back to the
// VITE_ one (useful for local `npm run build && npm start` against the same
// .env.local used for `npm run dev`).
const PUBLIC_JOBS_API_URL = process.env.PUBLIC_JOBS_API_URL || process.env.VITE_PUBLIC_JOBS_API_URL || 'http://localhost:4000/api/jobs'
const PORT = process.env.PORT || 8080

// The pristine, placeholder-bearing template — written by scripts/prerender.js
// as a hidden file since dist/client/index.html itself gets overwritten with
// the prerendered homepage (see that script).
const shellTemplate = fs.readFileSync(path.join(CLIENT_DIR, '.shell.html'), 'utf-8')
const { render } = await import(SERVER_ENTRY)

function renderShell({ headHtml, appHtml = '', tailHtml = '' }) {
  return shellTemplate.replace('<!--app-head-->', headHtml).replace('<!--app-html-->', appHtml).replace('<!--app-tail-->', tailHtml)
}

const app = express()
app.use(compression())
app.disable('x-powered-by')

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
  try {
    if (!sitemapCache.xml || Date.now() > sitemapCache.expiresAt) {
      const jobIds = await fetchAllPublicJobIds(PUBLIC_JOBS_API_URL)
      sitemapCache = { xml: buildSitemapXml(jobIds), expiresAt: Date.now() + 10 * 60 * 1000 }
    }
    res.set('Content-Type', 'application/xml').send(sitemapCache.xml)
  } catch (err) {
    console.error('sitemap generation failed:', err)
    res.status(503).type('text/plain').send('Sitemap temporarily unavailable')
  }
})

// Per-request SSR against the live job — needs to be fresh (a job can close
// or its deadline can pass between builds), so this isn't prerendered.
app.get('/jobs/:id', async (req, res) => {
  const { id } = req.params
  const url = req.originalUrl
  let job = null

  try {
    const apiRes = await fetch(`${PUBLIC_JOBS_API_URL}/${encodeURIComponent(id)}`)
    if (apiRes.ok) job = await apiRes.json()
  } catch (err) {
    console.error(`SSR fetch failed for job ${id}:`, err)
  }

  if (!job) {
    const headHtml = buildHeadHtml({
      title: 'Job — Mzobs',
      description: 'This job is no longer available.',
      canonical: `${SITE_URL}${url}`,
      noindex: true,
    })
    res.status(404).send(renderShell({ headHtml, appHtml: render(url, null) }))
    return
  }

  const seo = buildJobSeo(job, url)
  const headHtml = buildHeadHtml({ title: seo.title, description: seo.description, canonical: seo.canonical, jsonLd: seo.jsonLd })
  const appHtml = render(url, job)
  // Hands the same job back to the client for hydration so JobDetail.jsx
  // doesn't re-fetch it (see src/lib/initialJobContext.js) — escape "<" so a
  // job field containing "</script>" can't break out of the tag.
  const tailHtml = `<script>window.__INITIAL_JOB__ = ${JSON.stringify(job).replace(/</g, '\\u003c')}</script>`
  res.send(renderShell({ headHtml, appHtml, tailHtml }))
})

// Everything else — auth/dashboard/forgot-reset-password routes and any
// unknown path — is client-only. No SSR data for these, so ship the plain
// shell and let entry-client.jsx render it; requirement 3 keeps these
// client-side rather than server-rendering forms/widgets that read
// window/localStorage during their own initial render.
app.get('*', (req, res) => {
  const url = req.originalUrl
  const noindex = NOINDEX_PREFIXES.some((prefix) => req.path.startsWith(prefix))
  const headHtml = buildHeadHtml({
    title: 'Mzobs — Careers & Hiring Platform',
    description: 'Mzobs connects verified job seekers with employers hiring — one platform for candidates and companies.',
    canonical: `${SITE_URL}${url}`,
    noindex,
  })
  res.send(renderShell({ headHtml }))
})

app.listen(PORT, () => {
  console.log(`Landing Frontend SSR server listening on port ${PORT}`)
})
