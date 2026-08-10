import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react'
import { useApp } from '../../context/AppContext'
import { cn } from '../../lib/utils'

export function DrawerHead({ title, subtitle, onClose }) {
  return (
    <div className="flex items-start justify-between gap-4 px-[26px] py-5 border-b border-border flex-shrink-0">
      <div>
        <div className="text-[19px] font-semibold tracking-tight">{title}</div>
        {subtitle && <div className="text-[13px] text-ink-secondary mt-1">{subtitle}</div>}
      </div>
      <button onClick={onClose} className="w-9 h-9 rounded-[10px] flex items-center justify-center text-ink-secondary hover:bg-surface-hover hover:text-ink transition-colors flex-shrink-0">
        <X size={16} />
      </button>
    </div>
  )
}

export function DrawerBody({ children, className }) {
  return <div className={cn('flex-1 p-[26px] overflow-y-auto', className)}>{children}</div>
}

export function DrawerFoot({ children }) {
  return <div className="px-[26px] py-4 border-t border-border flex justify-end gap-2.5 flex-shrink-0">{children}</div>
}

export default function DrawerRoot() {
  const { sidePanel, closeSidePanel } = useApp()

  return createPortal(
    <AnimatePresence>
      {sidePanel && (
        <motion.div
          className="fixed inset-0 bg-navy-950/50 backdrop-blur-[2px] z-[200] flex justify-end"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          onClick={(e) => e.target === e.currentTarget && closeSidePanel()}
        >
          <motion.div
            className="bg-surface shadow-lg border-l border-border h-full flex flex-col w-full"
            style={{ maxWidth: sidePanel.width }}
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%', transition: { duration: 0.2, ease: [0.4, 0, 1, 1] } }}
            transition={{ type: 'spring', stiffness: 380, damping: 38 }}
          >
            {sidePanel.content}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  )
}
