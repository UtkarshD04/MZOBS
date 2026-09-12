import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import toast from 'react-hot-toast'
import {
  ArrowLeft, Briefcase, CalendarPlus, Download, ExternalLink, GraduationCap, Lock, Mail, MapPin, Phone,
  ThumbsDown, ThumbsUp, Unlock, Wallet, FileText, Award, FolderGit2,
} from 'lucide-react'
import PageHeader from '../components/layout/PageHeader'
import Card, { CardBody, CardHead, CardTitle } from '../components/ui/Card'
import Button from '../components/ui/Button'
import Badge from '../components/ui/Badge'
import Avatar from '../components/ui/Avatar'
import { CandidateStageBadge, InterviewStatusBadge } from '../components/ui/StatusBadge'
import { ResumeVerifiedBadge, IdentityVerifiedBadge } from '../components/ui/VerifiedBadge'
import { PageSkeleton } from '../components/ui/Skeleton'
import ErrorState from '../components/ui/ErrorState'
import EmptyState from '../components/ui/EmptyState'
import Modal from '../components/ui/Modal'
import { Field, Textarea } from '../components/ui/Field'
import { useCandidateQuery, useSetCandidateStage, useCandidateResumeUrl } from '../hooks/useCandidates'
import { useAccessStatusQuery } from '../hooks/useSubscription'
import { useCreditBalanceQuery, useUnlockCandidate } from '../hooks/useCvCredits'
import { useInterviewsQuery } from '../hooks/useInterviews'
import { fmtDateTime } from '../lib/utils'
import { FILE_BASE_URL } from '../lib/config'

export default function CandidateProfile() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { data: candidate, isLoading, isError, refetch } = useCandidateQuery(id)
  const { data: interviews = [] } = useInterviewsQuery()
  const { data: access } = useAccessStatusQuery()
  const setStage = useSetCandidateStage()
  const [rejectOpen, setRejectOpen] = useState(false)
  const [reason, setReason] = useState('')
  const [resumeOpen, setResumeOpen] = useState(false)
  const getResumeUrl = useCandidateResumeUrl()
  const [resumeUrl, setResumeUrl] = useState(null)
  const [unlockConfirmOpen, setUnlockConfirmOpen] = useState(false)
  const { data: creditBalance } = useCreditBalanceQuery()
  const unlockCandidate = useUnlockCandidate()
  const remainingCredits = creditBalance?.wallet?.remainingCredits ?? 0

  function openResume() {
    setResumeOpen(true)
    setResumeUrl(null)
    if (!access?.active) return
    getResumeUrl.mutate(id, { onSuccess: (res) => setResumeUrl(res.url) })
  }

  function confirmCreditUnlock() {
    setUnlockConfirmOpen(false)
    unlockCandidate.mutate(id, {
      onSuccess: (data) => {
        if (data.alreadyUnlocked) toast('This candidate is already unlocked for your company.')
        else toast.success('Candidate unlocked — 1 CV credit used.')
      },
      onError: (err) => {
        if (err.response?.data?.code === 'INSUFFICIENT_CREDITS') {
          toast.error('No CV credits remaining. Buy more to unlock this candidate.')
          navigate('/cv-credits')
        }
      },
    })
  }

  function downloadCreditResume() {
    unlockCandidate.mutate(id, {
      onSuccess: ({ candidate: unlocked }) => {
        if (unlocked.resumeUrl) window.open(`${FILE_BASE_URL}${unlocked.resumeUrl}`, '_blank')
      },
    })
  }

  if (isLoading) return <PageSkeleton />
  if (isError || !candidate) return <ErrorState title="Candidate not found" body="This candidate may have been removed from your shared pool." onRetry={() => refetch()} />

  const myInterviews = interviews.filter((i) => i.candidateId === candidate.id)

  return (
    <div>
      <button onClick={() => navigate('/candidates')} className="flex items-center gap-1.5 text-[12.5px] font-semibold text-ink-secondary hover:text-ink mb-4">
        <ArrowLeft size={14} /> Back to Candidates
      </button>

      <PageHeader
        title={candidate.name}
        subtitle={`${candidate.headline} · Applied for ${candidate.appliedFor}`}
        actions={
          candidate.stage !== 'rejected' && candidate.stage !== 'hired' ? (
            <>
              <Button variant="secondary" size="md" onClick={openResume}>
                <FileText size={16} /> View Resume
              </Button>
              <Button variant="gold" size="md" onClick={() => setStage.mutate({ id: candidate.id, stage: 'shortlisted' })}>
                <ThumbsUp size={16} /> Shortlist
              </Button>
              <Button variant="danger" size="md" onClick={() => setRejectOpen(true)}>
                <ThumbsDown size={16} /> Reject
              </Button>
              <Button variant="primary" size="md" onClick={() => navigate('/interviews')}>
                <CalendarPlus size={16} /> Schedule Interview
              </Button>
            </>
          ) : (
            <Button variant="secondary" size="md" onClick={openResume}>
              <FileText size={16} /> View Resume
            </Button>
          )
        }
      />

      <div className="grid grid-cols-3 gap-5 max-xl:grid-cols-1">
        <div className="col-span-2 max-xl:col-span-1 flex flex-col gap-5">
          <Card pad>
            <div className="flex items-start gap-4">
              <Avatar initials={candidate.initials} size="lg" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-[17px] font-bold tracking-tight">{candidate.name}</h2>
                  <CandidateStageBadge status={candidate.stage} />
                </div>
                <div className="text-[13px] text-ink-secondary mt-0.5">{candidate.headline}</div>
                <div className="flex items-center gap-1.5 flex-wrap mt-2.5">
                  <ResumeVerifiedBadge />
                  <IdentityVerifiedBadge />
                </div>
                {candidate.stage === 'rejected' && candidate.rejectionReason && (
                  <div className="mt-3 text-[12.5px] bg-red-tint text-red rounded-lg px-3 py-2">Rejected: {candidate.rejectionReason}</div>
                )}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 mt-5 pt-5 border-t border-border text-[13px] max-sm:grid-cols-1">
              <InfoRow icon={MapPin} label="Location" value={candidate.location} />
              <InfoRow icon={Wallet} label="Expected Salary" value={candidate.expectedSalary} />
              <InfoRow icon={Briefcase} label="Experience" value={`${candidate.experienceYears} years`} />
              <InfoRow icon={GraduationCap} label="Availability" value={candidate.availability} />
            </div>
          </Card>

          <Card>
            <CardHead><CardTitle>Work Experience</CardTitle></CardHead>
            {candidate.workHistory.length === 0 ? (
              <EmptyState title="No prior work experience listed" body="This candidate hasn't added any employment history." />
            ) : (
              <div className="px-[22px] pb-[22px] pt-1">
                {candidate.workHistory.map((w, i) => (
                  <div key={i} className="flex gap-3.5 py-3.5 border-b border-border last:border-b-0">
                    <span className="w-9 h-9 rounded-[10px] bg-navy-tint text-navy flex items-center justify-center flex-shrink-0"><Briefcase size={16} /></span>
                    <div>
                      <div className="text-[13.5px] font-semibold">{w.role}</div>
                      <div className="text-[12.5px] text-ink-secondary">{w.company}</div>
                      <div className="text-[11.5px] text-ink-tertiary mt-0.5">{w.duration}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>

          <Card>
            <CardHead><CardTitle>Education</CardTitle></CardHead>
            <div className="px-[22px] pb-[22px] pt-1">
              {candidate.education.map((e, i) => (
                <div key={i} className="flex gap-3.5 py-3.5 border-b border-border last:border-b-0">
                  <span className="w-9 h-9 rounded-[10px] bg-teal-tint text-teal flex items-center justify-center flex-shrink-0"><GraduationCap size={16} /></span>
                  <div>
                    <div className="text-[13.5px] font-semibold">{e.degree}</div>
                    <div className="text-[12.5px] text-ink-secondary">{e.institute}</div>
                    <div className="text-[11.5px] text-ink-tertiary mt-0.5">{e.year}</div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {candidate.projects.length > 0 && (
            <Card>
              <CardHead><CardTitle>Projects</CardTitle></CardHead>
              <div className="px-[22px] pb-[22px] pt-1">
                {candidate.projects.map((p, i) => (
                  <div key={i} className="flex gap-3.5 py-3.5 border-b border-border last:border-b-0">
                    <span className="w-9 h-9 rounded-[10px] bg-violet-tint text-violet flex items-center justify-center flex-shrink-0"><FolderGit2 size={16} /></span>
                    <div>
                      <div className="text-[13.5px] font-semibold">{p.name}</div>
                      <div className="text-[12.5px] text-ink-secondary mt-0.5 leading-relaxed">{p.description}</div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}

          <Card>
            <CardHead><CardTitle>Interview History</CardTitle></CardHead>
            {myInterviews.length === 0 ? (
              <EmptyState icon={CalendarPlus} title="No interviews yet" body="Interviews you schedule with this candidate for your company will show here." />
            ) : (
              <div className="px-[22px] pb-[22px] pt-1">
                {myInterviews.map((iv) => (
                  <div key={iv.id} className="flex items-center justify-between gap-3 py-3.5 border-b border-border last:border-b-0">
                    <div>
                      <div className="text-[13.5px] font-semibold">{iv.round}</div>
                      <div className="text-[12px] text-ink-tertiary mt-0.5">{fmtDateTime(iv.startsAt)} · {iv.mode}</div>
                      {iv.feedback && <div className="text-[12px] text-ink-secondary mt-1">"{iv.feedback.notes}"</div>}
                    </div>
                    <InterviewStatusBadge status={iv.status} />
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>

        <div className="flex flex-col gap-5">
          <Card>
            <CardHead>
              <CardTitle>CV Access</CardTitle>
              {candidate.unlocked && <Badge tone="green" icon={<Unlock size={11} />}>Unlocked</Badge>}
            </CardHead>
            {candidate.unlocked ? (
              <CardBody className="flex flex-col gap-3">
                <div className="flex items-center gap-2 text-[12.5px] font-semibold text-green">
                  <Unlock size={15} /> Unlocked for your company
                </div>
                <InfoRow icon={Mail} label="Email" value={candidate.email || '—'} />
                <InfoRow icon={Phone} label="Phone" value={candidate.phone || '—'} />
                <Button variant="secondary" size="sm" className="w-full mt-1" loading={unlockCandidate.isPending} onClick={downloadCreditResume}>
                  <Download size={14} /> Download Resume
                </Button>
                <p className="text-[11.5px] text-ink-tertiary text-center mt-1">No further credits will be used for this profile.</p>
              </CardBody>
            ) : (
              <CardBody>
                <div className="flex items-start gap-2.5 text-[12.5px] text-ink-secondary leading-relaxed">
                  <Lock size={15} className="text-amber mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-ink">Unlock candidate contact details</p>
                    <p className="mt-1">Use 1 CV credit (₹25) to unlock this candidate's phone, email and verified resume.</p>
                  </div>
                </div>
                <div className="text-[12px] text-ink-tertiary mt-3">{candidate.contactPreview?.email} · {candidate.contactPreview?.phone}</div>
                <div className="flex items-center justify-between text-[12px] text-ink-secondary mt-3 pt-3 border-t border-border">
                  <span>Available balance</span>
                  <span className="font-semibold text-ink">{remainingCredits} credit{remainingCredits === 1 ? '' : 's'}</span>
                </div>
                <Button variant="gold" size="sm" className="w-full mt-3" disabled={remainingCredits === 0} loading={unlockCandidate.isPending} onClick={() => (remainingCredits === 0 ? navigate('/cv-credits') : setUnlockConfirmOpen(true))}>
                  <Lock size={14} /> {remainingCredits === 0 ? 'Buy credits' : 'Unlock contact & CV — 1 credit'}
                </Button>
                <div className="text-center mt-2">
                  <button onClick={() => navigate('/cv-credits')} className="text-[11.5px] text-ink-tertiary underline hover:text-ink-secondary">View credit packs</button>
                </div>
              </CardBody>
            )}
          </Card>

          <Card>
            <CardHead><CardTitle>Skills</CardTitle></CardHead>
            <CardBody className="flex flex-wrap gap-1.5">
              {candidate.skills.map((s) => (
                <span key={s} className="text-[12px] font-medium px-2.5 py-1 rounded-full bg-surface-sunken text-ink-secondary">{s}</span>
              ))}
            </CardBody>
          </Card>

          <Card>
            <CardHead><CardTitle>Certificates & Portfolio</CardTitle></CardHead>
            <CardBody className="flex flex-col gap-2.5">
              <InfoRow icon={Award} label="Certificates" value={`${candidate.certificates} verified`} />
              {candidate.hasVideoIntro && <InfoRow icon={FileText} label="Video Introduction" value="Available" />}
              {candidate.hasPortfolio && candidate.portfolioLink ? (
                <Link to={`https://${candidate.portfolioLink}`} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-[13px] font-semibold text-navy hover:underline mt-1">
                  <ExternalLink size={14} /> {candidate.portfolioLink}
                </Link>
              ) : (
                <span className="text-[12.5px] text-ink-tertiary">No portfolio shared</span>
              )}
            </CardBody>
          </Card>
        </div>
      </div>

      <Modal
        open={unlockConfirmOpen}
        onClose={() => setUnlockConfirmOpen(false)}
        title="Unlock this candidate?"
        subtitle={`${candidate.name} — ${candidate.headline}. This will use 1 CV credit (₹25). You will get unlimited access to this candidate's phone number, email and resume for your company.`}
        size="sm"
        footer={
          <>
            <Button variant="secondary" size="sm" onClick={() => setUnlockConfirmOpen(false)}>Cancel</Button>
            <Button variant="gold" size="sm" onClick={confirmCreditUnlock}>
              <Lock size={14} /> Confirm unlock
            </Button>
          </>
        }
      >
        <div className="flex items-center justify-between text-[13px] text-ink-secondary">
          <span>Current balance</span>
          <span className="font-semibold text-ink">{remainingCredits} credit{remainingCredits === 1 ? '' : 's'}</span>
        </div>
        <div className="flex items-center justify-between text-[13px] text-ink-secondary mt-1.5">
          <span>Balance after unlock</span>
          <span className="font-semibold text-ink">{Math.max(remainingCredits - 1, 0)} credit{Math.max(remainingCredits - 1, 0) === 1 ? '' : 's'}</span>
        </div>
      </Modal>

      <Modal open={resumeOpen} onClose={() => setResumeOpen(false)} title={`${candidate.name} — Resume`} size="lg">
        <div className="rounded-xl border border-dashed border-border-strong bg-surface-sunken flex flex-col items-center justify-center gap-3 py-16">
          {!access?.active ? (
            <>
              <Lock size={30} className="text-ink-tertiary" />
              <p className="text-[13px] text-ink-secondary text-center max-w-xs">Activate your employer plan to view and download this applicant's resume.</p>
              <Button variant="primary" size="sm" onClick={() => navigate('/subscription')}>Activate Plan</Button>
            </>
          ) : (
            <>
              <FileText size={30} className="text-ink-tertiary" />
              {getResumeUrl.isPending ? (
                <p className="text-[13px] text-ink-secondary text-center max-w-xs">Preparing a secure link…</p>
              ) : resumeUrl ? (
                <>
                  <p className="text-[13px] text-ink-secondary text-center max-w-xs">Opens in a new tab. The link expires shortly after it's generated.</p>
                  <Button variant="secondary" size="sm" onClick={() => window.open(`${FILE_BASE_URL}${resumeUrl}`, '_blank')}>
                    <Download size={14} /> Download Resume
                  </Button>
                </>
              ) : (
                <p className="text-[13px] text-ink-secondary text-center max-w-xs">This candidate's resume isn't available yet.</p>
              )}
            </>
          )}
        </div>
      </Modal>

      <Modal
        open={rejectOpen}
        onClose={() => setRejectOpen(false)}
        title="Reject candidate"
        subtitle="This candidate will be moved out of your active pipeline."
        size="sm"
        footer={
          <>
            <Button variant="secondary" size="sm" onClick={() => setRejectOpen(false)}>Cancel</Button>
            <Button
              variant="danger"
              size="sm"
              loading={setStage.isPending}
              onClick={() => {
                setStage.mutate({ id: candidate.id, stage: 'rejected', reason: reason || undefined })
                setRejectOpen(false)
              }}
            >
              Confirm Reject
            </Button>
          </>
        }
      >
        <Field label="Reason" optional>
          <Textarea rows={3} value={reason} onChange={(e) => setReason(e.target.value)} placeholder="Optional note for your hiring team" />
        </Field>
      </Modal>
    </div>
  )
}

function InfoRow({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center gap-2.5">
      <span className="w-8 h-8 rounded-lg bg-surface-sunken text-ink-secondary flex items-center justify-center flex-shrink-0"><Icon size={14} /></span>
      <div className="min-w-0">
        <div className="text-[11px] text-ink-tertiary">{label}</div>
        <div className="text-[13px] font-medium truncate">{value}</div>
      </div>
    </div>
  )
}
