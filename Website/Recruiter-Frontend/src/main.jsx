import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import '@fontsource/inter/400.css'
import '@fontsource/inter/500.css'
import '@fontsource/inter/600.css'
import '@fontsource/inter/700.css'
import '@fontsource/inter/800.css'
import './index.css'
import App from './App.jsx'
import { IS_DEMO } from './lib/config'
import { exchangeHandoff } from './services/liveApi'

// The marketing site's employer sign-in redirects here with a one-time
// `?code=` (see Landing-Frontend/src/lib/employerAuth.js). Trade it for the
// session token before the app mounts, then strip it from the URL.
async function boot() {
  const url = new URL(window.location.href)
  const code = url.searchParams.get('code')
  if (code && !IS_DEMO) {
    url.searchParams.delete('code')
    window.history.replaceState(null, '', url.pathname === '/dashboard' ? '/' : url.pathname + url.search)
    try {
      await exchangeHandoff(code)
    } catch {
      /* expired/used code — App sends the user back to sign in */
    }
  }
  createRoot(document.getElementById('root')).render(
    <StrictMode>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </StrictMode>,
  )
}
boot()
