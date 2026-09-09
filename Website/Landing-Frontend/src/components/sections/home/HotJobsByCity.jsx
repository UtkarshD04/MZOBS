import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { MapPin, Flame, ShieldCheck, TrendingUp, ChevronLeft, ChevronRight, SearchX, RotateCw } from 'lucide-react'
import Reveal from '../../ui/Reveal'
import { StaggerGroup, StaggerItem } from '../../ui/Stagger'
import ExplorerButton, { ExplorerTextLink } from '../../ui/ExplorerButton'
import CountUp from '../../ui/CountUp'
import { HOT_CITIES_DATA } from '../../../lib/content'
import { fetchHotCities } from '../../../lib/publicJobs'
import { formatSalaryRange } from '../../../lib/formatCurrency'

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

function FilterPill({ active, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`shrink-0 h-9 px-4 rounded-full text-[13px] font-bold whitespace-nowrap transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--explorer-teal) ${
        active
          ? 'bg-(--explorer-teal) text-white shadow-[0_1px_2px_rgba(11,122,109,0.16),0_10px_20px_-8px_rgba(11,122,109,0.55)]'
          : 'bg-white/60 backdrop-blur-sm border border-(--explorer-border) text-(--explorer-navy) shadow-[0_1px_2px_rgba(16,42,67,0.04)] hover:border-(--explorer-teal-border) hover:bg-(--explorer-teal-surface)/70 hover:text-(--explorer-teal)'
      }`}
    >
      {children}
    </button>
  )
}

function CarouselArrow({ dir, onClick, disabled }) {
  const Icon = dir === -1 ? ChevronLeft : ChevronRight
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={dir === -1 ? 'Previous cities' : 'Next cities'}
      className="explorer-icon-btn flex items-center justify-center w-10 h-10 rounded-full border border-white/50 bg-white/70 backdrop-blur-md text-(--explorer-navy) shadow-[0_4px_14px_-6px_rgba(22,50,79,0.25)] transition-[background-color,border-color,color,transform] duration-150 motion-safe:hover:-translate-y-px hover:border-(--explorer-teal-border) hover:bg-white hover:text-(--explorer-teal) disabled:opacity-30 disabled:pointer-events-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--explorer-teal)"
    >
      <Icon size={17} />
    </button>
  )
}

// A dot-progress indicator (not literal "City • City • City" text labels —
// that would just repeat what the cards already say) showing which card is
// currently centered; click to jump. Active dot uses the gold accent so it
// reads as a deliberate highlight, not another teal element competing with
// the CTAs.
function PaginationDots({ count, activeIndex, onSelect }) {
  if (count <= 1) return null
  return (
    <div className="hidden sm:flex items-center justify-center gap-2 mt-6">
      {Array.from({ length: count }).map((_, i) => (
        <button
          key={i}
          type="button"
          onClick={() => onSelect(i)}
          aria-label={`Go to city ${i + 1}`}
          aria-current={i === activeIndex}
          className={`h-1.5 rounded-full transition-all duration-300 ${i === activeIndex ? 'w-6 bg-(--explorer-gold)' : 'w-1.5 bg-(--explorer-border) hover:bg-(--explorer-teal-border)'}`}
        />
      ))}
    </div>
  )
}

function CityCardSkeleton() {
  return (
    <div className="w-[272px] sm:w-[300px] shrink-0 rounded-2xl bg-white border border-(--explorer-border) overflow-hidden animate-pulse">
      <div className="h-[168px] bg-(--explorer-bg)" />
      <div className="p-5 flex flex-col gap-3">
        <div className="h-6 w-24 rounded bg-(--explorer-bg)" />
        <div className="h-4 w-36 rounded bg-(--explorer-bg)" />
        <div className="h-4 w-full rounded bg-(--explorer-bg)" />
      </div>
    </div>
  )
}

function CityCard({ city, stats, isTopCity, onOpen }) {
  const categories = stats.topCategories ?? []
  const salary = formatSalaryRange(stats.salaryMin, stats.salaryMax)

  return (
    <div className="group relative flex flex-col w-[272px] sm:w-[300px] shrink-0 rounded-2xl bg-white border border-(--explorer-border) overflow-hidden transition-[transform,box-shadow,border-color] duration-300 motion-safe:hover:-translate-y-1.5 hover:shadow-[0_20px_44px_-22px_rgba(22,50,79,0.4)] hover:border-(--explorer-teal-border)">
      <button
        type="button"
        onClick={onOpen}
        className="relative h-[168px] overflow-hidden text-left focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-(--explorer-teal)"
        aria-label={`Explore jobs in ${city.city}`}
      >
        <CityVisual city={city.city} landmark={city.landmark} imageUrl={city.imageUrl} />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

        {(isTopCity || stats.newThisWeek > 0) && (
          <span className="absolute top-3 right-3 inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/15 backdrop-blur-md border border-white/25 text-white text-[10.5px] font-black motion-safe:transition-colors motion-safe:duration-300 group-hover:bg-white/25">
            {isTopCity ? <TrendingUp size={11} aria-hidden="true" /> : <Flame size={11} aria-hidden="true" />}
            {isTopCity ? 'Trending' : 'Hiring Fast'}
          </span>
        )}

        <div className="absolute bottom-3 left-4 right-4 flex items-center gap-1.5 text-white">
          <MapPin size={14} className="shrink-0 opacity-85" aria-hidden="true" />
          <h3 className="text-[21px] font-black tracking-tight leading-none truncate">{city.city}</h3>
        </div>
      </button>

      <div className="flex flex-col flex-1 p-5">
        {isTopCity && (
          <p className="mb-2 inline-flex items-center gap-1 text-[10.5px] font-black uppercase tracking-wide text-(--explorer-gold-hover)">
            <Flame size={11} aria-hidden="true" /> #1 Trending Hiring City
          </p>
        )}

        <div className="flex items-baseline gap-1.5">
          <CountUp value={stats.openings} suffix="+" className="text-[26px] font-black text-(--explorer-navy) tracking-tight" />
          <span className="text-[12.5px] font-semibold text-(--explorer-muted)">openings</span>
        </div>

        {categories.length > 0 && (
          <div className="mt-2.5 flex flex-wrap gap-1.5">
            {categories.map((c) => (
              <span key={c} className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-(--explorer-bg) text-(--explorer-muted)">
                {c}
              </span>
            ))}
          </div>
        )}

        <div className="mt-3.5 flex items-center justify-between gap-2 text-[12.5px]">
          <span className="font-bold text-(--explorer-navy)">{salary || 'Varies by role'}</span>
          {stats.newThisWeek > 0 && (
            <span className="inline-flex items-center gap-1 font-semibold text-(--explorer-teal) shrink-0">
              <TrendingUp size={12} aria-hidden="true" />
              {stats.newThisWeek} new this week
            </span>
          )}
        </div>

        <div className="mt-4 pt-3.5 border-t border-(--explorer-border) flex items-center justify-between gap-2">
          <span
            className="inline-flex items-center gap-1 text-[10.5px] font-semibold text-(--explorer-muted)"
            title="Employer identity and job information verified by MZOBS"
          >
            <ShieldCheck size={11} className="text-(--explorer-teal)" aria-hidden="true" />
            {stats.verifiedEmployers > 0 ? `${stats.verifiedEmployers} verified employer${stats.verifiedEmployers === 1 ? '' : 's'}` : 'Verified employers'}
          </span>
          <ExplorerTextLink onClick={onOpen} className="text-[12.5px] shrink-0">
            Explore jobs
          </ExplorerTextLink>
        </div>
      </div>
    </div>
  )
}

// "Where are the opportunities right now?" — a city-first counterpart to
// CategoryGrid's "by category" (see Home.jsx, rendered directly after it).
// Every number here is real, fetched live from Backend's
// GET /api/jobs/hot-cities (see hotCities.js) — nothing is hardcoded/
// illustrative. Clicking a city opens its own dedicated page
// (/jobs/city/:slug, see pages/CityJobs.jsx) with a real job list.
export default function HotJobsByCity() {
  const navigate = useNavigate()
  const [activeFilter, setActiveFilter] = useState('all')
  const [liveCities, setLiveCities] = useState(null) // null = still loading
  const [loadError, setLoadError] = useState(false)
  const [retryToken, setRetryToken] = useState(0)

  const trackRef = useRef(null)
  const [canPrev, setCanPrev] = useState(false)
  const [canNext, setCanNext] = useState(true)
  const [activeIndex, setActiveIndex] = useState(0)

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
  // drops cities with zero real openings for the active filter (a "2,840+"
  // card is premium; a "0+" card just looks broken), and ranks the rest by
  // real opening count — "hottest first" reads as discovery, not a
  // leaderboard, since only the single leading card gets any extra emphasis.
  const cities = useMemo(() => {
    if (!liveCities) return []
    const bySlug = new Map(liveCities.map((c) => [c.slug, c]))
    return HOT_CITIES_DATA.cities
      .map((meta) => {
        const stats = bySlug.get(meta.slug)?.byFilter?.[activeFilter]
        return stats ? { ...meta, stats } : null
      })
      .filter((c) => c && c.stats.openings > 0)
      .sort((a, b) => b.stats.openings - a.stats.openings)
  }, [liveCities, activeFilter])

  const topCityName = cities[0]?.city

  function updateEdges() {
    const el = trackRef.current
    if (!el || cities.length === 0) return
    setCanPrev(el.scrollLeft > 4)
    setCanNext(el.scrollLeft < el.scrollWidth - el.clientWidth - 4)
    const perCard = el.scrollWidth / cities.length
    setActiveIndex(Math.min(cities.length - 1, Math.round(el.scrollLeft / perCard)))
  }

  useEffect(() => {
    const el = trackRef.current
    if (!el) return
    updateEdges()
    el.addEventListener('scroll', updateEdges, { passive: true })
    window.addEventListener('resize', updateEdges)
    return () => {
      el.removeEventListener('scroll', updateEdges)
      window.removeEventListener('resize', updateEdges)
    }
    // Re-measure whenever the filter changes the track's contents/width.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cities.length])

  function scroll(dir) {
    const el = trackRef.current
    if (!el) return
    el.scrollBy({ left: dir * el.clientWidth * 0.86, behavior: 'smooth' })
  }

  function scrollToIndex(i) {
    const el = trackRef.current
    if (!el || cities.length === 0) return
    el.scrollTo({ left: (el.scrollWidth / cities.length) * i, behavior: 'smooth' })
  }

  // Gentle, continuous auto-scroll ("marquee") — paused on hover/touch (so
  // reading/clicking a card never fights the motion) and skipped entirely
  // under prefers-reduced-motion. Loops back to the start once it reaches
  // the end rather than bouncing, and only runs at all when the row
  // actually overflows (nothing to scroll otherwise).
  const [autoScrollPaused, setAutoScrollPaused] = useState(false)
  useEffect(() => {
    const el = trackRef.current
    if (!el || cities.length <= 1) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let raf
    function step() {
      if (!autoScrollPaused && el.scrollWidth > el.clientWidth + 10) {
        const atEnd = el.scrollLeft >= el.scrollWidth - el.clientWidth - 2
        if (atEnd) el.scrollTo({ left: 0, behavior: 'smooth' })
        else el.scrollLeft += 0.6
      }
      raf = requestAnimationFrame(step)
    }
    raf = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf)
  }, [cities.length, autoScrollPaused])

  // No router state needed — CityJobs resolves the city's display metadata
  // from HOT_CITIES_DATA by slug alone (works identically on a direct link
  // or refresh) and fetches its own live stats/job list.
  function openCity(city) {
    navigate(`/jobs/city/${city.slug}`)
  }

  return (
    <section id="hot-jobs-by-city" className="bg-(--explorer-bg) py-16 md:py-20 px-6 md:px-10 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <Reveal direction="up" duration={0.7} className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-2.5">
          <div className="max-w-xl">
            <span className="inline-flex items-center gap-1.5 text-[11px] font-black uppercase tracking-wide text-(--explorer-teal) mb-2">
              <span className="relative flex w-1.5 h-1.5" aria-hidden="true">
                <span className="motion-safe:absolute motion-safe:inline-flex w-full h-full rounded-full bg-(--explorer-teal) opacity-75 motion-safe:animate-ping" />
                <span className="relative inline-flex w-1.5 h-1.5 rounded-full bg-(--explorer-teal)" />
              </span>
              {HOT_CITIES_DATA.eyebrow}
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-(--explorer-navy) tracking-tight">{HOT_CITIES_DATA.title}</h2>
            <p className="mt-2 text-[15px] text-(--explorer-muted)">{HOT_CITIES_DATA.subtitle}</p>
          </div>
          {cities.length > 0 && (
            <div className="hidden sm:flex items-center gap-2 shrink-0 pb-1">
              <CarouselArrow dir={-1} onClick={() => scroll(-1)} disabled={!canPrev} />
              <CarouselArrow dir={1} onClick={() => scroll(1)} disabled={!canNext} />
            </div>
          )}
        </Reveal>

        <p className="text-[12.5px] text-(--explorer-muted) mb-6 max-w-xl">{HOT_CITIES_DATA.brandLine}</p>

        <div className="careers-scroll-x flex items-center gap-2 overflow-x-auto pb-1 mb-7 -mx-1 px-1">
          {HOT_CITIES_DATA.filters.map((f) => (
            <FilterPill key={f.key} active={activeFilter === f.key} onClick={() => setActiveFilter(f.key)}>
              {f.label}
            </FilterPill>
          ))}
        </div>

        {loadError ? (
          <div className="flex flex-col items-center justify-center gap-2.5 rounded-xl border border-dashed border-(--explorer-border) py-16 px-6 text-center">
            <SearchX size={26} className="text-(--explorer-muted)" aria-hidden="true" />
            <p className="text-[15px] font-bold text-(--explorer-navy)">Couldn't load city hiring data</p>
            <p className="text-[13.5px] text-(--explorer-muted) max-w-sm">There was a problem reaching the jobs feed. Check your connection and try again.</p>
            <ExplorerButton onClick={() => setRetryToken((n) => n + 1)} className="mt-1.5">
              <RotateCw size={14} aria-hidden="true" /> Retry
            </ExplorerButton>
          </div>
        ) : liveCities === null ? (
          <div className="flex gap-5 overflow-hidden">
            {Array.from({ length: 4 }).map((_, i) => (
              <CityCardSkeleton key={i} />
            ))}
          </div>
        ) : cities.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-2.5 rounded-xl border border-dashed border-(--explorer-border) py-16 px-6 text-center">
            <SearchX size={26} className="text-(--explorer-muted)" aria-hidden="true" />
            <p className="text-[15px] font-bold text-(--explorer-navy)">No live openings in this category yet</p>
            <p className="text-[13.5px] text-(--explorer-muted) max-w-sm">Try a different category, or check back soon as employers post new requirements.</p>
          </div>
        ) : (
          <>
            <div
              ref={trackRef}
              className="careers-scroll-x overflow-x-auto snap-x snap-mandatory -mx-6 md:-mx-10 px-6 md:px-10 pb-2"
              onMouseEnter={() => setAutoScrollPaused(true)}
              onMouseLeave={() => setAutoScrollPaused(false)}
              onTouchStart={() => setAutoScrollPaused(true)}
              onTouchEnd={() => setAutoScrollPaused(false)}
            >
              <StaggerGroup className="flex gap-5 w-max" amount="some">
                {cities.map((city) => (
                  <StaggerItem key={city.slug} className="snap-start">
                    <CityCard city={city} stats={city.stats} isTopCity={city.city === topCityName} onOpen={() => openCity(city)} />
                  </StaggerItem>
                ))}
              </StaggerGroup>
            </div>
            <PaginationDots count={cities.length} activeIndex={activeIndex} onSelect={scrollToIndex} />
          </>
        )}

        <p className="sm:hidden mt-4 text-center text-[12px] font-semibold text-(--explorer-muted)">← Swipe to explore more cities →</p>
      </div>
    </section>
  )
}
