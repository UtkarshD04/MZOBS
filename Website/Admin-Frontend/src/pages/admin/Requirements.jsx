import { useMemo, useState } from 'react'
import { Briefcase, MapPin, Search, IndianRupee, Users, FileText, BellRing } from 'lucide-react'
import Card from '../../components/ui/Card'
import Badge from '../../components/ui/Badge'
import Button from '../../components/ui/Button'
import Bar from '../../components/ui/Bar'
import CountUp from '../../components/ui/CountUp'
import { PillTabs } from '../../components/ui/Tabs'
import EmptyState from '../../components/ui/EmptyState'
import { StaggerGroup, StaggerItem } from '../../components/ui/Stagger'
import { PageSkeleton } from '../../components/ui/Skeleton'
import ErrorState from '../../components/ui/ErrorState'
import { ModalHead, ModalBody, ModalFoot } from '../../components/ui/Modal'
import { Field, Input, Select } from '../../components/ui/Field'
import { useApp } from '../../context/AppContext'
import { useJobsQuery, useApproveJobMutation, useRecordJobPaymentMutation, useNotifyHrMutation } from '../../hooks/useJobs'
import { fmtINR } from '../../lib/utils'

const TABS = ['To review', 'Awaiting payment', 'Sourcing', 'Delivered', 'All']
const TAB_FILTER = [['pending_review'], ['awaiting_payment'], ['sourcing'], ['delivered'], null]
const JOB_STATUS = {
  draft: { label: 'Draft', tone: 'gray' },
  pending_review: { label: 'To review', tone: 'gold' },
  awaiting_payment: { label: 'Awaiting payment', tone: 'red' },
  sourcing: { label: 'Sourcing', tone: 'navy' },
  delivered: { label: 'Delivered', tone: 'green' },
  closed: { label: 'Closed', tone: 'gray' },
  archived: { label: 'Archived', tone: 'gray' },
}
const PER_OPENING_FEE = 2000
const RESUMES_PER_OPENING = 5

function ReviewJobModal({ app, job, onDone }) {
  const [vacancies, setVacancies] = useState(job.vacancies)
  const [visible, setVisible] = useState(true)
  const approve = useApproveJobMutation()
  const fee = vacancies * PER_OPENING_FEE
  const resumes = vacancies * RESUMES_PER_OPENING

  function submit() {
    approve.mutate(
      { id: job.id, vacancies, visibleToCandidates: visible, track: job.track },
      {
        onSuccess: () => {
          app.closeModal()
          app.addToast('success', `Approved — invoice of ${fmtINR(fee)} raised to ${job.company?.name ?? 'employer'}`)
          onDone?.()
        },
        onError: (err) => app.addToast('error', err.response?.data?.message ?? 'Something went wrong'),
      }
    )
  }

  return (
    <>
      <ModalHead title="Review requirement" onClose={app.closeModal} />
      <ModalBody>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-11 h-11 rounded-xl bg-navy-tint text-navy flex items-center justify-center text-sm font-bold flex-shrink-0">{job.company?.logo}</div>
          <div className="min-w-0">
            <div className="text-[15px] font-semibold truncate">{job.title}</div>
            <div className="text-xs text-ink-tertiary">
              {job.company?.name} · {job.location} · {job.workMode}
            </div>
          </div>
        </div>

        <Field label="Openings confirmed with the employer">
          <Input type="number" min={1} value={vacancies} onChange={(e) => setVacancies(Math.max(1, Number(e.target.value) || 1))} />
        </Field>

        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="rounded-xl border border-border bg-surface-sunken p-3.5">
            <div className="text-xs text-ink-tertiary">Invoice to raise</div>
            <div className="text-[19px] font-bold tracking-tight mt-1">{fmtINR(fee)}</div>
          </div>
          <div className="rounded-xl border border-border bg-surface-sunken p-3.5">
            <div className="text-xs text-ink-tertiary">Resumes we owe</div>
            <div className="text-[19px] font-bold tracking-tight mt-1">{resumes}</div>
          </div>
        </div>

        <Field label="Publish to candidate portal">
          <Select value={visible ? 'yes' : 'no'} onChange={(e) => setVisible(e.target.value === 'yes')}>
            <option value="yes">Yes — show on the job board</option>
            <option value="no">No — source silently from our pool</option>
          </Select>
        </Field>

        <div className="flex items-start gap-2.5 rounded-xl border border-border bg-surface-sunken px-3.5 py-3">
          <FileText size={15} className="text-navy mt-0.5 flex-shrink-0" />
          <p className="text-[12.5px] text-ink-secondary">Applications from this posting stay inside Mzobs until we dispatch a batch.</p>
        </div>
      </ModalBody>
      <ModalFoot>
        <Button onClick={app.closeModal} disabled={approve.isPending}>
          Cancel
        </Button>
        <Button variant="primary" onClick={submit} disabled={approve.isPending}>
          {approve.isPending ? 'Saving...' : 'Approve & raise invoice'}
        </Button>
      </ModalFoot>
    </>
  )
}

function RecordPaymentModal({ app, job, onDone }) {
  const [paymentMode, setPaymentMode] = useState('NEFT')
  const [reference, setReference] = useState('')
  const recordPayment = useRecordJobPaymentMutation()

  function submit() {
    recordPayment.mutate(
      { id: job.id, paymentMode, reference },
      {
        onSuccess: () => {
          app.closeModal()
          app.addToast('success', `${fmtINR(job.feeTotal)} recorded — sourcing started`)
          onDone?.()
        },
        onError: (err) => app.addToast('error', err.response?.data?.message ?? 'Something went wrong'),
      }
    )
  }

  return (
    <>
      <ModalHead title="Record payment" onClose={app.closeModal} />
      <ModalBody>
        <div className="flex items-center gap-3.5 p-3.5 bg-surface-sunken rounded-xl mb-4">
          <div className="w-10 h-10 rounded-xl bg-gold-tint text-gold-strong flex items-center justify-center flex-shrink-0">
            <IndianRupee size={18} />
          </div>
          <div>
            <div className="text-[15px] font-bold tracking-tight">{fmtINR(job.feeTotal)}</div>
            <div className="text-xs text-ink-tertiary">
              {job.company?.name} · {job.vacancies} openings
            </div>
          </div>
        </div>
        <Field label="Mode">
          <Select value={paymentMode} onChange={(e) => setPaymentMode(e.target.value)}>
            <option value="NEFT">NEFT / RTGS</option>
            <option value="UPI">UPI</option>
            <option value="Cheque">Cheque</option>
            <option value="Razorpay">Razorpay link</option>
          </Select>
        </Field>
        <Field label="Reference number">
          <Input placeholder="Bank UTR or transaction id" value={reference} onChange={(e) => setReference(e.target.value)} />
        </Field>
      </ModalBody>
      <ModalFoot>
        <Button onClick={app.closeModal} disabled={recordPayment.isPending}>
          Cancel
        </Button>
        <Button variant="primary" onClick={submit} disabled={recordPayment.isPending}>
          {recordPayment.isPending ? 'Saving...' : 'Mark as paid'}
        </Button>
      </ModalFoot>
    </>
  )
}

export default function Requirements() {
  const app = useApp()
  const [tab, setTab] = useState(0)
  const [query, setQuery] = useState('')
  const status = TAB_FILTER[tab]?.[0]
  const { data: rows = [], isLoading, isError, refetch } = useJobsQuery(status ? { status } : {})
  const { data: allRows = [] } = useJobsQuery({})
  const notifyHr = useNotifyHrMutation()

  function notify(job) {
    notifyHr.mutate(job.id, {
      onSuccess: (data) => app.addToast('success', `Notified ${data.notified} HR staff about "${job.title}"`),
      onError: (err) => app.addToast('error', err.response?.data?.message ?? 'Something went wrong'),
    })
  }

  const filtered = useMemo(() => {
    if (!query) return rows
    const q = query.toLowerCase()
    return rows.filter((j) => `${j.title} ${j.company?.name} ${j.location}`.toLowerCase().includes(q))
  }, [rows, query])

  if (isLoading) return <PageSkeleton />
  if (isError) return <ErrorState onRetry={refetch} />

  const totalOpenings = allRows.reduce((n, j) => n + j.vacancies, 0)
  const billed = allRows.reduce((n, j) => n + (j.feeTotal ?? 0), 0)
  const resumesOwed = allRows.reduce((n, j) => n + Math.max(0, (j.resumesPromised ?? 0) - (j.candidatesShared ?? 0)), 0)

  return (
    <StaggerGroup>
      <StaggerItem className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Requirements</h1>
        <p className="text-sm text-ink-secondary mt-1">
          Job posts raised by verified employers. Each opening is billed at {fmtINR(PER_OPENING_FEE)} and owes {RESUMES_PER_OPENING} shortlisted resumes.
        </p>
      </StaggerItem>

      <StaggerItem className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
        {[
          ['Requirements', allRows.length, '', 'text-navy'],
          ['Total openings', totalOpenings, '', 'text-gold-strong'],
          ['Billed value', billed, '₹', 'text-green'],
          ['Resumes still owed', resumesOwed, '', 'text-teal'],
        ].map(([label, val, prefix, cls]) => (
          <Card key={label} hover pad>
            <span className="text-xs font-semibold tracking-wide uppercase text-ink-tertiary">{label}</span>
            <div className={`text-[30px] font-bold tracking-tight mt-2 ${cls}`}>
              <CountUp value={val} prefix={prefix} />
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
            placeholder="Search role, company, city"
            className="h-9 pl-8 pr-3 rounded-[9px] border border-border-strong bg-surface text-[12.5px] w-[260px] max-sm:w-full outline-none focus:border-navy focus:shadow-[0_0_0_3.5px_var(--color-navy-ring)] transition-[border-color,box-shadow]"
          />
        </div>
      </StaggerItem>

      <StaggerItem>
        {filtered.length === 0 ? (
          <Card>
            <EmptyState icon={Briefcase} title="No requirements here" body="Nothing matches this filter right now." />
          </Card>
        ) : (
          <div className="flex flex-col gap-4">
            {filtered.map((j) => {
              const st = JOB_STATUS[j.status] ?? { label: j.status, tone: 'gray' }
              const fill = j.resumesPromised ? Math.round(((j.candidatesShared ?? 0) / j.resumesPromised) * 100) : 0

              return (
                <Card key={j.id} pad>
                  <div className="flex items-start gap-4 flex-wrap">
                    <div className="w-11 h-11 rounded-[11px] bg-navy-tint text-navy flex items-center justify-center text-sm font-bold flex-shrink-0">{j.company?.logo}</div>
                    <div className="flex-1 min-w-[220px]">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[15px] font-semibold">{j.title}</span>
                        <Badge tone={st.tone}>{st.label}</Badge>
                      </div>
                      <div className="text-[13px] text-ink-secondary mt-1">
                        {j.company?.name} · Posted {j.postedOn ? new Date(j.postedOn).toLocaleDateString('en-IN') : 'not yet'}
                      </div>
                      <div className="flex items-center gap-3.5 mt-2 text-[12.5px] text-ink-tertiary flex-wrap">
                        <span className="flex items-center gap-1">
                          <MapPin size={12} /> {j.location} · {j.workMode}
                        </span>
                        <span className="flex items-center gap-1">
                          <Users size={12} /> {j.candidatesShared ?? 0} shared so far
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-1.5 mt-2.5">
                        {(j.skills ?? []).map((s) => (
                          <span key={s} className="text-[11px] font-semibold text-ink-secondary bg-surface-sunken px-2 py-1 rounded-md">
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2.5 min-w-[280px]">
                      <div className="bg-surface-sunken rounded-lg px-3 py-2.5">
                        <div className="text-[11px] text-ink-tertiary">Openings</div>
                        <div className="text-[17px] font-bold tracking-tight mt-0.5">{j.vacancies}</div>
                      </div>
                      <div className="bg-surface-sunken rounded-lg px-3 py-2.5">
                        <div className="text-[11px] text-ink-tertiary">Fee</div>
                        <div className="text-[17px] font-bold tracking-tight mt-0.5">{fmtINR(j.feeTotal ?? 0)}</div>
                        <div className={`text-[10.5px] font-semibold mt-0.5 ${j.feeStatus === 'paid' ? 'text-green' : 'text-red'}`}>
                          {j.feeStatus === 'paid' ? 'Paid' : 'Unpaid'}
                        </div>
                      </div>
                      <div className="bg-surface-sunken rounded-lg px-3 py-2.5">
                        <div className="text-[11px] text-ink-tertiary">Resumes</div>
                        <div className="text-[17px] font-bold tracking-tight mt-0.5">
                          {j.candidatesShared ?? 0}
                          <span className="text-[12px] text-ink-tertiary">/{j.resumesPromised ?? 0}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4">
                    <div className="flex items-center justify-between text-[12px] mb-1.5">
                      <span className="text-ink-secondary">Dispatch progress</span>
                      <span className="font-semibold">{fill}%</span>
                    </div>
                    <Bar value={fill} tone={fill === 100 ? 'green' : 'navy'} thin />
                  </div>

                  <div className="flex items-center gap-2 mt-4 pt-3.5 border-t border-border flex-wrap">
                    {j.status === 'pending_review' && (
                      <Button variant="primary" size="sm" onClick={() => app.openModal(<ReviewJobModal app={app} job={j} onDone={refetch} />)}>
                        Review & approve
                      </Button>
                    )}
                    {j.feeStatus === 'unpaid' && j.status === 'awaiting_payment' && (
                      <Button variant="gold" size="sm" onClick={() => app.openModal(<RecordPaymentModal app={app} job={j} onDone={refetch} />)}>
                        <IndianRupee size={14} /> Record payment
                      </Button>
                    )}
                    {j.status === 'sourcing' && (
                      <Button size="sm" onClick={() => notify(j)} disabled={notifyHr.isPending}>
                        <BellRing size={14} /> Notify HR
                      </Button>
                    )}
                  </div>
                </Card>
              )
            })}
          </div>
        )}
      </StaggerItem>
    </StaggerGroup>
  )
}
