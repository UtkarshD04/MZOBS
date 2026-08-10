import { ChevronLeft, ChevronRight, Send } from 'lucide-react'
import Card, { CardHead } from '../components/ui/Card'
import Badge from '../components/ui/Badge'
import Button from '../components/ui/Button'
import { CompanyLogo } from '../components/ui/Avatar'
import { TableWrap, Table, Tr, Td } from '../components/ui/Table'
import { StaggerGroup, StaggerItem } from '../components/ui/Stagger'
import { useApp } from '../context/AppContext'
import { openRescheduleModal } from '../lib/modals'
import { INTERVIEW_SCHEDULED } from '../lib/data'

const EVENT_DAYS = [6, 9, 14]
const TODAY = 5
const LEAD_BLANKS = 5
const DAYS_IN_MONTH = 31

export default function InterviewCenter() {
  const app = useApp()

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
            <span className="text-[15px] font-semibold">August 2026</span>
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
              <div key={'b' + i} className="aspect-square rounded-lg flex items-center justify-center text-[12.5px] text-ink-tertiary opacity-40">
                {26 + i}
              </div>
            ))}
            {Array.from({ length: DAYS_IN_MONTH }, (_, i) => {
              const d = i + 1
              const isToday = d === TODAY
              const hasEvent = EVENT_DAYS.includes(d)
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

        <Card>
          <CardHead>
            <span className="text-[15px] font-semibold">
              {INTERVIEW_SCHEDULED.co} — {INTERVIEW_SCHEDULED.round}
            </span>
            <Badge tone="gold">Tomorrow</Badge>
          </CardHead>
          <div className="p-[22px]">
            <div className="flex items-center gap-3 mb-4 p-3 bg-surface-sunken rounded-xl">
              <CompanyLogo initials={INTERVIEW_SCHEDULED.logo} />
              <div className="min-w-0">
                <div className="text-[13.5px] font-semibold truncate">{INTERVIEW_SCHEDULED.role}</div>
                <div className="text-xs text-ink-tertiary mt-0.5">Profile shared by Mzobs on {INTERVIEW_SCHEDULED.sharedOn}</div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              {[
                ['Date & Time', INTERVIEW_SCHEDULED.when],
                ['Mode', INTERVIEW_SCHEDULED.mode],
                ['Round', INTERVIEW_SCHEDULED.round],
                ['Duration', INTERVIEW_SCHEDULED.duration],
              ].map(([label, val]) => (
                <div key={label}>
                  <div className="text-xs text-ink-tertiary">{label}</div>
                  <div className="text-[13px] font-semibold mt-1">{val}</div>
                </div>
              ))}
            </div>

            <div className="text-xs font-semibold tracking-wide uppercase text-ink-tertiary mb-2">Already sent on your behalf</div>
            <div className="flex flex-col gap-2 mb-4">
              <label className="flex items-center gap-2 text-[13px] text-ink-secondary">
                <input type="checkbox" checked disabled className="accent-navy w-[15px] h-[15px]" /> Verified resume (v3)
              </label>
              <label className="flex items-center gap-2 text-[13px] text-ink-secondary">
                <input type="checkbox" checked disabled className="accent-navy w-[15px] h-[15px]" /> Mock interview score & skill track
              </label>
              <label className="flex items-center gap-2 text-[13px] text-ink-secondary">
                <input type="checkbox" className="accent-navy w-[15px] h-[15px]" /> Portfolio / work samples (optional)
              </label>
            </div>

            <div className="flex gap-2.5">
              <input readOnly value={INTERVIEW_SCHEDULED.link} className="flex-1 h-10 px-3 rounded-[9px] border border-border-strong bg-surface text-[13.5px]" />
              <Button>Copy link</Button>
            </div>
            <div className="flex gap-2.5 mt-4">
              <Button onClick={() => openRescheduleModal(app, INTERVIEW_SCHEDULED.co, 'Mzobs placement desk')}>Reschedule</Button>
              <Button variant="primary" className="flex-1">
                Join meeting
              </Button>
            </div>
          </div>
        </Card>
      </StaggerItem>

      <StaggerItem className="mt-5">
        <Card>
          <CardHead>
            <span className="text-[15px] font-semibold">Interview history</span>
          </CardHead>
          <TableWrap className="border-none rounded-none">
            <Table columns={['Company / Panel', 'Round', 'Date', 'Mode', 'Status']}>
              {[
                ['MZ', 'Mzobs Panel', 'Verification round', '30 Jul 2026', 'Video', 'green', 'Cleared · 81/100'],
                ['ST', 'Solace Technologies', 'Round 1 — Hiring Manager', '6 Aug 2026', 'Video', 'gold', 'Scheduled'],
                ['NR', 'Nimbus Retail', 'Round 1 — Screening', '24 Jul 2026', 'Phone', 'red', 'Not selected'],
              ].map((r) => (
                <Tr key={r[1] + r[3]}>
                  <Td>
                    <div className="flex items-center gap-2">
                      <CompanyLogo initials={r[0]} size="sm" />
                      {r[1]}
                    </div>
                  </Td>
                  <Td>{r[2]}</Td>
                  <Td>{r[3]}</Td>
                  <Td>{r[4]}</Td>
                  <Td>
                    <Badge tone={r[5]}>{r[6]}</Badge>
                  </Td>
                </Tr>
              ))}
            </Table>
          </TableWrap>
        </Card>
      </StaggerItem>
    </StaggerGroup>
  )
}
