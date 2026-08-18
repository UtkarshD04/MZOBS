import { useMemo, useState } from 'react'
import { FileCheck, FileText, ShieldCheck, Download, Clock, Video } from 'lucide-react'
import Card, { CardHead } from '../../components/ui/Card'
import Badge from '../../components/ui/Badge'
import Button from '../../components/ui/Button'
import Avatar from '../../components/ui/Avatar'
import Ring from '../../components/ui/Ring'
import Chip from '../../components/ui/Chip'
import { PillTabs } from '../../components/ui/Tabs'
import EmptyState from '../../components/ui/EmptyState'
import CountUp from '../../components/ui/CountUp'
import { StaggerGroup, StaggerItem } from '../../components/ui/Stagger'
import { PageSkeleton } from '../../components/ui/Skeleton'
import ErrorState from '../../components/ui/ErrorState'
import { ModalHead, ModalBody, ModalFoot } from '../../components/ui/Modal'
import { Field, Input, Textarea } from '../../components/ui/Field'
import { useApp } from '../../context/AppContext'
import { useResumeQueueQuery, useReviewResumeMutation } from '../../hooks/useResumes'
import { useMockInterviewsQuery } from '../../hooks/useMockInterviews'
import { ScheduleMockModal } from './MockInterviews'
import { FILE_BASE_URL } from '../../lib/config'

const TABS = ['Pending', 'Changes requested', 'Verified', 'Not uploaded']
const TAB_KEYS = ['pending', 'changes', 'verified', 'none']
const RESUME_STATUS_TONE = { pending: 'gold', changes: 'red', verified: 'green', rejected: 'red', none: 'gray' }

export function VerifyResumeModal({ app, employee, onDone }) {
  const [decision, setDecision] = useState('verified')
  const [score, setScore] = useState(employee.resume?.score ?? 80)
  const [note, setNote] = useState('')
  const reviewResume = useReviewResumeMutation()
  const labels = { verified: 'Mark verified', changes: 'Request changes', rejected: 'Reject resume' }

  function submit() {
    reviewResume.mutate(
      { employeeId: employee.id, decision, score: decision === 'verified' ? score : undefined, note },
      {
        onSuccess: () => {
          app.closeModal()
          app.closeSidePanel?.()
          app.addToast(decision === 'rejected' ? 'error' : 'success', `${employee.name}'s resume marked "${decision}"`)
          onDone?.()
        },
        onError: (err) => app.addToast('error', err.response?.data?.message ?? 'Something went wrong'),
      }
    )
  }

  return (
    <>
      <ModalHead title={`Verify resume — ${employee.name}`} onClose={app.closeModal} />
      <ModalBody>
        <div className="flex items-center gap-3.5 p-3.5 bg-surface-sunken rounded-xl mb-4">
          <FileText size={26} className="text-navy flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <div className="text-[13.5px] font-semibold truncate">{employee.resume?.file || 'No file uploaded'}</div>
            <div className="text-xs text-ink-tertiary mt-0.5">
              {employee.resume?.uploadedOn ? `Uploaded ${new Date(employee.resume.uploadedOn).toLocaleDateString('en-IN')}` : ''}
            </div>
          </div>
        </div>

        <Field label="Decision">
          <div className="flex flex-wrap gap-2">
            {Object.keys(labels).map((k) => (
              <Chip key={k} selected={decision === k} onClick={() => setDecision(k)}>
                {labels[k]}
              </Chip>
            ))}
          </div>
        </Field>

        {decision === 'verified' && (
          <Field label="Verification score" hint="Drives the candidate's ranking inside dispatch batches.">
            <Input type="number" min={0} max={100} value={score} onChange={(e) => setScore(Number(e.target.value))} />
          </Field>
        )}

        <Field label="Note to candidate" hint="Shown in the candidate's Resume Center.">
          <Textarea value={note} onChange={(e) => setNote(e.target.value)} placeholder={decision === 'verified' ? 'What made this resume pass?' : 'Tell them what to fix.'} />
        </Field>
      </ModalBody>
      <ModalFoot>
        <Button onClick={app.closeModal} disabled={reviewResume.isPending}>
          Cancel
        </Button>
        <Button variant={decision === 'rejected' ? 'danger' : 'primary'} onClick={submit} disabled={reviewResume.isPending}>
          {reviewResume.isPending ? 'Saving...' : labels[decision]}
        </Button>
      </ModalFoot>
    </>
  )
}

export default function ResumeQueue() {
  const app = useApp()
  const [tab, setTab] = useState(0)
  const status = TAB_KEYS[tab]
  const { data: rows = [], isLoading, isError, refetch } = useResumeQueueQuery({ status })
  const { data: allRows = [] } = useResumeQueueQuery({})
  const { data: mockInterviews = [] } = useMockInterviewsQuery({})

  const counts = useMemo(() => TAB_KEYS.map((k) => allRows.filter((c) => (c.resume?.status ?? 'none') === k).length), [allRows])
  const scheduledEmployeeIds = useMemo(() => new Set(mockInterviews.map((m) => m.employeeId ?? m.employee?.id)), [mockInterviews])

  if (isLoading) return <PageSkeleton />
  if (isError) return <ErrorState onRetry={refetch} />

  return (
    <StaggerGroup>
      <StaggerItem className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Resume Verification</h1>
        <p className="text-sm text-ink-secondary mt-1">
          Every resume uploaded on the candidate portal lands here. Nothing reaches an employer until our team clears it.
        </p>
      </StaggerItem>

      <StaggerItem className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
        {TABS.map((label, i) => (
          <Card key={label} hover pad onClick={() => setTab(i)} className="cursor-pointer">
            <span className="text-xs font-semibold tracking-wide uppercase text-ink-tertiary">{label}</span>
            <div className={`text-[30px] font-bold tracking-tight mt-2 ${i === 0 ? 'text-gold-strong' : i === 2 ? 'text-green' : 'text-navy'}`}>
              <CountUp value={counts[i]} />
            </div>
          </Card>
        ))}
      </StaggerItem>

      <StaggerItem className="mb-4">
        <PillTabs items={TABS} active={tab} onChange={setTab} />
      </StaggerItem>

      <StaggerItem>
        {rows.length === 0 ? (
          <Card>
            <EmptyState icon={FileCheck} tone="green" title="Nothing in this queue" body="All caught up here — check another tab." />
          </Card>
        ) : (
          <div className="flex flex-col gap-4">
            {rows.map((c) => (
              <Card key={c.id} pad>
                <div className="flex items-start gap-4 flex-wrap">
                  <Avatar initials={c.name?.slice(0, 2)?.toUpperCase()} size="md" />
                  <div className="flex-1 min-w-[220px]">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[15px] font-semibold">{c.name}</span>
                      <Badge tone={RESUME_STATUS_TONE[c.resume?.status ?? 'none']}>{c.resume?.status ?? 'none'}</Badge>
                      <Badge tone={c.subscription?.status === 'paid' ? 'green' : 'red'} dot={false}>
                        {c.subscription?.status === 'paid' ? '₹99 paid' : 'Unpaid'}
                      </Badge>
                    </div>
                    <div className="text-[13px] text-ink-secondary mt-1">
                      {c.currentCity || 'City not set'} {c.experienceYears ? `· ${c.experienceYears} yrs` : ''}
                    </div>
                    {c.skills?.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-2.5">
                        {c.skills.map((s) => (
                          <span key={s} className="text-[11px] font-semibold text-ink-secondary bg-surface-sunken px-2 py-1 rounded-md">
                            {s}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  {c.resume?.score != null && <Ring value={c.resume.score} size={52} thick={6} hero={c.resume.score >= 85} />}
                </div>

                {c.resume?.file ? (
                  <div className="flex items-center gap-3.5 p-3 bg-surface-sunken rounded-xl mt-4">
                    <FileText size={22} className="text-navy flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="text-[13px] font-semibold truncate">{c.resume.file}</div>
                      <div className="text-[11px] text-ink-tertiary mt-0.5 flex items-center gap-1">
                        <Clock size={11} /> Version {c.resume.version} · Uploaded {new Date(c.resume.uploadedOn).toLocaleDateString('en-IN')}
                        {c.resume.reviewer && ` · Last reviewed by ${c.resume.reviewer}`}
                      </div>
                    </div>
                    {c.resume.url && (
                      <Button size="sm" onClick={() => window.open(`${FILE_BASE_URL}${c.resume.url}`, '_blank')}>
                        <Download size={13} /> Open
                      </Button>
                    )}
                  </div>
                ) : (
                  <div className="text-[13px] text-ink-tertiary mt-4 p-3 bg-surface-sunken rounded-xl">No resume uploaded yet.</div>
                )}

                {c.resume?.note && <p className="text-[12.5px] text-ink-secondary mt-3">Reviewer note: {c.resume.note}</p>}

                <div className="flex items-center gap-2 mt-4 pt-3.5 border-t border-border flex-wrap">
                  {c.resume?.file && (
                    <Button variant="primary" size="sm" onClick={() => app.openModal(<VerifyResumeModal app={app} employee={c} onDone={refetch} />)}>
                      <ShieldCheck size={14} /> {c.resume.status === 'verified' ? 'Re-verify' : 'Review & decide'}
                    </Button>
                  )}
                  {c.resume?.status === 'verified' && !scheduledEmployeeIds.has(c.id) && (
                    <Button size="sm" onClick={() => app.openModal(<ScheduleMockModal app={app} employee={c} onDone={refetch} />)}>
                      <Video size={14} /> Schedule mock interview
                    </Button>
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}
      </StaggerItem>

      <StaggerItem className="mt-5">
        <Card>
          <CardHead>
            <span className="text-[15px] font-semibold">Verification standard</span>
          </CardHead>
          <div className="p-[22px] grid md:grid-cols-3 gap-4">
            {[
              ['Identity & contact', 'Phone and email verified, name matches the resume.'],
              ['Work history', 'Dates and titles cross-checked against offer letters or payslips.'],
              ['Formatting & ATS', 'Single column, parsable, no images in the text layer.'],
            ].map(([t, b]) => (
              <div key={t}>
                <div className="text-[13px] font-semibold">{t}</div>
                <div className="text-[12.5px] text-ink-secondary mt-1">{b}</div>
              </div>
            ))}
          </div>
        </Card>
      </StaggerItem>
    </StaggerGroup>
  )
}
