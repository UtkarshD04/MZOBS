import { useEffect, useState } from 'react'
import { ReactLenis } from 'lenis/react'

// Site-wide momentum/inertia scrolling (the "buttery" feel on premium
// marketing sites) instead of the browser's default 1:1 wheel scroll.
// `root` mode hooks straight into the document — no wrapper divs, so
// nothing else in the layout needs to change. Lenis sets itself up inside
// a useEffect (client-only), so this is SSR/prerender-safe as-is.
const options = {
  duration: 1.05,
  easing: (t) => 1 - Math.pow(1 - t, 3),
  smoothWheel: true,
  // Native touch scroll feels better than a simulated one on phones/tablets —
  // this only smooths wheel (trackpad/mouse) scrolling.
  syncTouch: false,
  touchMultiplier: 1,
}

// Lenis's own `respectReducedMotion` option (on by default) only makes
// *programmatic* scrollTo calls instant — plain wheel scrolling would still
// be smoothed. Turning smoothWheel off entirely here is the accessible
// choice: someone who's asked their OS for reduced motion gets plain native
// scroll, not a lighter version of the animated one.
function prefersReducedMotion() {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

export default function SmoothScroll({ children }) {
  // Starts `false` so the server-rendered/prerendered markup and the
  // client's first paint match (matchMedia doesn't exist during SSR) —
  // ReactLenis renders `children` through unchanged either way, so this
  // never causes a hydration mismatch, only a same-tick effect below.
  const [reducedMotion, setReducedMotion] = useState(false)

  useEffect(() => {
    setReducedMotion(prefersReducedMotion())
  }, [])

  if (reducedMotion) return children

  return (
    <ReactLenis root options={options}>
      {children}
    </ReactLenis>
  )
}
