import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, CheckCircle2, Loader2 } from 'lucide-react'
import { FadeInLoad } from './employerMotion'
import EmployerSigninForm from '../../forms/EmployerSigninForm'
import ExplorerButton from '../../ui/ExplorerButton'
import { TRUSTED_LOGOS_DATA } from '../../../lib/content'
import { submitPlanEnquiry } from '../../../lib/employerAuth'
import { GST_RATE_PERCENT, PLANS, fmtINR } from '../../../lib/employerPricingPlan'

const STARTING_PRICE = Math.min(...PLANS.map((p) => p.baseAmount))

// Only facts the product backs up: unlimited posts + price (plan data) and
// "1 CV credit unlocks one candidate" (Backend candidateReveal/unlock).
const FACTS = [
  { value: 'Unlimited', label: 'job posts on every plan' },
  { value: fmtINR(STARTING_PRICE), label: `a year + ${GST_RATE_PERCENT}% GST, paid once` },
  { value: '1 credit', label: "unlocks one candidate's contact details" },
]

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const EMPTY = { name: '', companyName: '', phone: '', email: '' }

const fieldClass =
  'h-11 w-full rounded-lg border border-(--explorer-navy)/15 bg-white px-4 text-[14px] font-medium text-(--explorer-navy) outline-none transition placeholder:text-(--explorer-navy)/45 hover:border-(--explorer-blue)/50 focus:border-(--explorer-blue) focus:ring-[3px] focus:ring-(--explorer-blue)/15'

function LabeledInput({ id, label, error, ...props }) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-[12.5px] font-semibold text-(--explorer-navy)">{label}</label>
      <input id={id} aria-invalid={error ? 'true' : undefined} className={fieldClass} {...props} />
    </div>
  )
}

// "Request callback" — the same /plan-enquiries endpoint as the pricing
// section's "Customize plan" form; the Operations team calls back.
function CallbackForm() {
  const [form, setForm] = useState(EMPTY)
  const [status, setStatus] = useState('form') // form | sending | done
  const [error, setError] = useState('')
  const set = (key) => (e) =>
    setForm((f) => ({ ...f, [key]: key === 'phone' ? e.target.value.replace(/\D/g, '').slice(0, 10) : e.target.value }))
  const valid = form.name.trim() && form.companyName.trim() && form.phone.length === 10 && EMAIL_RE.test(form.email.trim())

  async function submit(e) {
    e.preventDefault()
    if (!valid || status === 'sending') return
    setStatus('sending')
    setError('')
    try {
      await submitPlanEnquiry(form)
      setStatus('done')
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.')
      setStatus('form')
    }
  }

  if (status === 'done') {
    return (
      <div role="status" className="flex flex-col items-center py-10 text-center">
        <span className="grid h-14 w-14 place-items-center rounded-full bg-(--explorer-blue-surface) text-(--explorer-blue)">
          <CheckCircle2 size={28} aria-hidden="true" />
        </span>
        <p className="mt-4 text-[18px] font-extrabold text-(--explorer-navy)">Thanks, we'll call you</p>
        <p className="mt-1.5 max-w-xs text-[14px] leading-relaxed text-(--explorer-muted)">The Mzobs team will reach out on the number you shared.</p>
        <button
          type="button"
          onClick={() => { setForm(EMPTY); setStatus('form') }}
          className="mt-5 min-h-11 rounded-md px-3 text-[13.5px] font-bold text-(--explorer-blue) hover:underline focus-visible:outline-2 focus-visible:outline-(--explorer-blue)"
        >
          Send another request
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={submit} noValidate className="space-y-3.5">
      <p className="text-[14px] leading-relaxed text-(--explorer-muted)">Not sure which plan fits? Leave your number and our team will call you.</p>
      <LabeledInput id="hero-name" label="Full name" autoComplete="name" value={form.name} onChange={set('name')} placeholder="Your name" />
      <LabeledInput id="hero-company" label="Company name" autoComplete="organization" value={form.companyName} onChange={set('companyName')} placeholder="Company you hire for" />
      <LabeledInput id="hero-phone" label="Mobile number" type="tel" inputMode="numeric" autoComplete="tel-national" value={form.phone} onChange={set('phone')} placeholder="10-digit mobile number" />
      <LabeledInput id="hero-email" label="Work email" type="email" autoComplete="email" value={form.email} onChange={set('email')} placeholder="you@company.com" />
      {error && <p role="alert" className="text-[12.5px] font-semibold text-red-600">{error}</p>}
      <button
        type="submit"
        disabled={!valid || status === 'sending'}
        className="explorer-btn-primary inline-flex h-11 w-full items-center justify-center gap-2 rounded-md bg-(--explorer-blue) text-[14.5px] font-bold text-white transition-colors hover:bg-(--explorer-blue-hover) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--explorer-blue) disabled:cursor-not-allowed disabled:opacity-50"
      >
        {status === 'sending' ? <><Loader2 size={16} className="animate-spin" aria-hidden="true" /> Sending…</> : 'Request callback'}
      </button>
    </form>
  )
}

const TABS = [
  { key: 'callback', label: 'Request callback' },
  { key: 'signin', label: 'Sign in' },
]

// Action card (Naukri-style): talk to the team or sign in without leaving the
// first screen. Both tabs use the real forms/endpoints.
function ActionCard() {
  const [active, setActive] = useState('callback')
  const tabRefs = useRef([])

  function onKeyDown(e, i) {
    const next = { ArrowRight: (i + 1) % TABS.length, ArrowLeft: (i + TABS.length - 1) % TABS.length, Home: 0, End: TABS.length - 1 }[e.key]
    if (next === undefined) return
    e.preventDefault()
    setActive(TABS[next].key)
    tabRefs.current[next]?.focus()
  }

  return (
    <div className="employer-hero-card w-full rounded-2xl bg-white shadow-[0_24px_60px_-28px_rgba(0,0,0,0.6)]">
      <div role="tablist" aria-label="Talk to us or sign in" className="grid grid-cols-2 border-b border-(--explorer-border)">
        {TABS.map((t, i) => (
          <button
            key={t.key}
            ref={(el) => (tabRefs.current[i] = el)}
            id={`hero-tab-${t.key}`}
            type="button"
            role="tab"
            aria-selected={active === t.key}
            aria-controls={`hero-panel-${t.key}`}
            tabIndex={active === t.key ? 0 : -1}
            onClick={() => setActive(t.key)}
            onKeyDown={(e) => onKeyDown(e, i)}
            className={`-mb-px min-h-14 border-b-2 px-3 text-[15px] font-bold transition-colors focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-(--explorer-blue) ${
              active === t.key ? 'border-(--explorer-blue) text-(--explorer-navy)' : 'border-transparent text-(--explorer-muted) hover:text-(--explorer-navy)'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div id={`hero-panel-${active}`} role="tabpanel" aria-labelledby={`hero-tab-${active}`} className="p-5 sm:p-7">
        {active === 'callback' ? (
          <CallbackForm />
        ) : (
          <>
            <EmployerSigninForm />
            <p className="mt-4 text-center text-[13.5px] text-(--explorer-muted)">
              New to Mzobs?{' '}
              <Link to="/employers/signup" className="inline-flex min-h-11 items-center font-bold text-(--explorer-blue) underline-offset-4 hover:underline">
                Create employer account
              </Link>
            </p>
          </>
        )}
      </div>
    </div>
  )
}

// Real client logos on a plain white band under the hero.
function LogoBand() {
  const { logos } = TRUSTED_LOGOS_DATA
  return (
    <div className="border-b border-(--explorer-border) bg-white">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 md:px-10">
        <p className="text-[14px] font-semibold text-(--explorer-muted)">Hiring on Mzobs today</p>
        <ul className="mt-5 grid grid-cols-2 gap-x-6 gap-y-5 sm:grid-cols-4 lg:grid-cols-8">
          {logos.map((logo) => (
            <li key={logo.name} className="flex h-12 items-center justify-center">
              <img src={logo.logo} alt={logo.name} loading="lazy" className="max-h-9 max-w-full object-contain" />
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default function EmployerHero() {
  return (
    <>
      <section id="home" aria-labelledby="employer-hero-heading" className="employer-hero bg-[#0a3a35] text-white">
        <div className="mx-auto max-w-7xl px-4 pt-28 pb-14 sm:px-6 md:px-10 md:pt-36 md:pb-20">
          <div className="grid items-start gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,440px)] lg:gap-20">
            <FadeInLoad delay={0.05} className="lg:pt-6">
              <h1 id="employer-hero-heading" className="max-w-xl text-balance text-[38px] font-extrabold leading-[1.08] tracking-[-0.03em] sm:text-[50px] lg:text-[56px]">
                Hire from resumes our team has already reviewed.
              </h1>

              <p className="mt-6 max-w-lg text-[17px] leading-[1.6] text-white/80 sm:text-[18px]">
                Post as many jobs as you need, search the Mzobs candidate database, and move every applicant forward from one dashboard.
              </p>

              <div className="mt-8 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:gap-6">
                <ExplorerButton to="/employers/signup" size="xl" className="bg-white! text-[#0a3a35]! hover:bg-[#e4f8f1]!">
                  Post a job
                </ExplorerButton>
                <Link
                  to="/employers#discover-talent"
                  className="inline-flex min-h-12 items-center justify-center gap-2 text-[15px] font-bold text-white underline decoration-white/40 decoration-2 underline-offset-[6px] transition-colors hover:decoration-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
                >
                  Search candidates <ArrowRight size={16} aria-hidden="true" />
                </Link>
              </div>

              <dl className="mt-10 grid max-w-xl grid-cols-3 divide-x divide-white/20 border-t border-white/20 pt-6 md:mt-12 md:pt-7">
                {FACTS.map((f, i) => (
                  <div key={f.value} className={i > 0 ? 'pl-3 sm:pl-5' : 'pr-3'}>
                    <dt className="text-[18px] font-extrabold tracking-[-0.02em] sm:text-[22px]">{f.value}</dt>
                    <dd className="mt-1 text-[12px] leading-snug text-white/70 sm:text-[13.5px]">{f.label}</dd>
                  </div>
                ))}
              </dl>
            </FadeInLoad>

            <FadeInLoad delay={0.15} className="min-w-0">
              <ActionCard />
            </FadeInLoad>
          </div>
        </div>
      </section>

      <LogoBand />
    </>
  )
}
