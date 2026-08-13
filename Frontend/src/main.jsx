import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { QueryClientProvider } from '@tanstack/react-query'
import '@fontsource/inter/400.css'
import '@fontsource/inter/500.css'
import '@fontsource/inter/600.css'
import '@fontsource/inter/700.css'
import '@fontsource/inter/800.css'
import './index.css'
import App from './App.jsx'
import { queryClient } from './lib/queryClient'

// Landing-Frontend hands off a freshly issued token via ?token= after
// sign-in, since localStorage isn't shared across origins/ports. This must
// run before React mounts — a data-fetching effect could otherwise fire
// (and read a missing token) before a same-tree effect had a chance to store it.
const incomingToken = new URLSearchParams(window.location.search).get('token')
if (incomingToken) {
  localStorage.setItem('mzobs-employee-token', incomingToken)
  const url = new URL(window.location.href)
  url.searchParams.delete('token')
  window.history.replaceState(null, '', url)
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </QueryClientProvider>
  </StrictMode>,
)
