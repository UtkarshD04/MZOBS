import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, ArrowRight, MapPin, SearchX, RotateCw } from 'lucide-react'
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
          {cities.map(({ meta, openings }) => (
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
