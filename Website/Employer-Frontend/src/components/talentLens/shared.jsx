import { useEffect, useRef, useState } from 'react'
import { BadgeCheck, Briefcase, Check, X } from 'lucide-react'
import { cn } from '../../lib/utils'
import { matchLevel } from '../../lib/talentLens/matchEngine'

const RING_TONE = { green: '#22a55a', navy: '#246B5A', gray: '#9ca3af' }

// A small radial fill, not a plain number — smoothly animates to the score
// once mounted (fill only, no bounce) so "94% Match" always reads as
// something Mzobs computed, not a static label.
export function MatchScoreRing({ value, size = 56 }) {
  const [filled, setFilled] = useState(0)
  useEffect(() => {
    const id = requestAnimationFrame(() => setFilled(value))
    return () => cancelAnimationFrame(id)
  }, [value])
  const { tone } = matchLevel(value)
  const r = (size - 6) / 2
  const c = 2 * Math.PI * r
  return (
    <div className="relative flex-shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--color-surface-sunken)" strokeWidth="5" />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={RING_TONE[tone]}
          strokeWidth="5"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c - (c * filled) / 100}
          style={{ transition: 'stroke-dashoffset 700ms var(--ease-out-premium)' }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-[13px] font-bold leading-none tabular-nums">{value}%</span>
      </div>
    </div>
  )
}

export function MatchLevelBadge({ value }) {
  const { label, tone } = matchLevel(value)
  const dotTone = { green: 'bg-green-dot', navy: 'bg-navy', gray: 'bg-gray-dot' }[tone]
  const textTone = { green: 'text-green', navy: 'text-navy', gray: 'text-ink-secondary' }[tone]
  return (
    <span className={cn('inline-flex items-center gap-1.5 text-[11px] font-semibold', textTone)}>
      <span className={cn('w-1.5 h-1.5 rounded-full', dotTone)} />
      {label}
    </span>
  )
}

// Deliberately separate from match — a candidate can be a strong fit with a
// modest trust score (freshly-created profile) or vice versa; conflating the
// two would hide that distinction from the recruiter.
export function TrustSignalPill({ score }) {
  return (
    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-teal bg-teal-tint pl-1.5 pr-2 py-[3px] rounded-full">
      <BadgeCheck size={12} /> {score} Trust Signal
    </span>
  )
}

export function TrustSignalList({ items, compact }) {
  return (
    <ul className={cn('grid gap-x-4 gap-y-1.5', compact ? 'grid-cols-2' : 'grid-cols-1 sm:grid-cols-2')}>
      {items.map((it) => (
        <li key={it.key} className={cn('flex items-center gap-1.5 text-[12px]', it.ok ? 'text-ink-secondary' : 'text-ink-tertiary')}>
          {it.ok ? <Check size={13} className="text-teal flex-shrink-0" /> : <X size={13} className="text-ink-tertiary/60 flex-shrink-0" />}
          <span className={cn(!it.ok && 'line-through decoration-ink-tertiary/40')}>{it.label}</span>
        </li>
      ))}
    </ul>
  )
}

// Career timeline — most recent role first in the data, rendered oldest-to-
// newest top-to-bottom so it reads like a real career progression.
export function CareerTimeline({ workHistory }) {
  const ordered = [...workHistory].sort((a, b) => a.startYear - b.startYear)
  return (
    <div className="relative pl-2">
      <div className="absolute left-[15px] top-2 bottom-2 w-px bg-border" aria-hidden="true" />
      <div className="flex flex-col gap-5">
        {ordered.map((w, i) => (
          <div key={i} className="relative flex gap-3.5">
            <span className="relative z-10 w-8 h-8 rounded-full bg-navy-tint text-navy flex items-center justify-center flex-shrink-0 border-2 border-surface">
              <Briefcase size={14} />
            </span>
            <div className="pt-0.5">
              <div className="text-[11.5px] font-semibold text-ink-tertiary">{w.endYear ? `${w.startYear} – ${w.endYear}` : `${w.startYear} – Present`}</div>
              <div className="text-[13.5px] font-semibold mt-0.5">{w.role}</div>
              <div className="text-[12.5px] text-ink-secondary">{w.company}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// A little intent-to-click delay before firing, so "hover to preview" (used
// on the results grid's Why-match trigger) doesn't fire on a passing cursor.
export function useHoverIntent(delay = 150) {
  const [active, setActive] = useState(false)
  const timer = useRef(null)
  return {
    active,
    onMouseEnter: () => {
      clearTimeout(timer.current)
      timer.current = setTimeout(() => setActive(true), delay)
    },
    onMouseLeave: () => {
      clearTimeout(timer.current)
      setActive(false)
    },
  }
}
