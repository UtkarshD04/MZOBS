import { useState } from 'react'
import { FileText, Download, ShieldCheck, Inbox } from 'lucide-react'
import Card from '../../components/ui/Card'
import Badge from '../../components/ui/Badge'
import Button from '../../components/ui/Button'
import Chip from '../../components/ui/Chip'
import EmptyState from '../../components/ui/EmptyState'
import { StaggerGroup, StaggerItem } from '../../components/ui/Stagger'
import { PageSkeleton } from '../../components/ui/Skeleton'
import ErrorState from '../../components/ui/ErrorState'
import { ModalHead, ModalBody, ModalFoot } from '../../components/ui/Modal'
import { Field, Input, Textarea } from '../../components/ui/Field'
import { PillTabs } from '../../components/ui/Tabs'
import { useApp } from '../../context/AppContext'
import { useResumePoolQuery, useReviewPoolResumeMutation } from '../../hooks/useResumePool'
import { FILE_BASE_URL } from '../../lib/config'

const TABS = ['All', 'Pending', 'Verified', 'Changes', 'Rejected']
const TAB_KEYS = ['all', 'pending', 'verified', 'changes', 'rejected']
const STATUS_TONE = { pending: 'gold', verified: 'green', changes: 'red', rejected: 'red' }

function ReviewModal({ app, resume, onDone }) {
  const [decision, setDecision] = useState('verified')
  const [score, setScore] = useState(resume.score ?? 80)
  const [note, setNote] = useState('')
  const review = useReviewPoolResumeMutation()
  const labels = { verified: 'Mark verified', changes: 'Request changes', rejected: 'Reject resume' }

  function submit() {
    review.mutate(
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
      <ModalHead title={`Review — ${resume.name || resume.file}`} onClose={app.closeModal} />
      <ModalBody>
        <div className="flex items-center gap-3.5 p-3.5 bg-surface-sunken rounded-xl mb-4">
          <FileText size={26} className="text-navy flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <div className="text-[13.5px] font-semibold truncate">{resume.file}</div>
            <div className="text-xs text-ink-tertiary mt-0.5">Uploaded {new Date(resume.uploadedOn).toLocaleDateString('en-IN')}</div>
          </div>
          <Button size="sm" onClick={() => window.open(`${FILE_BASE_URL}${resume.url}`, '_blank')}>
            <Download size={13} /> Open
          </Button>
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
          <Field label="Verification score">
            <Input type="number" min={0} max={100} value={score} onChange={(e) => setScore(Number(e.target.value))} />
          </Field>
        )}

        <Field label="Note" hint="Recorded on this resume's review history.">
          <Textarea value={note} onChange={(e) => setNote(e.target.value)} placeholder={decision === 'verified' ? 'What made this resume pass?' : 'What needs fixing?'} />
        </Field>
      </ModalBody>
      <ModalFoot>
        <Button onClick={app.closeModal} disabled={review.isPending}>
          Cancel
        </Button>
        <Button variant={decision === 'rejected' ? 'danger' : 'primary'} onClick={submit} disabled={review.isPending}>
          {review.isPending ? 'Saving...' : labels[decision]}
        </Button>
      </ModalFoot>
    </>
  )
}

export default function MyResumes() {
  const app = useApp()
  const [tab, setTab] = useState(0)
  const status = TAB_KEYS[tab]
  const { data: rows = [], isLoading, isError, refetch } = useResumePoolQuery({ status })

  if (isLoading) return <PageSkeleton />
  if (isError) return <ErrorState onRetry={refetch} />

  return (
    <StaggerGroup>
      <StaggerItem className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">My Resumes</h1>
        <p className="text-sm text-ink-secondary mt-1">Resumes an admin has assigned to you to verify.</p>
      </StaggerItem>

      <StaggerItem className="mb-4">
        <PillTabs items={TABS} active={tab} onChange={setTab} />
      </StaggerItem>

      <StaggerItem>
        {rows.length === 0 ? (
          <Card>
            <EmptyState icon={Inbox} tone="navy" title="Nothing here" body="Check another tab, or wait for an admin to assign you more resumes." />
          </Card>
        ) : (
          <div className="flex flex-col gap-4">
            {rows.map((r) => (
              <Card key={r.id} pad>
                <div className="flex items-start gap-4 flex-wrap">
                  <FileText size={22} className="text-navy flex-shrink-0 mt-0.5" />
                  <div className="flex-1 min-w-[220px]">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[15px] font-semibold">{r.name || r.file}</span>
                      <Badge tone={STATUS_TONE[r.status] ?? 'gray'}>{r.status}</Badge>
                    </div>
                    <div className="text-[13px] text-ink-secondary mt-1">
                      {r.email || 'No email on file'} · Uploaded {new Date(r.uploadedOn).toLocaleDateString('en-IN')}
                    </div>
                  </div>
                </div>

                {r.reviewNote && <p className="text-[12.5px] text-ink-secondary mt-3">Your note: {r.reviewNote}</p>}

                <div className="flex items-center gap-2 mt-4 pt-3.5 border-t border-border flex-wrap">
                  <Button size="sm" onClick={() => window.open(`${FILE_BASE_URL}${r.url}`, '_blank')}>
                    <Download size={13} /> Open resume
                  </Button>
                  <Button variant="primary" size="sm" onClick={() => app.openModal(<ReviewModal app={app} resume={r} onDone={refetch} />)}>
                    <ShieldCheck size={14} /> {r.status === 'verified' ? 'Re-review' : 'Review & decide'}
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
