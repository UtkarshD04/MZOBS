import { SITE_URL, STATIC_PAGE_SEO } from './seoData.js'

// Node-only. Pages through the same public, unauthenticated jobs feed the
// site itself searches against (Backend's GET /api/jobs — see
// publicJobsController.js) to build the sitemap's job-detail URLs. That
// endpoint already only returns visibleToCandidates jobs with
// status in ['sourcing', 'delivered'] (PUBLIC_STATUSES) — draft, pending
// review, awaiting payment, closed and archived jobs never come back, so
// there's nothing further to filter here. Page size is capped at 20 by the
// backend (teaserPaginationParams), so a large live board takes several
// requests — sitemap.xml is cached in server.js to keep that off the hot
// path for every crawler hit.
const PAGE_LIMIT = 20
const MAX_PAGES = 200 // safety cap: 4,000 jobs: far beyond current/expected scale

export async function fetchAllPublicJobIds(publicJobsApiUrl) {
  const ids = []
  for (let page = 1; page <= MAX_PAGES; page += 1) {
    const res = await fetch(`${publicJobsApiUrl}?limit=${PAGE_LIMIT}&page=${page}&sort=newest`)
    if (!res.ok) throw new Error(`Failed to fetch public jobs page ${page}: ${res.status}`)
    const jobs = await res.json()
    ids.push(...jobs.map((j) => j.id))
    const total = Number(res.headers.get('X-Total-Count'))
    if (!jobs.length || (Number.isFinite(total) && page * PAGE_LIMIT >= total)) break
  }
  return ids
}

function urlEntry(loc, { changefreq, priority } = {}) {
  return [`  <url>`, `    <loc>${loc}</loc>`, changefreq && `    <changefreq>${changefreq}</changefreq>`, priority != null && `    <priority>${priority}</priority>`, `  </url>`]
    .filter(Boolean)
    .join('\n')
}

export function buildSitemapXml(jobIds) {
  const staticEntries = Object.keys(STATIC_PAGE_SEO).map((path) =>
    urlEntry(`${SITE_URL}${path}`, { changefreq: path === '/' ? 'daily' : 'monthly', priority: path === '/' ? '1.0' : '0.6' })
  )
  const jobEntries = jobIds.map((id) => urlEntry(`${SITE_URL}/jobs/${id}`, { changefreq: 'daily', priority: '0.8' }))

  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${[...staticEntries, ...jobEntries].join('\n')}\n</urlset>\n`
}
