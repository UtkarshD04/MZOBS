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

const template = fs.readFileSync(path.join(CLIENT_DIR, 'index.html'), 'utf-8')
// Preserve the pristine, placeholder-bearing template as a hidden file —
// server.js needs it as-is for the job-detail SSR route and the client-only
// SPA shell (auth/dashboard routes), after this script overwrites
// dist/client/index.html itself with the prerendered homepage below.
fs.writeFileSync(path.join(CLIENT_DIR, '.shell.html'), template)

const { render } = await import(SERVER_ENTRY)

for (const [route, seo] of Object.entries(STATIC_PAGE_SEO)) {
  const appHtml = render(route)
  const headHtml = buildHeadHtml({ title: seo.title, description: seo.description, canonical: `https://mzobs.com${route}` })
  const html = template.replace('<!--app-head-->', headHtml).replace('<!--app-html-->', appHtml).replace('<!--app-tail-->', '')

  const outFile = route === '/' ? path.join(CLIENT_DIR, 'index.html') : path.join(CLIENT_DIR, route.slice(1), 'index.html')
  fs.mkdirSync(path.dirname(outFile), { recursive: true })
  fs.writeFileSync(outFile, html)
  console.log(`prerendered ${route} -> ${path.relative(ROOT, outFile)}`)
}
