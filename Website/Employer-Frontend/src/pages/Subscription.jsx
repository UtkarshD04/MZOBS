import { useState } from 'react'
import { CheckCircle2, ShieldCheck, Sparkles, Receipt, IndianRupee, CalendarClock, ChevronDown } from 'lucide-react'
import PageHeader from '../components/layout/PageHeader'
import Card, { CardBody, CardHead, CardTitle } from '../components/ui/Card'
import Button from '../components/ui/Button'
import Badge from '../components/ui/Badge'
import Modal from '../components/ui/Modal'
import CouponBox from '../components/ui/CouponBox'
import { Table, TableWrap, Td, Tr } from '../components/ui/Table'
import EmptyState from '../components/ui/EmptyState'
import ErrorState from '../components/ui/ErrorState'
import { PageSkeleton } from '../components/ui/Skeleton'
import { useSubscriptionQuery, useSubscriptionPaymentsQuery, useSubscribeToPlan, usePreviewSubscriptionCoupon } from '../hooks/useSubscription'
import { fmtDate, fmtINR } from '../lib/utils'

const BASE_BENEFITS = [
  'Unlimited job postings while your plan is active',
  'Unlimited viewing & downloading of resumes for candidates who applied to your jobs',
  'Full applicant details — contact info, resume, profile — for your own applicants only',
  'Manage every application: shortlist, reject, interview and update status in one place',
]

const FAQS = [
  {
    q: 'Can I post unlimited jobs?',
    a: 'Yes — once your MZOBS Employer plan is active, you can create and publish as many job postings as you need for the full year, with no per-job fee.',
  },
  {
    q: 'Which resumes can I access?',
    a: "Only resumes of candidates who have applied to one of your own job postings. MZOBS never gives employers access to a general candidate database — a candidate's resume and contact details are only visible to the specific employer they applied to.",
  },
  {
    q: 'What does "Enhanced candidate CVs" mean on the Plus/Pro plans?',
    a: "Applicant CVs on these plans are presented in an enhanced, easier-to-review format when you view them, on top of everything the base plan already gives you.",
  },
  {
    q: 'Does the subscription renew automatically?',
    a: 'No. This is a one-time annual payment — MZOBS never auto-charges you. When your plan is close to expiry, or after it expires, you can renew manually from this page in a few clicks.',
  },
  {
    q: 'What happens after expiry?',
    a: "You can still sign in and view your existing jobs and applications read-only. You won't be able to post new jobs, publish drafts, or view applicant resumes/contact details until you renew.",
  },
]

const paymentStatusTone = { paid: 'green', created: 'amber', failed: 'red' }
const paymentStatusLabel = { paid: 'Paid', created: 'Pending', failed: 'Failed' }

function paisePriceLabel(paise) {
  return fmtINR(Math.round((paise ?? 0) / 100))
}

function FaqItem({ q, a }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="border-b border-border last:border-b-0 py-3.5">
      <button onClick={() => setOpen((o) => !o)} className="w-full flex items-center justify-between gap-3 text-left cursor-pointer">
        <span className="text-[13.5px] font-semibold">{q}</span>
        <ChevronDown size={16} className={`text-ink-tertiary flex-shrink-0 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && <p className="text-[12.5px] text-ink-secondary mt-2 leading-relaxed">{a}</p>}
    </div>
  )
}

// One selectable plan tile — the base plan (no extra `benefits` from the
// server) shows just BASE_BENEFITS; Plus/Pro append their own on top (e.g.
// "Enhanced candidate CVs") so every tier still reads as a superset of the
// one below it, never a different unrelated plan.
function PlanCard({ plan, popular, onSubscribe }) {
  return (
    <Card pad hover className="relative flex flex-col overflow-hidden border-border-strong">
      {popular && <span className="absolute right-0 top-0 rounded-bl-xl bg-navy px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-white">Most popular</span>}
      <div className="flex items-center gap-2 mb-1">
        <Sparkles size={15} className="text-navy" />
        <span className="text-[11.5px] font-semibold tracking-wide uppercase text-ink-tertiary">{plan.planName}</span>
      </div>
      <div className="flex items-baseline gap-2">
        <span className="text-[26px] font-bold tracking-tight">{fmtINR(plan.baseAmountPaise / 100)}</span>
        <span className="text-[12.5px] text-ink-secondary">+ {plan.gstRatePercent}% GST / year</span>
      </div>
      <div className="text-[11.5px] text-ink-tertiary mt-1">Total {paisePriceLabel(plan.totalAmountPaise)}</div>

      <ul className="mt-4 flex flex-col gap-2 flex-1">
        {BASE_BENEFITS.map((b) => (
          <li key={b} className="flex items-start gap-2 text-[12.5px]">
            <CheckCircle2 size={15} className="text-navy mt-0.5 flex-shrink-0" /> {b}
          </li>
        ))}
        {plan.benefits.map((b) => (
          <li key={b} className="flex items-start gap-2 text-[12.5px] font-semibold text-navy">
            <CheckCircle2 size={15} className="text-navy mt-0.5 flex-shrink-0" /> {b}
          </li>
        ))}
      </ul>

      <Button variant="primary" size="md" className="w-full mt-4" onClick={() => onSubscribe(plan)}>
        <IndianRupee size={15} /> Subscribe — {paisePriceLabel(plan.totalAmountPaise)}
      </Button>
    </Card>
  )
}

export default function Subscription() {
  const { data, isLoading, isError, refetch } = useSubscriptionQuery()
  const { data: payments = [] } = useSubscriptionPaymentsQuery()
  const subscribe = useSubscribeToPlan()
  const [buyTarget, setBuyTarget] = useState(null)
  const [couponResult, setCouponResult] = useState(null)
  const couponPreview = usePreviewSubscriptionCoupon(buyTarget?.planCode)

  // `plans` is only missing/empty if this frontend build has shipped ahead of
  // the backend deploy that adds it (see employerSubscriptionController.js)
  // — treat that the same as a load failure rather than rendering a picker
  // with no plans in it.
  const plans = data?.plans ?? []
  if (isLoading) return <PageSkeleton />
  if (isError || !data || plans.length === 0) return <ErrorState onRetry={() => refetch()} />

  const { subscription, isActive } = data
  const expiringSoon = isActive && subscription?.expiresAt && new Date(subscription.expiresAt) - Date.now() < 30 * 24 * 60 * 60 * 1000
  // Renew always re-buys whatever plan is currently active; falls back to the
  // base tier if that plan code has since been retired.
  const currentPlan = plans.find((p) => p.planCode === subscription?.planCode) ?? plans[0]
  const popularPlanCode = plans[1]?.planCode // the middle ("Plus") tier

  function openBuyModal(plan) {
    setCouponResult(null)
    setBuyTarget(plan)
  }

  function closeBuyModal() {
    setBuyTarget(null)
    setCouponResult(null)
  }

  function confirmPurchase() {
    if (!buyTarget) return
    subscribe.mutate({ planCode: buyTarget.planCode, couponCode: couponResult?.code }, { onSuccess: closeBuyModal })
  }

  const payableAmount = couponResult?.finalAmount ?? (buyTarget ? buyTarget.totalAmountPaise / 100 : 0)

  return (
    <div>
      <PageHeader title="Plans & Billing" subtitle="Pick the plan that fits how you hire on MZOBS." />

      {isActive && (
        <Card className="mb-5">
          <CardBody className="flex items-start justify-between gap-4 flex-wrap">
            <div className="flex items-start gap-3.5">
              <span className="w-11 h-11 rounded-xl bg-green-tint text-green flex items-center justify-center flex-shrink-0">
                <ShieldCheck size={20} />
              </span>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <div className="text-[15px] font-bold tracking-tight">{subscription.planName}</div>
                  <Badge tone="green">Active</Badge>
                </div>
                <div className="text-[12.5px] text-ink-secondary mt-1">
                  Active until <span className="font-semibold text-ink">{fmtDate(subscription.expiresAt)}</span>
                  {subscription.razorpayPaymentId && <span className="text-ink-tertiary"> · Ref: {subscription.razorpayPaymentId}</span>}
                </div>
                <ul className="mt-3 flex flex-col gap-1.5">
                  {BASE_BENEFITS.map((b) => (
                    <li key={b} className="flex items-start gap-2 text-[12.5px] text-ink-secondary">
                      <CheckCircle2 size={14} className="text-green mt-0.5 flex-shrink-0" /> {b}
                    </li>
                  ))}
                  {currentPlan.benefits.map((b) => (
                    <li key={b} className="flex items-start gap-2 text-[12.5px] font-semibold text-ink">
                      <CheckCircle2 size={14} className="text-green mt-0.5 flex-shrink-0" /> {b}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            {expiringSoon && (
              <Button variant="primary" onClick={() => openBuyModal(currentPlan)}>
                <CalendarClock size={16} /> Renew for {paisePriceLabel(currentPlan.totalAmountPaise)}
              </Button>
            )}
          </CardBody>
        </Card>
      )}

      {!isActive && (
        <>
          <div className="grid grid-cols-3 gap-5 mb-3 max-xl:grid-cols-1">
            {plans.map((plan) => (
              <PlanCard key={plan.planCode} plan={plan} popular={plan.planCode === popularPlanCode} onSubscribe={openBuyModal} />
            ))}
          </div>

          <Card className="mb-5">
            <CardBody className="flex items-center gap-2 text-[12px] text-ink-tertiary">
              <ShieldCheck size={14} /> Secure payment via Razorpay. One-time annual charge — never auto-renewed.
            </CardBody>
          </Card>

          {subscription?.status === 'payment_failed' && (
            <Card className="mb-5">
              <CardBody className="text-[12.5px] text-red">Your last payment attempt didn't go through. You can try again above.</CardBody>
            </Card>
          )}

          <Card className="mb-5">
            <CardHead><CardTitle>What you don't get access to</CardTitle></CardHead>
            <CardBody className="text-[12.5px] text-ink-secondary leading-relaxed">
              No plan opens up MZOBS's general candidate database. You only ever see the resume and contact details of a candidate after they've applied to one of your own job postings — we never sell or expose candidate data outside of that.
            </CardBody>
          </Card>
        </>
      )}

      <Card className="mb-5">
        <CardHead><CardTitle>Frequently asked questions</CardTitle></CardHead>
        <CardBody className="pt-1">
          {FAQS.map((f) => (
            <FaqItem key={f.q} {...f} />
          ))}
        </CardBody>
      </Card>

      <Card>
        <CardHead><CardTitle>Payment History</CardTitle></CardHead>
        {payments.length === 0 ? (
          <EmptyState icon={Receipt} title="No payments yet" body="Your subscription payments will appear here once you subscribe." />
        ) : (
          <TableWrap className="rounded-none border-0">
            <Table columns={['Receipt', 'Date', 'Amount', 'Status']}>
              {payments.map((p) => (
                <Tr key={p.id}>
                  <Td className="font-semibold">{p.receipt}</Td>
                  <Td>{fmtDate(p.createdAt)}</Td>
                  <Td>{fmtINR(p.amount)}</Td>
                  <Td><Badge tone={paymentStatusTone[p.status] ?? 'gray'}>{paymentStatusLabel[p.status] ?? p.status}</Badge></Td>
                </Tr>
              ))}
            </Table>
          </TableWrap>
        )}
      </Card>

      <Modal
        open={!!buyTarget}
        onClose={closeBuyModal}
        title={buyTarget ? buyTarget.planName : ''}
        subtitle={buyTarget ? '1 year · ' + BASE_BENEFITS.length + ' core benefits' + (buyTarget.benefits.length ? ` + ${buyTarget.benefits.join(', ')}` : '') : ''}
        size="sm"
        footer={
          <>
            <Button variant="secondary" size="sm" onClick={closeBuyModal}>Cancel</Button>
            <Button variant="primary" size="sm" loading={subscribe.isPending} onClick={confirmPurchase}>
              <IndianRupee size={14} /> Pay {fmtINR(payableAmount)}
            </Button>
          </>
        }
      >
        {buyTarget && (
          <>
            <div className="flex items-baseline gap-2 mb-4">
              <span className="text-[26px] font-bold tracking-tight">{fmtINR(payableAmount)}</span>
              {couponResult && <span className="text-[13px] text-ink-tertiary line-through">{paisePriceLabel(buyTarget.totalAmountPaise)}</span>}
            </div>
            <CouponBox preview={couponPreview} applied={couponResult} onApply={setCouponResult} onRemove={() => setCouponResult(null)} />
          </>
        )}
      </Modal>
    </div>
  )
}
