import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { cn } from '../../lib/utils'

export default function FloatingPanel({ open, onClose, align = 'right', width = 380, panelRef, children }) {
  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          ref={panelRef}
          initial={{ opacity: 0, y: -8, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -6, scale: 0.98, transition: { duration: 0.13 } }}
          transition={{ type: 'spring', stiffness: 480, damping: 34 }}
          style={{ transformOrigin: 'top right', width, maxWidth: 'calc(100vw - 40px)' }}
          className={cn('fixed top-[72px] z-[150] bg-surface border border-border rounded-xl shadow-lg max-h-[70vh] flex flex-col', align === 'right' ? 'right-5' : 'left-5')}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  )
}
