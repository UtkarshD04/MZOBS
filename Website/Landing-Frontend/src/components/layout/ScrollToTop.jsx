import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

// This app has multiple routed pages (unlike the single-page portals), so a
// route change needs to reset scroll position back to the top.
export default function ScrollToTop() {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    if (!hash) {
      window.scrollTo(0, 0)
      return
    }

    // App.jsx wraps routes in <AnimatePresence mode="wait">, so on a
    // cross-page hash link (e.g. the navbar's "Browse Categories" from
    // another route) the target page's DOM hasn't mounted yet on this
    // first effect run — it only appears once the old page's ~0.35s exit
    // transition finishes. Retry briefly instead of failing over to the
    // top immediately.
    let cancelled = false
    let attempts = 0
    const id = hash.slice(1)

    function tryScroll() {
      if (cancelled) return
      const el = document.getElementById(id)
      if (el) {
        el.scrollIntoView()
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
  }, [pathname, hash])

  return null
}
