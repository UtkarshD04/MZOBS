import { useMemo, useState } from 'react'
import { LifeBuoy, Search, User, Building2, MessageSquareReply } from 'lucide-react'
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
import { useApp } from '../../context/AppContext'
import { useTicketsQuery, useRespondTicketMutation } from '../../hooks/useSupport'

const TABS = ['Open', 'In Progress', 'Resolved', 'All']
const TAB_KEYS = ['Open', 'In Progress', 'Resolved', null]
const STATUS_TONE = { Open: 'gold', 'In Progress': 'navy', Resolved: 'green' }
const SOURCES = ['All', 'Employees', 'Employers']
const SOURCE_KEYS = [null, 'employee', 'employer']

function RespondModal({ app, ticket, onDone }) {
  const [status, setStatus] = useState(ticket.status)
  const [reply, setReply] = useState(ticket.reply || '')
  const respond = useRespondTicketMutation()

  function submit() {
    respond.mutate(
      { id: ticket.id, status, reply },
      {
        onSuccess: () => {
          app.closeModal()
          app.addToast('success', 'Query updated')
          onDone?.()
        },
        onError: (err) => app.addToast('error', err.response?.data?.message ?? 'Something went wrong'),
      }
    )
  }

  return (
    <>
      <ModalHead title={ticket.subject} onClose={app.closeModal} />
      <ModalBody>
        <div className="rounded-xl bg-surface-sunken p-3.5 mb-4">
          <div className="flex items-center justify-between text-[12.5px] mb-1.5">
            <span className="text-ink-tertiary">Raised by</span>
            <span className="font-semibold">
              {ticket.source === 'employee' ? ticket.employee?.name : ticket.user?.name}
              {ticket.source === 'employer' && ticket.company?.name ? ` · ${ticket.company.name}` : ''}
            </span>
          </div>
          <div className="flex items-center justify-between text-[12.5px]">
            <span className="text-ink-tertiary">Category</span>
            <span className="font-semibold">{ticket.category}</span>
          </div>
        </div>
        <p className="text-[13px] text-ink-secondary mb-4">{ticket.message}</p>

        <Field label="Status">
          <Select value={status} onChange={(e) => setStatus(e.target.value)}>
            <option>Open</option>
            <option>In Progress</option>
            <option>Resolved</option>
          </Select>
        </Field>
        <Field label="Reply" optional hint="Sent back to the person who raised this query">
          <Textarea rows={4} value={reply} onChange={(e) => setReply(e.target.value)} placeholder="Type your response…" />
        </Field>
      </ModalBody>
      <ModalFoot>
        <Button onClick={app.closeModal} disabled={respond.isPending}>
          Cancel
        </Button>
        <Button variant="primary" onClick={submit} disabled={respond.isPending}>
          {respond.isPending ? 'Saving...' : 'Save & respond'}
        </Button>
      </ModalFoot>
    </>
  )
}

export default function Queries() {
  const app = useApp()
  const [tab, setTab] = useState(0)
  const [source, setSource] = useState(0)
  const [query, setQuery] = useState('')

  const status = TAB_KEYS[tab]
  const { data: rows = [], isLoading, isError, refetch } = useTicketsQuery(status ? { status } : {})
  const { data: allRows = [] } = useTicketsQuery({})

  const filtered = useMemo(() => {
    let r = rows
    const sourceKey = SOURCE_KEYS[source]
    if (sourceKey) r = r.filter((t) => t.source === sourceKey)
    if (query) {
      const q = query.toLowerCase()
      r = r.filter((t) => `${t.subject} ${t.message} ${t.employee?.name ?? ''} ${t.user?.name ?? ''} ${t.company?.name ?? ''}`.toLowerCase().includes(q))
    }
    return r
  }, [rows, source, query])

  const counts = TAB_KEYS.map((k) => (k ? allRows.filter((t) => t.status === k).length : allRows.length))

  if (isLoading) return <PageSkeleton />
  if (isError) return <ErrorState onRetry={refetch} />

  return (
    <StaggerGroup>
      <StaggerItem className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Queries</h1>
        <p className="text-sm text-ink-secondary mt-1">Support queries raised by candidates and employers, in one queue.</p>
      </StaggerItem>

      <StaggerItem className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
        {TABS.map((label, i) => (
          <Card key={label} hover pad onClick={() => setTab(i)} className="cursor-pointer">
            <span className="text-xs font-semibold tracking-wide uppercase text-ink-tertiary">{label}</span>
            <div className={`text-[30px] font-bold tracking-tight mt-2 ${i === 0 ? 'text-gold-strong' : i === 1 ? 'text-navy' : i === 2 ? 'text-green' : 'text-ink'}`}>
              <CountUp value={counts[i]} />
            </div>
          </Card>
        ))}
      </StaggerItem>

      <StaggerItem className="flex items-center justify-between gap-3 flex-wrap mb-4">
        <div className="flex items-center gap-3 flex-wrap">
          <PillTabs items={TABS} active={tab} onChange={setTab} />
          <PillTabs items={SOURCES} active={source} onChange={setSource} />
        </div>
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-tertiary" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search subject, message, name"
            className="h-9 pl-8 pr-3 rounded-[9px] border border-border-strong bg-surface text-[12.5px] w-[260px] max-sm:w-full outline-none focus:border-navy focus:shadow-[0_0_0_3.5px_var(--color-navy-ring)] transition-[border-color,box-shadow]"
          />
        </div>
      </StaggerItem>

      <StaggerItem>
        {filtered.length === 0 ? (
          <Card>
            <EmptyState icon={LifeBuoy} title="No queries here" body="Nothing matches this filter right now." />
          </Card>
        ) : (
          <div className="flex flex-col gap-3">
            {filtered.map((t) => (
              <Card key={t.id} hover pad>
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[14.5px] font-semibold">{t.subject}</span>
                      <Badge tone={STATUS_TONE[t.status] ?? 'gray'}>{t.status}</Badge>
                      <Badge tone="gray" dot={false}>{t.category}</Badge>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-ink-tertiary mt-1.5">
                      {t.source === 'employee' ? <User size={11} /> : <Building2 size={11} />}
                      {t.source === 'employee' ? t.employee?.name : `${t.user?.name ?? ''}${t.company?.name ? ' · ' + t.company.name : ''}`}
                      <span>· {new Date(t.createdAt).toLocaleDateString('en-IN')}</span>
                    </div>
                    <p className="text-[13px] text-ink-secondary mt-2 line-clamp-2">{t.message}</p>
                  </div>
                  <Button size="sm" onClick={() => app.openModal(<RespondModal app={app} ticket={t} onDone={refetch} />)}>
                    <MessageSquareReply size={14} /> {t.status === 'Open' ? 'Respond' : 'View'}
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </StaggerItem>
    </StaggerGroup>
  )
}
