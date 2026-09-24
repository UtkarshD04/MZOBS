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
