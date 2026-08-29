import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Bell, CalendarPlus, Download, GraduationCap, MapPin, Search, ThumbsDown, ThumbsUp, Users, Wallet } from 'lucide-react'
import PageHeader from '../components/layout/PageHeader'
import Card, { CardBody } from '../components/ui/Card'
import Button from '../components/ui/Button'
import { Input, Select, Field, Textarea } from '../components/ui/Field'
import { PillTabs } from '../components/ui/Tabs'
import Avatar from '../components/ui/Avatar'
import { CandidateStageBadge } from '../components/ui/StatusBadge'
import { ResumeVerifiedBadge, IdentityVerifiedBadge } from '../components/ui/VerifiedBadge'
import EmptyState from '../components/ui/EmptyState'
import ErrorState from '../components/ui/ErrorState'
import { CardListSkeleton } from '../components/ui/Skeleton'
import Pagination from '../components/ui/Pagination'
import Modal from '../components/ui/Modal'
import { useCandidatesQuery, useSetCandidateStage } from '../hooks/useCandidates'
import { useJobsQuery } from '../hooks/useJobs'
import { useSendCandidateNotification } from '../hooks/useNotifications'

const STAGE_TABS = [
  { label: 'All', value: 'all' },
  { label: 'Shared', value: 'shared' },
  { label: 'Shortlisted', value: 'shortlisted' },
  { label: 'Interviewing', value: 'interviewing' },
  { label: 'Offered', value: 'offered' },
  { label: 'Hired', value: 'hired' },
  { label: 'Rejected', value: 'rejected' },
]

const PAGE_SIZE = 6

export default function Candidates() {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [tab, setTab] = useState(0)
  const [jobId, setJobId] = useState('all')
  const [page, setPage] = useState(1)
  const [rejectTarget, setRejectTarget] = useState(null)
  const [rejectReason, setRejectReason] = useState('')
  const [selectedIds, setSelectedIds] = useState([])
  const [notifyTargetIds, setNotifyTargetIds] = useState(null)
  const [notifyTitle, setNotifyTitle] = useState('')
  const [notifyBody, setNotifyBody] = useState('')

  const stage = STAGE_TABS[tab].value
  const { data: candidates = [], isLoading, isError, refetch } = useCandidatesQuery({ search, stage, jobId })
  const { data: jobs = [] } = useJobsQuery()
  const setStage = useSetCandidateStage()
  const sendNotification = useSendCandidateNotification()

  function toggleSelected(id) {
    setSelectedIds((ids) => (ids.includes(id) ? ids.filter((x) => x !== id) : [...ids, id]))
  }

  function closeNotifyModal() {
    setNotifyTargetIds(null)
    setNotifyTitle('')
    setNotifyBody('')
  }

  function submitNotify() {
    sendNotification.mutate(
      { candidateIds: notifyTargetIds, title: notifyTitle, body: notifyBody },
      {
        onSuccess: () => {
          setSelectedIds((ids) => ids.filter((id) => !notifyTargetIds.includes(id)))
          closeNotifyModal()
        },
      }
    )
  }

  const pageCount = Math.max(1, Math.ceil(candidates.length / PAGE_SIZE))
  const paged = useMemo(() => candidates.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE), [candidates, page])

  return (
    <div>
      <PageHeader
        title="Shared Profiles"
        subtitle="Profiles Mzobs has delivered against your paid requirements. Raw applications stay with Mzobs — what reaches you is already verified, mock-interviewed and shortlisted."
      />

      <Card className="mb-5">
        <CardBody className="flex items-center gap-3 flex-wrap">
          <div className="relative flex-1 min-w-[220px]">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-tertiary" />
            <Input value={search} onChange={(e) => { setSearch(e.target.value); setPage(1) }} placeholder="Search by name, role or skill…" className="pl-9" />
          </div>
          <Select value={jobId} onChange={(e) => { setJobId(e.target.value); setPage(1) }} className="w-56">
            <option value="all">All jobs</option>
            {jobs.map((j) => (
              <option key={j.id} value={j.id}>{j.title}</option>
            ))}
          </Select>
          {selectedIds.length > 0 && (
            <Button variant="secondary" size="sm" onClick={() => setNotifyTargetIds(selectedIds)}>
              <Bell size={14} /> Notify {selectedIds.length} selected
            </Button>
          )}
        </CardBody>
        <div className="px-[22px] pb-[18px]">
          <PillTabs items={STAGE_TABS.map((t) => t.label)} active={tab} onChange={(i) => { setTab(i); setPage(1) }} />
        </div>
      </Card>

      {isLoading ? (
        <CardListSkeleton count={6} />
      ) : isError ? (
        <ErrorState onRetry={() => refetch()} />
      ) : candidates.length === 0 ? (
        <Card>
          <EmptyState icon={Users} title="No profiles yet" body="Once you pay for a requirement, Mzobs delivers five screened profiles per opening and they land right here." />
        </Card>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-4 max-lg:grid-cols-1">
            {paged.map((c) => (
              <Card key={c.id} hover pad className="flex flex-col">
                <div className="flex items-start gap-3.5">
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(c.id)}
                    onChange={() => toggleSelected(c.id)}
                    className="accent-navy w-[15px] h-[15px] mt-1"
                  />
                  <Avatar initials={c.initials} size="md" />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <button onClick={() => navigate(`/candidates/${c.id}`)} className="text-[14.5px] font-semibold hover:text-navy hover:underline truncate">{c.name}</button>
                      <CandidateStageBadge status={c.stage} />
                    </div>
                    <div className="text-[12.5px] text-ink-secondary mt-0.5">{c.headline}</div>
                    <div className="text-[12px] text-ink-tertiary mt-0.5">Applied for {c.appliedFor}</div>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 flex-wrap mt-3">
                  <ResumeVerifiedBadge />
                  <IdentityVerifiedBadge />
                </div>

                <div className="grid grid-cols-2 gap-2.5 mt-3.5 text-[12px] text-ink-secondary">
                  <span className="flex items-center gap-1.5"><MapPin size={13} className="text-ink-tertiary" /> {c.location}</span>
                  <span className="flex items-center gap-1.5"><Wallet size={13} className="text-ink-tertiary" /> {c.expectedSalary}</span>
                  <span className="flex items-center gap-1.5"><GraduationCap size={13} className="text-ink-tertiary" /> {c.education[0]?.degree ?? '—'}</span>
                  <span className="flex items-center gap-1.5">{c.experienceYears} yrs experience</span>
                </div>

                <div className="flex flex-wrap gap-1.5 mt-3.5">
                  {c.skills.slice(0, 4).map((s) => (
                    <span key={s} className="text-[11px] font-medium px-2 py-[3px] rounded-full bg-surface-sunken text-ink-secondary">{s}</span>
                  ))}
                  {c.skills.length > 4 && <span className="text-[11px] font-medium px-2 py-[3px] text-ink-tertiary">+{c.skills.length - 4} more</span>}
                </div>

                <div className="flex items-center gap-2 mt-4 pt-3.5 border-t border-border flex-wrap">
                  <Button variant="secondary" size="sm" onClick={() => navigate(`/candidates/${c.id}`)}>View Profile</Button>
                  <Button variant="ghost" size="sm" iconOnly title="Download resume" onClick={() => window.print()}>
                    <Download size={15} />
                  </Button>
                  <Button variant="ghost" size="sm" iconOnly title="Send notification" onClick={() => setNotifyTargetIds([c.id])}>
                    <Bell size={15} />
                  </Button>
                  <div className="ml-auto flex items-center gap-2">
                    {c.stage !== 'rejected' && c.stage !== 'hired' && (
                      <>
                        <Button variant="gold" size="sm" onClick={() => setStage.mutate({ id: c.id, stage: 'shortlisted' })}>
                          <ThumbsUp size={14} /> Shortlist
                        </Button>
                        <Button variant="danger" size="sm" onClick={() => setRejectTarget(c.id)}>
                          <ThumbsDown size={14} /> Reject
                        </Button>
                        <Button variant="primary" size="sm" onClick={() => navigate('/interviews')}>
                          <CalendarPlus size={14} /> Schedule
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
          <Pagination page={page} pageCount={pageCount} onChange={setPage} total={candidates.length} pageSize={PAGE_SIZE} />
        </>
      )}

      <Modal
        open={!!rejectTarget}
        onClose={() => setRejectTarget(null)}
        title="Reject candidate"
        subtitle="This candidate will be moved out of your active pipeline."
        size="sm"
        footer={
          <>
            <Button variant="secondary" size="sm" onClick={() => setRejectTarget(null)}>Cancel</Button>
            <Button
              variant="danger"
              size="sm"
              loading={setStage.isPending}
              onClick={() => {
                if (rejectTarget) setStage.mutate({ id: rejectTarget, stage: 'rejected', reason: rejectReason || undefined })
                setRejectTarget(null)
                setRejectReason('')
              }}
            >
              Confirm Reject
            </Button>
          </>
        }
      >
        <Field label="Reason" optional hint="Shared internally with your hiring team only.">
          <Textarea rows={3} value={rejectReason} onChange={(e) => setRejectReason(e.target.value)} placeholder="e.g. Not enough hands-on experience with distributed systems" />
        </Field>
      </Modal>

      <Modal
        open={!!notifyTargetIds}
        onClose={closeNotifyModal}
        title="Send notification"
        subtitle={notifyTargetIds?.length === 1 ? 'Sent to this candidate as an in-app + push notification.' : `Sent to ${notifyTargetIds?.length ?? 0} candidates as an in-app + push notification.`}
        size="sm"
        footer={
          <>
            <Button variant="secondary" size="sm" onClick={closeNotifyModal}>Cancel</Button>
            <Button variant="primary" size="sm" loading={sendNotification.isPending} disabled={!notifyTitle.trim() || !notifyBody.trim()} onClick={submitNotify}>
              Send
            </Button>
          </>
        }
      >
        <Field label="Title">
          <Input value={notifyTitle} onChange={(e) => setNotifyTitle(e.target.value)} placeholder="e.g. Update on your application" maxLength={120} />
        </Field>
        <Field label="Message">
          <Textarea rows={3} value={notifyBody} onChange={(e) => setNotifyBody(e.target.value)} placeholder="What do you want to tell them?" maxLength={500} />
        </Field>
      </Modal>
    </div>
  )
}
