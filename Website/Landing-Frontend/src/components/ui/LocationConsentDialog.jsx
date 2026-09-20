import { useEffect, useRef } from 'react'
import { MapPin, X } from 'lucide-react'

// Shown BEFORE the browser's own location prompt, so people know why we're
// asking and how the location is used. Closing it (Not now / Esc / backdrop)
// never triggers the browser prompt.
export default function LocationConsentDialog({ open, onAllow, onCancel }) {
  const allowRef = useRef(null)

  useEffect(() => {
    if (!open) return
    allowRef.current?.focus()
    const onKey = (e) => e.key === 'Escape' && onCancel()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onCancel])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-5" role="presentation">
      <div className="absolute inset-0 bg-(--explorer-navy)/45 backdrop-blur-[2px]" onClick={onCancel} aria-hidden="true" />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="location-consent-title"
        aria-describedby="location-consent-body"
        className="relative w-full max-w-md rounded-2xl bg-white p-6 sm:p-7 shadow-[0_30px_80px_-20px_rgba(16,42,67,0.5)] border border-(--explorer-border)"
      >
        <button
          type="button"
          onClick={onCancel}
          aria-label="Close"
          className="absolute top-4 right-4 flex items-center justify-center w-8 h-8 rounded-full bg-(--explorer-bg) text-(--explorer-navy)"
        >
          <X size={15} aria-hidden="true" />
        </button>
        <span className="flex items-center justify-center w-11 h-11 rounded-xl bg-(--explorer-blue-surface) text-(--explorer-blue)">
          <MapPin size={20} aria-hidden="true" />
        </span>
        <h2 id="location-consent-title" className="mt-4 text-[18px] font-black text-(--explorer-navy)">
          Allow location access?
        </h2>
        <p id="location-consent-body" className="mt-2 text-[14px] leading-relaxed text-(--explorer-navy)/75">
          Mzobs uses your location once, right now, to show the jobs nearest to you first. It isn&rsquo;t tracked in the background or stored on
          your profile, and you can turn it off anytime in your browser settings.
        </p>
        <div className="mt-6 flex flex-col-reverse sm:flex-row gap-2.5 sm:justify-end">
          <button
            type="button"
            onClick={onCancel}
            className="h-11 px-5 rounded-full border border-(--explorer-border) bg-white text-[13.5px] font-bold text-(--explorer-navy) hover:bg-(--explorer-bg) transition-colors"
          >
            Not now
          </button>
          <button
            ref={allowRef}
            type="button"
            onClick={onAllow}
            className="h-11 px-5 rounded-full text-white text-[13.5px] font-bold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--explorer-blue)"
            style={{ backgroundImage: 'var(--hero-cta-gradient)' }}
          >
            Allow location
          </button>
        </div>
      </div>
    </div>
  )
}
