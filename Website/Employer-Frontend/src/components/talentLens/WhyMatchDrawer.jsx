import { Check } from 'lucide-react'
import Drawer from '../ui/Drawer'
import ProgressBar from '../ui/ProgressBar'
import Avatar from '../ui/Avatar'
import { MatchScoreRing, MatchLevelBadge, TrustSignalPill, TrustSignalList } from './shared'
import { computeTrustSignal } from '../../lib/talentLens/trustSignal'

const DIMENSIONS = [
  ['skillMatch', 'Skills Match'],
  ['experienceMatch', 'Experience Match'],
  ['locationMatch', 'Location Match'],
  ['availabilityMatch', 'Availability Match'],
  ['industryMatch', 'Industry Match'],
]

// Match Intelligence — the whole point of this drawer is to make the score
// on the card explainable: a per-dimension breakdown, the concrete strengths
// and gaps that produced it, and one short plain-language summary. Never
// just the percentage on its own.
export default function WhyMatchDrawer({ open, onClose, candidate, match }) {
  if (!candidate || !match) return null
  const trust = computeTrustSignal(candidate)

  return (
    <Drawer open={open} onClose={onClose} title="Match Intelligence" subtitle={`Why Mzobs matched ${candidate.name} to your requirement`} size="md">
      <div className="flex items-center gap-3.5 pb-5 border-b border-border">
        <Avatar initials={candidate.initials} size="md" />
        <div className="min-w-0 flex-1">
          <div className="text-[14.5px] font-semibold truncate">{candidate.name}</div>
          <div className="text-[12.5px] text-ink-secondary truncate">
            {candidate.designation} · {candidate.currentCompany}
          </div>
        </div>
        <MatchScoreRing value={match.overallMatch} size={52} />
      </div>

      <div className="flex items-center gap-4 py-4 border-b border-border">
        <MatchLevelBadge value={match.overallMatch} />
        <TrustSignalPill score={trust.score} />
      </div>

      <div className="py-5 border-b border-border">
        <h4 className="text-[12px] font-semibold uppercase tracking-wide text-ink-tertiary mb-3">Match breakdown</h4>
        <div className="flex flex-col gap-3">
          {DIMENSIONS.map(([key, label]) => (
            <div key={key}>
              <div className="flex items-center justify-between text-[13px] mb-1.5">
                <span className="font-medium">{label}</span>
                <span className="font-semibold tabular-nums">{match[key]}%</span>
              </div>
              <ProgressBar value={match[key]} tone={match[key] >= 85 ? 'green' : 'navy'} />
            </div>
          ))}
        </div>
      </div>

      {match.strengths.length > 0 && (
        <div className="py-5 border-b border-border">
          <h4 className="text-[12px] font-semibold uppercase tracking-wide text-ink-tertiary mb-3">Strong matches</h4>
          <ul className="flex flex-col gap-2">
            {match.strengths.map((s) => (
              <li key={s} className="flex items-center gap-2 text-[13px] text-ink">
                <Check size={14} className="text-green flex-shrink-0" /> {s}
              </li>
            ))}
          </ul>
        </div>
      )}

      {match.gaps.length > 0 && (
        <div className="py-5 border-b border-border">
          <h4 className="text-[12px] font-semibold uppercase tracking-wide text-ink-tertiary mb-3">Potential gaps</h4>
          <ul className="flex flex-col gap-2">
            {match.gaps.map((g) => (
              <li key={g} className="flex items-start gap-2 text-[13px] text-ink-secondary">
                <span className="w-1.5 h-1.5 rounded-full bg-amber mt-1.5 flex-shrink-0" /> {g}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="py-5 border-b border-border">
        <h4 className="text-[12px] font-semibold uppercase tracking-wide text-ink-tertiary mb-3">Why Mzobs recommended this profile</h4>
        <p className="text-[13.5px] text-ink leading-relaxed bg-navy-tint/40 rounded-xl p-4">{match.explanation}</p>
      </div>

      <div className="pt-5">
        <h4 className="text-[12px] font-semibold uppercase tracking-wide text-ink-tertiary mb-3">Trust Signal — {trust.score}/100</h4>
        <TrustSignalList items={trust.items} />
      </div>
    </Drawer>
  )
}
