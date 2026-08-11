import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react'
import { X } from 'lucide-react'
import { cn } from '../../lib/utils'

const widths = { sm: 'max-w-[420px]', md: 'max-w-[520px]', lg: 'max-w-[680px]', xl: 'max-w-[860px]' }

export default function Modal({ open, onClose, title, subtitle, children, footer, size = 'md' }) {
  return (
    <Dialog open={open} onClose={onClose} className="relative z-[100]">
      <DialogBackdrop transition className="fixed inset-0 bg-navy-950/45 backdrop-blur-[2px] transition duration-200 ease-out data-[closed]:opacity-0" />
      <div className="fixed inset-0 flex items-center justify-center p-4 overflow-y-auto">
        <DialogPanel
          transition
          className={cn(
            'w-full bg-surface border border-border rounded-2xl shadow-lg transition duration-200 ease-out data-[closed]:opacity-0 data-[closed]:scale-95 my-8',
            widths[size]
          )}
        >
          {title && (
            <div className="flex items-start justify-between gap-4 px-6 py-5 border-b border-border">
              <div>
                <DialogTitle className="text-[15.5px] font-semibold tracking-tight">{title}</DialogTitle>
                {subtitle && <p className="text-[12.5px] text-ink-secondary mt-1">{subtitle}</p>}
              </div>
              <button onClick={onClose} className="w-8 h-8 rounded-lg flex items-center justify-center text-ink-tertiary hover:bg-surface-hover hover:text-ink flex-shrink-0">
                <X size={17} />
              </button>
            </div>
          )}
          <div className="px-6 py-5 max-h-[70vh] overflow-y-auto">{children}</div>
          {footer && <div className="flex items-center justify-end gap-2.5 px-6 py-4 border-t border-border bg-surface-sunken rounded-b-2xl">{footer}</div>}
        </DialogPanel>
      </div>
    </Dialog>
  )
}
