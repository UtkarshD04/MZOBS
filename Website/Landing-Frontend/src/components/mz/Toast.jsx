import { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { CheckCircle2, Info, X } from 'lucide-react'

// Minimal toast system: `const toast = useToast(); toast('Saved', { tone: 'success' })`.
// Rendered in a polite live region so screen readers announce it. Outside a
// provider (SSR of a page that doesn't mount one) useToast is a no-op.
const ToastContext = createContext(() => {})

export function useToast() {
  return useContext(ToastContext)
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])
  const nextId = useRef(0)

  const dismiss = useCallback((id) => setToasts((list) => list.filter((t) => t.id !== id)), [])
  const push = useCallback(
    (message, { tone = 'success', duration = 3200 } = {}) => {
      const id = ++nextId.current
      setToasts((list) => [...list.slice(-2), { id, message, tone }])
      setTimeout(() => dismiss(id), duration)
    },
    [dismiss]
  )
  const value = useMemo(() => push, [push])

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div aria-live="polite" role="status" className="pointer-events-none fixed inset-x-0 bottom-4 z-[100] flex flex-col items-center gap-2 px-4">
        <AnimatePresence>
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              layout
              initial={{ opacity: 0, y: 16, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.97 }}
              transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
              className="pointer-events-auto flex max-w-sm items-center gap-2.5 rounded-full bg-mz-dark py-2.5 pl-4 pr-2.5 text-[14px] font-medium text-white shadow-mz-float"
            >
              {t.tone === 'success' ? <CheckCircle2 size={16} className="text-mz-accent" aria-hidden="true" /> : <Info size={16} className="text-mz-secondary" aria-hidden="true" />}
              <span>{t.message}</span>
              <button type="button" onClick={() => dismiss(t.id)} aria-label="Dismiss notification" className="flex h-6 w-6 items-center justify-center rounded-full text-white/60 hover:bg-white/10 hover:text-white">
                <X size={13} aria-hidden="true" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  )
}
