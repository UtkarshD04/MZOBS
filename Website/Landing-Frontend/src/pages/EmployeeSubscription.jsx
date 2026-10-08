import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Check, ChevronDown, Minus, Loader2, RotateCw, ShieldCheck, CalendarClock, ExternalLink, Lock, Sparkles, UserRound, X } from 'lucide-react'
import Seo from '../components/Seo'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import { Container } from '../components/mz/primitives'
import { useToast } from '../components/mz/Toast'
import CouponBox from '../components/ui/CouponBox'
import { getEmployeeSession, onEmployeeSessionChange } from '../lib/employeeSession'
import { getEmployeeProfile } from '../lib/employeeProfile'
import { fetchApplicationCount } from '../lib/employeeApi'
import { fetchPlan, fetchServiceRequests, requestService, cancelServiceRequest } from '../lib/premium'
import { createSubscriptionOrder, verifySubscriptionPayment, confirmMockSubscriptionPayment, previewSubscriptionCoupon } from '../lib/employeeSubscription'
import { openRazorpayCheckout, loadRazorpay } from '../lib/razorpay'

// Premium is a single ₹499 one-time payment; shown even if the plan API still returns an older price.
const PREMIUM_PRICE = 499

const SIGN_IN_TO = `/employees/signin?next=${encodeURIComponent('/employees/subscription')}`
const tealBtn =
  'mz-btn-teal inline-flex h-11 items-center justify-center gap-2 rounded-[10px] bg-mz-primary px-5 text-[14.5px] font-semibold text-white transition-colors hover:bg-mz-primary-strong focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-mz-primary disabled:opacity-60'
const outlineBtn =
  'inline-flex h-11 items-center justify-center gap-2 rounded-[10px] border border-mz-line-strong bg-white px-5 text-[14.5px] font-semibold text-mz-ink transition-colors hover:border-mz-primary hover:text-mz-primary-strong'

const SERVICE_CATEGORIES = [
  { key: 'resume', label: 'Resume & profile' },
  { key: 'interview', label: 'Interview preparation' },
  { key: 'skills', label: 'Skills' },
  { key: 'career', label: 'Career planning' },
  { key: 'coaching', label: 'Coaching & guidance' },
]

// The Premium services pipeline, as the candidate sees it.
const PIPELINE = [
  { key: 'requested', label: 'Requested' },
  { key: 'scheduled', label: 'Scheduled' },
  { key: 'in_progress', label: 'In progress' },
  { key: 'delivered', label: 'Delivered' },
]
const STAGE_INDEX = { requested: 0, scheduled: 1, in_progress: 2, delivered: 3 }
const OPEN = ['requested', 'scheduled', 'in_progress']
const dateTimeFmt = new Intl.DateTimeFormat('en-IN', { weekday: 'short', day: 'numeric', month: 'short', hour: 'numeric', minute: '2-digit' })
const dateFmt = new Intl.DateTimeFormat('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })

// --- data -------------------------------------------------------------------

function useSession() {
  const [session, setSession] = useState(undefined) // undefined = not read yet
  useEffect(() => {
    setSession(getEmployeeSession())
    return onEmployeeSessionChange(() => setSession(getEmployeeSession()))
  }, [])
  return session
}

// --- small pieces ------------------------------------------------------------

function Cell({ value, premium }) {
  if (value === true) return <Check size={17} className={premium ? 'text-mz-primary' : 'text-mz-ink-2'} aria-label="Included" role="img" />
  if (value === false) return <Minus size={17} className="text-mz-line-strong" aria-label="Not included" role="img" />
  return <span className={premium ? 'font-medium text-mz-ink' : 'text-mz-ink-2'}>{value}</span>
}

function Price({ amount, original }) {
  return (
    <p className="flex items-baseline gap-2">
      {original != null && original !== amount && <span className="text-[16px] text-mz-muted line-through">₹{original}</span>}
      <span className="text-[34px] font-bold tracking-[-0.02em] text-mz-ink">₹{amount}</span>
    </p>
  )
}

// --- plan cards --------------------------------------------------------------

function PlanCards({ plan, session, isPaid, paidOn, appCount, payment }) {
  const signedIn = Boolean(session?.token)
  const limit = plan.basic.applicationLimit
  const fee = PREMIUM_PRICE
  const finalFee = payment.coupon?.finalAmount ?? fee

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {/* Basic */}
      <section aria-labelledby="plan-basic" className="flex flex-col rounded-[14px] border border-mz-line bg-white p-5 sm:p-6">
        <div className="flex items-center justify-between gap-2">
          <h2 id="plan-basic" className="text-[17px] font-bold text-mz-ink">{plan.basic.name}</h2>
          {signedIn && !isPaid && <span className="rounded-full bg-mz-bg px-2.5 py-1 text-[12px] font-semibold text-mz-ink-2 ring-1 ring-mz-line">Your plan</span>}
        </div>
        <div className="mt-3">
          <Price amount={0} />
          <p className="text-[13px] text-mz-muted">Free, no card needed</p>
        </div>
        <ul className="mt-4 flex-1 space-y-2 text-[14px] text-mz-ink-2">
          {['Browse every job with no limits', `Apply to your first ${limit} jobs`, 'Create your profile and upload your resume', 'Get basic job matching and application tracking'].map((t) => (
            <li key={t} className="flex gap-2">
              <Check size={16} className="mt-0.5 shrink-0 text-mz-ink-2" aria-hidden="true" />
              {t}
            </li>
          ))}
        </ul>
        {signedIn && !isPaid && appCount != null && (
          <div className="mt-5">
            <div className="flex justify-between text-[12.5px] text-mz-muted">
              <span>Applications used</span>
              <span className="font-semibold tabular-nums text-mz-ink">
                {Math.min(appCount, limit)} of {limit}
              </span>
            </div>
            <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-mz-bg ring-1 ring-mz-line" aria-hidden="true">
              <div className={`h-full rounded-full ${appCount >= limit ? 'bg-[#B42318]' : 'bg-mz-primary'}`} style={{ width: `${Math.min(100, (appCount / limit) * 100)}%` }} />
            </div>
            {appCount >= limit && <p className="mt-1.5 text-[12.5px] text-[#B42318]">You’ve used every free application. Premium removes the limit.</p>}
          </div>
        )}
        {!signedIn && (
          <Link to="/employees/signup" className={`${outlineBtn} mt-5`}>
            Create free account
          </Link>
        )}
      </section>

      {/* Premium */}
      <section aria-labelledby="plan-premium" className="flex flex-col rounded-[14px] border-2 border-mz-primary bg-white p-5 sm:p-6">
        <div className="flex items-center justify-between gap-2">
          <h2 id="plan-premium" className="flex items-center gap-1.5 text-[17px] font-bold text-mz-ink">
            <Sparkles size={17} className="text-mz-primary" aria-hidden="true" />
            {plan.premium.name}
          </h2>
          {isPaid ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-mz-primary-tint px-2.5 py-1 text-[12px] font-semibold text-mz-primary-strong">
              <ShieldCheck size={13} aria-hidden="true" /> Active
            </span>
          ) : (
            <span className="rounded-full bg-mz-primary-tint px-2.5 py-1 text-[12px] font-semibold text-mz-primary-strong">One-time payment</span>
          )}
        </div>
        <div className="mt-3">
          <Price amount={isPaid ? fee : finalFee} original={!isPaid && payment.coupon ? fee : null} />
          <p className="text-[13px] text-mz-muted">{isPaid ? `Paid once${paidOn ? ` on ${dateFmt.format(new Date(paidOn))}` : ''} · valid for life` : 'Paid once, valid for life. No renewals.'}</p>
        </div>
        <ul className="mt-4 flex-1 space-y-2 text-[14px] text-mz-ink">
          {['Get unlimited job applications', 'Get your CV enhanced by an expert, plus an ATS score', 'Attend live technical, behavioral, and HR mock interviews', 'Experience one to one HR and career coaching with a personal roadmap', 'Gain premium visibility to recruiters'].map((t) => (
            <li key={t} className="flex gap-2">
              <Check size={16} className="mt-0.5 shrink-0 text-mz-primary" aria-hidden="true" />
              {t}
            </li>
          ))}
        </ul>

        {!isPaid &&
          (signedIn ? (
            <div className="mt-5">
              <button type="button" onClick={payment.pay} disabled={payment.paying} className={`${tealBtn} w-full`}>
                {payment.paying && <Loader2 size={16} className="animate-spin" aria-hidden="true" />}
                {payment.paying ? 'Processing…' : `Upgrade for ₹${finalFee}`}
              </button>
              <div className="mt-3">
                <CouponBox onPreview={previewSubscriptionCoupon} applied={payment.coupon} onApply={payment.setCoupon} onRemove={() => payment.setCoupon(null)} />
              </div>
              {payment.error && <p className="mt-2 text-[13px] text-[#B42318]">{payment.error}</p>}
            </div>
          ) : (
            <Link to={SIGN_IN_TO} className={`${tealBtn} mt-5`}>
              Sign in to upgrade
            </Link>
          ))}
        {isPaid && (
          <a href="#premium-services" className={`${outlineBtn} mt-5`}>
            Request a Premium service
          </a>
        )}
      </section>
    </div>
  )
}

// --- services pipeline -------------------------------------------------------

function HowItWorks() {
  const steps = [
    ['Request', 'Pick a service and tell us what you need.'],
    ['We schedule', 'The Mzobs team confirms a time or starts the work.'],
    ['Session / work', 'A live session, or our experts work on your CV or plan.'],
    ['Delivered', 'Feedback, files and next steps land in your account.'],
  ]
  return (
    <ol className="grid gap-3 sm:grid-cols-4">
      {steps.map(([title, body], i) => (
        <li key={title} className="rounded-[12px] border border-mz-line bg-white p-4">
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-mz-primary-tint text-[13px] font-bold text-mz-primary-strong">{i + 1}</span>
          <p className="mt-2.5 text-[14.5px] font-semibold text-mz-ink">{title}</p>
          <p className="mt-0.5 text-[13px] leading-relaxed text-mz-muted">{body}</p>
        </li>
      ))}
    </ol>
  )
}

function StageLine({ request }) {
  const cancelled = request.status === 'cancelled'
  const reached = Math.max(0, ...[request.status, ...(request.statusHistory ?? []).map((h) => h.status)].map((s) => STAGE_INDEX[s] ?? 0))
  return (
    <ol className="mt-3 flex items-center" aria-label="Request progress">
      {PIPELINE.map((stage, i) => {
        const done = i <= reached
        const current = !cancelled && i === reached
        return (
          <li key={stage.key} className="flex min-w-0 flex-1 items-center last:flex-none">
            <span className="flex flex-col items-center gap-1">
              <span
                className={`flex h-5 w-5 items-center justify-center rounded-full text-white ${done ? (cancelled ? 'bg-[#9AA3AF]' : 'bg-mz-primary') : 'bg-white ring-2 ring-mz-line'} ${current ? 'ring-4 ring-mz-primary/20' : ''}`}
                aria-hidden="true"
              >
                {done && <Check size={11} strokeWidth={3.5} />}
              </span>
              <span className={`whitespace-nowrap text-[11px] ${current ? 'font-semibold text-mz-ink' : 'text-mz-muted'}`}>{stage.label}</span>
            </span>
            {i < PIPELINE.length - 1 && <span className={`mx-1 mb-4 h-0.5 flex-1 rounded ${i < reached ? (cancelled ? 'bg-[#C9CED6]' : 'bg-mz-primary') : 'bg-mz-line'}`} aria-hidden="true" />}
          </li>
        )
      })}
    </ol>
  )
}

function RequestCard({ request, service, onCancel, cancelling }) {
  const label = service?.label ?? request.service
  return (
    <li className="rounded-[12px] border border-mz-line bg-white p-4 sm:p-5">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div className="min-w-0">
          <h4 className="text-[15px] font-semibold text-mz-ink">{label}</h4>
          <p className="text-[12.5px] text-mz-muted">
            Requested {dateFmt.format(new Date(request.createdAt))}
            {request.assignedTo ? ` · with ${request.assignedTo}` : ''}
          </p>
        </div>
        {request.status === 'cancelled' ? (
          <span className="rounded-full bg-[#F3F4F6] px-2.5 py-1 text-[12px] font-semibold text-[#5B6472]">Cancelled</span>
        ) : request.status === 'delivered' ? (
          <span className="rounded-full bg-[#E6F6EC] px-2.5 py-1 text-[12px] font-semibold text-[#1E7B45]">Delivered</span>
        ) : null}
      </div>

      <StageLine request={request} />

      {(request.scheduledFor || request.candidateMessage || request.deliverableLink) && (
        <div className="mt-3 space-y-2 rounded-[10px] bg-mz-bg p-3 text-[13.5px]">
          {request.scheduledFor && request.status !== 'delivered' && request.status !== 'cancelled' && (
            <p className="flex flex-wrap items-center gap-x-2 gap-y-1 text-mz-ink">
              <CalendarClock size={15} className="text-mz-primary" aria-hidden="true" />
              {dateTimeFmt.format(new Date(request.scheduledFor))}
              {request.meetingLink && (
                <a href={request.meetingLink} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 font-semibold text-mz-primary-strong hover:underline">
                  Join <ExternalLink size={13} aria-hidden="true" />
                </a>
              )}
            </p>
          )}
          {request.candidateMessage && <p className="whitespace-pre-line leading-relaxed text-mz-ink-2">{request.candidateMessage}</p>}
          {request.deliverableLink && (
            <a href={request.deliverableLink} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 font-semibold text-mz-primary-strong hover:underline">
              Open your deliverable <ExternalLink size={13} aria-hidden="true" />
            </a>
          )}
        </div>
      )}

      {request.status === 'requested' && (
        <div className="mt-3 flex justify-end">
          <button type="button" disabled={cancelling} onClick={() => onCancel(request.id)} className="inline-flex items-center gap-1.5 rounded-[8px] px-2 py-1 text-[13px] font-semibold text-mz-muted hover:text-[#B42318] disabled:opacity-60">
            {cancelling && <Loader2 size={13} className="animate-spin" aria-hidden="true" />}
            Cancel request
          </button>
        </div>
      )}
    </li>
  )
}

function ServiceOption({ service, openRequest, locked, onRequest }) {
  const [open, setOpen] = useState(false)
  const [note, setNote] = useState('')
  const [preferredTime, setPreferredTime] = useState('')
  const [sending, setSending] = useState(false)
  const [error, setError] = useState('')

  async function submit(e) {
    e.preventDefault()
    setSending(true)
    setError('')
    try {
      await onRequest({ service: service.key, note, preferredTime })
      setOpen(false)
      setNote('')
      setPreferredTime('')
    } catch (err) {
      setError(err.message)
    } finally {
      setSending(false)
    }
  }

  return (
    <li className="rounded-[12px] border border-mz-line bg-white p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h4 className="text-[14.5px] font-semibold text-mz-ink">{service.label}</h4>
          <p className="mt-0.5 text-[13px] leading-relaxed text-mz-muted">{service.description}</p>
        </div>
        {locked ? (
          <Lock size={15} className="mt-1 shrink-0 text-mz-muted" aria-label="Premium only" role="img" />
        ) : openRequest ? (
          <span className="shrink-0 rounded-full bg-mz-primary-tint px-2.5 py-1 text-[12px] font-semibold text-mz-primary-strong">Requested</span>
        ) : (
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            className="shrink-0 rounded-[8px] border border-mz-line-strong px-3 py-1.5 text-[13px] font-semibold text-mz-ink hover:border-mz-primary hover:text-mz-primary-strong"
          >
            {open ? 'Close' : 'Request'}
          </button>
        )}
      </div>
      {open && !locked && !openRequest && (
        <form onSubmit={submit} className="mt-3 space-y-2.5 border-t border-mz-line pt-3">
          <label className="block">
            <span className="text-[12.5px] font-semibold text-mz-ink-2">What should we focus on? (optional)</span>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              maxLength={1000}
              rows={3}
              placeholder="e.g. Target roles, companies, or anything you want help with"
              className="mt-1 w-full rounded-[8px] border border-mz-line bg-white px-3 py-2 text-[14px] text-mz-ink outline-none focus:border-mz-primary focus:ring-2 focus:ring-mz-primary/20"
            />
          </label>
          <label className="block">
            <span className="text-[12.5px] font-semibold text-mz-ink-2">Preferred time (optional)</span>
            <input
              value={preferredTime}
              onChange={(e) => setPreferredTime(e.target.value)}
              maxLength={200}
              placeholder="e.g. Weekday evenings after 6 pm"
              className="mt-1 h-10 w-full rounded-[8px] border border-mz-line bg-white px-3 text-[14px] text-mz-ink outline-none focus:border-mz-primary focus:ring-2 focus:ring-mz-primary/20"
            />
          </label>
          {error && <p className="text-[13px] text-[#B42318]">{error}</p>}
          <button type="submit" disabled={sending} className={`${tealBtn} h-10 text-[14px]`}>
            {sending && <Loader2 size={15} className="animate-spin" aria-hidden="true" />}
            Send request
          </button>
        </form>
      )}
    </li>
  )
}

function ServicesSection({ plan, session, isPaid, requests, onRequest, onCancel, cancellingId }) {
  const serviceByKey = useMemo(() => new Map(plan.services.map((s) => [s.key, s])), [plan.services])
  const openByService = useMemo(() => new Set((requests.data ?? []).filter((r) => OPEN.includes(r.status)).map((r) => r.service)), [requests.data])
  const [category, setCategory] = useState('resume')
  const shown = plan.services.filter((s) => s.category === category)

  return (
    <section id="premium-services" aria-labelledby="services-title" className="scroll-mt-24">
      <h2 id="services-title" className="text-[20px] font-bold tracking-[-0.015em] text-mz-ink sm:text-[22px]">Premium services</h2>
      <p className="mt-1 max-w-2xl text-[14px] text-mz-muted">
        Delivered by the Mzobs team, not a bot. Request a service and follow it here from request to delivery.
      </p>
      <div className="mt-4">
        <HowItWorks />
      </div>

      {isPaid && (
        <div className="mt-6">
          <h3 className="text-[16px] font-bold text-mz-ink">Your requests</h3>
          {requests.status === 'loading' ? (
            <div className="mt-3 space-y-2" aria-hidden="true">
              <div className="mz-skeleton h-20 rounded-[12px]" />
            </div>
          ) : requests.status === 'error' ? (
            <p className="mt-2 text-[14px] text-mz-muted">
              Your requests couldn’t be loaded.{' '}
              <button type="button" onClick={requests.retry} className="font-semibold text-mz-primary-strong hover:underline">
                Try again
              </button>
            </p>
          ) : requests.data.length === 0 ? (
            <p className="mt-2 text-[14px] text-mz-muted">No requests yet. Pick a service below to get started.</p>
          ) : (
            <ul className="mt-3 space-y-3">
              {requests.data.map((r) => (
                <RequestCard key={r.id} request={r} service={serviceByKey.get(r.service)} onCancel={onCancel} cancelling={cancellingId === r.id} />
              ))}
            </ul>
          )}
        </div>
      )}

      <div className="mt-6">
        <div className="flex flex-wrap items-end justify-between gap-2">
          <h3 className="text-[16px] font-bold text-mz-ink">{isPaid ? 'Request a service' : 'What Premium services include'}</h3>
          {!isPaid && (
            <p className="text-[13px] text-mz-muted">
              {session?.token ? 'Upgrade to request any of these.' : (
                <>
                  <Link to={SIGN_IN_TO} className="font-semibold text-mz-primary-strong hover:underline">Sign in</Link> and upgrade to request any of these.
                </>
              )}
            </p>
          )}
        </div>
        <div className="mz-scroll-x mz-fade-end -mx-4 mt-3 overflow-x-auto px-4 sm:mx-0 sm:px-0">
          <div className="flex min-w-max gap-1.5 border-b border-mz-line" role="group" aria-label="Service categories">
            {SERVICE_CATEGORIES.map((c) => (
              <button
                key={c.key}
                type="button"
                onClick={() => setCategory(c.key)}
                aria-pressed={category === c.key}
                className={`-mb-px shrink-0 border-b-2 px-2.5 pb-2.5 pt-1 text-[13.5px] font-medium transition-colors ${
                  category === c.key ? 'border-mz-primary text-mz-primary-strong' : 'border-transparent text-mz-muted hover:text-mz-ink'
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>
        <ul className="mt-4 grid gap-3 md:grid-cols-2">
          {shown.map((s) => (
            <ServiceOption key={s.key} service={s} locked={!isPaid} openRequest={openByService.has(s.key)} onRequest={onRequest} />
          ))}
        </ul>
      </div>
    </section>
  )
}

// --- comparison table --------------------------------------------------------

function ComparisonGroup({ group, defaultOpen }) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="border-b border-mz-line last:border-b-0">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full items-center gap-2 bg-mz-bg px-4 py-3 text-left focus-visible:outline-2 focus-visible:outline-mz-primary sm:px-5"
      >
        <span className="text-[14.5px] font-semibold text-mz-ink">{group.label}</span>
        <span className="text-[12.5px] text-mz-muted">{group.features.length}</span>
        <ChevronDown size={16} className={`ml-auto text-mz-muted transition-transform ${open ? 'rotate-180' : ''}`} aria-hidden="true" />
      </button>
      {open && (
        <div role="rowgroup">
          {group.features.map((f) => (
            <div key={f.label} role="row" className="grid grid-cols-2 gap-x-4 gap-y-1 border-t border-mz-line px-4 py-3 text-[13.5px] sm:grid-cols-[1.1fr_1fr_1.4fr] sm:px-5">
              <div role="rowheader" className="col-span-2 font-medium text-mz-ink sm:col-span-1">
                {f.label}
              </div>
              <div role="cell">
                <span className="mr-1 text-[11.5px] font-semibold uppercase tracking-wide text-mz-muted sm:hidden">Basic</span>
                <Cell value={f.basic} />
              </div>
              <div role="cell">
                <span className="mr-1 text-[11.5px] font-semibold uppercase tracking-wide text-mz-primary-strong sm:hidden">Premium</span>
                <Cell value={f.premium} premium />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function ComparisonTable({ plan }) {
  const [expandAll, setExpandAll] = useState(0)
  return (
    <section aria-labelledby="compare-title">
      <div className="flex flex-wrap items-end justify-between gap-2">
        <div>
          <h2 id="compare-title" className="text-[20px] font-bold tracking-[-0.015em] text-mz-ink sm:text-[22px]">Compare plans</h2>
          <p className="mt-1 text-[14px] text-mz-muted">Everything in {plan.basic.name} and {plan.premium.name}, side by side.</p>
        </div>
        <button type="button" onClick={() => setExpandAll((n) => n + 1)} className="text-[13.5px] font-semibold text-mz-primary-strong hover:underline">
          Expand all
        </button>
      </div>
      <div role="table" aria-label="Plan comparison" className="mt-4 overflow-hidden rounded-[14px] border border-mz-line bg-white">
        <div role="row" className="hidden grid-cols-[1.1fr_1fr_1.4fr] gap-x-4 border-b border-mz-line px-5 py-3 text-[13px] font-semibold sm:grid">
          <div role="columnheader" className="text-mz-muted">Feature</div>
          <div role="columnheader" className="text-mz-ink">{plan.basic.name}</div>
          <div role="columnheader" className="text-mz-primary-strong">{plan.premium.name}</div>
        </div>
        {plan.groups.map((g, i) => (
          <ComparisonGroup key={`${g.key}-${expandAll}`} group={g} defaultOpen={expandAll > 0 || i < 2} />
        ))}
      </div>
    </section>
  )
}

// --- page ---------------------------------------------------------------------

// /employees/subscription — Mzobs Basic vs Premium. Public: anyone can compare
// plans; signed-in candidates can upgrade (one-time Razorpay payment, coupons
// supported) and Premium members request and track human-delivered services.
// Every plan detail comes from Backend's config/premiumPlan.js via
// GET /subscription/plan, so this page can't drift from what's enforced.
export default function EmployeeSubscription() {
  const toast = useToast()
  const session = useSession()
  const token = session?.token

  const [plan, setPlan] = useState({ status: 'loading', data: null })
  const [planRetry, setPlanRetry] = useState(0)
  const [profile, setProfile] = useState(null)
  const [profileLoading, setProfileLoading] = useState(false)
  const [appCount, setAppCount] = useState(null)
  const [requests, setRequests] = useState({ status: 'idle', data: [] })
  const [requestsRetry, setRequestsRetry] = useState(0)
  const [cancellingId, setCancellingId] = useState(null)

  const [paying, setPaying] = useState(false)
  const [payError, setPayError] = useState('')
  const [coupon, setCoupon] = useState(null)

  useEffect(() => {
    const controller = new AbortController()
    setPlan({ status: 'loading', data: null })
    fetchPlan({ signal: controller.signal })
      .then((data) => setPlan({ status: 'ready', data }))
      .catch((err) => err?.name !== 'AbortError' && setPlan({ status: 'error', data: null }))
    return () => controller.abort()
  }, [planRetry])

  const reloadProfile = useCallback(() => (token ? getEmployeeProfile(token).then(setProfile) : Promise.resolve()), [token])

  useEffect(() => {
    setProfile(null)
    setAppCount(null)
    if (!token) return
    // If the profile can't be read (e.g. an expired session) the page still
    // renders, just as for a signed-out visitor.
    setProfileLoading(true)
    reloadProfile()
      .catch(() => {})
      .finally(() => setProfileLoading(false))
    fetchApplicationCount(token).then(setAppCount).catch(() => {})
  }, [token, reloadProfile])

  const isPaid = profile?.subscription?.status === 'paid'

  useEffect(() => {
    if (!token || !isPaid) return
    const controller = new AbortController()
    setRequests((r) => ({ ...r, status: 'loading' }))
    fetchServiceRequests(token, { signal: controller.signal })
      .then((data) => setRequests({ status: 'ready', data }))
      .catch((err) => err?.name !== 'AbortError' && setRequests({ status: 'error', data: [] }))
    return () => controller.abort()
  }, [token, isPaid, requestsRetry])

  // Warm the checkout script for signed-in Basic members.
  useEffect(() => {
    if (token && profile && !isPaid) loadRazorpay().catch(() => {})
  }, [token, profile, isPaid])

  async function pay() {
    if (!token) return
    setPayError('')
    setPaying(true)
    try {
      const order = await createSubscriptionOrder(token, coupon?.code)
      if (order.mock) {
        await confirmMockSubscriptionPayment(token, order.orderId)
      } else {
        await loadRazorpay()
        const result = await openRazorpayCheckout(order)
        await verifySubscriptionPayment(token, {
          razorpay_order_id: result.razorpay_order_id,
          razorpay_payment_id: result.razorpay_payment_id,
          razorpay_signature: result.razorpay_signature,
        })
      }
      await reloadProfile()
      toast('Welcome to Mzobs Premium', { tone: 'success' })
    } catch (err) {
      setPayError(err.message || 'Payment failed. Please try again.')
    } finally {
      setPaying(false)
    }
  }

  async function handleRequest(input) {
    try {
      const created = await requestService(token, input)
      setRequests((r) => ({ status: 'ready', data: [created, ...r.data] }))
      toast('Request sent. The Mzobs team will be in touch.', { tone: 'success' })
    } catch (err) {
      if (err.code === 'PREMIUM_REQUIRED') reloadProfile().catch(() => {})
      if (err.code === 'ALREADY_REQUESTED') setRequestsRetry((n) => n + 1)
      throw err
    }
  }

  async function handleCancel(id) {
    setCancellingId(id)
    try {
      const updated = await cancelServiceRequest(token, id)
      setRequests((r) => ({ ...r, data: r.data.map((x) => (x.id === id ? updated : x)) }))
    } catch (err) {
      toast(err.message, { tone: 'info' })
      setRequestsRetry((n) => n + 1)
    } finally {
      setCancellingId(null)
    }
  }

  const waitingForProfile = Boolean(token) && profileLoading

  return (
    <div className="mz-home min-h-screen bg-mz-bg font-sans text-mz-ink antialiased">
      <Seo path="/employees/subscription" title="Mzobs Basic vs Premium | Mzobs" noindex />
      <Navbar />
      <main className="pb-14 pt-[88px] sm:pt-[96px]">
        <Container className="max-w-[1040px]">
          <header className="max-w-2xl">
            <h1 className="text-[26px] font-bold leading-tight tracking-[-0.02em] text-mz-ink sm:text-[32px]">Choose how you want to grow</h1>
            <p className="mt-2 text-[15px] leading-relaxed text-mz-muted">
              Start free with Mzobs Basic. Upgrade to Mzobs Premium to get unlimited applications and hands-on support from our team, from your CV to your final offer.
            </p>
          </header>

          {plan.status === 'loading' || waitingForProfile || session === undefined ? (
            <div className="mt-8 grid gap-4 md:grid-cols-2" aria-busy="true" aria-label="Loading plans">
              <div className="mz-skeleton h-80 rounded-[14px]" />
              <div className="mz-skeleton h-80 rounded-[14px]" />
            </div>
          ) : plan.status === 'error' ? (
            <div className="mt-8 flex flex-col items-center gap-2 rounded-[14px] border border-dashed border-mz-line-strong bg-white px-6 py-12 text-center">
              <p className="text-[15px] font-semibold text-mz-ink">Plans couldn’t be loaded</p>
              <p className="text-[14px] text-mz-muted">Check your connection and try again.</p>
              <button type="button" onClick={() => setPlanRetry((n) => n + 1)} className={`${tealBtn} mt-2 h-10 text-[14px]`}>
                <RotateCw size={14} aria-hidden="true" /> Retry
              </button>
            </div>
          ) : (
            <div className="mt-8 space-y-12">
              <PlanCards
                plan={plan.data}
                session={session}
                isPaid={isPaid}
                paidOn={profile?.subscription?.paidOn}
                appCount={appCount}
                payment={{ pay, paying, error: payError, coupon, setCoupon }}
              />

              <ServicesSection
                plan={plan.data}
                session={session}
                isPaid={isPaid}
                requests={{ ...requests, retry: () => setRequestsRetry((n) => n + 1) }}
                onRequest={handleRequest}
                onCancel={handleCancel}
                cancellingId={cancellingId}
              />

              <ComparisonTable plan={plan.data} />

              <section aria-labelledby="never-title" className="grid gap-4 md:grid-cols-2">
                <div className="rounded-[14px] border border-mz-line bg-white p-5 sm:p-6">
                  <h2 id="never-title" className="text-[16px] font-bold text-mz-ink">You’re never charged for</h2>
                  <ul className="mt-3 space-y-2.5 text-[14px] text-mz-ink-2">
                    <li className="flex gap-2"><Check size={16} className="mt-0.5 shrink-0 text-mz-primary" aria-hidden="true" />Being shortlisted: it is always free for you.</li>
                    <li className="flex gap-2"><Check size={16} className="mt-0.5 shrink-0 text-mz-primary" aria-hidden="true" />Getting placed, no success fee and no cut of your salary.</li>
                    <li className="flex gap-2"><X size={16} className="mt-0.5 shrink-0 text-mz-muted" aria-hidden="true" />No renewals: Premium is a single payment.</li>
                  </ul>
                </div>
                <div className="rounded-[14px] border border-mz-line bg-white p-5 sm:p-6">
                  <h2 className="text-[16px] font-bold text-mz-ink">Payment history</h2>
                  {isPaid ? (
                    <div className="mt-3 flex flex-wrap items-center justify-between gap-3 text-[14px]">
                      <div>
                        <p className="font-medium text-mz-ink">{plan.data.premium.name}, one-time fee</p>
                        {profile?.subscription?.paidOn && <p className="text-[13px] text-mz-muted">{dateFmt.format(new Date(profile.subscription.paidOn))}</p>}
                      </div>
                      <span className="flex items-center gap-2">
                        <span className="font-bold text-mz-ink">₹{profile?.subscription?.amount ?? PREMIUM_PRICE}</span>
                        <span className="rounded-full bg-mz-primary-tint px-2.5 py-1 text-[12px] font-semibold text-mz-primary-strong">Paid</span>
                      </span>
                    </div>
                  ) : token ? (
                    <p className="mt-3 text-[14px] text-mz-muted">No payment recorded yet.</p>
                  ) : (
                    <p className="mt-3 flex items-center gap-1.5 text-[14px] text-mz-muted">
                      <UserRound size={15} aria-hidden="true" />
                      <Link to={SIGN_IN_TO} className="font-semibold text-mz-primary-strong hover:underline">Sign in</Link> to see your plan and payments.
                    </p>
                  )}
                </div>
              </section>
            </div>
          )}
        </Container>
      </main>
      <Footer />
    </div>
  )
}
