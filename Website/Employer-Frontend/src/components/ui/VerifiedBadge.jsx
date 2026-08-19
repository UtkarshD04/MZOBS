import { ShieldCheck, BadgeCheck } from 'lucide-react'
import { cn } from '../../lib/utils'

export function ResumeVerifiedBadge({ className }) {
  return (
    <span className={cn('inline-flex items-center gap-1 text-[11px] font-semibold text-green bg-green-tint pl-1.5 pr-2 py-[3px] rounded-full', className)}>
      <BadgeCheck size={12} /> Resume verified
    </span>
  )
}

export function IdentityVerifiedBadge({ className }) {
  return (
    <span className={cn('inline-flex items-center gap-1 text-[11px] font-semibold text-navy bg-navy-tint pl-1.5 pr-2 py-[3px] rounded-full', className)}>
      <ShieldCheck size={12} /> Identity verified
    </span>
  )
}
