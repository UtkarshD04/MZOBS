import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: true,
    port: 5177,
    // fail loudly instead of silently hopping to another app's port
    strictPort: true,
    // leading dot = allow the domain and all its subdomains,
    // so a new cloudflare tunnel URL works without editing this file
    allowedHosts: ['.trycloudflare.com'],
  },
  preview: {
    port: 4177,
    strictPort: true,
  },
})
