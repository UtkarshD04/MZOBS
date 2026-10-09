import { LifeBuoy, LogOut, RotateCw, ShieldCheck } from 'lucide-react'
import { Logo } from './TopNav'
import { Button } from './ui'
import GstVerification from './GstVerification'
import { logout } from '../services/liveApi'

// Shown instead of the whole recruiter workspace until the company's
// mandatory GST verification is VERIFIED (App.jsx). The server enforces the
// same rule on every API call (Backend middleware/requireGstVerified.js), so
// this screen is the friendly face of it, not the protection itself.
export default function GstGate({ company, onRefresh }) {
  const status = company?.gstVerification?.status ?? 'NOT_SUBMITTED'
  const signOut = () => {
    if (!window.confirm('Sign out of Mzobs Talent?')) return
    logout()
    window.dispatchEvent(new Event('mzt-signed-out'))
  }
  return (
    <div className="min-h-screen bg-bg">
      <header className="flex items-center justify-between border-b border-line bg-white px-4 py-3 lg:px-6">
        <Logo />
        <Button size="sm" variant="ghost" icon={LogOut} onClick={signOut}>Sign out</Button>
      </header>
      <main className="mx-auto max-w-[640px] px-4 py-8 lg:py-12">
        <h1 className="flex items-center gap-2 text-[26px] font-extrabold tracking-[-0.03em] text-ink">
          <ShieldCheck className="text-accent" /> Verify your company
        </h1>
        <p className="mt-1 text-[14px] text-muted">
          {status === 'UNDER_REVIEW'
            ? `${company?.name ?? 'Your company'} is waiting for a quick check by the Mzobs team. Your workspace unlocks as soon as it’s approved.`
            : `Every employer on Mzobs is verified against the GST registry. Your workspace — posting jobs, searching candidates and more — unlocks once ${company?.name ?? 'your company'}’s GSTIN is verified.`}
        </p>
        <div className="mt-6">
          <GstVerification />
        </div>
        <div className="mt-4 flex flex-wrap items-center gap-2">
          {['PENDING', 'UNDER_REVIEW'].includes(status) && <Button size="sm" icon={RotateCw} onClick={onRefresh}>Check status</Button>}
          <a href="mailto:hello@mzobs.com" className="inline-flex items-center gap-1.5 text-[13px] font-medium text-accent hover:underline"><LifeBuoy size={14} /> Need help? hello@mzobs.com</a>
        </div>
      </main>
    </div>
  )
}
