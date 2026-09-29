import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { Search, ChevronDown, SlidersHorizontal, X, ArrowRight, Loader2, RotateCw, SearchX } from 'lucide-react'
import { Container, Reveal, SectionHead } from '../../mz/primitives'
import JobCard, { JobCardSkeleton } from '../../mz/JobCard'
import LocationConsentDialog from '../../ui/LocationConsentDialog'
import MarketplaceFilters from './MarketplaceFilters'
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
// fetchLatestJobs, the exact same feed LatestJobs.jsx/CityJobs.jsx use), not
// a hardcoded list. Filter option lists (job type, work mode, experience,
// salary, category/track) are the same shared constants the rest of the
// site's filtering already uses (lib/jobFilters.js), so a value picked here
// means the same thing Backend expects — no separate demo taxonomy.
// ============================================================
const CATEGORIES = [{ key: '', label: 'All' }, ...DEPARTMENT_CHOICES.map((o) => ({ key: o.value, label: o.label }))]
const RESULTS_LIMIT = 12

// `external` is Home's lifted search ({ q: [], location: [], experience })
// from the hero search bar, quick suggestions, category and city tiles. Each
// new value replaces this section's search terms/location/experience so what
// the visitor picked above is exactly what the grid shows.
export default function JobMarketplace({ external }) {
  const reduceMotion = useReducedMotion()

  const [search, setSearch] = useState('')
  const [terms, setTerms] = useState([])
  const [sort, setSort] = useState('newest')
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)
  const [filterState, setFilterState] = useState(MARKETPLACE_DEFAULTS)
  const [facets, setFacets] = useState(null)

  const firstExternal = useRef(true)
  useEffect(() => {
    if (firstExternal.current) {
      firstExternal.current = false
      return
    }
    if (!external) return
    setTerms(external.q ?? [])
    setSearch('')
    setFilterState({
      ...MARKETPLACE_DEFAULTS,
      location: external.location ?? [],
      experience: external.experience ? [external.experience] : [],
      tracks: external.track ? [external.track] : [],
    })
  }, [external])

  // Hero terms (OR'd) plus whatever is typed in this section's own box.
  const withTerms = (params) => ({ ...params, q: [...terms, ...(search.trim() ? [search.trim()] : [])] })

  // "Nearest to me": we ask (in our own dialog) BEFORE the browser prompt.
  const [coords, setCoords] = useState(null)
  const [consentOpen, setConsentOpen] = useState(false)
  const [locating, setLocating] = useState(false)
  const [locationNotice, setLocationNotice] = useState('')

  // Seeded from the build-time prerender fetch (see initialHomeDataContext.js)
  // so the default, unfiltered view never ships as "0 opportunities" — the
  // effect below still re-fetches live data right after mount regardless.
  const initialHomeData = useInitialHomeData()
  const [jobs, setJobs] = useState(initialHomeData?.jobs ?? [])
  const [total, setTotal] = useState(initialHomeData?.total ?? 0)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(!initialHomeData)
  const [loadingMore, setLoadingMore] = useState(false)
  const [loadMoreError, setLoadMoreError] = useState(false)
  const [loadError, setLoadError] = useState(false)
  const [retryToken, setRetryToken] = useState(0)

  // Company chips need a name, and a selected company must keep its name even
  // if a later facet response no longer lists it.
  const companyNames = useRef(new Map())
  facets?.companies?.forEach((c) => companyNames.current.set(c.id, c.name))

  const activeFilterCount = countMarketplaceFilters(filterState)
  const chips = [
    ...terms.map((t) => ({ id: `term:${t}`, label: `\u201c${t}\u201d`, clearTerm: t })),
    ...marketplaceChips(filterState, { companyNameOf: (id) => companyNames.current.get(id) }),
  ]

  function clearFilters() {
    setFilterState(MARKETPLACE_DEFAULTS)
    setTerms([])
    setSearch('')
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

    const timer = setTimeout(() => {
      fetchLatestJobs(withTerms(listParams(filterState, { search, sort, coords, limit: RESULTS_LIMIT, page: 1 })), { signal: controller.signal })
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
          if (!cancelled) setLoading(false)
        })
    }, 250)

    return () => {
      cancelled = true
      clearTimeout(timer)
      controller.abort()
    }
  }, [search, terms, sort, coords, filterState, retryToken])

  // Live counts next to every option. Best-effort: if this fails the filters
  // still work, they just show no numbers.
  useEffect(() => {
    let cancelled = false
    const controller = new AbortController()
    const timer = setTimeout(() => {
      fetchJobFacets(withTerms(filterParams(filterState, search)), { signal: controller.signal })
        .then((data) => !cancelled && setFacets(data))
        .catch(() => {})
    }, 250)
    return () => {
      cancelled = true
      clearTimeout(timer)
      controller.abort()
    }
  }, [search, terms, filterState, retryToken])

  async function loadMore() {
    const nextPage = page + 1
    setLoadingMore(true)
    setLoadMoreError(false)
    try {
      const { jobs: more } = await fetchLatestJobs(withTerms(listParams(filterState, { search, sort, coords, limit: RESULTS_LIMIT, page: nextPage })))
      setJobs((prev) => [...prev, ...more.filter((j) => !prev.some((p) => p.id === j.id))])
      setPage(nextPage)
    } catch {
      setLoadMoreError(true)
    } finally {
      setLoadingMore(false)
    }
  }

  const hasMore = jobs.length < total

  const showInitialLoading = loading && jobs.length === 0 && !loadError
  const showError = !loading && loadError
  const showEmpty = !loading && !loadError && jobs.length === 0

  const pill = 'h-11 rounded-full bg-white ring-1 ring-mz-line text-[14px] text-mz-ink outline-none transition-shadow focus:ring-2 focus:ring-mz-primary'
  const primaryPill = 'inline-flex h-10 items-center gap-1.5 rounded-full bg-mz-primary px-5 text-[13.5px] font-semibold text-white hover:bg-mz-primary-strong'

  return (
    <section id="latest-jobs" aria-labelledby="jobs-title" className="relative scroll-mt-20 bg-mz-bg py-20 lg:py-28">
      <Container className="max-w-[1320px]">
        <SectionHead
          id="jobs-title"
          eyebrow="Job discovery"
          title="Opportunities Worth Exploring"
        >
          Fresh roles from employers hiring across India &mdash; filter by what matters and apply in a couple of taps.
        </SectionHead>

        {/* Department tabs */}
        <Reveal className="mz-scroll-x -mx-4 mt-10 overflow-x-auto px-4 sm:mx-0 sm:px-0">
          <div className="flex min-w-max items-center gap-2" role="group" aria-label="Filter by department">
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
                  className={`h-10 shrink-0 rounded-full px-4 text-[13.5px] font-medium transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-mz-primary ${
                    active ? 'bg-mz-ink text-white' : 'bg-white text-mz-ink-2 ring-1 ring-mz-line hover:ring-mz-primary hover:text-mz-primary-strong'
                  }`}
                >
                  {c.label}
                </button>
              )
            })}
          </div>
        </Reveal>

        <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-[260px_1fr]">
          {/* Desktop sidebar */}
          <aside className="hidden lg:block" aria-label="Job filters">
            <div className="sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto overscroll-contain rounded-3xl bg-white p-6 ring-1 ring-mz-line">
              <MarketplaceFilters state={filterState} setState={setFilterState} facets={facets} activeCount={activeFilterCount} onClear={clearFilters} />
            </div>
          </aside>

          <div className="min-w-0">
            {/* Toolbar: search + sort + mobile filter trigger */}
            <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="relative min-w-0 flex-1">
                <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-mz-muted" aria-hidden="true" />
                <input
                  type="search"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search within results: role, skill or company"
                  aria-label="Search jobs"
                  className={`${pill} w-full pl-11 pr-4 placeholder:text-mz-muted`}
                />
              </div>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setMobileFiltersOpen(true)}
                  className={`${pill} inline-flex flex-1 items-center justify-center gap-2 px-4 font-medium lg:hidden`}
                >
                  <SlidersHorizontal size={15} aria-hidden="true" /> Filters
                  {activeFilterCount > 0 && (
                    <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-mz-primary px-1 text-[11px] font-bold text-white">{activeFilterCount}</span>
                  )}
                </button>
                <div className="relative flex-1 sm:flex-none">
                  <select
                    value={sort}
                    onChange={(e) => handleSortChange(e.target.value)}
                    disabled={locating}
                    aria-label="Sort jobs"
                    className={`${pill} w-full cursor-pointer appearance-none pl-4 pr-10 font-medium`}
                  >
                    {SORT_CHOICES.map((opt) => (
                      <option key={opt.key} value={opt.key}>
                        Sort: {opt.key === 'nearest' && locating ? 'Locating\u2026' : opt.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown size={14} className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-mz-muted" aria-hidden="true" />
                </div>
              </div>
            </div>

            {locationNotice && (
              <p role="status" className="mb-4 rounded-2xl bg-white px-4 py-3 text-[13.5px] text-mz-ink ring-1 ring-mz-line">
                {locationNotice}
              </p>
            )}

            {chips.length > 0 && (
              <div className="mb-5 flex flex-wrap items-center gap-2" aria-label="Applied filters">
                {chips.map((chip) => (
                  <button
                    key={chip.id}
                    type="button"
                    onClick={() => (chip.clearTerm ? setTerms((list) => list.filter((x) => x !== chip.clearTerm)) : setFilterState((prev) => chip.clear(prev)))}
                    aria-label={`Remove filter ${chip.label}`}
                    className="inline-flex h-8 items-center gap-1.5 rounded-full bg-mz-primary-tint pl-3 pr-2.5 text-[12.5px] font-medium text-mz-primary-strong transition-colors hover:bg-white hover:ring-1 hover:ring-mz-primary focus-visible:outline-2 focus-visible:outline-mz-primary"
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

            {showError ? (
              <div className="flex flex-col items-center justify-center gap-2.5 rounded-3xl border border-dashed border-mz-line-strong bg-white px-6 py-16 text-center">
                <SearchX size={26} className="text-mz-muted" aria-hidden="true" />
                <p className="text-[15px] font-semibold text-mz-ink">Couldn&rsquo;t load jobs right now</p>
                <p className="max-w-sm text-[14px] text-mz-muted">There was a problem reaching the jobs feed. Check your connection and try again.</p>
                <button type="button" onClick={() => setRetryToken((n) => n + 1)} className={`${primaryPill} mt-2`}>
                  <RotateCw size={14} aria-hidden="true" /> Retry
                </button>
              </div>
            ) : showInitialLoading ? (
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3" aria-busy="true" aria-label="Loading jobs">
                {Array.from({ length: 6 }).map((_, i) => <JobCardSkeleton key={i} />)}
              </div>
            ) : showEmpty ? (
              <div className="flex flex-col items-center justify-center gap-2.5 rounded-3xl border border-dashed border-mz-line-strong bg-white px-6 py-16 text-center">
                <SearchX size={26} className="text-mz-muted" aria-hidden="true" />
                <p className="text-[15px] font-semibold text-mz-ink">No roles match these filters</p>
                <p className="max-w-sm text-[14px] text-mz-muted">Try removing a filter or searching a different keyword.</p>
                <button type="button" onClick={clearFilters} className={`${primaryPill} mt-2`}>Clear all filters</button>
              </div>
            ) : (
              <AnimatePresence mode="wait" initial={false}>
                <motion.ul
                  key={`${sort}-${search}-${terms.join('|')}-${JSON.stringify(filterState)}`}
                  initial={reduceMotion ? false : { opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.22 }}
                  className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3"
                >
                  {jobs.map((job) => (
                    <li key={job.id ?? `${job.title}-${job.company}`}>
                      <JobCard job={job} />
                    </li>
                  ))}
                </motion.ul>
              </AnimatePresence>
            )}

            {!showError && !showEmpty && !showInitialLoading && hasMore && (
              <div className="mt-10 flex flex-col items-center gap-2">
                <button
                  type="button"
                  onClick={loadMore}
                  disabled={loadingMore}
                  className="group inline-flex h-12 items-center gap-2 rounded-full bg-white px-6 text-[14.5px] font-semibold text-mz-ink ring-1 ring-mz-line-strong transition-colors hover:text-mz-primary-strong hover:ring-mz-primary disabled:opacity-60"
                >
                  {loadingMore ? <Loader2 size={15} className="animate-spin" aria-hidden="true" /> : null}
                  {loadingMore ? 'Loading\u2026' : <>View all jobs <span className="text-mz-muted">({(total - jobs.length).toLocaleString('en-IN')} more)</span></>}
                  {!loadingMore && <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" aria-hidden="true" />}
                </button>
                {loadMoreError && <p className="text-[13px] text-mz-muted">Couldn&rsquo;t load more jobs. Please try again.</p>}
              </div>
            )}
          </div>
        </div>
      </Container>

      {/* Mobile filter drawer */}
      <AnimatePresence>
        {mobileFiltersOpen && (
          <motion.div className="fixed inset-0 z-[60] lg:hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} role="dialog" aria-modal="true" aria-label="Filter jobs">
            <div className="absolute inset-0 bg-mz-ink/40 backdrop-blur-[2px]" onClick={() => setMobileFiltersOpen(false)} />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
              className="absolute inset-x-0 bottom-0 flex max-h-[88vh] flex-col rounded-t-[28px] bg-white shadow-[0_-20px_60px_rgba(0,0,0,0.2)]"
            >
              <div className="flex items-center justify-between border-b border-mz-line px-5 py-4">
                <p className="text-[16px] font-semibold text-mz-ink">Filter jobs</p>
                <button
                  type="button"
                  onClick={() => setMobileFiltersOpen(false)}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-mz-bg text-mz-ink"
                  aria-label="Close filters"
                >
                  <X size={17} aria-hidden="true" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto overscroll-contain px-5 py-5">
                <MarketplaceFilters state={filterState} setState={setFilterState} facets={facets} activeCount={activeFilterCount} onClear={clearFilters} />
              </div>
              <div className="border-t border-mz-line px-5 pb-[max(1rem,env(safe-area-inset-bottom))] pt-3">
                <button type="button" onClick={() => setMobileFiltersOpen(false)} className="h-12 w-full rounded-full bg-mz-primary text-[15px] font-semibold text-white">
                  Show {total.toLocaleString('en-IN')} {total === 1 ? 'opportunity' : 'opportunities'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <LocationConsentDialog open={consentOpen} onAllow={allowLocation} onCancel={() => setConsentOpen(false)} />
    </section>
  )
}
