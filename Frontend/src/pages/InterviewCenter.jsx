import { ChevronLeft, ChevronRight, Send } from 'lucide-react'
import Card, { CardHead } from '../components/ui/Card'
import Badge from '../components/ui/Badge'
import Button from '../components/ui/Button'
import { CompanyLogo } from '../components/ui/Avatar'
import { TableWrap, Table, Tr, Td } from '../components/ui/Table'
import { StaggerGroup, StaggerItem } from '../components/ui/Stagger'
import { PageSkeleton } from '../components/ui/Skeleton'
import ErrorState from '../components/ui/ErrorState'
import EmptyState from '../components/ui/EmptyState'
import { useApp } from '../context/AppContext'
import { openRescheduleModal } from '../lib/modals'
import { useInterviewsQuery } from '../hooks/useInterviews'

const TODAY = new Date()
const LEAD_BLANKS = new Date(TODAY.getFullYear(), TODAY.getMonth(), 1).getDay()
const DAYS_IN_MONTH = new Date(TODAY.getFullYear(), TODAY.getMonth() + 1, 0).getDate()

const STATUS_TONE = { Confirmed: 'gold', 'Awaiting confirmation': 'gold', Completed: 'green', Cancelled: 'red', Rescheduled: 'navy' }

export default function InterviewCenter() {
  const app = useApp()
  const { data: interviews = [], isLoading, isError, refetch } = useInterviewsQuery()

  if (isLoading) return <PageSkeleton />
  if (isError) return <ErrorState onRetry={refetch} />

  const eventDays = new Set(
    interviews
      .filter((i) => i.when && new Date(i.when).getMonth() === TODAY.getMonth() && new Date(i.when).getFullYear() === TODAY.getFullYear())
      .map((i) => new Date(i.when).getDate())
  )

  const upcoming = interviews
    .filter((i) => ['Confirmed', 'Awaiting confirmation'].includes(i.status))
    .sort((a, b) => new Date(a.when) - new Date(b.when))[0]

  return (
    <StaggerGroup>
      <StaggerItem className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Interview Center</h1>
        <p className="text-sm text-ink-secondary mt-1">
          Interviews appear here once Mzobs shares your profile with an employer. You never have to chase a company yourself.
        </p>
      </StaggerItem>

      <StaggerItem className="grid lg:grid-cols-[1fr_1.3fr] gap-5">
        <Card pad>
          <div className="flex items-center justify-between mb-3.5">
            <span className="text-[15px] font-semibold">{TODAY.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}</span>
            <div className="flex gap-1">
              <button className="w-8 h-8 rounded-lg flex items-center justify-center text-ink-secondary hover:bg-surface-hover">
                <ChevronLeft size={15} />
              </button>
              <button className="w-8 h-8 rounded-lg flex items-center justify-center text-ink-secondary hover:bg-surface-hover">
                <ChevronRight size={15} />
              </button>
            </div>
          </div>
          <div className="grid grid-cols-7 gap-1.5">
            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
              <div key={i} className="text-[10.5px] font-bold text-center text-ink-tertiary pb-1.5 uppercase">
                {d}
              </div>
            ))}
            {Array.from({ length: LEAD_BLANKS }, (_, i) => (
              <div key={'b' + i} className="aspect-square rounded-lg" />
            ))}
            {Array.from({ length: DAYS_IN_MONTH }, (_, i) => {
              const d = i + 1
              const isToday = d === TODAY.getDate()
              const hasEvent = eventDays.has(d)
              return (
                <div
                  key={d}
                  className={`aspect-square rounded-lg flex flex-col items-center justify-center text-[12.5px] relative cursor-pointer hover:bg-surface-hover ${
                    isToday ? 'border border-navy font-bold text-navy' : 'text-ink-secondary'
                  }`}
                >
                  {d}
                  {hasEvent && <span className="w-[5px] h-[5px] rounded-full bg-gold-dot absolute bottom-1.5" />}
                </div>
              )
            })}
          </div>
          <div className="mt-4 pt-4 border-t border-border flex items-start gap-2.5">
            <Send size={14} className="text-navy mt-0.5 flex-shrink-0" />
            <p className="text-[12.5px] text-ink-secondary">
              Employer interviews are booked by the Mzobs placement desk after your resume is shared. Mock interview slots are booked by our panel.
            </p>
          </div>
        </Card>

        {upcoming ? (
          <Card>
            <CardHead>
              <span className="text-[15px] font-semibold">
                {upcoming.company} — {upcoming.round || 'Interview'}
              </span>
              <Badge tone={STATUS_TONE[upcoming.status] ?? 'navy'}>{upcoming.status}</Badge>
            </CardHead>
            <div className="p-[22px]">
              <div className="flex items-center gap-3 mb-4 p-3 bg-surface-sunken rounded-xl">
                <CompanyLogo initials={upcoming.logo} />
                <div className="min-w-0">
                  <div className="text-[13.5px] font-semibold truncate">{upcoming.role}</div>
                  <div className="text-xs text-ink-tertiary mt-0.5">
                    Profile shared by Mzobs {upcoming.sharedOn ? `on ${new Date(upcoming.sharedOn).toLocaleDateString('en-IN')}` : ''}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                {[
                  ['Date & Time', upcoming.when ? new Date(upcoming.when).toLocaleString('en-IN') : '—'],
                  ['Mode', upcoming.mode ?? (upcoming.location ? 'On-site' : '—')],
                  ['Round', upcoming.round || '—'],
                  ['Duration', upcoming.duration ? `${upcoming.duration} min` : '—'],
                ].map(([label, val]) => (
                  <div key={label}>
                    <div className="text-xs text-ink-tertiary">{label}</div>
                    <div className="text-[13px] font-semibold mt-1">{val}</div>
                  </div>
                ))}
              </div>

              {upcoming.link ? (
                <div className="flex gap-2.5">
                  <input readOnly value={upcoming.link} className="flex-1 h-10 px-3 rounded-[9px] border border-border-strong bg-surface text-[13.5px]" />
                  <Button onClick={() => navigator.clipboard?.writeText(upcoming.link)}>Copy link</Button>
                </div>
              ) : upcoming.location ? (
                <div className="text-[13px] text-ink-secondary">{upcoming.location}</div>
              ) : null}
              <div className="flex gap-2.5 mt-4">
                <Button onClick={() => openRescheduleModal(app, upcoming.company, 'Mzobs placement desk')}>Reschedule</Button>
                {upcoming.link && (
                  <Button variant="primary" className="flex-1" onClick={() => window.open(upcoming.link, '_blank')}>
                    Join meeting
                  </Button>
                )}
              </div>
            </div>
          </Card>
        ) : (
          <Card>
            <EmptyState title="No interview scheduled yet" body="Once an employer wants to meet you, Mzobs schedules it and it shows up here." />
          </Card>
        )}
      </StaggerItem>

      <StaggerItem className="mt-5">
        <Card>
          <CardHead>
            <span className="text-[15px] font-semibold">Interview history</span>
          </CardHead>
          {interviews.length === 0 ? (
            <div className="p-[22px]">
              <EmptyState title="No interviews yet" body="Interviews scheduled by employers through Mzobs will appear here." />
            </div>
          ) : (
            <TableWrap className="border-none rounded-none">
              <Table columns={['Company', 'Round', 'Date', 'Mode', 'Status']}>
                {interviews.map((i) => (
                  <Tr key={i.id}>
                    <Td>
                      <div className="flex items-center gap-2">
                        <CompanyLogo initials={i.logo} size="sm" />
                        {i.company}
                      </div>
                    </Td>
                    <Td>{i.round || '—'}</Td>
                    <Td>{i.when ? new Date(i.when).toLocaleDateString('en-IN') : '—'}</Td>
                    <Td>{i.mode ?? (i.location ? 'On-site' : '—')}</Td>
                    <Td>
                      <Badge tone={STATUS_TONE[i.status] ?? 'navy'}>{i.status}</Badge>
                    </Td>
                  </Tr>
                ))}
              </Table>
            </TableWrap>
          )}
        </Card>
      </StaggerItem>
    </StaggerGroup>
  )
}
