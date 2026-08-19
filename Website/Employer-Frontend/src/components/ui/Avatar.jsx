import { cn } from '../../lib/utils'

const sizes = {
  sm: 'w-7 h-7 text-[11px]',
  md: 'w-11 h-11 text-[16px]',
  lg: 'w-16 h-16 text-[22px]',
  default: 'w-[34px] h-[34px] text-[12.5px]',
}

export default function Avatar({ initials, size = 'default', gold, className }) {
  return (
    <div className={cn('rounded-full flex items-center justify-center flex-shrink-0 font-bold text-white', gold ? 'bg-gold-dot' : 'bg-gradient-to-br from-navy-700 to-navy', sizes[size], className)}>
      {initials}
    </div>
  )
}

const logoSizes = {
  md: 'w-11 h-11 rounded-[11px] text-sm',
  sm: 'w-[26px] h-[26px] rounded-lg text-[10px]',
  lg: 'w-16 h-16 rounded-2xl text-lg',
}

const logoTones = {
  navy: 'bg-navy-tint text-navy',
  violet: 'bg-violet-tint text-violet',
  teal: 'bg-teal-tint text-teal',
  amber: 'bg-amber-tint text-amber',
  green: 'bg-green-tint text-green',
  gray: 'bg-gray-tint text-ink-secondary',
}

export function CompanyLogo({ initials, size = 'md', tone = 'navy', className }) {
  return <div className={cn('flex items-center justify-center font-bold flex-shrink-0', logoTones[tone], logoSizes[size], className)}>{initials}</div>
}
