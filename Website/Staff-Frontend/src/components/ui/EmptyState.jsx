import { cn } from '../../lib/utils'

export default function EmptyState({ icon: Icon, tone = 'navy', title, body, action, className }) {
  const toneClasses = { navy: 'bg-navy-tint text-navy', red: 'bg-red-tint text-red', green: 'bg-green-tint text-green' }
  return (
    <div className={cn('flex flex-col items-center justify-center text-center px-6 py-14 gap-3.5', className)}>
      {Icon && (
        <div className={cn('w-[52px] h-[52px] rounded-2xl flex items-center justify-center', toneClasses[tone])}>
          <Icon size={24} />
        </div>
      )}
      {title && <div className="text-[15px] font-semibold max-w-[340px]">{title}</div>}
      {body && <div className="text-[13px] text-ink-secondary max-w-[360px]">{body}</div>}
      {action}
    </div>
  )
}
