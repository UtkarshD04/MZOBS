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
  build: {
    rollupOptions: {
      output: {
        // Split large, rarely-changing third-party code into its own
        // cacheable chunks instead of one ~1MB bundle with every page —
        // route-level React.lazy() (see App.jsx) handles splitting *our*
        // code; this handles the vendor code those routes share. Only for
        // the client build: the SSR bundle (isSsrBuild) is a single Node
        // module server.js imports directly, so chunking it serves no
        // purpose there. A function, not the {name: [...]} shorthand — this
        // project's Rollup is actually Rolldown, which only accepts the
        // function form.
        manualChunks: isSsrBuild
          ? undefined
          : (id) => {
              if (!id.includes('node_modules')) return undefined
              if (id.includes('node_modules/react-dom') || id.includes('node_modules/react-router') || id.includes('node_modules/react/'))
                return 'vendor'
              if (id.includes('node_modules/framer-motion')) return 'vendor-motion'
              if (id.includes('node_modules/gsap')) return 'vendor-gsap'
              if (id.includes('node_modules/lenis')) return 'vendor-lenis'
              return undefined
            },
      },
    },
  },
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
