import { renderToString } from 'react-dom/server'
import { StaticRouter } from 'react-router'
import { GoogleOAuthProvider } from '@react-oauth/google'
import { GOOGLE_CLIENT_ID } from './lib/config.js'
import { InitialJobContext } from './lib/initialJobContext.js'
import App from './App.jsx'

// Node-only entry, built by `vite build --ssr` into dist/server/entry-server.js
// and imported directly by server.js (build-time prerender.js) and per-request
// by server.js (the live /jobs/:id route). Renders just the app's inner
// markup — server.js/prerender.js splice it into index.html's <!--app-html-->
// placeholder, and build the <head> tags separately (renderHead.js) rather
// than relying on React's title/meta hoisting inside a partial (non-<html>)
// renderToString tree.
export function render(url, initialJob = null) {
  return renderToString(
    <StaticRouter location={url}>
      <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
        <InitialJobContext.Provider value={initialJob}>
          <App />
        </InitialJobContext.Provider>
      </GoogleOAuthProvider>
    </StaticRouter>
  )
}
