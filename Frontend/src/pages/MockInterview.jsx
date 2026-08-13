import { Video, Clock, Zap, Check, Layers, ShieldCheck } from 'lucide-react'
import Card, { CardHead } from '../components/ui/Card'
import Badge from '../components/ui/Badge'
import Bar from '../components/ui/Bar'
import Ring from '../components/ui/Ring'
import Button from '../components/ui/Button'
import { StaggerGroup, StaggerItem } from '../components/ui/Stagger'
import { PageSkeleton } from '../components/ui/Skeleton'
import ErrorState from '../components/ui/ErrorState'
import { useApp } from '../context/AppContext'
import { openRescheduleModal } from '../lib/modals'
import { useProfileQuery } from '../hooks/useProfile'
import { useMockInterviewQuery } from '../hooks/useMockInterview'

export default function MockInterview() {
  const app = useApp()
  const { data: profile, isLoading: profileLoading, isError: profileError, refetch: refetchProfile } = useProfileQuery()
  const { data: mock, isLoading: mockLoading, isError: mockError, refetch: refetchMock } = useMockInterviewQuery()

  if (profileLoading || mockLoading) return <PageSkeleton />
  if (profileError || mockError) return <ErrorState onRetry={() => (profileError ? refetchProfile() : refetchMock())} />

  const done = mock?.status === 'completed'
  const scheduled = mock?.status === 'scheduled'
  const skillTrack = profile?.skillTrack

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
            <Badge tone={profile?.resume?.status === 'verified' ? 'green' : 'gold'} className="flex-shrink-0">
              Resume {profile?.resume?.status === 'verified' ? 'verified' : 'pending'}
            </Badge>
          </div>
        </Card>
      </StaggerItem>

      {done && skillTrack?.key ? (
        <StaggerItem className="mb-4">
          <Card pad className="flex items-start gap-3.5 flex-wrap">
            <div className="w-[52px] h-[52px] rounded-2xl bg-gold-tint text-gold-strong flex items-center justify-center flex-shrink-0">
              <Layers size={22} />
            </div>
            <div className="flex-1 min-w-[240px]">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[15px] font-semibold">Your skill track: {skillTrack.label || skillTrack.key}</span>
                <Badge tone="gold" dot={false}>
                  Grade {skillTrack.grade || '-'}
                </Badge>
              </div>
              <p className="text-[13px] text-ink-secondary mt-1">
                Assigned {skillTrack.assignedOn ? new Date(skillTrack.assignedOn).toLocaleDateString('en-IN') : ''}
                {skillTrack.assignedBy ? ` by ${skillTrack.assignedBy}` : ''}, based on your panel score of {mock?.scores?.overall ?? '—'}/100.{' '}
                {skillTrack.note}
              </p>
            </div>
          </Card>
        </StaggerItem>
      ) : scheduled ? (
        <StaggerItem className="mb-4">
          <Card pad>
            <div className="flex items-center justify-between flex-wrap gap-3.5">
              <div className="flex items-center gap-3.5">
                <div className="w-[52px] h-[52px] rounded-2xl bg-surface-sunken flex items-center justify-center flex-shrink-0">
                  <Video size={22} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[15px] font-semibold">Verification round with {mock.panel}</span>
                    <Badge tone="gold">Scheduled by Mzobs</Badge>
                  </div>
                  <div className="text-[13px] text-ink-secondary mt-1 flex items-center gap-1">
                    <Clock size={12} /> {mock.when ? new Date(mock.when).toLocaleString('en-IN') : ''} · {mock.mode}
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <Button onClick={() => openRescheduleModal(app, mock.panel, 'Mzobs coordinator')}>Request reschedule</Button>
                {mock.link && (
                  <Button variant="primary" onClick={() => window.open(mock.link, '_blank')}>
                    Join
                  </Button>
                )}
              </div>
            </div>
          </Card>
        </StaggerItem>
      ) : (
        <StaggerItem className="mb-4">
          <Card pad className="text-center py-8">
            <div className="text-[15px] font-semibold">Not scheduled yet</div>
            <p className="text-[13px] text-ink-secondary mt-1">Once your resume is verified, the Mzobs team will schedule your verification interview.</p>
          </Card>
        </StaggerItem>
      )}

      {done && (
        <>
          <StaggerItem className="grid lg:grid-cols-2 gap-5 mb-4">
            <Card pad className="text-center">
              <div className="text-xs font-semibold tracking-wide uppercase text-ink-tertiary mb-2">Panel Score</div>
              <Ring value={mock.scores?.overall ?? 0} size={88} hero />
              <div className="text-[13px] text-ink-secondary mt-2.5">
                {mock.completedOn ? new Date(mock.completedOn).toLocaleDateString('en-IN') : ''} · {mock.panel} {mock.panelRole ? `(${mock.panelRole})` : ''}
              </div>
            </Card>
            <Card>
              <CardHead>
                <span className="text-[15px] font-semibold">Score breakdown</span>
              </CardHead>
              <div className="p-[22px] flex flex-col gap-3.5">
                {[
                  ['Communication', mock.scores?.comm],
                  ['Domain knowledge', mock.scores?.domain],
                  ['Attitude & ownership', mock.scores?.attitude],
                  ['Overall', mock.scores?.overall],
                ].map(([label, v]) => (
                  <div key={label}>
                    <div className="flex justify-between text-[13px] mb-1.5">
                      <span>{label}</span>
                      <span className="text-ink-secondary">{v ?? '—'}/100</span>
                    </div>
                    <Bar value={v ?? 0} thin />
                  </div>
                ))}
              </div>
            </Card>
          </StaggerItem>

          {mock.feedback?.length > 0 && (
            <StaggerItem className="mb-4">
              <Card>
                <CardHead>
                  <span className="text-[15px] font-semibold">Panel feedback</span>
                </CardHead>
                <div className="p-[22px] flex flex-col gap-3">
                  {mock.feedback.map((f, i) => (
                    <div key={i} className="flex gap-2.5 items-start">
                      {f.tone === 'good' ? (
                        <Check size={15} className="text-green mt-0.5 flex-shrink-0" />
                      ) : (
                        <Zap size={15} className="text-gold-strong mt-0.5 flex-shrink-0" />
                      )}
                      <span className="text-[13px]">{f.text}</span>
                    </div>
                  ))}
                </div>
              </Card>
            </StaggerItem>
          )}
        </>
      )}
    </StaggerGroup>
  )
}
