import { Video, Clock, Play, Zap, Check, Layers, ShieldCheck } from 'lucide-react'
import Card, { CardHead } from '../components/ui/Card'
import Badge from '../components/ui/Badge'
import Bar from '../components/ui/Bar'
import Ring from '../components/ui/Ring'
import Button from '../components/ui/Button'
import { TableWrap, Table, Tr, Td } from '../components/ui/Table'
import { StaggerGroup, StaggerItem } from '../components/ui/Stagger'
import { INTERVIEWS_PAST, MOCK_INTERVIEW, RESUME, SKILL_TRACK } from '../lib/data'
import { useApp } from '../context/AppContext'
import { openRescheduleModal } from '../lib/modals'

export default function MockInterview() {
  const app = useApp()
  const done = MOCK_INTERVIEW.status === 'completed'

  return (
    <StaggerGroup>
      <StaggerItem className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Mock Interview</h1>
        <p className="text-sm text-ink-secondary mt-1">
          The verification round the Mzobs panel runs after your resume clears. Your score decides your skill track.
        </p>
      </StaggerItem>

      <StaggerItem className="mb-5">
        <Card pad className="bg-navy-tint border-navy-ring">
          <div className="flex items-start gap-3.5 flex-wrap">
            <div className="w-[52px] h-[52px] rounded-2xl bg-surface flex items-center justify-center flex-shrink-0">
              <ShieldCheck size={22} className="text-navy" />
            </div>
            <div className="flex-1 min-w-[240px]">
              <div className="text-[15px] font-semibold">How this round works</div>
              <p className="text-[13px] text-ink-secondary mt-1">
                Once your resume is verified, our hiring team schedules you with a panel member. It's a real interview — communication, domain knowledge
                and attitude are each scored. After it, we place you in the skill track where you'll be matched against employer requirements.
              </p>
            </div>
            <Badge tone={RESUME.status === 'verified' ? 'green' : 'gold'} className="flex-shrink-0">
              Resume {RESUME.status === 'verified' ? 'verified' : 'pending'}
            </Badge>
          </div>
        </Card>
      </StaggerItem>

      {done ? (
        <StaggerItem className="mb-4">
          <Card pad className="flex items-start gap-3.5 flex-wrap">
            <div className="w-[52px] h-[52px] rounded-2xl bg-gold-tint text-gold-strong flex items-center justify-center flex-shrink-0">
              <Layers size={22} />
            </div>
            <div className="flex-1 min-w-[240px]">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[15px] font-semibold">Your skill track: {SKILL_TRACK.label}</span>
                <Badge tone={SKILL_TRACK.tone} dot={false}>
                  Grade {SKILL_TRACK.grade}
                </Badge>
              </div>
              <p className="text-[13px] text-ink-secondary mt-1">
                Assigned {SKILL_TRACK.assignedOn} by the {SKILL_TRACK.assignedBy}, based on your panel score of {MOCK_INTERVIEW.overall}/100.{' '}
                {SKILL_TRACK.note}
              </p>
            </div>
          </Card>
        </StaggerItem>
      ) : (
        <StaggerItem className="mb-4">
          <Card pad>
            <div className="flex items-center justify-between flex-wrap gap-3.5">
              <div className="flex items-center gap-3.5">
                <div className="w-[52px] h-[52px] rounded-2xl bg-surface-sunken flex items-center justify-center flex-shrink-0">
                  <Video size={22} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[15px] font-semibold">Verification round with {MOCK_INTERVIEW.panel}</span>
                    <Badge tone="gold">Scheduled by Mzobs</Badge>
                  </div>
                  <div className="text-[13px] text-ink-secondary mt-1 flex items-center gap-1">
                    <Clock size={12} /> 9 Aug 2026, 6:00 PM · Google Meet
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <Button onClick={() => openRescheduleModal(app, MOCK_INTERVIEW.panel, 'Mzobs coordinator')}>Request reschedule</Button>
                <Button variant="primary">Join</Button>
              </div>
            </div>
          </Card>
        </StaggerItem>
      )}

      <StaggerItem className="grid lg:grid-cols-2 gap-5 mb-4">
        <Card pad className="text-center">
          <div className="text-xs font-semibold tracking-wide uppercase text-ink-tertiary mb-2">Panel Score</div>
          <Ring value={MOCK_INTERVIEW.overall} size={88} hero />
          <div className="text-[13px] text-ink-secondary mt-2.5">
            {MOCK_INTERVIEW.completedOn} · {MOCK_INTERVIEW.panel} ({MOCK_INTERVIEW.panelRole})
          </div>
        </Card>
        <Card>
          <CardHead>
            <span className="text-[15px] font-semibold">Score breakdown</span>
            <span className="text-xs text-ink-tertiary">{MOCK_INTERVIEW.completedOn}</span>
          </CardHead>
          <div className="p-[22px] flex flex-col gap-3.5">
            {[
              ['Communication', MOCK_INTERVIEW.comm],
              ['Domain knowledge', MOCK_INTERVIEW.domain],
              ['Attitude & ownership', MOCK_INTERVIEW.attitude],
              ['Overall', MOCK_INTERVIEW.overall],
            ].map(([label, v]) => (
              <div key={label}>
                <div className="flex justify-between text-[13px] mb-1.5">
                  <span>{label}</span>
                  <span className="text-ink-secondary">{v}/100</span>
                </div>
                <Bar value={v} thin />
              </div>
            ))}
          </div>
        </Card>
      </StaggerItem>

      <StaggerItem className="grid lg:grid-cols-2 gap-5 mb-4">
        <Card>
          <CardHead>
            <span className="text-[15px] font-semibold">Recording</span>
          </CardHead>
          <div className="p-[22px]">
            <div className="aspect-video bg-navy-950 rounded-xl flex items-center justify-center relative">
              <button className="w-[52px] h-[52px] rounded-full bg-white/15 text-white flex items-center justify-center">
                <Play size={22} />
              </button>
              <span className="absolute bottom-2.5 right-3 text-xs text-white/70">{MOCK_INTERVIEW.duration}</span>
            </div>
          </div>
        </Card>
        <Card>
          <CardHead>
            <span className="text-[15px] font-semibold">Panel feedback</span>
          </CardHead>
          <div className="p-[22px] flex flex-col gap-3">
            {MOCK_INTERVIEW.feedback.map(([kind, text]) => (
              <div key={text} className="flex gap-2.5 items-start">
                {kind === 'good' ? (
                  <Check size={15} className="text-green mt-0.5 flex-shrink-0" />
                ) : (
                  <Zap size={15} className="text-gold-strong mt-0.5 flex-shrink-0" />
                )}
                <span className="text-[13px]">{text}</span>
              </div>
            ))}
          </div>
        </Card>
      </StaggerItem>

      <StaggerItem>
        <Card>
          <CardHead>
            <span className="text-[15px] font-semibold">Interview history</span>
          </CardHead>
          <TableWrap className="border-none rounded-none">
            <Table columns={['Date', 'Round', 'Panel', 'Communication', 'Domain', 'Overall']}>
              {INTERVIEWS_PAST.map((i) => (
                <Tr key={i.date}>
                  <Td>{i.date}</Td>
                  <Td>{i.type}</Td>
                  <Td>{i.interviewer}</Td>
                  <Td>{i.comm}/100</Td>
                  <Td>{i.tech}/100</Td>
                  <Td className="font-bold">{i.overall}/100</Td>
                </Tr>
              ))}
            </Table>
          </TableWrap>
        </Card>
      </StaggerItem>
    </StaggerGroup>
  )
}
