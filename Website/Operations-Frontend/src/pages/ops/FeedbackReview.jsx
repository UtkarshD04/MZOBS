import { useEffect, useMemo, useState } from 'react'
import { ChevronLeft, ChevronRight, MessageSquareText, RefreshCw, Search, X } from 'lucide-react'
import Card from '../../components/ui/Card'
import Badge from '../../components/ui/Badge'
import Button from '../../components/ui/Button'
import CountUp from '../../components/ui/CountUp'
import { PillTabs } from '../../components/ui/Tabs'
import EmptyState from '../../components/ui/EmptyState'
import ErrorState from '../../components/ui/ErrorState'
import { StaggerGroup, StaggerItem } from '../../components/ui/Stagger'
import { Skeleton } from '../../components/ui/Skeleton'
import { Select } from '../../components/ui/Field'
import ReviewModal from '../../components/feedback/ReviewModal'
import FollowUpList from '../../components/feedback/FollowUpList'
import { useApp } from '../../lib/appContext'
import { useFeedbackCountsQuery, useFeedbackFiltersQuery, useFeedbackListQuery, useFollowUpsQuery, useRetryNotificationMutation } from '../../hooks/useFeedback'
import { DISPUTE_LABEL, NOTIFICATION_LABEL, NOTIFICATION_TONE, QUEUES, STATUS_LABEL, STATUS_TONE, dateOnly, dateTime, errorMessage } from '../../components/feedback/shared'

const PAGE_SIZE = 10
const EMPTY_FILTERS = { q: '', company: '', job: '', stage: '', from: '', to: '' }

const EMPTY_COPY = {
  pending_review: { title: 'Nothing is waiting for review', body: 'New items appear here when an employer rejects a candidate and submits feedback.', next: { label: 'Check employer follow-ups', queue: 'followUp' } },
  approved: { title: 'No feedback has been approved yet', body: 'Approved feedback, who approved it and whether the candidate was notified will be listed here.', next: { label: 'Go to Pending review', queue: 'pending_review' } },
  returned: { title: 'Nothing is waiting on an employer correction', body: 'Feedback you send back to an employer shows up here until they resubmit it.', next: { label: 'Go to Pending review', queue: 'pending_review' } },
  attention: { title: 'No flagged or disputed feedback', body: 'Items you flag, or that a candidate reports, are tracked here until they are resolved.', next: { label: 'Go to Pending review', queue: 'pending_review' } },
  followUp: { title: 'No employers need chasing', body: 'A case opens automatically when a rejected candidate has had no feedback for over 24 hours, or returned feedback has gone unanswered for 3 days.', next: { label: 'Go to Pending review', queue: 'pending_review' } },
}

function useDebounced(value, ms = 300) {
  const [debounced, setDebounced] = useState(value)
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), ms)
    return () => clearTimeout(t)
  }, [value, ms])
  return debounced
}

function RetryButton({ id }) {
  const app = useApp()
  const retry = useRetryNotificationMutation()
  return (
    <Button size="sm" disabled={retry.isPending} onClick={() => retry.mutate(id, { onSuccess: () => app.addToast('success', 'Candidate notified.'), onError: (err) => app.addToast('error', errorMessage(err)) })}>
      <RefreshCw size={13} aria-hidden="true" /> {retry.isPending ? 'Retrying…' : 'Retry notification'}
    </Button>
  )
}

function FeedbackRow({ row, queue, onOpen }) {
  const pending = row.status === 'pending_review'
  return (
    <Card hover pad>
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[14.5px] font-semibold">{row.candidateName || 'Candidate'}</span>
            <Badge tone={STATUS_TONE[row.status] ?? 'gray'}>{STATUS_LABEL[row.status] ?? row.status}</Badge>
            {row.dispute && row.dispute.status !== 'resolved' && <Badge tone="red" dot={false}>Report: {DISPUTE_LABEL[row.dispute.status]}</Badge>}
          </div>
          <p className="text-xs text-ink-tertiary mt-1.5">
            {row.jobTitle || 'Role'} · {row.companyName} · {row.stageLabel} · rejected {dateOnly(row.rejectedAt)}
          </p>
          <p className="text-[11.5px] text-ink-tertiary mt-0.5">Application ID <code>{row.applicationId}</code></p>
          <div className="flex flex-wrap gap-1.5 mt-2">
            {row.reasons.map((r) => <Badge key={r.code} tone="gray" dot={false}>{r.label}</Badge>)}
          </div>
          {queue !== 'approved' && row.employerFeedback && <p className="text-[13px] text-ink-secondary mt-2 line-clamp-2"><span className="font-semibold text-ink">Employer: </span>{row.employerFeedback}</p>}
          {queue === 'returned' && row.returnReason && <p className="text-[12.5px] text-ink-secondary mt-1.5"><span className="font-semibold text-ink">Returned {dateOnly(row.returnedAt)}: </span>{row.returnReason}</p>}
          {queue === 'approved' && (
            <div className="mt-2 flex items-center gap-2 flex-wrap text-[12.5px] text-ink-secondary">
              <span>Approved {dateTime(row.approvedAt)} by {row.approvedByName || 'a reviewer'} · v{row.version}</span>
              {row.notification && <Badge tone={NOTIFICATION_TONE[row.notification.status] ?? 'gray'}>{NOTIFICATION_LABEL[row.notification.status]}</Badge>}
              {row.notification && (row.notification.status === 'failed' || row.notification.status === 'pending') && <RetryButton id={row.id} />}
            </div>
          )}
        </div>
        <div className="flex flex-wrap gap-2 justify-end">
          <Button size="sm" onClick={() => onOpen(row, 'details')}>View details</Button>
          {pending && (
            <>
              <Button size="sm" variant="primary" onClick={() => onOpen(row, 'approve')}>Approve</Button>
              <Button size="sm" onClick={() => onOpen(row, 'return')}>Return</Button>
              <Button size="sm" onClick={() => onOpen(row, 'flag')}>Flag / dispute</Button>
            </>
          )}
          <Button size="sm" onClick={() => onOpen(row, 'application')}>View application</Button>
        </div>
      </div>
    </Card>
  )
}

function Pagination({ page, total, onPage }) {
  const pages = Math.max(1, Math.ceil(total / PAGE_SIZE))
  if (total <= PAGE_SIZE) return null
  const from = (page - 1) * PAGE_SIZE + 1
  const to = Math.min(total, page * PAGE_SIZE)
  return (
    <nav className="mt-4 flex items-center justify-between gap-3" aria-label="Pagination">
      <span className="text-[12.5px] text-ink-tertiary">Showing {from}–{to} of {total}</span>
      <div className="flex gap-2">
        <Button size="sm" disabled={page <= 1} onClick={() => onPage(page - 1)} aria-label="Previous page"><ChevronLeft size={14} aria-hidden="true" /> Previous</Button>
        <Button size="sm" disabled={page >= pages} onClick={() => onPage(page + 1)} aria-label="Next page">Next <ChevronRight size={14} aria-hidden="true" /></Button>
      </div>
    </nav>
  )
}

export default function FeedbackReview() {
  const app = useApp()
  const [queueIndex, setQueueIndex] = useState(0)
  const [filters, setFilters] = useState(EMPTY_FILTERS)
  const [page, setPage] = useState(1)
  const queue = QUEUES[queueIndex]
  const isFollowUp = queue.key === 'followUp'
  const debouncedQ = useDebounced(filters.q)

  const params = useMemo(() => ({ ...filters, q: debouncedQ, status: queue.status, page, limit: PAGE_SIZE }), [filters, debouncedQ, queue.status, page])
  const followUpParams = useMemo(() => ({ q: debouncedQ, page, limit: PAGE_SIZE }), [debouncedQ, page])

  const { data: counts, isError: countsError } = useFeedbackCountsQuery()
  const { data: filterOptions } = useFeedbackFiltersQuery()
  const list = useFeedbackListQuery(params)
  const followUps = useFollowUpsQuery(followUpParams, isFollowUp)
  const active = isFollowUp ? followUps : list
  const rows = active.data?.rows ?? []
  const total = active.data?.total ?? 0

  const filtersActive = Object.values(filters).some(Boolean)
  const setFilter = (key, value) => {
    setFilters((f) => ({ ...f, [key]: value, ...(key === 'company' ? { job: '' } : {}) }))
    setPage(1)
  }
  const openQueue = (index) => {
    setQueueIndex(index)
    setPage(1)
  }
  const clearFilters = () => {
    setFilters(EMPTY_FILTERS)
    setPage(1)
  }
  const jobs = (filterOptions?.jobs ?? []).filter((j) => !filters.company || j.companyId === filters.company)
  const openDetail = (row, intent) => app.openModal(<ReviewModal app={app} id={row.id} intent={intent} />, true)

  // A page can end up past the last one after an action empties it.
  const lastPage = Math.max(1, Math.ceil(total / PAGE_SIZE))
  const pastEnd = rows.length === 0 && total > 0 && page > lastPage

  const empty = EMPTY_COPY[queue.key]

  return (
    <StaggerGroup>
      <StaggerItem className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Rejection feedback</h1>
        <p className="text-sm text-ink-secondary mt-1">Review what employers say when they reject a candidate. Only what you approve reaches the candidate.</p>
      </StaggerItem>

      <StaggerItem className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-5">
        {QUEUES.map((q, i) => (
          <Card key={q.key} hover pad onClick={() => openQueue(i)} className={`cursor-pointer ${i === queueIndex ? 'ring-2 ring-navy' : ''}`} role="button" tabIndex={0} aria-pressed={i === queueIndex} aria-label={`${q.label}: ${counts?.[q.count] ?? 0}`} onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), openQueue(i))}>
            <span className="text-xs font-semibold tracking-wide uppercase text-ink-tertiary">{q.label}</span>
            <div className={`text-[28px] font-bold tracking-tight mt-2 ${q.tone}`}>
              {countsError ? '—' : <CountUp value={counts?.[q.count] ?? 0} />}
            </div>
          </Card>
        ))}
      </StaggerItem>

      <StaggerItem className="mb-3">
        <PillTabs items={QUEUES.map((q) => q.label)} active={queueIndex} onChange={openQueue} />
      </StaggerItem>

      <StaggerItem className="mb-4">
        <div className="flex flex-wrap items-center gap-2" role="search">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-tertiary" aria-hidden="true" />
            <input
              value={filters.q}
              onChange={(e) => setFilter('q', e.target.value)}
              placeholder="Search candidate, application ID, company or job"
              aria-label="Search feedback"
              className="h-9 pl-8 pr-3 rounded-[9px] border border-border-strong bg-surface text-[12.5px] w-[300px] max-sm:w-full outline-none focus:border-navy focus:shadow-[0_0_0_3.5px_var(--color-navy-ring)]"
            />
          </div>
          {!isFollowUp && (
            <>
              <div className="w-[170px] max-sm:w-full"><Select aria-label="Company" value={filters.company} onChange={(e) => setFilter('company', e.target.value)} className="!h-9 !text-[12.5px]"><option value="">All companies</option>{(filterOptions?.companies ?? []).map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}</Select></div>
              <div className="w-[170px] max-sm:w-full"><Select aria-label="Job" value={filters.job} onChange={(e) => setFilter('job', e.target.value)} className="!h-9 !text-[12.5px]"><option value="">All jobs</option>{jobs.map((j) => <option key={j.id} value={j.id}>{j.title}</option>)}</Select></div>
              <div className="w-[170px] max-sm:w-full"><Select aria-label="Application stage" value={filters.stage} onChange={(e) => setFilter('stage', e.target.value)} className="!h-9 !text-[12.5px]"><option value="">All stages</option>{(filterOptions?.stages ?? []).map((s) => <option key={s.code} value={s.code}>{s.label}</option>)}</Select></div>
              <label className="flex items-center gap-1.5 text-[12px] text-ink-tertiary">From <input type="date" value={filters.from} onChange={(e) => setFilter('from', e.target.value)} className="h-9 px-2 rounded-[9px] border border-border-strong bg-surface text-[12.5px] text-ink" /></label>
              <label className="flex items-center gap-1.5 text-[12px] text-ink-tertiary">To <input type="date" value={filters.to} onChange={(e) => setFilter('to', e.target.value)} className="h-9 px-2 rounded-[9px] border border-border-strong bg-surface text-[12.5px] text-ink" /></label>
            </>
          )}
          {filtersActive && <Button size="sm" onClick={clearFilters}><X size={13} aria-hidden="true" /> Clear filters</Button>}
        </div>
      </StaggerItem>

      <StaggerItem>
        <div aria-live="polite">
          {active.isLoading ? (
            <div className="flex flex-col gap-3" aria-label="Loading">{[0, 1, 2].map((i) => <Skeleton key={i} className="h-[112px] rounded-2xl" />)}</div>
          ) : active.isError ? (
            <ErrorState title="Couldn't load this queue" body={errorMessage(active.error, 'We could not reach the server. Check your connection and try again.')} onRetry={() => active.refetch()} />
          ) : pastEnd ? (
            <Card>
              <EmptyState icon={MessageSquareText} title="That page is now empty" body="Items on it were handled, so there is nothing left here." action={<Button onClick={() => setPage(lastPage)}>Go to the last page</Button>} />
            </Card>
          ) : rows.length === 0 ? (
            <Card>
              {filtersActive ? (
                <EmptyState icon={Search} title="No matches" body="Nothing in this queue matches your search or filters." action={<Button onClick={clearFilters}>Clear filters</Button>} />
              ) : (
                <EmptyState icon={MessageSquareText} title={empty.title} body={empty.body} action={<Button onClick={() => openQueue(QUEUES.findIndex((q) => q.key === empty.next.queue))}>{empty.next.label}</Button>} />
              )}
            </Card>
          ) : isFollowUp ? (
            <FollowUpList rows={rows} />
          ) : (
            <div className="flex flex-col gap-3">
              {rows.map((row) => <FeedbackRow key={row.id} row={row} queue={queue.key} onOpen={openDetail} />)}
            </div>
          )}
        </div>
        {!active.isLoading && !active.isError && <Pagination page={page} total={total} onPage={setPage} />}
      </StaggerItem>
    </StaggerGroup>
  )
}
