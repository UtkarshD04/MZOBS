import { useEffect, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { X } from 'lucide-react'

// Festive greeting shown when the site opens during Dussehra. Rendered only
// after mount (like CookieConsent), so the prerendered HTML and hydration
// never include it. Shown once per browser session, and only inside the
// festival window below, so it retires itself with no follow-up deploy.
const SHOW_FROM = new Date(2026, 9, 20) // 20 Oct 2026 (Dussehra), local time
const SHOW_UNTIL = new Date(2026, 9, 23) // exclusive
const SEEN_KEY = 'mzobs-dussehra-2026-seen'

const SPARKS = Array.from({ length: 18 }, (_, i) => ({
  left: 4 + ((i * 53) % 92),
  size: 4 + (i % 4) * 2,
  delay: (i % 6) * 0.45,
  duration: 3.2 + (i % 5) * 0.6,
  color: ['#f59e0b', '#f97316', '#fbbf24', '#ef4444'][i % 4],
}))

function inWindow() {
  const now = new Date()
  return now >= SHOW_FROM && now < SHOW_UNTIL
}

export default function DussehraGreeting() {
  const [open, setOpen] = useState(false)
  const reduce = useReducedMotion()

  useEffect(() => {
    try {
      if (!inWindow() || sessionStorage.getItem(SEEN_KEY)) return
    } catch {
      if (!inWindow()) return
    }
    // Wait out the loader splash (index.html / entry-client.jsx) if it's showing.
    const t = setTimeout(() => setOpen(true), window.__dussehraSplash ? 2600 : 600)
    return () => clearTimeout(t)
  }, [])

  useEffect(() => {
    if (!open) return
    const onKey = (e) => e.key === 'Escape' && close()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  function close() {
    setOpen(false)
    try { sessionStorage.setItem(SEEN_KEY, '1') } catch { /* private mode */ }
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[10001] flex items-center justify-center bg-black/55 p-4 backdrop-blur-[2px]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={close}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="dussehra-title"
            onClick={(e) => e.stopPropagation()}
            initial={reduce ? false : { opacity: 0, scale: 0.9, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 220, damping: 22 }}
            className="relative w-full max-w-md overflow-hidden rounded-3xl text-center shadow-2xl"
            style={{ background: 'linear-gradient(180deg,#7c2d12 0%,#c2410c 45%,#f59e0b 100%)' }}
          >
            {/* rising embers */}
            {!reduce && SPARKS.map((s, i) => (
              <motion.span
                key={i}
                aria-hidden="true"
                className="pointer-events-none absolute bottom-0 rounded-full"
                style={{ left: `${s.left}%`, width: s.size, height: s.size, background: s.color }}
                animate={{ y: [0, -420], opacity: [0, 1, 0] }}
                transition={{ duration: s.duration, delay: s.delay, repeat: Infinity, ease: 'easeOut' }}
              />
            ))}

            <button
              type="button"
              onClick={close}
              aria-label="Close"
              className="absolute right-3 top-3 z-10 grid h-9 w-9 place-items-center rounded-full bg-white/20 text-white transition-colors hover:bg-white/30 focus-visible:outline-2 focus-visible:outline-white"
            >
              <X size={18} />
            </button>

            {/* marigold toran */}
            <svg viewBox="0 0 400 40" className="block w-full" aria-hidden="true">
              {Array.from({ length: 14 }, (_, i) => (
                <g key={i} transform={`translate(${14 + i * 28} ${i % 2 ? 22 : 16})`}>
                  <circle r="11" fill={i % 2 ? '#f59e0b' : '#f97316'} />
                  <circle r="6" fill="#fde68a" />
                </g>
              ))}
            </svg>

            <div className="relative px-6 pb-7 pt-2">
              {/* bow & arrow with burning sun */}
              <svg viewBox="0 0 160 120" className="mx-auto h-28 w-40" aria-hidden="true">
                <motion.circle
                  cx="80" cy="60" r="44" fill="#fde68a" opacity="0.22"
                  animate={reduce ? undefined : { r: [44, 52, 44] }}
                  transition={{ duration: 2.6, repeat: Infinity }}
                />
                <path d="M52 14 Q18 60 52 106" fill="none" stroke="#fff7ed" strokeWidth="5" strokeLinecap="round" />
                <line x1="52" y1="14" x2="52" y2="106" stroke="#fed7aa" strokeWidth="1.5" />
                <line x1="30" y1="60" x2="138" y2="60" stroke="#fff7ed" strokeWidth="4" strokeLinecap="round" />
                <path d="M138 60 l-14 -8 v16 z" fill="#fbbf24" />
                <path d="M30 60 l-8 -7 M30 60 l-8 7 M40 60 l-8 -7 M40 60 l-8 7" stroke="#fed7aa" strokeWidth="2.5" strokeLinecap="round" />
              </svg>

              <p className="text-[13px] font-semibold uppercase tracking-[0.22em] text-amber-100">
                विजयादशमी की शुभकामनाएँ
              </p>
              <h2 id="dussehra-title" className="mt-1 font-serif text-[34px] font-bold leading-tight text-white">
                Happy Dussehra!
              </h2>
              <p className="mx-auto mt-3 max-w-xs text-[14.5px] leading-relaxed text-orange-50">
                May good always win over evil, and may this festival of victory open doors to the career you deserve.
                Wishing you and your family joy and success &mdash; from all of us at MZOBS.
              </p>

              <button
                type="button"
                onClick={close}
                className="mt-6 rounded-full bg-white px-7 py-3 text-[14.5px] font-bold text-orange-800 shadow-lg transition-transform hover:scale-[1.03] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                Explore jobs
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
