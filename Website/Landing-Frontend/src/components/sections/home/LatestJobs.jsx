import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronDown, X, SearchX, SlidersHorizontal, Loader2, RotateCw } from 'lucide-react'
import Reveal from '../../ui/Reveal'
import JobFiltersPanel from './JobFiltersPanel'
import FeaturedJobCard, { FeaturedJobCardSkeleton } from './FeaturedJobCard'
import CompactJobRow, { CompactJobRowSkeleton } from './CompactJobRow'
import ExplorerButton, { ExplorerTextLink } from '../../ui/ExplorerButton'
import { fetchLatestJobs } from '../../../lib/publicJobs'
import { buildJobsUrl } from '../../../lib/jobsUrl'
import { hasActiveFilters, countActiveFilters, buildFilterChips } from '../../../lib/jobFilters'

const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest' },
  { value: 'salary_desc', label: 'Highest salary' },
  { value: 'salary_asc', label: 'Lowest salary' },
]

// Debounce before asking Backend for a new filtered result set — chip
// clicks in the Filters panel can fire in quick succession, so this avoids
// spamming a request per click. The hero search bar / suggestion selection
// only ever calls onSearch once per submit, so in practice this window is
// rarely visible for that path.
const FETCH_DEBOUNCE_MS = 250
const RESULTS_LIMIT = 8
// One featured job (the first of the current result set) plus up to this
// many compact rows beside it — the rest of RESULTS_LIMIT is unused here on
// purpose, this section is a discovery teaser, not a full listing (that's
// what "View all jobs" is for).
const MAX_COMPACT_ROWS = 4

function resultSummaryText(total, filters) {
  const qTerms = filters.q ?? []
  const locationTerms = filters.location ?? []
  const qPart = qTerms.length ? ` for ${qTerms.map((v) => `“${v}”`).join(' or ')}` : ''
  const locationPart = locationTerms.length ? ` in ${locationTerms.join(' or ')}` : ''
  return `${total} job${total === 1 ? '' : 's'} found${qPart}${locationPart}`
}

export default function LatestJobs({ jobs: jobsProp, filters, onFiltersChange, onClearFilters }) {
  const navigate = useNavigate()
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [sort, setSort] = useState('newest')
  const isFiltered = hasActiveFilters(filters)

  const [jobs, setJobs] = useState(jobsProp ?? [])
  const [total, setTotal] = useState(jobsProp?.length ?? 0)
  const [loading, setLoading] = useState(!jobsProp)
  const [loadError, setLoadError] = useState(false)
  // Bumping this re-runs the fetch effect below — the only job of the Retry
  // button in the error state.
  const [retryToken, setRetryToken] = useState(0)

  useEffect(() => {
    if (jobsProp) return
    let cancelled = false
    const controller = new AbortController()
    setLoading(true)
    setLoadError(false)

    const timer = setTimeout(() => {
      fetchLatestJobs({ ...filters, sort, limit: RESULTS_LIMIT }, { signal: controller.signal })
        .then(({ jobs: fetchedJobs, total: fetchedTotal }) => {
          if (cancelled) return
          setJobs(fetchedJobs)
          setTotal(fetchedTotal)
        })
        .catch((err) => {
          if (cancelled || err?.name === 'AbortError') return
          // A real fetch failure — show an honest error state with a Retry
          // action rather than quietly swapping in invented sample jobs.
          setJobs([])
          setTotal(0)
          setLoadError(true)
        })
        .finally(() => {
          if (!cancelled) setLoading(false)
        })
    }, FETCH_DEBOUNCE_MS)

    return () => {
      cancelled = true
      clearTimeout(timer)
      controller.abort()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters, sort, jobsProp, retryToken])

  // A discovery surface only — every card/row here hands off to the job's
  // own detail route (pages/JobDetail.jsx), which is where the full
  // description, benefits, facts grid, Apply, bookmark and share actions
  // actually live.
  function openJob(job) {
    navigate(`/jobs/${job.id ?? encodeURIComponent(job.title)}`, { state: { job } })
  }

  const activeFilterCount = countActiveFilters(filters)
  const hasStructuredFilters = Boolean(
    filters.workMode?.length || filters.salary || filters.employmentType?.length || filters.track?.length || filters.postedWithin
  )
  const clearAllLabel = hasStructuredFilters ? 'Clear filters' : 'Clear search'
  const filterChips = isFiltered ? buildFilterChips(filters) : []
  const showInitialLoading = loading && jobs.length === 0 && !jobsProp && !loadError
  const showError = !loading && loadError
  const showEmptyState = !loading && !loadError && jobs.length === 0

  const featuredJob = jobs[0]
  const compactJobs = jobs.slice(1, 1 + MAX_COMPACT_ROWS)

  return (
    <section id="latest-jobs" className="hero-afterglow-faint py-16 md:py-20 px-6 md:px-10 scroll-mt-20">
      <div className="max-w-7xl mx-auto">
        <Reveal direction="up" duration={0.7} className="mb-8 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-5">
          <div className="max-w-xl">
            <p className="text-[12.5px] font-bold uppercase tracking-wide text-(--explorer-teal)">Open roles</p>
            <h2 className="mt-2 text-2xl sm:text-3xl font-extrabold text-(--explorer-navy) tracking-tight text-balance">
              Fresh opportunities, worth a closer look.
            </h2>
            {isFiltered ? (
              <p className="mt-2 text-[15px] text-(--explorer-muted) flex items-center gap-2">
                {resultSummaryText(total, filters)}
                {loading && <Loader2 size={14} className="animate-spin text-(--explorer-muted)" aria-hidden="true" />}
              </p>
            ) : (
              <p className="mt-2 text-[15px] text-(--explorer-muted)">
                Screened openings from employers hiring through MZOBS.
                {!loading && !loadError && ` ${total} open now.`}
              </p>
            )}
          </div>
          <div className="flex shrink-0 items-center gap-4">
            <ExplorerTextLink href={buildJobsUrl(filters)} className="text-[13.5px]">
              View all jobs
            </ExplorerTextLink>
            <button
              type="button"
              aria-expanded={filtersOpen}
              onClick={() => setFiltersOpen((v) => !v)}
              className={`inline-flex items-center gap-1.5 h-9 px-3.5 rounded-md border text-[13.5px] font-bold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--explorer-teal) ${
                filtersOpen
                  ? 'border-(--explorer-teal-border) bg-(--explorer-teal-surface) text-(--explorer-teal)'
                  : 'border-(--explorer-border) bg-white text-(--explorer-navy) hover:border-(--explorer-teal-border) hover:bg-(--explorer-teal-surface) hover:text-(--explorer-teal)'
              }`}
            >
              <SlidersHorizontal size={15} aria-hidden="true" /> Filters
              {activeFilterCount > 0 && (
                <span className="flex items-center justify-center w-4.5 h-4.5 rounded-full bg-(--explorer-teal) text-white text-[10px] font-bold">
                  {activeFilterCount}
                </span>
              )}
            </button>
          </div>
        </Reveal>

        {isFiltered && (
          <div className="mb-6 flex flex-wrap items-center gap-2">
            {filterChips.map((chip) => (
              <button
                key={chip.id}
                type="button"
                onClick={() => onFiltersChange(chip.clear(filters))}
                className="inline-flex items-center gap-1.5 h-8 pl-3 pr-2 rounded-full border border-(--explorer-border) bg-white text-[12.5px] font-semibold text-(--explorer-navy) hover:border-(--explorer-teal-border) hover:bg-(--explorer-teal-surface) hover:text-(--explorer-teal) transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--explorer-teal)"
              >
                {chip.label}
                <X size={12} aria-hidden="true" />
              </button>
            ))}
            <button
              type="button"
              onClick={onClearFilters}
              className="inline-flex items-center gap-1 text-[13px] font-bold text-(--explorer-teal) hover:text-(--explorer-navy) transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--explorer-teal) rounded-xs"
            >
              <X size={13} aria-hidden="true" /> {clearAllLabel}
            </button>
          </div>
        )}

        <JobFiltersPanel open={filtersOpen} filters={filters} onChange={onFiltersChange} onClear={onClearFilters} />

        {showError ? (
          <Reveal
            direction="up"
            duration={0.5}
            className="flex flex-col items-center justify-center gap-2.5 rounded-xl border border-dashed border-(--explorer-border) py-16 px-6 text-center"
          >
            <SearchX size={26} className="text-(--explorer-muted)" aria-hidden="true" />
            <p className="text-[15px] font-bold text-(--explorer-navy)">Couldn't load jobs right now</p>
            <p className="text-[13.5px] text-(--explorer-muted) max-w-sm">There was a problem reaching the jobs feed. Check your connection and try again.</p>
            <ExplorerButton onClick={() => setRetryToken((n) => n + 1)} className="mt-1.5">
              <RotateCw size={14} aria-hidden="true" /> Retry
            </ExplorerButton>
          </Reveal>
        ) : showEmptyState ? (
          <Reveal
            direction="up"
            duration={0.7}
            delay={0.05}
            className="flex flex-col items-center justify-center gap-2.5 rounded-xl border border-dashed border-(--explorer-border) py-16 px-6 text-center"
          >
            <SearchX size={26} className="text-(--explorer-muted)" aria-hidden="true" />
            <p className="text-[15px] font-bold text-(--explorer-navy)">No jobs match your search</p>
            <p className="text-[13.5px] text-(--explorer-muted) max-w-sm">Try a different city, role or experience level.</p>
            <ExplorerButton onClick={onClearFilters} className="mt-1.5">
              Clear filters
            </ExplorerButton>
          </Reveal>
        ) : (
          <Reveal
            direction="up"
            duration={0.7}
            delay={0.05}
            className={showInitialLoading || compactJobs.length > 0 ? 'grid lg:grid-cols-[58%_1fr] gap-6 lg:gap-7 items-start' : 'grid'}
          >
            {showInitialLoading ? <FeaturedJobCardSkeleton /> : featuredJob && <FeaturedJobCard job={featuredJob} onOpen={() => openJob(featuredJob)} />}

            {(showInitialLoading || compactJobs.length > 0) && (
              <div className="min-w-0 flex flex-col gap-3">
                <div className="flex items-center justify-between gap-3 px-0.5">
                  <p className="text-[11.5px] font-bold uppercase tracking-wide text-(--explorer-muted)">More openings</p>
                  <div className="relative shrink-0">
                    <select
                      value={sort}
                      onChange={(e) => setSort(e.target.value)}
                      aria-label="Sort jobs"
                      className="h-7 pl-2.5 pr-6 rounded-md border border-(--explorer-border) bg-white text-[11.5px] font-semibold text-(--explorer-navy) outline-none appearance-none hover:border-(--explorer-navy)/25 focus:border-(--explorer-teal) focus:ring-[3px] focus:ring-(--explorer-teal)/15 transition-colors"
                    >
                      {SORT_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                    <ChevronDown size={11} className="absolute right-2 top-1/2 -translate-y-1/2 text-(--explorer-muted) pointer-events-none" aria-hidden="true" />
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  {showInitialLoading
                    ? Array.from({ length: MAX_COMPACT_ROWS }).map((_, i) => <CompactJobRowSkeleton key={i} />)
                    : compactJobs.map((j) => <CompactJobRow key={j.id ?? `${j.title}-${j.company}`} job={j} onOpen={() => openJob(j)} />)}
                </div>
              </div>
            )}
          </Reveal>
        )}
      </div>
    </section>
  )
}
