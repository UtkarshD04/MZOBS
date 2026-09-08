import { useState } from 'react'
import { motion } from 'framer-motion'
import { MapPin, Briefcase, IndianRupee, Clock, ArrowUpRight, ArrowRight, Users, Building2, Bookmark, Share2, Check, TrendingUp, ShieldCheck } from 'lucide-react'
import ApplyPanel from './ApplyPanel'
import { isJobSaved, toggleJobSaved } from '../../../lib/savedJobs'
import {
  toneForCompany,
  Avatar,
  NewBadge,
  jobHref,
  BulletList,
  TagList,
  FactTile,
  SectionHeading,
  Divider,
  IconButton,
  TrustRow,
  initialsOf,
} from './jobCardPrimitives'

const DESCRIPTION_PREVIEW_CHARS = 320

// The full job description view — desktop's sticky side panel inside
// LatestJobs.jsx, and the standalone mobile job description page
// (pages/JobDetail.jsx), both render this same component so a job looks
// identical in both places. Self-contained: owns its own "apply panel open",
// "saved", "link copied" and "description expanded" state, so either caller
// can just drop it in with a job.
//
// `nextJob`/`onNext` are optional — only the desktop explorer (which holds
// the full filtered list) passes them, to power the subtle "Next
// opportunity" nav at the bottom; the standalone mobile page omits them and
// the section just doesn't render. `stickyActions` is set by that mobile
// page to pin the Apply row to the bottom of the viewport.
export default function JobDetailPanel({ job, nextJob, onNext, stickyActions = false }) {
  const [copied, setCopied] = useState(false)
  const [applyOpen, setApplyOpen] = useState(false)
  const [saved, setSaved] = useState(() => isJobSaved(job))
  const [descExpanded, setDescExpanded] = useState(false)

  const isRecent = job.postedDaysAgo != null && job.postedDaysAgo <= 1
  const descriptionIsLong = (job.description?.length ?? 0) > DESCRIPTION_PREVIEW_CHARS

  // Native share sheet where supported (mobile browsers), otherwise falls
  // back to copying the apply link so the button still does something useful
  // on desktop.
  async function shareJob() {
    const url = jobHref(job)
    try {
      if (navigator.share) {
        await navigator.share({ title: job.title, text: `${job.title} at ${job.company}`, url })
        return
      }
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Share sheet dismissed or clipboard unavailable — nothing to recover.
    }
  }

  function toggleSave() {
    setSaved(toggleJobSaved(job))
  }

  if (applyOpen) return <ApplyPanel job={job} onClose={() => setApplyOpen(false)} />

  const applyButton = (
    <motion.a
      href={job.applyUrl}
      onClick={job.applyUrl ? undefined : (e) => { e.preventDefault(); setApplyOpen(true) }}
      whileHover={{ y: -1 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: 'spring', stiffness: 350, damping: 18 }}
      className="inline-flex flex-1 items-center justify-center gap-2 h-12 px-6 rounded-xl bg-(--explorer-blue) text-white text-[14.5px] font-bold shadow-[0_8px_20px_-6px_rgba(37,99,235,0.55)] hover:bg-(--explorer-blue-hover) hover:shadow-[0_10px_24px_-6px_rgba(37,99,235,0.6)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--explorer-blue) transition-[background-color,box-shadow]"
    >
      Apply now <ArrowUpRight size={17} aria-hidden="true" />
    </motion.a>
  )

  return (
    <>
      {/* Job identity header — pale-blue ambient wash confined to this block only. */}
      <div className="relative -m-6 mb-0 sm:-m-7 sm:mb-0 px-6 pt-6 sm:px-7 sm:pt-7 pb-6 overflow-hidden rounded-t-xl">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(120% 100% at 15% 0%, var(--explorer-blue-surface) 0%, rgba(239,246,255,0) 60%)' }}
          aria-hidden="true"
        />
        <div className="relative flex items-start gap-4">
          <span aria-hidden="true">
            <Avatar initials={initialsOf(job.company)} tone={toneForCompany(job.company)} size="lg" />
          </span>
          <div className="min-w-0 flex-1">
            <div className="flex items-start gap-2">
              <h3 className="font-bold text-[20px] text-(--explorer-navy) leading-snug">{job.title}</h3>
              {isRecent && <span className="mt-1.5"><NewBadge /></span>}
            </div>
            <p className="mt-1 text-[13.5px] text-(--explorer-muted) flex flex-wrap items-center gap-x-1.5">
              <span className="inline-flex items-center gap-1 font-semibold text-(--explorer-navy)">
                <Building2 size={13} className="shrink-0 text-(--explorer-muted)" aria-hidden="true" />
                {job.company}
              </span>
              <span aria-hidden="true">·</span>
              <span>{job.location}</span>
              {job.workMode && (
                <>
                  <span aria-hidden="true">·</span>
                  <span>{job.workMode}</span>
                </>
              )}
            </p>
            {job.salary && <p className="mt-1.5 text-[17px] font-bold text-(--explorer-navy)">{job.salary}</p>}
            {job.recruiterOnline && (
              <span className="mt-2 inline-flex items-center gap-1.5 text-[11.5px] font-semibold text-(--explorer-teal)">
                <span className="relative flex h-1.5 w-1.5 shrink-0">
                  <span className="motion-safe:animate-ping absolute inline-flex h-full w-full rounded-full bg-(--explorer-teal) opacity-75" />
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-(--explorer-teal)" />
                </span>
                Actively reviewing candidates
              </span>
            )}
          </div>
        </div>

        <div
          className={`mt-5 flex items-center gap-2 ${
            stickyActions
              ? 'fixed inset-x-0 bottom-0 z-30 px-4 py-3 bg-white/95 backdrop-blur border-t border-(--explorer-border) lg:static lg:z-auto lg:border-0 lg:bg-transparent lg:backdrop-blur-none lg:px-0 lg:py-0'
              : 'relative'
          }`}
        >
          {applyButton}
          <IconButton
            icon={<Bookmark size={17} aria-hidden="true" fill={saved ? 'currentColor' : 'none'} />}
            label={saved ? 'Remove from saved jobs' : 'Save this job'}
            onClick={toggleSave}
            active={saved}
          />
          <IconButton
            icon={copied ? <Check size={17} aria-hidden="true" /> : <Share2 size={17} aria-hidden="true" />}
            label={copied ? 'Link copied' : 'Share this job'}
            onClick={shareJob}
          />
        </div>

        <TrustRow icon={<ShieldCheck size={14} aria-hidden="true" />}>
          Applications are reviewed by MZOBS before being shared with the employer.
        </TrustRow>

        <p className="mt-2 flex items-center gap-1.5 text-[12px] text-(--explorer-muted)">
          <Clock size={12} className="shrink-0" aria-hidden="true" />
          Posted {job.postedDaysAgo === 0 ? 'today' : `${job.postedDaysAgo} days ago`}
        </p>
      </div>

      <SectionHeading title="At a glance" />
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-5">
        <FactTile icon={<IndianRupee size={15} aria-hidden="true" />} label="Salary" value={job.salary} tone="blue" />
        <FactTile icon={<TrendingUp size={15} aria-hidden="true" />} label="Experience" value={job.experience} />
        <FactTile icon={<Building2 size={15} aria-hidden="true" />} label="Work mode" value={job.workMode} />
        <FactTile icon={<MapPin size={15} aria-hidden="true" />} label="Location" value={job.location} />
        <FactTile icon={<Briefcase size={15} aria-hidden="true" />} label="Job type" value={job.employmentType} />
        <FactTile icon={<Users size={15} aria-hidden="true" />} label="Openings" value={job.vacancies > 0 ? `${job.vacancies} opening${job.vacancies === 1 ? '' : 's'}` : ''} />
      </div>

      {job.benefits?.length > 0 && (
        <>
          <Divider />
          <div className="rounded-xl border border-(--explorer-teal-border)/60 bg-(--explorer-teal-surface) px-5 py-5 sm:px-6 sm:py-6">
            <SectionHeading label="Candidate highlights" title="Why this role stands out" />
            <ul className="mt-0! grid sm:grid-cols-2 gap-x-6 gap-y-3">
              {job.benefits.map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-[13px] text-(--explorer-navy) leading-relaxed">
                  <span className="flex items-center justify-center w-5 h-5 rounded-full bg-white text-(--explorer-teal) shrink-0 mt-0.5" aria-hidden="true">
                    <Check size={12} />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </>
      )}

      <Divider />

      <SectionHeading title="Full job description" />
      {job.description && (
        <div className="max-w-[64ch]">
          <p className={`text-[14.5px] text-(--explorer-navy) leading-[1.75] whitespace-pre-line ${!descExpanded && descriptionIsLong ? 'line-clamp-5' : ''}`}>
            {job.description}
          </p>
          {descriptionIsLong && (
            <button
              type="button"
              onClick={() => setDescExpanded((v) => !v)}
              className="mt-2.5 text-[13px] font-bold text-(--explorer-teal) hover:text-(--explorer-teal-hover) transition-colors"
            >
              {descExpanded ? 'Show less' : 'Read full description'}
            </button>
          )}
        </div>
      )}
      <TagList title="Skills" items={job.skills} />
      <BulletList title="What you'll do" items={job.highlights} />

      {nextJob && (
        <>
          <Divider />
          <button
            type="button"
            onClick={onNext}
            className="w-full flex items-center justify-between gap-3 py-3 text-left group"
          >
            <span className="min-w-0">
              <span className="block text-[11px] font-semibold uppercase tracking-wide text-(--explorer-muted)">Next opportunity</span>
              <span className="block mt-0.5 text-[13.5px] font-bold text-(--explorer-navy) truncate">{nextJob.title}</span>
            </span>
            <ArrowRight size={16} className="shrink-0 text-(--explorer-muted) group-hover:text-(--explorer-blue) group-hover:translate-x-0.5 transition-[color,transform]" aria-hidden="true" />
          </button>
        </>
      )}
    </>
  )
}
