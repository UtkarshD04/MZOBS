import { useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react'
import EmployeePhoneAuthForm from './EmployeePhoneAuthForm'

// Sitewide "Sign in" popup — cult.fit-style: click Sign in from wherever you
// are on the site, verify your number right there, and land back on that
// same page instead of navigating away. The dedicated /employees/signin and
// /employees/signup pages still exist unchanged (the separate dashboard app
// does a real cross-origin navigation to them with a ?redirect= handoff),
// this is just a faster, in-place entry point for on-site clicks.
export default function EmployeeAuthModal({ open, onClose }) {
  useEffect(() => {
    if (!open) return
    function onKeyDown(e) {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [open, onClose])

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-(--jobs-navy)/40 backdrop-blur-sm"
            onClick={onClose}
            aria-hidden="true"
          />
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            role="dialog"
            aria-modal="true"
            aria-label="Sign in or create an Mzobs account"
            className="fixed inset-x-0 bottom-0 sm:bottom-auto sm:top-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 z-[101] w-full sm:max-w-md sm:rounded-[28px] rounded-t-[28px] bg-white border border-(--jobs-border) shadow-2xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto"
          >
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="absolute right-5 top-5 w-8 h-8 rounded-full flex items-center justify-center text-(--jobs-ink-soft) hover:text-(--jobs-navy) hover:bg-(--jobs-bg-subtle) transition-colors"
            >
              <X size={18} />
            </button>

            <div className="flex justify-center mb-5">
              <img src="/images/logo.png" alt="Mzobs" className="h-10 w-auto object-contain" />
            </div>

            <EmployeePhoneAuthForm onAuthComplete={onClose} />
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
