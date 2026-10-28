import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { GoogleOAuthProvider } from '@react-oauth/google'
import { GOOGLE_CLIENT_ID } from './lib/config'
import { InitialJobContext } from './lib/initialJobContext'
import { InitialHomeDataContext } from './lib/initialHomeDataContext'
import '@fontsource/inter/400.css'
import '@fontsource/inter/500.css'
import '@fontsource/inter/600.css'
import '@fontsource/inter/700.css'
import '@fontsource/inter/800.css'
import '@fontsource/playfair-display/400.css'
import '@fontsource/playfair-display/400-italic.css'
import '@fontsource/playfair-display/700.css'
import '@fontsource/playfair-display/700-italic.css'
import './index.css'
import App from './App.jsx'
import { installClickShine } from './lib/clickShine'
import { initAnalytics } from './lib/analytics'

// server.js embeds the job it already fetched for /jobs/:id here (see
// buildJobSeo's caller) so JobDetail.jsx can reuse it on hydration instead
// of re-fetching. Every other route leaves this undefined.
const initialJob = typeof window !== 'undefined' ? (window.__INITIAL_JOB__ ?? null) : null
// scripts/prerender.js embeds the home page's default job/category/city data
// it already fetched at build time here (see initialHomeDataContext.js) so
// JobMarketplace/CategoryGrid/HotJobsByCity render real numbers on first
// paint instead of their loading/zero state; every other route leaves this
// undefined.
const initialHomeData = typeof window !== 'undefined' ? (window.__INITIAL_HOME_DATA__ ?? null) : null

installClickShine()
initAnalytics()

// Each deploy replaces the hashed chunks, so a tab opened before it fails to
// lazy-load a page ("Failed to fetch dynamically imported module"). Reload
// once to pick up the new build; the 10s guard stops a reload loop if the
// chunk is genuinely broken.
window.addEventListener('vite:preloadError', (event) => {
  const KEY = 'mz-chunk-reload-at'
  let last = 0
  try {
    last = Number(sessionStorage.getItem(KEY)) || 0
    if (Date.now() - last < 10000) return
    sessionStorage.setItem(KEY, String(Date.now()))
  } catch {
    // Storage blocked: still reload, the browser's own retry limits apply.
  }
  event.preventDefault()
  window.location.reload()
})

const app = (
  <StrictMode>
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <InitialJobContext.Provider value={initialJob}>
        <InitialHomeDataContext.Provider value={initialHomeData}>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </InitialHomeDataContext.Provider>
      </InitialJobContext.Provider>
    </GoogleOAuthProvider>
  </StrictMode>
)

const container = document.getElementById('root')
const initialLoader = document.getElementById('initial-loader')

// Prerendered/SSR'd routes ship real markup inside #root — hydrate it.
// Everything else (plain `npm run dev`, or the client-only SPA shell
// server.js serves for auth/dashboard routes) starts from an empty root
// containing only the literal `<!--app-html-->` placeholder comment from
// index.html — `hasChildNodes()` counts that comment as a child, so it was
// always true and hydrateRoot ran against non-matching content on every
// single page load, discarding and rebuilding the whole tree (a visible
// flash — the navbar included — right after first paint). Checking for an
// actual Element child instead of any child node fixes that.
function removeLoader() {
  if (initialLoader) initialLoader.remove()
}

if (container.firstElementChild) {
  // Real content is already on screen — the static loader in index.html
  // would only ever cover it for a single paint, so drop it now.
  removeLoader()
  hydrateRoot(container, app)
} else {
  createRoot(container).render(app)
  removeLoader()
}
