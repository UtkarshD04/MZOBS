import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Chip from '../ui/Chip'
import Avatar from '../ui/Avatar'
import EmptyState from '../ui/EmptyState'
import { Users } from 'lucide-react'
import { TALENT_POOL } from '../../lib/talentLens/mockCandidates'
import { computeMatch } from '../../lib/talentLens/matchEngine'
import { MatchLevelBadge } from './shared'

const REFINEMENTS = [
  { key: 'moreExperienced', label: 'More experienced' },
  { key: 'sooner', label: 'Available sooner' },
  { key: 'lowerSalary', label: 'Lower salary' },
  { key: 'sameSkills', label: 'Same skills' },
  { key: 'sameIndustry', label: 'Same industry' },
  { key: 'differentLocation', label: 'Different location' },
]

// Builds a SearchCriteria from the reference candidate's own profile — same
// skills/experience/industry/location/salary/availability the brief lists —
// then a refinement chip just nudges one field before re-ranking.
export default function SimilarTalentPanel({ candidate }) {
  const navigate = useNavigate()
  const [active, setActive] = useState([])

  function toggle(key) {
    setActive((prev) => (prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]))
  }

  const results = useMemo(() => {
    const criteria = {
      skills: active.includes('sameSkills') ? candidate.skills : candidate.skills.slice(0, 2),
      experienceMin: active.includes('moreExperienced') ? candidate.experienceYears + 1 : Math.max(0, candidate.experienceYears - 1.5),
      experienceMax: candidate.experienceYears + (active.includes('moreExperienced') ? 5 : 1.5),
      location: active.includes('differentLocation') ? undefined : candidate.location,
      availabilityDays: active.includes('sooner') ? Math.min(15, candidate.noticePeriodDays) : undefined,
      salaryMaxLPA: active.includes('lowerSalary') ? candidate.expectedSalaryLPA - 1 : undefined,
      industry: active.includes('sameIndustry') ? candidate.industry : undefined,
    }
    return TALENT_POOL.filter((c) => c.id !== candidate.id)
      .map((c) => ({ candidate: c, match: computeMatch(c, criteria) }))
      .sort((a, b) => b.match.overallMatch - a.match.overallMatch)
      .slice(0, 4)
  }, [candidate, active])

  return (
    <div>
      <div className="flex flex-wrap gap-1.5 mb-4">
        {REFINEMENTS.map((r) => (
          <Chip key={r.key} selected={active.includes(r.key)} onClick={() => toggle(r.key)}>
            {r.label}
          </Chip>
        ))}
      </div>

      {results.length === 0 ? (
        <EmptyState icon={Users} title="No similar profiles found" body="Try removing a refinement." />
      ) : (
        <div className="flex flex-col gap-2.5">
          {results.map(({ candidate: c, match }) => (
            <button key={c.id} onClick={() => navigate(`/talent-lens/candidates/${c.id}`)} className="flex items-center gap-3 rounded-xl border border-border p-3 hover:border-border-strong hover:bg-surface-hover text-left">
              <Avatar initials={c.initials} size="sm" />
              <div className="flex-1 min-w-0">
                <div className="text-[13px] font-semibold truncate">{c.name}</div>
                <div className="text-[11.5px] text-ink-tertiary truncate">
                  {c.designation} · {c.location}
                </div>
              </div>
              <MatchLevelBadge value={match.overallMatch} />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
