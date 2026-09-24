# Mzobs Talent (Recruiter-Frontend)

Recruiter-facing talent search: Search Candidates → filters → AI-ranked results → candidate profile → shortlist / contact / compare / schedule.

```
cp .env.example .env
npm install
npm run dev      # http://localhost:5175
```

## Data source

`VITE_TALENT_SOURCE=demo` searches a generated, clearly-labelled sample pool.
`VITE_TALENT_SOURCE=live` (default) needs an employer session token from the marketing-site sign-in and searches:

- `GET /api/employer/resume-search` — the Resdex-style database of every candidate with a verified CV who is open to opportunities, and
- `GET /api/employer/candidates` — people already in this company's pipeline.

A person in both is one row (the database profile, carrying the company's job/stage/unlock state). Both are loaded in full (up to 5,000 rows each) and ranked in the browser; a search beyond that size needs server-side ranking behind `loadPool()` / `searchTalent()` in `src/services/talentService.js` — the UI depends only on that service.

CVs, email and phone stay hidden until the company spends one CV credit. Unlocking a database profile for the first time adds it to one of the company's jobs (the backend needs a `jobId`), after which the CV shows inline on the profile page.

## Where things live

- `src/lib/talent/` — criteria model, query parsers (natural language / boolean), match + trust engine, demo pool
- `src/services/talentService.js` — the only data seam (demo/live adapters, caching, pagination)
- `src/store/workspace.jsx` — shortlists, saved/recent searches, notes, drafts, interviews (localStorage until backed by an API)

## Live mode

Dev requests to `/api` and `/files` are proxied to `BACKEND_URL` (default `http://localhost:4000`), so the backend's CORS list is untouched.
Sign-in happens on the marketing site (`/employers/signin`); it hands over a one-time `?code=` that `src/main.jsx` exchanges via `POST /auth/exchange`.

Used endpoints: `GET /resume-search` (all pages), `GET /resume-search/:employeeId`, `POST /resume-search/:employeeId/unlock`, `GET /resume-search/:employeeId/resume-url`,
`GET /candidates` (all pages), `GET /candidates/:id`, `POST /candidates/:id/unlock`, `GET /candidates/:id/resume-url`,
`PATCH /candidates/:id/stage`, `GET /jobs`, `GET|POST /interviews`, `GET /credits`.
Filters are generated from the loaded data (`poolMeta` in `talentService.js`): a filter with no data behind it (e.g. industry, notice period, activity) is hidden rather than shown empty.

## Docker / Dokploy

The `Dockerfile` builds the Vite app and serves it with nginx (SPA fallback, same setup as Company-Frontend). Point Dokploy at this folder (`Website/Recruiter-Frontend`) as the build context.

Vite inlines its variables at build time, so set them as **Build-time Arguments** in Dokploy, not runtime env vars:

| Build arg | Example | Purpose |
|---|---|---|
| `VITE_API_URL` | `https://api.example.com/api/employer` | Employer API |
| `VITE_FILE_BASE_URL` | `https://api.example.com` | Resume/file links |
| `VITE_LANDING_URL` | `https://www.example.com` | Marketing site (sign-in redirect) |
| `VITE_TALENT_SOURCE` | `live` (image default) | `demo` serves sample data |

The backend's `CORS_ORIGIN` must include this app's public URL, and the Landing site's `VITE_EMPLOYER_APP_URL` must point here so sign-in redirects into the portal.

```
docker build -t mzobs-recruiter --build-arg VITE_API_URL=https://api.example.com/api/employer --build-arg VITE_FILE_BASE_URL=https://api.example.com --build-arg VITE_LANDING_URL=https://www.example.com .
docker run -p 8080:80 mzobs-recruiter
```
