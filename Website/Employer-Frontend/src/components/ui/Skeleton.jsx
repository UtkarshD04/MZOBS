import { cn } from '../../lib/utils'

export function Skeleton({ className }) {
  return <div className={cn('rounded-lg bg-[linear-gradient(100deg,var(--color-surface-sunken)_30%,var(--color-border)_50%,var(--color-surface-sunken)_70%)] bg-[length:220%_100%] animate-[shimmer_1.4s_ease-in-out_infinite]', className)} />
}

export function PageSkeleton() {
  return (
    <div>
      <div className="mb-6">
        <Skeleton className="w-56 h-6" />
        <Skeleton className="w-80 h-3.5 mt-2" />
      </div>
      <div className="grid grid-cols-3 gap-5 mb-4 max-md:grid-cols-1">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-surface border border-border rounded-xl p-[22px]">
            <Skeleton className="w-3/5 h-3" />
            <Skeleton className="w-2/5 h-6 mt-3" />
          </div>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-5 max-md:grid-cols-1">
        {[1, 2].map((i) => (
          <div key={i} className="bg-surface border border-border rounded-xl p-[22px]">
            <Skeleton className="w-full h-40" />
          </div>
        ))}
      </div>
    </div>
  )
}

export function TableSkeleton({ rows = 6, cols = 5 }) {
  return (
    <div className="rounded-xl border border-border overflow-hidden bg-surface">
      <div className="h-11 bg-surface-sunken border-b border-border" />
      {Array.from({ length: rows }).map((_, r) => (
        <div key={r} className="flex items-center gap-6 px-[18px] py-3.5 border-b border-border last:border-b-0">
          {Array.from({ length: cols }).map((_, c) => (
            <Skeleton key={c} className={cn('h-3.5', c === 0 ? 'w-40' : 'w-20')} />
          ))}
        </div>
      ))}
    </div>
  )
}

export function CardListSkeleton({ count = 4 }) {
  return (
    <div className="grid grid-cols-2 gap-4 max-lg:grid-cols-1">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="bg-surface border border-border rounded-xl p-5 flex gap-3.5">
          <Skeleton className="w-11 h-11 rounded-full flex-shrink-0" />
          <div className="flex-1">
            <Skeleton className="w-2/3 h-3.5" />
            <Skeleton className="w-1/2 h-3 mt-2.5" />
            <Skeleton className="w-1/3 h-3 mt-2.5" />
          </div>
        </div>
      ))}
    </div>
  )
}
