import { useRef } from 'react'
import { Upload, FileText, Download, CheckCircle2, ShieldCheck, Clock, Send } from 'lucide-react'
import Card, { CardHead } from '../components/ui/Card'
import Badge from '../components/ui/Badge'
import Ring from '../components/ui/Ring'
import Button from '../components/ui/Button'
import Stepper from '../components/ui/Stepper'
import { TableWrap, Table, Tr, Td } from '../components/ui/Table'
import { StaggerGroup, StaggerItem } from '../components/ui/Stagger'
import { PageSkeleton } from '../components/ui/Skeleton'
import ErrorState from '../components/ui/ErrorState'
import PaymentLock from '../components/ui/PaymentLock'
import { useApp } from '../context/AppContext'
import { useResumeQuery, useUploadResumeMutation } from '../hooks/useResume'
import { useProfileQuery } from '../hooks/useProfile'
import { FILE_BASE_URL } from '../lib/config'

const VERIFICATION_STEPS = ['Uploaded', 'Received by Mzobs', 'Expert review', 'Verified', 'Eligible for dispatch']

export default function ResumeCenter() {
  const app = useApp()
  const fileInputRef = useRef(null)
  const { data, isLoading, isError, refetch } = useResumeQuery()
  const { data: profile, isLoading: profileLoading, isError: profileError, refetch: refetchProfile } = useProfileQuery()
  const uploadResume = useUploadResumeMutation()

  if (isLoading || profileLoading) return <PageSkeleton />
  if (isError || profileError) return <ErrorState onRetry={() => (isError ? refetch() : refetchProfile())} />

  const resume = data?.resume ?? {}
  const history = data?.resumeHistory ?? []
  const verified = resume.status === 'verified'
  const stepIndex = resume.status === 'none' ? -1 : verified ? 4 : resume.status === 'pending' ? 2 : 2
  const paid = profile?.subscription?.status === 'paid'

  if (!paid) {
    return (
      <StaggerGroup>
        <StaggerItem className="mb-6">
          <h1 className="text-2xl font-bold tracking-tight">Resume Center</h1>
          <p className="text-sm text-ink-secondary mt-1">Upload your resume here — the Mzobs team verifies it before any employer sees it.</p>
        </StaggerItem>
        <StaggerItem>
          <PaymentLock
            title="Activate placement support to upload your resume"
            body="A one-time ₹299 payment unlocks resume upload, verification, your mock interview, and job applications."
          />
        </StaggerItem>
      </StaggerGroup>
    )
  }

  function handleFilePicked(e) {
    const file = e.target.files?.[0]
    if (!file) return
    uploadResume.mutate(file, {
      onSuccess: () => app.addToast('success', 'Resume uploaded — sent to the Mzobs team for verification'),
      onError: (err) => app.addToast('error', err.response?.data?.message ?? 'Upload failed. Please try again.'),
    })
    e.target.value = ''
  }

  return (
    <StaggerGroup>
      <StaggerItem className="flex items-start justify-between gap-5 flex-wrap mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Resume Center</h1>
          <p className="text-sm text-ink-secondary mt-1">Upload your resume here — the Mzobs team verifies it before any employer sees it.</p>
        </div>
        <div className="flex gap-2.5">
          <input ref={fileInputRef} type="file" accept=".pdf,.doc,.docx" className="hidden" onChange={handleFilePicked} />
          <Button variant="primary" onClick={() => fileInputRef.current?.click()} disabled={uploadResume.isPending}>
            <Upload size={15} /> {uploadResume.isPending ? 'Uploading...' : resume.status === 'none' ? 'Upload resume' : 'Upload new resume'}
          </Button>
        </div>
      </StaggerItem>

      <StaggerItem className="mb-5">
        <Card pad>
          <div className="flex items-center justify-between flex-wrap gap-3 mb-5">
            <span className="text-[15px] font-semibold">Verification status</span>
            <Badge tone={verified ? 'green' : resume.status === 'none' ? 'navy' : 'gold'}>
              {verified ? 'Verified by Mzobs' : resume.status === 'none' ? 'No resume uploaded' : resume.status === 'changes' ? 'Changes requested' : resume.status === 'rejected' ? 'Rejected' : 'Pending verification'}
            </Badge>
          </div>
          <Stepper
            steps={VERIFICATION_STEPS.map((label, i) => ({
              label,
              state: stepIndex < 0 ? '' : verified ? 'done' : i < stepIndex ? 'done' : i === stepIndex ? 'current' : '',
            }))}
          />
          <p className="text-[13px] text-ink-secondary mt-6 pt-5 border-t border-border">
            {verified ? (
              <>
                Verified on <b className="text-ink">{new Date(resume.verifiedOn).toLocaleDateString('en-IN')}</b>
                {resume.reviewer ? (
                  <>
                    {' '}
                    by <b className="text-ink">{resume.reviewer}</b> {resume.reviewerRole ? `(${resume.reviewerRole})` : ''}
                  </>
                ) : null}
                . Your resume is now eligible to be sent to hiring companies when a matching requirement opens.
              </>
            ) : resume.status === 'none' ? (
              <>Upload your resume to start the Mzobs verification process.</>
            ) : (
              <>Our verification team usually clears resumes within 24–48 hours. You'll get a notification the moment it's decided.</>
            )}
          </p>
        </Card>
      </StaggerItem>

      {resume.status !== 'none' && (
        <StaggerItem className="grid lg:grid-cols-[1.3fr_1fr] gap-5 mb-4">
          <Card pad>
            <div className="flex items-center justify-between mb-4">
              <span className="text-[15px] font-semibold">Current resume</span>
              <Badge tone={verified ? 'green' : 'gold'}>{verified ? 'Verified' : 'Under review'}</Badge>
            </div>
            <div className="flex items-center gap-3.5 p-3.5 bg-surface-sunken rounded-xl">
              <FileText size={30} className="text-navy flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="text-[14px] font-semibold truncate">{resume.file}</div>
                <div className="text-xs text-ink-tertiary mt-1">
                  Version {resume.version} · Uploaded {new Date(resume.uploadedOn).toLocaleDateString('en-IN')}
                  {resume.reviewer ? ` · Reviewed by ${resume.reviewer}` : ''}
                </div>
              </div>
              {resume.url && (
                <Button size="sm" onClick={() => window.open(`${FILE_BASE_URL}${resume.url}`, '_blank')}>
                  <Download size={14} /> Download
                </Button>
              )}
            </div>
            {verified && (
              <div className="text-xs text-ink-tertiary mt-3 flex items-center gap-1">
                <CheckCircle2 size={12} className="text-green" /> Verified on {new Date(resume.verifiedOn).toLocaleDateString('en-IN')}
              </div>
            )}
            {resume.note && (
              <div className="mt-4 pt-4 border-t border-border">
                <div className="text-xs font-semibold tracking-wide uppercase text-ink-tertiary mb-1.5">Reviewer note</div>
                <p className="text-[13px] text-ink-secondary">{resume.note}</p>
              </div>
            )}
          </Card>
          <Card pad className="flex flex-col items-center justify-center text-center">
            <div className="text-xs font-semibold tracking-wide uppercase text-ink-tertiary mb-2">Verification Score</div>
            <Ring value={resume.score ?? 0} size={96} thick={9} hero={!!resume.score} />
            <div className="text-[13px] text-ink-secondary mt-2.5">
              {resume.score != null ? 'Assigned by the Mzobs verification team' : 'Assigned once a reviewer scores your resume'}
            </div>
            <div className="text-xs text-ink-tertiary mt-1">A higher score means you're shortlisted earlier in a dispatch batch.</div>
          </Card>
        </StaggerItem>
      )}

      <StaggerItem className="mb-4">
        <Card pad className="flex items-start gap-3">
          <Send size={15} className="text-navy mt-0.5 flex-shrink-0" />
          <div className="text-[12.5px] text-ink-secondary">
            Re-uploading resets verification. Your new version goes back into the Mzobs queue, and only the verified version is sent to employers.
          </div>
        </Card>
      </StaggerItem>

      {history.length > 0 && (
        <StaggerItem>
          <Card>
            <CardHead>
              <span className="text-[15px] font-semibold">Upload history</span>
            </CardHead>
            <TableWrap className="border-none rounded-none">
              <Table columns={['Version', 'Uploaded', 'Score', 'Mzobs decision', '']}>
                {history.map((r) => (
                  <Tr key={r.version}>
                    <Td className="font-bold">{r.version}</Td>
                    <Td>{r.uploadedOn ? new Date(r.uploadedOn).toLocaleDateString('en-IN') : ''}</Td>
                    <Td className="font-bold">{r.score ?? '—'}</Td>
                    <Td>
                      <Badge tone={r.status === 'verified' ? 'green' : r.status === 'rejected' ? 'red' : 'gold'}>{r.status}</Badge>
                    </Td>
                    <Td>
                      {r.url && (
                        <Button variant="ghost" size="sm" onClick={() => window.open(`${FILE_BASE_URL}${r.url}`, '_blank')}>
                          <Download size={14} />
                        </Button>
                      )}
                    </Td>
                  </Tr>
                ))}
              </Table>
            </TableWrap>
          </Card>
        </StaggerItem>
      )}

      <StaggerItem className="mt-5">
        <Card pad className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-[10px] bg-navy-tint text-navy flex items-center justify-center flex-shrink-0">
            <ShieldCheck size={17} />
          </div>
          <div>
            <div className="text-[13.5px] font-semibold">Why we verify every resume</div>
            <p className="text-[13px] text-ink-secondary mt-1 flex items-start gap-1.5">
              <Clock size={13} className="mt-0.5 flex-shrink-0 text-ink-tertiary" />
              Employers pay Mzobs for a pre-screened shortlist, not a pile of applications. Verification is what makes your resume worth sending — and
              it's why an unverified resume never leaves our system.
            </p>
          </div>
        </Card>
      </StaggerItem>
    </StaggerGroup>
  )
}
