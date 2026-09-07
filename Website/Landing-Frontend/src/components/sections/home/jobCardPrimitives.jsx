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
export const LOGO_TONES = ['bg-(--explorer-bg) text-(--explorer-blue)', 'bg-(--explorer-teal-surface) text-(--explorer-teal)']
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

const AVATAR_SIZE = {
  sm: 'w-8 h-8 rounded-lg text-[11px]',
  lg: 'w-14 h-14 rounded-2xl text-base',
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
// The first `accentCount` items (the role's most load-bearing skills, as
// ordered by whoever wrote the listing) get the blue accent treatment,
// the rest stay neutral — one accent color used sparingly reads as
// "highlighted", used on every tag it just reads as noise.
export function TagList({ title, items, accentCount = 0 }) {
  if (!items?.length) return null
  return (
    <div className="mt-6">
      <h4 className="font-bold text-[13.5px] text-(--explorer-navy)">{title}</h4>
      <div className="mt-3 flex flex-wrap gap-1.5">
        {items.map((item) => (
          <span
            key={item}
            className="text-[12px] font-semibold px-2.5 py-1 rounded-md border border-(--explorer-border) bg-white text-(--explorer-navy)"
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  )
}

// Compact "key facts" strip for the job-detail panel — small muted label,
// bold value, minimal icon — laid out three-up with light dividers between
// cells instead of six separate tinted boxes. `emphasize` gives salary/work
// mode a touch more visual weight without turning every value into a pill.
// Renders nothing when the job has no value for this fact, so the strip
// never shows an empty cell.
export function FactTile({ icon, label, value, emphasize = false }) {
  if (!value) return null
  return (
    <div className="flex items-start gap-2 py-2.5 px-3">
      <span className="mt-0.5 text-(--explorer-muted) shrink-0" aria-hidden="true">
        {icon}
      </span>
      <div className="min-w-0">
        <p className="text-[11px] text-(--explorer-muted)">{label}</p>
        <p className={`mt-0.5 text-[13.5px] truncate ${emphasize ? 'font-bold text-(--explorer-navy)' : 'font-semibold text-(--explorer-navy)'}`}>{value}</p>
      </div>
    </div>
  )
}

export function SectionHeading({ title, subtitle }) {
  return (
    <div className="mt-7 mb-4">
      <h4 className="font-bold text-[15px] text-(--explorer-navy)">{title}</h4>
      {subtitle && <p className="mt-1 text-[12.5px] text-(--explorer-muted)">{subtitle}</p>}
    </div>
  )
}

export function Divider() {
  return <hr className="mt-7 border-(--explorer-border)" />
}
