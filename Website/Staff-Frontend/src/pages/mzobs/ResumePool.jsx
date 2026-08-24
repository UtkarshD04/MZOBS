import { useState } from 'react'
import { FileText, Download, ShieldCheck, Inbox } from 'lucide-react'
import Card from '../../components/ui/Card'
import Badge from '../../components/ui/Badge'
import Button from '../../components/ui/Button'
import Chip from '../../components/ui/Chip'
import EmptyState from '../../components/ui/EmptyState'
import CountUp from '../../components/ui/CountUp'
import { TableWrap, Table, Tr, Td } from '../../components/ui/Table'
import { StaggerGroup, StaggerItem } from '../../components/ui/Stagger'
import { PageSkeleton } from '../../components/ui/Skeleton'
import ErrorState from '../../components/ui/ErrorState'
import { ModalHead, ModalBody, ModalFoot } from '../../components/ui/Modal'
import { Field, Input, Textarea } from '../../components/ui/Field'
import { useApp } from '../../context/AppContext'
import { useResumePoolQuery, useResumePoolStatsQuery, useReviewPoolResumeMutation } from '../../hooks/useResumePool'
import { FILE_BASE_URL } from '../../lib/config'

const STATUS_TABS = [
  { key: 'all', label: 'All' },
  { key: 'pending', label: 'Pending' },
  { key: 'verified', label: 'Verified' },
  { key: 'changes', label: 'Changes' },
  { key: 'rejected', label: 'Rejected' },
]
const STATUS_TONE = { pending: 'gold', verified: 'green', changes: 'red', rejected: 'red' }

function VerifyPoolResumeModal({ app, resume, onDone }) {
  const [decision, setDecision] = useState('verified')
  const [score, setScore] = useState(resume.score ?? 80)
  const [note, setNote] = useState('')
  const reviewResume = useReviewPoolResumeMutation()
  const labels = { verified: 'Mark verified', changes: 'Request changes', rejected: 'Reject resume' }

  function submit() {
    reviewResume.mutate(
      { id: resume.id, decision, score: decision === 'verified' ? score : undefined, note },
      {
        onSuccess: () => {
          app.closeModal()
          app.addToast(decision === 'rejected' ? 'error' : 'success', `Resume marked "${decision}"`)
          onDone?.()
        },
        onError: (err) => app.addToast('error', err.response?.data?.message ?? 'Something went wrong'),
      }
    )
  }

  return (
    <>
      <ModalHead title={`Verify resume — ${resume.name || resume.file}`} onClose={app.closeModal} />
      <ModalBody>
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
          <Field label="Verification score">
            <Input type="number" min={0} max={100} value={score} onChange={(e) => setScore(Number(e.target.value))} />
          </Field>
        )}

        <Field label="Note">
          <Textarea value={note} onChange={(e) => setNote(e.target.value)} placeholder={decision === 'verified' ? 'What made this resume pass?' : 'What needs fixing?'} />
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

export default function ResumePool() {
  const app = useApp()
  const [status, setStatus] = useState('all')

  const { data: rows = [], isLoading, isError, refetch } = useResumePoolQuery({ status })
  const { data: stats } = useResumePoolStatsQuery()

  if (isLoading) return <PageSkeleton />
  if (isError) return <ErrorState onRetry={refetch} />

  return (
    <StaggerGroup>
      <StaggerItem className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">My Resume Pool</h1>
        <p className="text-sm text-ink-secondary mt-1">Bulk-sourced resumes an admin has assigned to you to verify.</p>
      </StaggerItem>

      <StaggerItem className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-5">
        {['total', 'pending', 'verified', 'changes', 'rejected'].map((k) => (
          <Card key={k} pad>
            <span className="text-xs font-semibold tracking-wide uppercase text-ink-tertiary">{k}</span>
            <div className="text-[28px] font-bold tracking-tight mt-2">
              <CountUp value={stats?.[k] ?? 0} />
            </div>
          </Card>
        ))}
      </StaggerItem>

      <StaggerItem className="flex items-center gap-2 mb-4 flex-wrap">
        {STATUS_TABS.map((t) => (
          <Chip key={t.key} selected={status === t.key} onClick={() => setStatus(t.key)}>
            {t.label}
          </Chip>
        ))}
      </StaggerItem>

      <StaggerItem>
        {rows.length === 0 ? (
          <Card>
            <EmptyState icon={Inbox} tone="navy" title="Nothing here" body="Check another tab, or wait for an admin to assign you more resumes." />
          </Card>
        ) : (
          <Card>
            <TableWrap className="border-none rounded-none">
              <Table columns={['File', 'Status', 'Uploaded', '']}>
                {rows.map((r) => (
                  <Tr key={r.id}>
                    <Td>
                      <div className="flex items-center gap-2.5">
                        <FileText size={16} className="text-navy flex-shrink-0" />
                        <div className="min-w-0">
                          <div className="text-[13px] font-semibold truncate max-w-[220px]">{r.name || r.file}</div>
                          {r.email && <div className="text-[11px] text-ink-tertiary truncate max-w-[220px]">{r.email}</div>}
                        </div>
                      </div>
                    </Td>
                    <Td>
                      <Badge tone={STATUS_TONE[r.status] ?? 'gray'}>{r.status}</Badge>
                    </Td>
                    <Td className="text-ink-tertiary">{new Date(r.uploadedOn).toLocaleDateString('en-IN')}</Td>
                    <Td>
                      <div className="flex items-center gap-1.5">
                        <Button size="sm" onClick={() => window.open(`${FILE_BASE_URL}${r.url}`, '_blank')}>
                          <Download size={13} />
                        </Button>
                        <Button size="sm" onClick={() => app.openModal(<VerifyPoolResumeModal app={app} resume={r} onDone={refetch} />)}>
                          <ShieldCheck size={13} /> {r.status === 'verified' ? 'Re-verify' : 'Review'}
                        </Button>
                      </div>
                    </Td>
                  </Tr>
                ))}
              </Table>
            </TableWrap>
          </Card>
        )}
      </StaggerItem>
    </StaggerGroup>
  )
}
