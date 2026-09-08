import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig(({ isSsrBuild }) => ({
  plugins: [react(), tailwindcss()],
  // The SSR bundle (entry-server.jsx, built via `vite build --ssr`) never
  // serves assets itself — server.js serves the client build's public/
  // output instead — so skip copying public/ into dist/server too.
  publicDir: isSsrBuild ? false : 'public',
  server: {
    host: true,
    port: 5176,
    // fail loudly instead of silently hopping to another app's port
    strictPort: true,
    // leading dot = allow the domain and all its subdomains,
    // so a new cloudflare tunnel URL works without editing this file
    allowedHosts: ['.trycloudflare.com'],
  },
  preview: {
    port: 4176,
    strictPort: true,
  },
}))
