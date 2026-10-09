import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, BadgeCheck, Bookmark, BookmarkCheck, Briefcase, MapPin, Monitor, Zap } from 'lucide-react'
import { CompanyLogo } from './primitives'
import { jobPath, postedLabel } from './JobCard'
import { isJobSaved, toggleJobSaved } from '../../lib/savedJobs'
import { useToast } from './Toast'

// Real range only — the API sends a "Depends on…" sentence when a job has no
// salary, and that's simply left off here.
function salaryText(job) {
  if (!job.salaryMin || !job.salaryMax) return ''
  const [lo, hi] = (job.salary ?? '').split(/\s*[–-]\s*/)
  return lo && lo === hi ? lo : job.salary
}

// A plain left click on desktop opens the job beside the feed instead of
// navigating; modified clicks (new tab/window) and small screens keep the
// real link to the job page.
function opensInline(e) {
  return e.button === 0 && !e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey && window.matchMedia('(min-width: 1024px)').matches
}

// Tints for the skill badges — rotate mint/soft-blue/lavender rather than
// using one flat grey, per the MZOBS "subtle color contrast" palette.
const SKILL_TONES = [
  { bg: 'bg-[#E8F7F4]', text: 'text-[#078B7D]' },
  { bg: 'bg-[#EEF5FA]', text: 'text-[#12304A]' },
  { bg: 'bg-[#F0EDFF]', text: 'text-[#5B4FD6]' },
]

// One row of the homepage job feed. The whole row links to the job page
// (stretched ::after on the title link); Save sits above that overlay as its
// own control, so nothing interactive is nested. With `onOpen`, desktop opens
// the job in the side panel instead (see opensInline); `selected` marks the
// row that panel is showing. `index` only drives the subtle left-edge accent
// (teal for the first row, alternating teal/soft-blue after).
export default function JobListItem({ job, index = 0, onOpen, selected = false }) {
  const toast = useToast()
  // Read after mount — localStorage doesn't exist during prerender.
  const [saved, setSaved] = useState(false)
  useEffect(() => setSaved(isJobSaved(job)), [job])

  function toggleSave() {
    const next = toggleJobSaved(job)
    setSaved(next)
    toast(next ? 'Job saved on this device' : 'Removed from saved jobs', { tone: next ? 'success' : 'info' })
  }

  const meta = [
    { icon: MapPin, text: job.location?.split(',')[0] },
    { icon: Briefcase, text: job.experience },
    { icon: Monitor, text: job.workMode },
  ].filter((m) => m.text)
  const skills = (job.skills ?? []).filter(Boolean).slice(0, 2)
  const salary = salaryText(job)
  const edgeAccent = index === 0 ? '#078B7D' : index % 2 === 1 ? '#EEF5FA' : '#078B7D'

  return (
    <article
      className={`group relative overflow-hidden rounded-[12px] border p-4 pl-5 transition-[border-color,transform,box-shadow,background-color] duration-200 focus-within:border-[#078B7D] motion-safe:hover:-translate-y-[2px] hover:shadow-[0_18px_36px_-18px_rgba(18,59,93,0.25)] sm:p-5 sm:pl-6 ${
        selected ? 'border-[#078B7D] bg-[#E8F7F4]/40' : 'border-[#E6E8F0] bg-white hover:border-[#12A89D]/50'
      }`}
    >
      <span className="absolute inset-y-0 left-0 w-[3px]" style={{ backgroundColor: edgeAccent }} aria-hidden="true" />

      <div className="flex items-start gap-3.5">
        <CompanyLogo name={job.company} logo={job.logo} size={44} className="rounded-[10px]" />
        <div className="min-w-0 flex-1">
          <h3 className="pr-9 text-[16px] font-semibold leading-snug text-[#123B5D]">
            <Link
              to={jobPath(job)}
              state={{ job }}
              aria-current={selected ? 'true' : undefined}
              onClick={(e) => {
                if (!onOpen || !opensInline(e)) return
                e.preventDefault()
                onOpen(job)
              }}
              className="outline-none after:absolute after:inset-0 after:rounded-[12px] after:content-['']"
            >
              <span className="line-clamp-2">{job.title}</span>
            </Link>
          </h3>
          <p className="mt-0.5 flex min-w-0 items-center gap-1 text-[13.5px] text-[#078B7D]/85">
            <span className="truncate">{job.company}</span>
            {job.verified && (
              <span className="ml-1 inline-flex shrink-0 items-center gap-0.5 rounded bg-[#E8F7F4] px-1.5 py-0.5 text-[11px] font-semibold text-[#078B7D]">
                <BadgeCheck size={11} strokeWidth={2.6} aria-hidden="true" /> Verified
              </span>
            )}
            {job.instantHiring && (
              <span className="ml-1 inline-flex shrink-0 items-center gap-0.5 rounded bg-amber-100 px-1.5 py-0.5 text-[11px] font-semibold text-amber-800">
                <Zap size={11} strokeWidth={2.6} aria-hidden="true" /> Urgent
              </span>
            )}
          </p>

          <ul className="mt-2.5 flex flex-wrap gap-x-4 gap-y-1 text-[13px] text-mz-muted">
            {meta.map(({ icon: Icon, text }) => (
              <li key={text} className="flex items-center gap-1.5">
                <Icon size={13.5} className={Icon === MapPin ? 'text-[#078B7D]' : Icon === Briefcase ? 'text-[#0b7a6d]' : ''} aria-hidden="true" />
                {text}
              </li>
            ))}
            {salary && (
              <li className="font-bold text-[#123B5D]">
                <span className="sr-only">Salary: </span>
                {salary}
              </li>
            )}
          </ul>

          <div className="mt-3 flex flex-wrap items-center justify-between gap-x-3 gap-y-2">
            <div className="flex min-w-0 flex-wrap items-center gap-1.5">
              {skills.map((s, i) => {
                const tone = SKILL_TONES[i % SKILL_TONES.length]
                return (
                  <span key={s} className={`rounded px-2 py-0.5 text-[12px] font-medium transition-transform duration-200 hover:-translate-y-px ${tone.bg} ${tone.text}`}>
                    {s}
                  </span>
                )
              })}
              {job.postedDaysAgo != null && (
                <span className="text-[12px] text-mz-muted">
                  {skills.length > 0 && <span aria-hidden="true" className="mr-1.5">&middot;</span>}
                  {postedLabel(job.postedDaysAgo)}
                </span>
              )}
            </div>
            <span className="inline-flex items-center gap-1 text-[13.5px] font-semibold text-[#078B7D]" aria-hidden="true">
              View role
              <ArrowRight size={14} className="transition-transform duration-150 group-hover:translate-x-0.5" />
            </span>
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={toggleSave}
        aria-pressed={saved}
        aria-label={saved ? `Unsave ${job.title}` : `Save ${job.title}`}
        className={`absolute right-2.5 top-2.5 z-10 flex h-9 w-9 items-center justify-center rounded-[8px] transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-[#078B7D] ${
          saved ? 'bg-[#E8F7F4] text-[#078B7D]' : 'text-[#123B5D]/55 hover:bg-[#E8F7F4] hover:text-[#078B7D]'
        }`}
      >
        {saved ? <BookmarkCheck size={17} aria-hidden="true" /> : <Bookmark size={17} aria-hidden="true" />}
      </button>
    </article>
  )
}

export function JobListItemSkeleton() {
  return (
    <div className="rounded-[12px] border border-mz-line bg-white p-4 sm:p-5" aria-hidden="true">
      <div className="flex items-start gap-3.5">
        <div className="mz-skeleton h-11 w-11 rounded-[10px]" />
        <div className="flex-1 space-y-2.5 pt-0.5">
          <div className="mz-skeleton h-4 w-2/3 rounded" />
          <div className="mz-skeleton h-3 w-1/3 rounded" />
          <div className="mz-skeleton h-3 w-1/2 rounded" />
          <div className="mz-skeleton h-3 w-1/4 rounded" />
        </div>
      </div>
    </div>
  )
}
