import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { MapPin, ArrowRight, ArrowUpRight, SearchX, RotateCw } from 'lucide-react'
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

// The destinations are chosen live from real opening counts — a city only
// appears when it genuinely has openings right now (the same real-demand-only
// rule CategoryGrid applies to categories). If no city has any (empty/local
// database) all of them show, so the section is never blank.
// HOT_CITIES_DATA.cities supplies the display metadata (photo/state/landmark).
const MAX_FEATURED_CITIES = 9
const COLUMNS = 3

function CityCardSkeleton() {
  return (
    <div className="grid grid-cols-3 gap-3.5">
      {[0, 1, 2].map((i) => (
        <div key={i} className={`h-[160px] rounded-2xl bg-(--explorer-border)/60 animate-pulse ${i === 1 ? 'mt-10' : ''}`} />
      ))}
    </div>
  )
}

// One city — the monument photograph is the card.
function CityCard({ meta, stats, onOpen }) {
  const openings = stats?.openings ?? 0
  return (
    <button
      type="button"
      onClick={onOpen}
      aria-label={`Explore jobs in ${meta.city}`}
      className="group relative block h-[150px] w-full shrink-0 overflow-hidden rounded-2xl text-left shadow-[0_14px_32px_-18px_rgba(16,42,67,0.4)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-(--explorer-blue)"
    >
      <div className="absolute inset-0">
        <CityVisual city={meta.city} landmark={meta.landmark} imageUrl={meta.imageUrl} zoomOnHover />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/15 to-transparent" aria-hidden="true" />
      <div className="absolute inset-x-0 bottom-0 p-3.5">
        <p className="flex items-center gap-1 text-[10.5px] font-bold uppercase tracking-wide text-white/80">
          <MapPin size={11} className="shrink-0" aria-hidden="true" />
          {meta.state}
        </p>
        <h3 className="mt-0.5 text-[17px] font-black leading-tight tracking-tight text-white">{meta.city}</h3>
        <p className="mt-1 flex items-center gap-1 text-[12.5px] font-bold text-white/90">
          {openings > 0 ? `${openings.toLocaleString('en-IN')}+ open ${openings === 1 ? 'role' : 'roles'}` : 'Explore jobs'}
          <ArrowRight size={12} className="motion-safe:transition-transform motion-safe:duration-300 group-hover:translate-x-1" aria-hidden="true" />
        </p>
      </div>
    </button>
  )
}

// A vertical marquee column: the list is rendered twice and the track slides
// by exactly half its height, so the loop is seamless. Alternate columns run
// in opposite directions; hover/focus pauses.
function CityColumn({ items, reverse, offset, duration, onOpen }) {
  // Short lists are repeated so one copy is always taller than the viewport.
  const base = items.length >= 3 ? items : [...items, ...items, ...items].slice(0, Math.max(3, items.length))
  return (
    <div className={`mz-vmarquee h-full ${offset ? 'pt-8' : ''}`}>
      <div className={`mz-vmarquee-track ${reverse ? 'mz-vmarquee-reverse' : ''}`} style={{ animationDuration: `${duration}s` }}>
        {[0, 1].map((copy) => (
          <div key={copy} className="flex flex-col gap-4 pb-4" aria-hidden={copy === 1 ? 'true' : undefined}>
            {base.map(({ meta, stats }, i) => (
              <CityCard key={`${meta.slug}-${i}`} meta={meta} stats={stats} onOpen={() => onOpen(meta.slug)} />
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

// "Where are the opportunities right now?" — a city-first counterpart to
// CategoryGrid's "by category". Every number is real, fetched live from
// Backend's GET /api/jobs/hot-cities (see hotCities.js). Clicking a city
// opens its own page (/jobs/city/:slug, see pages/CityJobs.jsx).
export default function HotJobsByCity() {
  const navigate = useNavigate()
  // Seeded from the build-time prerender fetch (see initialHomeDataContext.js)
  // so this section never ships frozen on its loading skeleton — the effect
  // below still re-fetches live data right after mount regardless.
  const initialHomeData = useInitialHomeData()
  const [liveCities, setLiveCities] = useState(initialHomeData?.hotCities ?? null) // null = still loading
  const [loadError, setLoadError] = useState(false)
  const [retryToken, setRetryToken] = useState(0)

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

  // Joins display metadata with live stats by slug, ranked hottest-first.
  const destinations = useMemo(() => {
    if (!liveCities) return []
    const anyLive = liveCities.some((c) => c.byFilter?.all?.openings > 0)
    return liveCities
      .map((c) => {
        const meta = HOT_CITIES_DATA.cities.find((m) => m.slug === c.slug)
        const stats = c.byFilter?.all
        if (!meta || !stats || (anyLive && stats.openings <= 0)) return null
        return { meta, stats }
      })
      .filter(Boolean)
      .sort((a, b) => b.stats.openings - a.stats.openings)
      .slice(0, MAX_FEATURED_CITIES)
  }, [liveCities])

  // Round-robin into columns so each column mixes hot and quieter cities.
  const columns = useMemo(() => {
    const cols = Array.from({ length: COLUMNS }, () => [])
    destinations.forEach((d, i) => cols[i % COLUMNS].push(d))
    return cols.filter((c) => c.length > 0)
  }, [destinations])

  const openCity = (slug) => navigate(`/jobs/city/${slug}`)
  const showInitialLoading = liveCities === null && !loadError

  return (
    <section id="hot-jobs-by-city" className="bg-(--explorer-bg) py-8 md:py-10 px-6 md:px-10 overflow-hidden">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] items-center gap-6 lg:gap-12">
        <Reveal direction="up" duration={0.7} className="max-w-md">
          <h2 className="text-3xl sm:text-[32px] leading-[1.1] font-black text-(--explorer-navy) tracking-tight text-balance">{HOT_CITIES_DATA.title}</h2>
          <p className="mt-3 text-[15px] leading-relaxed text-(--explorer-muted)">{HOT_CITIES_DATA.subtitle}</p>
          <a
            href={buildJobsUrl({})}
            className="group mt-5 inline-flex items-center gap-1.5 text-[14.5px] font-black text-(--explorer-blue) hover:text-(--explorer-blue-hover) transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-(--explorer-blue) rounded-lg"
          >
            Explore all locations
            <ArrowUpRight size={16} className="motion-safe:transition-transform motion-safe:duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden="true" />
          </a>
        </Reveal>

        <div>
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
            <CityCardSkeleton />
          ) : destinations.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-2.5 rounded-xl border border-dashed border-(--explorer-border) py-16 px-6 text-center">
              <p className="text-[15px] font-bold text-(--explorer-navy)">No live city openings right now</p>
              <p className="text-[13.5px] text-(--explorer-muted) max-w-sm">Check back soon as new roles come in.</p>
            </div>
          ) : (
            <Reveal direction="up" duration={0.6} delay={0.1}>
              <div className="grid h-[340px] sm:h-[380px] gap-3 sm:gap-4" style={{ gridTemplateColumns: `repeat(${columns.length}, minmax(0, 1fr))` }}>
                {columns.map((items, i) => (
                  <CityColumn
                    key={i}
                    items={items}
                    reverse={i % 2 === 1}
                    offset={i % 2 === 1}
                    duration={Math.max(24, items.length * 9)}
                    onOpen={openCity}
                  />
                ))}
              </div>
            </Reveal>
          )}
        </div>
      </div>
    </section>
  )
}
