import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { Search, MapPin, ChevronDown, SlidersHorizontal, X, ArrowRight, ArrowUpRight, ShieldCheck, Sparkles, Loader2, RotateCw, SearchX } from 'lucide-react'
import Reveal from '../../ui/Reveal'
import { StaggerGroup, StaggerItem } from '../../ui/Stagger'
import { CompanyMark } from './jobCardPrimitives'
import LocationConsentDialog from '../../ui/LocationConsentDialog'
import MarketplaceFilters from './MarketplaceFilters'
import { fetchLatestJobs, fetchJobFacets } from '../../../lib/publicJobs'
import {
  MARKETPLACE_DEFAULTS,
  SORT_CHOICES,
  DEPARTMENT_CHOICES,
  countMarketplaceFilters,
  filterParams,
  listParams,
  marketplaceChips,
  toggleIn,
} from '../../../lib/marketplaceFilters'

// ============================================================
// Real data — every job/count here comes from Backend's GET /api/jobs (see
// fetchLatestJobs, the exact same feed LatestJobs.jsx/CityJobs.jsx use), not
// a hardcoded list. Filter option lists (job type, work mode, experience,
// salary, category/track) are the same shared constants the rest of the
// site's filtering already uses (lib/jobFilters.js), so a value picked here
// means the same thing Backend expects — no separate demo taxonomy.
// ============================================================
const CATEGORIES = [{ key: '', label: 'All' }, ...DEPARTMENT_CHOICES.map((o) => ({ key: o.value, label: o.label }))]
const RESULTS_LIMIT = 12

// Soft, desaturated tones a card can land on — cycled by grid position (not
// random, not per-company hash) so the alternation reads as a deliberate
// system. Kept fixed/light regardless of OS theme, matching the rest of
// this redesigned home page's --explorer-* palette.
const CARD_TONES = [
  { bg: '#EAF2FE', border: '#D3E4FC' }, // soft blue
  { bg: '#E8F7F1', border: '#CBEADD' }, // soft mint
  { bg: '#FDF0E6', border: '#F6DDC3' }, // warm peach
  { bg: '#F1EEFC', border: '#DDD2F7' }, // muted lavender
  { bg: '#FBF7EF', border: '#EEE2C9' }, // soft cream
]

// A job earns a tag only when it has something real to say — freshly
// posted (Backend's own postedDaysAgo) or a verified employer
// (Company.verificationStatus, same signal VerifiedMark uses elsewhere on
// this page) — never an invented "urgent"/applicant-count claim.
function StatusTag({ job }) {
  const reduceMotion = useReducedMotion()
  const isRecent = job.postedDaysAgo != null && job.postedDaysAgo <= 1
  if (!isRecent && !job.verified) return null
  const label = isRecent ? (job.postedDaysAgo === 0 ? 'Posted today' : 'New') : 'Verified employer'
  const dot = isRecent ? 'bg-(--explorer-blue)' : 'bg-(--explorer-teal)'
  const text = isRecent ? 'text-(--explorer-blue)' : 'text-(--explorer-teal)'

  return (
    <span className={`inline-flex items-center gap-1.5 text-[11px] font-black uppercase tracking-wide ${text}`}>
      <span className="relative flex items-center justify-center w-1.5 h-1.5">
        {/* A slow, barely-there breathing ring — not Tailwind's default 1s
            ping, which reads as busy rather than "alive". ~3s cycle, low
            amplitude. */}
        {!reduceMotion && (
          <motion.span
            className={`absolute inset-0 rounded-full ${dot}`}
            animate={{ scale: [1, 2.1, 1], opacity: [0.55, 0, 0.55] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            aria-hidden="true"
          />
        )}
        <span className={`relative w-1.5 h-1.5 rounded-full ${dot}`} aria-hidden="true" />
      </span>
      {!isRecent && <ShieldCheck size={11} aria-hidden="true" />}
      {label}
    </span>
  )
}

function JobCard({ job, tone, onOpen }) {
  return (
    <button
      type="button"
      onClick={onOpen}
      className="job-card-sheen group relative w-full h-full min-w-0 text-left flex flex-col rounded-2xl border p-5 motion-safe:transition-[transform,box-shadow,filter] motion-safe:duration-300 motion-safe:hover:-translate-y-1 hover:shadow-[0_20px_38px_-20px_rgba(22,50,79,0.32),inset_0_0_0_1px_rgba(22,50,79,0.14)] motion-safe:hover:brightness-[1.03] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--explorer-blue)"
      style={{ backgroundColor: tone.bg, borderColor: tone.border }}
    >
      <div className="flex items-start justify-between gap-3">
        <span className="motion-safe:transition-transform motion-safe:duration-300 group-hover:scale-[1.03]">
          <CompanyMark company={job.company} logo={job.logo} size="sm" tone="bg-white text-(--explorer-navy)" />
        </span>
        <StatusTag job={job} />
      </div>

      <p className="mt-3 text-[12px] font-bold text-(--explorer-navy)/70 truncate">{job.company}</p>
      <h3 className="mt-0.5 text-[16px] font-extrabold text-(--explorer-navy) leading-snug text-balance">{job.title}</h3>

      <p className="mt-2 flex items-center gap-1 text-[12.5px] text-(--explorer-navy)/70">
        <MapPin size={12} className="shrink-0" aria-hidden="true" />
        <span className="truncate">{job.location}</span>
      </p>

      <p className="mt-2 text-[15px] font-black text-(--explorer-navy)">{job.salary || 'Not disclosed'}</p>

      <div className="mt-2.5 flex flex-wrap gap-1.5 text-[11px] font-bold text-(--explorer-navy)/80">
        {job.employmentType && <span className="px-2 py-0.5 rounded-full bg-white/70">{job.employmentType}</span>}
        {job.workMode && <span className="px-2 py-0.5 rounded-full bg-white/70">{job.workMode}</span>}
        {job.experience && <span className="px-2 py-0.5 rounded-full bg-white/70">{job.experience}</span>}
      </div>

      <div className="mt-auto pt-4 flex items-center justify-end">
        <span className="inline-flex items-center gap-1 text-[12.5px] font-black text-(--explorer-navy) opacity-70 group-hover:opacity-100 motion-safe:transition-[opacity,transform] motion-safe:duration-300">
          View details
          <ArrowRight size={13} className="motion-safe:transition-transform motion-safe:duration-300 group-hover:translate-x-1" aria-hidden="true" />
        </span>
      </div>
    </button>
  )
}

function FeaturedJobTile({ job, tone, onOpen }) {
  const reduceMotion = useReducedMotion()
  return (
    <button
      type="button"
      onClick={onOpen}
      className="job-card-sheen group relative w-full h-full min-w-0 text-left flex flex-col justify-between rounded-2xl border p-6 sm:p-7 motion-safe:transition-[transform,box-shadow,filter] motion-safe:duration-300 motion-safe:hover:-translate-y-1.5 hover:shadow-[0_26px_52px_-22px_rgba(22,50,79,0.36),inset_0_0_0_1px_rgba(22,50,79,0.16)] motion-safe:hover:brightness-[1.025] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--explorer-blue)"
      style={{ backgroundColor: tone.bg, borderColor: tone.border }}
    >
      {/* One-time highlight sweep, fired once as the card settles into
          place — not a hover effect, and never repeats. */}
      {!reduceMotion && (
        <motion.span
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 left-0 w-1/4"
          style={{ background: 'linear-gradient(100deg, transparent, rgba(255,255,255,0.5), transparent)' }}
          initial={{ x: '-140%' }}
          whileInView={{ x: '480%' }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.9, delay: 0.6, ease: 'easeInOut' }}
        />
      )}
      <div>
        <div className="flex items-start justify-between gap-3">
          <span className="inline-flex items-center gap-1.5 text-[10.5px] font-black uppercase tracking-wide text-(--explorer-navy)/70">
            <Sparkles size={12} className="text-(--explorer-gold-hover)" aria-hidden="true" /> Featured opportunity
          </span>
          <StatusTag job={job} />
        </div>

        <div className="mt-4 flex items-center gap-3">
          <span className="motion-safe:transition-transform motion-safe:duration-300 group-hover:scale-[1.05]">
            <CompanyMark company={job.company} logo={job.logo} size="lg" tone="bg-white text-(--explorer-navy)" />
          </span>
          <div className="min-w-0">
            <p className="text-[12.5px] font-bold text-(--explorer-navy)/70 truncate">{job.company}</p>
            <h3 className="text-[21px] sm:text-[24px] font-black text-(--explorer-navy) leading-snug text-balance">{job.title}</h3>
          </div>
        </div>

        <p className="mt-3 flex items-center gap-1 text-[13px] text-(--explorer-navy)/70">
          <MapPin size={13} className="shrink-0" aria-hidden="true" />
          {job.location}
        </p>
        <p className="mt-1.5 text-[22px] font-black text-(--explorer-navy)">{job.salary || 'Not disclosed'}</p>

        {job.description && <p className="mt-3 text-[13.5px] text-(--explorer-navy)/75 leading-relaxed max-w-md">{job.description}</p>}

        <div className="mt-4 flex flex-wrap gap-1.5 text-[11px] font-bold text-(--explorer-navy)/80">
          {job.employmentType && <span className="px-2.5 py-1 rounded-full bg-white/70">{job.employmentType}</span>}
          {job.workMode && <span className="px-2.5 py-1 rounded-full bg-white/70">{job.workMode}</span>}
          {job.experience && <span className="px-2.5 py-1 rounded-full bg-white/70">{job.experience}</span>}
        </div>
      </div>

      <div className="mt-6 pt-5 border-t border-white/50 flex items-center justify-between">
        <span className="inline-flex items-center gap-1.5 text-[13.5px] font-black text-(--explorer-navy)">
          View opportunity
          <ArrowUpRight size={15} className="motion-safe:transition-transform motion-safe:duration-300 group-hover:translate-x-1 group-hover:-translate-y-0.5" aria-hidden="true" />
        </span>
      </div>
    </button>
  )
}

function JobCardSkeleton() {
  return (
    <div className="rounded-2xl border border-(--explorer-border) bg-white p-5 animate-pulse flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <div className="w-9 h-9 rounded-xl bg-(--explorer-bg)" />
        <div className="w-14 h-2.5 rounded bg-(--explorer-bg)" />
      </div>
      <div className="h-2.5 w-1/2 rounded bg-(--explorer-bg)" />
      <div className="h-4 w-3/4 rounded bg-(--explorer-bg)" />
      <div className="h-2.5 w-1/3 rounded bg-(--explorer-bg)" />
      <div className="h-4 w-1/2 rounded bg-(--explorer-bg) mt-1" />
    </div>
  )
}

function FeaturedJobTileSkeleton() {
  return (
    <div className="sm:col-span-2 sm:row-span-2 rounded-2xl border border-(--explorer-border) bg-white p-7 animate-pulse flex flex-col gap-4">
      <div className="h-2.5 w-32 rounded bg-(--explorer-bg)" />
      <div className="flex items-center gap-3">
        <div className="w-14 h-14 rounded-2xl bg-(--explorer-bg)" />
        <div className="flex-1 flex flex-col gap-2">
          <div className="h-2.5 w-1/3 rounded bg-(--explorer-bg)" />
          <div className="h-5 w-2/3 rounded bg-(--explorer-bg)" />
        </div>
      </div>
      <div className="h-2.5 w-1/4 rounded bg-(--explorer-bg)" />
      <div className="h-6 w-1/3 rounded bg-(--explorer-bg)" />
    </div>
  )
}

export default function JobMarketplace() {
  const navigate = useNavigate()
  const reduceMotion = useReducedMotion()

  const [search, setSearch] = useState('')
  const [sort, setSort] = useState('newest')
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)
  const [filterState, setFilterState] = useState(MARKETPLACE_DEFAULTS)
  const [facets, setFacets] = useState(null)

  // "Nearest to me": we ask (in our own dialog) BEFORE the browser prompt.
  const [coords, setCoords] = useState(null)
  const [consentOpen, setConsentOpen] = useState(false)
  const [locating, setLocating] = useState(false)
  const [locationNotice, setLocationNotice] = useState('')

  const [jobs, setJobs] = useState([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [loadMoreError, setLoadMoreError] = useState(false)
  const [loadError, setLoadError] = useState(false)
  const [retryToken, setRetryToken] = useState(0)

  // Company chips need a name, and a selected company must keep its name even
  // if a later facet response no longer lists it.
  const companyNames = useRef(new Map())
  facets?.companies?.forEach((c) => companyNames.current.set(c.id, c.name))

  const activeFilterCount = countMarketplaceFilters(filterState)
  const chips = marketplaceChips(filterState, { companyNameOf: (id) => companyNames.current.get(id) })

  function clearFilters() {
    setFilterState(MARKETPLACE_DEFAULTS)
  }

  function handleSortChange(next) {
    setLocationNotice('')
    if (next !== 'nearest' || coords) {
      setSort(next)
      return
    }
    setConsentOpen(true)
  }

  function allowLocation() {
    setConsentOpen(false)
    if (!navigator.geolocation) {
      setLocationNotice('Your browser doesn\u2019t support location, so jobs can\u2019t be sorted by distance.')
      return
    }
    setLocating(true)
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCoords({ lat: position.coords.latitude, lng: position.coords.longitude })
        setSort('nearest')
        setLocating(false)
      },
      (err) => {
        setLocating(false)
        setLocationNotice(
          err.code === 1
            ? 'Location permission was denied. Allow it in your browser settings to sort jobs by distance.'
            : 'We couldn\u2019t get your location just now. Please try again.'
        )
      },
      { timeout: 10000, maximumAge: 5 * 60 * 1000 }
    )
  }

  // Real fetch, debounced the same way LatestJobs.jsx debounces its own —
  // every control here (department tabs, search box, sort, sidebar filters)
  // maps straight onto Backend's GET /api/jobs query params.
  useEffect(() => {
    let cancelled = false
    const controller = new AbortController()
    setLoadError(false)
    setLoadMoreError(false)

    const timer = setTimeout(() => {
      fetchLatestJobs(listParams(filterState, { search, sort, coords, limit: RESULTS_LIMIT, page: 1 }), { signal: controller.signal })
        .then(({ jobs: fetchedJobs, total: fetchedTotal }) => {
          if (cancelled) return
          setJobs(fetchedJobs)
          setTotal(fetchedTotal)
          setPage(1)
        })
        .catch((err) => {
          if (cancelled || err?.name === 'AbortError') return
          setJobs([])
          setTotal(0)
          setLoadError(true)
        })
        .finally(() => {
          if (!cancelled) setLoading(false)
        })
    }, 250)

    return () => {
      cancelled = true
      clearTimeout(timer)
      controller.abort()
    }
  }, [search, sort, coords, filterState, retryToken])

  // Live counts next to every option. Best-effort: if this fails the filters
  // still work, they just show no numbers.
  useEffect(() => {
    let cancelled = false
    const controller = new AbortController()
    const timer = setTimeout(() => {
      fetchJobFacets(filterParams(filterState, search), { signal: controller.signal })
        .then((data) => !cancelled && setFacets(data))
        .catch(() => {})
    }, 250)
    return () => {
      cancelled = true
      clearTimeout(timer)
      controller.abort()
    }
  }, [search, filterState, retryToken])

  async function loadMore() {
    const nextPage = page + 1
    setLoadingMore(true)
    setLoadMoreError(false)
    try {
      const { jobs: more } = await fetchLatestJobs(listParams(filterState, { search, sort, coords, limit: RESULTS_LIMIT, page: nextPage }))
      setJobs((prev) => [...prev, ...more.filter((j) => !prev.some((p) => p.id === j.id))])
      setPage(nextPage)
    } catch {
      setLoadMoreError(true)
    } finally {
      setLoadingMore(false)
    }
  }

  const hasMore = jobs.length < total

  const featured = jobs[0]
  const restJobs = jobs.slice(1)
  const showInitialLoading = loading && jobs.length === 0 && !loadError
  const showError = !loading && loadError
  const showEmpty = !loading && !loadError && jobs.length === 0

  function openJob(job) {
    // Same route/shape every other job surface on this page already uses
    // (FeaturedJobCard/CompactJobRow → /jobs/:id with the real object in
    // router state) — this is real data, not a parallel demo path.
    navigate(`/jobs/${job.id ?? encodeURIComponent(job.title)}`, { state: { job } })
  }

  return (
    <section id="latest-jobs" className="hero-afterglow-faint relative py-16 md:py-20 px-6 md:px-10 scroll-mt-20">
      <div className="max-w-[1400px] mx-auto">
        {/* Heading — the hero's handoff into an actual marketplace */}
        <Reveal direction="up" duration={0.6} className="max-w-2xl">
          <motion.span
            initial={reduceMotion ? false : { scaleY: 0 }}
            whileInView={{ scaleY: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="block w-px h-8 mb-4 origin-top"
            style={{ backgroundImage: 'linear-gradient(180deg, transparent, var(--explorer-blue-border))' }}
            aria-hidden="true"
          />
          <span className="inline-flex items-center gap-1.5 text-[11.5px] font-black uppercase tracking-wide text-(--explorer-teal)">
            <span className="relative flex items-center justify-center w-1.5 h-1.5">
              <span className="absolute inset-0 rounded-full bg-(--explorer-teal) motion-safe:animate-ping opacity-60" aria-hidden="true" />
              <span className="relative w-1.5 h-1.5 rounded-full bg-(--explorer-teal)" aria-hidden="true" />
            </span>
            Hiring now
          </span>
          <h2 className="mt-2.5 text-[32px] sm:text-[42px] font-black leading-[1.05] tracking-tight text-balance">
            <span className="block text-(--explorer-navy)">Find your next</span>
            <span
              className="block"
              style={{ backgroundImage: 'var(--hero-cta-gradient)', WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent' }}
            >
              opportunity.
            </span>
          </h2>
          <p className="mt-3 text-[15px] text-(--explorer-navy)/75 leading-relaxed">Explore fresh roles from companies hiring across India.</p>
        </Reveal>

        {/* Category navigation — editorial, underlined, not pills */}
        <Reveal direction="up" duration={0.5} delay={0.05} className="mt-8 careers-scroll-x overflow-x-auto -mx-1 px-1">
          <div className="flex items-center gap-5 sm:gap-6 border-b border-(--explorer-border) min-w-max">
            {CATEGORIES.map((c) => {
              // "All" means no department filter; every other tab toggles its department
              // (several can be on at once, same as the sidebar's Department list).
              const active = c.key ? filterState.tracks.includes(c.key) : filterState.tracks.length === 0
              return (
                <button
                  key={c.key || 'all'}
                  type="button"
                  onClick={() => setFilterState((prev) => ({ ...prev, tracks: c.key ? toggleIn(prev.tracks, c.key) : [] }))}
                  aria-pressed={active}
                  className={`relative shrink-0 pb-3 text-[13.5px] font-bold whitespace-nowrap motion-safe:transition-colors motion-safe:duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--explorer-blue) ${
                    active ? 'text-(--explorer-navy)' : 'text-(--explorer-muted) hover:text-(--explorer-navy)'
                  }`}
                >
                  {c.label}
                  {active && (
                    <span
                      className="absolute left-0 right-0 -bottom-px h-[2.5px] rounded-full"
                      style={{ backgroundImage: 'var(--hero-cta-gradient)' }}
                      aria-hidden="true"
                    />
                  )}
                </button>
              )
            })}
          </div>
        </Reveal>

        {/* Main composition: filter sidebar + marketplace */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-[21%_1fr] gap-8">
          {/* Desktop sidebar — slides in from -20px, settles, then goes fully
              static (no lingering motion once revealed). */}
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
            className="hidden lg:block"
          >
            <div className="sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto overscroll-contain rounded-2xl border border-(--explorer-border) bg-white p-6">
              <MarketplaceFilters state={filterState} setState={setFilterState} facets={facets} activeCount={activeFilterCount} onClear={clearFilters} />
            </div>
          </motion.div>

          {/* Mobile filter trigger */}
          <div className="lg:hidden -mt-2">
            <button
              type="button"
              onClick={() => setMobileFiltersOpen(true)}
              className="inline-flex items-center gap-2 h-10 px-4 rounded-full border border-(--explorer-border) bg-white text-[13.5px] font-bold text-(--explorer-navy) shadow-[0_1px_2px_rgba(16,42,67,0.04)]"
            >
              <SlidersHorizontal size={15} aria-hidden="true" /> Filter jobs
              {activeFilterCount > 0 && (
                <span className="flex items-center justify-center w-5 h-5 rounded-full bg-(--explorer-blue) text-white text-[10.5px] font-bold">
                  {activeFilterCount}
                </span>
              )}
            </button>
          </div>

          <div className="min-w-0">
            {/* Header: total + search + sort */}
            <Reveal direction="up" duration={0.5} delay={0.1} className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 mb-6">
              <div className="shrink-0">
                <p className="text-[10.5px] font-black uppercase tracking-wide text-(--explorer-muted)">Total jobs</p>
                <p className="flex items-center gap-2 text-[22px] font-black text-(--explorer-navy) leading-none mt-0.5">
                  {total} <span className="text-[14px] font-bold text-(--explorer-muted)">opportunities</span>
                  {loading && jobs.length > 0 && <Loader2 size={14} className="animate-spin text-(--explorer-muted)" aria-hidden="true" />}
                </p>
              </div>

              <div className="relative flex-1 min-w-0">
                <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-(--explorer-muted)" aria-hidden="true" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search jobs, skills or companies..."
                  className="w-full h-10 pl-10 pr-4 rounded-full border border-(--explorer-border) bg-white text-[13.5px] text-(--explorer-navy) outline-none focus:border-(--explorer-blue) focus:ring-3 focus:ring-(--explorer-blue)/12 transition-colors"
                />
              </div>

              <div className="relative shrink-0">
                <select
                  value={sort}
                  onChange={(e) => handleSortChange(e.target.value)}
                  disabled={locating}
                  aria-label="Sort jobs"
                  className="h-10 pl-4 pr-9 rounded-full border border-(--explorer-border) bg-white text-[13px] font-bold text-(--explorer-navy) outline-none appearance-none cursor-pointer focus:border-(--explorer-blue) focus:ring-3 focus:ring-(--explorer-blue)/12 transition-colors"
                >
                  {SORT_CHOICES.map((opt) => (
                    <option key={opt.key} value={opt.key}>
                      Sort: {opt.key === 'nearest' && locating ? 'Locating\u2026' : opt.label}
                    </option>
                  ))}
                </select>
                <ChevronDown size={13} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-(--explorer-muted) pointer-events-none" aria-hidden="true" />
              </div>
            </Reveal>

            {locationNotice && (
              <p role="status" className="mb-4 rounded-xl border border-(--explorer-border) bg-(--explorer-bg) px-4 py-3 text-[13px] text-(--explorer-navy)">
                {locationNotice}
              </p>
            )}

            {/* Everything applied, each removable with one click */}
            {chips.length > 0 && (
              <div className="mb-5 flex flex-wrap items-center gap-2" aria-label="Applied filters">
                {chips.map((chip) => (
                  <button
                    key={chip.id}
                    type="button"
                    onClick={() => setFilterState((prev) => chip.clear(prev))}
                    aria-label={`Remove filter ${chip.label}`}
                    className="inline-flex items-center gap-1.5 h-8 pl-3 pr-2.5 rounded-full border border-(--explorer-blue-border) bg-(--explorer-blue-surface) text-[12.5px] font-semibold text-(--explorer-blue) hover:bg-white transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--explorer-blue)"
                  >
                    {chip.label}
                    <X size={12} aria-hidden="true" />
                  </button>
                ))}
                <button type="button" onClick={clearFilters} className="text-[12.5px] font-bold text-(--explorer-muted) hover:text-(--explorer-navy) transition-colors ml-1">
                  Clear all
                </button>
              </div>
            )}

            {/* Grid */}
            {showError ? (
              <div className="flex flex-col items-center justify-center gap-2.5 rounded-2xl border border-dashed border-(--explorer-border) py-16 px-6 text-center">
                <SearchX size={26} className="text-(--explorer-muted)" aria-hidden="true" />
                <p className="text-[15px] font-bold text-(--explorer-navy)">Couldn't load jobs right now</p>
                <p className="text-[13.5px] text-(--explorer-muted) max-w-sm">There was a problem reaching the jobs feed. Check your connection and try again.</p>
                <button
                  type="button"
                  onClick={() => setRetryToken((n) => n + 1)}
                  className="mt-1.5 inline-flex items-center gap-1.5 h-9 px-4 rounded-full text-white text-[13px] font-bold"
                  style={{ backgroundImage: 'var(--hero-cta-gradient)' }}
                >
                  <RotateCw size={14} aria-hidden="true" /> Retry
                </button>
              </div>
            ) : showInitialLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                <FeaturedJobTileSkeleton />
                {Array.from({ length: 6 }).map((_, i) => (
                  <JobCardSkeleton key={i} />
                ))}
              </div>
            ) : showEmpty ? (
              <div className="flex flex-col items-center justify-center gap-2.5 rounded-2xl border border-dashed border-(--explorer-border) py-16 px-6 text-center">
                <SearchX size={26} className="text-(--explorer-muted)" aria-hidden="true" />
                <p className="text-[15px] font-bold text-(--explorer-navy)">No roles match these filters</p>
                <p className="text-[13.5px] text-(--explorer-muted) max-w-sm">Try clearing a filter or searching a different keyword.</p>
                <button
                  type="button"
                  onClick={clearFilters}
                  className="mt-1.5 inline-flex items-center gap-1.5 h-9 px-4 rounded-full text-white text-[13px] font-bold"
                  style={{ backgroundImage: 'var(--hero-cta-gradient)' }}
                >
                  Clear all filters
                </button>
              </div>
            ) : (
              <AnimatePresence mode="wait">
                <motion.div
                  key={`${sort}-${search}-${JSON.stringify(filterState)}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <StaggerGroup className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4" staggerDelay={0.08}>
                    {featured && (
                      <StaggerItem y={20} scale={1} duration={0.5} className="sm:col-span-2 sm:row-span-2">
                        <FeaturedJobTile job={featured} tone={CARD_TONES[0]} onOpen={() => openJob(featured)} />
                      </StaggerItem>
                    )}
                    {restJobs.map((job, i) => (
                      <StaggerItem key={job.id ?? `${job.title}-${job.company}`} y={20} scale={1} duration={0.45}>
                        <JobCard job={job} tone={CARD_TONES[(i + 1) % CARD_TONES.length]} onOpen={() => openJob(job)} />
                      </StaggerItem>
                    ))}
                  </StaggerGroup>
                </motion.div>
              </AnimatePresence>
            )}

            {!showError && !showEmpty && !showInitialLoading && hasMore && (
              <div className="mt-8 flex flex-col items-center gap-2">
                <button
                  type="button"
                  onClick={loadMore}
                  disabled={loadingMore}
                  className="inline-flex items-center gap-2 h-11 px-6 rounded-full border border-(--explorer-border) bg-white text-[13.5px] font-bold text-(--explorer-navy) hover:border-(--explorer-blue-border) hover:text-(--explorer-blue) transition-colors disabled:opacity-60"
                >
                  {loadingMore ? <Loader2 size={15} className="animate-spin" aria-hidden="true" /> : null}
                  {loadingMore ? 'Loading\u2026' : `Show more jobs (${total - jobs.length} left)`}
                </button>
                {loadMoreError && <p className="text-[12.5px] text-(--explorer-muted)">Couldn&rsquo;t load more jobs. Please try again.</p>}
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Mobile filter drawer */}
      <AnimatePresence>
        {mobileFiltersOpen && (
          <motion.div className="fixed inset-0 z-50 lg:hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
            <div className="absolute inset-0 bg-(--explorer-navy)/40 backdrop-blur-[2px]" onClick={() => setMobileFiltersOpen(false)} />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="absolute inset-y-0 left-0 w-[86%] max-w-sm bg-white p-6 overflow-y-auto shadow-[0_0_60px_rgba(0,0,0,0.25)]"
            >
              <div className="flex items-center justify-between mb-6">
                <p className="text-[15px] font-black text-(--explorer-navy)">Filter jobs</p>
                <button
                  type="button"
                  onClick={() => setMobileFiltersOpen(false)}
                  className="flex items-center justify-center w-9 h-9 rounded-full bg-(--explorer-bg) text-(--explorer-navy)"
                  aria-label="Close filters"
                >
                  <X size={16} aria-hidden="true" />
                </button>
              </div>
              <MarketplaceFilters state={filterState} setState={setFilterState} facets={facets} activeCount={activeFilterCount} onClear={clearFilters} />
              <button
                type="button"
                onClick={() => setMobileFiltersOpen(false)}
                className="mt-8 w-full h-11 rounded-full text-white text-[14px] font-bold"
                style={{ backgroundImage: 'var(--hero-cta-gradient)' }}
              >
                Show {total} opportunities
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <LocationConsentDialog open={consentOpen} onAllow={allowLocation} onCancel={() => setConsentOpen(false)} />
    </section>
  )
}
