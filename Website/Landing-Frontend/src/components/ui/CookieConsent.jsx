import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'

// Consent banner for Google Analytics (public/gtag-init.js owns the Consent
// Mode v2 state and stores the choice). Accept and Reject are equally
// prominent. Rendered only after mount, so the server/prerendered HTML, and
// hydration, never include it. Also reports route-change page views.
export const OPEN_COOKIE_SETTINGS_EVENT = 'mzobs-open-cookie-settings'

const btn = 'rounded-full px-5 py-2.5 text-[14px] font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-mz-primary'

export default function CookieConsent() {
  const [open, setOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    if (window.mzobsAnalytics?.getChoice() === null) setOpen(true)
    const reopen = () => setOpen(true)
    window.addEventListener(OPEN_COOKIE_SETTINGS_EVENT, reopen)
    return () => window.removeEventListener(OPEN_COOKIE_SETTINGS_EVENT, reopen)
  }, [])

  // Every route change, including the first one, is one page_view.
  useEffect(() => {
    // Wait a moment so <Seo> has set document.title for the new route.
    const t = setTimeout(() => window.mzobsAnalytics?.pageView(document.title), 50)
    return () => clearTimeout(t)
  }, [location.pathname])

  if (!open) return null

  const choose = (analytics) => {
    window.mzobsAnalytics?.setChoice(analytics)
    setOpen(false)
  }

  return (
    <div
      role="dialog"
      aria-modal="false"
      aria-labelledby="cookie-consent-title"
      className="fixed inset-x-3 bottom-3 z-[10000] mx-auto max-w-3xl rounded-2xl border border-mz-line bg-white p-5 shadow-2xl sm:inset-x-6 sm:bottom-6"
    >
      <h2 id="cookie-consent-title" className="text-[15px] font-bold text-mz-ink">Your privacy choice</h2>
      <p className="mt-1.5 text-[13.5px] leading-relaxed text-mz-muted">
        We&rsquo;d like to use Google Analytics cookies to understand how the site is used and improve it. They are
        optional and stay off until you accept. We don&rsquo;t use advertising cookies, and we don&rsquo;t send your name,
        email or phone number to Google. You can change this any time from &ldquo;Cookie settings&rdquo; in the footer.
        See our <Link to="/privacy-policy" className="font-semibold text-mz-primary-strong underline">Privacy Policy</Link>.
      </p>
      <div className="mt-4 flex flex-col gap-2.5 sm:flex-row sm:justify-end">
        <button type="button" onClick={() => choose(false)} className={`${btn} border border-mz-line bg-white text-mz-ink hover:bg-mz-bg`}>
          Reject analytics
        </button>
        <button type="button" onClick={() => choose(true)} className={`${btn} bg-mz-primary text-white hover:bg-mz-primary-strong`}>
          Accept analytics
        </button>
      </div>
    </div>
  )
}
