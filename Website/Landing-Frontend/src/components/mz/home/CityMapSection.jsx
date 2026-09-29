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

function Pin({ x, y, active, live, onEnter, label }) {
  return (
    <g transform={`translate(${x} ${y})`} onMouseEnter={onEnter} className="cursor-pointer" aria-hidden="true" data-city={label}>
      {live && <circle r="5" fill="#5b5fef" style={{ transformBox: 'fill-box', transformOrigin: 'center', animation: 'mzPulseRing 2.4s ease-out infinite' }} />}
      <circle r={active ? 8 : 5.5} fill={active ? '#5b5fef' : live ? '#7c6cff' : '#b8bccb'} stroke="#fff" strokeWidth="2.5" style={{ transition: 'r 200ms ease' }} />
    </g>
  )
}

export default function CityMapSection({ onSelect }) {
  const ref = useRef(null)
  const map = useMapData(ref)
  const { data: cities, status } = useHotCities()
  const [active, setActive] = useState(null)

  const bySlug = useMemo(() => Object.fromEntries((cities ?? []).map((c) => [c.slug, c])), [cities])
  const positions = useMemo(() => Object.fromEntries((map?.INDIA_MAP_CITY_POSITIONS ?? []).map((p) => [p.slug, p])), [map])
  const rows = CITY_SLUGS.map((slug) => ({ slug, city: bySlug[slug]?.city ?? slug.replace('-ncr', ' NCR').replace(/^\w/, (c) => c.toUpperCase()), stats: bySlug[slug]?.byFilter?.all }))
  // Until the visitor picks one, spotlight the city with the most openings.
  const busiest = rows.reduce((best, r) => ((r.stats?.openings ?? 0) > (best.stats?.openings ?? 0) ? r : best), rows[0])
  const activeSlug = active ?? busiest.slug
  const current = rows.find((r) => r.slug === activeSlug)

  return (
    <section id="cities" ref={ref} aria-labelledby="cities-title" className="relative overflow-hidden bg-white py-20 lg:py-28">
      <Container>
        <SectionHead id="cities-title" eyebrow="Explore by city" title="Where India is hiring.">
          Live openings across the country&rsquo;s biggest hiring hubs. Hover or tap a city to see what&rsquo;s open there.
        </SectionHead>

        <div className="mt-12 grid items-center gap-8 lg:grid-cols-[1fr_1.05fr] lg:gap-14">
          {/* Map */}
          <Reveal className="relative order-2 mx-auto w-full max-w-[520px] lg:order-1">
            <div className="absolute inset-[8%] rounded-full bg-[radial-gradient(closest-side,rgba(91,95,239,0.16),transparent)]" aria-hidden="true" />
            <div className="relative aspect-[500/507]">
              {map ? (
                <svg viewBox={map.INDIA_MAP_VIEWBOX} className="h-full w-full" role="img" aria-label="Map of India with hiring cities marked">
                  <g>
                    {map.INDIA_MAP_STATES.map((s) => (
                      <path key={s.id} d={s.d} fill="#eef0fa" stroke="#d5d8e8" strokeWidth="0.8" strokeLinejoin="round" />
                    ))}
                  </g>
                  {rows.map((r) => {
                    const p = positions[r.slug]
                    if (!p || r.slug === activeSlug) return null
                    return <Pin key={r.slug} x={p.x} y={p.y} live={r.stats?.openings > 0} onEnter={() => setActive(r.slug)} label={r.city} />
                  })}
                  {positions[activeSlug] && <Pin x={positions[activeSlug].x} y={positions[activeSlug].y} active live={current?.stats?.openings > 0} label={current?.city} />}
                </svg>
              ) : (
                <div className="mz-skeleton h-full w-full rounded-[40%]" aria-hidden="true" />
              )}
            </div>
          </Reveal>

          {/* City list + detail */}
          <div className="order-1 lg:order-2">
            <ul className="grid grid-cols-2 gap-2 sm:grid-cols-5 lg:grid-cols-2" role="list">
              {rows.map((r) => {
                const on = r.slug === activeSlug
                return (
                  <li key={r.slug}>
                    <button
                      type="button"
                      onMouseEnter={() => setActive(r.slug)}
                      onFocus={() => setActive(r.slug)}
                      onClick={() => setActive(r.slug)}
                      aria-pressed={on}
                      className={`flex w-full items-center justify-between gap-2 rounded-2xl px-3.5 py-3 text-left transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-mz-primary ${
                        on ? 'bg-mz-ink text-white' : 'bg-mz-bg text-mz-ink hover:bg-mz-primary-tint'
                      }`}
                    >
                      <span className="truncate text-[14px] font-medium">{r.city}</span>
                      <span className={`shrink-0 text-[12.5px] ${on ? 'text-white/70' : 'text-mz-muted'}`}>
                        {status === 'loading' ? '' : (r.stats?.openings ?? 0).toLocaleString('en-IN')}
                      </span>
                    </button>
                  </li>
                )
              })}
            </ul>

            {current && (
              <div className="mt-5 rounded-3xl bg-white p-6 ring-1 ring-mz-line shadow-mz-card" aria-live="polite">
                <div className="flex items-center gap-2 text-[13px] font-medium text-mz-muted">
                  <MapPin size={15} className="text-mz-primary" aria-hidden="true" /> {current.city}
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
                          <span key={c} className="rounded-full bg-mz-primary-tint px-2.5 py-1 text-[12.5px] font-medium text-mz-primary-strong">{c}</span>
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
