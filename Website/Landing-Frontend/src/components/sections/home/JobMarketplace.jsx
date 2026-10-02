import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { ChevronDown, X, ArrowRight, Loader2, RotateCw, SearchX } from 'lucide-react'
import JobListItem, { JobListItemSkeleton } from '../../mz/JobListItem'
import LocationConsentDialog from '../../ui/LocationConsentDialog'
import MarketplaceFilters from './MarketplaceFilters'
import QuickFilters from './QuickFilters'
import { fetchLatestJobs, fetchJobFacets } from '../../../lib/publicJobs'
import { useInitialHomeData } from '../../../lib/initialHomeDataContext'
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
// fetchLatestJobs) and /api/jobs/facets, not a hardcoded list. Filter option
// lists are the shared constants in lib/jobFilters.js, so a value picked here
// means the same thing Backend expects. The prerender seeds the first page
// with `sort=newest&limit=12`, so the defaults below must stay in step.
// ============================================================
const CATEGORIES = [{ key: '', label: 'All' }, ...DEPARTMENT_CHOICES.map((o) => ({ key: o.value, label: o.label }))]
const RESULTS_LIMIT = 12

// `external` is Home's lifted search ({ q, location, experience, track,
// company }) from the search bar, quick links, category rows and company
// list. Each new value replaces this feed's filters so what the visitor
// picked is exactly what the feed shows.
//
// `selectedId`/`onOpenJob` let Home show a job's full description beside the
// feed on desktop; `onJobsChange` keeps Home's copy of the list current so
// that panel can offer "Next opportunity".
export default function JobMarketplace({ external, selectedId, onOpenJob, onJobsChange }) {
  const reduceMotion = useReducedMotion()

  const [terms, setTerms] = useState([])
  const [sort, setSort] = useState('newest')
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [filterState, setFilterState] = useState(MARKETPLACE_DEFAULTS)
  const [facets, setFacets] = useState(null)
  // The filter panel slides in from the right on desktop and up from the
  // bottom on phones — decided in the same click that opens it, so the very
  // first frame already uses the right layout and animation.
  const [desktopPanel, setDesktopPanel] = useState(false)
  function openFilters() {
    setDesktopPanel(window.matchMedia('(min-width: 1024px)').matches)
    setFiltersOpen(true)
  }

  // Company chips need a name, and a selected company must keep its name even
  // if a later facet response no longer lists it.
  const companyNames = useRef(new Map())
  facets?.companies?.forEach((c) => companyNames.current.set(c.id, c.name))

  const firstExternal = useRef(true)
  useEffect(() => {
    if (firstExternal.current) {
      firstExternal.current = false
      return
    }
    if (!external) return
    ;(external.company ?? []).forEach((c) => companyNames.current.set(c.id, c.name))
    setTerms(external.q ?? [])
    setFilterState({
      ...MARKETPLACE_DEFAULTS,
      location: external.location ?? [],
      experience: external.experience ? [external.experience] : [],
      tracks: external.track ? [external.track] : [],
      company: (external.company ?? []).map((c) => c.id),
    })
  }, [external])

  const withTerms = (params) => ({ ...params, q: terms })

  // "Nearest to me": we ask (in our own dialog) BEFORE the browser prompt.
  const [coords, setCoords] = useState(null)
  const [consentOpen, setConsentOpen] = useState(false)
  const [locating, setLocating] = useState(false)
  const [locationNotice, setLocationNotice] = useState('')

  // Seeded from the build-time prerender fetch (see initialHomeDataContext.js)
  // so the default view never ships empty — the effect below still re-fetches
  // live data right after mount regardless.
  const initialHomeData = useInitialHomeData()
  const [jobs, setJobs] = useState(initialHomeData?.jobs ?? [])
  const [total, setTotal] = useState(initialHomeData?.total ?? 0)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(!initialHomeData)
  const [refreshing, setRefreshing] = useState(false)
  const [loadingMore, setLoadingMore] = useState(false)
  const [loadMoreError, setLoadMoreError] = useState(false)
  const [loadError, setLoadError] = useState(false)
  const [retryToken, setRetryToken] = useState(0)

  const activeFilterCount = countMarketplaceFilters(filterState)
  const chips = [
    ...terms.map((t) => ({ id: `term:${t}`, label: `“${t}”`, clearTerm: t })),
    ...marketplaceChips(filterState, { companyNameOf: (id) => companyNames.current.get(id) }),
  ]

  function clearFilters() {
    setFilterState(MARKETPLACE_DEFAULTS)
    setTerms([])
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
      setLocationNotice('Your browser doesn’t support location, so jobs can’t be sorted by distance.')
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
            : 'We couldn’t get your location just now. Please try again.'
        )
      },
      { timeout: 10000, maximumAge: 5 * 60 * 1000 }
    )
  }

  // Debounced real fetch — every control maps straight onto GET /api/jobs.
  // The first fetch only refreshes the prerendered default list; if it fails,
  // keep showing those real jobs instead of swapping them for an error.
  const refreshingInitial = useRef(Boolean(initialHomeData?.jobs?.length))
  useEffect(() => {
    let cancelled = false
    const controller = new AbortController()
    const keepOnError = refreshingInitial.current
    refreshingInitial.current = false
    setLoadError(false)
    setLoadMoreError(false)
    if (!keepOnError) setRefreshing(true)

    const timer = setTimeout(() => {
      fetchLatestJobs(withTerms(listParams(filterState, { sort, coords, limit: RESULTS_LIMIT, page: 1 })), { signal: controller.signal })
        .then(({ jobs: fetchedJobs, total: fetchedTotal }) => {
          if (cancelled) return
          setJobs(fetchedJobs)
          setTotal(fetchedTotal)
          setPage(1)
        })
        .catch((err) => {
          if (cancelled || err?.name === 'AbortError') return
          if (keepOnError) return
          setJobs([])
          setTotal(0)
          setLoadError(true)
        })
        .finally(() => {
          if (cancelled) return
          setLoading(false)
          setRefreshing(false)
        })
    }, 250)

    return () => {
      cancelled = true
      clearTimeout(timer)
      controller.abort()
    }
    // withTerms reads `terms`, which is listed.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [terms, sort, coords, filterState, retryToken])

  // Live counts next to every filter option. Best-effort: if this fails the
  // filters still work, they just show no numbers.
  useEffect(() => {
    let cancelled = false
    const controller = new AbortController()
    const timer = setTimeout(() => {
      fetchJobFacets(withTerms(filterParams(filterState, '')), { signal: controller.signal })
        .then((data) => !cancelled && setFacets(data))
        .catch(() => {})
    }, 250)
    return () => {
      cancelled = true
      clearTimeout(timer)
      controller.abort()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [terms, filterState, retryToken])

  async function loadMore() {
    const nextPage = page + 1
    setLoadingMore(true)
    setLoadMoreError(false)
    try {
      const { jobs: more } = await fetchLatestJobs(withTerms(listParams(filterState, { sort, coords, limit: RESULTS_LIMIT, page: nextPage })))
      setJobs((prev) => [...prev, ...more.filter((j) => !prev.some((p) => p.id === j.id))])
      setPage(nextPage)
    } catch {
      setLoadMoreError(true)
    } finally {
      setLoadingMore(false)
    }
  }

  // Close the filter panel on Escape.
  useEffect(() => {
    if (!filtersOpen) return
    const onKey = (e) => e.key === 'Escape' && setFiltersOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [filtersOpen])

  useEffect(() => {
    onJobsChange?.(jobs)
  }, [jobs, onJobsChange])

  const hasMore = jobs.length < total
  const showInitialLoading = loading && jobs.length === 0 && !loadError
  const showError = !loading && loadError
  const showEmpty = !loading && !refreshing && !loadError && jobs.length === 0

  const control = 'h-9 rounded-[10px] border border-mz-line bg-white text-[13.5px] font-medium text-mz-ink outline-none transition-colors hover:border-mz-line-strong focus-visible:border-mz-primary focus-visible:ring-2 focus-visible:ring-mz-primary/25'
  const tealBtn = 'mz-btn-teal inline-flex h-10 items-center gap-1.5 rounded-[10px] bg-mz-primary px-4 text-[13.5px] font-semibold text-white transition-colors hover:bg-mz-primary-strong focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-mz-primary'

  const sheetMotion = desktopPanel
    ? { initial: { x: '100%', y: 0 }, animate: { x: 0, y: 0 }, exit: { x: '100%', y: 0 } }
    : { initial: { x: 0, y: '100%' }, animate: { x: 0, y: 0 }, exit: { x: 0, y: '100%' } }

  return (
    <div id="latest-jobs" className="scroll-mt-20" aria-labelledby="jobs-title" role="region">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 id="jobs-title" className="text-[20px] font-bold tracking-[-0.015em] text-mz-ink sm:text-[22px]">Latest opportunities</h2>
          <p className="mt-0.5 text-[13.5px] text-mz-muted" aria-live="polite">
            {showInitialLoading
              ? 'Loading live openings…'
              : showError
                ? 'Jobs feed unavailable'
                : `${total.toLocaleString('en-IN')} ${total === 1 ? 'open role' : 'open roles'}${chips.length ? ' match your search' : ''}`}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <select
              value={sort}
              onChange={(e) => handleSortChange(e.target.value)}
              disabled={locating}
              aria-label="Sort jobs"
              className={`${control} cursor-pointer appearance-none pl-3 pr-8`}
            >
              {SORT_CHOICES.map((opt) => (
                <option key={opt.key} value={opt.key}>
                  {opt.key === 'nearest' && locating ? 'Locating…' : opt.label}
                </option>
              ))}
            </select>
            <ChevronDown size={14} className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-mz-muted" aria-hidden="true" />
          </div>
        </div>
      </div>

      {/* Department tabs — a quick single-row filter, scrolls on small screens */}
      <div className="mz-scroll-x mz-fade-end -mx-4 mt-4 overflow-x-auto px-4 sm:mx-0 sm:px-0">
        <div className="flex min-w-max items-center gap-1.5 border-b border-mz-line" role="group" aria-label="Filter by department">
          {CATEGORIES.map((c) => {
            const active = c.key ? filterState.tracks.includes(c.key) : filterState.tracks.length === 0
            return (
              <button
                key={c.key || 'all'}
                type="button"
                onClick={() => setFilterState((prev) => ({ ...prev, tracks: c.key ? toggleIn(prev.tracks, c.key) : [] }))}
                aria-pressed={active}
                className={`-mb-px shrink-0 border-b-2 px-2.5 pb-2.5 pt-1 text-[13.5px] font-medium transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-mz-primary ${
                  active ? 'border-mz-primary text-mz-primary-strong' : 'border-transparent text-mz-muted hover:text-mz-ink'
                }`}
              >
                {c.label}
              </button>
            )
          })}
        </div>
      </div>

      <div className="mt-3">
        <QuickFilters state={filterState} setState={setFilterState} facets={facets} activeCount={activeFilterCount} onOpenAll={openFilters} />
      </div>

      {locationNotice && (
        <p role="status" className="mt-4 rounded-[10px] border border-mz-line bg-white px-4 py-3 text-[13.5px] text-mz-ink">
          {locationNotice}
        </p>
      )}

      {chips.length > 0 && (
        <div className="mt-4 flex flex-wrap items-center gap-2" aria-label="Applied filters">
          {chips.map((chip) => (
            <button
              key={chip.id}
              type="button"
              onClick={() => (chip.clearTerm ? setTerms((list) => list.filter((x) => x !== chip.clearTerm)) : setFilterState((prev) => chip.clear(prev)))}
              aria-label={`Remove filter ${chip.label}`}
              className="inline-flex h-7 items-center gap-1.5 rounded-[8px] bg-mz-primary-tint pl-2.5 pr-2 text-[12.5px] font-medium text-mz-primary-strong transition-colors hover:bg-white hover:ring-1 hover:ring-mz-primary focus-visible:outline-2 focus-visible:outline-mz-primary"
            >
              {chip.label}
              <X size={12} aria-hidden="true" />
            </button>
          ))}
          <button type="button" onClick={clearFilters} className="ml-1 text-[12.5px] font-semibold text-mz-muted transition-colors hover:text-mz-ink">
            Clear all
          </button>
        </div>
      )}

      <div className="mt-4">
        {showError ? (
          <div className="flex flex-col items-center justify-center gap-2 rounded-[12px] border border-dashed border-mz-line-strong bg-white px-6 py-12 text-center">
            <SearchX size={24} className="text-mz-muted" aria-hidden="true" />
            <p className="text-[15px] font-semibold text-mz-ink">Couldn&rsquo;t load jobs right now</p>
            <p className="max-w-sm text-[14px] text-mz-muted">There was a problem reaching the jobs feed. Check your connection and try again.</p>
            <button type="button" onClick={() => setRetryToken((n) => n + 1)} className={`${tealBtn} mt-2`}>
              <RotateCw size={14} aria-hidden="true" /> Retry
            </button>
          </div>
        ) : showInitialLoading ? (
          <div className="flex flex-col gap-3" aria-busy="true" aria-label="Loading jobs">
            {Array.from({ length: 5 }).map((_, i) => <JobListItemSkeleton key={i} />)}
          </div>
        ) : showEmpty ? (
          <div className="flex flex-col items-center justify-center gap-2 rounded-[12px] border border-dashed border-mz-line-strong bg-white px-6 py-12 text-center">
            <SearchX size={24} className="text-mz-muted" aria-hidden="true" />
            <p className="text-[15px] font-semibold text-mz-ink">No roles match this search</p>
            <p className="max-w-sm text-[14px] text-mz-muted">Try removing a filter or searching a different keyword.</p>
            <button type="button" onClick={clearFilters} className={`${tealBtn} mt-2`}>Clear all filters</button>
          </div>
        ) : (
          <ul className={`flex flex-col gap-3 transition-opacity duration-150 ${refreshing ? 'opacity-60' : ''}`} aria-busy={refreshing || undefined}>
            {jobs.map((job) => (
              <li key={job.id ?? `${job.title}-${job.company}`}>
                <JobListItem job={job} onOpen={onOpenJob} selected={selectedId != null && job.id === selectedId} />
              </li>
            ))}
          </ul>
        )}

        {!showError && !showEmpty && !showInitialLoading && hasMore && (
          <div className="mt-5 flex flex-col items-center gap-2">
            <button
              type="button"
              onClick={loadMore}
              disabled={loadingMore}
              className="group inline-flex h-11 items-center gap-2 rounded-[10px] border border-mz-line-strong bg-white px-5 text-[14px] font-semibold text-mz-ink transition-colors hover:border-mz-primary hover:text-mz-primary-strong disabled:opacity-60"
            >
              {loadingMore ? <Loader2 size={15} className="animate-spin" aria-hidden="true" /> : null}
              {loadingMore ? 'Loading…' : <>Show more jobs <span className="font-normal text-mz-muted">({(total - jobs.length).toLocaleString('en-IN')} more)</span></>}
              {!loadingMore && <ArrowRight size={15} className="transition-transform group-hover:translate-x-0.5" aria-hidden="true" />}
            </button>
            {loadMoreError && <p className="text-[13px] text-mz-muted">Couldn&rsquo;t load more jobs. Please try again.</p>}
          </div>
        )}
      </div>

      {/* Filter panel: right-hand sheet on desktop, bottom sheet on phones */}
      <AnimatePresence>
        {filtersOpen && (
          <motion.div
            className="fixed inset-0 z-[60]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.15 }}
            role="dialog"
            aria-modal="true"
            aria-label="Filter jobs"
          >
            <div className="absolute inset-0 bg-mz-ink/25" onClick={() => setFiltersOpen(false)} />
            <motion.div
              {...(reduceMotion ? {} : sheetMotion)}
              transition={{ duration: 0.26, ease: [0.22, 1, 0.36, 1] }}
              className={`absolute flex flex-col bg-white shadow-[0_0_40px_rgba(22,50,79,0.18)] ${
                desktopPanel ? 'inset-y-0 right-0 w-[380px] max-w-full' : 'inset-x-0 bottom-0 max-h-[88vh] rounded-t-[16px]'
              }`}
            >
              <div className="flex items-center justify-between border-b border-mz-line px-5 py-4">
                <p className="text-[16px] font-semibold text-mz-ink">
                  Filters
                  {activeFilterCount > 0 && <span className="ml-1.5 text-[13px] font-medium text-mz-muted">{activeFilterCount} applied</span>}
                </p>
                <div className="flex items-center gap-1">
                {activeFilterCount > 0 && (
                  <button type="button" onClick={clearFilters} className="rounded-[8px] px-2.5 py-1.5 text-[13px] font-semibold text-mz-primary-strong hover:bg-mz-primary-tint">
                    Clear all
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setFiltersOpen(false)}
                  className="flex h-9 w-9 items-center justify-center rounded-[8px] text-mz-ink hover:bg-mz-bg"
                  aria-label="Close filters"
                  autoFocus
                >
                  <X size={17} aria-hidden="true" />
                </button>
                </div>
              </div>
              <div className="flex-1 overflow-y-auto overscroll-contain px-4 py-2">
                <MarketplaceFilters state={filterState} setState={setFilterState} facets={facets} companyNameOf={(id) => companyNames.current.get(id)} />
              </div>
              <div className="border-t border-mz-line px-5 pb-[max(1rem,env(safe-area-inset-bottom))] pt-3">
                <button
                  type="button"
                  onClick={() => setFiltersOpen(false)}
                  className="mz-btn-teal inline-flex h-11 w-full items-center justify-center gap-2 rounded-[10px] bg-mz-primary text-[14.5px] font-semibold text-white hover:bg-mz-primary-strong"
                >
                  {refreshing ? (
                    <>
                      <Loader2 size={15} className="animate-spin" aria-hidden="true" /> Updating results…
                    </>
                  ) : (
                    `Show ${total.toLocaleString('en-IN')} ${total === 1 ? 'job' : 'jobs'}`
                  )}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <LocationConsentDialog open={consentOpen} onAllow={allowLocation} onCancel={() => setConsentOpen(false)} />
    </div>
  )
}
