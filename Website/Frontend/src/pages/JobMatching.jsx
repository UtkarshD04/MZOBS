import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Sliders, MapPin, Bookmark, Sparkles, BarChart3, Briefcase, Users, ShieldCheck, CheckCircle2, Loader2, ChevronLeft, ChevronRight } from 'lucide-react'
import Card from '../components/ui/Card'
import Badge from '../components/ui/Badge'
import Button from '../components/ui/Button'
import { CompanyLogo } from '../components/ui/Avatar'
import { PillTabs } from '../components/ui/Tabs'
import { Select } from '../components/ui/Field'
import { Skeleton } from '../components/ui/Skeleton'
import EmptyState from '../components/ui/EmptyState'
import { StaggerGroup, StaggerItem } from '../components/ui/Stagger'
import { PageSkeleton } from '../components/ui/Skeleton'
import ErrorState from '../components/ui/ErrorState'
import { categoryOf, trackKeysForCategoryTitle } from '../lib/category'
import { SORT_OPTIONS, parseFiltersFromParams, toParams, hasAnyFilter, resultContextLabel } from '../lib/jobFilters'
import { useApp } from '../context/AppContext'
import { openApplyModal, openJobDetailModal, fmtSalaryRange } from '../lib/modals'
import { useProfileQuery } from '../hooks/useProfile'
import { useJobsPageQuery, useJobFacetsQuery, useJobQuery } from '../hooks/useJobs'
import { useApplicationsQuery } from '../hooks/useApplications'
import { useDebouncedValue } from '../hooks/useDebouncedValue'
import FilterSidebar from '../components/jobs/FilterSidebar'
import FilterChips from '../components/jobs/FilterChips'
import JobFilterDrawer from '../components/jobs/JobFilterDrawer'
import JobTitleAutocomplete from '../components/jobs/JobTitleAutocomplete'
import { hasEmployeeToken } from '../lib/auth'

const SAVED_KEY = 'mzobs-saved-jobs'
const PAGE_SIZE = 20

function JobCard({ job, applied, eligible, authed, saved, employeeTrack, onToggleSave, onApplied }) {
  const app = useApp()
  const cat = categoryOf(job.track)
  const onTrack = !!job.track && job.track === employeeTrack

  return (
    <Card hover pad className="flex gap-4 items-start">
      <CompanyLogo initials={job.logo} tone={cat.tone} />
      <div className="flex-1 min-w-0">
        <div className="flex justify-between flex-wrap gap-2">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <div className="text-[15px] font-semibold">{job.title}</div>
              <Badge tone={cat.tone} dot={false}>
                {cat.label}
              </Badge>
              {onTrack && (
                <Badge tone="gold" icon={<Sparkles size={11} />} dot={false}>
                  Your track
                </Badge>
              )}
            </div>
            <div className="text-[13px] text-ink-secondary mt-0.5">
              {job.company} · {job.location} · {job.workMode}
            </div>
            <div className="text-xs text-ink-tertiary mt-1.5 flex items-center gap-1">
              <Users size={11} /> {job.vacancies} opening{job.vacancies > 1 ? 's' : ''} · Verified employer
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3.5 mt-2.5 text-[13px] flex-wrap">
          <span className="flex items-center gap-1 text-ink-tertiary">
            <MapPin size={12} /> {job.location}
          </span>
          <span>{fmtSalaryRange(job)}</span>
          <span className="text-xs text-ink-tertiary">Posted {job.posted}</span>
        </div>

        <div className="flex flex-wrap gap-1.5 mt-2.5">
          {(job.skills ?? []).map((t) => (
            <span key={t} className="text-[11px] font-semibold text-ink-secondary bg-surface-sunken px-2 py-1 rounded-md">
              {t}
            </span>
          ))}
        </div>

        <div className="flex items-center gap-2 mt-3.5 flex-wrap">
          {applied ? (
            <Badge tone="green" icon={<CheckCircle2 size={11} />} dot={false}>
              Applied — with Mzobs
            </Badge>
          ) : (
            <Button variant="primary" size="sm" disabled={authed && !eligible} onClick={() => openApplyModal(app, job, onApplied)}>
              Apply through Mzobs
            </Button>
          )}
          <Button size="sm" onClick={() => openJobDetailModal(app, job, onApplied)}>
            View details
          </Button>
          <button onClick={onToggleSave} className={`ml-auto p-1.5 rounded-lg ${saved ? 'text-gold-strong' : 'text-ink-tertiary hover:bg-surface-hover hover:text-ink'}`}>
            <Bookmark size={17} fill={saved ? 'currentColor' : 'none'} />
          </button>
        </div>
      </div>
    </Card>
  )
}

function JobListSkeleton() {
  return (
    <div className="flex flex-col gap-4">
      {[1, 2, 3, 4].map((i) => (
        <Card key={i} pad className="flex gap-4 items-start">
          <Skeleton className="w-11 h-11 rounded-xl flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <Skeleton className="w-2/5 h-4" />
            <Skeleton className="w-3/5 h-3 mt-2.5" />
            <Skeleton className="w-1/3 h-3 mt-3.5" />
          </div>
        </Card>
      ))}
    </div>
  )
}

function PaginationBar({ page, limit, total, onPageChange }) {
  const totalPages = Math.max(1, Math.ceil(total / limit))
  if (totalPages <= 1) return null
  return (
    <div className="flex items-center justify-center gap-3 mt-6">
      <Button size="sm" disabled={page <= 1} onClick={() => onPageChange(page - 1)}>
        <ChevronLeft size={14} /> Previous
      </Button>
      <span className="text-xs text-ink-tertiary">
        Page {page} of {totalPages}
      </span>
      <Button size="sm" disabled={page >= totalPages} onClick={() => onPageChange(page + 1)}>
        Next <ChevronRight size={14} />
      </Button>
    </div>
  )
}

// Wraps FilterSidebar for the always-visible desktop sidebar: the Location
// text field is debounced locally before it's committed to the URL/API, so
// typing doesn't fire a request per keystroke, while every other control
// (checkboxes/radios) still commits immediately.
function DesktopFilterPanel({ filters, onCommit, facets, lockedTrack }) {
  const [locationDraft, setLocationDraft] = useState(filters.location)
  useEffect(() => setLocationDraft(filters.location), [filters.location])
  const debouncedLocation = useDebouncedValue(locationDraft, 350)

  useEffect(() => {
    if (debouncedLocation !== filters.location) onCommit({ ...filters, location: debouncedLocation })
    // Intentionally reacting only to the debounced value, not to `filters`/`onCommit` identity.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedLocation])

  function handleChange(next, opts) {
    // An explicit pick from the location autocomplete (a click, or Enter on
    // a highlighted row) should apply immediately, bypassing the debounce
    // that free-form typing goes through.
    if (opts?.immediate) {
      setLocationDraft(next.location)
      onCommit(next)
      return
    }
    if (next.location !== locationDraft) {
      setLocationDraft(next.location)
      return
    }
    onCommit({ ...next, location: filters.location })
  }

  return <FilterSidebar filters={{ ...filters, location: locationDraft }} onChange={handleChange} facets={facets} lockedTrack={lockedTrack} idPrefix="sidebar" />
}

export default function JobMatching() {
  const app = useApp()
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const categoryParam = searchParams.get('category')
  const jobIdParam = searchParams.get('jobId')
  const [tab, setTab] = useState(0)
  const [saved, setSaved] = useState(() => new Set(JSON.parse(localStorage.getItem(SAVED_KEY) ?? '[]')))
  const [autoOpened, setAutoOpened] = useState(false)

  const filters = parseFiltersFromParams(searchParams)
  const page = Math.max(1, Number.parseInt(searchParams.get('page'), 10) || 1)
  const categoryTrackKeys = categoryParam ? trackKeysForCategoryTitle(categoryParam) : null
  const categoryUnavailable = !!categoryParam && categoryTrackKeys.length === 0
  // The query needs the category's tracks folded in, but the sidebar/chips
  // should keep reflecting only what the user actually picked.
  const apiFilters = categoryTrackKeys?.length ? { ...filters, track: [...new Set([...filters.track, ...categoryTrackKeys])] } : filters

  const [qInput, setQInput] = useState(filters.q)
  useEffect(() => setQInput(filters.q), [filters.q])
  const debouncedQ = useDebouncedValue(qInput, 350)

  // Browsing/filtering is public — only fetch the signed-in-only bits
  // (profile, applications) when there's actually a session.
  const authed = hasEmployeeToken()
  const { data: profile, isLoading: profileLoading } = useProfileQuery({ enabled: authed })
  const { data: applications = [], refetch: refetchApplications } = useApplicationsQuery({ enabled: authed })
  const { data: deepLinkedJob } = useJobQuery(jobIdParam)

  const track = profile?.skillTrack
  const lockedTrackForTab = tab === 1 ? track?.key : null

  // On "My track", the department filter is forced to the employee's track
  // (not whatever's in the URL) — apply that same override to the facet
  // query too, so sidebar counts stay consistent with what's listed.
  const queryFilters = tab === 1 && track?.key ? { ...apiFilters, track: [track.key] } : apiFilters
  const listParams = { ...toParams(queryFilters), page: String(page), limit: String(PAGE_SIZE) }
  const savedParams = { ids: [...saved].join(','), limit: String(Math.max(1, Math.min(saved.size, 200))) }

  const isSavedTab = tab === 2
  const isCompareTab = tab === 3
  const showFilterUI = !categoryUnavailable && !isSavedTab && !isCompareTab
  // Neither "no track assigned yet" nor "no saved jobs" should fall back to
  // an unfiltered listing — skip the request entirely and treat it as zero
  // results instead of letting an empty track/ids filter mean "match all".
  const myTrackUnavailable = tab === 1 && !track?.key
  const savedEmpty = isSavedTab && saved.size === 0
  const listQueryEnabled = !categoryUnavailable && !isCompareTab && !myTrackUnavailable && !savedEmpty

  const {
    data: listResult,
    isLoading: listLoading,
    isFetching: listFetching,
    isError: listError,
    refetch: refetchList,
  } = useJobsPageQuery(isSavedTab ? savedParams : listParams, { enabled: listQueryEnabled })
  const { data: facets } = useJobFacetsQuery(toParams(queryFilters), { enabled: showFilterUI })

  const jobs = listResult?.jobs ?? []
  const total = isSavedTab ? saved.size : (listResult?.total ?? 0)
  const limit = listResult?.limit ?? PAGE_SIZE

  useEffect(() => {
    localStorage.setItem(SAVED_KEY, JSON.stringify([...saved]))
  }, [saved])

  // Debounced keyword search — commits to the URL (and therefore the API
  // request) ~350ms after the user stops typing, and drops stale filter
  // context (page/jobId/category) since a new search supersedes it.
  useEffect(() => {
    if (debouncedQ === filters.q) return
    commitFilters({ ...filters, q: debouncedQ })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedQ])

  // "Most relevant" only makes sense with an active keyword search.
  useEffect(() => {
    if (!filters.q && filters.sort === 'relevance') commitFilters({ ...filters, sort: 'newest' })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.q, filters.sort])

  // Arrived via a job's "Apply now" link on the marketing site (?jobId=) —
  // fetch that job directly (regardless of current filters/pagination) and
  // jump straight into the apply modal for it.
  useEffect(() => {
    if (!jobIdParam || autoOpened || !deepLinkedJob) return
    openApplyModal(app, deepLinkedJob, refetchApplications)
    setAutoOpened(true)
  }, [jobIdParam, autoOpened, deepLinkedJob, app, refetchApplications])

  function commitFilters(next) {
    setSearchParams(toParams(next), { replace: false })
  }

  function goToPage(nextPage) {
    const next = new URLSearchParams(searchParams)
    if (nextPage > 1) next.set('page', String(nextPage))
    else next.delete('page')
    setSearchParams(next, { replace: false })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function selectTab(i) {
    setTab(i)
    const next = new URLSearchParams(searchParams)
    next.delete('page')
    setSearchParams(next, { replace: true })
  }

  function clearAllFilters() {
    setQInput('')
    setSearchParams({}, { replace: false })
  }

  function openFilterDrawer() {
    app.openSidePanel(
      <JobFilterDrawer
        filters={filters}
        facets={facets}
        lockedTrack={lockedTrackForTab}
        onClose={app.closeSidePanel}
        onApply={(draft) => {
          commitFilters(draft)
          app.closeSidePanel()
        }}
      />,
      380
    )
  }

  function toggleSave(id) {
    setSaved((s) => {
      const next = new Set(s)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  if (profileLoading) return <PageSkeleton />
  if (listError) return <ErrorState onRetry={refetchList} />

  const eligible = profile?.resume?.status === 'verified'
  // Applications come back with `job` populated (for title/company display
  // elsewhere), and a populated ref keeps its object shape rather than
  // collapsing to the `jobId` string form — so read the id from there.
  const appliedJobIds = new Set(applications.map((a) => a.job?.id))
  const activeFilterCount = filters.workMode.length + filters.employmentType.length + filters.track.length + filters.skills.length + (filters.location ? 1 : 0) + (filters.experience ? 1 : 0) + (filters.salary ? 1 : 0) + (filters.postedWithin ? 1 : 0) + filters.company.length

  const cardProps = (job) => ({
    job,
    applied: appliedJobIds.has(job.id),
    eligible,
    authed,
    saved: saved.has(job.id),
    employeeTrack: track?.key,
    onToggleSave: () => toggleSave(job.id),
    onApplied: refetchApplications,
  })

  const companyNameOf = (id) => facets?.companies?.find((c) => c.id === id)?.name

  return (
    <StaggerGroup>
      <StaggerItem className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Job Openings</h1>
        <p className="text-sm text-ink-secondary mt-1">
          Live requirements from companies verified by Mzobs. Applying sends your profile to our team — never straight to the employer.
        </p>
      </StaggerItem>

      <StaggerItem className="mb-5">
        <Card pad className={`flex items-start gap-3 ${eligible ? 'border-navy-ring bg-navy-tint' : 'border-gold-dot/40 bg-gold-tint'}`}>
          <ShieldCheck size={18} className={`mt-0.5 flex-shrink-0 ${eligible ? 'text-navy' : 'text-gold-strong'}`} />
          <div className="flex-1 min-w-0">
            <div className="text-[13.5px] font-semibold">
              {!authed
                ? 'Sign in to apply for openings'
                : eligible
                  ? `You're eligible to apply${track?.key ? ` — ${track.label || track.key}, Grade ${track.grade || '-'}` : ''}`
                  : 'Finish verification to unlock applications'}
            </div>
            <p className="text-[13px] text-ink-secondary mt-0.5">
              {!authed
                ? 'Browse and filter freely. Sign in (or create a free account) when you find a role you want — applying sends your profile to our team, never straight to the employer.'
                : eligible
                  ? 'Your resume is verified. When you apply, Mzobs screens you, shortlists against the requirement, and forwards your resume to the company.'
                  : 'Applications open once your resume is verified by the Mzobs team.'}
            </p>
          </div>
        </Card>
      </StaggerItem>

      {categoryUnavailable ? (
        <>
          <StaggerItem className="flex items-center justify-between flex-wrap gap-3 mb-4">
            <Badge tone="navy" dot={false}>
              Filtered by {categoryParam}
            </Badge>
            <Button size="sm" onClick={() => navigate('/app/jobs')}>
              Clear filter · All openings
            </Button>
          </StaggerItem>
          <StaggerItem>
            <Card>
              <EmptyState
                icon={Briefcase}
                title="No openings available right now"
                body={`We don't have any live ${categoryParam} requirements at the moment. Check back soon, or browse everything that's open.`}
                action={
                  <Button variant="primary" className="mt-2" onClick={() => navigate('/app/jobs')}>
                    Browse all openings
                  </Button>
                }
              />
            </Card>
          </StaggerItem>
        </>
      ) : (
        <>
          <StaggerItem className="flex items-center justify-between flex-wrap gap-3 mb-4">
            <PillTabs items={['All openings', 'My track', 'Saved', 'Compare']} active={tab} onChange={selectTab} />
            {showFilterUI && (
              <div className="flex gap-2">
                <Button size="sm" className="lg:hidden relative" onClick={openFilterDrawer}>
                  <Sliders size={14} /> Filters
                  {activeFilterCount > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 w-[18px] h-[18px] rounded-full bg-navy text-white text-[10px] font-bold flex items-center justify-center">
                      {activeFilterCount}
                    </span>
                  )}
                </Button>
                <Select className="h-8 text-[12.5px]" value={filters.sort} onChange={(e) => commitFilters({ ...filters, sort: e.target.value })}>
                  {SORT_OPTIONS.filter((o) => o.value !== 'relevance' || filters.q).map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </Select>
              </div>
            )}
          </StaggerItem>

          {showFilterUI && (
            <StaggerItem className="mb-4">
              <JobTitleAutocomplete
                value={qInput}
                debouncedValue={debouncedQ}
                onChange={setQInput}
                onCommit={(text) => commitFilters({ ...filters, q: text })}
              />
            </StaggerItem>
          )}

          {categoryTrackKeys?.length ? (
            <StaggerItem className="flex items-center justify-between flex-wrap gap-3 mb-3">
              <Badge tone="navy" dot={false}>
                Filtered by {categoryParam}
              </Badge>
              <Button size="sm" onClick={() => navigate('/app/jobs')}>
                Clear filter · All openings
              </Button>
            </StaggerItem>
          ) : null}

          {showFilterUI && <FilterChips filters={filters} onChange={commitFilters} onClearAll={clearAllFilters} companyNameOf={companyNameOf} />}

          <StaggerItem className={showFilterUI ? 'lg:grid lg:grid-cols-[280px_1fr] lg:gap-6 lg:items-start' : ''}>
            {showFilterUI && (
              <aside className="hidden lg:block lg:sticky lg:top-[92px]">
                <Card pad className="max-h-[calc(100vh-116px)] overflow-y-auto">
                  <DesktopFilterPanel filters={filters} onCommit={commitFilters} facets={facets} lockedTrack={lockedTrackForTab} />
                </Card>
              </aside>
            )}

            <div className="min-w-0">
              {showFilterUI && (
                <div className="flex items-center gap-2 text-[13px] text-ink-secondary mb-3.5">
                  <span>
                    <b className="text-ink">{total}</b> job{total === 1 ? '' : 's'} found {resultContextLabel(filters)}
                  </span>
                  {listFetching && !listLoading && (
                    <span className="flex items-center gap-1 text-ink-tertiary text-xs">
                      <Loader2 size={12} className="animate-spin" /> Updating…
                    </span>
                  )}
                </div>
              )}

              {tab === 3 ? (
                <Card>
                  <EmptyState
                    icon={BarChart3}
                    title="Select openings to compare"
                    body="Choose up to 3 roles to compare salary, location and requirements side by side."
                    action={
                      <Button variant="primary" className="mt-2" onClick={() => selectTab(0)}>
                        Go to all openings
                      </Button>
                    }
                  />
                </Card>
              ) : isSavedTab && saved.size === 0 ? (
                <Card>
                  <EmptyState
                    icon={Bookmark}
                    title="No saved openings yet"
                    body="Tap the bookmark icon on any opening to save it for later."
                    action={
                      <Button variant="primary" className="mt-2" onClick={() => selectTab(0)}>
                        Browse all openings
                      </Button>
                    }
                  />
                </Card>
              ) : listLoading ? (
                <JobListSkeleton />
              ) : jobs.length ? (
                <>
                  <div className="flex flex-col gap-4">
                    {jobs.map((j) => (
                      <JobCard key={j.id} {...cardProps(j)} />
                    ))}
                  </div>
                  {!isSavedTab && <PaginationBar page={page} limit={limit} total={total} onPageChange={goToPage} />}
                </>
              ) : (
                <Card>
                  <EmptyState
                    icon={tab === 1 ? Sparkles : Briefcase}
                    title={tab === 1 && !track?.key ? 'No track assigned yet' : 'No matching openings'}
                    body={
                      tab === 1 && !track?.key
                        ? 'Complete your mock interview to get a skill track assigned.'
                        : 'Try removing a few filters or searching a broader term — new requirements post here as employers pay for sourcing.'
                    }
                    action={
                      <div className="flex gap-2 mt-2 flex-wrap justify-center">
                        {hasAnyFilter(filters) && (
                          <Button variant="primary" onClick={clearAllFilters}>
                            Clear filters
                          </Button>
                        )}
                        <Button onClick={() => selectTab(0)}>Browse all openings</Button>
                      </div>
                    }
                  />
                </Card>
              )}
            </div>
          </StaggerItem>
        </>
      )}
    </StaggerGroup>
  )
}
