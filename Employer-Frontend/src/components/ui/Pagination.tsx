import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '../../lib/utils'

export default function Pagination({ page, pageCount, onChange, total, pageSize }: { page: number; pageCount: number; onChange: (p: number) => void; total?: number; pageSize?: number }) {
  if (pageCount <= 1) return null
  const pages = Array.from({ length: pageCount }, (_, i) => i + 1).filter((p) => p === 1 || p === pageCount || Math.abs(p - page) <= 1)

  return (
    <div className="flex items-center justify-between gap-4 pt-4 flex-wrap">
      {total !== undefined && pageSize !== undefined && (
        <span className="text-[12.5px] text-ink-tertiary">
          Showing {(page - 1) * pageSize + 1}–{Math.min(page * pageSize, total)} of {total}
        </span>
      )}
      <div className="flex items-center gap-1 ml-auto">
        <button onClick={() => onChange(Math.max(1, page - 1))} disabled={page === 1} className="w-8 h-8 rounded-lg flex items-center justify-center text-ink-secondary hover:bg-surface-hover disabled:opacity-40 disabled:cursor-not-allowed">
          <ChevronLeft size={16} />
        </button>
        {pages.map((p, i) => (
          <span key={p} className="flex items-center">
            {i > 0 && pages[i - 1]! < p - 1 && <span className="px-1.5 text-ink-tertiary text-xs">…</span>}
            <button
              onClick={() => onChange(p)}
              className={cn('w-8 h-8 rounded-lg text-[12.5px] font-semibold flex items-center justify-center', p === page ? 'bg-navy text-white' : 'text-ink-secondary hover:bg-surface-hover')}
            >
              {p}
            </button>
          </span>
        ))}
        <button onClick={() => onChange(Math.min(pageCount, page + 1))} disabled={page === pageCount} className="w-8 h-8 rounded-lg flex items-center justify-center text-ink-secondary hover:bg-surface-hover disabled:opacity-40 disabled:cursor-not-allowed">
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  )
}
