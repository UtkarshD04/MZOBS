import { useMemo, useState } from 'react'
import { GraduationCap, Search, MapPin, Mail, Phone, BookOpen } from 'lucide-react'
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
import { Field, Select, Textarea } from '../../components/ui/Field'
import { useApp } from '../../lib/appContext'
import { useCampusMantriQuery, useCampusMantriStatsQuery, useUpdateCampusMantriMutation } from '../../hooks/useCampusMantri'

const STATUSES = ['New', 'Reviewing', 'Shortlisted', 'Selected', 'Rejected']
const TABS = ['All', ...STATUSES]
const STATUS_TONE = { New: 'gold', Reviewing: 'navy', Shortlisted: 'navy', Selected: 'green', Rejected: 'gray' }
const STAT_TONE = { All: 'text-ink', New: 'text-gold-strong', Reviewing: 'text-navy', Shortlisted: 'text-navy', Selected: 'text-green', Rejected: 'text-ink-tertiary' }

function Section({ title, children }) {
  return (
    <div className="mb-4">
      <div className="text-[11px] font-semibold tracking-wider uppercase text-ink-tertiary mb-1.5">{title}</div>
      <p className="text-[13px] text-ink-secondary whitespace-pre-wrap">{children || '—'}</p>
    </div>
  )
}

function DetailModal({ app, item }) {
  const [status, setStatus] = useState(item.status)
  const [notes, setNotes] = useState(item.notes || '')
  const update = useUpdateCampusMantriMutation()

  function save() {
    update.mutate(
      { id: item.id, status, notes },
      {
        onSuccess: () => {
          app.closeModal()
          app.addToast('success', 'Application updated')
        },
        onError: (err) => app.addToast('error', err.response?.data?.message ?? 'Something went wrong'),
      }
    )
  }

  return (
    <>
      <ModalHead title={item.name} onClose={app.closeModal} />
      <ModalBody>
        <div className="rounded-xl bg-surface-sunken p-3.5 mb-4 grid grid-cols-1 sm:grid-cols-2 gap-2 text-[12.5px]">
          <div><span className="text-ink-tertiary">Email · </span><span className="font-semibold break-all">{item.email}</span></div>
          <div><span className="text-ink-tertiary">Phone · </span><span className="font-semibold">{item.phone || '—'}</span></div>
          <div><span className="text-ink-tertiary">College · </span><span className="font-semibold">{item.college}</span></div>
          <div><span className="text-ink-tertiary">City · </span><span className="font-semibold">{item.city}</span></div>
          <div><span className="text-ink-tertiary">Course &amp; year · </span><span className="font-semibold">{item.course}</span></div>
          <div><span className="text-ink-tertiary">Applied · </span><span className="font-semibold">{new Date(item.createdAt).toLocaleString('en-IN')}</span></div>
        </div>

        <Section title="Experience">{item.experience}</Section>
        <Section title="Campus involvement">{item.involvement}</Section>
        <Section title="Why Mzobs">{item.why}</Section>

        <Field label="Status">
          <Select value={status} onChange={(e) => setStatus(e.target.value)}>
            {STATUSES.map((s) => <option key={s}>{s}</option>)}
          </Select>
        </Field>
        <Field label="Internal notes" optional hint={item.reviewedBy ? `Last updated by ${item.reviewedBy}` : 'Only visible to the Mzobs team'}>
          <Textarea rows={3} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Call notes, follow-ups…" />
        </Field>
      </ModalBody>
      <ModalFoot>
        <Button onClick={app.closeModal} disabled={update.isPending}>Cancel</Button>
        <Button variant="primary" onClick={save} disabled={update.isPending}>{update.isPending ? 'Saving...' : 'Save'}</Button>
      </ModalFoot>
    </>
  )
}

export default function CampusMantri() {
  const app = useApp()
  const [tab, setTab] = useState(0)
  const [query, setQuery] = useState('')

  const status = tab === 0 ? null : TABS[tab]
  const { data: rows = [], isLoading, isError, refetch } = useCampusMantriQuery(status ? { status } : {})
  const { data: stats } = useCampusMantriStatsQuery()

  const filtered = useMemo(() => {
    if (!query) return rows
    const q = query.toLowerCase()
    return rows.filter((r) => `${r.name} ${r.email} ${r.phone} ${r.college} ${r.city} ${r.course}`.toLowerCase().includes(q))
  }, [rows, query])

  if (isLoading) return <PageSkeleton />
  if (isError) return <ErrorState onRetry={refetch} />

  return (
    <StaggerGroup>
      <StaggerItem className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Campus Mantri</h1>
        <p className="text-sm text-ink-secondary mt-1">Applications submitted through the Campus Mantri form on the Mzobs website.</p>
      </StaggerItem>

      <StaggerItem className="grid grid-cols-2 lg:grid-cols-6 gap-4 mb-5">
        {TABS.map((label, i) => (
          <Card key={label} hover pad onClick={() => setTab(i)} className="cursor-pointer">
            <span className="text-xs font-semibold tracking-wide uppercase text-ink-tertiary">{label}</span>
            <div className={`text-[30px] font-bold tracking-tight mt-2 ${STAT_TONE[label]}`}>
              <CountUp value={(label === 'All' ? stats?.total : stats?.[label]) ?? 0} />
            </div>
          </Card>
        ))}
      </StaggerItem>

      <StaggerItem className="flex items-center justify-between gap-3 flex-wrap mb-4">
        <PillTabs items={TABS} active={tab} onChange={setTab} />
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-tertiary" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search name, college, city"
            className="h-9 pl-8 pr-3 rounded-[9px] border border-border-strong bg-surface text-[12.5px] w-[260px] max-sm:w-full outline-none focus:border-navy focus:shadow-[0_0_0_3.5px_var(--color-navy-ring)] transition-[border-color,box-shadow]"
          />
        </div>
      </StaggerItem>

      <StaggerItem>
        {filtered.length === 0 ? (
          <Card>
            <EmptyState icon={GraduationCap} title="No applications here" body="Nothing matches this filter right now." />
          </Card>
        ) : (
          <div className="flex flex-col gap-3">
            {filtered.map((r) => (
              <Card key={r.id} hover pad>
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[14.5px] font-semibold">{r.name}</span>
                      <Badge tone={STATUS_TONE[r.status] ?? 'gray'}>{r.status}</Badge>
                    </div>
                    <div className="flex items-center gap-x-4 gap-y-1 flex-wrap text-xs text-ink-tertiary mt-1.5">
                      <span className="inline-flex items-center gap-1.5"><MapPin size={11} />{r.college}, {r.city}</span>
                      <span className="inline-flex items-center gap-1.5"><BookOpen size={11} />{r.course}</span>
                      <span className="inline-flex items-center gap-1.5"><Mail size={11} />{r.email}</span>
                      {r.phone && <span className="inline-flex items-center gap-1.5"><Phone size={11} />{r.phone}</span>}
                      <span>· {new Date(r.createdAt).toLocaleDateString('en-IN')}</span>
                    </div>
                    <p className="text-[13px] text-ink-secondary mt-2 line-clamp-2">{r.why}</p>
                  </div>
                  <Button size="sm" onClick={() => app.openModal(<DetailModal app={app} item={r} />)}>View</Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </StaggerItem>
    </StaggerGroup>
  )
}
