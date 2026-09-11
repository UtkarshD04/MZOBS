import { useEffect, useRef } from 'react'
import { Search, GraduationCap, ShieldCheck, Building2, TrendingUp, MessageCircle } from 'lucide-react'

// The "alive" layer behind the centered Hero's headline/toggle/search box —
// an art-directed, layered bubble composition (not a handful of shapes):
// six large labeled feature bubbles in the foreground, a midground of
// unlabeled medium orbs filling the gaps, a scatter of micro dots for
// texture, a few soft abstract shapes near the edges, and background
// blurred blobs behind everything. All decorative and non-interactive
// except the major bubbles' own hover response.
//
// JobSearchHero's real content sits in a *centered* column (max-w-2xl for
// the heading/toggle, max-w-3xl for the search bar) — at the xl breakpoint's
// narrowest width (1280px) that column's edges land at ~20%/~80% of the
// viewport, so every layer below is placed outside that band (or, for the
// handful that dip inside it, positioned in the empty padding *above* the
// heading — see the "near heading sides" medium orbs) so nothing sits
// behind actual text:
//   xl+  (>=1280px): the full composition below
//   md-lg (768-1279px): two tiny corner accents — the centered column takes
//     up most of the width at this tier
//   <md (mobile): two tiny dots corner-pinned into the section's own
//     top/bottom padding gutter, never over content at all
//
// Motion is CSS-driven (keyframes in index.css, `prefers-reduced-motion`
// aware) so continuous floating costs no JS work; only the subtle mouse
// parallax and the light scroll drift below touch the main thread, and
// only on fine-pointer/hover desktops.

// Six large feature bubbles — foreground layer, 170–220px, staggered both
// vertically AND horizontally (not stacked on one x) so each pair (e.g.
// Find What Fits. → Keep Growing.) clears the next by Euclidean distance,
// not just a vertical gap: three large circles stacked purely vertically
// on one edge literally do not fit in the ~640px of usable height below
// the fixed header, so the diagonal stagger is load-bearing, not stylistic.
//
// Every top/left pair below was solved against this page's *measured*
// geometry, not eyeballed against a screenshot:
//   - the sitewide Navbar is `position: fixed` (h-19 = 76px) sitting *over*
//     this section, which itself starts at the section's own y=0 (its own
//     pt-28/pt-32 padding only pushes the *text* content down, not this
//     absolutely-positioned bubble layer) — so `top` here has to clear 76px
//     of fixed header on its own.
//   - the protected center column (heading max-w-2xl=672px, search bar
//     max-w-3xl=768px, both centered in a max-w-7xl/px-10 wrapper) lands at
//     x∈[256,1024] at the xl-tier's narrowest width (1280px) — every bubble
//     below keeps its near edge outside that band at 1280px, which is the
//     tightest case (wider viewports only add margin, since these are fixed
//     to the *edges* while the protected column re-centers with the extra
//     width).
//   - the section's own rendered height is ~717px (also its clip boundary —
//     HeroBubbleField's root has overflow-hidden) — nothing below is placed
//     so its rest+animation extent exceeds that.
//   - a rotated *square* element's own getBoundingClientRect() reports an
//     inflated axis-aligned box that is NOT the visual circle inscribed in
//     it (rotating a circle about its own center is a no-op visually) — so
//     these were verified against each bubble's true circular extent, not
//     a raw rect measurement.
// `ampY`/`ampX` feed the float keyframes' --amp-y/--amp-x below — kept
// deliberately small (8–12px) so the animation's own extent was already
// accounted for above, not layered on as an afterthought.
const MAJOR_BUBBLES = [
  { label: 'Find What Fits.', sub: 'Real roles. Real growth.', icon: Search, tone: 'blue', size: 220, top: '31%', left: '11%', anim: 'bubble-anim-float-y', ampY: '-8px', dur: '9s', delay: '0s' },
  { label: 'Keep Growing.', sub: 'Feedback that moves you forward.', icon: GraduationCap, tone: 'orange', size: 180, top: '64%', left: '10%', anim: 'bubble-anim-float-diagonal', ampX: '10px', ampY: '-10px', dur: '11s', delay: '0.6s' },
  { label: 'Be Verified.', sub: 'Build trust. Get noticed.', icon: ShieldCheck, tone: 'teal', size: 170, top: '85%', left: '12%', anim: 'bubble-anim-float-y', ampY: '-12px', dur: '13s', delay: '1.2s' },
  { label: 'Hire With Trust.', sub: 'Verified talent, ready to grow.', icon: Building2, tone: 'purple', size: 220, top: '31%', left: '89%', anim: 'bubble-anim-float-x', ampX: '8px', dur: '15s', delay: '0.3s' },
  { label: 'Make Your Move.', sub: 'Discover. Apply. Grow.', icon: TrendingUp, tone: 'blue', size: 180, top: '64%', left: '90%', anim: 'bubble-anim-float-diagonal', ampX: '-10px', ampY: '-10px', dur: '17s', delay: '0.9s' },
  { label: 'Get The Signal.', sub: 'Know what employers value.', icon: MessageCircle, tone: 'pink', size: 170, top: '85%', left: '88%', anim: 'bubble-anim-float-y', ampY: '-12px', dur: '19s', delay: '1.6s' },
]

// Midground: 10 unlabeled medium orbs (28–70px) filling the gaps between
// the major bubbles and the centered column — this is the layer that was
// missing before and made the Hero read as empty.
const MEDIUM_ORBS = [
  { size: 50, top: '6%', left: '17%', tone: 'blue', anim: 'bubble-anim-medium-drift', dur: '18s', delay: '0s' },
  { size: 40, top: '17%', left: '3%', tone: 'purple', anim: 'bubble-anim-medium-drift', dur: '21s', delay: '1s' },
  { size: 62, top: '52%', left: '18%', tone: 'orange', anim: 'bubble-anim-medium-drift', dur: '24s', delay: '2s' },
  { size: 32, top: '97%', left: '20%', tone: 'teal', anim: 'bubble-anim-medium-drift', dur: '19s', delay: '0.5s' },
  { size: 28, top: '4%', left: '35%', tone: 'teal', anim: 'bubble-anim-medium-drift', dur: '20s', delay: '1.5s' },
  { size: 34, top: '4%', left: '65%', tone: 'pink', anim: 'bubble-anim-medium-drift', dur: '22s', delay: '0.8s' },
  { size: 44, top: '9%', left: '83%', tone: 'purple', anim: 'bubble-anim-medium-drift', dur: '23s', delay: '1.2s' },
  { size: 70, top: '15%', left: '98%', tone: 'blue', anim: 'bubble-anim-medium-drift', dur: '26s', delay: '0.3s' },
  { size: 36, top: '56%', left: '82%', tone: 'pink', anim: 'bubble-anim-medium-drift', dur: '20s', delay: '1.8s' },
  { size: 52, top: '97%', left: '80%', tone: 'orange', anim: 'bubble-anim-medium-drift', dur: '25s', delay: '0.6s' },
]

// Micro layer: 15 tiny drifting dots (6–20px) scattered for texture — kept
// out of the direct heading/subtitle band (roughly x 30–70%, y 8–48%) so
// none of them sit in front of actual glyphs' whitespace.
const MICRO_ORBS = [
  { size: 8, top: '3%', left: '45%', tone: 'blue', anim: 'bubble-anim-drift-slow', dur: '22s', delay: '0s' },
  { size: 10, top: '9%', left: '60%', tone: 'orange', anim: 'bubble-anim-pulse', dur: '9s', delay: '1s' },
  { size: 14, top: '21%', left: '11%', tone: 'purple', anim: 'bubble-anim-drift-slow', dur: '24s', delay: '0.4s' },
  { size: 8, top: '15%', left: '91%', tone: 'pink', anim: 'bubble-anim-float-y', dur: '19s', delay: '1.6s' },
  { size: 16, top: '33%', left: '5%', tone: 'teal', anim: 'bubble-anim-float-x', dur: '20s', delay: '0.8s' },
  { size: 10, top: '46%', left: '94%', tone: 'blue', anim: 'bubble-anim-drift-slow', dur: '21s', delay: '1.2s' },
  { size: 12, top: '58%', left: '23%', tone: 'orange', anim: 'bubble-anim-pulse', dur: '11s', delay: '0.3s' },
  { size: 14, top: '62%', left: '77%', tone: 'purple', anim: 'bubble-anim-float-x', dur: '18s', delay: '2s' },
  { size: 8, top: '75%', left: '39%', tone: 'pink', anim: 'bubble-anim-drift-slow', dur: '23s', delay: '0.6s' },
  { size: 10, top: '79%', left: '61%', tone: 'teal', anim: 'bubble-anim-float-y', dur: '17s', delay: '1.4s' },
  { size: 16, top: '90%', left: '26%', tone: 'blue', anim: 'bubble-anim-pulse', dur: '10s', delay: '0.2s' },
  { size: 12, top: '92%', left: '73%', tone: 'orange', anim: 'bubble-anim-float-x', dur: '19s', delay: '1.8s' },
  { size: 6, top: '5%', left: '25%', tone: 'pink', anim: 'bubble-anim-drift-slow', dur: '25s', delay: '1s' },
  { size: 10, top: '96%', left: '50%', tone: 'purple', anim: 'bubble-anim-float-y', dur: '20s', delay: '0.5s' },
  { size: 6, top: '40%', left: '2%', tone: 'teal', anim: 'bubble-anim-pulse', dur: '12s', delay: '2.2s' },
]

// A handful of very soft rounded shapes (not circles) bleeding off the
// edges — the reference's "abstract shape" layer, kept subtle.
const ABSTRACT_SHAPES = [
  { w: 100, h: 64, top: '-4%', left: '42%', tone: 'blue', rotate: 8, radius: '38%', dur: '30s', delay: '0s' },
  { w: 76, h: 110, top: '48%', left: '-6%', tone: 'purple', rotate: -7, radius: '42%', dur: '34s', delay: '2s' },
  { w: 86, h: 118, top: '42%', left: '103%', tone: 'teal', rotate: 10, radius: '40%', dur: '32s', delay: '1s' },
  { w: 110, h: 64, top: '99%', left: '58%', tone: 'pink', rotate: -6, radius: '36%', dur: '28s', delay: '2.6s' },
]

// Background layer: large blurred gradient washes, softest/most out-of-
// focus of all four depth tiers. One extra, oversized wash sits high and
// centered (mostly above the section, bleeding down) to give the heading
// a soft ambient glow the way the reference's backdrop reads.
const BG_BLOBS = [
  { size: 380, top: '92%', left: '10%', tone: 'teal', dur: '30s', delay: '0s' },
  { size: 340, top: '90%', left: '90%', tone: 'pink', dur: '34s', delay: '3s' },
  { size: 260, top: '96%', left: '50%', tone: 'orange', dur: '28s', delay: '1.5s' },
  { size: 520, top: '-18%', left: '50%', tone: 'blue', dur: '36s', delay: '2s' },
]

// Reduced set for the md–lg tier (768–1279px) — two tiny corner accents,
// tucked past where the centered column ever reaches at this tier's
// narrowest (768px) width. Short generic labels here (not the full brand
// copy) — at 56–60px there's no room for anything longer.
const TABLET_MAJORS = [
  { label: 'Find Jobs', icon: Search, tone: 'blue', size: 60, top: '6%', left: '3%', anim: 'bubble-anim-float-y', dur: '13s', delay: '0s' },
  { label: 'Hire Talent', icon: Building2, tone: 'purple', size: 56, top: '68%', left: '97%', anim: 'bubble-anim-breathe', dur: '15s', delay: '0.8s' },
]
const TABLET_ORBS = [
  { size: 9, top: '30%', left: '2%', tone: 'orange', anim: 'bubble-anim-drift-slow', dur: '20s', delay: '0.4s' },
  { size: 8, top: '48%', left: '98%', tone: 'teal', anim: 'bubble-anim-float-x', dur: '18s', delay: '1.2s' },
  { size: 11, top: '88%', left: '4%', tone: 'pink', anim: 'bubble-anim-float-y', dur: '22s', delay: '0.6s' },
]

function BubbleBlob({ b }) {
  return (
    <div className="bubble-parallax absolute" style={{ top: b.top, left: b.left, '--px': '3px', '--py': '2px' }}>
      <div className={`bubble-blob bubble-tone-${b.tone} bubble-anim-blob-drift`} style={{ width: b.size, height: b.size, '--dur': b.dur, '--delay': b.delay }} />
    </div>
  )
}

function AbstractShape({ s }) {
  const halfW = s.w / 2
  const halfH = s.h / 2
  return (
    <div
      className="bubble-parallax absolute"
      style={{ top: `calc(${s.top} - ${halfH}px)`, left: `calc(${s.left} - ${halfW}px)`, '--px': '3px', '--py': '2px' }}
    >
      <div
        className={`bubble-shape bubble-tone-${s.tone} bubble-anim-blob-drift`}
        style={{ width: s.w, height: s.h, borderRadius: s.radius, transform: `rotate(${s.rotate}deg)`, '--dur': s.dur, '--delay': s.delay }}
      />
    </div>
  )
}

// Large, labeled feature bubble — foreground layer. Centered on {top, left}
// via calc() (not a transform: translate(-50%,-50%)) so this element's own
// transform stays free for .bubble-parallax's mouse-driven translate3d — a
// transform set here would win on specificity and silently kill that
// layer's parallax motion.
function MajorBubble({ bub }) {
  const Icon = bub.icon
  const half = bub.size / 2
  // Capped well below the circle's own diameter — these bubbles sit close
  // enough to the viewport edge that text as wide as the circle itself
  // would get clipped mid-word; keeping it narrower means the circle can
  // touch the edge while the text block never does.
  const labelWidth = Math.min(bub.size - 24, 150)
  const subWidth = Math.min(bub.size - 34, 140)
  return (
    <div
      className="bubble-parallax absolute"
      style={{ top: `calc(${bub.top} - ${half}px)`, left: `calc(${bub.left} - ${half}px)`, '--px': '3px', '--py': '2px' }}
    >
      <div className={bub.anim} style={{ '--dur': bub.dur, '--delay': bub.delay, '--amp-x': bub.ampX, '--amp-y': bub.ampY }}>
        <div className="bubble-hover pointer-events-auto flex flex-col items-center justify-center gap-1 text-center">
          <div className={`bubble-surface-major bubble-tone-${bub.tone} flex flex-col items-center justify-center gap-1.5`} style={{ width: bub.size, height: bub.size }}>
            <span className="flex items-center justify-center rounded-full bg-white/90 shadow-sm" style={{ width: Math.round(bub.size * 0.28), height: Math.round(bub.size * 0.28) }}>
              <Icon size={Math.round(bub.size * 0.15)} strokeWidth={2} style={{ color: `rgba(var(--bubble-${bub.tone}-rgb), 0.9)` }} />
            </span>
            <span className="px-3 text-[13px] font-bold leading-tight text-white text-center text-balance" style={{ maxWidth: labelWidth }}>
              {bub.label}
            </span>
            {bub.sub && (
              <span className="px-3 text-[10.5px] font-medium leading-snug text-white/85 text-center text-balance" style={{ maxWidth: subWidth }}>
                {bub.sub}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// Unlabeled orb — shared by the medium (midground) and micro (texture)
// layers, sized and given a mouse-parallax reach by whoever renders it.
function Orb({ orb, px, py }) {
  return (
    <div className="bubble-parallax absolute" style={{ top: orb.top, left: orb.left, '--px': px, '--py': py }}>
      <div className={`bubble-surface bubble-tone-${orb.tone} ${orb.anim}`} style={{ width: orb.size, height: orb.size, '--dur': orb.dur, '--delay': orb.delay }} />
    </div>
  )
}

export default function HeroBubbleField() {
  const rootRef = useRef(null)

  useEffect(() => {
    const el = rootRef.current
    if (!el) return
    if (typeof window === 'undefined') return
    if (!window.matchMedia?.('(hover: hover) and (pointer: fine)').matches) return
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return

    let frame = null
    function handlePointerMove(e) {
      if (frame) return
      frame = requestAnimationFrame(() => {
        frame = null
        const rect = el.getBoundingClientRect()
        const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1
        const ny = ((e.clientY - rect.top) / rect.height) * 2 - 1
        el.style.setProperty('--mx', Math.max(-1, Math.min(1, nx)).toFixed(3))
        el.style.setProperty('--my', Math.max(-1, Math.min(1, ny)).toFixed(3))
      })
    }
    function handlePointerLeave() {
      el.style.setProperty('--mx', 0)
      el.style.setProperty('--my', 0)
    }

    // Light scroll-linked drift on the background wash layer only — small,
    // capped range so it reads as depth rather than the page "sliding".
    let scrollFrame = null
    function handleScroll() {
      if (scrollFrame) return
      scrollFrame = requestAnimationFrame(() => {
        scrollFrame = null
        const sy = Math.max(-30, Math.min(30, window.scrollY * 0.04))
        el.style.setProperty('--sy', `${sy}px`)
      })
    }

    window.addEventListener('pointermove', handlePointerMove, { passive: true })
    window.addEventListener('pointerleave', handlePointerLeave, { passive: true })
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => {
      window.removeEventListener('pointermove', handlePointerMove)
      window.removeEventListener('pointerleave', handlePointerLeave)
      window.removeEventListener('scroll', handleScroll)
      if (frame) cancelAnimationFrame(frame)
      if (scrollFrame) cancelAnimationFrame(scrollFrame)
    }
  }, [])

  return (
    <div ref={rootRef} className="absolute inset-0 z-0 overflow-hidden pointer-events-none" aria-hidden="true">
      {/* Desktop (xl+): the full, layered composition — background washes,
          then major bubbles, medium orbs, micro dots and abstract shapes
          on top, in that depth order. */}
      <div className="hidden xl:block absolute inset-0">
        <div className="bg-scroll-layer absolute inset-0">
          {BG_BLOBS.map((b, i) => <BubbleBlob key={`blob-${i}`} b={b} />)}
        </div>
        {MAJOR_BUBBLES.map((bub) => <MajorBubble key={bub.label} bub={bub} />)}
        {MEDIUM_ORBS.map((orb, i) => <Orb key={`med-${i}`} orb={orb} px="6px" py="5px" />)}
        {ABSTRACT_SHAPES.map((s, i) => <AbstractShape key={`shape-${i}`} s={s} />)}
        {MICRO_ORBS.map((orb, i) => <Orb key={`micro-${i}`} orb={orb} px="10px" py="8px" />)}
      </div>

      {/* Tablet / small desktop (md–lg): two tiny corner accents only —
          the centered column takes up most of the width at this tier. */}
      <div className="hidden md:block xl:hidden absolute inset-0">
        {TABLET_MAJORS.map((bub) => <MajorBubble key={bub.label} bub={bub} />)}
        {TABLET_ORBS.map((orb, i) => <Orb key={`t-orb-${i}`} orb={orb} px="18px" py="14px" />)}
      </div>

      {/* Mobile: two tiny dots pinned into the section's own top/bottom
          padding, well clear of any text at any content length */}
      <div className="md:hidden">
        <div className="bubble-parallax absolute top-3 right-4" style={{ '--px': '6px', '--py': '4px' }}>
          <div className="bubble-surface bubble-tone-blue bubble-anim-float-y" style={{ width: 8, height: 8, '--dur': '14s', '--delay': '0s' }} />
        </div>
        <div className="bubble-parallax absolute bottom-3 right-8" style={{ '--px': '6px', '--py': '4px' }}>
          <div className="bubble-surface bubble-tone-orange bubble-anim-float-x" style={{ width: 6, height: 6, '--dur': '17s', '--delay': '1s' }} />
        </div>
      </div>
    </div>
  )
}
