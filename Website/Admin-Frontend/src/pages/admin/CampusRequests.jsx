import { useMemo, useState } from 'react'
import { GraduationCap, Search, MapPin, Mail, Phone, Globe } from 'lucide-react'
import Card from '../../components/ui/Card'
import Badge from '../../components/ui/Badge'
import Button from '../../components/ui/Button'
import CountUp from '../../components/ui/CountUp'
import { PillTabs } from '../../components/ui/Tabs'
import EmptyState from '../../components/ui/EmptyState'
import { StaggerGroup, StaggerItem } from '../../components/ui/Stagger'
import { PageSkeleton } from '../../components/ui/Skeleton'
import ErrorState from '../../components/ui/ErrorState'
import { ModalHead, ModalBody, ModalFoot } from '../../components/ui/Modal'
import { Field, Textarea } from '../../components/ui/Field'
import { useApp } from '../../lib/appContext'
import { useCampusRequestsQuery, useCampusRequestStatsQuery, useUpdateCampusRequestMutation } from '../../hooks/useCampusRequests'

const STATUSES = ['pending', 'under_review', 'verified', 'rejected']
const LABEL = { pending: 'Pending', under_review: 'Under Review', verified: 'Verified', rejected: 'Rejected' }
const TABS = ['All', ...STATUSES.map((s) => LABEL[s])]
const STATUS_TONE = { pending: 'gold', under_review: 'navy', verified: 'green', rejected: 'gray' }
const STAT_TONE = { All: 'text-ink', pending: 'text-gold-strong', under_review: 'text-navy', verified: 'text-green', rejected: 'text-ink-tertiary' }

const fmtDate = (d) => new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })

function Row({ label, children }) {
  return (
    <div>
      <span className="text-ink-tertiary">{label} · </span>
      <span className="font-semibold break-words">{children || '—'}</span>
    </div>
  )
}

function DetailModal({ app, item }) {
  const [notes, setNotes] = useState(item.notes || '')
  const update = useUpdateCampusRequestMutation()

  function setStatus(status, message) {
    update.mutate(
      { id: item.id, status, notes },
      {
        onSuccess: () => {
          app.closeModal()
          app.addToast('success', message)
        },
        onError: (err) => app.addToast('error', err.response?.data?.message ?? 'Something went wrong'),
      }
    )
  }

  const busy = update.isPending

  return (
    <>
      <ModalHead title={item.campusName} onClose={app.closeModal} />
      <ModalBody>
        <div className="rounded-xl bg-surface-sunken p-3.5 mb-4 grid grid-cols-1 sm:grid-cols-2 gap-2 text-[12.5px]">
          <Row label="Status"><Badge tone={STATUS_TONE[item.status] ?? 'gray'}>{LABEL[item.status] ?? item.status}</Badge></Row>
          <Row label="Institution type">{item.institutionType}</Row>
          <Row label="Contact person">{item.contactPerson}</Row>
          <Row label="Phone">{item.phone}</Row>
          <Row label="Official email">{item.officialEmail}</Row>
          <Row label="Website">{item.website}</Row>
          <Row label="City">{item.city}</Row>
          <Row label="State">{item.state}</Row>
          <Row label="Student strength">{item.studentStrength?.toLocaleString('en-IN')}</Row>
          <Row label="Submitted">{new Date(item.createdAt).toLocaleString('en-IN')}</Row>
        </div>

        <div className="mb-4">
          <div className="text-[11px] font-semibold tracking-wider uppercase text-ink-tertiary mb-1.5">Message</div>
          <p className="text-[13px] text-ink-secondary whitespace-pre-wrap">{item.message || '—'}</p>
        </div>

        <Field label="Internal notes" optional hint={item.reviewedBy ? `Last updated by ${item.reviewedBy}` : 'Only visible to the Mzobs team'}>
          <Textarea rows={3} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Call notes, verification details, follow-ups…" />
        </Field>
      </ModalBody>
      <ModalFoot>
        <Button onClick={() => setStatus('rejected', 'Campus request rejected')} disabled={busy || item.status === 'rejected'}>Reject Request</Button>
        <Button onClick={() => setStatus('under_review', 'Marked under review')} disabled={busy || item.status === 'under_review'}>Mark Under Review</Button>
        <Button variant="primary" onClick={() => setStatus('verified', 'Campus verified')} disabled={busy || item.status === 'verified'}>{busy ? 'Saving...' : 'Verify Campus'}</Button>
      </ModalFoot>
    </>
  )
}

export default function CampusRequests() {
  const app = useApp()
  const [tab, setTab] = useState(0)
  const [query, setQuery] = useState('')

  const status = tab === 0 ? null : STATUSES[tab - 1]
  const { data: rows = [], isLoading, isError, refetch } = useCampusRequestsQuery(status ? { status } : {})
  const { data: stats } = useCampusRequestStatsQuery()

  const filtered = useMemo(() => {
    if (!query) return rows
    const q = query.toLowerCase()
    return rows.filter((r) => `${r.campusName} ${r.contactPerson} ${r.officialEmail} ${r.phone} ${r.city} ${r.state}`.toLowerCase().includes(q))
  }, [rows, query])

  if (isLoading) return <PageSkeleton />
  if (isError) return <ErrorState onRetry={refetch} />

  return (
    <StaggerGroup>
      <StaggerItem className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Campus Requests</h1>
        <p className="text-sm text-ink-secondary mt-1">Colleges and institutions that asked to join Mzobs through the website’s “Add Your Campus” form.</p>
      </StaggerItem>

      <StaggerItem className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-5">
        {TABS.map((label, i) => {
          const key = i === 0 ? 'All' : STATUSES[i - 1]
          return (
            <Card key={label} hover pad onClick={() => setTab(i)} className="cursor-pointer">
              <span className="text-xs font-semibold tracking-wide uppercase text-ink-tertiary">{label}</span>
              <div className={`text-[30px] font-bold tracking-tight mt-2 ${STAT_TONE[key]}`}>
                <CountUp value={(key === 'All' ? stats?.total : stats?.[key]) ?? 0} />
              </div>
            </Card>
          )
        })}
      </StaggerItem>

      <StaggerItem className="flex items-center justify-between gap-3 flex-wrap mb-4">
        <PillTabs items={TABS} active={tab} onChange={setTab} />
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-tertiary" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search campus, contact or city"
            className="h-9 pl-8 pr-3 rounded-[9px] border border-border-strong bg-surface text-[12.5px] w-[260px] max-sm:w-full outline-none focus:border-navy focus:shadow-[0_0_0_3.5px_var(--color-navy-ring)] transition-[border-color,box-shadow]"
          />
        </div>
      </StaggerItem>

      <StaggerItem>
        {filtered.length === 0 ? (
          <Card>
            <EmptyState icon={GraduationCap} title="No campus requests here" body="Nothing matches this filter right now." />
          </Card>
        ) : (
          <div className="flex flex-col gap-3">
            {filtered.map((r) => (
              <Card key={r.id} hover pad>
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[14.5px] font-semibold">{r.campusName}</span>
                      <Badge tone={STATUS_TONE[r.status] ?? 'gray'}>{LABEL[r.status] ?? r.status}</Badge>
                      <Badge tone="gray">{r.institutionType}</Badge>
                    </div>
                    <div className="flex items-center gap-x-4 gap-y-1 flex-wrap text-xs text-ink-tertiary mt-1.5">
                      <span className="inline-flex items-center gap-1.5"><MapPin size={11} />{r.city}, {r.state}</span>
                      <span>{r.contactPerson}</span>
                      <span className="inline-flex items-center gap-1.5"><Mail size={11} />{r.officialEmail}</span>
                      <span className="inline-flex items-center gap-1.5"><Phone size={11} />{r.phone}</span>
                      {r.website && <span className="inline-flex items-center gap-1.5"><Globe size={11} />{r.website}</span>}
                      {r.studentStrength != null && <span>{r.studentStrength.toLocaleString('en-IN')} students</span>}
                      <span>· {fmtDate(r.createdAt)}</span>
                    </div>
                  </div>
                  <Button size="sm" onClick={() => app.openModal(<DetailModal app={app} item={r} />)}>View Details</Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </StaggerItem>
    </StaggerGroup>
  )
}
