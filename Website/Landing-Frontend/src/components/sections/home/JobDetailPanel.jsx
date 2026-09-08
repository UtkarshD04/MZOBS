import { useState } from 'react'
import { motion } from 'framer-motion'
import { MapPin, Briefcase, IndianRupee, Clock, ArrowUpRight, Users, Building2, Bookmark, Share2, Check, TrendingUp } from 'lucide-react'
import ApplyPanel from './ApplyPanel'
import { isJobSaved, toggleJobSaved } from '../../../lib/savedJobs'
import {
  LOGO_TONES,
  Avatar,
  NewBadge,
  jobHref,
  BulletList,
  TagList,
  FactTile,
  SectionHeading,
  Divider,
  initialsOf,
} from './jobCardPrimitives'

const DESCRIPTION_PREVIEW_CHARS = 320

// The full job description view — desktop's sticky side panel inside
// LatestJobs.jsx, and the standalone mobile job description page
// (pages/JobDetail.jsx), both render this same component so a job looks
// identical in both places. Self-contained: owns its own "apply panel open",
// "saved", "link copied" and "description expanded" state, so either caller
// can just drop it in with a job.
export default function JobDetailPanel({ job, toneIndex = 0 }) {
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

  return (
    <>
      <div className="flex items-start gap-4">
        <span aria-hidden="true">
          <Avatar initials={initialsOf(job.company)} tone={LOGO_TONES[toneIndex % LOGO_TONES.length]} size="lg" />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-start gap-2">
            <h3 className="font-bold text-[19px] text-(--explorer-navy) leading-snug">{job.title}</h3>
            {isRecent && <span className="mt-1.5"><NewBadge /></span>}
          </div>
          <p className="mt-1 text-[13.5px] text-(--explorer-muted) flex flex-wrap items-center gap-x-1.5">
            <span className="inline-flex items-center gap-1 font-medium text-(--explorer-navy)">
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
          {job.salary && <p className="mt-1.5 text-[16px] font-bold text-(--explorer-navy)">{job.salary}</p>}
          {job.recruiterOnline && (
            <span className="mt-1.5 inline-flex items-center gap-1.5 text-[11.5px] font-semibold text-(--explorer-teal)">
              <span className="relative flex h-1.5 w-1.5 shrink-0">
                <span className="motion-safe:animate-ping absolute inline-flex h-full w-full rounded-full bg-(--explorer-teal) opacity-75" />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-(--explorer-teal)" />
              </span>
              Recruiter online
            </span>
          )}
        </div>
      </div>

      <div className="mt-5 flex items-center gap-2">
        {job.applyUrl ? (
          <motion.a
            href={job.applyUrl}
            whileHover={{ y: -1 }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 350, damping: 18 }}
            className="inline-flex flex-1 sm:flex-initial items-center justify-center gap-2 h-11 px-6 rounded-lg bg-(--explorer-blue) text-white text-[14px] font-bold hover:bg-(--explorer-blue-hover) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--explorer-blue) transition-colors"
          >
            Apply now <ArrowUpRight size={16} aria-hidden="true" />
          </motion.a>
        ) : (
          <motion.button
            type="button"
            onClick={() => setApplyOpen(true)}
            whileHover={{ y: -1 }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 350, damping: 18 }}
            className="inline-flex flex-1 sm:flex-initial items-center justify-center gap-2 h-11 px-6 rounded-lg bg-(--explorer-blue) text-white text-[14px] font-bold hover:bg-(--explorer-blue-hover) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--explorer-blue) transition-colors"
          >
            Apply now <ArrowUpRight size={16} aria-hidden="true" />
          </motion.button>
        )}
        <button
          type="button"
          onClick={toggleSave}
          title={saved ? 'Remove from saved jobs' : 'Save this job'}
          aria-label={saved ? 'Remove from saved jobs' : 'Save this job'}
          aria-pressed={saved}
          className={`flex items-center justify-center w-11 h-11 rounded-lg border transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--explorer-blue) ${
            saved
              ? 'border-(--explorer-teal-border) bg-(--explorer-teal-surface) text-(--explorer-teal)'
              : 'border-(--explorer-border) bg-white text-(--explorer-navy) hover:bg-(--explorer-bg)'
          }`}
        >
          <Bookmark size={17} aria-hidden="true" fill={saved ? 'currentColor' : 'none'} />
        </button>
        <button
          type="button"
          onClick={shareJob}
          title={copied ? 'Link copied' : 'Share this job'}
          aria-label={copied ? 'Link copied' : 'Share this job'}
          className="flex items-center justify-center w-11 h-11 rounded-lg border border-(--explorer-border) bg-white text-(--explorer-navy) hover:bg-(--explorer-bg) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--explorer-blue) transition-colors"
        >
          {copied ? <Check size={17} aria-hidden="true" /> : <Share2 size={17} aria-hidden="true" />}
        </button>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5">
        <span className="flex items-center gap-1.5 text-[12.5px] text-(--explorer-muted)">
          <Clock size={12.5} className="shrink-0" aria-hidden="true" />
          {copied ? 'Link copied' : `Posted ${job.postedDaysAgo === 0 ? 'today' : `${job.postedDaysAgo} days ago`}`}
        </span>
        <span className="text-[12px] text-(--explorer-muted)">Applications are reviewed by MZOBS before being shared with the employer.</span>
      </div>

      <Divider />

      <SectionHeading title="Key details" />
      <div className="grid grid-cols-2 sm:grid-cols-3 divide-x divide-y divide-(--explorer-border) border border-(--explorer-border) rounded-lg overflow-hidden [&>*:nth-child(2n)]:sm:border-r sm:[&>*:nth-child(3n)]:border-r-0!">
        <FactTile icon={<IndianRupee size={13} aria-hidden="true" />} label="Salary" value={job.salary} emphasize />
        <FactTile icon={<Briefcase size={13} aria-hidden="true" />} label="Job type" value={job.employmentType} />
        <FactTile icon={<TrendingUp size={13} aria-hidden="true" />} label="Experience" value={job.experience} />
        <FactTile icon={<MapPin size={13} aria-hidden="true" />} label="Location" value={job.location} />
        <FactTile icon={<Users size={13} aria-hidden="true" />} label="Openings" value={job.vacancies > 0 ? `${job.vacancies} opening${job.vacancies === 1 ? '' : 's'}` : ''} />
        <FactTile icon={<Building2 size={13} aria-hidden="true" />} label="Work mode" value={job.workMode} emphasize />
      </div>

      {job.benefits?.length > 0 && (
        <>
          <Divider />
          <SectionHeading title="Benefits" subtitle="Pulled from the full job description" />
          <ul className="grid sm:grid-cols-2 gap-x-6 gap-y-2.5">
            {job.benefits.map((item) => (
              <li key={item} className="flex items-start gap-2 text-[13px] text-(--explorer-navy) leading-relaxed">
                <Check size={14} className="mt-0.5 shrink-0 text-(--explorer-teal)" aria-hidden="true" />
                {item}
              </li>
            ))}
          </ul>
        </>
      )}

      <Divider />

      <SectionHeading title="Full job description" />
      {job.description && (
        <div>
          <p className={`text-[14.5px] text-(--explorer-navy) leading-relaxed max-w-[64ch] ${!descExpanded && descriptionIsLong ? 'line-clamp-5' : ''}`}>
            {job.description}
          </p>
          {descriptionIsLong && (
            <button
              type="button"
              onClick={() => setDescExpanded((v) => !v)}
              className="mt-2 text-[13px] font-bold text-(--explorer-teal) hover:text-(--explorer-teal-hover) transition-colors"
            >
              {descExpanded ? 'Show less' : 'Show more'}
            </button>
          )}
        </div>
      )}
      <BulletList title="What you'll do" items={job.highlights} />
      <TagList title="Skills" items={job.skills} accentCount={3} />
    </>
  )
}
