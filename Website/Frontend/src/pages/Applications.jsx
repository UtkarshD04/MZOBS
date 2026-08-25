import { EyeOff } from 'lucide-react'
import Card from '../components/ui/Card'
import Badge from '../components/ui/Badge'
import Stepper from '../components/ui/Stepper'
import { CompanyLogo } from '../components/ui/Avatar'
import CountUp from '../components/ui/CountUp'
import { StaggerGroup, StaggerItem } from '../components/ui/Stagger'
import { PageSkeleton } from '../components/ui/Skeleton'
import ErrorState from '../components/ui/ErrorState'
import EmptyState from '../components/ui/EmptyState'
import { APPLICATION_STAGES } from '../lib/constants'
import { useApplicationsQuery } from '../hooks/useApplications'

const STAGE_INDEX = { new: 1, screening: 2, shortlisted: 3, shared: 4, interview: 5, selected: 6, rejected: 6 }

export default function Applications() {
  const { data: applications = [], isLoading, isError, refetch } = useApplicationsQuery()

  if (isLoading) return <PageSkeleton />
  if (isError) return <ErrorState onRetry={refetch} />

  const shared = applications.filter((a) => STAGE_INDEX[a.status] >= 4).length
  const interviews = applications.filter((a) => a.status === 'interview').length
  const withMzobs = applications.filter((a) => STAGE_INDEX[a.status] < 4).length

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
          ['Total Applications', applications.length, '', 'text-navy'],
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

      {applications.length === 0 ? (
        <Card>
          <EmptyState title="No applications yet" body="Browse job openings and apply — your applications will show up here with live status." />
        </Card>
      ) : (
        <div className="flex flex-col gap-4">
          {applications.map((a) => {
            const stage = STAGE_INDEX[a.status] ?? 1
            return (
              <StaggerItem key={a.id}>
                <Card pad>
                  <div className="flex justify-between flex-wrap gap-3">
                    <div className="flex items-center gap-3">
                      <CompanyLogo initials={a.job?.company?.logo ?? ''} />
                      <div>
                        <div className="text-[15px] font-semibold">{a.job?.title ?? 'Role'}</div>
                        <div className="text-[13px] text-ink-secondary mt-0.5">
                          {a.job?.company?.name ?? ''} · Applied {a.appliedOn ? new Date(a.appliedOn).toLocaleDateString('en-IN') : ''}
                        </div>
                      </div>
                    </div>
                    {a.status === 'selected' ? (
                      <Badge tone="green">Selected</Badge>
                    ) : a.status === 'rejected' ? (
                      <Badge tone="red">Not selected</Badge>
                    ) : stage >= 4 ? (
                      <Badge tone="gold">With employer</Badge>
                    ) : (
                      <Badge tone="navy">With Mzobs</Badge>
                    )}
                  </div>

                  <div className="mt-6">
                    <Stepper
                      steps={APPLICATION_STAGES.map((label, i) => ({
                        label,
                        state: a.status === 'rejected' && i === stage - 1 ? 'rejected' : i < stage - 1 ? 'done' : i === stage - 1 ? 'current' : '',
                      }))}
                    />
                  </div>

                  {a.note && <p className="text-[12.5px] text-ink-secondary mt-5 pt-4 border-t border-border">{a.note}</p>}
                </Card>
              </StaggerItem>
            )
          })}
        </div>
      )}
    </StaggerGroup>
  )
}
