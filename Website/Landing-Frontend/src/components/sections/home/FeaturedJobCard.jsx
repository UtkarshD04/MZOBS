import { MapPin, TrendingUp, IndianRupee, Clock, ArrowUpRight } from 'lucide-react'
import { CompanyMark, VerifiedMark, NewBadge } from './jobCardPrimitives'

const MAX_SKILLS = 3

// The left-hand "hero" of the Featured opportunities section — one real job
// (the first/newest in the current result set) given editorial-magazine
// treatment instead of a dashboard-style facts grid. Deliberately shows only
// a slice of the job (title, inline metadata, a couple of skills, a two-line
// excerpt) — the full description/benefits/facts grid live on the actual
// job-detail route this card links to (pages/JobDetail.jsx), not here.
export default function FeaturedJobCard({ job, onOpen }) {
  const isRecent = job.postedDaysAgo != null && job.postedDaysAgo <= 1
  const skills = (job.skills ?? []).slice(0, MAX_SKILLS)

  return (
    <button
      type="button"
      onClick={onOpen}
      className="explorer-tile-btn group w-full min-w-0 text-left flex flex-col bg-white border border-(--explorer-border) rounded-2xl p-6 sm:p-7 shadow-[0_1px_2px_rgba(16,42,67,0.04)] motion-safe:hover:-translate-y-px hover:border-(--explorer-teal-border) hover:shadow-[0_16px_32px_-16px_rgba(11,122,109,0.22)] transition-[border-color,box-shadow,transform] duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--explorer-teal)"
    >
      <div className="flex items-start gap-4">
        <span aria-hidden="true">
          <CompanyMark company={job.company} logo={job.logo} size="lg" />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-[11px] font-bold uppercase tracking-wide text-(--explorer-muted)">Featured role</p>
            {isRecent && <NewBadge />}
          </div>
          <h3 className="mt-1.5 text-[22px] sm:text-[25px] font-extrabold text-(--explorer-navy) leading-snug text-balance">{job.title}</h3>
          <p className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-[13.5px] text-(--explorer-muted)">
            <span className="font-semibold text-(--explorer-navy)">{job.company}</span>
            <span aria-hidden="true">·</span>
            <span className="inline-flex items-center gap-1">
              <MapPin size={12.5} className="shrink-0" aria-hidden="true" />
              {job.location}
            </span>
            {job.workMode && (
              <>
                <span aria-hidden="true">·</span>
                <span>{job.workMode}</span>
              </>
            )}
            {job.experience && (
              <>
                <span aria-hidden="true">·</span>
                <span className="inline-flex items-center gap-1">
                  <TrendingUp size={12.5} className="shrink-0" aria-hidden="true" />
                  {job.experience}
                </span>
              </>
            )}
          </p>
          {job.salary && (
            <p className="mt-1.5 flex items-center gap-1 text-[15px] font-bold text-(--explorer-navy)">
              <IndianRupee size={14} className="shrink-0" aria-hidden="true" />
              {job.salary}
            </p>
          )}
        </div>
      </div>

      {skills.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-1.5">
          {skills.map((skill) => (
            <span key={skill} className="inline-flex items-center h-6 px-2.5 rounded-md border border-(--explorer-border) text-[11.5px] font-semibold text-(--explorer-navy)">
              {skill}
            </span>
          ))}
        </div>
      )}

      {job.description && <p className="mt-4 text-[13.5px] text-(--explorer-muted) leading-relaxed line-clamp-2">{job.description}</p>}

      <div className="mt-6 pt-5 border-t border-(--explorer-border) flex items-center justify-between gap-3">
        <span className="inline-flex items-center gap-1.5 h-10 px-5 rounded-md bg-(--explorer-teal) text-white text-[13.5px] font-bold group-hover:bg-(--explorer-teal-hover) transition-colors">
          View role <ArrowUpRight size={15} aria-hidden="true" />
        </span>
        <span className="flex flex-col items-end gap-1 text-right">
          {job.verified && <VerifiedMark />}
          <span className="flex items-center gap-1 text-[12px] text-(--explorer-muted)">
            <Clock size={12} className="shrink-0" aria-hidden="true" />
            Posted {job.postedDaysAgo === 0 ? 'today' : `${job.postedDaysAgo}d ago`}
          </span>
        </span>
      </div>
    </button>
  )
}

// Mirrors FeaturedJobCard's exact block shape (avatar + title block, skill
// row, excerpt, bottom action row) so the layout never jumps once the real
// job replaces it.
export function FeaturedJobCardSkeleton() {
  return (
    <div className="flex flex-col bg-white border border-(--explorer-border) rounded-2xl p-6 sm:p-7 animate-pulse">
      <div className="flex items-start gap-4">
        <div className="w-15 h-15 rounded-2xl bg-(--explorer-bg) shrink-0" />
        <div className="min-w-0 flex-1 flex flex-col gap-2.5 py-0.5">
          <div className="h-2.5 w-24 rounded bg-(--explorer-bg)" />
          <div className="h-5 w-3/4 rounded bg-(--explorer-bg)" />
          <div className="h-3 w-2/3 rounded bg-(--explorer-bg)" />
          <div className="h-4 w-1/3 rounded bg-(--explorer-bg)" />
        </div>
      </div>
      <div className="mt-4 flex gap-1.5">
        <div className="h-6 w-16 rounded-md bg-(--explorer-bg)" />
        <div className="h-6 w-20 rounded-md bg-(--explorer-bg)" />
        <div className="h-6 w-14 rounded-md bg-(--explorer-bg)" />
      </div>
      <div className="mt-4 flex flex-col gap-2">
        <div className="h-2.5 w-full rounded bg-(--explorer-bg)" />
        <div className="h-2.5 w-2/3 rounded bg-(--explorer-bg)" />
      </div>
      <div className="mt-6 pt-5 border-t border-(--explorer-border) flex items-center justify-between">
        <div className="h-10 w-28 rounded-lg bg-(--explorer-bg)" />
        <div className="h-2.5 w-24 rounded bg-(--explorer-bg)" />
      </div>
    </div>
  )
}
