import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// In dev, /api and /files are proxied to the existing backend, so the browser
// stays same-origin and the backend's CORS allow-list never needs to change.
export default defineConfig(({ mode }) => {
  const target = loadEnv(mode, process.cwd(), '').BACKEND_URL || 'http://localhost:4000'
  const proxy = { '/api': { target, changeOrigin: true }, '/files': { target, changeOrigin: true } }
  return {
    plugins: [react(), tailwindcss()],
    server: { host: true, port: 5175, strictPort: true, proxy },
    preview: { port: 4175, strictPort: true, proxy },
  }
})
