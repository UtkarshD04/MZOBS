import { EMPLOYEE_APP_URL } from './config'

// Non-component helpers shared between the "Latest jobs" list/inline detail
// panel (LatestJobs.jsx, desktop) and the standalone job description page
// (pages/JobDetail.jsx, mobile) — split out of jobCardPrimitives.jsx (which
// keeps the shared components) so that file only exports components.

// Kept to this page's own --explorer-* palette (not the shared Badge/CompanyLogo
// tone system, which is a separate, differently-shaded color set used
// elsewhere on the site) so every pill and avatar here stays visually
// consistent and restrained — blue for primary actions and accents
// (matching the Hero's own blue/purple CTA identity), everything else
// neutral.
export const LOGO_TONES = ['bg-(--explorer-blue-surface) text-(--explorer-blue)']
export const WORK_MODE_STYLE = {
  Remote: 'bg-(--explorer-blue-surface) text-(--explorer-blue)',
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
  'bg-(--explorer-bg) text-(--explorer-navy)',
  'bg-[#EEF2FF] text-[#4338CA]',
  'bg-[#FEF3E8] text-[#B45309]',
]

export function toneForCompany(name) {
  const code = (name || '').split('').reduce((sum, ch) => sum + ch.charCodeAt(0), 0)
  return AVATAR_TONES[code % AVATAR_TONES.length]
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
