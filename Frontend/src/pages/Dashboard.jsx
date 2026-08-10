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
import { APPLICATIONS, INTERVIEW_SCHEDULED, JOBS, PROGRAM_FEE, RESUME, SKILL_TRACK, SUBSCRIPTION, USER } from '../lib/data'
import { categoryOf } from '../lib/category'

export default function Dashboard() {
  const navigate = useNavigate()
  const trackJobs = JOBS.filter((j) => j.category === SKILL_TRACK.key)

  return (
    <StaggerGroup>
      <StaggerItem className="flex items-start justify-between gap-5 flex-wrap mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Good afternoon, {USER.name.split(' ')[0]}</h1>
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
            <Ring value={USER.profileCompletion} size={52} thick={6} />
            <div className="text-[13px] text-ink-secondary">Add certificates to reach 100%</div>
          </div>
        </Card>
        <Card hover pad>
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold tracking-wide uppercase text-ink-tertiary">Career Score</span>
            <TrendingUp size={15} className="text-gold-strong" />
          </div>
          <div className="text-[30px] font-bold tracking-tight mt-2 text-navy">
            <CountUp value={USER.careerScore} /> <span className="text-[19px] font-semibold text-ink-tertiary">/100</span>
          </div>
          <Bar value={USER.careerScore} tone="gold" thin className="mt-2" />
        </Card>
        <Card hover pad>
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold tracking-wide uppercase text-ink-tertiary">Resume Status</span>
            <FileText size={15} className="text-navy" />
          </div>
          <div className="mt-3">
            <Badge tone="green">Verified by Mzobs</Badge>
          </div>
          <div className="text-xs text-ink-tertiary mt-2">Score {RESUME.score}/100 · v{RESUME.version}</div>
        </Card>
        <Card hover pad>
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold tracking-wide uppercase text-ink-tertiary">Subscription</span>
            <CreditCard size={15} className="text-navy" />
          </div>
          <div className="mt-3">
            <Badge tone="navy">{SUBSCRIPTION.name}</Badge>
          </div>
          <div className="text-xs text-ink-tertiary mt-2">
            Paid {SUBSCRIPTION.purchasedOn} · ₹{PROGRAM_FEE} one-time
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
            {APPLICATIONS.map((a) => (
              <div key={a.id} className="flex items-center gap-3 p-3 border border-border rounded-xl">
                <CompanyLogo initials={a.logo} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[14px] font-semibold truncate">{a.role}</span>
                    {a.outcome === 'rejected' ? (
                      <Badge tone="red">Not selected</Badge>
                    ) : a.stage >= 4 ? (
                      <Badge tone="gold">Interview scheduled</Badge>
                    ) : (
                      <Badge tone="navy">With Mzobs</Badge>
                    )}
                  </div>
                  <div className="text-xs text-ink-tertiary mt-1">
                    {a.co} · Applied {a.date}
                  </div>
                </div>
              </div>
            ))}
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
            <div className="flex items-center gap-3">
              <CompanyLogo initials={INTERVIEW_SCHEDULED.logo} />
              <div className="min-w-0">
                <div className="text-[14px] font-semibold truncate">{INTERVIEW_SCHEDULED.co}</div>
                <div className="text-xs text-ink-tertiary">{INTERVIEW_SCHEDULED.role}</div>
              </div>
            </div>
            <div className="mt-3.5 flex flex-col gap-2 text-[13px]">
              <span className="flex items-center gap-1.5 text-ink-secondary">
                <Clock size={13} className="text-ink-tertiary" /> {INTERVIEW_SCHEDULED.when}
              </span>
              <span className="flex items-center gap-1.5 text-ink-secondary">
                <Video size={13} className="text-ink-tertiary" /> {INTERVIEW_SCHEDULED.mode}
              </span>
              <span className="flex items-center gap-1.5 text-ink-secondary">
                <Building2 size={13} className="text-ink-tertiary" /> {INTERVIEW_SCHEDULED.round}
              </span>
            </div>
            <Button variant="primary" size="sm" className="mt-4 w-full" onClick={() => navigate('/app/interview-center')}>
              Open Interview Center
            </Button>
            <p className="text-xs text-ink-tertiary mt-3">
              Scheduled because Mzobs shared your resume with {INTERVIEW_SCHEDULED.co} on {INTERVIEW_SCHEDULED.sharedOn}.
            </p>
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
            {(trackJobs.length ? trackJobs : JOBS).slice(0, 3).map((j) => {
              const cat = categoryOf(j.category)
              return (
                <div key={j.id} className="flex items-center gap-3">
                  <CompanyLogo initials={j.logo} tone={cat.tone} />
                  <div className="flex-1 min-w-0">
                    <div className="text-[13.5px] font-semibold truncate">{j.role}</div>
                    <div className="text-xs text-ink-tertiary">
                      {j.co} · {j.loc} · {j.openings} opening{j.openings > 1 ? 's' : ''}
                    </div>
                  </div>
                  <Badge tone={cat.tone} dot={false}>
                    {j.match}% match
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
            <div className="relative pl-[26px]">
              <div className="absolute left-[5px] top-1 bottom-1 w-px bg-border" />
              {[
                ['Profile shared with <b>Solace Technologies</b> — interview scheduled', 'Today, 9:12 AM', 'gold'],
                ['Skill track assigned — <b>Analytics & Data</b>, Grade A', '31 Jul 2026', 'navy'],
                ['Mock interview completed — scored <b>81/100</b>', '30 Jul 2026', 'green'],
                ['Resume v3 verified by <b>Priya Kapoor</b>', '15 Jul 2026', 'green'],
              ].map(([text, time, tone], i, arr) => (
                <div key={text} className={i < arr.length - 1 ? 'pb-5 relative' : 'relative'}>
                  <div
                    className={`absolute -left-[26px] top-0.5 w-[11px] h-[11px] rounded-full bg-surface border-2 ${
                      tone === 'green' ? 'border-green-dot' : tone === 'gold' ? 'border-gold-dot' : tone === 'gray' ? 'border-border-strong' : 'border-navy'
                    }`}
                  />
                  <div className="text-[13px]" dangerouslySetInnerHTML={{ __html: text }} />
                  <div className="text-xs text-ink-tertiary mt-0.5">{time}</div>
                </div>
              ))}
            </div>
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
