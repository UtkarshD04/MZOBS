import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'react-hot-toast'
import './index.css'
import App from './App.jsx'
import { AppProvider } from './context/AppContext'
import { queryClient } from './lib/queryClient'

// Landing-Frontend hands off a freshly issued token via ?token= after
// sign-in/sign-up, since localStorage isn't shared across origins/ports.
// This must run before React mounts — any component's data-fetching effect
// could otherwise fire (and read a missing token from localStorage) before
// a same-tree effect had a chance to store it.
const incomingToken = new URLSearchParams(window.location.search).get('token')
if (incomingToken) {
  localStorage.setItem('mzobs-employer-token', incomingToken)
  const url = new URL(window.location.href)
  url.searchParams.delete('token')
  window.history.replaceState(null, '', url)
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AppProvider>
          <App />
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3400,
              style: {
                background: 'var(--color-surface)',
                color: 'var(--color-ink)',
                border: '1px solid var(--color-border)',
                borderRadius: '10px',
                fontSize: '13px',
                fontWeight: 500,
                boxShadow: 'var(--shadow-md)',
              },
              success: { iconTheme: { primary: '#15803d', secondary: '#fff' } },
              error: { iconTheme: { primary: '#b42318', secondary: '#fff' } },
            }}
          />
        </AppProvider>
      </BrowserRouter>
    </QueryClientProvider>
  </StrictMode>,
)
