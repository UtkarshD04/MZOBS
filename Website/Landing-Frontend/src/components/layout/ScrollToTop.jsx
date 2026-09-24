import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

// This app has multiple routed pages (unlike the single-page portals), so a
// route change needs to reset scroll position back to the top. Plain native
// scrolling (see index.css's `scroll-behavior: smooth`) handles the actual
// animation — this just decides where to send it.
export default function ScrollToTop() {
  // `key` is new on every navigation — even a click on a link to the URL
  // we're already on (e.g. the navbar's "Companies" while at /#companies,
  // after scrolling away) — so every such click scrolls to its section again.
  const { pathname, hash, key } = useLocation()

  useEffect(() => {
    if (!hash) {
      window.scrollTo(0, 0)
      return
    }

    // On a cross-page hash link (e.g. the navbar's "Browse Categories" from
    // another route), the target page's DOM may not exist yet on this first
    // effect run — the new route mounts synchronously now (App.jsx no
    // longer waits on an exit animation), but a lazy-loaded page's chunk
    // still needs a moment to fetch. Retry briefly instead of failing over
    // to the top immediately.
    let cancelled = false
    let attempts = 0
    const id = hash.slice(1)

    function tryScroll() {
      if (cancelled) return
      const el = document.getElementById(id)
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' })
        return
      }
      attempts += 1
      if (attempts < 12) setTimeout(tryScroll, 60)
      else window.scrollTo(0, 0)
    }
    tryScroll()

    return () => {
      cancelled = true
    }
  }, [pathname, hash, key])

  return null
}
