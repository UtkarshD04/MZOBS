import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Briefcase, CalendarCheck, ClipboardCheck, FileCheck, Users } from 'lucide-react'
import Card from '../ui/Card'
import { useJobsQuery } from '../../hooks/useJobs'
import { useCandidatesQuery } from '../../hooks/useCandidates'
import { useInterviewsQuery } from '../../hooks/useInterviews'
import { useOffersQuery } from '../../hooks/useOffers'
import { rankCandidates } from '../../lib/talentLens/matchEngine'
import { TALENT_POOL } from '../../lib/talentLens/mockCandidates'

// Hiring Pulse — real counts from this company's own data (open requirements,
// applicants, interviews, offers all come straight from the existing hooks,
// same as Dashboard.jsx), plus ONE Talent Lens–specific insight: how many
// profiles in the wider talent pool would be a strong match for each open
// role right now. That last number is computed live against the mock pool
// (see mockCandidates.js) — clearly a preview until a real search endpoint
// exists — everything else here is genuine application data, not invented.
export default function HiringPulseStrip() {
  const navigate = useNavigate()
  const { data: jobs = [] } = useJobsQuery()
  const { data: candidates = [] } = useCandidatesQuery()
  const { data: interviews = [] } = useInterviewsQuery()
  const { data: offers = [] } = useOffersQuery()

  const openJobs = jobs.filter((j) => j.status !== 'closed' && j.status !== 'archived' && j.status !== 'draft')

  const strongMatchInsight = useMemo(() => {
    if (!openJobs.length) return null
    const scored = openJobs.map((job) => {
      const criteria = { skills: job.skills ?? [], experienceMin: job.experienceMin, experienceMax: job.experienceMax, location: job.location }
      const strong = rankCandidates(TALENT_POOL, criteria).filter((r) => r.match.overallMatch >= 85)
      return { job, strong: strong.length }
    })
    return scored.sort((a, b) => b.strong - a.strong)[0]
  }, [openJobs]) // eslint-disable-line react-hooks/exhaustive-deps

  const soonAvailable = TALENT_POOL.filter((c) => c.noticePeriodDays <= 30).length

  const TONE_CLASSES = {
    navy: 'bg-navy-tint text-navy',
    teal: 'bg-teal-tint text-teal',
    gold: 'bg-gold-tint text-gold-strong',
    amber: 'bg-amber-tint text-amber',
  }

  const stats = [
    { label: 'Open Requirements', value: openJobs.length, icon: Briefcase, tone: 'navy', to: '/jobs' },
    { label: 'Applicants', value: candidates.length, icon: Users, tone: 'teal', to: '/candidates' },
    { label: 'Interviews Scheduled', value: interviews.length, icon: CalendarCheck, tone: 'gold', to: '/interviews' },
    { label: 'Offers Sent', value: offers.length, icon: FileCheck, tone: 'amber', to: '/offers' },
  ]

  return (
    <div>
      <div className="grid grid-cols-4 gap-3.5 max-lg:grid-cols-2 max-sm:grid-cols-1">
        {stats.map((s) => (
          <button key={s.label} onClick={() => navigate(s.to)} className="text-left">
            <Card hover pad className="flex items-center gap-3">
              <span className={`w-10 h-10 rounded-[11px] flex items-center justify-center flex-shrink-0 ${TONE_CLASSES[s.tone]}`}>
                <s.icon size={17} />
              </span>
              <div>
                <div className="text-[19px] font-bold leading-none tabular-nums">{s.value}</div>
                <div className="text-[11.5px] text-ink-tertiary mt-1">{s.label}</div>
              </div>
            </Card>
          </button>
        ))}
      </div>

      {(strongMatchInsight || soonAvailable > 0) && (
        <div className="flex flex-col gap-2 mt-3.5">
          {strongMatchInsight && strongMatchInsight.strong > 0 && (
            <div className="flex items-center gap-2.5 text-[12.5px] text-ink-secondary bg-navy-tint/40 rounded-xl px-3.5 py-2.5">
              <ClipboardCheck size={15} className="text-navy flex-shrink-0" />
              Your <span className="font-semibold text-ink">{strongMatchInsight.job.title}</span> role has{' '}
              <span className="font-semibold text-ink">{strongMatchInsight.strong} strong match{strongMatchInsight.strong === 1 ? '' : 'es'}</span> in Talent Lens.
            </div>
          )}
          <div className="flex items-center gap-2.5 text-[12.5px] text-ink-secondary bg-teal-tint/40 rounded-xl px-3.5 py-2.5">
            <Users size={15} className="text-teal flex-shrink-0" />
            <span className="font-semibold text-ink">{soonAvailable} candidates</span> in the talent pool can join within 30 days.
          </div>
        </div>
      )}
    </div>
  )
}
