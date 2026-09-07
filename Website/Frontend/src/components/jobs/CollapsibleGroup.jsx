import { useId, useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '../../lib/utils'

export default function CollapsibleGroup({ title, defaultOpen = true, badge, children }) {
  const [open, setOpen] = useState(defaultOpen)
  const panelId = useId()

  return (
    <div className="border-b border-border py-4 first:pt-0 last:border-b-0 last:pb-0">
      <button type="button" onClick={() => setOpen((o) => !o)} aria-expanded={open} aria-controls={panelId} className="flex items-center justify-between w-full text-left cursor-pointer">
        <span className="text-[13px] font-semibold flex items-center gap-2">
          {title}
          {!!badge && <span className="text-[11px] font-semibold text-navy bg-navy-tint px-[7px] py-[1px] rounded-full">{badge}</span>}
        </span>
        <ChevronDown size={15} className={cn('text-ink-tertiary transition-transform duration-150 flex-shrink-0', open && 'rotate-180')} />
      </button>
      {open && (
        <div id={panelId} className="mt-3 flex flex-col gap-1.5">
          {children}
        </div>
      )}
    </div>
  )
}
