import { EyeOff, CalendarCheck, Clock, Video } from 'lucide-react'
import Card, { CardHead } from '../components/ui/Card'
import Badge from '../components/ui/Badge'
import Button from '../components/ui/Button'
import Stepper from '../components/ui/Stepper'
import { CompanyLogo } from '../components/ui/Avatar'
import CountUp from '../components/ui/CountUp'
import { StaggerGroup, StaggerItem } from '../components/ui/Stagger'
import { APPLICATIONS, APPLICATION_STAGES, INTERVIEW_SCHEDULED } from '../lib/data'
import { useApp } from '../context/AppContext'
import { openRescheduleModal } from '../lib/modals'

export default function Applications() {
  const app = useApp()

  const shared = APPLICATIONS.filter((a) => a.stage >= 4).length
  const interviews = APPLICATIONS.filter((a) => a.stage === 5 || a.stage === 4).length
  const withMzobs = APPLICATIONS.filter((a) => a.stage < 4).length

  return (
    <StaggerGroup>
      <StaggerItem className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Application Tracking</h1>
        <p className="text-sm text-ink-secondary mt-1">Follow every application from the moment it reaches Mzobs to the employer's decision.</p>
      </StaggerItem>

      <StaggerItem className="mb-5">
        <Card pad className="flex items-start gap-3 border-navy-ring bg-navy-tint">
          <EyeOff size={18} className="text-navy mt-0.5 flex-shrink-0" />
          <div>
            <div className="text-[13.5px] font-semibold">Your application goes to Mzobs first</div>
            <p className="text-[13px] text-ink-secondary mt-0.5">
              Companies don't see a wall of applications. Our team screens everyone who applies, shortlists against the requirement, and sends only the
              strongest resumes across. Your name reaches the employer at the "Profile shared" stage — and that's when an interview gets scheduled.
            </p>
          </div>
        </Card>
      </StaggerItem>

      <StaggerItem className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-5">
        {[
          ['Total Applications', APPLICATIONS.length, '', 'text-navy'],
          ['With Mzobs', withMzobs, '', 'text-gold-strong'],
          ['Shared with employers', shared, '', 'text-teal'],
          ['Interviews scheduled', interviews, '', 'text-green'],
        ].map(([label, val, suffix, cls]) => (
          <Card key={label} hover pad>
            <span className="text-xs font-semibold tracking-wide uppercase text-ink-tertiary">{label}</span>
            <div className={`text-[30px] font-bold tracking-tight mt-2 ${cls}`}>
              <CountUp value={val} suffix={suffix} />
            </div>
          </Card>
        ))}
      </StaggerItem>

      {INTERVIEW_SCHEDULED && (
        <StaggerItem className="mb-5">
          <Card>
            <CardHead>
              <span className="text-[15px] font-semibold">Interview scheduled</span>
              <Badge tone="gold">Profile shared {INTERVIEW_SCHEDULED.sharedOn}</Badge>
            </CardHead>
            <div className="p-[22px] flex items-center gap-4 flex-wrap">
              <CompanyLogo initials={INTERVIEW_SCHEDULED.logo} />
              <div className="flex-1 min-w-[220px]">
                <div className="text-[15px] font-semibold">
                  {INTERVIEW_SCHEDULED.co} — {INTERVIEW_SCHEDULED.role}
                </div>
                <div className="text-[13px] text-ink-secondary mt-0.5">{INTERVIEW_SCHEDULED.round}</div>
                <div className="text-xs text-ink-tertiary mt-1.5 flex items-center gap-3 flex-wrap">
                  <span className="flex items-center gap-1">
                    <Clock size={12} /> {INTERVIEW_SCHEDULED.when} · {INTERVIEW_SCHEDULED.duration}
                  </span>
                  <span className="flex items-center gap-1">
                    <Video size={12} /> {INTERVIEW_SCHEDULED.mode}
                  </span>
                </div>
              </div>
              <div className="flex gap-2">
                <Button size="sm" onClick={() => openRescheduleModal(app, INTERVIEW_SCHEDULED.co, 'Mzobs placement desk')}>
                  Reschedule
                </Button>
                <Button variant="primary" size="sm">
                  <CalendarCheck size={14} /> Join
                </Button>
              </div>
            </div>
          </Card>
        </StaggerItem>
      )}

      <div className="flex flex-col gap-4">
        {APPLICATIONS.map((a) => (
          <StaggerItem key={a.id}>
            <Card pad>
              <div className="flex justify-between flex-wrap gap-3">
                <div className="flex items-center gap-3">
                  <CompanyLogo initials={a.logo} />
                  <div>
                    <div className="text-[15px] font-semibold">{a.role}</div>
                    <div className="text-[13px] text-ink-secondary mt-0.5">
                      {a.co} · Applied {a.date} · {a.id}
                    </div>
                  </div>
                </div>
                {a.outcome === 'selected' ? (
                  <Badge tone="green">Selected</Badge>
                ) : a.outcome === 'rejected' ? (
                  <Badge tone="red">Not selected</Badge>
                ) : a.stage >= 4 ? (
                  <Badge tone="gold">With employer</Badge>
                ) : (
                  <Badge tone="navy">With Mzobs</Badge>
                )}
              </div>

              <div className="mt-6">
                <Stepper
                  steps={APPLICATION_STAGES.map((label, i) => ({
                    label,
                    state: a.outcome === 'rejected' && i === a.stage - 1 ? 'rejected' : i < a.stage ? 'done' : i === a.stage ? 'current' : '',
                  }))}
                />
              </div>

              {a.note && <p className="text-[12.5px] text-ink-secondary mt-5 pt-4 border-t border-border">{a.note}</p>}
            </Card>
          </StaggerItem>
        ))}
      </div>
    </StaggerGroup>
  )
}
