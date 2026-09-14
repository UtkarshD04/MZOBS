import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, useReducedMotion, AnimatePresence } from 'framer-motion'
import { MapPinned, ShieldCheck, ArrowUpRight, X, Map as MapIcon, Flame, ChevronRight } from 'lucide-react'
import CountUp from '../../ui/CountUp'
import { HOT_CITIES_DATA } from '../../../lib/content'
import { INDIA_MAP_VIEWBOX, INDIA_MAP_STATES, INDIA_MAP_CITY_POSITIONS } from '../../../lib/indiaMapData'
import { fetchHotCities, fetchLatestJobs } from '../../../lib/publicJobs'
import { CompanyMark } from './jobCardPrimitives'

// A map-first, interactive companion to HotJobsByCity's carousel — every
// number and marker here is driven by the same live GET /api/jobs/hot-cities
// feed that section uses (see fetchHotCities), and hovering/selecting a city
// lazily pulls that city's own real listings (fetchLatestJobs, the exact
// `location` filter CityJobs.jsx already uses) rather than inventing role
// names or counts. "View all X jobs" hands off to the existing
// /jobs/city/:slug route — no parallel filtering/routing logic. The India
// outline is a stylized reference map (Natural Earth admin-1 boundaries,
// public domain) — see lib/indiaMapData.js's header for provenance.

const [VIEW_W, VIEW_H] = INDIA_MAP_VIEWBOX.split(' ').slice(2).map(Number)
const TOP_CHIP_COUNT = 6
const JOB_SAMPLE_LIMIT = 20
const HOVER_DEBOUNCE_MS = 130

// A handful of city pairs sit close enough (Delhi NCR/Noida/Gurugram) that
// a naive "label centered above the dot" placement would collide — these
// are the only three that need a manual nudge; everything else uses the
// default.
const LABEL_OFFSETS = {
  'delhi-ncr': { dx: 0, dy: -18, anchor: 'middle' },
  noida: { dx: 13, dy: 9, anchor: 'start' },
  gurugram: { dx: -13, dy: 9, anchor: 'end' },
}

const HEAT_STOPS = [
  { t: 0, rgb: [11, 122, 109] }, // --explorer-teal
  { t: 0.55, rgb: [37, 99, 235] }, // --explorer-blue
  { t: 1, rgb: [124, 92, 232] }, // lavender
]

function heatColor(t) {
  const clamped = Math.max(0, Math.min(1, t))
  let a = HEAT_STOPS[0]
  let b = HEAT_STOPS[HEAT_STOPS.length - 1]
  for (let i = 0; i < HEAT_STOPS.length - 1; i++) {
    if (clamped >= HEAT_STOPS[i].t && clamped <= HEAT_STOPS[i + 1].t) {
      a = HEAT_STOPS[i]
      b = HEAT_STOPS[i + 1]
      break
    }
  }
  const span = b.t - a.t || 1
  const localT = (clamped - a.t) / span
  const rgb = a.rgb.map((v, i) => Math.round(v + (b.rgb[i] - v) * localT))
  // Blend toward white at low intensity so "no data yet" reads as a pale
  // wash rather than a fully-saturated cold color — a deliberate signal,
  // not an accident of the scale's zero point.
  const mixed = rgb.map((v) => Math.round(v + (255 - v) * (1 - (0.18 + clamped * 0.75))))
  return `rgb(${mixed.join(',')})`
}

function CityMarker({ pos, openings, isTop, isActive, isDimmed, onEnter, onLeave, onOpen }) {
  const r = Math.min(10, 5 + Math.sqrt(openings) * 0.32)
  // Default placement scales with the dot's own radius so a bigger dot
  // (more openings) never gets its label crushed against its own edge —
  // only the three geographically-crowded NCR cities need a fixed manual
  // offset (see LABEL_OFFSETS above).
  const offset = LABEL_OFFSETS[pos.slug] ?? { dx: 0, dy: -(r + 15), anchor: 'middle' }
  const farDy = offset.dy + (offset.dy < 0 ? -11 : 11)
  // Name always sits further from the dot than the count, in reading order
  // top-to-bottom regardless of which side of the dot the label falls on.
  const [nameDy, countDy] = offset.dy < 0 ? [farDy, offset.dy] : [offset.dy, farDy]
  return (
    <g
      role="button"
      tabIndex={0}
      aria-label={`${pos.city} — ${openings.toLocaleString('en-IN')}+ open roles`}
      className="cursor-pointer outline-none focus-visible:outline-2 focus-visible:outline-(--explorer-blue) rounded-full"
      transform={`translate(${pos.x} ${pos.y})`}
      style={{ opacity: isDimmed ? 0.38 : 1, transition: 'opacity 250ms ease' }}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      onClick={onOpen}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onOpen()
        }
      }}
    >
      {/* tiny vertical location stem, grounding the dot to the map rather than floating free */}
      <line x1="0" y1="0" x2="0" y2={r + 5} stroke="var(--explorer-navy)" strokeOpacity="0.18" strokeWidth="1.2" />

      <motion.circle
        r={r + 8}
        style={{ fill: 'var(--explorer-blue)', opacity: 0.16 }}
        animate={{ scale: isActive ? [1, 1.35, 1] : 1 }}
        transition={{ duration: 1.8, repeat: isActive ? Infinity : 0, ease: 'easeInOut' }}
      />
      <motion.circle
        r={r}
        style={{ fill: 'var(--explorer-blue)', stroke: '#fff', strokeWidth: 1.6, filter: 'drop-shadow(0 1px 3px rgba(37,99,235,0.45))' }}
        animate={{ scale: isActive ? 1.25 : 1 }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
      />
      <circle r={Math.max(2, r - 4)} style={{ fill: '#fff', opacity: 0.85 }} />

      {(isTop || isActive) && (
        <motion.g
          initial={false}
          animate={{ opacity: 1 }}
          style={{ opacity: isActive ? 1 : 0.92 }}
        >
          <text
            x={offset.dx}
            y={nameDy}
            textAnchor={offset.anchor}
            style={{ fill: 'var(--explorer-navy)', fontSize: isActive ? 12.5 : 11.5, fontWeight: 800 }}
            className="pointer-events-none select-none"
          >
            {pos.city}
          </text>
          <text
            x={offset.dx}
            y={countDy}
            textAnchor={offset.anchor}
            style={{ fill: 'var(--explorer-blue)', fontSize: 9.5, fontWeight: 700 }}
            className="pointer-events-none select-none"
          >
            {openings.toLocaleString('en-IN')}+ jobs
          </text>
        </motion.g>
      )}
    </g>
  )
}

function StatBlock({ eyebrow, value, label, loading, accent }) {
  return (
    <div className="min-w-[84px]">
      <p className={`text-[10.5px] font-black uppercase tracking-[0.14em] ${accent ? 'text-(--explorer-blue)' : 'text-(--explorer-muted)'}`}>
        {eyebrow}
      </p>
      {loading ? (
        <div className="mt-1 h-8 w-12 rounded bg-(--explorer-border) animate-pulse" />
      ) : (
        <CountUp value={value} className="block text-[30px] leading-none font-black text-(--explorer-navy) tracking-tight" />
      )}
      <p className="mt-1 text-[12px] font-semibold text-(--explorer-muted)">{label}</p>
    </div>
  )
}

function RoleRow({ title, count, maxCount }) {
  const pct = Math.max(8, Math.round((count / maxCount) * 100))
  return (
    <div className="relative">
      <div className="flex items-baseline justify-between gap-3 text-[13px]">
        <span className="font-semibold text-(--explorer-navy) truncate">{title}</span>
        <span className="font-black text-(--explorer-blue) shrink-0">{count}</span>
      </div>
      <div className="mt-1 h-1.5 rounded-full bg-(--explorer-bg) overflow-hidden">
        <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundImage: 'var(--hero-cta-gradient)' }} />
      </div>
    </div>
  )
}

function MiniJobCard({ job, onOpen }) {
  return (
    <button
      type="button"
      onClick={onOpen}
      className="group w-full text-left flex items-center gap-3 p-3 rounded-xl border border-(--explorer-border) bg-white hover:border-(--explorer-blue-border) hover:bg-(--explorer-blue-surface)/50 transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--explorer-blue)"
    >
      <CompanyMark company={job.company} logo={job.logo} size="sm" tone="bg-(--explorer-blue-surface) text-(--explorer-blue)" />
      <span className="min-w-0 flex-1">
        <span className="block font-bold text-[13px] text-(--explorer-navy) truncate">{job.title}</span>
        <span className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[11.5px] text-(--explorer-muted)">
          <span className="truncate">{job.company}</span>
          {job.salary && <span className="font-bold text-(--explorer-navy)">{job.salary}</span>}
          {job.verified && (
            <span className="inline-flex items-center gap-0.5 text-(--explorer-blue) font-semibold">
              <ShieldCheck size={11} aria-hidden="true" /> Verified
            </span>
          )}
        </span>
      </span>
      <ArrowUpRight
        size={15}
        className="shrink-0 text-(--explorer-blue) opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-[opacity,transform]"
        aria-hidden="true"
      />
    </button>
  )
}

// Compact floating preview shown on hover (desktop) — attached visually to
// the marker via absolute positioning derived from the same viewBox
// coordinates the SVG uses (see leftPct/topPct below), not a centered modal.
function HoverPreview({ pos, stats, jobsState, style }) {
  const roles = useMemo(() => {
    if (!jobsState?.jobs?.length) return []
    const counts = new Map()
    jobsState.jobs.forEach((j) => counts.set(j.title, (counts.get(j.title) ?? 0) + 1))
    return [...counts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 3)
  }, [jobsState])

  // Positioning (left/top + the -50%/-100% anchor offset) lives on this
  // plain, non-animated wrapper — framer-motion's `animate` computes and
  // owns the *entire* `transform` string on the element it's applied to,
  // so putting our own translate() in `style` on the same motion element
  // would get silently clobbered the moment y/scale animate. The inner
  // motion.div only ever handles the enter/exit animation.
  return (
    <div className="hidden lg:block absolute z-20 w-60 pointer-events-none" style={style}>
      <motion.div
        initial={{ opacity: 0, y: 6, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 4, scale: 0.98 }}
        transition={{ duration: 0.18, ease: 'easeOut' }}
      >
      <div className="rounded-2xl border border-(--explorer-border) bg-white/95 backdrop-blur-md shadow-[0_20px_44px_-18px_rgba(22,50,79,0.35)] p-4">
        <p className="text-[13.5px] font-black text-(--explorer-navy)">{pos.city}</p>
        <p className="text-[12px] font-bold text-(--explorer-blue)">{stats.openings.toLocaleString('en-IN')}+ open roles</p>
        <div className="mt-2.5 flex flex-col gap-1">
          {jobsState?.loading && <div className="h-3 w-3/4 rounded bg-(--explorer-bg) animate-pulse" />}
          {!jobsState?.loading &&
            roles.map(([title]) => (
              <p key={title} className="text-[11.5px] text-(--explorer-muted) truncate">
                {title}
              </p>
            ))}
        </div>
        <p className="mt-2.5 pt-2.5 border-t border-(--explorer-border) inline-flex items-center gap-1 text-[10.5px] font-semibold text-(--explorer-muted)">
          <ShieldCheck size={11} className="text-(--explorer-blue)" aria-hidden="true" />
          {stats.verifiedEmployers > 0 ? `${stats.verifiedEmployers} verified employer${stats.verifiedEmployers === 1 ? '' : 's'}` : 'Verified employers'}
        </p>
      </div>
      </motion.div>
    </div>
  )
}

export default function WhereIndiaIsHiring() {
  const navigate = useNavigate()
  const reduceMotion = useReducedMotion()
  const sectionRef = useRef(null)

  const [liveCities, setLiveCities] = useState(null)
  const [mode, setMode] = useState('map') // 'map' | 'heat'
  const [hoverSlug, setHoverSlug] = useState(null)
  const [selectedSlug, setSelectedSlug] = useState(null)
  const [jobsBySlug, setJobsBySlug] = useState({})
  const hoverTimer = useRef(null)

  useEffect(() => {
    const controller = new AbortController()
    fetchHotCities({ signal: controller.signal })
      .then((data) => setLiveCities(data.cities))
      .catch((err) => {
        if (err?.name !== 'AbortError') setLiveCities([])
      })
    return () => controller.abort()
  }, [])

  const cityStateBySlug = useMemo(() => new Map(HOT_CITIES_DATA.cities.map((c) => [c.slug, c.state])), [])

  const markers = useMemo(() => {
    if (!liveCities) return []
    const bySlug = new Map(liveCities.map((c) => [c.slug, c]))
    return INDIA_MAP_CITY_POSITIONS.map((pos) => {
      const stats = bySlug.get(pos.slug)?.byFilter?.all
      return stats && stats.openings > 0 ? { ...pos, stats } : null
    })
      .filter(Boolean)
      .sort((a, b) => b.stats.openings - a.stats.openings)
  }, [liveCities])

  const totals = useMemo(
    () =>
      markers.reduce(
        (acc, m) => ({ jobs: acc.jobs + m.stats.openings, employers: acc.employers + m.stats.verifiedEmployers }),
        { jobs: 0, employers: 0 }
      ),
    [markers]
  )

  // Real-data heat approximation — each state's intensity is the sum of
  // live openings from tracked cities actually located in it (joined via
  // HOT_CITIES_DATA's own `state` field), never an invented figure. States
  // with no tracked city stay at the scale's pale floor.
  const stateHeat = useMemo(() => {
    const byState = new Map()
    markers.forEach((m) => {
      const state = cityStateBySlug.get(m.slug)
      if (!state) return
      byState.set(state, (byState.get(state) ?? 0) + m.stats.openings)
    })
    const max = Math.max(1, ...byState.values())
    const out = new Map()
    INDIA_MAP_STATES.forEach((s) => out.set(s.name, (byState.get(s.name) ?? 0) / max))
    return out
  }, [markers, cityStateBySlug])

  const loading = liveCities === null
  const chipCities = markers.slice(0, TOP_CHIP_COUNT)
  const selected = markers.find((m) => m.slug === selectedSlug) ?? null
  const hovered = markers.find((m) => m.slug === hoverSlug) ?? null

  function ensureCityJobs(slug, cityName) {
    setJobsBySlug((prev) => {
      if (prev[slug]) return prev
      return { ...prev, [slug]: { loading: true, jobs: [] } }
    })
    fetchLatestJobs({ location: cityName, sort: 'newest', limit: JOB_SAMPLE_LIMIT })
      .then(({ jobs }) => setJobsBySlug((prev) => ({ ...prev, [slug]: { loading: false, jobs } })))
      .catch(() => setJobsBySlug((prev) => ({ ...prev, [slug]: { loading: false, jobs: [], error: true } })))
  }

  function handleEnter(m) {
    clearTimeout(hoverTimer.current)
    hoverTimer.current = setTimeout(() => {
      setHoverSlug(m.slug)
      if (!jobsBySlug[m.slug]) ensureCityJobs(m.slug, m.city)
    }, HOVER_DEBOUNCE_MS)
  }
  function handleLeave() {
    clearTimeout(hoverTimer.current)
    setHoverSlug(null)
  }
  function handleSelect(m) {
    setSelectedSlug((prev) => (prev === m.slug ? null : m.slug))
    if (!jobsBySlug[m.slug]) ensureCityJobs(m.slug, m.city)
  }

  function viewCityJobs(slug) {
    navigate(`/jobs/city/${slug}`)
  }
  function openJob(job) {
    navigate(`/jobs/${job.id ?? encodeURIComponent(job.title)}`, { state: { job } })
  }

  const selectedJobs = selected ? jobsBySlug[selected.slug] : null
  const trendingRoles = useMemo(() => {
    if (!selectedJobs?.jobs?.length) return []
    const counts = new Map()
    selectedJobs.jobs.forEach((j) => counts.set(j.title, (counts.get(j.title) ?? 0) + 1))
    return [...counts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 4)
  }, [selectedJobs])
  const maxRoleCount = trendingRoles[0]?.[1] ?? 1

  const zoomOrigin = selected ? `${selected.x}px ${selected.y}px` : `${VIEW_W / 2}px ${VIEW_H / 2}px`

  return (
    <section ref={sectionRef} className="relative overflow-hidden bg-white py-16 md:py-24 px-6 md:px-10">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-[38%_1fr] gap-10 lg:gap-16 items-center">
          {/* LEFT — editorial panel */}
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            <p className="text-[11px] font-black uppercase tracking-[0.18em] text-(--explorer-blue)">Hot Job Openings</p>
            <h2 className="mt-3 text-[32px] sm:text-[40px] font-black text-(--explorer-navy) tracking-tight leading-[1.05] text-balance">
              Where India is hiring.
            </h2>
            <p className="mt-3.5 text-[15px] text-(--explorer-muted) max-w-sm leading-relaxed">
              Explore fresh opportunities across India's fastest-moving job markets — live, verified, and updated daily.
            </p>

            <div className="mt-8 flex flex-wrap gap-x-8 gap-y-5 pb-7 border-b border-(--explorer-border)">
              <StatBlock eyebrow="Live now" value={totals.jobs} label="open roles" loading={loading} accent />
              <StatBlock eyebrow="Across" value={markers.length} label={markers.length === 1 ? 'city' : 'cities'} loading={loading} />
              <StatBlock eyebrow="Trusted by" value={totals.employers} label="employers" loading={loading} />
            </div>

            <div className="mt-7">
              <p className="text-[11px] font-black uppercase tracking-wide text-(--explorer-muted)">Explore by city</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {loading
                  ? Array.from({ length: 6 }).map((_, i) => <div key={i} className="h-9 w-24 rounded-full bg-(--explorer-bg) animate-pulse" />)
                  : chipCities.map((m) => (
                      <button
                        key={m.slug}
                        type="button"
                        onClick={() => handleSelect(m)}
                        onMouseEnter={() => handleEnter(m)}
                        onMouseLeave={handleLeave}
                        aria-pressed={selectedSlug === m.slug}
                        className={`inline-flex items-center gap-1.5 h-9 pl-3.5 pr-3 rounded-full text-[13px] font-bold whitespace-nowrap transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--explorer-blue) ${
                          selectedSlug === m.slug
                            ? 'text-white shadow-[0_10px_20px_-8px_rgba(37,99,235,0.55)]'
                            : 'bg-(--explorer-bg) text-(--explorer-navy) hover:bg-(--explorer-blue-surface) hover:text-(--explorer-blue)'
                        }`}
                        style={selectedSlug === m.slug ? { backgroundImage: 'var(--hero-cta-gradient)' } : undefined}
                      >
                        {m.city}
                        <span className={selectedSlug === m.slug ? 'text-white/80' : 'text-(--explorer-muted)'}>{m.stats.openings}+</span>
                      </button>
                    ))}
              </div>
            </div>
          </motion.div>

          {/* RIGHT — the map itself, the hero of this section */}
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="relative"
          >
            {/* atmosphere — soft, huge, overlapping washes behind the map */}
            <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
              <div
                className="absolute -top-[10%] -left-[8%] w-[70%] h-[65%] rounded-full opacity-70 blur-3xl bubble-anim-blob-drift"
                style={{ background: 'radial-gradient(circle, rgba(37,99,235,0.14), transparent 70%)', '--dur': '24s' }}
              />
              <div
                className="absolute bottom-[-8%] right-[-6%] w-[65%] h-[60%] rounded-full opacity-70 blur-3xl bubble-anim-medium-drift"
                style={{ background: 'radial-gradient(circle, rgba(124,92,232,0.13), transparent 70%)', '--dur': '22s', '--delay': '-6s' }}
              />
              <div
                className="absolute top-[35%] right-[10%] w-[40%] h-[40%] rounded-full opacity-60 blur-3xl bubble-anim-drift-slow"
                style={{ background: 'radial-gradient(circle, rgba(11,122,109,0.10), transparent 70%)', '--dur': '20s' }}
              />
            </div>

            {/* mode toggle */}
            <div className="relative z-10 flex justify-end mb-3">
              <div className="inline-flex items-center gap-0.5 p-1 rounded-full bg-(--explorer-bg) border border-(--explorer-border)">
                {[
                  { key: 'map', label: 'Map', icon: MapIcon },
                  { key: 'heat', label: 'Hiring heat', icon: Flame },
                ].map((opt) => (
                  <button
                    key={opt.key}
                    type="button"
                    onClick={() => setMode(opt.key)}
                    aria-pressed={mode === opt.key}
                    className={`inline-flex items-center gap-1.5 h-8 px-3.5 rounded-full text-[12px] font-bold transition-colors duration-200 ${
                      mode === opt.key ? 'bg-white text-(--explorer-blue) shadow-[0_1px_2px_rgba(16,42,67,0.08)]' : 'text-(--explorer-muted) hover:text-(--explorer-navy)'
                    }`}
                  >
                    <opt.icon size={13} aria-hidden="true" />
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="relative" style={{ aspectRatio: `${VIEW_W} / ${VIEW_H}` }}>
              <svg viewBox={INDIA_MAP_VIEWBOX} className="w-full h-full overflow-visible" role="img" aria-label="Interactive map of India showing cities with live job openings">
                <defs>
                  <clipPath id="wih-india-clip">
                    {INDIA_MAP_STATES.map((s) => (
                      <path key={s.id} d={s.d} />
                    ))}
                  </clipPath>
                  <linearGradient id="wih-sweep" x1="0" y1="0" x2="1" y2="0.3">
                    <stop offset="0%" stopColor="#fff" stopOpacity="0" />
                    <stop offset="50%" stopColor="#fff" stopOpacity="0.55" />
                    <stop offset="100%" stopColor="#fff" stopOpacity="0" />
                  </linearGradient>
                </defs>

                <motion.g
                  animate={{ scale: selected ? 1.14 : 1 }}
                  transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                  style={{ transformOrigin: zoomOrigin }}
                >
                  <motion.g
                    initial={reduceMotion ? false : 'hidden'}
                    whileInView="show"
                    viewport={{ once: true, amount: 0.2 }}
                    variants={{ hidden: {}, show: { transition: { staggerChildren: 0.012 } } }}
                  >
                    {INDIA_MAP_STATES.map((s) => {
                      // framer-motion only reactively re-applies style props it
                      // is actively animating (i.e. present in `variants`/
                      // `animate`) — a plain `style.fill` gets set once at
                      // mount and then silently ignored on later re-renders,
                      // which is why the fill has to live inside the variant
                      // targets themselves so a mode/heat change retargets it.
                      const fill = mode === 'heat' ? heatColor(stateHeat.get(s.name) ?? 0) : 'var(--explorer-blue-surface)'
                      return (
                        <motion.path
                          key={s.id}
                          d={s.d}
                          variants={{ hidden: { opacity: 0, fill }, show: { opacity: 1, fill } }}
                          transition={{ duration: 0.5, fill: { duration: 0.55, ease: 'easeInOut' } }}
                          style={{ stroke: 'var(--explorer-blue-border)', strokeWidth: 1 }}
                        />
                      )
                    })}
                  </motion.g>

                  {!reduceMotion && (
                    <motion.rect
                      x={-VIEW_W * 0.6}
                      y={0}
                      width={VIEW_W * 0.5}
                      height={VIEW_H}
                      fill="url(#wih-sweep)"
                      clipPath="url(#wih-india-clip)"
                      style={{ mixBlendMode: 'overlay' }}
                      initial={{ x: -VIEW_W * 0.6 }}
                      whileInView={{ x: VIEW_W * 1.1 }}
                      viewport={{ once: true, amount: 0.2 }}
                      transition={{ duration: 1.1, delay: 0.35, ease: 'easeInOut' }}
                    />
                  )}

                  <motion.g
                    initial={reduceMotion ? false : 'hidden'}
                    whileInView="show"
                    viewport={{ once: true, amount: 0.2 }}
                    variants={{ hidden: {}, show: { transition: { staggerChildren: 0.05, delayChildren: 0.3 } } }}
                  >
                    {markers.map((m, i) => (
                      <motion.g
                        key={m.slug}
                        variants={{ hidden: { opacity: 0, scale: 0.4 }, show: { opacity: 1, scale: 1 } }}
                        transition={{ duration: 0.45, ease: [0.34, 1.56, 0.64, 1] }}
                      >
                        <CityMarker
                          pos={m}
                          openings={m.stats.openings}
                          isTop={i < TOP_CHIP_COUNT}
                          isActive={hoverSlug === m.slug || selectedSlug === m.slug}
                          isDimmed={Boolean((hoverSlug || selectedSlug) && hoverSlug !== m.slug && selectedSlug !== m.slug)}
                          onEnter={() => handleEnter(m)}
                          onLeave={handleLeave}
                          onOpen={() => handleSelect(m)}
                        />
                      </motion.g>
                    ))}
                  </motion.g>
                </motion.g>
              </svg>

              <AnimatePresence>
                {hovered && hoverSlug !== selectedSlug && (
                  <HoverPreview
                    pos={hovered}
                    stats={hovered.stats}
                    jobsState={jobsBySlug[hovered.slug]}
                    style={{
                      left: `${(hovered.x / VIEW_W) * 100}%`,
                      top: `${(hovered.y / VIEW_H) * 100}%`,
                      transform: 'translate(-50%, calc(-100% - 18px))',
                    }}
                  />
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>

        {/* Selected city — richer detail panel, full width below the composition */}
        <AnimatePresence mode="wait">
          {selected && (
            <motion.div
              key={selected.slug}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="relative mt-10 md:mt-14 rounded-3xl border border-(--explorer-border) bg-(--explorer-bg) p-6 sm:p-8"
            >
              <button
                type="button"
                onClick={() => setSelectedSlug(null)}
                aria-label="Close city details"
                className="absolute top-5 right-5 flex items-center justify-center w-8 h-8 rounded-full bg-white border border-(--explorer-border) text-(--explorer-muted) hover:text-(--explorer-navy) hover:border-(--explorer-blue-border) transition-colors"
              >
                <X size={14} aria-hidden="true" />
              </button>

              <div className="grid md:grid-cols-[1fr_1.3fr] gap-8">
                <div>
                  <p className="text-[11px] font-black uppercase tracking-wide text-(--explorer-blue)">{cityStateBySlug.get(selected.slug)}</p>
                  <h3 className="mt-1 text-[26px] sm:text-[30px] font-black text-(--explorer-navy) tracking-tight">{selected.city}</h3>
                  <p className="mt-1 text-[14px] font-semibold text-(--explorer-muted)">
                    {selected.stats.openings.toLocaleString('en-IN')}+ open opportunities
                  </p>

                  <p className="mt-6 text-[11px] font-black uppercase tracking-wide text-(--explorer-muted)">Trending roles</p>
                  <div className="mt-3 flex flex-col gap-3">
                    {selectedJobs?.loading &&
                      Array.from({ length: 3 }).map((_, i) => <div key={i} className="h-6 rounded bg-(--explorer-border) animate-pulse" />)}
                    {!selectedJobs?.loading && trendingRoles.length === 0 && (
                      <p className="text-[13px] text-(--explorer-muted)">No role breakdown available right now.</p>
                    )}
                    {!selectedJobs?.loading &&
                      trendingRoles.map(([title, count]) => <RoleRow key={title} title={title} count={count} maxCount={maxRoleCount} />)}
                  </div>

                  <button
                    type="button"
                    onClick={() => viewCityJobs(selected.slug)}
                    className="mt-6 inline-flex items-center gap-1.5 h-10 px-5 rounded-md text-white text-[13.5px] font-bold shadow-[0_1px_2px_rgba(37,99,235,0.16),0_10px_20px_-10px_rgba(59,109,240,0.55)] motion-safe:transition-transform motion-safe:duration-200 hover:brightness-110"
                    style={{ backgroundImage: 'var(--hero-cta-gradient)' }}
                  >
                    View all {selected.city} jobs <ArrowUpRight size={15} aria-hidden="true" />
                  </button>
                </div>

                <div>
                  <p className="text-[11px] font-black uppercase tracking-wide text-(--explorer-muted) mb-3">Live roles in {selected.city}</p>
                  <div className="flex flex-col gap-2.5">
                    {selectedJobs?.loading &&
                      Array.from({ length: 3 }).map((_, i) => <div key={i} className="h-16 rounded-xl bg-(--explorer-border) animate-pulse" />)}
                    {!selectedJobs?.loading && (selectedJobs?.jobs?.length ?? 0) === 0 && (
                      <p className="text-[13px] text-(--explorer-muted)">Couldn't load live roles for {selected.city} right now.</p>
                    )}
                    {!selectedJobs?.loading &&
                      selectedJobs?.jobs?.slice(0, 3).map((job) => <MiniJobCard key={job.id ?? job.title} job={job} onOpen={() => openJob(job)} />)}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Trending locations rail */}
        {!loading && markers.length > 0 && (
          <div className="mt-12 md:mt-16">
            <p className="text-[11px] font-black uppercase tracking-wide text-(--explorer-muted) mb-4">Trending locations</p>
            <div className="careers-scroll-x flex items-stretch gap-3 overflow-x-auto pb-2 -mx-1 px-1">
              {markers.map((m) => (
                <button
                  key={m.slug}
                  type="button"
                  onClick={() => handleSelect(m)}
                  onMouseEnter={() => handleEnter(m)}
                  onMouseLeave={handleLeave}
                  aria-pressed={selectedSlug === m.slug}
                  className={`group shrink-0 flex items-center gap-3 min-w-[168px] p-4 rounded-2xl border transition-all duration-200 motion-safe:hover:-translate-y-1 ${
                    selectedSlug === m.slug
                      ? 'border-(--explorer-blue-border) bg-(--explorer-blue-surface) shadow-[0_16px_32px_-18px_rgba(37,99,235,0.4)]'
                      : 'border-(--explorer-border) bg-white hover:border-(--explorer-blue-border) hover:shadow-[0_16px_32px_-18px_rgba(22,50,79,0.3)]'
                  }`}
                >
                  <span className="flex items-center justify-center w-9 h-9 rounded-full bg-(--explorer-blue-surface) text-(--explorer-blue) shrink-0 motion-safe:transition-transform motion-safe:duration-200 group-hover:scale-110">
                    <MapPinned size={15} aria-hidden="true" />
                  </span>
                  <span className="min-w-0 text-left">
                    <span className="block font-bold text-[13.5px] text-(--explorer-navy) truncate">{m.city}</span>
                    <span className="block text-[12px] font-semibold text-(--explorer-blue)">{m.stats.openings.toLocaleString('en-IN')}+ jobs</span>
                  </span>
                  <ChevronRight
                    size={14}
                    className="ml-auto shrink-0 text-(--explorer-muted) opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-[opacity,transform]"
                    aria-hidden="true"
                  />
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
