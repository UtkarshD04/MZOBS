import { useState } from 'react'
import { EMPLOYEE_APP_URL } from '../../../lib/config'

// Small presentational pieces shared between the "Latest jobs" list/inline
// detail panel (LatestJobs.jsx, desktop) and the standalone job description
// page (pages/JobDetail.jsx, mobile) — kept in one place so both render a
// job identically instead of two hand-maintained copies drifting apart.

// Kept to this page's own --explorer-* palette (not the shared Badge/CompanyLogo
// tone system, which is a separate, differently-shaded color set used
// elsewhere on the site) so every pill and avatar here stays visually
// consistent and restrained — blue for primary actions, teal used sparingly
// for selection/success signals only, everything else neutral.
export const LOGO_TONES = ['bg-(--explorer-blue-surface) text-(--explorer-blue)', 'bg-(--explorer-teal-surface) text-(--explorer-teal)']
export const WORK_MODE_STYLE = {
  Remote: 'bg-(--explorer-teal-surface) text-(--explorer-teal)',
  Hybrid: 'bg-(--explorer-bg) text-(--explorer-navy)',
  'On-site': 'bg-(--explorer-bg) text-(--explorer-muted)',
}
export const NEUTRAL_PILL = 'bg-(--explorer-bg) text-(--explorer-muted)'

export function initialsOf(name) {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase()
}

// A controlled set of muted, on-brand tones (never a rainbow) — which one a
// company gets is derived from its own initials so the same company always
// lands on the same tone across a session, instead of cycling by list
// position and re-shuffling every time the result set re-sorts.
const AVATAR_TONES = [
  'bg-(--explorer-blue-surface) text-(--explorer-blue)',
  'bg-(--explorer-teal-surface) text-(--explorer-teal)',
  'bg-(--explorer-bg) text-(--explorer-navy)',
  'bg-[#EEF2FF] text-[#4338CA]',
  'bg-[#FEF3E8] text-[#B45309]',
]

export function toneForCompany(name) {
  const code = (name || '').split('').reduce((sum, ch) => sum + ch.charCodeAt(0), 0)
  return AVATAR_TONES[code % AVATAR_TONES.length]
}

const AVATAR_SIZE = {
  sm: 'w-9 h-9 rounded-xl text-[11.5px]',
  lg: 'w-15 h-15 rounded-2xl text-[17px]',
}

export function Avatar({ initials, tone, size = 'sm' }) {
  return <div className={`flex items-center justify-center font-bold shrink-0 ${AVATAR_SIZE[size] || AVATAR_SIZE.sm} ${tone}`}>{initials}</div>
}

// Recently-posted marker for the list card and detail header — "recent"
// means today or yesterday, not just "sorted first".
export function NewBadge() {
  return (
    <span className="inline-flex items-center h-4 px-1.5 rounded bg-(--explorer-teal) text-white text-[9px] font-bold uppercase tracking-wide shrink-0">
      New
    </span>
  )
}

export function Pill({ children, className = '', icon }) {
  return (
    <span className={`inline-flex items-center gap-1.5 text-[11.5px] font-semibold px-2.5 py-0.75 rounded-full ${className}`}>
      {icon}
      {children}
    </span>
  )
}

// Small circular action control (Save / Share) with a hover tooltip label —
// used instead of a bordered square button so the identity header's action
// row reads lighter than the primary Apply button next to it.
export function IconButton({ icon, label, onClick, active = false, href }) {
  const [hover, setHover] = useState(false)
  const Tag = href ? 'a' : 'button'
  return (
    <span className="relative inline-flex" onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}>
      <Tag
        type={href ? undefined : 'button'}
        href={href}
        onClick={onClick}
        title={label}
        aria-label={label}
        aria-pressed={href ? undefined : active}
        className={`flex items-center justify-center w-10.5 h-10.5 rounded-full border transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--explorer-blue) ${
          active
            ? 'border-(--explorer-teal-border) bg-(--explorer-teal-surface) text-(--explorer-teal)'
            : 'border-(--explorer-border) bg-white text-(--explorer-navy) hover:border-(--explorer-navy)/20 hover:bg-(--explorer-bg)'
        }`}
      >
        {icon}
      </Tag>
      <span
        role="tooltip"
        className={`pointer-events-none absolute left-1/2 -translate-x-1/2 top-full mt-2 whitespace-nowrap rounded-md bg-(--explorer-navy) px-2 py-1 text-[11px] font-semibold text-white transition-opacity duration-150 ${
          hover ? 'opacity-100' : 'opacity-0'
        }`}
      >
        {label}
      </span>
    </span>
  )
}

// Muted single-line trust strip (shield icon) shown under the identity
// header's action row — kept out of plain-text-stretched-across-the-panel
// territory by living inside its own small tinted row.
export function TrustRow({ icon, children }) {
  return (
    <div className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-(--explorer-bg) px-3 py-2 text-[12px] text-(--explorer-muted)">
      <span className="shrink-0 text-(--explorer-muted)" aria-hidden="true">
        {icon}
      </span>
      {children}
    </div>
  )
}

// Deep-links straight to this job's apply flow in the dashboard app (see
// JobMatching.jsx, which opens the apply modal for a matching `?jobId=`) —
// same "click apply on the listing, land in the apply flow" pattern as
// Indeed/Naukri. Falls back to a title search for the curated sample data,
// which has no real id to link to.
export function jobHref(job) {
  if (job.applyUrl) return job.applyUrl
  if (job.id) return `${EMPLOYEE_APP_URL}/app/jobs?jobId=${encodeURIComponent(job.id)}`
  return `${EMPLOYEE_APP_URL}/app/jobs?q=${encodeURIComponent(job.title)}`
}

export function BulletList({ title, items }) {
  if (!items?.length) return null
  return (
    <div className="mt-6">
      <h4 className="font-bold text-[13.5px] text-(--explorer-navy)">{title}</h4>
      <ul className="mt-3 flex flex-col gap-2">
        {items.map((item) => (
          <li key={item} className="flex items-start gap-2 text-[13.5px] text-(--explorer-muted) leading-relaxed">
            <span className="mt-1.75 w-1 h-1 rounded-full bg-(--explorer-muted) shrink-0" aria-hidden="true" />
            {item}
          </li>
        ))}
      </ul>
    </div>
  )
}

// Skills read better as scannable tags than prose bullets — kept as a
// separate layout from BulletList rather than forcing one shape on both.
// Deliberately light (thin border, no fill) rather than heavy pills — a
// skill row of a dozen solid-filled pills reads as noisy, not premium.
export function TagList({ title, items }) {
  if (!items?.length) return null
  return (
    <div className="mt-6">
      <h4 className="font-bold text-[13.5px] text-(--explorer-navy)">{title}</h4>
      <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2">
        {items.map((item) => (
          <span key={item} className="text-[12.5px] font-medium text-(--explorer-navy)">
            {item}
          </span>
        ))}
      </div>
    </div>
  )
}

// One cell of the "At a glance" strip — a small tinted icon badge, a muted
// label, and a strong value, laid out in loose groups rather than a bordered
// dashboard table. Renders nothing when the job has no value for this fact,
// so the strip never shows an empty cell.
export function FactTile({ icon, label, value, tone = 'neutral' }) {
  if (!value) return null
  const toneClass = tone === 'blue' ? 'bg-(--explorer-blue-surface) text-(--explorer-blue)' : 'bg-(--explorer-bg) text-(--explorer-navy)'
  return (
    <div className="flex items-start gap-3">
      <span className={`flex items-center justify-center w-9 h-9 rounded-full shrink-0 ${toneClass}`} aria-hidden="true">
        {icon}
      </span>
      <div className="min-w-0">
        <p className="text-[11.5px] text-(--explorer-muted)">{label}</p>
        <p className="mt-0.5 text-[14px] font-bold text-(--explorer-navy) truncate">{value}</p>
      </div>
    </div>
  )
}

export function SectionHeading({ title, subtitle, label }) {
  return (
    <div className="mt-8 mb-4">
      {label && <p className="text-[11px] font-bold uppercase tracking-wide text-(--explorer-teal) mb-1">{label}</p>}
      <h4 className="font-bold text-[15px] text-(--explorer-navy)">{title}</h4>
      {subtitle && <p className="mt-1 text-[12.5px] text-(--explorer-muted)">{subtitle}</p>}
    </div>
  )
}

export function Divider() {
  return <hr className="mt-8 border-(--explorer-border)" />
}
