import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react'
import { useApp } from '../../context/AppContext'
import { cn } from '../../lib/utils'

export function ModalHead({ title, onClose }) {
  return (
    <div className="flex items-center justify-between px-[22px] py-5 border-b border-border flex-shrink-0">
      <span className="text-[19px] font-semibold tracking-tight">{title}</span>
      <button onClick={onClose} className="w-9 h-9 rounded-[10px] flex items-center justify-center text-ink-secondary hover:bg-surface-hover hover:text-ink transition-colors">
        <X size={16} />
      </button>
    </div>
  )
}

export function ModalBody({ children, className }) {
  return <div className={cn('p-[22px] overflow-y-auto', className)}>{children}</div>
}

export function ModalFoot({ children }) {
  return <div className="px-[22px] py-4 border-t border-border flex justify-end gap-2.5 flex-shrink-0">{children}</div>
}

export default function ModalRoot() {
  const { modal, closeModal } = useApp()

  return createPortal(
    <AnimatePresence>
      {modal && (
        <motion.div
          className="fixed inset-0 bg-navy-950/50 backdrop-blur-[2px] z-[200] flex items-center justify-center p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          onClick={(e) => e.target === e.currentTarget && closeModal()}
        >
          <motion.div
            className={cn('bg-surface rounded-2xl shadow-lg w-full max-h-[86vh] flex flex-col border border-border', modal.wide ? 'max-w-[760px]' : 'max-w-[520px]')}
            initial={{ opacity: 0, y: 14, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.98, transition: { duration: 0.15 } }}
            transition={{ type: 'spring', stiffness: 420, damping: 32 }}
          >
            {modal.content}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  )
}
