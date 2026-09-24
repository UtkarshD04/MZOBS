import { useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

// Section-to-section transitions for the home page — see Home.jsx, which is
// the only file that renders these (one between each pair of sections). Each
// seam sits at zero height between two sections (so it never adds page
// spacing) and paints a small, scroll-scrubbed handoff — a soft colour wash
// bridging the hard background cut between the two sections, plus one small
// motif with its own identity per transition. `position: relative` + a
// positive z-index (rather than reaching into either section) is what lets
// it paint over both neighbours' backgrounds regardless of which of them
// happens to be `position: relative` itself — see the long comment above
// BLUE below for why that combination was chosen.
//
// Deliberately NOT gated on prefers-reduced-motion, matching this page's
// other interactive/decorative motion (HeroBubbleField, the rails, the
// employer section) — it's a one-shot scroll-scrub, not a looping effect.

const BLUE = '#2563EB'
const PURPLE = '#6C5CF0'
const TEAL = '#0B7A6D'
const NAVY = '#0F2338'

function alpha(hex, a) {
  const n = parseInt(hex.slice(1), 16)
  return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${a})`
}

// `wash` blends the two neighbouring backgrounds across the seam's own
// height, fading to transparent at the seam's own top/bottom edges so it
// reads as a bridge, not a stripe — each neighbour's real background shows
// through right up to the seam.
// Each variant's top/bottom are how far the seam extends above/below the
// section boundary — sized to roughly half of that boundary's own measured
// whitespace (the neighbouring sections' fixed py-* padding), so even the
// tightest real page state still leaves a safety margin before any real
// heading, card or button.
const VARIANTS = {
  'search-discovery': {
    top: 18,
    bottom: 40,
    wash: `linear-gradient(180deg, transparent 0%, ${alpha(BLUE, 0.05)} 45%, ${alpha(BLUE, 0.04)} 60%, transparent 100%)`,
    Motif: SearchDiscoveryMotif,
  },
  'jobs-city': {
    top: 8,
    bottom: 40,
    wash: `linear-gradient(180deg, transparent 0%, ${alpha('#EAF4FF', 0.55)} 55%, transparent 100%)`,
    Motif: LocationMotif,
  },
  'city-category': {
    top: 22,
    bottom: 40,
    wash: `linear-gradient(180deg, transparent 0%, ${alpha(TEAL, 0.05)} 50%, transparent 100%)`,
    Motif: MomentumMotif,
  },
  'category-matching': {
    top: 28,
    bottom: 46,
    wash: `linear-gradient(180deg, transparent 0%, ${alpha(BLUE, 0.06)} 50%, transparent 100%)`,
    Motif: FocusMotif,
  },
  'matching-companies': {
    top: 36,
    bottom: 52,
    wash: `linear-gradient(180deg, transparent 0%, ${alpha(PURPLE, 0.05)} 50%, transparent 100%)`,
    Motif: IdentityMotif,
  },
  'companies-hiring': {
    top: 38,
    bottom: 44,
    wash: `linear-gradient(180deg, transparent 0%, ${alpha(NAVY, 0.55)} 35%, ${alpha(NAVY, 0.92)} 65%, ${NAVY} 100%)`,
    Motif: LogosContractMotif,
  },
  'hiring-footer': {
    top: 14,
    bottom: 60,
    wash: `linear-gradient(180deg, ${NAVY} 0%, ${alpha(NAVY, 0.6)} 40%, transparent 100%)`,
    Motif: null,
  },
}

function SearchDiscoveryMotif() {
  return (
    <>
      <span
        data-seam-a
        className="absolute left-1/2 top-1/2 h-7 w-16 -translate-x-1/2 -translate-y-1/2 rounded-full border"
        style={{ borderColor: alpha(BLUE, 0.3) }}
        aria-hidden="true"
      />
      <span
        data-seam-b
        className="absolute left-1/2 top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{ backgroundColor: BLUE, boxShadow: `0 0 18px 6px ${alpha(BLUE, 0.35)}` }}
        aria-hidden="true"
      />
    </>
  )
}

function LocationMotif() {
  return (
    <svg data-seam-a className="absolute left-1/2 top-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 21s-7-6.1-7-11.5A7 7 0 0 1 19 9.5C19 14.9 12 21 12 21Z"
        stroke={alpha('#1D4ED8', 0.55)}
        strokeWidth="1.5"
      />
      <circle cx="12" cy="9.5" r="2.25" stroke={alpha('#1D4ED8', 0.55)} strokeWidth="1.5" />
    </svg>
  )
}

function MomentumMotif() {
  return (
    <span
      data-seam-a
      className="absolute left-1/2 top-1/2 h-[2px] w-24 -translate-x-1/2 -translate-y-1/2 rounded-full"
      style={{ backgroundImage: `linear-gradient(90deg, transparent, ${alpha(TEAL, 0.55)}, ${alpha(BLUE, 0.5)}, transparent)` }}
      aria-hidden="true"
    />
  )
}

function FocusMotif() {
  const corner = 'absolute h-3 w-3 border-(--seam-blue)'
  return (
    <span data-seam-a className="absolute left-1/2 top-1/2 h-9 w-9 -translate-x-1/2 -translate-y-1/2" style={{ '--seam-blue': alpha(BLUE, 0.45) }} aria-hidden="true">
      <span className={`${corner} left-0 top-0 border-l-[1.5px] border-t-[1.5px]`} />
      <span className={`${corner} right-0 top-0 border-r-[1.5px] border-t-[1.5px]`} />
      <span className={`${corner} bottom-0 left-0 border-b-[1.5px] border-l-[1.5px]`} />
      <span className={`${corner} bottom-0 right-0 border-b-[1.5px] border-r-[1.5px]`} />
    </span>
  )
}

function IdentityMotif() {
  return (
    <span
      data-seam-a
      className="absolute left-1/2 top-1/2 h-7 w-7 -translate-x-1/2 -translate-y-1/2 rounded-[9px] border bg-white/70"
      style={{ borderColor: alpha(PURPLE, 0.3) }}
      aria-hidden="true"
    />
  )
}

function LogosContractMotif() {
  return (
    <span data-seam-a className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center gap-2.5" aria-hidden="true">
      {[0, 1, 2, 3].map((i) => (
        <span key={i} className="h-2.5 w-2.5 rounded-full bg-white/70" />
      ))}
    </span>
  )
}

export default function SectionSeam({ variant }) {
  const rootRef = useRef(null)
  const cfg = VARIANTS[variant]

  // The two colour-inversion seams (light→dark, dark→white) aren't decorative
  // motion — they're what stops those two boundaries being a hard cut, so
  // they stay statically visible regardless of motion preference (plain CSS,
  // no scroll-linked movement at all). Everything else is a genuine,
  // scroll-scrubbed handoff, so it honours prefers-reduced-motion: reduced
  // motion gets a calm, static "settled" version instead of the scrub.
  const isBlend = variant === 'companies-hiring' || variant === 'hiring-footer'

  useLayoutEffect(() => {
    const root = rootRef.current
    if (!root || !cfg) return undefined

    if (isBlend) {
      const wash = root.querySelector('[data-seam-wash]')
      const a = root.querySelector('[data-seam-a]')
      gsap.set(wash, { autoAlpha: 1 })
      const mm = gsap.matchMedia()
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        if (!a) return undefined
        gsap.set(a, { autoAlpha: 0, scale: 0.6 })
        const tween = gsap.to(a, {
          autoAlpha: 1,
          scale: 1,
          scrollTrigger: { trigger: root, start: 'top 90%', end: 'top 50%', scrub: 0.4 },
        })
        return () => tween.kill()
      })
      if (a) mm.add('(prefers-reduced-motion: reduce)', () => gsap.set(a, { autoAlpha: 0.6, scale: 1 }))
      return () => mm.revert()
    }

    const mm = gsap.matchMedia()
    mm.add({ motion: '(prefers-reduced-motion: no-preference)', reduced: '(prefers-reduced-motion: reduce)' }, (ctx) => {
      const wash = root.querySelector('[data-seam-wash]')
      const a = root.querySelector('[data-seam-a]')
      const b = root.querySelector('[data-seam-b]')

      if (ctx.conditions.reduced) {
        gsap.set(wash, { autoAlpha: 0.6 })
        if (a) gsap.set(a, { autoAlpha: 0.7, scale: 1, y: 0 })
        if (b) gsap.set(b, { autoAlpha: 0.5, scale: 1 })
        return undefined
      }

      gsap.set(wash, { autoAlpha: 0 })
      if (a) gsap.set(a, { autoAlpha: 0, scale: variant === 'category-matching' ? 1.35 : 0.7, y: 10 })
      if (b) gsap.set(b, { autoAlpha: 0, scale: 0.5 })

      const tl = gsap.timeline({
        scrollTrigger: { trigger: root, start: 'top bottom', end: 'bottom top', scrub: 0.4 },
      })
      tl.to(wash, { autoAlpha: 1, duration: 0.35 }, 0).to(wash, { autoAlpha: 0, duration: 0.35 }, 0.65)
      if (a) {
        tl.to(a, { autoAlpha: 1, scale: 1, y: 0, duration: 0.35 }, 0.12)
        tl.to(a, { autoAlpha: 0, scale: variant === 'category-matching' ? 0.85 : 1.15, duration: 0.3 }, 0.7)
      }
      if (b) {
        tl.to(b, { autoAlpha: 1, scale: 1, duration: 0.3 }, 0.4)
        tl.to(b, { autoAlpha: 0, scale: 1.6, duration: 0.3 }, 0.75)
      }
      return () => tl.kill()
    })
    return () => mm.revert()
  }, [cfg, variant, isBlend])

  if (!cfg) return null
  const Motif = cfg.Motif

  return (
    <div ref={rootRef} data-seam={variant} className="relative z-[5] h-0 overflow-visible" aria-hidden="true">
      {/* top/bottom are deliberately asymmetric (sized to each side's own
          real padding), so the motif's `top-1/2` below — the band's own
          geometric middle — naturally lands at the right spot rather than
          exactly on the section boundary. */}
      <div className="pointer-events-none absolute inset-x-0" style={{ top: -cfg.top, height: cfg.top + cfg.bottom }}>
        <div data-seam-wash className="absolute inset-0" style={{ background: cfg.wash }} />
        {Motif && <Motif />}
      </div>
    </div>
  )
}
