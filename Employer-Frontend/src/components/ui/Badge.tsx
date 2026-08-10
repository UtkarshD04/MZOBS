import type { ReactNode } from 'react'
import { cn } from '../../lib/utils'

export type Tone = 'navy' | 'gold' | 'green' | 'red' | 'gray' | 'violet' | 'teal' | 'amber'

const tones: Record<Tone, string> = {
  navy: 'bg-navy-tint text-navy',
  gold: 'bg-gold-tint text-gold-strong',
  green: 'bg-green-tint text-green',
  red: 'bg-red-tint text-red',
  gray: 'bg-gray-tint text-ink-secondary',
  violet: 'bg-violet-tint text-violet',
  teal: 'bg-teal-tint text-teal',
  amber: 'bg-amber-tint text-amber',
}
const dotTones: Record<Tone, string> = {
  navy: 'bg-navy',
  gold: 'bg-gold-dot',
  green: 'bg-green-dot',
  red: 'bg-red-dot',
  gray: 'bg-gray-dot',
  violet: 'bg-violet-dot',
  teal: 'bg-teal-dot',
  amber: 'bg-amber-dot',
}

interface BadgeProps {
  tone?: Tone
  dot?: boolean
  className?: string
  children?: ReactNode
  icon?: ReactNode
}

export default function Badge({ tone = 'gray', dot = true, className, children, icon }: BadgeProps) {
  return (
    <span className={cn('inline-flex items-center gap-[5px] text-[11.5px] font-semibold leading-[1.6] pl-2 pr-[9px] py-[3px] rounded-full whitespace-nowrap', tones[tone], className)}>
      {icon}
      {dot && <span className={cn('w-1.5 h-1.5 rounded-full flex-shrink-0', dotTones[tone])} />}
      {children}
    </span>
  )
}
