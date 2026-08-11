import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

// This app has multiple routed pages (unlike the single-page portals), so a
// route change needs to reset scroll position back to the top.
export default function ScrollToTop() {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return null
}
