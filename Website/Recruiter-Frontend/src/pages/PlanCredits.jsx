import { useCallback, useEffect, useState } from 'react'
import clsx from 'clsx'
import { CheckCircle2, XCircle, CreditCard, Ticket, AlertTriangle, ShieldCheck, Coins, Tag } from 'lucide-react'
import { Button, EmptyState, Skeleton } from '../components/ui'
import { useWorkspace } from '../store/workspace'
import { IS_DEMO } from '../lib/config'
import { agoDate } from '../lib/format'
import { getSubscription, getWallet, getPlans, listPurchases, listUnlocks, listPlanPayments, previewCoupon, previewSubscriptionCoupon, purchaseSubscription, purchaseCredits, paymentError } from '../services/planService'

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

function SubscriptionCard({ data, onBuy, busy }) {
  const { subscription: s, isActive } = data
  const left = daysLeft(s?.expiresAt)
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
      {!isActive && (
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          {(data.plans ?? []).map((p) => <TierCard key={p.planCode} plan={p} busy={busy === p.planCode} onBuy={onBuy} />)}
          {!(data.plans ?? []).length && <p className="text-[13px] text-muted sm:col-span-3">Plans are not available from the server right now.</p>}
        </div>
      )}
    </Card>
  )
}

function TierCard({ plan: p, onBuy, busy }) {
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
      <Button variant="primary" className="mt-auto" style={{ marginTop: 14 }} disabled={busy} onClick={() => onBuy(p, preview?.code)}>{busy ? 'Processing…' : `Subscribe · ${rupees(preview ? preview.finalAmount * 100 : p.totalAmountPaise)}`}</Button>
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
        <p className="mt-3 flex items-center gap-2 rounded-lg bg-warn-soft px-3 py-2 text-[13px] text-warn"><AlertTriangle size={14} /> {left === 0 ? 'You have no credits. Buy a pack below to unlock candidate contact details.' : 'Running low — top up so you can keep unlocking candidates.'}</p>
      )}
    </Card>
  )
}

function PackCard({ plan, onBuy, busy }) {
  const [code, setCode] = useState('')
  const [preview, setPreview] = useState(null)
  const [err, setErr] = useState('')
  const apply = async () => {
    setErr('')
    setPreview(null)
    if (!code.trim()) return
    try {
      setPreview(await previewCoupon(plan.id, code.trim()))
    } catch (e) {
      setErr(e.response?.data?.message ?? 'Invalid coupon')
    }
  }
  const price = preview ? preview.finalAmount : plan.amountRupees
  return (
    <div className="flex flex-col rounded-2xl border border-line bg-white p-5 shadow-card transition-shadow hover:shadow-lift">
      <p className="text-[13px] font-semibold uppercase tracking-wide text-muted">{plan.name}</p>
      <p className="mt-2 text-[30px] font-bold tabular-nums">{plan.creditsGranted}<span className="ml-1 text-[14px] font-medium text-muted">credits</span></p>
      <p className="mt-1 text-[22px] font-bold">
        ₹{price.toLocaleString('en-IN')}
        {preview && <span className="ml-2 text-[14px] font-medium text-muted line-through">₹{plan.amountRupees.toLocaleString('en-IN')}</span>}
      </p>
      <p className="text-[12px] text-muted">₹{plan.rupeesPerCredit} per credit</p>
      <div className="mt-4">
        <div className="flex gap-1.5">
          <input value={code} onChange={(e) => { setCode(e.target.value); setPreview(null) }} onKeyDown={(e) => e.key === 'Enter' && apply()} placeholder="Coupon code" aria-label={`Coupon for ${plan.name}`} className="h-9 min-w-0 flex-1 rounded-lg border border-line px-2.5 text-[13px] uppercase outline-none focus:border-accent" />
          <Button size="sm" onClick={apply} icon={Tag} disabled={!code.trim()}>Apply</Button>
        </div>
        {preview && <p className="mt-1.5 text-[12px] font-medium text-[#1a8f5a]">{preview.code} applied — you save ₹{preview.discountAmount.toLocaleString('en-IN')}</p>}
        {err && <p role="alert" className="mt-1.5 text-[12px] text-bad">{err}</p>}
      </div>
      <Button variant="primary" className="mt-auto" style={{ marginTop: 16 }} disabled={busy} onClick={() => onBuy(plan, preview?.code)}>{busy ? 'Processing…' : `Buy ${plan.creditsGranted} credits`}</Button>
    </div>
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
      const [sub, w, plans] = await Promise.all([getSubscription(), getWallet(), getPlans()])
      setData({ sub, wallet: w.wallet, rate: w.rupeesPerCredit, plans: plans.plans })
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
          <section>
            <h2 className="mb-3 flex items-center gap-2 text-[15px] font-semibold"><Ticket size={16} className="text-muted" /> Buy CV credits</h2>
            {data.plans.length === 0 ? <p className="text-[13px] text-muted">No credit packs are available right now.</p> : (
              <div className="grid gap-4 sm:grid-cols-3">
                {data.plans.map((p) => <PackCard key={p.id} plan={p} busy={busy === p.id} onBuy={(plan, code) => run(plan.id, () => purchaseCredits(plan.id, code), `${plan.creditsGranted} credits added`)} />)}
              </div>
            )}
          </section>
          <History />
        </>
      )}
    </div>
  )
}
