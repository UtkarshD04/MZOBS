import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { Search, MapPin, GraduationCap, Wallet, Lock, Mail, Phone, Unlock, Download, Users, SlidersHorizontal, Briefcase } from 'lucide-react'
import PageHeader from '../components/layout/PageHeader'
import Card, { CardBody } from '../components/ui/Card'
import Button from '../components/ui/Button'
import Badge from '../components/ui/Badge'
import { Input, Select, Field } from '../components/ui/Field'
import Avatar from '../components/ui/Avatar'
import { ResumeVerifiedBadge } from '../components/ui/VerifiedBadge'
import EmptyState from '../components/ui/EmptyState'
import ErrorState from '../components/ui/ErrorState'
import { CardListSkeleton } from '../components/ui/Skeleton'
import Pagination from '../components/ui/Pagination'
import Modal from '../components/ui/Modal'
import { useResumeSearchQuery, useUnlockResumeSearchCandidate } from '../hooks/useResumeSearch'
import { useJobsQuery } from '../hooks/useJobs'
import { useCreditBalanceQuery } from '../hooks/useCvCredits'

const NOTICE_PERIODS = ['Immediate', '15 days', '30 days', '60 days', '90 days']
const WORK_MODES = ['On-site', 'Hybrid', 'Remote']
const JOB_TYPES = ['Full-time', 'Part-time', 'Contract', 'Internship']
const LIMIT = 8

const emptyFilters = { q: '', skills: '', location: '', experienceMin: '', experienceMax: '', noticePeriod: '', workMode: '', jobType: '' }

export default function ResumeSearch() {
  const navigate = useNavigate()
  const [draft, setDraft] = useState(emptyFilters)
  const [filters, setFilters] = useState(emptyFilters)
  const [page, setPage] = useState(1)
  const [unlockTarget, setUnlockTarget] = useState(null)
  const [sourceJobId, setSourceJobId] = useState('')

  const queryFilters = useMemo(() => ({ ...filters, page, limit: LIMIT }), [filters, page])
  const { data, isLoading, isError, refetch, isFetching } = useResumeSearchQuery(queryFilters)
  const { data: jobs = [] } = useJobsQuery()
  const { data: creditBalance } = useCreditBalanceQuery()
  const unlockCandidate = useUnlockResumeSearchCandidate()
  const remainingCredits = creditBalance?.wallet?.remainingCredits ?? 0

  const results = data?.data ?? []
  const total = data?.total ?? 0
  const pageCount = Math.max(1, Math.ceil(total / LIMIT))
  const unlockTargetProfile = useMemo(() => results.find((r) => r.employeeId === unlockTarget) ?? null, [results, unlockTarget])
  const needsJobPick = unlockTargetProfile && !unlockTargetProfile.candidateId

  function applyFilters() {
    setPage(1)
    setFilters(draft)
  }

  function resetFilters() {
    setDraft(emptyFilters)
    setFilters(emptyFilters)
    setPage(1)
  }

  function openUnlock(employeeId) {
    setSourceJobId('')
    setUnlockTarget(employeeId)
  }

  function confirmUnlock() {
    if (!unlockTarget) return
    if (needsJobPick && !sourceJobId) {
      toast.error('Choose a job to source this candidate for.')
      return
    }
    const employeeId = unlockTarget
    unlockCandidate.mutate(
      { employeeId, jobId: needsJobPick ? sourceJobId : undefined },
      {
        onSuccess: (res) => {
          setUnlockTarget(null)
          toast.success(res.alreadyUnlocked ? 'This candidate is already unlocked for your company.' : 'Candidate unlocked — 1 CV credit used.')
        },
        onError: (err) => {
          if (err.response?.data?.code === 'INSUFFICIENT_CREDITS') {
            toast.error('No CV credits remaining. Buy more to unlock this candidate.')
            setUnlockTarget(null)
            navigate('/cv-credits')
            return
          }
          if (err.response?.data?.code === 'JOB_REQUIRED') {
            toast.error(err.response.data.message)
            return
          }
          toast.error(err.response?.data?.message ?? 'Could not unlock this candidate.')
        },
      }
    )
  }

  return (
    <div>
      <PageHeader
        title="Search Resumes"
        subtitle="Search Mzobs' entire verified candidate database by skill, experience and location — proactively source great hires, not just applicants."
      />

      <button onClick={() => navigate('/cv-credits')} className="mb-5 w-full flex items-center justify-between gap-4 rounded-xl border border-navy/15 bg-navy-tint px-4 py-3 text-left hover:border-navy/35 hover:bg-navy-tint-strong transition-colors">
        <span className="flex items-center gap-3">
          <span className="w-9 h-9 rounded-lg bg-navy text-white flex items-center justify-center"><Wallet size={17} /></span>
          <span>
            <span className="block text-[13px] font-semibold">CV access wallet</span>
            <span className="block text-[11.5px] text-ink-secondary mt-0.5">Unlock phone, email and resume access for ₹25 per candidate.</span>
          </span>
        </span>
        <span className="text-right">
          <span className="block text-lg leading-none font-bold tabular-nums">{remainingCredits}</span>
          <span className="block mt-1 text-[10.5px] font-semibold uppercase tracking-wide text-ink-tertiary">credits left</span>
        </span>
      </button>

      <Card className="mb-5">
        <CardBody>
          <div className="flex items-center gap-2 mb-3.5 text-[12.5px] font-semibold text-ink-secondary">
            <SlidersHorizontal size={14} /> Filters
          </div>
          <div className="grid grid-cols-4 gap-3 max-lg:grid-cols-2 max-sm:grid-cols-1">
            <Field label="Keyword">
              <div className="relative">
                <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-tertiary" />
                <Input
                  value={draft.q}
                  onChange={(e) => setDraft({ ...draft, q: e.target.value })}
                  onKeyDown={(e) => e.key === 'Enter' && applyFilters()}
                  placeholder="Role, headline, company…"
                  className="pl-9"
                />
              </div>
            </Field>
            <Field label="Skills" hint="Comma-separated">
              <Input value={draft.skills} onChange={(e) => setDraft({ ...draft, skills: e.target.value })} placeholder="React, Node.js" />
            </Field>
            <Field label="Location">
              <Input value={draft.location} onChange={(e) => setDraft({ ...draft, location: e.target.value })} placeholder="City" />
            </Field>
            <Field label="Notice period">
              <Select value={draft.noticePeriod} onChange={(e) => setDraft({ ...draft, noticePeriod: e.target.value })}>
                <option value="">Any</option>
                {NOTICE_PERIODS.map((n) => (
                  <option key={n} value={n}>{n}</option>
                ))}
              </Select>
            </Field>
            <Field label="Experience — min (yrs)">
              <Input type="number" min="0" value={draft.experienceMin} onChange={(e) => setDraft({ ...draft, experienceMin: e.target.value })} placeholder="0" />
            </Field>
            <Field label="Experience — max (yrs)">
              <Input type="number" min="0" value={draft.experienceMax} onChange={(e) => setDraft({ ...draft, experienceMax: e.target.value })} placeholder="10" />
            </Field>
            <Field label="Work mode">
              <Select value={draft.workMode} onChange={(e) => setDraft({ ...draft, workMode: e.target.value })}>
                <option value="">Any</option>
                {WORK_MODES.map((w) => (
                  <option key={w} value={w}>{w}</option>
                ))}
              </Select>
            </Field>
            <Field label="Job type">
              <Select value={draft.jobType} onChange={(e) => setDraft({ ...draft, jobType: e.target.value })}>
                <option value="">Any</option>
                {JOB_TYPES.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </Select>
            </Field>
          </div>
          <div className="flex items-center gap-2.5 mt-4">
            <Button type="button" variant="primary" size="sm" loading={isFetching} onClick={applyFilters}>
              <Search size={14} /> Search
            </Button>
            <Button type="button" variant="ghost" size="sm" onClick={resetFilters}>
              Clear filters
            </Button>
          </div>
        </CardBody>
      </Card>

      {isLoading ? (
        <CardListSkeleton count={6} />
      ) : isError ? (
        <ErrorState onRetry={() => refetch()} />
      ) : results.length === 0 ? (
        <Card>
          <EmptyState icon={Users} title="No matching candidates" body="Try widening your filters — fewer skills, a broader experience range, or no location restriction." />
        </Card>
      ) : (
        <>
          <p className="text-[12.5px] text-ink-tertiary mb-3">{total.toLocaleString('en-IN')} candidate{total === 1 ? '' : 's'} match your search</p>
          <div className="grid grid-cols-2 gap-4 max-lg:grid-cols-1">
            {results.map((c) => (
              <Card key={c.employeeId} hover pad className="flex flex-col">
                <div className="flex items-start gap-3.5">
                  <Avatar initials={c.initials} size="md" />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[14.5px] font-semibold truncate">{c.name}</span>
                      {c.premium && <Badge tone="gold">Premium</Badge>}
                      {c.candidateId && <Badge tone="navy">In your pipeline</Badge>}
                    </div>
                    <div className="text-[12.5px] text-ink-secondary mt-0.5">{c.headline || c.preferredRole || (c.experience === 'fresher' ? 'Fresher' : c.designation) || '—'}</div>
                    {c.currentCompany && <div className="text-[12px] text-ink-tertiary mt-0.5 flex items-center gap-1.5"><Briefcase size={12} /> {c.designation ? `${c.designation} at ` : ''}{c.currentCompany}</div>}
                  </div>
                </div>

                <div className="flex items-center gap-1.5 flex-wrap mt-3">
                  {c.resumeVerified && <ResumeVerifiedBadge />}
                </div>

                <div className="grid grid-cols-2 gap-2.5 mt-3.5 text-[12px] text-ink-secondary">
                  <span className="flex items-center gap-1.5"><MapPin size={13} className="text-ink-tertiary" /> {c.location || '—'}</span>
                  <span className="flex items-center gap-1.5"><Wallet size={13} className="text-ink-tertiary" /> {c.expectedSalary || '—'}</span>
                  <span className="flex items-center gap-1.5"><GraduationCap size={13} className="text-ink-tertiary" /> {c.education?.[0]?.degree ?? '—'}</span>
                  <span className="flex items-center gap-1.5">{c.experienceYears ?? 0} yrs experience</span>
                </div>

                <div className="flex flex-wrap gap-1.5 mt-3.5">
                  {(c.skills ?? []).slice(0, 4).map((s) => (
                    <span key={s} className="text-[11px] font-medium px-2 py-[3px] rounded-full bg-surface-sunken text-ink-secondary">{s}</span>
                  ))}
                  {(c.skills ?? []).length > 4 && <span className="text-[11px] font-medium px-2 py-[3px] text-ink-tertiary">+{c.skills.length - 4} more</span>}
                </div>

                <div className="mt-3.5 pt-3.5 border-t border-border">
                  {c.unlocked ? (
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <div className="flex flex-col gap-1 text-[12px] text-ink-secondary min-w-0">
                        <span className="flex items-center gap-1.5 truncate"><Mail size={12} className="text-ink-tertiary flex-shrink-0" /> {c.email}</span>
                        <span className="flex items-center gap-1.5"><Phone size={12} className="text-ink-tertiary flex-shrink-0" /> {c.phone}</span>
                      </div>
                      <Badge tone="green" icon={<Unlock size={11} />}>Unlocked</Badge>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-1.5">
                      <div className="flex items-center justify-between gap-2 flex-wrap">
                        <span className="text-[11.5px] text-ink-tertiary truncate">{c.contactPreview?.email} · {c.contactPreview?.phone}</span>
                        {remainingCredits > 0 ? (
                          <Button variant="gold" size="sm" loading={unlockCandidate.isPending && unlockCandidate.variables?.employeeId === c.employeeId} onClick={() => openUnlock(c.employeeId)}>
                            <Lock size={13} /> Unlock — 1 credit
                          </Button>
                        ) : (
                          <Button variant="secondary" size="sm" onClick={() => navigate('/cv-credits')}>
                            <Wallet size={13} /> Buy credits
                          </Button>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {c.candidateId && (
                  <div className="flex items-center gap-2 mt-4 pt-3.5 border-t border-border">
                    <Button variant="secondary" size="sm" onClick={() => navigate(`/candidates/${c.candidateId}`)}>
                      View in Applicants <Download size={13} />
                    </Button>
                  </div>
                )}
              </Card>
            ))}
          </div>
          <Pagination page={page} pageCount={pageCount} onChange={setPage} total={total} pageSize={LIMIT} />
        </>
      )}

      <Modal
        open={!!unlockTarget}
        onClose={() => setUnlockTarget(null)}
        title="Unlock this candidate?"
        subtitle={
          unlockTargetProfile
            ? `${unlockTargetProfile.name} — ${unlockTargetProfile.headline || 'candidate'}. This will use 1 CV credit (₹25) and give your company unlimited access to their phone number, email and resume.`
            : 'This will use 1 CV credit (₹25).'
        }
        size="sm"
        footer={
          <>
            <Button variant="secondary" size="sm" onClick={() => setUnlockTarget(null)}>Cancel</Button>
            <Button variant="gold" size="sm" loading={unlockCandidate.isPending} onClick={confirmUnlock}>
              <Lock size={14} /> Confirm unlock
            </Button>
          </>
        }
      >
        {needsJobPick && (
          <Field label="Source for which job?" hint="New candidates from search need to be attached to one of your postings.">
            <Select value={sourceJobId} onChange={(e) => setSourceJobId(e.target.value)}>
              <option value="">Select a job</option>
              {jobs.map((j) => (
                <option key={j.id} value={j.id}>{j.title}</option>
              ))}
            </Select>
          </Field>
        )}
        <div className="flex items-center justify-between text-[13px] text-ink-secondary">
          <span>Current balance</span>
          <span className="font-semibold text-ink">{remainingCredits} credit{remainingCredits === 1 ? '' : 's'}</span>
        </div>
        <div className="flex items-center justify-between text-[13px] text-ink-secondary mt-1.5">
          <span>Balance after unlock</span>
          <span className="font-semibold text-ink">{Math.max(remainingCredits - 1, 0)} credit{Math.max(remainingCredits - 1, 0) === 1 ? '' : 's'}</span>
        </div>
      </Modal>
    </div>
  )
}
