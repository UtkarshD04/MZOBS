import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { MapPin, TrendingUp, IndianRupee, Clock, ChevronDown, ChevronRight, X, SearchX, SlidersHorizontal, Loader2 } from 'lucide-react'
import Reveal from '../../ui/Reveal'
import JobFiltersPanel from './JobFiltersPanel'
import JobDetailPanel from './JobDetailPanel'
import { NEUTRAL_PILL, NewBadge, initialsOf, toneForCompany, Avatar, Pill } from './jobCardPrimitives'
import { LATEST_JOBS_DATA } from '../../../lib/content'
import { fetchLatestJobs } from '../../../lib/publicJobs'
import { matchesJobSearch, hasActiveFilters, countActiveFilters, buildFilterChips } from '../../../lib/jobFilters'

const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest' },
  { value: 'salary_desc', label: 'Highest salary' },
  { value: 'salary_asc', label: 'Lowest salary' },
]

// Only used against the curated LATEST_JOBS_DATA fallback — a live result
// set already comes back pre-sorted by Backend for whichever `sort` value
// was sent (see jobQueryFilters.js), so this never runs against real data.
function sortFallbackJobs(list, sort) {
  const arr = [...list]
  if (sort === 'salary_desc') return arr.sort((a, b) => (b.salaryMax ?? 0) - (a.salaryMax ?? 0))
  if (sort === 'salary_asc') return arr.sort((a, b) => (a.salaryMin ?? Infinity) - (b.salaryMin ?? Infinity))
  return arr.sort((a, b) => (a.postedDaysAgo ?? 0) - (b.postedDaysAgo ?? 0))
}

// Debounce before asking Backend for a new filtered result set — chip
// clicks in the Filters panel can fire in quick succession, so this avoids
// spamming a request per click. The hero search bar / suggestion selection
// only ever calls onSearch once per submit, so in practice this window is
// rarely visible for that path.
const FETCH_DEBOUNCE_MS = 250
const RESULTS_LIMIT = 8

// Matches the `lg` breakpoint the list/detail grid switches on below —
// under it there's no side-by-side room for a detail panel at all, so a
// card tap goes to its own page (pages/JobDetail.jsx) instead of updating
// an inline panel the visitor would have to scroll down to see.
const DESKTOP_BREAKPOINT = 1024

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

  // `jobs`/`total` always come from exactly one source at a time — the live
  // API, or (only on a genuine fetch failure) the curated LATEST_JOBS_DATA
  // sample filtered the same way — never a blend of the two. `usingFallback`
  // just tracks which one so the rest of the component doesn't need to care.
  const [jobs, setJobs] = useState(jobsProp ?? [])
  const [total, setTotal] = useState(jobsProp?.length ?? 0)
  const [loading, setLoading] = useState(!jobsProp)
  const [usingFallback, setUsingFallback] = useState(false)

  useEffect(() => {
    if (jobsProp) return
    let cancelled = false
    const controller = new AbortController()
    setLoading(true)

    const timer = setTimeout(() => {
      fetchLatestJobs({ ...filters, sort, limit: RESULTS_LIMIT }, { signal: controller.signal })
        .then(({ jobs: fetchedJobs, total: fetchedTotal }) => {
          if (cancelled) return
          setJobs(fetchedJobs)
          setTotal(fetchedTotal)
          setUsingFallback(false)
        })
        .catch((err) => {
          if (cancelled || err?.name === 'AbortError') return
          // Public API unreachable — filter the curated sample the exact
          // same way a live request would have been filtered, so the
          // section degrades gracefully instead of looking broken. Never
          // reached when the API responds successfully with zero matches —
          // that's a real empty result, not a fallback case.
          const matched = isFiltered ? LATEST_JOBS_DATA.filter((j) => matchesJobSearch(j, filters)) : LATEST_JOBS_DATA.slice()
          const filtered = sortFallbackJobs(matched, sort).slice(0, RESULTS_LIMIT)
          setJobs(filtered)
          setTotal(filtered.length)
          setUsingFallback(true)
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
  }, [filters, sort, jobsProp])

  const [selected, setSelected] = useState(0)
  const job = jobs[selected]

  // Whatever was selected in the previous result set is meaningless once the
  // filters change the list underneath it — jump back to the first match.
  // `filters` is a fresh object every time Home.jsx updates it, so this only
  // fires on an actual filter change (covers the array-valued fields too —
  // workMode/employmentType/track — that a scalar dependency list would miss).
  useEffect(() => {
    setSelected(0)
  }, [filters, sort])

  // Desktop: select the job for the sticky side panel to show. Mobile: that
  // panel isn't rendered at all (see the `hidden lg:block` wrapper below),
  // so instead this opens the job on its own page — the id-less curated
  // fallback sample still works there since the full job object rides along
  // as router state, not just the URL.
  function openJob(i) {
    const j = jobs[i]
    if (typeof window !== 'undefined' && window.innerWidth < DESKTOP_BREAKPOINT) {
      navigate(`/jobs/${j.id ?? encodeURIComponent(j.title)}`, { state: { job: j } })
      return
    }
    setSelected(i)
  }

  const activeFilterCount = countActiveFilters(filters)
  const hasStructuredFilters = Boolean(
    filters.workMode?.length || filters.salary || filters.employmentType?.length || filters.track?.length || filters.postedWithin
  )
  const clearAllLabel = hasStructuredFilters ? 'Clear filters' : 'Clear search'
  const filterChips = isFiltered ? buildFilterChips(filters) : []
  const showEmptyState = !loading && jobs.length === 0
  const showInitialLoading = loading && jobs.length === 0 && !jobsProp

  return (
    <section id="latest-jobs" className="bg-(--explorer-bg) py-16 md:py-20 px-6 md:px-10 scroll-mt-20">
      <div className="max-w-7xl mx-auto">
        <Reveal direction="up" duration={0.7} className="mb-6 flex items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-(--explorer-navy) tracking-tight">Latest jobs</h2>
            {isFiltered ? (
              <p className="mt-2 text-[15px] text-(--explorer-muted) flex items-center gap-2">
                {resultSummaryText(total, filters)}
                {loading && <Loader2 size={14} className="animate-spin text-(--explorer-muted)" aria-hidden="true" />}
              </p>
            ) : (
              <p className="mt-2 text-[15px] text-(--explorer-muted)">Fresh, screened openings added by verified employers — select a role to see the full description.</p>
            )}
          </div>
          <div className="flex shrink-0 items-center gap-3">
            <button
              type="button"
              aria-expanded={filtersOpen}
              onClick={() => setFiltersOpen((v) => !v)}
              className={`inline-flex items-center gap-1.5 h-9 px-3.5 rounded-lg border text-[13.5px] font-bold transition-colors ${
                filtersOpen
                  ? 'border-(--explorer-teal-border) bg-(--explorer-teal-surface) text-(--explorer-teal)'
                  : 'border-(--explorer-border) bg-white text-(--explorer-navy) hover:border-(--explorer-teal)'
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
                className="inline-flex items-center gap-1.5 h-8 pl-3 pr-2 rounded-full border border-(--explorer-border) bg-white text-[12.5px] font-semibold text-(--explorer-navy) hover:border-(--explorer-teal) transition-colors"
              >
                {chip.label}
                <X size={12} aria-hidden="true" />
              </button>
            ))}
            <button
              type="button"
              onClick={onClearFilters}
              className="inline-flex items-center gap-1 text-[13px] font-bold text-(--explorer-teal) hover:text-(--explorer-navy) transition-colors"
            >
              <X size={13} aria-hidden="true" /> {clearAllLabel}
            </button>
          </div>
        )}

        <JobFiltersPanel open={filtersOpen} filters={filters} onChange={onFiltersChange} onClear={onClearFilters} />

        {usingFallback && (
          <p className="mb-4 text-[12.5px] text-(--explorer-muted)">Showing sample openings while we reconnect to live listings.</p>
        )}

        {showInitialLoading ? (
          <div className="flex flex-col items-center justify-center gap-2.5 rounded-xl border border-dashed border-(--explorer-border) py-16 px-6 text-center">
            <Loader2 size={26} className="animate-spin text-(--explorer-muted)" aria-hidden="true" />
            <p className="text-[13.5px] text-(--explorer-muted)">Loading jobs…</p>
          </div>
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
            <button
              type="button"
              onClick={onClearFilters}
              className="mt-1.5 inline-flex items-center gap-1.5 h-10 px-5 rounded-lg bg-(--explorer-blue) text-white text-[13.5px] font-bold hover:bg-(--explorer-blue-hover) transition-colors"
            >
              Clear filters
            </button>
          </Reveal>
        ) : (
          <Reveal direction="up" duration={0.7} delay={0.05} className="grid lg:grid-cols-[34%_1fr] gap-5 lg:gap-6 items-start">
            <div className="flex flex-col bg-white border border-(--explorer-border) rounded-xl shadow-[0_1px_2px_rgba(16,42,67,0.04)] overflow-hidden lg:max-h-184">
              <div className="flex items-center justify-between gap-3 px-4 py-3 border-b border-(--explorer-border) shrink-0">
                <div className="min-w-0">
                  <p className="font-bold text-[13.5px] text-(--explorer-navy) truncate">Latest opportunities</p>
                  <p className="mt-0.5 text-[12px] text-(--explorer-muted)">
                    {total} role{total === 1 ? '' : 's'} available
                  </p>
                </div>
                <div className="relative shrink-0">
                  <select
                    value={sort}
                    onChange={(e) => setSort(e.target.value)}
                    aria-label="Sort jobs"
                    className="h-8 pl-2.5 pr-7 rounded-md border border-(--explorer-border) bg-white text-[12px] font-semibold text-(--explorer-navy) outline-none appearance-none hover:border-(--explorer-navy)/25 focus:border-(--explorer-teal) focus:ring-[3px] focus:ring-(--explorer-teal)/15 transition-colors"
                  >
                    {SORT_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-(--explorer-muted) pointer-events-none" aria-hidden="true" />
                </div>
              </div>

              <div className="flex flex-col lg:overflow-y-auto">
                {jobs.map((j, i) => {
                  const active = i === selected
                  const isRecent = j.postedDaysAgo != null && j.postedDaysAgo <= 1
                  return (
                    <button
                      key={j.id ?? `${j.title}-${j.company}`}
                      type="button"
                      aria-pressed={active}
                      onClick={() => openJob(i)}
                      className={`group relative text-left p-3 border-b border-(--explorer-border) last:border-b-0 transition-[background-color,transform] duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--explorer-teal) ${
                        active ? 'lg:bg-(--explorer-teal-surface) lg:pl-4' : 'bg-white hover:bg-(--explorer-blue-surface) hover:-translate-y-0.5'
                      }`}
                    >
                      {active && <span className="hidden lg:block absolute left-0 top-0 bottom-0 w-1 bg-(--explorer-teal)" aria-hidden="true" />}

                      <div className="flex items-start gap-2.5">
                        <span aria-hidden="true">
                          <Avatar initials={initialsOf(j.company)} tone={toneForCompany(j.company)} size="sm" />
                        </span>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-start gap-1.5">
                            <h3 className="font-bold text-[13.5px] text-(--explorer-navy) leading-snug truncate">{j.title}</h3>
                            {isRecent && <span className="shrink-0 mt-0.5"><NewBadge /></span>}
                          </div>
                          <p className="text-[12px] text-(--explorer-muted) truncate">{j.company}</p>
                        </div>
                        <ChevronRight
                          size={15}
                          className="hidden lg:block shrink-0 mt-1 text-(--explorer-blue) opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-[opacity,transform]"
                          aria-hidden="true"
                        />
                      </div>

                      <div className="mt-2 flex flex-wrap items-center gap-x-2.5 gap-y-1 text-[11.5px] text-(--explorer-muted)">
                        <span className="flex items-center gap-1">
                          <MapPin size={10.5} className="shrink-0" aria-hidden="true" />
                          {j.location.split(',')[0]}
                        </span>
                        {j.experience && (
                          <span className="flex items-center gap-1">
                            <TrendingUp size={10.5} className="shrink-0" aria-hidden="true" />
                            {j.experience}
                          </span>
                        )}
                        {j.salary && (
                          <span className="flex items-center gap-1 font-bold text-(--explorer-navy)">
                            <IndianRupee size={10.5} className="shrink-0" aria-hidden="true" />
                            {j.salary}
                          </span>
                        )}
                      </div>

                      <div className="mt-2.5 flex items-center justify-between gap-2">
                        <Pill className={NEUTRAL_PILL}>{j.workMode}</Pill>
                        <span className="flex items-center gap-1 text-[11px] text-(--explorer-muted)">
                          <Clock size={11} className="shrink-0" aria-hidden="true" />
                          {j.postedDaysAgo === 0 ? 'Today' : `${j.postedDaysAgo}d ago`}
                        </span>
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Desktop only — under `lg` there's no side-by-side room, and a
                card tap goes to its own page (pages/JobDetail.jsx) instead. */}
            <div className="hidden lg:block lg:sticky lg:top-24 bg-white border border-(--explorer-border) rounded-xl shadow-[0_1px_2px_rgba(16,42,67,0.04)] p-6 sm:p-7 lg:max-h-184 lg:overflow-y-auto">
              {job && (
                <JobDetailPanel
                  job={job}
                  nextJob={jobs.length > 1 ? jobs[(selected + 1) % jobs.length] : null}
                  onNext={() => setSelected((selected + 1) % jobs.length)}
                />
              )}
            </div>
          </Reveal>
        )}
      </div>
    </section>
  )
}
