import { useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, MapPin } from 'lucide-react'
import { Container, Reveal, SectionHead } from '../primitives'
import { useHotCities } from '../../../lib/useHomeData'

// The ten cities this section spotlights, in display order. Stats come from
// Backend's /api/jobs/hot-cities (real per-city counts and top departments).
const CITY_SLUGS = ['bengaluru', 'delhi-ncr', 'mumbai', 'hyderabad', 'pune', 'chennai', 'kolkata', 'lucknow', 'noida', 'gurugram']

// Location terms searched (OR) when a city is picked — the same spellings
// Backend's hot-cities matcher counts, so the list agrees with the number.
const SEARCH_TERMS = {
  bengaluru: ['Bengaluru', 'Bangalore'],
  'delhi-ncr': ['Delhi'],
  gurugram: ['Gurugram', 'Gurgaon'],
  kolkata: ['Kolkata', 'Calcutta'],
}

// Very soft regional tints so the map feels alive without leaving the
// site's actual brand palette (indigo #5b5fef / violet #7c6cff / mint
// #20c997 — see index.css's mz-* tokens). Three on-brand tints, alternated
// across the six geographic clusters, rather than an unrelated pastel set.
const REGION_PALETTES = {
  north: '#EEEFFF', // indigo tint (mz-primary-tint)
  west: '#F2F0FF', // violet tint
  central: '#E4F8F1', // mint tint (mz-accent-tint)
  east: '#F2F0FF', // violet tint
  northeast: '#E4F8F1', // mint tint
  south: '#EEEFFF', // indigo tint
}
const STATE_REGION = {
  'IN-JK': 'north', 'IN-LA': 'north', 'IN-HP': 'north', 'IN-PB': 'north', 'IN-CH': 'north', 'IN-HR': 'north', 'IN-DL': 'north', 'IN-UT': 'north',
  'IN-RJ': 'west', 'IN-GJ': 'west', 'IN-MH': 'west', 'IN-GA': 'west', 'IN-DH': 'west',
  'IN-MP': 'central', 'IN-CT': 'central', 'IN-UP': 'central',
  'IN-BR': 'east', 'IN-JH': 'east', 'IN-WB': 'east', 'IN-OR': 'east',
  'IN-AS': 'northeast', 'IN-AR': 'northeast', 'IN-MN': 'northeast', 'IN-ML': 'northeast', 'IN-NL': 'northeast', 'IN-MZ': 'northeast', 'IN-TR': 'northeast', 'IN-SK': 'northeast',
  'IN-KA': 'south', 'IN-KL': 'south', 'IN-TN': 'south', 'IN-AP': 'south', 'IN-TG': 'south', 'IN-PY': 'south',
}
function stateFill(id) {
  return REGION_PALETTES[STATE_REGION[id]] ?? '#EEF0FB'
}

// The India outline (~70KB of path data) is fetched only when the section
// approaches the viewport, so it never weighs on the first page load.
function useMapData(ref) {
  const [map, setMap] = useState(null)
  useEffect(() => {
    const node = ref.current
    if (!node) return undefined
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        io.disconnect()
        import('../../../lib/indiaMapData').then((m) => setMap(m))
      },
      { rootMargin: '600px 0px' }
    )
    io.observe(node)
    return () => io.disconnect()
  }, [ref])
  return map
}

// Measures each rendered state path once (after the (large) map data has
// loaded) so a landmark can be positioned/centered from real state geometry
// when it has no curated city coordinate to anchor to instead.
function useStateGeometry(pathRefs, ready) {
  const [geo, setGeo] = useState({})
  useEffect(() => {
    if (!ready) return
    const next = {}
    for (const [id, el] of Object.entries(pathRefs.current)) {
      if (!el) continue
      const box = el.getBBox()
      next[id] = { cx: box.x + box.width / 2, cy: box.y + box.height / 2 }
    }
    setGeo(next)
  }, [ready, pathRefs])
  return geo
}

// Eight landmarks only — the brief is explicit that quality beats quantity
// here. Each is a small "destination marker": a colored pin badge with a
// minimal single-tone silhouette inside, not a standalone illustration.
// `accent` drives the badge ring/icon color, its glow, its tooltip, and (for
// all eight, since every one now maps to a real tracked hiring hub) the
// matching right-side city row — one identity across map and panel.
//
// Every accent below is drawn from the site's actual brand palette (see
// index.css's mz-* tokens: primary indigo #5b5fef, secondary violet
// #7c6cff, accent mint #20c997) rather than an invented earthy/pastel set —
// so this section reads as the same Mzobs product as the rest of the site.
const LANDMARK_PALETTE = {
  tajMahal: { accent: '#5b5fef' }, // mz-primary (indigo)
  indiaGate: { accent: '#4a4ed8' }, // mz-primary-strong
  hawaMahal: { accent: '#7c6cff' }, // mz-secondary (violet)
  gatewayOfIndia: { accent: '#20c997' }, // mz-accent (mint)
  charminar: { accent: '#0b8a67' }, // mz-accent-ink
  victoriaMemorial: { accent: '#6a5cf0' }, // indigo/violet blend
  vidhanaSoudha: { accent: '#34d399' }, // light mint
  southIndianTemple: { accent: '#9089ff' }, // light violet
}

// Minimal single-tone silhouettes — 2-4 shapes each, drawn in a small local
// -9..9 box so they read clearly at the badge's small size instead of as a
// miniature building. Each takes its color from the wrapping <g>'s stroke.
const LANDMARK_ICONS = {
  tajMahal: () => (
    <>
      <path d="M -6,7 V 1 Q -6,-6.5 0,-6.5 Q 6,-6.5 6,1 V 7" fill="none" />
      <line x1="-8" y1="7" x2="8" y2="7" />
      <circle cx="0" cy="-7.6" r="0.7" fill="currentColor" stroke="none" />
    </>
  ),
  indiaGate: () => (
    <>
      <path d="M -3.6,7 V -2.5 Q -3.6,-6.5 0,-6.5 Q 3.6,-6.5 3.6,-2.5 V 7" fill="none" />
      <line x1="-6" y1="7" x2="6" y2="7" />
    </>
  ),
  hawaMahal: () => (
    <>
      <path d="M -6.5,7 V -0.5 L -3,-6 H 3 L 6.5,-0.5 V 7" fill="none" />
      <circle cx="-2.6" cy="2" r="0.7" fill="currentColor" stroke="none" />
      <circle cx="0" cy="2" r="0.7" fill="currentColor" stroke="none" />
      <circle cx="2.6" cy="2" r="0.7" fill="currentColor" stroke="none" />
    </>
  ),
  gatewayOfIndia: () => (
    <>
      <path d="M -6,7 V 0.5 Q -6,-5.5 0,-5.5 Q 6,-5.5 6,0.5 V 7" fill="none" />
      <line x1="-8" y1="7" x2="8" y2="7" />
    </>
  ),
  charminar: () => (
    <>
      <path d="M -4,7 V -1 Q -4,-4 0,-4 Q 4,-4 4,-1 V 7" fill="none" />
      <circle cx="-6.4" cy="-1.6" r="0.8" fill="currentColor" stroke="none" />
      <circle cx="6.4" cy="-1.6" r="0.8" fill="currentColor" stroke="none" />
    </>
  ),
  victoriaMemorial: () => (
    <>
      <rect x="-6.5" y="3" width="13" height="4" fill="none" />
      <path d="M -3.6,3 Q -3.6,-5 0,-6 Q 3.6,-5 3.6,3" fill="none" />
    </>
  ),
  vidhanaSoudha: () => (
    <>
      <rect x="-6.5" y="0.5" width="13" height="6.5" fill="none" />
      <path d="M -3.2,0.5 Q -3.2,-4 0,-5 Q 3.2,-4 3.2,0.5" fill="none" />
    </>
  ),
  southIndianTemple: () => (
    <>
      <polygon points="-6.5,7 6.5,7 4.3,4 -4.3,4" fill="none" />
      <polygon points="-4.3,4 4.3,4 2.2,1 -2.2,1" fill="none" />
      <polygon points="-2.2,1 2.2,1 0,-3" fill="none" />
    </>
  ),
}

// Exactly the eight landmarks the brief calls for, each anchored to its
// real hiring-hub city (all eight already have curated map coordinates from
// the city pins, except Agra and Jaipur which aren't tracked hiring cities
// themselves — those anchor to their state's measured centroid with a
// small nudge toward the actual monument's location within that state).
const LANDMARKS_META = [
  { id: 'india-gate', name: 'India Gate', city: 'Delhi', state: 'Delhi', citySlug: 'delhi-ncr', icon: 'indiaGate', anchor: { type: 'city', slug: 'delhi-ncr' } },
  { id: 'taj-mahal', name: 'Taj Mahal', city: 'Agra', state: 'Uttar Pradesh', searchTerms: ['Agra', 'Uttar Pradesh'], icon: 'tajMahal', anchor: { type: 'state', id: 'IN-UP', dx: -35, dy: 15 } },
  { id: 'hawa-mahal', name: 'Hawa Mahal', city: 'Jaipur', state: 'Rajasthan', searchTerms: ['Jaipur', 'Rajasthan'], icon: 'hawaMahal', anchor: { type: 'state', id: 'IN-RJ', dx: 12, dy: 8 } },
  { id: 'gateway-of-india', name: 'Gateway of India', city: 'Mumbai', state: 'Maharashtra', citySlug: 'mumbai', icon: 'gatewayOfIndia', anchor: { type: 'city', slug: 'mumbai' } },
  { id: 'charminar', name: 'Charminar', city: 'Hyderabad', state: 'Telangana', citySlug: 'hyderabad', icon: 'charminar', anchor: { type: 'city', slug: 'hyderabad' } },
  { id: 'victoria-memorial', name: 'Victoria Memorial', city: 'Kolkata', state: 'West Bengal', citySlug: 'kolkata', icon: 'victoriaMemorial', anchor: { type: 'city', slug: 'kolkata' } },
  { id: 'vidhana-soudha', name: 'Vidhana Soudha', city: 'Bengaluru', state: 'Karnataka', citySlug: 'bengaluru', icon: 'vidhanaSoudha', anchor: { type: 'city', slug: 'bengaluru' } },
  { id: 'kapaleeshwarar-temple', name: 'Kapaleeshwarar Temple', city: 'Chennai', state: 'Tamil Nadu', citySlug: 'chennai', icon: 'southIndianTemple', anchor: { type: 'city', slug: 'chennai' } },
]

// So the map and the right-side hiring panel read as one component: a city
// with a landmark on the map uses that landmark's own accent color for its
// row/detail-card highlight too. Cities with no landmark on this shortlist
// (Pune, Lucknow, Noida, Gurugram) fall back to the default brand indigo.
const DEFAULT_ACCENT = '#5b5fef'
function getCityAccent(slug) {
  const landmark = LANDMARKS_META.find((l) => l.citySlug === slug)
  return landmark ? LANDMARK_PALETTE[landmark.icon].accent : DEFAULT_ACCENT
}

// A small destination-marker pin, not a building: a colored badge (~34-38
// map-units across — roughly a 55-65px footprint on a typical desktop
// render of this section) holding a minimal icon, with the state's name
// never shown until hover/selection. Inactive landmarks sit at reduced
// opacity so the active one reads as the clear focal point.
function LandmarkMarker({ landmark, isHovered, isActive, onHover, onLeave, onClick }) {
  const Icon = LANDMARK_ICONS[landmark.icon]
  const accent = LANDMARK_PALETTE[landmark.icon].accent
  const live = isHovered || isActive
  const scale = isHovered ? 1.18 : isActive ? 1.08 : 1

  return (
    <g
      transform={`translate(${landmark.x} ${landmark.y})`}
      role="button"
      tabIndex={0}
      aria-label={`${landmark.name}, ${landmark.city}, ${landmark.state}`}
      className="cursor-pointer outline-none"
      opacity={live ? 1 : 0.6}
      style={{ transition: 'opacity 250ms ease' }}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      onFocus={onHover}
      onBlur={onLeave}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onClick()
        }
      }}
    >
      {live && (
        <circle r="19" fill={accent} opacity={isHovered ? 0.3 : 0.18} filter="url(#mzGlowBlur)" style={{ transition: 'opacity 250ms ease' }} />
      )}
      <g style={{ transform: `scale(${scale})`, transformBox: 'fill-box', transformOrigin: 'center', transition: 'transform 250ms cubic-bezier(0.22,1,0.36,1)' }}>
        <circle r="9.5" fill={`${accent}22`} stroke={accent} strokeWidth="1.4" filter="url(#mzLandmarkShadow)" />
        <g transform="translate(0,0.3) scale(0.62)" stroke={accent} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <Icon />
        </g>
      </g>
      {isActive && (
        <circle cy="14" r="1.5" fill={accent} style={{ transformBox: 'fill-box', transformOrigin: 'center', animation: 'mzPulseRing 2.4s ease-out infinite' }} />
      )}
    </g>
  )
}

// HTML overlays (not SVG) so tooltip/tag get real Tailwind layout/typography
// and true glassmorphism (backdrop-blur) regardless of how much the map
// itself is scaled down on smaller screens. Positioned from the landmark's
// viewBox coordinates as a plain percentage of the shared aspect-ratio box
// the map svg also fills.
function edgeClampX(xFrac) {
  return xFrac < 0.16 ? '0%' : xFrac > 0.84 ? '-100%' : '-50%'
}

function LandmarkTooltip({ landmark, opportunities, loading }) {
  const xFrac = landmark.x / 500
  const yFrac = landmark.y / 506.83
  const flipDown = yFrac < 0.18
  const ty = flipDown ? '16px' : 'calc(-100% - 16px)'
  const accent = LANDMARK_PALETTE[landmark.icon].accent

  return (
    <div
      className="pointer-events-none absolute z-20 min-w-[172px] overflow-hidden rounded-2xl border border-white/70 bg-white/80 shadow-[0_24px_48px_-18px_rgba(17,24,39,0.35)] backdrop-blur-md"
      style={{ left: `${xFrac * 100}%`, top: `${yFrac * 100}%`, transform: `translate(${edgeClampX(xFrac)}, ${ty})` }}
    >
      <div className="h-1" style={{ backgroundColor: accent }} />
      <div className="px-4 py-3">
        <p className="text-[13.5px] font-bold leading-tight text-[#111827]">{landmark.name}</p>
        <p className="mt-0.5 text-[11.5px] text-[#6B7280]">
          {landmark.city} &middot; {landmark.state}
        </p>
        {landmark.citySlug && (
          <p className="mt-1.5 text-[12px] font-bold" style={{ color: accent }}>
            {loading ? 'Loading…' : `${(opportunities ?? 0).toLocaleString('en-IN')} ${opportunities === 1 ? 'opportunity' : 'opportunities'}`}
          </p>
        )}
      </div>
    </div>
  )
}

// Compact persistent glass pill for whichever landmark is currently the
// selected city (kept quiet — not shown for every landmark, only the one
// that's actually active — so the map never looks cluttered with labels).
function ActiveLandmarkTag({ landmark, opportunities, loading }) {
  const xFrac = landmark.x / 500
  const yFrac = landmark.y / 506.83
  const accent = LANDMARK_PALETTE[landmark.icon].accent

  return (
    <div
      className="pointer-events-none absolute z-10 flex items-center gap-1.5 whitespace-nowrap rounded-full border border-white/70 bg-white/85 px-3 py-1.5 shadow-[0_14px_28px_-14px_rgba(17,24,39,0.35)] backdrop-blur-md"
      style={{ left: `${xFrac * 100}%`, top: `${yFrac * 100}%`, transform: `translate(${edgeClampX(xFrac)}, 16px)` }}
    >
      <span className="h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: accent }} />
      <span className="text-[11.5px] font-bold text-[#111827]">{landmark.city}</span>
      {!loading && (
        <span className="text-[11px] font-bold" style={{ color: accent }}>&middot; {(opportunities ?? 0).toLocaleString('en-IN')}</span>
      )}
    </div>
  )
}

export default function CityMapSection({ onSelect }) {
  const ref = useRef(null)
  const map = useMapData(ref)
  const { data: cities, status } = useHotCities()
  const [active, setActive] = useState(null)
  const [hoveredLandmark, setHoveredLandmark] = useState(null)
  const statePathRefs = useRef({})
  const stateGeo = useStateGeometry(statePathRefs, Boolean(map))

  const bySlug = useMemo(() => Object.fromEntries((cities ?? []).map((c) => [c.slug, c])), [cities])
  const positions = useMemo(() => Object.fromEntries((map?.INDIA_MAP_CITY_POSITIONS ?? []).map((p) => [p.slug, p])), [map])
  const rows = CITY_SLUGS.map((slug) => ({ slug, city: bySlug[slug]?.city ?? slug.replace('-ncr', ' NCR').replace(/^\w/, (c) => c.toUpperCase()), stats: bySlug[slug]?.byFilter?.all }))
  // Until the visitor picks one, spotlight the city with the most openings.
  const busiest = rows.reduce((best, r) => ((r.stats?.openings ?? 0) > (best.stats?.openings ?? 0) ? r : best), rows[0])
  const activeSlug = active ?? busiest.slug
  const current = rows.find((r) => r.slug === activeSlug)

  // Resolve each landmark's real map position — precise curated city
  // coordinates where one exists, otherwise the anchor state's measured
  // centroid plus its hand-tuned nudge toward the actual monument.
  const landmarks = useMemo(() => {
    if (!map) return []
    return LANDMARKS_META.map((m) => {
      const base = m.anchor.type === 'city' ? positions[m.anchor.slug] : stateGeo[m.anchor.id] && { x: stateGeo[m.anchor.id].cx, y: stateGeo[m.anchor.id].cy }
      if (!base) return null
      return { ...m, x: base.x + (m.anchor.dx ?? 0), y: base.y + (m.anchor.dy ?? 0) }
    }).filter(Boolean)
  }, [map, positions, stateGeo])

  const hovered = landmarks.find((l) => l.id === hoveredLandmark)
  const activeLandmark = !hovered ? landmarks.find((l) => l.citySlug === activeSlug) : null

  function handleLandmarkClick(landmark) {
    if (landmark.citySlug) setActive(landmark.citySlug)
    else if (landmark.searchTerms) onSelect?.({ q: [], location: landmark.searchTerms, experience: '' })
  }

  return (
    <section id="cities" ref={ref} aria-labelledby="cities-title" className="relative overflow-hidden bg-[#F8F9FD] mz-section">
      <Container>
        <SectionHead id="cities-title" eyebrow="Explore by city" title="Where India is hiring.">
          Live openings across the country&rsquo;s biggest hiring hubs. Hover or tap a landmark to see what&rsquo;s open there.
        </SectionHead>

        <div className="mt-12 grid items-center gap-10 lg:grid-cols-[1.22fr_1fr] lg:gap-14">
          {/* Map — the hero visual of this section */}
          <Reveal className="relative order-2 mx-auto w-full max-w-[820px] lg:order-1">
            <div
              className="absolute inset-[-6%] rounded-full opacity-90"
              style={{ background: 'radial-gradient(closest-side, rgba(91,95,239,0.16), rgba(124,108,255,0.06) 60%, transparent 80%)' }}
              aria-hidden="true"
            />
            <div className="relative aspect-[500/507]">
              {map ? (
                <svg viewBox={map.INDIA_MAP_VIEWBOX} className="h-full w-full" role="img" aria-label="Illustrated map of India with iconic landmarks marking major hiring hubs">
                  <defs>
                    <filter id="mzMapShadow" x="-30%" y="-30%" width="160%" height="160%">
                      <feDropShadow dx="0" dy="10" stdDeviation="16" floodColor="#5b5fef" floodOpacity="0.18" />
                    </filter>
                    <filter id="mzGlowBlur" x="-150%" y="-150%" width="400%" height="400%">
                      <feGaussianBlur stdDeviation="5" />
                    </filter>
                    <filter id="mzLandmarkShadow" x="-80%" y="-80%" width="260%" height="260%">
                      <feDropShadow dx="0" dy="3" stdDeviation="2.4" floodColor="#4a4ed8" floodOpacity="0.32" />
                    </filter>
                  </defs>
                  <g filter="url(#mzMapShadow)">
                    {map.INDIA_MAP_STATES.map((s) => (
                      <path
                        key={s.id}
                        ref={(el) => { statePathRefs.current[s.id] = el }}
                        d={s.d}
                        fill={stateFill(s.id)}
                        stroke="#C9CEE8"
                        strokeWidth="1.2"
                        strokeLinejoin="round"
                      />
                    ))}
                  </g>
                  <g>
                    {landmarks.map((l) => (
                      <LandmarkMarker
                        key={l.id}
                        landmark={l}
                        isHovered={hoveredLandmark === l.id}
                        isActive={Boolean(l.citySlug) && l.citySlug === activeSlug}
                        onHover={() => setHoveredLandmark(l.id)}
                        onLeave={() => setHoveredLandmark((cur) => (cur === l.id ? null : cur))}
                        onClick={() => handleLandmarkClick(l)}
                      />
                    ))}
                  </g>
                </svg>
              ) : (
                <div className="mz-skeleton h-full w-full rounded-[40%]" aria-hidden="true" />
              )}
              {hovered && (
                <LandmarkTooltip
                  landmark={hovered}
                  opportunities={rows.find((r) => r.slug === hovered.citySlug)?.stats?.openings}
                  loading={status === 'loading'}
                />
              )}
              {!hovered && activeLandmark && (
                <ActiveLandmarkTag
                  landmark={activeLandmark}
                  opportunities={rows.find((r) => r.slug === activeLandmark.citySlug)?.stats?.openings}
                  loading={status === 'loading'}
                />
              )}
            </div>
          </Reveal>

          {/* City list + detail */}
          <div className="order-1 lg:order-2">
            <ul className="grid grid-cols-2 gap-2 sm:grid-cols-5 lg:grid-cols-2" role="list">
              {rows.map((r) => {
                const on = r.slug === activeSlug
                const accent = getCityAccent(r.slug)
                return (
                  <li key={r.slug}>
                    <button
                      type="button"
                      onMouseEnter={() => setActive(r.slug)}
                      onFocus={() => setActive(r.slug)}
                      onClick={() => setActive(r.slug)}
                      aria-pressed={on}
                      className={`flex w-full items-center justify-between gap-2 rounded-2xl px-3.5 py-3 text-left ring-1 transition-all duration-200 focus-visible:outline-2 focus-visible:outline-mz-primary ${
                        on ? 'text-mz-ink ring-transparent' : 'bg-mz-bg text-mz-ink ring-transparent hover:bg-white hover:ring-mz-line'
                      }`}
                      style={on ? { backgroundColor: `${accent}1A`, boxShadow: `inset 0 0 0 1.5px ${accent}55` } : undefined}
                    >
                      <span className="flex items-center gap-2 truncate">
                        <span className="h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: accent }} aria-hidden="true" />
                        <span className="truncate text-[14px] font-medium">{r.city}</span>
                      </span>
                      <span className="shrink-0 text-[12.5px] font-semibold" style={{ color: on ? accent : 'var(--mz-muted, #6B7280)' }}>
                        {status === 'loading' ? '' : (r.stats?.openings ?? 0).toLocaleString('en-IN')}
                      </span>
                    </button>
                  </li>
                )
              })}
            </ul>

            {current && (
              <div className="relative mt-5 overflow-hidden rounded-3xl bg-white/80 p-6 ring-1 ring-mz-line shadow-mz-card backdrop-blur-md" aria-live="polite">
                <div className="absolute inset-x-0 top-0 h-1" style={{ backgroundColor: getCityAccent(current.slug) }} aria-hidden="true" />
                <div className="flex items-center gap-2 text-[13px] font-medium text-mz-muted">
                  <MapPin size={15} style={{ color: getCityAccent(current.slug) }} aria-hidden="true" /> {current.city}
                </div>
                {status === 'loading' ? (
                  <div className="mt-3 space-y-2" aria-hidden="true">
                    <div className="mz-skeleton h-7 w-40 rounded" />
                    <div className="mz-skeleton h-4 w-56 rounded" />
                  </div>
                ) : current.stats?.openings > 0 ? (
                  <>
                    <p className="mt-2 text-[28px] font-bold tracking-tight text-mz-ink">
                      {current.stats.openings.toLocaleString('en-IN')} <span className="text-[16px] font-medium text-mz-muted">available {current.stats.openings === 1 ? 'opportunity' : 'opportunities'}</span>
                    </p>
                    {current.stats.topCategories?.length > 0 && (
                      <div className="mt-3 flex flex-wrap items-center gap-2">
                        <span className="text-[12.5px] text-mz-muted">Top categories:</span>
                        {current.stats.topCategories.map((c) => (
                          <span
                            key={c}
                            className="rounded-full px-2.5 py-1 text-[12.5px] font-medium"
                            style={{ backgroundColor: `${getCityAccent(current.slug)}1F`, color: getCityAccent(current.slug) }}
                          >
                            {c}
                          </span>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <p className="mt-2 text-[15px] text-mz-ink-2">No live openings in {current.city} right now &mdash; new roles are added as employers post them.</p>
                )}
                <div className="mt-5 flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => onSelect?.({ q: [], location: SEARCH_TERMS[current.slug] ?? [current.city], experience: '' })}
                    className="inline-flex h-10 items-center gap-1.5 rounded-full bg-mz-primary px-4 text-[13.5px] font-semibold text-white transition-colors hover:bg-mz-primary-strong focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-mz-primary"
                  >
                    Show jobs in {current.city} <ArrowRight size={15} aria-hidden="true" />
                  </button>
                  <Link to={`/jobs/city/${current.slug}`} className="inline-flex h-10 items-center rounded-full px-4 text-[13.5px] font-semibold text-mz-ink-2 ring-1 ring-mz-line-strong transition-colors hover:text-mz-primary-strong hover:ring-mz-primary">
                    City page
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </Container>
    </section>
  )
}
