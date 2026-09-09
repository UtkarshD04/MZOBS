import { useNavigate } from 'react-router-dom'
import { Upload, Video, Briefcase, Clock, Building2, EyeOff, Bookmark, History } from 'lucide-react'
import Card, { CardHead } from '../components/ui/Card'
import Badge from '../components/ui/Badge'
import Ring from '../components/ui/Ring'
import Bar from '../components/ui/Bar'
import Button from '../components/ui/Button'
import { CompanyLogo } from '../components/ui/Avatar'
import CountUp from '../components/ui/CountUp'
import { StaggerGroup, StaggerItem } from '../components/ui/Stagger'
import { PageSkeleton } from '../components/ui/Skeleton'
import ErrorState from '../components/ui/ErrorState'
import { PROGRAM_FEE } from '../lib/constants'
import { categoryOf } from '../lib/category'
import { useProfileQuery } from '../hooks/useProfile'
import { useApplicationsQuery } from '../hooks/useApplications'
import { useInterviewsQuery } from '../hooks/useInterviews'
import { useSavedJobsQuery } from '../hooks/useSavedJobs'
import { useRecentlyViewedQuery } from '../hooks/useRecentlyViewed'
import { useRecommendedJobsQuery } from '../hooks/useRecommendedJobs'

const APPLICATION_STAGE_INDEX = { new: 1, screening: 2, shortlisted: 3, shared: 4, interview: 5, selected: 6, rejected: 6 }

const COMPLETION_CHECKS = [
  { key: 'resumeHeadline', label: 'Add a resume headline', test: (p) => !!p.resumeHeadline },
  { key: 'skills', label: 'Add your skills', test: (p) => (p.skills ?? []).length > 0 },
  { key: 'education', label: 'Add your education', test: (p) => (p.education ?? []).length > 0 },
  { key: 'currentCity', label: 'Set your current city', test: (p) => !!p.currentCity },
  { key: 'resume', label: 'Upload your resume', test: (p) => p.resume?.status !== 'none' },
  { key: 'links', label: 'Add a portfolio or LinkedIn link', test: (p) => !!(p.portfolioLink || p.linkedin) },
  { key: 'preferredRole', label: 'Set a preferred role', test: (p) => !!p.preferredRole },
  { key: 'preferredLocations', label: 'Add preferred locations', test: (p) => (p.preferredLocations ?? []).length > 0 },
]

function profileCompletion(profile) {
  if (!profile) return { percent: 0, missing: [] }
  const missing = COMPLETION_CHECKS.filter((c) => !c.test(profile)).map((c) => c.label)
  const percent = Math.round(((COMPLETION_CHECKS.length - missing.length) / COMPLETION_CHECKS.length) * 100)
  return { percent, missing }
}

function recentActivity(profile, applications) {
  const items = []
  if (profile?.resume?.uploadedOn) items.push({ text: `Resume v${profile.resume.version} uploaded`, time: profile.resume.uploadedOn, tone: 'navy' })
  if (profile?.resume?.verifiedOn) items.push({ text: `Resume verified${profile.resume.reviewer ? ` by ${profile.resume.reviewer}` : ''}`, time: profile.resume.verifiedOn, tone: 'green' })
  if (profile?.skillTrack?.assignedOn) items.push({ text: `Skill track assigned — ${profile.skillTrack.label || profile.skillTrack.key}, Grade ${profile.skillTrack.grade || '-'}`, time: profile.skillTrack.assignedOn, tone: 'gold' })
  ;(applications ?? []).forEach((a) => items.push({ text: `Applied to ${a.job?.title ?? 'a role'}`, time: a.appliedOn, tone: 'navy' }))
  return items
    .filter((i) => i.time)
    .sort((a, b) => new Date(b.time) - new Date(a.time))
    .slice(0, 5)
}

export default function Dashboard() {
  const navigate = useNavigate()
  const { data: profile, isLoading: profileLoading, isError: profileError, refetch: refetchProfile } = useProfileQuery()
  const { data: applications = [], isLoading: applicationsLoading } = useApplicationsQuery()
  const { data: interviews = [] } = useInterviewsQuery()
  const { data: savedJobs = [] } = useSavedJobsQuery()
  const { data: recentlyViewed = [] } = useRecentlyViewedQuery()
  const { data: recommendedJobs = [] } = useRecommendedJobsQuery('match')

  if (profileLoading || applicationsLoading) return <PageSkeleton />
  if (profileError) return <ErrorState onRetry={refetchProfile} />

  const activity = recentActivity(profile, applications)
  const { percent: completion, missing: completionMissing } = profileCompletion(profile)
  const activeApplications = applications.filter((a) => !['selected', 'rejected', 'withdrawn'].includes(a.status)).length

  return (
    <StaggerGroup>
      <StaggerItem className="flex items-start justify-between gap-5 flex-wrap mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Good afternoon, {profile?.name?.split(' ')[0] ?? ''}</h1>
          <p className="text-sm text-ink-secondary mt-1">
            {activeApplications > 0 ? `${activeApplications} application${activeApplications === 1 ? '' : 's'} in progress` : 'No active applications yet'}
            {' · '}Profile {completion}% complete
          </p>
        </div>
        <div className="flex items-center gap-2.5 flex-shrink-0">
          <Button onClick={() => navigate('/app/resume')}>
            <Upload size={15} /> Update resume
          </Button>
          <Button variant="primary" onClick={() => navigate('/app/jobs')}>
            <Briefcase size={15} /> Browse openings
          </Button>
        </div>
      </StaggerItem>

      <StaggerItem className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-4">
        <Card hover pad className="cursor-pointer" onClick={() => navigate('/app/profile')}>
          <span className="text-xs font-semibold tracking-wide uppercase text-ink-tertiary">Profile Completion</span>
          <div className="flex items-center gap-3 mt-3">
            <Ring value={completion} size={52} thick={6} />
            <div className="text-[13px] text-ink-secondary">
              {completion < 100 ? `Missing: ${completionMissing.slice(0, 2).join(', ')}${completionMissing.length > 2 ? `, +${completionMissing.length - 2} more` : ''}` : 'Your profile is complete'}
            </div>
          </div>
        </Card>
        <Card pad>
          <span className="text-xs font-semibold tracking-wide uppercase text-ink-tertiary">Resume Score</span>
          <div className="text-[30px] font-bold tracking-tight mt-2 text-navy">
            <CountUp value={profile?.resume?.score ?? 0} /> <span className="text-[19px] font-semibold text-ink-tertiary">/100</span>
          </div>
          <Bar value={profile?.resume?.score ?? 0} tone="gold" thin className="mt-2" />
        </Card>
        <Card pad>
          <span className="text-xs font-semibold tracking-wide uppercase text-ink-tertiary">Resume Status</span>
          <div className="mt-3">
            <Badge tone={profile?.resume?.status === 'verified' ? 'green' : profile?.resume?.status === 'pending' ? 'gold' : 'navy'}>
              {profile?.resume?.status === 'verified' ? 'Verified by Mzobs' : profile?.resume?.status === 'pending' ? 'Under review' : 'Not uploaded'}
            </Badge>
          </div>
          <div className="text-xs text-ink-tertiary mt-2">
            {profile?.resume?.version ? `Score ${profile.resume.score ?? '—'}/100 · v${profile.resume.version}` : 'Upload your resume to get started'}
          </div>
        </Card>
        <Card hover pad className="cursor-pointer" onClick={() => navigate('/app/subscription')}>
          <span className="text-xs font-semibold tracking-wide uppercase text-ink-tertiary">Subscription</span>
          <div className="mt-3">
            <Badge tone={profile?.subscription?.status === 'paid' ? 'navy' : 'gold'}>{profile?.subscription?.status === 'paid' ? 'Active' : 'Inactive'}</Badge>
          </div>
          {profile?.subscription?.status === 'paid' ? (
            <div className="text-xs text-ink-tertiary mt-2">
              {profile?.subscription?.paidOn ? `Paid ${new Date(profile.subscription.paidOn).toLocaleDateString('en-IN')} · ` : ''}₹{PROGRAM_FEE} one-time
            </div>
          ) : (
            <div className="text-xs text-gold-strong font-semibold mt-2">Pay ₹{PROGRAM_FEE} to activate →</div>
          )}
        </Card>
      </StaggerItem>

      <StaggerItem className="grid lg:grid-cols-[1.4fr_1fr] gap-5 mb-4">
        <Card>
          <CardHead>
            <span className="text-[15px] font-semibold">Application status</span>
            <span className="text-navy font-semibold text-[13px] cursor-pointer hover:underline" onClick={() => navigate('/app/applications')}>
              Track all
            </span>
          </CardHead>
          <div className="p-[22px] pt-3.5 flex flex-col gap-3">
            {applications.length === 0 && <p className="text-[13px] text-ink-secondary">You haven't applied to any openings yet.</p>}
            {applications.slice(0, 3).map((a) => {
              const stage = APPLICATION_STAGE_INDEX[a.status] ?? 1
              return (
                <div key={a.id} className="flex items-center gap-3 p-3 border border-border rounded-xl">
                  <CompanyLogo initials={a.job?.company?.logo ?? ''} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[14px] font-semibold truncate">{a.job?.title ?? 'Role'}</span>
                      {a.status === 'rejected' ? (
                        <Badge tone="red">Not selected</Badge>
                      ) : a.status === 'selected' ? (
                        <Badge tone="green">Selected</Badge>
                      ) : a.status === 'withdrawn' ? (
                        <Badge tone="gray">Withdrawn</Badge>
                      ) : stage >= 4 ? (
                        <Badge tone="gold">Shared with employer</Badge>
                      ) : (
                        <Badge tone="navy">With Mzobs</Badge>
                      )}
                    </div>
                    <div className="text-xs text-ink-tertiary mt-1">Applied {a.appliedOn ? new Date(a.appliedOn).toLocaleDateString('en-IN') : ''}</div>
                  </div>
                </div>
              )
            })}
            <div className="flex items-start gap-2.5 mt-1 pt-3.5 border-t border-border">
              <EyeOff size={14} className="text-ink-tertiary mt-0.5 flex-shrink-0" />
              <p className="text-[12.5px] text-ink-secondary">
                Applications go to the Mzobs team first. A company sees your profile only once we shortlist and share it.
              </p>
            </div>
          </div>
        </Card>

        <Card>
          <CardHead>
            <span className="text-[15px] font-semibold">Interview scheduled</span>
            <span className="text-navy font-semibold text-[13px] cursor-pointer hover:underline" onClick={() => navigate('/app/interview-center')}>
              Details
            </span>
          </CardHead>
          <div className="p-[22px] pt-3.5">
            {(() => {
              const upcoming = interviews
                .filter((i) => ['Confirmed', 'Awaiting confirmation'].includes(i.status))
                .sort((a, b) => new Date(a.when) - new Date(b.when))[0]
              if (!upcoming) {
                return <p className="text-[13px] text-ink-secondary">No interview scheduled yet — this shows up once an employer wants to meet you.</p>
              }
              return (
                <>
                  <div className="flex items-center gap-3">
                    <CompanyLogo initials={upcoming.logo} />
                    <div className="min-w-0">
                      <div className="text-[14px] font-semibold truncate">{upcoming.company}</div>
                      <div className="text-xs text-ink-tertiary">{upcoming.role}</div>
                    </div>
                  </div>
                  <div className="mt-3.5 flex flex-col gap-2 text-[13px]">
                    <span className="flex items-center gap-1.5 text-ink-secondary">
                      <Clock size={13} className="text-ink-tertiary" /> {upcoming.when ? new Date(upcoming.when).toLocaleString('en-IN') : '—'}
                    </span>
                    <span className="flex items-center gap-1.5 text-ink-secondary">
                      <Video size={13} className="text-ink-tertiary" /> {upcoming.mode ?? (upcoming.location ? 'On-site' : '—')}
                    </span>
                    <span className="flex items-center gap-1.5 text-ink-secondary">
                      <Building2 size={13} className="text-ink-tertiary" /> {upcoming.round || '—'}
                    </span>
                  </div>
                </>
              )
            })()}
            <Button variant="primary" size="sm" className="mt-4 w-full" onClick={() => navigate('/app/interview-center')}>
              Open Interview Center
            </Button>
          </div>
        </Card>
      </StaggerItem>

      <StaggerItem className="grid lg:grid-cols-2 gap-5 mb-4">
        <Card>
          <CardHead>
            <span className="text-[15px] font-semibold">Recommended for you</span>
            <span className="text-navy font-semibold text-[13px] cursor-pointer hover:underline" onClick={() => navigate('/app/jobs?tab=recommended')}>
              See all
            </span>
          </CardHead>
          <div className="p-[22px] pt-3.5 flex flex-col gap-3">
            {recommendedJobs.length === 0 && (
              <p className="text-[13px] text-ink-secondary">Add skills, a preferred role and locations to your profile so we can match you to openings.</p>
            )}
            {recommendedJobs.slice(0, 3).map((j) => {
              const cat = categoryOf(j.track)
              return (
                <div key={j.id} className="flex items-center gap-3">
                  <CompanyLogo initials={j.logo} tone={cat.tone} />
                  <div className="flex-1 min-w-0">
                    <div className="text-[13.5px] font-semibold truncate">{j.title}</div>
                    <div className="text-xs text-ink-tertiary truncate">{j.matchReasons?.[0] ?? `${j.company} · ${j.location}`}</div>
                  </div>
                  <Badge tone={cat.tone} dot={false}>
                    {cat.label}
                  </Badge>
                </div>
              )
            })}
          </div>
        </Card>

        <Card>
          <CardHead>
            <span className="text-[15px] font-semibold">Recent activity</span>
          </CardHead>
          <div className="p-[22px] pt-4">
            {activity.length === 0 ? (
              <p className="text-[13px] text-ink-secondary">Nothing yet — activity shows up here as your profile moves forward.</p>
            ) : (
              <div className="relative pl-[26px]">
                <div className="absolute left-[5px] top-1 bottom-1 w-px bg-border" />
                {activity.map((item, i, arr) => (
                  <div key={i} className={i < arr.length - 1 ? 'pb-5 relative' : 'relative'}>
                    <div
                      className={`absolute -left-[26px] top-0.5 w-[11px] h-[11px] rounded-full bg-surface border-2 ${
                        item.tone === 'green' ? 'border-green-dot' : item.tone === 'gold' ? 'border-gold-dot' : 'border-navy'
                      }`}
                    />
                    <div className="text-[13px]">{item.text}</div>
                    <div className="text-xs text-ink-tertiary mt-0.5">{new Date(item.time).toLocaleDateString('en-IN')}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Card>
      </StaggerItem>

      <StaggerItem className="flex items-center gap-4 text-[13px] text-ink-secondary mb-2">
        <button className="flex items-center gap-1.5 hover:text-navy" onClick={() => navigate('/app/jobs?tab=saved')}>
          <Bookmark size={13} /> {savedJobs.length} saved job{savedJobs.length === 1 ? '' : 's'}
        </button>
        <span className="text-ink-tertiary">·</span>
        <span className="flex items-center gap-1.5">
          <History size={13} /> {recentlyViewed.length} recently viewed
        </span>
      </StaggerItem>

      <StaggerItem>
        <p className="text-xs text-ink-tertiary text-center py-2">
          Mzobs provides placement support, not a job guarantee. Your ₹{PROGRAM_FEE} covers verification, coaching and getting your resume in front of
          hiring companies — selection is always the employer's call.
        </p>
      </StaggerItem>
    </StaggerGroup>
  )
}
