import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Sliders, MapPin, Bookmark, Sparkles, BarChart3, Briefcase, Users, ShieldCheck, Lock, CheckCircle2 } from 'lucide-react'
import Card from '../components/ui/Card'
import Badge from '../components/ui/Badge'
import Button from '../components/ui/Button'
import { CompanyLogo } from '../components/ui/Avatar'
import { PillTabs } from '../components/ui/Tabs'
import { Select } from '../components/ui/Field'
import EmptyState from '../components/ui/EmptyState'
import { StaggerGroup, StaggerItem } from '../components/ui/Stagger'
import { PageSkeleton } from '../components/ui/Skeleton'
import ErrorState from '../components/ui/ErrorState'
import { categoryOf, trackKeysForCategoryTitle } from '../lib/category'
import { useApp } from '../context/AppContext'
import { openApplyModal, openJobDetailModal, fmtSalaryRange } from '../lib/modals'
import { useProfileQuery } from '../hooks/useProfile'
import { useJobsQuery } from '../hooks/useJobs'
import { useApplicationsQuery } from '../hooks/useApplications'

const SAVED_KEY = 'mzobs-saved-jobs'

function JobCard({ job, applied, eligible, saved, employeeTrack, onToggleSave, onApplied }) {
  const app = useApp()
  const cat = categoryOf(job.track)
  const onTrack = !!job.track && job.track === employeeTrack

  return (
    <Card hover pad className="flex gap-4 items-start">
      <CompanyLogo initials={job.logo} tone={cat.tone} />
      <div className="flex-1 min-w-0">
        <div className="flex justify-between flex-wrap gap-2">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <div className="text-[15px] font-semibold">{job.title}</div>
              <Badge tone={cat.tone} dot={false}>
                {cat.label}
              </Badge>
              {onTrack && (
                <Badge tone="gold" icon={<Sparkles size={11} />} dot={false}>
                  Your track
                </Badge>
              )}
            </div>
            <div className="text-[13px] text-ink-secondary mt-0.5">
              {job.company} · {job.location} · {job.workMode}
            </div>
            <div className="text-xs text-ink-tertiary mt-1.5 flex items-center gap-1">
              <Users size={11} /> {job.vacancies} opening{job.vacancies > 1 ? 's' : ''} · Verified employer
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3.5 mt-2.5 text-[13px] flex-wrap">
          <span className="flex items-center gap-1 text-ink-tertiary">
            <MapPin size={12} /> {job.location}
          </span>
          <span>{fmtSalaryRange(job)}</span>
          <span className="text-xs text-ink-tertiary">Posted {job.posted}</span>
        </div>

        <div className="flex flex-wrap gap-1.5 mt-2.5">
          {(job.skills ?? []).map((t) => (
            <span key={t} className="text-[11px] font-semibold text-ink-secondary bg-surface-sunken px-2 py-1 rounded-md">
              {t}
            </span>
          ))}
        </div>

        <div className="flex items-center gap-2 mt-3.5 flex-wrap">
          {applied ? (
            <Badge tone="green" icon={<CheckCircle2 size={11} />} dot={false}>
              Applied — with Mzobs
            </Badge>
          ) : (
            <Button variant="primary" size="sm" disabled={!eligible} onClick={() => openApplyModal(app, job, onApplied)}>
              Apply through Mzobs
            </Button>
          )}
          <Button size="sm" onClick={() => openJobDetailModal(app, job, onApplied)}>
            View details
          </Button>
          <button onClick={onToggleSave} className={`ml-auto p-1.5 rounded-lg ${saved ? 'text-gold-strong' : 'text-ink-tertiary hover:bg-surface-hover hover:text-ink'}`}>
            <Bookmark size={17} fill={saved ? 'currentColor' : 'none'} />
          </button>
        </div>
      </div>
    </Card>
  )
}

export default function JobMatching() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const categoryTitle = searchParams.get('category')
  const [tab, setTab] = useState(0)
  const [saved, setSaved] = useState(() => new Set(JSON.parse(localStorage.getItem(SAVED_KEY) ?? '[]')))

  const { data: profile, isLoading: profileLoading } = useProfileQuery()
  const { data: jobs = [], isLoading: jobsLoading, isError: jobsError, refetch: refetchJobs } = useJobsQuery()
  const { data: applications = [], refetch: refetchApplications } = useApplicationsQuery()

  useEffect(() => {
    localStorage.setItem(SAVED_KEY, JSON.stringify([...saved]))
  }, [saved])

  function toggleSave(id) {
    setSaved((s) => {
      const next = new Set(s)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  if (profileLoading || jobsLoading) return <PageSkeleton />
  if (jobsError) return <ErrorState onRetry={refetchJobs} />

  const paid = profile?.subscription?.status === 'paid'
  const eligible = paid && profile?.resume?.status === 'verified'
  const track = profile?.skillTrack
  const appliedJobIds = new Set(applications.map((a) => a.jobId))
  const savedJobs = jobs.filter((j) => saved.has(j.id))
  const trackJobs = track?.key ? jobs.filter((j) => j.track === track.key) : []
  const categoryTrackKeys = categoryTitle ? trackKeysForCategoryTitle(categoryTitle) : null
  const categoryJobs = categoryTrackKeys ? jobs.filter((j) => categoryTrackKeys.includes(j.track)) : []

  const cardProps = (job) => ({
    job,
    applied: appliedJobIds.has(job.id),
    eligible,
    saved: saved.has(job.id),
    employeeTrack: track?.key,
    onToggleSave: () => toggleSave(job.id),
    onApplied: refetchApplications,
  })

  return (
    <StaggerGroup>
      <StaggerItem className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Job Openings</h1>
        <p className="text-sm text-ink-secondary mt-1">
          Live requirements from companies verified by Mzobs. Applying sends your profile to our team — never straight to the employer.
        </p>
      </StaggerItem>

      <StaggerItem className="mb-5">
        <Card pad className={`flex items-start gap-3 ${eligible ? 'border-navy-ring bg-navy-tint' : 'border-gold-dot/40 bg-gold-tint'}`}>
          {paid ? (
            <ShieldCheck size={18} className={`mt-0.5 flex-shrink-0 ${eligible ? 'text-navy' : 'text-gold-strong'}`} />
          ) : (
            <Lock size={18} className="mt-0.5 flex-shrink-0 text-gold-strong" />
          )}
          <div className="flex-1 min-w-0">
            <div className="text-[13.5px] font-semibold">
              {!paid
                ? 'Activate placement support to unlock applications'
                : eligible
                  ? `You're eligible to apply${track?.key ? ` — ${track.label || track.key}, Grade ${track.grade || '-'}` : ''}`
                  : 'Finish verification to unlock applications'}
            </div>
            <p className="text-[13px] text-ink-secondary mt-0.5">
              {!paid
                ? 'A one-time ₹299 payment unlocks resume upload, verification, and applying to openings.'
                : eligible
                  ? 'Your resume is verified. When you apply, Mzobs screens you, shortlists against the requirement, and forwards your resume to the company.'
                  : 'Applications open once your resume is verified by the Mzobs team.'}
            </p>
          </div>
          {!paid && (
            <Button variant="gold" size="sm" className="flex-shrink-0" onClick={() => navigate('/app/subscription')}>
              Pay ₹299 & activate
            </Button>
          )}
        </Card>
      </StaggerItem>

      {categoryTitle ? (
        <StaggerItem className="flex items-center justify-between flex-wrap gap-3 mb-4">
          <Badge tone="navy" dot={false}>
            Filtered by {categoryTitle}
          </Badge>
          <Button size="sm" onClick={() => navigate('/app/jobs')}>
            Clear filter · All openings
          </Button>
        </StaggerItem>
      ) : (
        <StaggerItem className="flex items-center justify-between flex-wrap gap-3 mb-4">
          <PillTabs items={['All openings', 'My track', 'Saved', 'Compare']} active={tab} onChange={setTab} />
          <div className="flex gap-2">
            <Button size="sm">
              <Sliders size={14} /> Filters
            </Button>
            <Select className="h-8 text-[12.5px]" defaultValue="Newest">
              <option>Newest</option>
            </Select>
          </div>
        </StaggerItem>
      )}

      <StaggerItem>
        {categoryTitle ? (
          categoryJobs.length ? (
            <div className="flex flex-col gap-4">
              {categoryJobs.map((j) => (
                <JobCard key={j.id} {...cardProps(j)} />
              ))}
            </div>
          ) : (
            <Card>
              <EmptyState
                icon={Briefcase}
                title="No openings available right now"
                body={`We don't have any live ${categoryTitle} requirements at the moment. Check back soon, or browse everything that's open.`}
                action={
                  <Button variant="primary" className="mt-2" onClick={() => navigate('/app/jobs')}>
                    Browse all openings
                  </Button>
                }
              />
            </Card>
          )
        ) : (
          <>
            {tab === 0 &&
              (jobs.length ? (
                <div className="flex flex-col gap-4">
                  {jobs.map((j) => (
                    <JobCard key={j.id} {...cardProps(j)} />
                  ))}
                </div>
              ) : (
                <Card>
                  <EmptyState icon={Briefcase} title="No live openings right now" body="Check back soon — new requirements post here as employers pay for sourcing." />
                </Card>
              ))}

            {tab === 1 &&
              (trackJobs.length ? (
                <div className="flex flex-col gap-4">
                  {trackJobs.map((j) => (
                    <JobCard key={j.id} {...cardProps(j)} />
                  ))}
                </div>
              ) : (
                <Card>
                  <EmptyState
                    icon={Sparkles}
                    title={track?.key ? `No live ${track.label || track.key} requirements right now` : 'No track assigned yet'}
                    body={track?.key ? "We'll notify you the moment a company posts one matching your track." : 'Complete your mock interview to get a skill track assigned.'}
                    action={
                      <Button variant="primary" className="mt-2" onClick={() => setTab(0)}>
                        Browse all openings
                      </Button>
                    }
                  />
                </Card>
              ))}

            {tab === 2 &&
              (savedJobs.length ? (
                <div className="flex flex-col gap-4">
                  {savedJobs.map((j) => (
                    <JobCard key={j.id} {...cardProps(j)} />
                  ))}
                </div>
              ) : (
                <Card>
                  <EmptyState
                    icon={Bookmark}
                    title="No saved openings yet"
                    body="Tap the bookmark icon on any opening to save it for later."
                    action={
                      <Button variant="primary" className="mt-2" onClick={() => setTab(0)}>
                        Browse all openings
                      </Button>
                    }
                  />
                </Card>
              ))}

            {tab === 3 && (
              <Card>
                <EmptyState
                  icon={BarChart3}
                  title="Select openings to compare"
                  body="Choose up to 3 roles to compare salary, location and requirements side by side."
                  action={
                    <Button variant="primary" className="mt-2" onClick={() => setTab(0)}>
                      Go to all openings
                    </Button>
                  }
                />
              </Card>
            )}
          </>
        )}
      </StaggerItem>
    </StaggerGroup>
  )
}
