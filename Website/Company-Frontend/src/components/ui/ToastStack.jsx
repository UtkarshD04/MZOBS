import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { CheckCircle2, AlertCircle } from 'lucide-react'
import { useApp } from '../../context/AppContext'

export default function ToastStack() {
  const { toasts } = useApp()

  return createPortal(
    <div className="fixed bottom-[22px] right-[22px] z-[400] flex flex-col gap-2.5 items-end">
      <AnimatePresence>
        {toasts.map((t) => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, y: 10, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, x: 10 }}
            transition={{ duration: 0.22 }}
            className="flex items-center gap-2.5 bg-navy-900 text-white px-4 py-3 rounded-xl shadow-lg text-[13px] font-medium min-w-[260px]"
          >
            {t.type === 'success' ? <CheckCircle2 size={17} className="text-green-dot flex-shrink-0" /> : <AlertCircle size={17} className="text-red-dot flex-shrink-0" />}
            <span>{t.message}</span>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>,
    document.body
  )
}
