import { useState } from 'react'
import { ShieldCheck } from 'lucide-react'
import { initialsOf, toneForCompany } from '../../../lib/jobCardHelpers'

// Small presentational pieces shared between the "Latest jobs" list/inline
// detail panel (LatestJobs.jsx, desktop) and the standalone job description
// page (pages/JobDetail.jsx, mobile) — kept in one place so both render a
// job identically instead of two hand-maintained copies drifting apart.
// Non-component exports (constants/helpers other files import) live in
// lib/jobCardHelpers.js instead — keeping this file components-only is what
// makes Fast Refresh work for it.

const AVATAR_SIZE = {
  sm: 'w-9 h-9 rounded-xl text-[11.5px]',
  lg: 'w-15 h-15 rounded-2xl text-[17px]',
}

export function Avatar({ initials, tone, size = 'sm' }) {
  return <div className={`flex items-center justify-center font-bold shrink-0 ${AVATAR_SIZE[size] || AVATAR_SIZE.sm} ${tone}`}>{initials}</div>
}

// Real company logo when the employer has uploaded one (Company.logo),
// falling back to the same initials-avatar every other job surface uses —
// so a job never shows a placeholder/stock logo, only genuine employer
// branding or a refined monogram. Used by the Featured job card and the
// compact job rows on the home page's discovery section. `tone` overrides
// the usual per-company hash rotation (see toneForCompany) — Fresh
// opportunities (FeaturedJobCard.jsx/CompactJobRow.jsx) pins it to the
// section's own blue accent instead, so its avatars never land on a tone
// (teal, orange...) that clashes with that section's Hero-matched palette.
export function CompanyMark({ company, logo, size = 'sm', tone }) {
  if (logo) {
    return (
      <img
        src={logo}
        alt=""
        aria-hidden="true"
        className={`object-contain shrink-0 bg-white border border-(--explorer-border) ${
          size === 'lg' ? 'w-15 h-15 rounded-2xl p-2' : 'w-9 h-9 rounded-xl p-1.5'
        }`}
      />
    )
  }
  return <Avatar initials={initialsOf(company)} tone={tone ?? toneForCompany(company)} size={size} />
}

// Small blue marker shown only when Company.verificationStatus is actually
// 'verified' (see Backend's toLatestJobSummary) — never rendered as a
// default/assumed state, so its presence always means something real.
export function VerifiedMark() {
  return (
    <span className="inline-flex items-center gap-1 text-[11.5px] font-semibold text-(--explorer-blue)">
      <ShieldCheck size={12.5} aria-hidden="true" /> Verified employer
    </span>
  )
}

// Recently-posted marker for the list card and detail header — "recent"
// means today or yesterday, not just "sorted first".
export function NewBadge() {
  return (
    <span className="inline-flex items-center h-4 px-1.5 rounded bg-(--explorer-blue) text-white text-[9px] font-bold uppercase tracking-wide shrink-0">
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
        className={`explorer-icon-btn flex items-center justify-center w-10.5 h-10.5 rounded-full border motion-safe:transition-[background-color,border-color,color,transform] duration-150 motion-safe:hover:-translate-y-px motion-safe:active:translate-y-0 motion-safe:active:scale-[0.96] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--explorer-blue) ${
          active
            ? 'border-(--explorer-blue-border) bg-(--explorer-blue-surface) text-(--explorer-blue)'
            : 'border-(--explorer-border) bg-white text-(--explorer-navy) hover:border-(--explorer-blue-border) hover:bg-(--explorer-blue-surface) hover:text-(--explorer-blue)'
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
      {label && <p className="text-[11px] font-bold uppercase tracking-wide text-(--explorer-blue) mb-1">{label}</p>}
      <h4 className="font-bold text-[15px] text-(--explorer-navy)">{title}</h4>
      {subtitle && <p className="mt-1 text-[12.5px] text-(--explorer-muted)">{subtitle}</p>}
    </div>
  )
}

export function Divider() {
  return <hr className="mt-8 border-(--explorer-border)" />
}
