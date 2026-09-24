import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Check } from 'lucide-react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ExplorerTextLink } from '../../ui/ExplorerButton'
import { initialsOf, jobHref } from '../../../lib/jobCardHelpers'
import { fetchRecommendedJobs } from '../../../lib/recommendedJobs'
import { getEmployeeSession, onEmployeeSessionChange } from '../../../lib/employeeSession'
import { EMPLOYEE_APP_URL } from '../../../lib/config'
import { sampleJobs, MATCH_LEVELS } from './recommendedForYouData'

gsap.registerPlugin(ScrollTrigger)

const RESULT_LIMIT = 5
// How long each card stays in front before the deck turns on its own.
const AUTOPLAY_MS = 3000

// Section-local palette, built from the home page's own blue / lavender / teal
// tones (same family as the Hero's blue→purple gradient); not added to the
// global --explorer-* tokens.
const PAPER = '#F4F7FC'
const INK = '#162B3A'
const MUTED = '#64748B'
const BLUE = '#2563EB'
// Same gradient the Hero uses for its highlighted headline word and its CTA.
const GRADIENT = 'var(--hero-cta-gradient)'
const gradientText = { backgroundImage: GRADIENT, WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent' }
const RULE = 'rgba(22,43,58,0.12)'

// Each job carries an `accent`; it picks the card surface and the small
// details (rule, label dot, logo-frame edge, page dot).
const THEMES = {
  blue: { bg: '#EAF2FE', accent: BLUE, markInk: '#1D4ED8', border: 'rgba(37,99,235,0.18)' },
  lavender: { bg: '#F1EEFC', accent: '#7C5CE8', markInk: '#5B3FC4', border: 'rgba(124,92,232,0.2)' },
  mint: { bg: '#EAF6F1', accent: '#168A72', markInk: '#0F6B58', border: 'rgba(22,138,114,0.2)' },
}
const ACCENT_ORDER = ['blue', 'lavender', 'mint']
const themeOf = (job) => THEMES[job.accent] ?? THEMES.blue

// Deck poses: index 0 is the active card, 1–2 sit behind it and show as thin
// slivers (top/right, then bottom/right); anything deeper stays hidden.
const Z = [30, 20, 10]
const POSES = {
  regular: [
    { x: 0, y: 0, scale: 1, rotation: 0 },
    { x: 36, y: -18, scale: 0.955, rotation: 2 },
    { x: 68, y: 20, scale: 0.91, rotation: -1.5 },
  ],
  compact: [
    { x: 0, y: 0, scale: 1, rotation: 0 },
    { x: 20, y: -12, scale: 0.96, rotation: 1.5 },
    { x: 38, y: 14, scale: 0.92, rotation: -1 },
  ],
}

const CARD_FOCUS = 'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--explorer-blue)'

function levelForReasonCount(n) {
  if (n >= 3) return 'strong'
  if (n === 2) return 'good'
  return 'relevant'
}

function skillNames(list) {
  return (Array.isArray(list) ? list : []).map((s) => (typeof s === 'string' ? s : s?.name)).filter(Boolean)
}

// Real recommended job -> the deck's job shape (see recommendedForYouData.js).
// Match strength comes from how many concrete reasons the backend gave — never
// a made-up percentage.
function toDeckJob(job, i) {
  const matchReasons = Array.isArray(job.matchReasons) ? job.matchReasons.filter(Boolean) : []
  return {
    id: job.id,
    company: job.company,
    logo: job.logo,
    role: job.title,
    location: job.location,
    employmentType: job.employmentType ?? job.type ?? '',
    skills: skillNames(job.skills ?? job.requiredSkills).slice(0, 4),
    matchLevel: levelForReasonCount(matchReasons.length),
    matchReasons,
    accent: ACCENT_ORDER[i % ACCENT_ORDER.length],
    href: jobHref(job),
  }
}

const pad = (n) => String(n).padStart(2, '0')

function JobLink({ job, className, style, children, ...props }) {
  if (job.to) {
    return (
      <Link to={job.to} className={className} style={style} {...props}>
        {children}
      </Link>
    )
  }
  return (
    <a href={job.href} className={className} style={style} {...props}>
      {children}
    </a>
  )
}

// White logo frame: the real company logo when there is one, otherwise a
// monogram (from the company, or the role for sample jobs with no company).
function LogoFrame({ job }) {
  const theme = themeOf(job)
  return (
    <span
      data-logo
      className="flex h-[60px] w-[60px] shrink-0 items-center justify-center rounded-[16px] border bg-white sm:h-[84px] sm:w-[84px] sm:rounded-[18px] motion-safe:transition-transform motion-safe:duration-300 group-hover:scale-[1.03]"
      style={{ borderColor: theme.border }}
    >
      {job.logo ? (
        <img src={job.logo} alt="" aria-hidden="true" draggable={false} className="h-full w-full rounded-[18px] object-contain p-2.5" />
      ) : (
        <span className="text-[22px] font-extrabold sm:text-[30px]" style={{ color: theme.markInk }} aria-hidden="true">
          {initialsOf(job.company || job.role)}
        </span>
      )}
    </span>
  )
}

function DeckCard({ job, index, total, isActive, cardRef }) {
  const theme = themeOf(job)
  return (
    <div
      ref={cardRef}
      data-front={isActive ? '' : undefined}
      inert={!isActive}
      aria-hidden={!isActive}
      className={`group absolute left-0 top-7 h-[372px] w-[calc(100%-44px)] max-w-[620px] select-none overflow-hidden rounded-[28px] border shadow-[0_18px_45px_rgba(22,43,58,0.07)] sm:top-[34px] sm:h-[390px] sm:w-[calc(100%-64px)] lg:h-[360px] ${
        isActive ? 'motion-safe:transition-[translate] motion-safe:duration-300 motion-safe:hover:-translate-y-1' : ''
      }`}
      style={{ backgroundColor: theme.bg, borderColor: theme.border, touchAction: 'pan-y' }}
    >
      <span data-accent className="absolute inset-y-0 left-0 w-1" style={{ backgroundColor: theme.accent }} aria-hidden="true" />

      <div data-content className="relative flex h-full flex-col p-5 pl-7 sm:p-8 sm:pl-10">
        {/* Oversized, near-invisible watermark of the company mark */}
        {job.logo ? (
          <img
            src={job.logo}
            alt=""
            aria-hidden="true"
            draggable={false}
            className="pointer-events-none absolute -bottom-10 -right-8 h-64 w-64 object-contain opacity-[0.045] grayscale"
          />
        ) : (
          <span
            className="pointer-events-none absolute -bottom-12 -right-4 text-[230px] font-black leading-none tracking-tighter"
            style={{ color: INK, opacity: 0.04 }}
            aria-hidden="true"
          >
            {initialsOf(job.company || job.role)}
          </span>
        )}

        <div className="relative flex items-start justify-between gap-4">
          <LogoFrame job={job} />
          <div className="flex flex-col items-end gap-2.5">
            <span className="text-[11px] font-black tracking-[0.18em]" style={{ color: MUTED }}>
              {pad(index + 1)} / {pad(total)}
            </span>
            <span className="inline-flex items-center gap-1.5 text-[10.5px] font-black uppercase tracking-[0.14em]" style={{ color: INK }}>
              <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: theme.accent }} aria-hidden="true" />
              {MATCH_LEVELS[job.matchLevel].label}
            </span>
          </div>
        </div>

        <h3 className="relative mt-4 text-[24px] font-extrabold leading-[1.06] tracking-tight sm:mt-5 sm:text-[33px]" style={{ color: INK }}>
          {job.role}
        </h3>
        <p className="relative mt-1.5 text-[14.5px] sm:text-[15.5px]" style={{ color: MUTED }}>
          {[job.company, job.location, job.employmentType].filter(Boolean).join(' · ')}
        </p>
        {job.skills.length > 0 && (
          <p className="relative mt-2 text-[14.5px] font-semibold sm:mt-3 sm:text-[16px]" style={{ color: INK }}>
            {job.skills.join(' · ')}
          </p>
        )}

        <div className="relative mt-auto flex flex-wrap items-end justify-between gap-x-6 gap-y-3 border-t pt-3 sm:pt-4" style={{ borderColor: RULE }}>
          {job.matchReasons.length > 0 && (
            <ul className="flex flex-wrap gap-x-4 gap-y-1.5">
              {job.matchReasons.map((reason) => (
                <li key={reason} className="flex items-center gap-1 text-[13.5px] font-semibold" style={{ color: INK }}>
                  <Check size={15} strokeWidth={2.8} style={{ color: theme.accent }} aria-hidden="true" />
                  {reason}
                </li>
              ))}
            </ul>
          )}
          <JobLink
            job={job}
            draggable={false}
            className={`inline-flex items-center gap-1.5 text-[12.5px] font-extrabold uppercase tracking-wide ${CARD_FOCUS}`}
            style={{ color: BLUE }}
          >
            View opportunity
            <ArrowRight size={15} aria-hidden="true" className="motion-safe:transition-transform motion-safe:duration-200 group-hover:translate-x-1" />
          </JobLink>
        </div>
      </div>
    </div>
  )
}

// The match deck: the active opportunity sits on top of a stack whose edges
// peek out behind it. NEXT / PREVIOUS (or a drag / swipe on the front card)
// move the front card back into the deck while the next one comes forward —
// one GSAP timeline, and nothing moves unless the visitor asks it to. Under
// the visitor's own reduced-motion setting is deliberately not applied (see below).
function JobDeck({ jobs, isSample }) {
  const n = jobs.length
  const rootRef = useRef(null)
  const stageRef = useRef(null)
  const cardRefs = useRef([])
  const numRef = useRef(null)
  const api = useRef(null)
  const busy = useRef(false)
  const activeRef = useRef(0)
  const drag = useRef(null)
  const suppressClick = useRef(false)
  const didMount = useRef(false)
  const entered = useRef(false)
  const paused = useRef(false)
  const inView = useRef(false)
  const [active, setActive] = useState(0)

  useLayoutEffect(() => {
    const root = rootRef.current
    if (!root) return undefined
    const mm = gsap.matchMedia()
    // Motion is intentionally NOT gated on prefers-reduced-motion here: many
    // Windows setups report it as on by default, and the deck's movement is
    // the point of this section (it only runs on the visitor's own click/drag).
    mm.add({ always: '(min-width: 0px)', compact: '(max-width: 639px)' }, (ctx) => {
      const canMove = true
      const { compact } = ctx.conditions
      const cards = cardRefs.current.slice(0, n)
      const set = compact ? POSES.compact : POSES.regular
      const poseOf = (depth) => {
        const p = set[Math.min(depth, 2)]
        return { x: p.x, y: p.y, scale: p.scale, rotation: canMove ? p.rotation : 0 }
      }
      const depthOf = (i, a) => (i - a + n) % n
      const contentOf = (el) => el.querySelector('[data-content]')

      const layoutAll = () => {
        cards.forEach((el, i) => {
          const d = depthOf(i, activeRef.current)
          gsap.set(el, { ...poseOf(d), zIndex: Z[d] ?? 0, autoAlpha: d < 3 ? 1 : 0 })
          gsap.set(contentOf(el), { opacity: d === 0 ? 1 : 0 })
        })
      }
      layoutAll()

      // Move to card `to`. `dir` is 1 (next) or -1 (previous); `fromDrag`
      // skips the wind-up because the card is already off to the side.
      const go = (to, dir, fromDrag = false) => {
        if (busy.current || to === activeRef.current || n < 2) return
        busy.current = true
        const from = activeRef.current
        activeRef.current = to
        setActive(to)

        if (!canMove) {
          layoutAll()
          gsap.fromTo(cards[to], { opacity: 0 }, { opacity: 1, duration: 0.25, onComplete: () => (busy.current = false) })
          return
        }

        const tl = gsap.timeline({ defaults: { ease: 'power3.inOut' }, onComplete: () => (busy.current = false) })
        const leaving = cards[from]
        const incoming = cards[to]

        cards.forEach((el, i) => {
          if (i === from || i === to) return
          const d = depthOf(i, to)
          tl.to(el, { ...poseOf(d), autoAlpha: d < 3 ? 1 : 0, duration: 0.75 }, 0).set(el, { zIndex: Z[d] ?? 0 }, 0.3)
        })

        // Leaving card: step back and to the side, then slot into the deck.
        const leaveDepth = depthOf(from, to)
        if (dir > 0 && !fromDrag) {
          tl.to(leaving, { x: -30, scale: 0.94, rotation: -3, duration: 0.32, ease: 'power2.out' }, 0)
          tl.set(leaving, { zIndex: Z[leaveDepth] ?? 0 }, 0.32)
          tl.to(leaving, { ...poseOf(leaveDepth), autoAlpha: leaveDepth < 3 ? 1 : 0, duration: 0.43 }, 0.32)
        } else {
          tl.set(leaving, { zIndex: Z[leaveDepth] ?? 0 }, 0.3)
          tl.to(leaving, { ...poseOf(leaveDepth), autoAlpha: leaveDepth < 3 ? 1 : 0, duration: 0.75 }, 0)
        }

        // Incoming card: from the deck (next) or from the left (previous).
        if (dir < 0) {
          tl.set(incoming, { x: -34, y: 0, scale: 0.94, rotation: -3, autoAlpha: 0, zIndex: 25 }, 0)
          tl.to(incoming, { autoAlpha: 1, duration: 0.25, ease: 'power1.out' }, 0)
        }
        tl.set(incoming, { zIndex: Z[0] }, 0.3)
        tl.to(incoming, { ...poseOf(0), duration: 0.75 }, 0)

        // Content cross-fade + a small logo settle.
        tl.to(contentOf(leaving), { opacity: 0, duration: 0.3, ease: 'power1.out' }, 0)
        tl.to(contentOf(incoming), { opacity: 1, duration: 0.4, ease: 'power1.out' }, 0.25)
        tl.fromTo(incoming.querySelector('[data-logo]'), { scale: 1.08 }, { scale: 1, duration: 0.6, ease: 'power3.out' }, 0.2)
      }

      // Drag preview: the front card follows the pointer and, when pulling
      // towards NEXT, the card behind eases toward the front.
      const previewDrag = (dx) => {
        const a = activeRef.current
        gsap.set(cards[a], { x: dx * 0.9, rotation: canMove ? dx / 30 : 0 })
        if (dx < 0 && n > 1) {
          const p = Math.min(1, Math.abs(dx) / 240)
          const from = poseOf(1)
          const to = poseOf(0)
          gsap.set(cards[(a + 1) % n], {
            x: from.x + (to.x - from.x) * p,
            y: from.y + (to.y - from.y) * p,
            scale: from.scale + (to.scale - from.scale) * p,
            rotation: from.rotation + (to.rotation - from.rotation) * p,
          })
        }
      }

      const endDrag = (dx) => {
        const a = activeRef.current
        if (n > 1 && Math.abs(dx) > 90) {
          go(dx < 0 ? (a + 1) % n : (a - 1 + n) % n, dx < 0 ? 1 : -1, true)
          return
        }
        const back = { ...poseOf(0), duration: 0.55, ease: canMove ? 'back.out(1.6)' : 'power2.out' }
        gsap.to(cards[a], back)
        if (n > 1) gsap.to(cards[(a + 1) % n], { ...poseOf(1), duration: 0.4, ease: 'power2.out' })
      }

      api.current = { go, previewDrag, endDrag }

      // Entrance: one composed scene — the stage scales in, the back cards
      // arrive with a slight stagger, then the active card settles.
      let tl
      if (canMove && !entered.current) {
        const stage = stageRef.current
        gsap.set(stage, { autoAlpha: 0, scale: 0.96 })
        tl = gsap.timeline({
          defaults: { ease: 'power3.out' },
          scrollTrigger: { trigger: root, start: 'top 80%', once: true },
          onStart: () => (entered.current = true),
        })
        const back = cards.slice(1).reverse()
        tl.to(stage, { autoAlpha: 1, scale: 1, duration: 0.7 })
        if (back.length) tl.from(back, { autoAlpha: 0, x: '-=26', duration: 0.6, stagger: 0.12 }, 0.1)
        tl.from(cards[0], { y: 18, duration: 0.7 }, 0.3)
      } else {
        entered.current = true
      }

      return () => {
        tl?.kill()
        api.current = null
      }
    })
    return () => mm.revert()
  }, [n])

  // Page number rolls in whenever the active card changes.
  useEffect(() => {
    if (!didMount.current) {
      didMount.current = true
      return
    }
    gsap.fromTo(numRef.current, { yPercent: 70, autoAlpha: 0 }, { yPercent: 0, autoAlpha: 1, duration: 0.5, ease: 'power3.out' })
  }, [active])

  // Auto-advance: the deck turns to the next card every few seconds. It pauses
  // while the visitor hovers/focuses/drags it, while the tab is hidden and while
  // the section is off-screen; every change (auto or manual) restarts the timer.
  useEffect(() => {
    const root = rootRef.current
    if (!root || n < 2) return undefined
    const io = new IntersectionObserver(([entry]) => (inView.current = entry.isIntersecting), { threshold: 0.35 })
    io.observe(root)
    let timer
    const tick = () => {
      if (inView.current && !paused.current && !document.hidden && !busy.current && !drag.current) {
        api.current?.go((activeRef.current + 1) % n, 1)
      }
      timer = setTimeout(tick, 1500)
    }
    timer = setTimeout(tick, AUTOPLAY_MS)
    return () => {
      io.disconnect()
      clearTimeout(timer)
    }
  }, [active, n])

  const goNext = () => api.current?.go((activeRef.current + 1) % n, 1)
  const goPrev = () => api.current?.go((activeRef.current - 1 + n) % n, -1)

  const onPointerDown = (e) => {
    if (n < 2 || busy.current) return
    if (e.pointerType === 'mouse' && e.button !== 0) return
    if (!e.target.closest('[data-front]')) return
    drag.current = { startX: e.clientX, dx: 0, moved: false }
  }
  const onPointerMove = (e) => {
    const d = drag.current
    if (!d) return
    d.dx = e.clientX - d.startX
    if (!d.moved && Math.abs(d.dx) > 6) {
      d.moved = true
      e.currentTarget.setPointerCapture?.(e.pointerId)
    }
    if (d.moved) api.current?.previewDrag(d.dx)
  }
  const onPointerEnd = () => {
    const d = drag.current
    drag.current = null
    if (!d?.moved) return
    suppressClick.current = true
    setTimeout(() => (suppressClick.current = false), 0)
    api.current?.endDrag(d.dx)
  }
  const onClickCapture = (e) => {
    if (suppressClick.current) {
      e.preventDefault()
      e.stopPropagation()
    }
  }

  const theme = themeOf(jobs[active] ?? jobs[0])

  return (
    <div
      ref={rootRef}
      onPointerEnter={() => (paused.current = true)}
      onPointerLeave={() => (paused.current = false)}
      onFocusCapture={() => (paused.current = true)}
      onBlurCapture={() => (paused.current = false)}
    >
      <div
        ref={stageRef}
        className="relative h-[432px] sm:h-[458px] lg:h-[428px]"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerEnd}
        onPointerCancel={onPointerEnd}
        onClickCapture={onClickCapture}
        style={{ touchAction: 'pan-y' }}
      >
        {jobs.map((job, i) => (
          <DeckCard
            key={job.id}
            job={job}
            index={i}
            total={n}
            isActive={i === active}
            cardRef={(el) => {
              cardRefs.current[i] = el
            }}
          />
        ))}
      </div>

      {n > 1 && (
        <div className="mt-5 flex items-center justify-between gap-4 pr-[44px] sm:pr-[64px]" style={{ maxWidth: 620 + 64 }}>
          <button
            type="button"
            onClick={goPrev}
            className={`inline-flex items-center gap-2 text-[12px] font-black uppercase tracking-[0.16em] transition-colors hover:text-(--explorer-blue) ${CARD_FOCUS}`}
            style={{ color: INK }}
          >
            <span aria-hidden="true">←</span> Previous
          </button>
          <p className="flex items-center gap-2 text-[12px] font-black tracking-[0.18em]" style={{ color: INK }} aria-live="polite">
            <span className="h-1.5 w-1.5 rounded-full transition-colors duration-500" style={{ backgroundColor: theme.accent }} aria-hidden="true" />
            <span className="inline-block overflow-hidden leading-none">
              <span ref={numRef} className="inline-block">
                {pad(active + 1)}
              </span>
            </span>
            <span style={{ color: MUTED }}>/ {pad(n)}</span>
          </p>
          <button
            type="button"
            onClick={goNext}
            className={`inline-flex items-center gap-2 text-[12px] font-black uppercase tracking-[0.16em] transition-colors hover:text-(--explorer-blue) ${CARD_FOCUS}`}
            style={{ color: INK }}
          >
            Next <span aria-hidden="true">→</span>
          </button>
        </div>
      )}

      {isSample && (
        <p className="mt-4 text-[10.5px] font-black uppercase tracking-[0.14em]" style={{ color: MUTED }}>
          Sample preview · not live openings
        </p>
      )}
    </div>
  )
}

function DeckSkeleton() {
  return (
    <div className="relative h-[372px] w-[calc(100%-44px)] max-w-[620px] animate-pulse rounded-[28px] sm:w-[calc(100%-64px)] lg:h-[360px]" style={{ backgroundColor: '#FFF1EC' }} />
  )
}

// Magazine-style ending for signed-out visitors: the statement on the left, the
// (blue) action on the right, under a thin rule. Fades up once on scroll-in;
// no motion under prefers-reduced-motion.
function SignInCta() {
  const rootRef = useRef(null)

  useLayoutEffect(() => {
    const root = rootRef.current
    if (!root) return undefined
    const mm = gsap.matchMedia()
    mm.add('(min-width: 0px)', () => {
      const targets = ['[data-cta-statement]', '[data-cta-side]'].map((sel) => root.querySelector(sel))
      gsap.set(targets, { autoAlpha: 0, y: 14 })
      const tl = gsap.timeline({
        defaults: { ease: 'power3.out' },
        scrollTrigger: { trigger: root, start: 'top 88%', once: true },
      })
      tl.to(targets[0], { autoAlpha: 1, y: 0, duration: 0.7 }).to(targets[1], { autoAlpha: 1, y: 0, duration: 0.65 }, 0.15)
      return () => tl.kill()
    })
    return () => mm.revert()
  }, [])

  return (
    <div ref={rootRef} className="mt-14 border-t pt-12 md:mt-16 md:pt-14" style={{ borderColor: RULE }}>
      <div className="grid items-center gap-8 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] lg:gap-16">
        <p
          data-cta-statement
          className="text-[34px] font-extrabold uppercase leading-[0.98] tracking-tight sm:text-[44px] lg:text-[50px]"
          style={{ color: INK }}
        >
          The right job
          <br />
          <span style={gradientText}>should find you too.</span>
        </p>

        <div data-cta-side className="lg:justify-self-end">
          <Link
            to="/employees/signin"
            className="group inline-flex min-h-[52px] items-center justify-center gap-2 rounded-[11px] px-7 py-3 text-[14.5px] font-bold text-white shadow-[0_10px_24px_-10px_rgba(37,99,235,0.6)] transition-colors duration-200 hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--explorer-blue)"
            style={{ backgroundImage: GRADIENT }}
          >
            Sign in to see jobs matched to your profile
            <ArrowRight size={16} aria-hidden="true" className="shrink-0 motion-safe:transition-transform motion-safe:duration-200 group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </div>
  )
}

// Sits right above "Companies hiring through MZOBS" (see Home.jsx) — the
// same transparent, rule-based matching the dashboard app's Recommended tab
// uses (JobMatching.jsx). Signed-out visitors get a labelled sample preview
// (never presented as live openings); signed-in visitors see their real
// matches in the same deck. Renders nothing once we know a signed-in
// candidate genuinely has no matches yet (incomplete profile, or the fetch
// failed) — the point of this section is a real, explainable match, never a
// placeholder.
export default function RecommendedForYou() {
  const headRef = useRef(null)
  const [session, setSession] = useState(null)
  const [sessionChecked, setSessionChecked] = useState(false)
  const [jobs, setJobs] = useState(null) // null = loading
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    setSession(getEmployeeSession())
    setSessionChecked(true)
    return onEmployeeSessionChange(() => setSession(getEmployeeSession()))
  }, [])

  useEffect(() => {
    if (!session?.token) return
    let cancelled = false
    const controller = new AbortController()
    setFailed(false)
    setJobs(null)
    fetchRecommendedJobs({ sort: 'match', limit: RESULT_LIMIT }, { signal: controller.signal })
      .then((data) => {
        if (!cancelled) setJobs(data)
      })
      .catch((err) => {
        if (cancelled || err?.name === 'AbortError') return
        setFailed(true)
        setJobs([])
      })
    return () => {
      cancelled = true
      controller.abort()
    }
  }, [session?.token])

  // Heading block reveals once when the section first appears.
  useLayoutEffect(() => {
    const head = headRef.current
    if (!head) return undefined
    const mm = gsap.matchMedia()
    mm.add('(min-width: 0px)', () => {
      gsap.set(head, { autoAlpha: 0, y: 18 })
      const tween = gsap.to(head, {
        autoAlpha: 1,
        y: 0,
        duration: 0.7,
        ease: 'power3.out',
        scrollTrigger: { trigger: head, start: 'top 88%', once: true },
      })
      return () => tween.kill()
    })
    return () => mm.revert()
  }, [sessionChecked])

  // Still resolving the session on first paint — skip rendering rather than
  // flashing the signed-out preview before flipping to real matches.
  if (!sessionChecked) return null
  const signedIn = !!session?.token
  // Signed in, matches loaded, and genuinely none — nothing honest to show.
  if (signedIn && !failed && jobs && jobs.length === 0) return null

  const deckJobs = signedIn ? (jobs?.length ? jobs.map(toDeckJob) : []) : sampleJobs

  return (
    <section className="overflow-x-clip px-6 py-16 md:px-10 md:py-24" style={{ backgroundColor: PAPER }}>
      <div className="mx-auto max-w-[1240px]">
        <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-14">
          <div ref={headRef}>
            <h2 className="text-[40px] font-extrabold leading-[1.04] tracking-tight sm:text-[52px] lg:text-[56px]" style={{ color: INK }}>
              The right job <br />
              is <span style={gradientText}>closer than you think.</span>
            </h2>
            <p className="mt-5 max-w-[460px] text-[16px] leading-relaxed" style={{ color: MUTED }}>
              {signedIn
                ? 'Matched against your skills, preferred role and location — with a clear reason for every recommendation.'
                : 'Sign in to see opportunities matched to your skills, preferred role and location.'}
            </p>

            {deckJobs.length > 0 && (
              <div className="mt-8 border-t pt-5" style={{ borderColor: RULE }}>
                <p className="inline-flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.16em]" style={{ color: INK }}>
                  <span style={{ color: BLUE }}>01</span> / Matched for you
                </p>
                <p className="mt-2 text-[15px]" style={{ color: MUTED }}>
                  {deckJobs.length} {deckJobs.length === 1 ? 'opportunity' : 'opportunities'} selected from your profile.
                </p>
                {signedIn && (
                  <ExplorerTextLink href={`${EMPLOYEE_APP_URL}/app/jobs?tab=recommended`} className="mt-3 text-[13.5px]">
                    View all matches
                  </ExplorerTextLink>
                )}
              </div>
            )}
          </div>

          <div className="min-w-0">
            {failed ? (
              <p className="text-[13.5px]" style={{ color: MUTED }}>
                Couldn't load your matches right now — check back shortly.
              </p>
            ) : signedIn && jobs === null ? (
              <DeckSkeleton />
            ) : (
              <JobDeck key={signedIn ? 'live' : 'sample'} jobs={deckJobs} isSample={!signedIn} />
            )}
          </div>
        </div>

        {!signedIn && <SignInCta />}
      </div>
    </section>
  )
}
