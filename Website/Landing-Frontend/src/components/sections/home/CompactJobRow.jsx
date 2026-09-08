import { ChevronRight } from 'lucide-react'
import { CompanyMark, NewBadge } from './jobCardPrimitives'

// One row in the "More openings" list beside the Featured job card — compact
// on purpose (this is a scan-in-seconds discovery surface, not another
// detail view), but the whole row is one clickable target to the job's own
// detail route, same as the featured card above it.
export default function CompactJobRow({ job, onOpen }) {
  const isRecent = job.postedDaysAgo != null && job.postedDaysAgo <= 1

  return (
    <button
      type="button"
      onClick={onOpen}
      className="explorer-tile-btn group w-full min-w-0 text-left flex items-center gap-3 p-3.5 rounded-xl border border-(--explorer-border) bg-white motion-safe:hover:-translate-y-px hover:border-(--explorer-teal-border) hover:bg-(--explorer-teal-surface)/60 transition-[background-color,border-color,transform] duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--explorer-teal)"
    >
      <span aria-hidden="true">
        <CompanyMark company={job.company} logo={job.logo} size="sm" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="flex items-center gap-1.5">
          <span className="font-bold text-[13.5px] text-(--explorer-navy) truncate">{job.title}</span>
          {isRecent && <NewBadge />}
        </span>
        <span className="block mt-0.5 text-[12px] text-(--explorer-muted) truncate">
          {job.company} · {job.location.split(',')[0]}
        </span>
        <span className="mt-1 flex items-center gap-x-2.5 text-[11.5px] text-(--explorer-muted)">
          {job.experience && <span className="truncate">{job.experience}</span>}
          {job.salary && <span className="font-semibold text-(--explorer-navy) truncate">{job.salary}</span>}
          <span className="ml-auto shrink-0">{job.postedDaysAgo === 0 ? 'Today' : `${job.postedDaysAgo}d ago`}</span>
        </span>
      </span>
      <ChevronRight
        size={15}
        className="shrink-0 text-(--explorer-teal) opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-[opacity,transform]"
        aria-hidden="true"
      />
    </button>
  )
}

// Mirrors CompactJobRow's shape (avatar, two text lines, meta row) so the
// list never jumps once real jobs replace it.
export function CompactJobRowSkeleton() {
  return (
    <div className="flex items-center gap-3 p-3.5 rounded-xl border border-(--explorer-border) bg-white animate-pulse">
      <div className="w-9 h-9 rounded-xl bg-(--explorer-bg) shrink-0" />
      <div className="min-w-0 flex-1 flex flex-col gap-2 py-0.5">
        <div className="h-3 w-3/4 rounded bg-(--explorer-bg)" />
        <div className="h-2.5 w-1/2 rounded bg-(--explorer-bg)" />
        <div className="h-2.5 w-1/3 rounded bg-(--explorer-bg)" />
      </div>
    </div>
  )
}
