import { cn } from '../../lib/utils'

export function Skeleton({ className }) {
  return (
    <div
      className={cn('rounded-lg bg-[linear-gradient(100deg,var(--color-surface-sunken)_30%,var(--color-border)_50%,var(--color-surface-sunken)_70%)] bg-[length:220%_100%] animate-[shimmer_1.4s_ease-in-out_infinite]', className)}
    />
  )
}

export function PageSkeleton() {
  return (
    <div>
      <div className="mb-6">
        <Skeleton className="w-56 h-6" />
        <Skeleton className="w-80 h-3.5 mt-2" />
      </div>
      <div className="grid grid-cols-3 gap-5 mb-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-surface border border-border rounded-xl p-[22px]">
            <Skeleton className="w-3/5 h-3" />
            <Skeleton className="w-2/5 h-6 mt-3" />
          </div>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-5">
        {[1, 2].map((i) => (
          <div key={i} className="bg-surface border border-border rounded-xl p-[22px]">
            <Skeleton className="w-full h-40" />
          </div>
        ))}
      </div>
    </div>
  )
}
