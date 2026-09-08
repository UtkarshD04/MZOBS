# Mzobs Landing Frontend

React 19 + Vite marketing site, with server-side rendering for the public,
crawlable routes and a client-only SPA for everything behind auth.

## SEO / SSR

Public routes (`/`, `/about`, `/our-story`, `/employees`, `/employers`,
`/contact`, `/privacy-policy`, `/terms-of-service`) are **prerendered at
build time** — `npm run build` renders each one to real HTML via
`scripts/prerender.js`, so their served files already contain full page
markup, not an empty `#root`.

**`/jobs/:id`** is **rendered per request** by `server.js` instead, since job
data changes (a job can close, its deadline can pass) and shouldn't be baked
into a build. Each request fetches the job from the backend's public jobs
API, and the response includes:

- the job title, company, location, employment type, experience and salary
  (all visible in the page's own markup)
- a `JobPosting` JSON-LD block (title, description, datePosted, validThrough,
  employmentType, hiringOrganization, jobLocation/jobLocationType, baseSalary
  when available, and the job's canonical URL) — built only from real fields
  the backend returns (see `src/lib/seoData.js`'s `buildJobSeo`), never
  fabricated. A job whose deadline has already passed gets no JSON-LD at all,
  and an unknown/removed job id gets a `noindex` 404 shell instead.

Every route not in either list (auth, signup/signin, forgot/reset password,
and anything unmatched) falls through to the plain client-only SPA shell
with a `noindex, nofollow` robots tag — those pages read `window`/
`localStorage` during their own render (OTP widgets, token handoff) and were
never meant to be indexed anyway.

### How it fits together

- `index.html` is a template with two placeholders: `<!--app-head-->` (the
  page's title/description/canonical/OG/Twitter/JSON-LD tags, injected as a
  literal string) and `<!--app-html-->` (the rendered app markup).
- `src/entry-client.jsx` hydrates that markup in the browser (or does a
  plain client render when there's nothing to hydrate, e.g. the SPA shell
  routes, or `npm run dev`).
- `src/entry-server.jsx` is the Node-only render function, built by
  `vite build --ssr` into `dist/server/entry-server.js`.
- `src/lib/seoData.js` is the single source of truth for page titles,
  descriptions, and the `JobPosting` schema builder — used by both the
  server (`src/lib/renderHead.js`, string-based) and the client
  (`src/components/Seo.jsx`, which imperatively updates the same tags on
  hydration/SPA navigation, so the two never fight over the same `<head>`).

## Testing locally

```bash
npm run build   # builds dist/client + dist/server, then prerenders
npm start        # node server.js, defaults to port 8080
```

Then, with the Backend running (`PUBLIC_JOBS_API_URL` defaults to
`http://localhost:4000/api/jobs` — override it if your backend runs
elsewhere):

- `curl -s http://localhost:8080/ | less` — view source of the homepage;
  the hero, nav, and footer content should already be in the raw HTML.
- `curl -s http://localhost:8080/jobs/<a real job id>` — the job title,
  company, and a `<script type="application/ld+json">` block should be in
  the raw HTML.
- `curl -s http://localhost:8080/robots.txt`
- `curl -s http://localhost:8080/sitemap.xml`

`npm run dev` (plain `vite`) still works for day-to-day UI development — it
skips SSR entirely and renders client-side only, same as before.

## Sitemap generation

`GET /sitemap.xml` is generated dynamically by `server.js` (see
`src/lib/sitemap.js`), not written at build time — job listings change more
often than deploys. It pages through the backend's public jobs feed
(`GET /api/jobs`, 20/page) to collect every job id, which is already
filtered server-side to `visibleToCandidates: true` jobs with status
`sourcing`/`delivered` — draft, pending-review, awaiting-payment, closed and
archived jobs never come back, so nothing further needs excluding on this
end. The result is cached in memory for 10 minutes so repeated crawler hits
don't turn into a backend request every time.

## Google Search Console

Submit:

- `https://mzobs.com/sitemap.xml` (as the sitemap)
- `https://mzobs.com/` and the other seven public static pages, individually,
  for the initial indexing request
- A couple of live `/jobs/:id` URLs, to confirm the `JobPosting` rich result
  is detected (Search Console's URL Inspection tool will show the parsed
  job-posting data if the JSON-LD is valid)

Do **not** submit any `/employees/*` or `/employers/*` auth routes — they're
intentionally `noindex`.

## Deployment

`mzobs-landing` (see `render.yaml`) now runs as a Render Node web service
(`npm run build` / `npm start`) instead of a static site — SSR needs a live
process. Set `PUBLIC_JOBS_API_URL` in the Render dashboard to the same value
as `VITE_PUBLIC_JOBS_API_URL` (no `VITE_` prefix — that one only gets inlined
into the client bundle at build time; the server process reads this one
directly at request time). The `Dockerfile` mirrors the same build/run split
for anyone self-hosting outside Render.
