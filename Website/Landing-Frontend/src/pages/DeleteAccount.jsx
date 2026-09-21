import { Link } from 'react-router-dom'
import { Check, Trash2 } from 'lucide-react'
import Seo from '../components/Seo'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import Reveal from '../components/ui/Reveal'
import DeleteAccountForm from '../components/forms/DeleteAccountForm'

const APP_STEPS = [
  'Open the Mzobs app and sign in.',
  'Open the menu and go to Settings.',
  'Tap “Delete account” and confirm.',
]

const WEB_STEPS = [
  'Enter the mobile number registered with your Mzobs account.',
  'Verify it with the 6-digit OTP we send you.',
  'Confirm the request and select “Delete my account and data”.',
]

const DELETED = [
  'Your account and profile',
  'Your resume files',
  'Saved jobs and your application records',
  'Notifications, push notification tokens and preferences',
  'Any other account information we are not required to keep',
]

const KEPT = [
  'Payment and transaction records — kept for tax and accounting requirements',
  'Records needed for fraud prevention, security and dispute resolution',
  'Records we are legally required to retain',
  'Details an employer already holds because your application was shared with them — these are anonymized on our side, and we cannot delete copies held by the employer',
]

function StepList({ title, steps }) {
  return (
    <div>
      <h3 className="text-[13px] font-extrabold uppercase tracking-wider text-(--explorer-navy)">{title}</h3>
      <ol className="mt-3 space-y-3">
        {steps.map((step, i) => (
          <li key={step} className="flex items-start gap-3 text-[14px] text-(--explorer-navy)/85 leading-relaxed">
            <span className="mt-0.5 w-6 h-6 shrink-0 rounded-full bg-(--explorer-blue-surface) text-(--explorer-blue) text-[12px] font-bold flex items-center justify-center">
              {i + 1}
            </span>
            {step}
          </li>
        ))}
      </ol>
    </div>
  )
}

function DataList({ title, items, tone }) {
  const toneCls = tone === 'kept' ? 'bg-(--explorer-gold-surface) text-(--explorer-gold)' : 'bg-(--explorer-teal-surface) text-(--explorer-teal)'
  return (
    <div className="bg-white border border-(--explorer-border) rounded-xl p-5">
      <h3 className="text-[14.5px] font-extrabold text-(--explorer-navy)">{title}</h3>
      <ul className="mt-3 space-y-2.5">
        {items.map((item) => (
          <li key={item} className="flex items-start gap-2.5 text-[13.5px] text-(--explorer-muted) leading-relaxed">
            <span className={`mt-0.5 w-5 h-5 shrink-0 rounded-full flex items-center justify-center ${toneCls}`}>
              <Check size={12} strokeWidth={3} aria-hidden="true" />
            </span>
            {item}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default function DeleteAccount() {
  return (
    <div className="min-h-screen bg-(--explorer-bg) text-(--explorer-navy) font-sans antialiased selection:bg-(--explorer-teal-surface)">
      <Seo path="/delete-account" title="Delete Your Mzobs Account" />
      <Navbar />

      <section className="hero-atmosphere pt-28 pb-14 md:pt-36 md:pb-16">
        <Reveal direction="up" duration={0.7} className="max-w-3xl mx-auto px-6 text-center">
          <span className="inline-block px-3.5 py-1.5 rounded-full bg-white/80 border border-(--explorer-border) text-[12px] font-bold uppercase tracking-wider text-(--explorer-blue)">
            Mzobs · Account &amp; data
          </span>
          <h1 className="mt-5 text-[32px] sm:text-[42px] font-extrabold leading-[1.1] tracking-tight text-balance">Delete your Mzobs account</h1>
          <p className="mt-4 text-[16px] text-(--explorer-navy)/75 font-medium leading-relaxed max-w-2xl mx-auto">
            You can ask us to delete your Mzobs account and the personal data linked to it, from the app or from this page. Deletion is permanent and cannot
            be undone.
          </p>
        </Reveal>
      </section>

      <main className="max-w-5xl mx-auto px-6 pb-20 -mt-2 grid lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3 space-y-6">
          <div className="bg-white border border-(--explorer-border) rounded-xl p-6 sm:p-7 space-y-7">
            <h2 className="text-xl font-extrabold tracking-tight">How to request deletion</h2>
            <StepList title="In the Mzobs app" steps={APP_STEPS} />
            <StepList title="On this page" steps={WEB_STEPS} />
            <p className="text-[13.5px] text-(--explorer-muted) leading-relaxed">
              Deletion is carried out as soon as you confirm. Need help? Write to{' '}
              <a href="mailto:support@mzobs.com" className="text-(--explorer-blue) font-bold hover:underline">
                support@mzobs.com
              </a>
              .
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <DataList title="What we delete" items={DELETED} tone="deleted" />
            <DataList title="What we may keep" items={KEPT} tone="kept" />
          </div>
          <p className="text-[13px] text-(--explorer-muted) leading-relaxed">
            Where records must be kept, we limit access to them and use them only for the reason they are kept, for as long as the applicable law requires. See
            our{' '}
            <Link to="/privacy-policy" className="text-(--explorer-blue) font-bold hover:underline">
              Privacy Policy
            </Link>{' '}
            for details.
          </p>
        </div>

        <div className="lg:col-span-2">
          <div className="bg-white border border-(--explorer-border) rounded-xl shadow-[0_10px_28px_-18px_rgba(15,23,42,0.25)] p-6 sm:p-7 lg:sticky lg:top-24">
            <div className="flex items-center gap-2.5 mb-1">
              <span className="w-9 h-9 rounded-lg bg-red-50 text-red-600 flex items-center justify-center">
                <Trash2 size={17} />
              </span>
              <h2 className="text-lg font-extrabold tracking-tight">Delete from here</h2>
            </div>
            <p className="text-[13.5px] text-(--explorer-muted) mt-2 mb-6">
              Already have an account?{' '}
              <Link to="/employees/signin" className="font-bold text-(--explorer-blue) hover:underline">
                Sign in
              </Link>{' '}
              if you only want to manage it.
            </p>
            <DeleteAccountForm />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
