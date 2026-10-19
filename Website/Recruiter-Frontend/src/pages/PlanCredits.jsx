import { useCallback, useEffect, useState } from 'react'
import clsx from 'clsx'
import { CheckCircle2, XCircle, CreditCard, AlertTriangle, ShieldCheck, Coins, Tag, SlidersHorizontal } from 'lucide-react'
import { Button, EmptyState, Modal, Skeleton } from '../components/ui'
import { useWorkspace } from '../store/workspace'
import { IS_DEMO } from '../lib/config'
import { agoDate } from '../lib/format'
import { getSubscription, getWallet, listPurchases, listUnlocks, listPlanPayments, previewSubscriptionCoupon, purchaseSubscription, submitPlanEnquiry, paymentError } from '../services/planService'

const rupees = (paise) => `₹${(paise / 100).toLocaleString('en-IN', { maximumFractionDigits: 2 })}`
const dateOf = (iso) => (iso ? new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '—')
const daysLeft = (iso) => (iso ? Math.ceil((new Date(iso).getTime() - Date.now()) / 86400000) : null)

function Card({ title, icon: Icon, children, className }) {
  return (
    <section className={clsx('rounded-2xl border border-line bg-white p-5 shadow-card', className)}>
      <h2 className="mb-3 flex items-center gap-2 text-[15px] font-semibold"><Icon size={16} className="text-muted" /> {title}</h2>
      {children}
    </section>
  )
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const EMPTY = { name: '', companyName: '', phone: '', email: '', employeesNeeded: '' }
const inputCls = 'h-10 w-full rounded-lg border border-line px-3 text-[13.5px] outline-none focus:border-accent'

// "Customize plan" — for employers who don't fit the fixed tiers. Submissions go to the
// Operations team (Plan enquiries), who call back with a quote.
function CustomPlanCard() {
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState(EMPTY)
  const [status, setStatus] = useState('form') // form | sending | done
  const [error, setError] = useState('')
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: k === 'phone' ? e.target.value.replace(/\D/g, '').slice(0, 10) : k === 'employeesNeeded' ? e.target.value.replace(/\D/g, '').slice(0, 6) : e.target.value }))
  const valid = form.name.trim() && form.companyName.trim() && form.phone.length === 10 && Number(form.employeesNeeded) >= 1 && EMAIL_RE.test(form.email.trim())
  const busy = status === 'sending'
  const done = status === 'done'
  const close = () => {
    if (busy) return
    setOpen(false)
    setForm(EMPTY)
    setStatus('form')
    setError('')
  }
  const submit = async () => {
    setStatus('sending')
    setError('')
    try {
      await submitPlanEnquiry(form)
      setStatus('done')
    } catch (e) {
      setError(e.response?.data?.message ?? 'Couldn’t send your request. Please try again.')
      setStatus('form')
    }
  }
  const field = (label, id, props) => (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-[12.5px] font-semibold">{label}</label>
      <input id={id} className={inputCls} {...props} />
    </div>
  )
  return (
    <div className="flex flex-col rounded-xl border border-dashed border-accent bg-bg p-4">
      <p className="text-[13px] font-semibold uppercase tracking-wide text-muted">Customize plan</p>
      <p className="mt-2 text-[26px] font-bold">Let’s talk</p>
      <p className="text-[12px] text-muted">A plan shaped around your hiring volume and team.</p>
      <Button className="mt-auto" style={{ marginTop: 14 }} icon={SlidersHorizontal} onClick={() => setOpen(true)}>Customize plan</Button>
      <Modal
        open={open}
        onClose={close}
        width={440}
        title={done ? 'Request sent' : 'Customize your plan'}
        subtitle={done ? undefined : 'Tell us how to reach you and our team will get back with a plan that fits.'}
        footer={done ? <Button variant="primary" onClick={close}>Done</Button> : <><Button onClick={close} disabled={busy}>Cancel</Button><Button variant="primary" disabled={!valid || busy} onClick={submit}>{busy ? 'Sending…' : 'Submit'}</Button></>}
      >
        {done ? (
          <div className="py-4 text-center">
            <CheckCircle2 size={36} className="mx-auto mb-3 text-[#1a8f5a]" />
            <p className="text-[20px] font-bold">We’ll call you soon.</p>
            <p className="mt-1.5 text-[13px] text-muted">Thanks! Our team has your details and will reach out with a plan built for your hiring needs.</p>
          </div>
        ) : (
          <form className="flex flex-col gap-3.5" onSubmit={(e) => { e.preventDefault(); if (valid && !busy) submit() }}>
            {error && <p role="alert" className="text-[12.5px] text-bad">{error}</p>}
            {field('Your name', 'pe-name', { value: form.name, onChange: set('name'), maxLength: 120, autoComplete: 'name' })}
            {field('Company name', 'pe-company', { value: form.companyName, onChange: set('companyName'), maxLength: 200, autoComplete: 'organization' })}
            {field('Phone number', 'pe-phone', { type: 'tel', inputMode: 'numeric', value: form.phone, onChange: set('phone'), placeholder: '98765 43210', autoComplete: 'tel-national' })}
            {field('Number of employees you need', 'pe-count', { type: 'tel', inputMode: 'numeric', value: form.employeesNeeded, onChange: set('employeesNeeded'), placeholder: 'e.g. 10' })}
            {field('Email', 'pe-email', { type: 'email', value: form.email, onChange: set('email'), maxLength: 200, autoComplete: 'email' })}
            <button type="submit" className="hidden" />
          </form>
        )}
      </Modal>
    </div>
  )
}

function SubscriptionCard({ data, onBuy, busy }) {
  const { subscription: s, isActive } = data
  const left = daysLeft(s?.expiresAt)
  const tiers = data.plans ?? []
  const currentBase = isActive ? tiers.find((p) => p.planCode === s?.planCode)?.baseAmountPaise ?? Infinity : -1
  const upgrades = tiers.filter((p) => p.baseAmountPaise > currentBase)
  return (
    <Card title="Employer plan" icon={ShieldCheck}>
      <div className="flex items-center gap-2">
        <span className="text-[20px] font-bold">{s?.planName ?? 'No plan'}</span>
        {isActive ? (
          <span className="inline-flex items-center gap-1 rounded-md bg-ok-soft px-2 py-0.5 text-[12px] font-semibold text-[#1a8f5a]"><CheckCircle2 size={12} /> Active</span>
        ) : (
          <span className="inline-flex items-center gap-1 rounded-md bg-warn-soft px-2 py-0.5 text-[12px] font-semibold text-warn"><XCircle size={12} /> {s?.status === 'expired' ? 'Expired' : 'Not subscribed'}</span>
        )}
      </div>
      {isActive ? (
        <p className="mt-1 text-[13.5px] text-ink-2">Valid until <b>{dateOf(s.expiresAt)}</b>{left != null && <span className={clsx('ml-1.5', left <= 30 ? 'text-warn' : 'text-muted')}>({left} day{left === 1 ? '' : 's'} left)</span>}</p>
      ) : (
        <p className="mt-1 max-w-xl text-[13.5px] text-ink-2">Needed to <b>post jobs</b> and <b>open candidate resumes</b>. Contact details are unlocked separately with CV credits. Choose a plan below.</p>
      )}
      {isActive && upgrades.length > 0 && <p className="mt-4 text-[14px] font-semibold">Upgrade your plan</p>}
      <div className={clsx('grid gap-4 sm:grid-cols-3', isActive && upgrades.length > 0 ? 'mt-2' : 'mt-4')}>
        {upgrades.map((p) => <TierCard key={p.planCode} plan={p} busy={busy === p.planCode} onBuy={onBuy} upgrade={isActive} />)}
        {isActive && upgrades.length === 0 && <p className="text-[13px] text-muted sm:col-span-3">You’re on our highest plan.</p>}
        {!isActive && upgrades.length === 0 && <p className="text-[13px] text-muted sm:col-span-3">Plans are not available from the server right now.</p>}
        <CustomPlanCard />
      </div>
    </Card>
  )
}

function TierCard({ plan: p, onBuy, busy, upgrade }) {
  const [code, setCode] = useState('')
  const [preview, setPreview] = useState(null)
  const [err, setErr] = useState('')
  const apply = async () => {
    setErr('')
    setPreview(null)
    if (!code.trim()) return
    try {
      setPreview(await previewSubscriptionCoupon(p.planCode, code.trim()))
    } catch (e) {
      setErr(e.response?.data?.message ?? 'Invalid coupon')
    }
  }
  return (
    <div className="flex flex-col rounded-xl border border-line bg-white p-4">
      <p className="text-[13px] font-semibold uppercase tracking-wide text-muted">{p.planName}</p>
      <p className="mt-2 text-[26px] font-bold tabular-nums">
        {rupees(preview ? preview.finalAmount * 100 : p.totalAmountPaise)}
        {preview && <span className="ml-2 text-[14px] font-medium text-muted line-through">{rupees(p.totalAmountPaise)}</span>}
      </p>
      <p className="text-[12px] text-muted">{rupees(p.baseAmountPaise)} + GST {p.gstRatePercent}% ({rupees(p.gstAmountPaise)}) · 1 year</p>
      {p.benefits?.length > 0 && (
        <ul className="mt-2 space-y-1 text-[13px] text-ink-2">
          {p.benefits.map((b) => <li key={b} className="flex items-center gap-1.5"><CheckCircle2 size={13} className="text-[#1a8f5a]" /> {b}</li>)}
        </ul>
      )}
      <div className="mt-3 flex gap-1.5">
        <input value={code} onChange={(e) => { setCode(e.target.value); setPreview(null) }} onKeyDown={(e) => e.key === 'Enter' && apply()} placeholder="Coupon code" aria-label={`Coupon for ${p.planName}`} className="h-9 min-w-0 flex-1 rounded-lg border border-line px-2.5 text-[13px] uppercase outline-none focus:border-accent" />
        <Button size="sm" onClick={apply} icon={Tag} disabled={!code.trim()}>Apply</Button>
      </div>
      {preview && <p className="mt-1.5 text-[12px] font-medium text-[#1a8f5a]">{preview.code} applied — you save ₹{preview.discountAmount.toLocaleString('en-IN')}</p>}
      {err && <p role="alert" className="mt-1.5 text-[12px] text-bad">{err}</p>}
      <Button variant="primary" className="mt-auto" style={{ marginTop: 14 }} disabled={busy} onClick={() => onBuy(p, preview?.code)}>{busy ? 'Processing…' : `${upgrade ? 'Upgrade' : 'Subscribe'} · ${rupees(preview ? preview.finalAmount * 100 : p.totalAmountPaise)}`}</Button>
    </div>
  )
}

function CreditsCard({ wallet, rate }) {
  const total = wallet.totalCredits ?? 0
  const used = wallet.usedCredits ?? 0
  const left = wallet.remainingCredits ?? 0
  const pct = total ? Math.min(100, Math.round((used / total) * 100)) : 0
  const exp = daysLeft(wallet.expiresAt)
  const low = total > 0 && left <= Math.max(3, total * 0.1)
  return (
    <Card title="CV credits" icon={Coins}>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[42px] font-bold leading-none tabular-nums">{left}</p>
          <p className="mt-1 text-[13px] text-muted">credits remaining · 1 credit unlocks one candidate’s contact details{rate ? ` (₹${rate} each)` : ''}</p>
        </div>
        <div className="min-w-[220px] text-[13px]">
          <div className="flex justify-between text-muted"><span>{used} used</span><span>{total} total</span></div>
          <div className="mt-1 h-2 overflow-hidden rounded-full bg-line-2"><div className={clsx('h-full rounded-full transition-all', low ? 'bg-warn' : 'bg-accent')} style={{ width: `${pct}%` }} /></div>
          {wallet.expiresAt && <p className={clsx('mt-1.5 text-[12px]', exp != null && exp <= 30 ? 'text-warn' : 'text-muted')}>Credits valid until {dateOf(wallet.expiresAt)}{exp != null && ` (${exp} days)`}</p>}
        </div>
      </div>
      {(left === 0 || low) && (
        <p className="mt-3 flex items-center gap-2 rounded-lg bg-warn-soft px-3 py-2 text-[13px] text-warn"><AlertTriangle size={14} /> {left === 0 ? 'You have no credits left. Upgrade your plan to unlock candidate contact details.' : 'Running low — upgrade your plan to keep unlocking candidates.'}</p>
      )}
    </Card>
  )
}

const TABS = ['Credit purchases', 'Unlocks', 'Plan payments']

function History() {
  const [tab, setTab] = useState(0)
  const [rows, setRows] = useState({})
  useEffect(() => {
    const fn = [listPurchases, listUnlocks, listPlanPayments][tab]
    if (rows[tab] === undefined) fn().then((r) => setRows((x) => ({ ...x, [tab]: r }))).catch(() => setRows((x) => ({ ...x, [tab]: [] })))
  }, [tab, rows])
  const list = rows[tab]
  return (
    <Card title="History" icon={CreditCard}>
      <div className="mb-3 flex gap-1 border-b border-line" role="tablist">
        {TABS.map((t, i) => <button key={t} role="tab" aria-selected={tab === i} onClick={() => setTab(i)} className={clsx('-mb-px border-b-2 px-3 py-1.5 text-[13px] font-medium', tab === i ? 'border-accent text-ink' : 'border-transparent text-muted hover:text-ink')}>{t}</button>)}
      </div>
      {list === undefined ? <Skeleton className="h-16 w-full" /> : list.length === 0 ? (
        <p className="py-6 text-center text-[13px] text-muted">Nothing here yet.</p>
      ) : (
        <ul className="divide-y divide-line-2 text-[13.5px]">
          {list.map((r) => tab === 1 ? (
            <li key={r.id} className="flex items-center justify-between py-2.5"><span><b className="font-medium">{r.candidate?.name ?? 'Candidate'}</b><span className="text-muted"> · {r.job?.title ?? r.candidate?.appliedFor ?? ''}</span></span><span className="text-[12px] text-muted">{agoDate(r.createdAt)} · 1 credit</span></li>
          ) : (
            <li key={r.id} className="flex items-center justify-between py-2.5">
              <span>{tab === 0 ? `${r.creditPlan?.name ?? 'Credit pack'} · ${r.creditsGranted ?? r.creditPlan?.creditsGranted ?? ''} credits` : 'Employer annual plan'}<span className="text-muted"> · {agoDate(r.createdAt)}</span></span>
              <span className="flex items-center gap-2"><span className="font-medium">₹{Number(r.amount).toLocaleString('en-IN')}</span><span className={clsx('rounded px-1.5 py-0.5 text-[11px] font-semibold', r.status === 'paid' ? 'bg-ok-soft text-[#1a8f5a]' : 'bg-line-2 text-muted')}>{r.status}</span></span>
            </li>
          ))}
        </ul>
      )}
    </Card>
  )
}

export default function PlanCredits() {
  const { toast } = useWorkspace()
  const [data, setData] = useState(null)
  const [error, setError] = useState(false)
  const [busy, setBusy] = useState('')

  const load = useCallback(async () => {
    try {
      const [sub, w] = await Promise.all([getSubscription(), getWallet()])
      setData({ sub, wallet: w.wallet, rate: w.rupeesPerCredit })
      setError(false)
    } catch {
      setError(true)
    }
  }, [])
  useEffect(() => { if (!IS_DEMO) load() }, [load])

  if (IS_DEMO) {
    return <div className="mx-auto max-w-[980px] px-4 py-8"><EmptyState icon={CreditCard} title="Demo workspace" body="Demo mode has no real plan or credits. Switch to live mode to manage your subscription and CV credits." /></div>
  }

  const run = async (key, fn, ok) => {
    setBusy(key)
    try {
      await fn()
      toast(ok)
      await load()
    } catch (e) {
      const m = paymentError(e)
      if (m !== 'Payment cancelled') toast(m, { tone: 'warn' })
    } finally {
      setBusy('')
    }
  }

  return (
    <div className="mx-auto max-w-[980px] space-y-5 px-4 py-8 lg:px-6">
      <div>
        <h1 className="text-[30px] font-extrabold tracking-[-0.03em] text-ink">Plan & credits</h1>
        <p className="mt-1 text-[14px] text-muted">Your employer plan unlocks posting and resumes; CV credits unlock candidate contact details.</p>
      </div>

      {error ? (
        <EmptyState icon={CreditCard} title="Couldn’t load your plan" action={<Button onClick={load}>Retry</Button>} />
      ) : !data ? (
        <><Skeleton className="h-32 w-full" /><Skeleton className="h-32 w-full" /></>
      ) : (
        <>
          <SubscriptionCard data={data.sub} busy={busy} onBuy={(plan, code) => run(plan.planCode, () => purchaseSubscription(plan.planCode, code), `${plan.planName} activated`)} />
          <CreditsCard wallet={data.wallet} rate={data.rate} />
          <History />
        </>
      )}
    </div>
  )
}
