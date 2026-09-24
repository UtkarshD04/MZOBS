import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { X } from 'lucide-react'
import { Modal, Avatar, StatusPill, MatchBadge } from './ui'
import { getTalentMany } from '../services/talentService'
import { computeMatch, computeTrust } from '../lib/talent/engine'
import { lpa, years, notice, ago } from '../lib/format'
import { useWorkspace } from '../store/workspace'

// Each row says how to read the value and which direction is "better", so the
// best cell in a row can be highlighted (ties all highlight).
const ROWS = [
  { label: 'AI match', get: (x) => x.match.overall, show: (v) => (v == null ? '—' : `${v}%`), best: 'max' },
  { label: 'Trust score', get: (x) => x.trust.score, show: (v) => `${v}/100`, best: 'max' },
  { label: 'Current role', get: (x) => x.c.designation, show: (v) => v },
  { label: 'Company', get: (x) => x.c.currentCompany, show: (v) => v || '—' },
  { label: 'Experience', get: (x) => x.c.experienceYears, show: years },
  { label: 'Expected salary', get: (x) => x.c.expectedSalaryLPA, show: lpa, best: 'min' },
  { label: 'Notice period', get: (x) => x.c.noticePeriodDays, show: notice, best: 'min' },
  { label: 'Location', get: (x) => x.c.location, show: (v) => v || '—' },
  { label: 'Education', get: (x) => x.c.education[0]?.degree, show: (v) => v || '—' },
  { label: 'Skills', get: (x) => x.c.skills, show: (v) => v.join(', '), skills: true },
  { label: 'Last active', get: (x) => x.c.lastActiveDaysAgo, show: ago, best: 'min' },
  { label: 'Identity', get: (x) => x.c.verification.identity, status: true },
  { label: 'Employment', get: (x) => x.c.verification.employment, status: true },
  { label: 'Education verified', get: (x) => x.c.verification.education, status: true },
]

export default function CompareModal({ open, onClose, criteria }) {
  const { compare, toggleCompare, clearCompare } = useWorkspace()
  const [list, setList] = useState([])
  useEffect(() => {
    if (open) getTalentMany(compare).then(setList)
  }, [open, compare])
  const items = useMemo(() => list.filter((c) => compare.includes(c.id)).map((c) => ({ c, match: computeMatch(c, criteria), trust: computeTrust(c) })), [list, compare, criteria])

  return (
    <Modal open={open} onClose={onClose} title="Compare candidates" subtitle="Best value in each row is highlighted" width={1000}>
      {items.length < 2 && <p className="mb-4 rounded-lg bg-warn-soft px-3 py-2 text-[13px] text-warn">Select at least 2 candidates to compare (up to 5).</p>}
      <div className="scroll-thin overflow-x-auto">
        <table className="w-full min-w-[640px] border-separate border-spacing-0 text-[13px]">
          <thead>
            <tr>
              <th className="sticky left-0 z-10 w-32 bg-white" />
              {items.map(({ c }) => (
                <th key={c.id} className="min-w-[170px] border-b border-line px-3 pb-3 text-left align-top">
                  <div className="flex items-start gap-2">
                    <Avatar candidate={c} size={36} />
                    <div className="min-w-0 flex-1">
                      <Link to={`/candidate/${c.id}`} onClick={onClose} className="block truncate font-semibold hover:text-accent">{c.name}</Link>
                      <span className="text-[12px] font-normal text-muted">{c.location}</span>
                    </div>
                    <button onClick={() => toggleCompare(c.id)} aria-label={`Remove ${c.name}`} className="text-muted hover:text-ink"><X size={14} /></button>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {ROWS.map((row) => {
              const vals = items.map((x) => row.get(x))
              const nums = vals.filter((v) => typeof v === 'number')
              const target = row.best && nums.length > 1 ? (row.best === 'max' ? Math.max(...nums) : Math.min(...nums)) : null
              const sets = row.skills ? items.map((x) => new Set(x.c.skills.map((s) => s.toLowerCase()))) : []
              const common = sets.length ? sets.reduce((a, b) => new Set([...a].filter((s) => b.has(s)))) : new Set()
              return (
                <tr key={row.label}>
                  <th className="sticky left-0 border-b border-line-2 bg-white py-2.5 pr-3 text-left text-[12px] font-medium text-muted">{row.label}</th>
                  {items.map((x, i) => {
                    const v = vals[i]
                    const isBest = target != null && v === target
                    return (
                      <td key={x.c.id} className={`border-b border-line-2 px-3 py-2.5 align-top ${isBest ? 'bg-ok-soft/60 font-semibold text-[#1a8f5a]' : ''}`}>
                        {row.status ? <StatusPill status={v} /> : row.skills ? (
                          <div className="flex flex-wrap gap-1">{v.map((s) => <span key={s} className={`rounded px-1.5 py-0.5 text-[11.5px] ${common.has(s.toLowerCase()) ? 'bg-line-2 text-ink-2' : 'bg-blue-soft font-medium text-[#1f6fb2]'}`}>{s}</span>)}</div>
                        ) : row.label === 'AI match' && v != null ? <MatchBadge score={v} /> : row.show(v)}
                      </td>
                    )
                  })}
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
      <p className="mt-3 text-[12px] text-muted">Skills in blue are unique to that candidate; grey skills are shared by everyone compared.</p>
      {items.length > 0 && <button onClick={() => { clearCompare(); onClose() }} className="mt-2 text-[12.5px] font-medium text-muted hover:text-ink">Clear comparison</button>}
    </Modal>
  )
}
