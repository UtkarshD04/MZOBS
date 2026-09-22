import { useNavigate } from 'react-router-dom'
import { Clock, GraduationCap, MapPin, Wallet } from 'lucide-react'
import Card from '../ui/Card'
import Avatar from '../ui/Avatar'
import { MatchScoreRing, MatchLevelBadge, TrustSignalPill } from './shared'
import { computeTrustSignal } from '../../lib/talentLens/trustSignal'
import { cn, fmtCompactINR } from '../../lib/utils'

function availabilityLabel(days) {
  if (days === 0) return 'Immediately available'
  if (days <= 15) return `Available in ${days} days`
  if (days <= 30) return `${days} days notice`
  return `${days} days notice`
}

export default function CandidateCard({ candidate, match, selected, onToggleSelect, onWhyMatch, inPool }) {
  const navigate = useNavigate()
  const trust = computeTrustSignal(candidate)
  const openProfile = () => navigate(`/talent-lens/candidates/${candidate.id}`, { state: match ? { match } : undefined })

  return (
    <Card hover pad className="flex flex-col">
      <div className="flex items-start gap-3.5">
        {onToggleSelect && (
          <input type="checkbox" checked={!!selected} onChange={() => onToggleSelect(candidate.id)} className="accent-navy w-[15px] h-[15px] mt-1" onClick={(e) => e.stopPropagation()} />
        )}
        <button onClick={openProfile} className="flex-shrink-0">
          <Avatar initials={candidate.initials} size="md" />
        </button>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <button onClick={openProfile} className="text-[14.5px] font-semibold hover:text-navy hover:underline truncate">
              {candidate.name}
            </button>
            {inPool && <span className="text-[11px] font-semibold text-navy bg-navy-tint px-2 py-[2px] rounded-full">Saved</span>}
          </div>
          <div className="text-[12.5px] text-ink-secondary mt-0.5 truncate">
            {candidate.designation} · {candidate.currentCompany}
          </div>
        </div>
        {match && <MatchScoreRing value={match.overallMatch} />}
      </div>

      <div className="flex items-center gap-3 flex-wrap mt-3">
        {match && <MatchLevelBadge value={match.overallMatch} />}
        <TrustSignalPill score={trust.score} />
      </div>

      <div className="grid grid-cols-2 gap-2.5 mt-3.5 text-[12px] text-ink-secondary">
        <span className="flex items-center gap-1.5 truncate">
          <MapPin size={13} className="text-ink-tertiary flex-shrink-0" /> {candidate.location}
        </span>
        <span className="flex items-center gap-1.5 truncate">
          <Wallet size={13} className="text-ink-tertiary flex-shrink-0" /> {fmtCompactINR(candidate.expectedSalaryLPA * 100000)}/yr expected
        </span>
        <span className="flex items-center gap-1.5 truncate">
          <GraduationCap size={13} className="text-ink-tertiary flex-shrink-0" /> {candidate.education[0]?.degree ?? '—'}
        </span>
        <span className={cn('flex items-center gap-1.5 truncate', candidate.noticePeriodDays <= 15 && 'text-green font-medium')}>
          <Clock size={13} className="text-ink-tertiary flex-shrink-0" /> {availabilityLabel(candidate.noticePeriodDays)}
        </span>
      </div>

      <div className="flex flex-wrap gap-1.5 mt-3.5">
        {candidate.skills.slice(0, 4).map((s) => (
          <span key={s} className={cn('text-[11px] font-medium px-2 py-[3px] rounded-full', match?.strengths.includes(s) ? 'bg-teal-tint text-teal' : 'bg-surface-sunken text-ink-secondary')}>
            {s}
          </span>
        ))}
        {candidate.skills.length > 4 && <span className="text-[11px] font-medium px-2 py-[3px] text-ink-tertiary">+{candidate.skills.length - 4} more</span>}
      </div>

      <div className="flex items-center gap-2 mt-4 pt-3.5 border-t border-border">
        <button onClick={openProfile} className="text-[12.5px] font-semibold text-navy hover:underline">
          View Profile
        </button>
        {match && onWhyMatch && (
          <button onClick={() => onWhyMatch(candidate, match)} className="ml-auto text-[12.5px] font-semibold text-ink-secondary hover:text-navy">
            Why this match?
          </button>
        )}
      </div>
    </Card>
  )
}
