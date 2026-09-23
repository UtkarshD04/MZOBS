import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { MapPin, ArrowRight, ArrowUpRight, ChevronLeft, ChevronRight, SearchX, RotateCw } from 'lucide-react'
import Reveal from '../../ui/Reveal'
import ExplorerButton from '../../ui/ExplorerButton'
import { HOT_CITIES_DATA } from '../../../lib/content'
import { fetchHotCities } from '../../../lib/publicJobs'
import { buildJobsUrl } from '../../../lib/jobsUrl'
import { useInitialHomeData } from '../../../lib/initialHomeDataContext'

function hashOf(str) {
  return [...str].reduce((sum, ch) => sum + ch.charCodeAt(0), 0)
}

// Premium, non-photographic placeholder for a city with no real photo yet
// (see the empty `imageUrl` on HOT_CITIES_DATA) — a gradient-mesh + one
// oversized translucent monogram + fine grain, the same idiom premium
// product/fintech card art uses. Deliberately NOT another abstract-skyline
// attempt — this doesn't try (and fail) to depict a literal cityscape.
function CityVisualPlaceholder({ city }) {
  const seed = hashOf(city)
  const angle = 120 + (seed % 40) // 120–160deg — narrow range keeps every card cohesive, not random
  const filterId = `hjc-grain-${city.replace(/\s+/g, '')}`
  return (
    <div className="absolute inset-0" style={{ background: `linear-gradient(${angle}deg, var(--explorer-navy-deep), var(--explorer-teal) 130%)` }}>
      <svg className="absolute inset-0 w-full h-full opacity-[0.05]" aria-hidden="true">
        <filter id={filterId}>
          <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" stitchTiles="stitch" />
        </filter>
        <rect width="100%" height="100%" filter={`url(#${filterId})`} />
      </svg>
      <span className="absolute -bottom-4 -right-2 font-serif text-[100px] leading-none font-bold text-white/[0.14] select-none" aria-hidden="true">
        {city[0]}
      </span>
    </div>
  )
}

// Real, properly licensed landmark photography (see HOT_CITIES_DATA in
// content.js — cinematic crop, dark gradient handled by the caller,
// hover-zoom here). Falls back to the gradient placeholder above both when
// no photo is configured for a city yet and when a configured photo fails
// to load (a dead link never shows a broken-image icon). Exported — also
// used at hero scale by pages/CityJobs.jsx for the same city, so the photo
// (and its fallback behavior) carries through the card→detail transition
// instead of that page falling back to a plain gradient.
export function CityVisual({ city, landmark, imageUrl, zoomOnHover = true, eager = false }) {
  const [failed, setFailed] = useState(false)
  const showPhoto = imageUrl && !failed

  return (
    <div
      className={`absolute inset-0 motion-safe:transition-transform motion-safe:duration-500 ${zoomOnHover ? 'motion-safe:group-hover:scale-[1.04]' : ''}`}
    >
      {showPhoto ? (
        <img
          src={imageUrl}
          alt={landmark ? `${landmark}, ${city}` : city}
          loading={eager ? 'eager' : 'lazy'}
          fetchPriority={eager ? 'high' : undefined}
          decoding="async"
          onError={() => setFailed(true)}
          className="w-full h-full object-cover"
        />
      ) : (
        <CityVisualPlaceholder city={city} />
      )}
    </div>
  )
}

// The destination row is chosen live from real opening counts — not a
// fixed curated list of "showcase" metros — so a city only ever appears
// here when it genuinely has openings right now (the same real-demand-only
// rule CategoryGrid applies to categories). HOT_CITIES_DATA.cities still
// supplies the display metadata (photo/state/landmark) for whichever slugs
// the live data says are hiring.
const MAX_FEATURED_CITIES = 7

// Desktop: the active destination is visibly larger than its neighbors;
// mobile keeps every card the same (large) size and relies on scroll-snap +
// an intentionally-partial edge card for the "swipeable" cue instead —
// see the spec's "1 large active city + part of the next" mobile note.
const SIZE = {
  desktop: { active: { w: 460, h: 480 }, inactive: { w: 280, h: 420 } },
  mobile: { active: { w: 300, h: 420 }, inactive: { w: 300, h: 420 } },
}

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false)
  useEffect(() => {
    const mql = window.matchMedia('(max-width: 639px)')
    setIsMobile(mql.matches)
    const onChange = (e) => setIsMobile(e.matches)
    mql.addEventListener('change', onChange)
    return () => mql.removeEventListener('change', onChange)
  }, [])
  return isMobile
}

function ArrowButton({ dir, onClick, disabled }) {
  const Icon = dir === -1 ? ChevronLeft : ChevronRight
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={dir === -1 ? 'Previous city' : 'Next city'}
      className="explorer-icon-btn flex items-center justify-center w-10 h-10 rounded-full border border-white/50 bg-white/70 backdrop-blur-md text-(--explorer-navy) shadow-[0_4px_14px_-6px_rgba(22,50,79,0.25)] transition-[background-color,border-color,color,transform] duration-150 motion-safe:hover:-translate-y-px hover:border-(--explorer-blue-border) hover:bg-white hover:text-(--explorer-blue) disabled:opacity-30 disabled:pointer-events-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--explorer-blue)"
    >
      <Icon size={17} />
    </button>
  )
}

function CityDestinationSkeleton() {
  return (
    <div className="flex gap-5">
      <div className="w-[280px] sm:w-[460px] h-[420px] sm:h-[480px] shrink-0 rounded-[28px] bg-(--explorer-border)/60 animate-pulse" />
      <div className="hidden sm:block w-[280px] h-[420px] shrink-0 rounded-[28px] bg-(--explorer-border)/40 animate-pulse" />
      <div className="hidden md:block w-[280px] h-[420px] shrink-0 rounded-[28px] bg-(--explorer-border)/30 animate-pulse" />
    </div>
  )
}

// One destination — the monument photograph IS the card (full-bleed, no
// white chrome around it), not an image dropped inside a card. Active vs
// neighbor is purely a size + contrast + information-density difference on
// the same visual object, driven by framer-motion spring transitions (see
// SIZE above) so moving between cities never snaps abruptly.
function CityDestination({ meta, stats, categories, isActive, isMobile, onSelect, onOpen, registerRef }) {
  const [hovered, setHovered] = useState(false)
  const reduceMotion = useReducedMotion()
  const target = isMobile ? SIZE.mobile.active : isActive ? SIZE.desktop.active : SIZE.desktop.inactive
  const showCategories = isActive || hovered
  const openings = stats?.openings ?? 0

  return (
    <motion.button
      ref={registerRef}
      type="button"
      onClick={() => (isActive ? onOpen() : onSelect())}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setHovered(true)}
      onBlur={() => setHovered(false)}
      aria-label={`${isActive ? 'Explore' : 'Preview'} jobs in ${meta.city}`}
      className="group relative shrink-0 snap-center text-left overflow-hidden rounded-[28px] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-(--explorer-blue)"
      animate={{ width: target.w, height: target.h }}
      transition={reduceMotion ? { duration: 0 } : { type: 'spring', stiffness: 260, damping: 28 }}
      style={{ boxShadow: isActive ? '0 30px 60px -24px rgba(16,42,67,0.45)' : '0 14px 32px -18px rgba(16,42,67,0.3)' }}
      whileHover={reduceMotion ? undefined : { y: -5 }}
    >
      <motion.div
        className="absolute inset-0"
        animate={{ scale: hovered ? 1.04 : 1 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
      >
        <CityVisual city={meta.city} landmark={meta.landmark} imageUrl={meta.imageUrl} zoomOnHover={false} eager={isActive} />
      </motion.div>

      {/* Contrast: active reads crisp/saturated, neighbors recede slightly —
          "the monument is the card" only works if the active one still pops. */}
      <div
        className="absolute inset-0 motion-safe:transition-opacity motion-safe:duration-300"
        style={{ backgroundColor: isActive ? 'transparent' : 'rgba(10,16,28,0.28)' }}
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent motion-safe:transition-opacity motion-safe:duration-300"
        style={{ opacity: hovered ? 1 : 0.92 }}
        aria-hidden="true"
      />

      {/* Bottom information overlay */}
      <motion.div
        className="absolute inset-x-0 bottom-0 p-5 sm:p-6"
        animate={{ y: hovered ? -12 : 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
      >
        <p className="flex items-center gap-1.5 text-white/80 text-[11.5px] font-bold uppercase tracking-wide">
          <MapPin size={12} className="shrink-0" aria-hidden="true" />
          {meta.state}
        </p>
        <h3 className={`mt-1 font-black text-white tracking-tight leading-none ${isActive ? 'text-[30px] sm:text-[36px]' : 'text-[22px]'}`}>
          {meta.city}
        </h3>

        <motion.p
          className="mt-2 font-bold text-white/90"
          animate={{ fontSize: hovered || isActive ? 15 : 13 }}
          transition={{ duration: 0.35 }}
        >
          {openings.toLocaleString('en-IN')}+ open {openings === 1 ? 'role' : 'roles'}
        </motion.p>

        <AnimatePresence>
          {showCategories && categories.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 6 }}
              transition={{ duration: 0.25 }}
              className="mt-2.5 flex flex-col gap-1"
            >
              {categories.map(([label, count]) => (
                <div key={label} className="flex items-center justify-between gap-3 text-[11.5px] text-white/75">
                  <span className="font-semibold">{label}</span>
                  <span className="font-black text-white">{count}</span>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        <span
          className={`mt-3 inline-flex items-center gap-1 text-[12.5px] font-black text-white motion-safe:transition-opacity motion-safe:duration-300 ${
            isActive ? 'opacity-100' : hovered ? 'opacity-100' : 'opacity-70'
          }`}
        >
          {isActive ? 'Explore city' : 'Preview'}
          <ArrowRight size={13} className="motion-safe:transition-transform motion-safe:duration-300 group-hover:translate-x-1" aria-hidden="true" />
        </span>
      </motion.div>
    </motion.button>
  )
}

// "Where are the opportunities right now?" — a city-first counterpart to
// CategoryGrid's "by category" (see Home.jsx, rendered directly after it).
// Every number is real, fetched live from Backend's GET /api/jobs/hot-cities
// (see hotCities.js) — the monument photographs are the section's whole
// visual language; there is no separate card chrome around them. Clicking
// the active destination opens its own dedicated page (/jobs/city/:slug,
// see pages/CityJobs.jsx) with a real job list.
export default function HotJobsByCity() {
  const navigate = useNavigate()
  const isMobile = useIsMobile()
  // Seeded from the build-time prerender fetch (see initialHomeDataContext.js)
  // so this section never ships frozen on its loading skeleton — the effect
  // below still re-fetches live data right after mount regardless.
  const initialHomeData = useInitialHomeData()
  const [activeSlug, setActiveSlug] = useState(null)
  const [liveCities, setLiveCities] = useState(initialHomeData?.hotCities ?? null) // null = still loading
  const [loadError, setLoadError] = useState(false)
  const [retryToken, setRetryToken] = useState(0)

  const trackRef = useRef(null)
  const cardRefs = useRef({})

  useEffect(() => {
    let cancelled = false
    const controller = new AbortController()
    setLoadError(false)
    fetchHotCities({ signal: controller.signal })
      .then((data) => {
        if (!cancelled) setLiveCities(data.cities)
      })
      .catch((err) => {
        if (!cancelled && err?.name !== 'AbortError') setLoadError(true)
      })
    return () => {
      cancelled = true
      controller.abort()
    }
  }, [retryToken])

  // Joins display metadata (name/state/slug/photo) with live stats by slug,
  // drops any city with zero real openings right now (a "0+ open roles"
  // card next to gorgeous monument photography reads as broken, not
  // premium), and ranks the rest hottest-first — real per-category counts
  // come straight off the same byFilter buckets HOT_CITIES_DATA.filters
  // already defines (tech/sales/finance/marketing/ops), never invented.
  const destinations = useMemo(() => {
    if (!liveCities) return []
    return liveCities
      .map((c) => {
        const meta = HOT_CITIES_DATA.cities.find((m) => m.slug === c.slug)
        const stats = c.byFilter?.all
        if (!meta || !stats || stats.openings <= 0) return null
        const categories = HOT_CITIES_DATA.filters
          .filter((f) => f.key !== 'all')
          .map((f) => [f.label, c.byFilter?.[f.key]?.openings ?? 0])
          .filter(([, count]) => count > 0)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 3)
        return { meta, stats, categories }
      })
      .filter(Boolean)
      .sort((a, b) => b.stats.openings - a.stats.openings)
      .slice(0, MAX_FEATURED_CITIES)
  }, [liveCities])

  // Keep the active card pointed at a real destination as the live list
  // loads in (or changes) — a stale/empty activeSlug would otherwise leave
  // every card rendering at its smaller "inactive" size.
  useEffect(() => {
    if (destinations.length > 0 && !destinations.some((d) => d.meta.slug === activeSlug)) {
      setActiveSlug(destinations[0].meta.slug)
    }
  }, [destinations, activeSlug])

  const activeIndex = Math.max(0, destinations.findIndex((d) => d.meta.slug === activeSlug))

  function selectCity(slug) {
    setActiveSlug(slug)
    cardRefs.current[slug]?.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' })
    pauseAutoScrollThenResume()
  }

  function openCity(slug) {
    navigate(`/jobs/city/${slug}`)
  }

  function step(dir) {
    const next = destinations[activeIndex + dir]
    if (next) selectCity(next.meta.slug)
  }

  // Gentle, continuous auto-scroll ("marquee") — paused on hover/touch (so
  // reading/clicking a destination never fights the motion), briefly paused
  // after a click-driven selectCity too (its own smooth scrollIntoView
  // would otherwise fight the rAF increment below), and skipped entirely
  // under prefers-reduced-motion. Loops back to the start once it reaches
  // the end rather than bouncing, and only runs at all when the row
  // actually overflows (nothing to scroll otherwise).
  const [autoScrollPaused, setAutoScrollPaused] = useState(false)
  const resumeTimerRef = useRef(null)

  function pauseAutoScrollThenResume(delay = 1400) {
    setAutoScrollPaused(true)
    clearTimeout(resumeTimerRef.current)
    resumeTimerRef.current = setTimeout(() => setAutoScrollPaused(false), delay)
  }

  useEffect(() => () => clearTimeout(resumeTimerRef.current), [])

  useEffect(() => {
    const el = trackRef.current
    if (!el || destinations.length <= 1) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let raf
    function tick() {
      if (!autoScrollPaused && el.scrollWidth > el.clientWidth + 10) {
        const atEnd = el.scrollLeft >= el.scrollWidth - el.clientWidth - 2
        if (atEnd) el.scrollTo({ left: 0, behavior: 'smooth' })
        else el.scrollLeft += 0.5
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [destinations.length, autoScrollPaused])

  const showInitialLoading = liveCities === null && !loadError

  return (
    <section id="hot-jobs-by-city" className="bg-(--explorer-bg) py-16 md:py-20 px-6 md:px-10 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <Reveal direction="up" duration={0.7} className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
          <div className="max-w-xl">
            <h2 className="text-2xl sm:text-[34px] font-black text-(--explorer-navy) tracking-tight text-balance">{HOT_CITIES_DATA.title}</h2>
            <p className="mt-2 text-[15px] text-(--explorer-muted)">{HOT_CITIES_DATA.subtitle}</p>
          </div>
          {destinations.length > 0 && (
            <div className="hidden sm:flex items-center gap-2 shrink-0 pb-1">
              <ArrowButton dir={-1} onClick={() => step(-1)} disabled={activeIndex <= 0} />
              <ArrowButton dir={1} onClick={() => step(1)} disabled={activeIndex >= destinations.length - 1} />
            </div>
          )}
        </Reveal>

        {loadError ? (
          <div className="flex flex-col items-center justify-center gap-2.5 rounded-xl border border-dashed border-(--explorer-border) py-16 px-6 text-center">
            <SearchX size={26} className="text-(--explorer-muted)" aria-hidden="true" />
            <p className="text-[15px] font-bold text-(--explorer-navy)">Couldn't load city hiring data</p>
            <p className="text-[13.5px] text-(--explorer-muted) max-w-sm">There was a problem reaching the jobs feed. Check your connection and try again.</p>
            <ExplorerButton onClick={() => setRetryToken((n) => n + 1)} className="mt-1.5">
              <RotateCw size={14} aria-hidden="true" /> Retry
            </ExplorerButton>
          </div>
        ) : showInitialLoading ? (
          <CityDestinationSkeleton />
        ) : destinations.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-2.5 rounded-xl border border-dashed border-(--explorer-border) py-16 px-6 text-center">
            <p className="text-[15px] font-bold text-(--explorer-navy)">No live city openings right now</p>
            <p className="text-[13.5px] text-(--explorer-muted) max-w-sm">Check back soon as new roles come in.</p>
          </div>
        ) : (
          <Reveal direction="up" duration={0.6} delay={0.1}>
            <div
              ref={trackRef}
              className="careers-scroll-x flex items-center gap-5 overflow-x-auto snap-x snap-mandatory -mx-6 md:-mx-10 px-6 md:px-10 pb-2"
              onMouseEnter={() => setAutoScrollPaused(true)}
              onMouseLeave={() => setAutoScrollPaused(false)}
              onTouchStart={() => setAutoScrollPaused(true)}
              onTouchEnd={() => setAutoScrollPaused(false)}
            >
              {destinations.map(({ meta, stats, categories }) => (
                <CityDestination
                  key={meta.slug}
                  meta={meta}
                  stats={stats}
                  categories={categories}
                  isActive={meta.slug === activeSlug}
                  isMobile={isMobile}
                  registerRef={(el) => {
                    cardRefs.current[meta.slug] = el
                  }}
                  onSelect={() => selectCity(meta.slug)}
                  onOpen={() => openCity(meta.slug)}
                />
              ))}
            </div>
          </Reveal>
        )}

        {/* City navigation — an editorial text list, not pills */}
        {destinations.length > 0 && (
          <Reveal direction="up" duration={0.5} delay={0.2} className="mt-7 careers-scroll-x overflow-x-auto -mx-1 px-1">
            <div className="flex items-center gap-5 sm:gap-6 min-w-max">
              {destinations.map(({ meta }) => (
                <button
                  key={meta.slug}
                  type="button"
                  onClick={() => selectCity(meta.slug)}
                  aria-pressed={meta.slug === activeSlug}
                  className={`relative shrink-0 pb-2 text-[13px] font-bold uppercase tracking-wide whitespace-nowrap motion-safe:transition-colors motion-safe:duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--explorer-blue) ${
                    meta.slug === activeSlug ? 'text-(--explorer-navy)' : 'text-(--explorer-muted) hover:text-(--explorer-navy)'
                  }`}
                >
                  {meta.city}
                  {meta.slug === activeSlug && (
                    <motion.span
                      layoutId="city-nav-underline"
                      className="absolute left-0 right-0 -bottom-px h-[2px] bg-(--explorer-teal) rounded-full"
                      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    />
                  )}
                </button>
              ))}
            </div>
          </Reveal>
        )}

        {/* Transition toward the next section */}
        <Reveal direction="up" duration={0.5} delay={0.25} className="mt-12 flex flex-col items-center text-center">
          <p className="text-[13px] font-bold text-(--explorer-navy)/70 tracking-wide">Don't see your city?</p>
          <a
            href={buildJobsUrl({})}
            className="group mt-1.5 inline-flex items-center gap-1.5 text-[14.5px] font-black text-(--explorer-blue) hover:text-(--explorer-blue-hover) transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-(--explorer-blue) rounded-lg"
          >
            Explore all locations
            <ArrowUpRight size={16} className="motion-safe:transition-transform motion-safe:duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden="true" />
          </a>
        </Reveal>
      </div>
    </section>
  )
}
