# Mzobs Talent (Recruiter-Frontend)

Recruiter-facing talent search: Search Candidates → filters → AI-ranked results → candidate profile → shortlist / contact / compare / schedule.

```
cp .env.example .env
npm install
npm run dev      # http://localhost:5175
```

## Data source

`VITE_TALENT_SOURCE=demo` (default) searches a generated, clearly-labelled sample pool.
`VITE_TALENT_SOURCE=live` reads `GET /api/employer/candidates` (needs an employer session token from the marketing-site sign-in).

The backend has no cross-company talent search endpoint yet, so live mode ranks the candidates shared with the signed-in company.
Replace `loadPool()` / `searchTalent()` in `src/services/talentService.js` when `GET /talent/search` exists — the UI depends only on that service.

## Where things live

- `src/lib/talent/` — criteria model, query parsers (natural language / boolean), match + trust engine, demo pool
- `src/services/talentService.js` — the only data seam (demo/live adapters, caching, pagination)
- `src/store/workspace.jsx` — shortlists, saved/recent searches, notes, drafts, interviews (localStorage until backed by an API)

## Live mode (existing backend, unchanged)

Dev requests to `/api` and `/files` are proxied to `BACKEND_URL` (default `http://localhost:4000`), so the backend's CORS list is untouched.
Sign-in happens on the marketing site (`/employers/signin`); it hands over a one-time `?code=` that `src/main.jsx` exchanges via `POST /auth/exchange`.

Used endpoints: `GET /candidates` (all pages), `GET /jobs`, `POST /candidates/:id/unlock`, `GET /candidates/:id/resume-url`,
`PATCH /candidates/:id/stage`, `GET|POST /interviews`, `GET /credits`.
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
