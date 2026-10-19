import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, ArrowRight, MapPin, Search, SearchX, RotateCw, X } from 'lucide-react'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import Seo from '../components/Seo'
import Reveal from '../components/ui/Reveal'
import ExplorerButton, { ExplorerTextLink } from '../components/ui/ExplorerButton'
import { CityVisual } from '../components/sections/home/HotJobsByCity'
import { HOT_CITIES_DATA } from '../lib/content'
import { fetchHotCities } from '../lib/publicJobs'

export default function AllCities() {
  const [liveCities, setLiveCities] = useState(null) // null = still loading
  const [loadError, setLoadError] = useState(false)
  const [retryToken, setRetryToken] = useState(0)
  const [query, setQuery] = useState('')
  const [menuOpen, setMenuOpen] = useState(false)
  const [activeIdx, setActiveIdx] = useState(0)
  const navigate = useNavigate()

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

  // Every city we have metadata for — hottest first once live counts arrive,
  // listed (with 0 roles) even when the live feed has nothing for it.
  const cities = useMemo(() => {
    const openingsOf = (slug) => liveCities?.find((c) => c.slug === slug)?.byFilter?.all?.openings ?? 0
    return HOT_CITIES_DATA.cities
      .map((meta) => ({ meta, openings: openingsOf(meta.slug) }))
      .sort((a, b) => b.openings - a.openings)
  }, [liveCities])

  // Search: matches city name, state or a known alias (e.g. Bangalore → Bengaluru's
  // locationTerms). With nothing typed the dropdown lists every city A–Z.
  const matches = useMemo(() => {
    const needle = query.trim().toLowerCase()
    const list = needle
      ? cities.filter(({ meta }) => `${meta.city} ${meta.state} ${meta.locationTerms ?? ''}`.toLowerCase().includes(needle))
      : [...cities].sort((a, b) => a.meta.city.localeCompare(b.meta.city))
    return needle ? list.sort((a, b) => Number(!b.meta.city.toLowerCase().startsWith(needle)) - Number(!a.meta.city.toLowerCase().startsWith(needle)) || a.meta.city.localeCompare(b.meta.city)) : list
  }, [cities, query])

  const onSearchKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setMenuOpen(true)
      setActiveIdx((i) => Math.min(i + 1, matches.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActiveIdx((i) => Math.max(i - 1, 0))
    } else if (e.key === 'Enter' && menuOpen && matches[activeIdx]) {
      e.preventDefault()
      navigate(`/jobs/city/${matches[activeIdx].meta.slug}`)
    } else if (e.key === 'Escape') {
      setMenuOpen(false)
    }
  }

  // The grid below narrows as you type too, so the page works without the dropdown.
  const visibleCities = query.trim() ? cities.filter((c) => matches.some((m) => m.meta.slug === c.meta.slug)) : cities

  return (
    <div className="min-h-screen bg-(--explorer-teal-surface) flex flex-col">
      <Seo
        path="/jobs/cities"
        title="Jobs by City: All Locations Hiring | Mzobs"
        description="Explore job openings in every city Mzobs covers, with live opening counts for each location."
      />
      <Navbar />

      <header className="bg-gradient-to-br from-(--explorer-navy-deep) to-(--explorer-teal) pt-28 pb-10">
        <div className="max-w-6xl mx-auto px-6 md:px-10">
          <ExplorerTextLink to="/#hot-jobs-by-city" arrow={false} className="w-fit mb-4 text-white/85 hover:text-white">
            <ArrowLeft size={14} aria-hidden="true" /> Back to home
          </ExplorerTextLink>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">All locations</h1>
          <p className="mt-2 text-[15px] text-white/80">Pick a city to see the jobs hiring there right now.</p>

          <div
            className="relative mt-5 max-w-lg"
            onBlur={(e) => {
              if (!e.currentTarget.contains(e.relatedTarget)) setMenuOpen(false)
            }}
          >
            <Search size={17} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-(--explorer-muted)" aria-hidden="true" />
            <input
              type="text"
              role="combobox"
              aria-expanded={menuOpen}
              aria-controls="city-search-list"
              aria-autocomplete="list"
              aria-activedescendant={menuOpen && matches[activeIdx] ? `city-opt-${matches[activeIdx].meta.slug}` : undefined}
              aria-label="Search for a city"
              placeholder="Search your city (e.g. Pune, Jaipur, Kochi)"
              autoComplete="off"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value)
                setActiveIdx(0)
                setMenuOpen(true)
              }}
              onFocus={() => setMenuOpen(true)}
              onKeyDown={onSearchKeyDown}
              className="h-12 w-full rounded-xl bg-white pl-11 pr-10 text-[15px] text-(--explorer-navy) placeholder:text-(--explorer-muted) shadow-[0_14px_32px_-18px_rgba(16,42,67,0.5)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            />
            {query && (
              <button
                type="button"
                onClick={() => {
                  setQuery('')
                  setActiveIdx(0)
                }}
                aria-label="Clear search"
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-(--explorer-muted) hover:text-(--explorer-navy) focus-visible:outline-2 focus-visible:outline-(--explorer-blue)"
              >
                <X size={16} aria-hidden="true" />
              </button>
            )}

            {menuOpen && (
              <ul
                id="city-search-list"
                role="listbox"
                aria-label="Cities"
                className="absolute inset-x-0 top-full z-20 mt-2 max-h-72 overflow-y-auto rounded-xl border border-(--explorer-border) bg-white py-1.5 shadow-[0_18px_40px_-16px_rgba(16,42,67,0.45)]"
              >
                {matches.length === 0 ? (
                  <li className="px-4 py-3 text-[13.5px] text-(--explorer-muted)">No city matches “{query.trim()}”.</li>
                ) : (
                  matches.map(({ meta, openings }, i) => (
                    <li key={meta.slug} id={`city-opt-${meta.slug}`} role="option" aria-selected={i === activeIdx}>
                      <Link
                        to={`/jobs/city/${meta.slug}`}
                        onMouseEnter={() => setActiveIdx(i)}
                        className={`flex items-center justify-between gap-3 px-4 py-2 text-[14px] ${i === activeIdx ? 'bg-(--explorer-teal-surface)' : ''}`}
                      >
                        <span className="flex min-w-0 items-center gap-2">
                          <MapPin size={14} className="shrink-0 text-(--explorer-muted)" aria-hidden="true" />
                          <span className="truncate font-bold text-(--explorer-navy)">{meta.city}</span>
                          <span className="truncate text-[12.5px] text-(--explorer-muted)">{meta.state}</span>
                        </span>
                        {liveCities && (
                          <span className="shrink-0 text-[12.5px] font-semibold text-(--explorer-muted)">
                            {openings > 0 ? `${openings.toLocaleString('en-IN')}+` : 0} {openings === 1 ? 'role' : 'roles'}
                          </span>
                        )}
                      </Link>
                    </li>
                  ))
                )}
              </ul>
            )}
          </div>
        </div>
      </header>

      <div className="flex-1 max-w-6xl w-full mx-auto px-6 md:px-10 py-10">
        {loadError && (
          <div className="mb-6 flex flex-col items-center gap-2.5 rounded-xl border border-dashed border-(--explorer-border) bg-white py-8 px-6 text-center">
            <SearchX size={22} className="text-(--explorer-muted)" aria-hidden="true" />
            <p className="text-[13.5px] text-(--explorer-muted)">Couldn't load live opening counts right now.</p>
            <ExplorerButton size="sm" onClick={() => setRetryToken((n) => n + 1)}>
              <RotateCw size={13} aria-hidden="true" /> Retry
            </ExplorerButton>
          </div>
        )}

        <Reveal direction="up" duration={0.5} className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {visibleCities.map(({ meta, openings }) => (
            <Link
              key={meta.slug}
              to={`/jobs/city/${meta.slug}`}
              aria-label={`Explore jobs in ${meta.city}`}
              className="group relative block h-[170px] overflow-hidden rounded-2xl shadow-[0_14px_32px_-18px_rgba(16,42,67,0.4)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-(--explorer-blue)"
            >
              <CityVisual city={meta.city} landmark={meta.landmark} imageUrl={meta.imageUrl} zoomOnHover />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/15 to-transparent" aria-hidden="true" />
              <div className="absolute inset-x-0 bottom-0 p-3.5">
                <p className="flex items-center gap-1 text-[10.5px] font-bold uppercase tracking-wide text-white/80">
                  <MapPin size={11} className="shrink-0" aria-hidden="true" />
                  {meta.state}
                </p>
                <h2 className="mt-0.5 text-[17px] font-black leading-tight tracking-tight text-white">{meta.city}</h2>
                {liveCities && (
                  <p className="mt-1 flex items-center gap-1 text-[12.5px] font-bold text-white/90">
                    {openings > 0 ? `${openings.toLocaleString('en-IN')}+` : 0} open {openings === 1 ? 'role' : 'roles'}
                    <ArrowRight size={12} className="motion-safe:transition-transform motion-safe:duration-300 group-hover:translate-x-1" aria-hidden="true" />
                  </p>
                )}
              </div>
            </Link>
          ))}
        </Reveal>
      </div>

      <Footer />
    </div>
  )
}
