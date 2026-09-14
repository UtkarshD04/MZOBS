import { ArrowRight, Clock } from 'lucide-react'
import { CompanyMark, NewBadge, accentBarToneFor } from './jobCardPrimitives'

// The "More openings" row beside the Featured Opportunity — a quiet
// editorial list (thin dividers between rows, no card borders) rather than
// a grid of equally-weighted boxes, so the Featured panel above it stays
// the section's one clear focal point. Not the same shape as
// CompactJobRow.jsx (a bordered pill), which pages/CityJobs.jsx still
// depends on as-is.
export default function OpportunityCard({ job, onOpen }) {
  const isRecent = job.postedDaysAgo != null && job.postedDaysAgo <= 1

  return (
    <button
      type="button"
      onClick={onOpen}
      className="group relative w-full min-w-0 text-left flex items-center gap-4 py-4 sm:py-4.5 px-3 sm:px-4 rounded-xl motion-safe:transition-colors motion-safe:duration-200 hover:bg-(--explorer-bg) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--explorer-teal)"
    >
      {/* Near-invisible at rest, the per-company accent tone only appears
          on hover — a quiet rhythm marker rather than a permanent stripe
          (see the redesign brief's item 16). */}
      <span
        aria-hidden="true"
        className={`absolute left-0 top-2.5 bottom-2.5 w-[3px] rounded-full opacity-0 group-hover:opacity-100 motion-safe:transition-opacity motion-safe:duration-200 ${accentBarToneFor(job.company)}`}
      />

      <span className="shrink-0 motion-safe:transition-transform motion-safe:duration-200 group-hover:scale-[1.04]" aria-hidden="true">
        <CompanyMark company={job.company} logo={job.logo} size="sm" />
      </span>

      <span className="min-w-0 flex-1 motion-safe:transition-transform motion-safe:duration-200 group-hover:translate-x-0.5">
        <span className="flex items-center gap-2">
          <span className="font-bold text-[14.5px] text-(--explorer-navy) truncate">{job.title}</span>
          {isRecent && <NewBadge />}
        </span>
        <span className="mt-1 flex flex-wrap items-center gap-x-1.5 text-[12.5px] text-(--explorer-muted)">
          <span className="truncate">{job.company}</span>
          <span aria-hidden="true">·</span>
          <span className="truncate">{job.location.split(',')[0]}</span>
          {job.experience && (
            <span className="hidden sm:contents">
              <span aria-hidden="true">·</span>
              <span className="truncate">{job.experience}</span>
            </span>
          )}
          {job.salary && (
            <span className="hidden md:contents">
              <span aria-hidden="true">·</span>
              <span className="font-semibold text-(--explorer-navy) truncate">{job.salary}</span>
            </span>
          )}
        </span>
      </span>

      <span className="shrink-0 flex items-center gap-1 text-[11.5px] text-(--explorer-muted)">
        <Clock size={11} className="hidden sm:block shrink-0" aria-hidden="true" />
        {job.postedDaysAgo === 0 ? 'Today' : `${job.postedDaysAgo}d ago`}
      </span>

      <ArrowRight
        size={15}
        className="hidden sm:block shrink-0 text-(--explorer-teal) opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 motion-safe:transition-[opacity,transform] motion-safe:duration-200"
        aria-hidden="true"
      />
    </button>
  )
}

// Mirrors OpportunityCard's row shape so the list never jumps once real
// jobs replace it.
export function OpportunityCardSkeleton() {
  return (
    <div className="relative flex items-center gap-4 py-4 sm:py-4.5 px-3 sm:px-4 animate-pulse">
      <div className="w-9 h-9 rounded-xl bg-(--explorer-bg) shrink-0" />
      <div className="min-w-0 flex-1 flex flex-col gap-2 py-0.5">
        <div className="h-3 w-1/2 rounded bg-(--explorer-bg)" />
        <div className="h-2.5 w-2/5 rounded bg-(--explorer-bg)" />
      </div>
      <div className="hidden sm:block h-2.5 w-14 rounded bg-(--explorer-bg) shrink-0" />
    </div>
  )
}
