import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, MapPin, ShieldCheck, TrendingUp, SearchX, RotateCw } from 'lucide-react'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import Seo from '../components/Seo'
import Reveal from '../components/ui/Reveal'
import ExplorerButton, { ExplorerTextLink } from '../components/ui/ExplorerButton'
import CountUp from '../components/ui/CountUp'
import FeaturedJobCard, { FeaturedJobCardSkeleton } from '../components/sections/home/FeaturedJobCard'
import CompactJobRow, { CompactJobRowSkeleton } from '../components/sections/home/CompactJobRow'
import { CityVisual } from '../components/sections/home/HotJobsByCity'
import { HOT_CITIES_DATA } from '../lib/content'
import { fetchHotCities, fetchLatestJobs } from '../lib/publicJobs'
import { formatSalaryRange } from '../lib/formatCurrency'

const JOBS_LIMIT = 20
const MAX_COMPACT_ROWS = 6

export default function CityJobs() {
  const { citySlug } = useParams()
  const navigate = useNavigate()

  const city = HOT_CITIES_DATA.cities.find((c) => c.slug === citySlug)
  const [activeFilter, setActiveFilter] = useState('all')

  const [statsBySlug, setStatsBySlug] = useState(null) // the whole hot-cities response, keyed by slug
  const [statsError, setStatsError] = useState(false)
  const [statsRetryToken, setStatsRetryToken] = useState(0)

  const [jobs, setJobs] = useState([])
  const [jobsTotal, setJobsTotal] = useState(0)
  const [jobsLoading, setJobsLoading] = useState(true)
  const [jobsError, setJobsError] = useState(false)
  const [jobsRetryToken, setJobsRetryToken] = useState(0)

  useEffect(() => {
    if (!city) return
    let cancelled = false
    const controller = new AbortController()
    setStatsError(false)
    fetchHotCities({ signal: controller.signal })
      .then((data) => {
        if (cancelled) return
        setStatsBySlug(new Map(data.cities.map((c) => [c.slug, c])))
      })
      .catch((err) => {
        if (!cancelled && err?.name !== 'AbortError') setStatsError(true)
      })
    return () => {
      cancelled = true
      controller.abort()
    }
  }, [city, statsRetryToken])

  useEffect(() => {
    if (!city) return
    let cancelled = false
    const controller = new AbortController()
    setJobsLoading(true)
    setJobsError(false)
    fetchLatestJobs(
      { location: city.city, track: activeFilter !== 'all' ? activeFilter : undefined, limit: JOBS_LIMIT, sort: 'newest' },
      { signal: controller.signal }
    )
      .then(({ jobs: fetchedJobs, total }) => {
        if (cancelled) return
        setJobs(fetchedJobs)
        setJobsTotal(total)
      })
      .catch((err) => {
        if (cancelled || err?.name === 'AbortError') return
        setJobs([])
        setJobsTotal(0)
        setJobsError(true)
      })
      .finally(() => {
        if (!cancelled) setJobsLoading(false)
      })
    return () => {
      cancelled = true
      controller.abort()
    }
  }, [city, activeFilter, jobsRetryToken])

  const stats = statsBySlug?.get(citySlug)?.byFilter?.[activeFilter]

  function openJob(job) {
    navigate(`/jobs/${job.id ?? encodeURIComponent(job.title)}`, { state: { job } })
  }

  const featuredJob = jobs[0]
  const compactJobs = jobs.slice(1, 1 + MAX_COMPACT_ROWS)
  const seoTitle = city ? `${city.city} Jobs — Verified Openings Hiring Now | Mzobs` : 'City Jobs — Mzobs'
  const seoDescription = city
    ? `Browse verified job openings in ${city.city}. Real employers, screened listings, updated as new requirements come in.`
    : 'Browse verified job openings by city on Mzobs.'

  return (
    <div className="min-h-screen bg-(--explorer-bg) flex flex-col">
      <Seo path={`/jobs/city/${citySlug}`} title={seoTitle} description={seoDescription} noindex={!city} />
      <Navbar />

      {!city ? (
        <div className="flex-1 max-w-3xl w-full mx-auto px-6 pt-28 pb-16 text-center">
          <SearchX size={26} className="mx-auto text-(--explorer-muted)" aria-hidden="true" />
          <p className="mt-3 text-[15px] font-bold text-(--explorer-navy)">This city isn't on Mzobs yet</p>
          <ExplorerTextLink to="/#hot-jobs-by-city" className="mt-3 justify-center">
            Back to Hot Jobs by City
          </ExplorerTextLink>
        </div>
      ) : (
        <>
          {/* Hero — same premium visual band idiom as the homepage card (real
              landmark photo, same dark gradient), at hero scale, with a
              staggered entrance (see plan: a true cross-route shared-element
              morph is fragile given App.jsx's page-transition wrapper, so
              this is a deliberate, polished "arrival" animation instead).
              Carrying the same photo through from the card keeps the city's
              visual identity consistent across the click-through. */}
          <Reveal direction="up" duration={0.6} className="relative overflow-hidden">
            <div className="relative h-[220px] sm:h-[260px] overflow-hidden">
              <CityVisual city={city.city} landmark={city.landmark} imageUrl={city.imageUrl} zoomOnHover={false} eager />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/25 to-black/10" />
              <div className="relative z-10 max-w-5xl mx-auto h-full px-6 md:px-10 pt-24 pb-6 flex flex-col justify-end">
                <ExplorerTextLink to="/#hot-jobs-by-city" arrow={false} className="text-white/85 hover:text-white w-fit mb-4">
                  <ArrowLeft size={14} aria-hidden="true" /> Back to Hot Jobs by City
                </ExplorerTextLink>
                <div className="flex items-center gap-1.5 text-white/80 text-[13px] font-semibold mb-1.5">
                  <MapPin size={13} aria-hidden="true" /> {city.state}
                </div>
                <h1 className="text-[32px] sm:text-[42px] font-black text-white tracking-tight leading-none">{city.city}</h1>
                {city.imageAttribution && (
                  <p className="mt-3 text-[10.5px] font-medium text-white/55">
                    {city.landmark} — Photo: {city.imageAttribution}
                  </p>
                )}
              </div>
            </div>
          </Reveal>

          <div className="flex-1 max-w-5xl w-full mx-auto px-6 md:px-10 py-8">
            {/* Stats strip */}
            {statsError ? (
              <div className="mb-8 flex flex-col items-center gap-2.5 rounded-xl border border-dashed border-(--explorer-border) bg-white py-8 px-6 text-center">
                <p className="text-[13.5px] text-(--explorer-muted)">Couldn't load hiring stats for {city.city} right now.</p>
                <ExplorerButton size="sm" onClick={() => setStatsRetryToken((n) => n + 1)}>
                  <RotateCw size={13} aria-hidden="true" /> Retry
                </ExplorerButton>
              </div>
            ) : (
              <Reveal direction="up" duration={0.5} delay={0.1} className="mb-8 bg-white border border-(--explorer-border) rounded-2xl p-6 sm:p-7">
                {!stats ? (
                  <div className="grid sm:grid-cols-4 gap-6 animate-pulse">
                    {Array.from({ length: 4 }).map((_, i) => (
                      <div key={i} className="h-10 rounded bg-(--explorer-bg)" />
                    ))}
                  </div>
                ) : (
                  <div className="grid sm:grid-cols-4 gap-6">
                    <div>
                      <p className="text-[11px] font-bold uppercase tracking-wide text-(--explorer-muted)">Active openings</p>
                      <CountUp value={stats.openings} suffix="+" className="mt-1 block text-[26px] font-black text-(--explorer-navy)" />
                    </div>
                    <div>
                      <p className="text-[11px] font-bold uppercase tracking-wide text-(--explorer-muted)">Salary range</p>
                      <p className="mt-1 text-[22px] font-black text-(--explorer-navy)">{formatSalaryRange(stats.salaryMin, stats.salaryMax) || '—'}</p>
                    </div>
                    <div>
                      <p className="text-[11px] font-bold uppercase tracking-wide text-(--explorer-muted)">Verified employers</p>
                      <p className="mt-1 text-[22px] font-black text-(--explorer-navy) inline-flex items-center gap-1.5">
                        <ShieldCheck size={17} className="text-(--explorer-teal)" aria-hidden="true" />
                        {stats.verifiedEmployers}
                      </p>
                    </div>
                    <div>
                      <p className="text-[11px] font-bold uppercase tracking-wide text-(--explorer-muted)">This week</p>
                      <p className="mt-1 text-[22px] font-black text-(--explorer-teal) inline-flex items-center gap-1.5">
                        <TrendingUp size={17} aria-hidden="true" />
                        {stats.newThisWeek} new
                      </p>
                    </div>
                  </div>
                )}
                {stats?.topCategories?.length > 0 && (
                  <div className="mt-5 pt-5 border-t border-(--explorer-border) flex flex-wrap gap-1.5">
                    {stats.topCategories.map((c) => (
                      <span key={c} className="text-[11.5px] font-semibold px-2.5 py-1 rounded-full bg-(--explorer-bg) text-(--explorer-muted)">
                        {c}
                      </span>
                    ))}
                  </div>
                )}
              </Reveal>
            )}

            {/* Category filter — same pills/behavior as the homepage section */}
            <div className="careers-scroll-x flex items-center gap-2 overflow-x-auto pb-1 mb-7 -mx-1 px-1">
              {HOT_CITIES_DATA.filters.map((f) => (
                <button
                  key={f.key}
                  type="button"
                  onClick={() => setActiveFilter(f.key)}
                  aria-pressed={activeFilter === f.key}
                  className={`shrink-0 h-9 px-4 rounded-full text-[13px] font-bold whitespace-nowrap transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--explorer-teal) ${
                    activeFilter === f.key
                      ? 'bg-(--explorer-teal) text-white shadow-[0_1px_2px_rgba(11,122,109,0.16),0_10px_20px_-8px_rgba(11,122,109,0.55)]'
                      : 'bg-white/60 backdrop-blur-sm border border-(--explorer-border) text-(--explorer-navy) hover:border-(--explorer-teal-border) hover:bg-(--explorer-teal-surface)/70 hover:text-(--explorer-teal)'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            {/* Real job list — reuses the exact same job-card components as
                the homepage's "Latest jobs" section. */}
            {jobsError ? (
              <div className="flex flex-col items-center justify-center gap-2.5 rounded-xl border border-dashed border-(--explorer-border) bg-white py-16 px-6 text-center">
                <SearchX size={26} className="text-(--explorer-muted)" aria-hidden="true" />
                <p className="text-[15px] font-bold text-(--explorer-navy)">Couldn't load jobs right now</p>
                <ExplorerButton onClick={() => setJobsRetryToken((n) => n + 1)} className="mt-1.5">
                  <RotateCw size={14} aria-hidden="true" /> Retry
                </ExplorerButton>
              </div>
            ) : !jobsLoading && jobs.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-2.5 rounded-xl border border-dashed border-(--explorer-border) bg-white py-16 px-6 text-center">
                <SearchX size={26} className="text-(--explorer-muted)" aria-hidden="true" />
                <p className="text-[15px] font-bold text-(--explorer-navy)">No {activeFilter === 'all' ? '' : 'matching '}openings in {city.city} right now</p>
                <p className="text-[13.5px] text-(--explorer-muted) max-w-sm">Check back soon, or try a different category.</p>
              </div>
            ) : (
              <Reveal
                direction="up"
                duration={0.6}
                delay={0.15}
                className={jobsLoading || compactJobs.length > 0 ? 'grid lg:grid-cols-[58%_1fr] gap-6 lg:gap-7 items-start' : 'grid'}
              >
                {jobsLoading ? <FeaturedJobCardSkeleton /> : featuredJob && <FeaturedJobCard job={featuredJob} onOpen={() => openJob(featuredJob)} />}
                {(jobsLoading || compactJobs.length > 0) && (
                  <div className="min-w-0 flex flex-col gap-3">
                    <p className="text-[11.5px] font-bold uppercase tracking-wide text-(--explorer-muted) px-0.5">
                      {jobsLoading ? 'Loading' : `${jobsTotal} opening${jobsTotal === 1 ? '' : 's'} in ${city.city}`}
                    </p>
                    <div className="flex flex-col gap-2">
                      {jobsLoading
                        ? Array.from({ length: MAX_COMPACT_ROWS }).map((_, i) => <CompactJobRowSkeleton key={i} />)
                        : compactJobs.map((j) => <CompactJobRow key={j.id ?? `${j.title}-${j.company}`} job={j} onOpen={() => openJob(j)} />)}
                    </div>
                  </div>
                )}
              </Reveal>
            )}
          </div>
        </>
      )}

      <Footer />
    </div>
  )
}
