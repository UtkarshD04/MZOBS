import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react'
import { X } from 'lucide-react'
import { cn } from '../../lib/utils'

const widths = { sm: 'max-w-[420px]', md: 'max-w-[520px]', lg: 'max-w-[640px]', xl: 'max-w-[760px]' }

export default function Drawer({ open, onClose, title, subtitle, children, footer, size = 'md' }) {
  return (
    <Dialog open={open} onClose={onClose} className="relative z-[100]">
      <DialogBackdrop transition className="fixed inset-0 bg-navy-950/45 backdrop-blur-[2px] transition duration-300 ease-out data-[closed]:opacity-0" />
      <div className="fixed inset-0 flex justify-end">
        <DialogPanel
          transition
          className={cn(
            'w-full h-full bg-surface border-l border-border shadow-lg flex flex-col transition duration-300 ease-out-premium data-[closed]:translate-x-full',
            widths[size]
          )}
        >
          {title && (
            <div className="flex items-start justify-between gap-4 px-6 py-5 border-b border-border flex-shrink-0">
              <div>
                <DialogTitle className="text-[16px] font-semibold tracking-tight">{title}</DialogTitle>
                {subtitle && <p className="text-[12.5px] text-ink-secondary mt-1">{subtitle}</p>}
              </div>
              <button onClick={onClose} className="w-8 h-8 rounded-lg flex items-center justify-center text-ink-tertiary hover:bg-surface-hover hover:text-ink flex-shrink-0">
                <X size={17} />
              </button>
            </div>
          )}
          <div className="px-6 py-5 flex-1 overflow-y-auto">{children}</div>
          {footer && <div className="flex items-center justify-end gap-2.5 px-6 py-4 border-t border-border bg-surface-sunken flex-shrink-0">{footer}</div>}
        </DialogPanel>
      </div>
    </Dialog>
  )
}
