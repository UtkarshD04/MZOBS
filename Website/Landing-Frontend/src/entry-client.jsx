import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { GoogleOAuthProvider } from '@react-oauth/google'
import { GOOGLE_CLIENT_ID } from './lib/config'
import { InitialJobContext } from './lib/initialJobContext'
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

// server.js embeds the job it already fetched for /jobs/:id here (see
// buildJobSeo's caller) so JobDetail.jsx can reuse it on hydration instead
// of re-fetching. Every other route leaves this undefined.
const initialJob = typeof window !== 'undefined' ? (window.__INITIAL_JOB__ ?? null) : null

const app = (
  <StrictMode>
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <InitialJobContext.Provider value={initialJob}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </InitialJobContext.Provider>
    </GoogleOAuthProvider>
  </StrictMode>
)

const container = document.getElementById('root')
const initialLoader = document.getElementById('initial-loader')

// Prerendered/SSR'd routes ship real markup inside #root — hydrate it.
// Everything else (plain `npm run dev`, or the client-only SPA shell
// server.js serves for auth/dashboard routes) starts from an empty root,
// so hydrating there would just log a mismatch warning for no benefit.
if (container.hasChildNodes()) {
  // Real content is already on screen — the static loader in index.html
  // would only ever cover it for a single paint, so drop it now.
  initialLoader?.remove()
  hydrateRoot(container, app)
} else {
  createRoot(container).render(app)
  initialLoader?.remove()
}
