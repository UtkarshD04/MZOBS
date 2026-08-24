import { useNavigate } from 'react-router-dom'
import {
  Upload,
  Video,
  Briefcase,
  TrendingUp,
  User,
  FileText,
  CreditCard,
  Clock,
  Zap,
  MessageSquare,
  Building2,
  EyeOff,
} from 'lucide-react'
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
import { useMockInterviewQuery } from '../hooks/useMockInterview'
import { useJobsQuery } from '../hooks/useJobs'
import { useInterviewsQuery } from '../hooks/useInterviews'

const APPLICATION_STAGE_INDEX = { new: 1, screening: 2, shortlisted: 3, shared: 4, interview: 5, selected: 6, rejected: 6 }

function profileCompletion(profile) {
  if (!profile) return 0
  const checks = [
    !!profile.resumeHeadline,
    (profile.skills ?? []).length > 0,
    (profile.education ?? []).length > 0,
    !!profile.currentCity,
    profile.resume?.status !== 'none',
    !!(profile.portfolioLink || profile.linkedin),
    !!profile.preferredRole,
    (profile.preferredLocations ?? []).length > 0,
  ]
  return Math.round((checks.filter(Boolean).length / checks.length) * 100)
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
  const { data: mockInterview } = useMockInterviewQuery()
  const { data: jobs = [] } = useJobsQuery()
  const { data: interviews = [] } = useInterviewsQuery()

  if (profileLoading || applicationsLoading) return <PageSkeleton />
  if (profileError) return <ErrorState onRetry={refetchProfile} />

  const track = profile?.skillTrack?.key
  const trackJobs = track ? jobs.filter((j) => j.track === track) : jobs
  const activity = recentActivity(profile, applications)
  const completion = profileCompletion(profile)

  return (
    <StaggerGroup>
      <StaggerItem className="flex items-start justify-between gap-5 flex-wrap mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Good afternoon, {profile?.name?.split(' ')[0] ?? ''}</h1>
          <p className="text-sm text-ink-secondary mt-1">Here's where you stand in the Mzobs placement programme today.</p>
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
        <Card hover pad>
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold tracking-wide uppercase text-ink-tertiary">Profile Completion</span>
            <User size={15} className="text-navy" />
          </div>
          <div className="flex items-center gap-3 mt-3">
            <Ring value={completion} size={52} thick={6} />
            <div className="text-[13px] text-ink-secondary">{completion < 100 ? 'Complete your profile for better matches' : 'Your profile is complete'}</div>
          </div>
        </Card>
        <Card hover pad>
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold tracking-wide uppercase text-ink-tertiary">Resume Score</span>
            <TrendingUp size={15} className="text-gold-strong" />
          </div>
          <div className="text-[30px] font-bold tracking-tight mt-2 text-navy">
            <CountUp value={profile?.resume?.score ?? 0} /> <span className="text-[19px] font-semibold text-ink-tertiary">/100</span>
          </div>
          <Bar value={profile?.resume?.score ?? 0} tone="gold" thin className="mt-2" />
        </Card>
        <Card hover pad>
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold tracking-wide uppercase text-ink-tertiary">Resume Status</span>
            <FileText size={15} className="text-navy" />
          </div>
          <div className="mt-3">
            <Badge tone={profile?.resume?.status === 'verified' ? 'green' : profile?.resume?.status === 'pending' ? 'gold' : 'navy'}>
              {profile?.resume?.status === 'verified' ? 'Verified by Mzobs' : profile?.resume?.status === 'pending' ? 'Under review' : 'Not uploaded'}
            </Badge>
          </div>
          <div className="text-xs text-ink-tertiary mt-2">
            {profile?.resume?.version ? `Score ${profile.resume.score ?? '—'}/100 · v${profile.resume.version}` : 'Upload your resume to get started'}
          </div>
        </Card>
        <Card hover pad>
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold tracking-wide uppercase text-ink-tertiary">Subscription</span>
            <CreditCard size={15} className="text-navy" />
          </div>
          <div className="mt-3">
            <Badge tone="navy">{profile?.subscription?.status === 'paid' ? 'Active' : 'Inactive'}</Badge>
          </div>
          <div className="text-xs text-ink-tertiary mt-2">
            {profile?.subscription?.paidOn ? `Paid ${new Date(profile.subscription.paidOn).toLocaleDateString('en-IN')} · ` : ''}₹{PROGRAM_FEE} one-time
          </div>
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
            <span className="text-[15px] font-semibold">Openings in your track</span>
            <span className="text-navy font-semibold text-[13px] cursor-pointer hover:underline" onClick={() => navigate('/app/jobs')}>
              See all
            </span>
          </CardHead>
          <div className="p-[22px] pt-3.5 flex flex-col gap-3">
            {trackJobs.length === 0 && <p className="text-[13px] text-ink-secondary">No openings match your track yet — check back soon.</p>}
            {trackJobs.slice(0, 3).map((j) => {
              const cat = categoryOf(j.track)
              return (
                <div key={j.id} className="flex items-center gap-3">
                  <CompanyLogo initials={j.logo} tone={cat.tone} />
                  <div className="flex-1 min-w-0">
                    <div className="text-[13.5px] font-semibold truncate">{j.title}</div>
                    <div className="text-xs text-ink-tertiary">
                      {j.company} · {j.location} · {j.vacancies} opening{j.vacancies > 1 ? 's' : ''}
                    </div>
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

      <StaggerItem>
        <Card pad>
          <div className="text-[15px] font-semibold mb-3">Quick actions</div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <Button onClick={() => navigate('/app/resume')}>
              <Upload size={15} /> Resume Center
            </Button>
            <Button onClick={() => navigate('/app/interview')}>
              <Video size={15} /> Mock Interview
            </Button>
            <Button onClick={() => navigate('/app/jobs')}>
              <Briefcase size={15} /> Job Openings
            </Button>
            <Button onClick={() => navigate('/app/messages')}>
              <MessageSquare size={15} /> Placement Desk
            </Button>
          </div>
          <div className="flex items-start gap-2.5 mt-4 pt-4 border-t border-border">
            <Zap size={14} className="text-gold-strong mt-0.5 flex-shrink-0" />
            <p className="text-[12.5px] text-ink-secondary">
              Mzobs provides placement support, not a job guarantee. Your ₹{PROGRAM_FEE} covers verification, coaching and getting your resume in front
              of hiring companies — selection is always the employer's call.
            </p>
          </div>
        </Card>
      </StaggerItem>
    </StaggerGroup>
  )
}
