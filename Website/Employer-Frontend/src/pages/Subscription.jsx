import { useState } from 'react'
import { CheckCircle2, ShieldCheck, Sparkles, Receipt, IndianRupee, CalendarClock, ChevronDown } from 'lucide-react'
import PageHeader from '../components/layout/PageHeader'
import Card, { CardBody, CardHead, CardTitle } from '../components/ui/Card'
import Button from '../components/ui/Button'
import Badge from '../components/ui/Badge'
import { Table, TableWrap, Td, Tr } from '../components/ui/Table'
import EmptyState from '../components/ui/EmptyState'
import ErrorState from '../components/ui/ErrorState'
import { PageSkeleton } from '../components/ui/Skeleton'
import { useSubscriptionQuery, useSubscriptionPaymentsQuery, useSubscribeToPlan } from '../hooks/useSubscription'
import { fmtDate, fmtINR } from '../lib/utils'

const BENEFITS = [
  'Unlimited job postings while your plan is active',
  'Unlimited viewing & downloading of resumes for candidates who applied to your jobs',
  'Full applicant details — contact info, resume, profile — for your own applicants only',
  'Manage every application: shortlist, reject, interview and update status in one place',
]

const FAQS = [
  {
    q: 'Can I post unlimited jobs?',
    a: 'Yes — once your MZOBS Employer Annual plan is active, you can create and publish as many job postings as you need for the full year, with no per-job fee.',
  },
  {
    q: 'Which resumes can I access?',
    a: "Only resumes of candidates who have applied to one of your own job postings. MZOBS never gives employers access to a general candidate database — a candidate's resume and contact details are only visible to the specific employer they applied to.",
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

export default function Subscription() {
  const { data, isLoading, isError, refetch } = useSubscriptionQuery()
  const { data: payments = [] } = useSubscriptionPaymentsQuery()
  const subscribe = useSubscribeToPlan()

  if (isLoading) return <PageSkeleton />
  if (isError || !data) return <ErrorState onRetry={() => refetch()} />

  const { subscription, isActive, pricing } = data
  const expiringSoon = isActive && subscription?.expiresAt && new Date(subscription.expiresAt) - Date.now() < 30 * 24 * 60 * 60 * 1000

  return (
    <div>
      <PageHeader title="Plans & Billing" subtitle="One plan. Everything you need to hire on MZOBS." />

      {isActive ? (
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
                  {BENEFITS.map((b) => (
                    <li key={b} className="flex items-start gap-2 text-[12.5px] text-ink-secondary">
                      <CheckCircle2 size={14} className="text-green mt-0.5 flex-shrink-0" /> {b}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            {expiringSoon && (
              <Button variant="primary" loading={subscribe.isPending} onClick={() => subscribe.mutate()}>
                <CalendarClock size={16} /> Renew for {paisePriceLabel(pricing.totalAmountPaise)}
              </Button>
            )}
          </CardBody>
        </Card>
      ) : (
        <div className="grid grid-cols-3 gap-5 mb-5 max-xl:grid-cols-1">
          <Card className="col-span-2 max-xl:col-span-1" pad>
            <div className="flex items-center gap-2 mb-1">
              <Sparkles size={16} className="text-navy" />
              <span className="text-[11.5px] font-semibold tracking-wide uppercase text-ink-tertiary">MZOBS Employer Annual</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-[30px] font-bold tracking-tight">{fmtINR(pricing.baseAmountPaise / 100)}</span>
              <span className="text-[13px] text-ink-secondary">+ {pricing.gstRatePercent}% GST / year</span>
            </div>
            <div className="text-[12px] text-ink-tertiary mt-1">
              Total {paisePriceLabel(pricing.totalAmountPaise)} — final amount shown is exactly what you pay
            </div>

            <ul className="mt-5 flex flex-col gap-2.5">
              {BENEFITS.map((b) => (
                <li key={b} className="flex items-start gap-2.5 text-[13px]">
                  <CheckCircle2 size={16} className="text-navy mt-0.5 flex-shrink-0" /> {b}
                </li>
              ))}
            </ul>

            <div className="mt-5 pt-5 border-t border-border flex items-center gap-2 text-[12px] text-ink-tertiary">
              <ShieldCheck size={14} /> Secure payment via Razorpay. One-time annual charge — never auto-renewed.
            </div>

            <Button variant="primary" size="lg" className="w-full mt-5" loading={subscribe.isPending} onClick={() => subscribe.mutate()}>
              <IndianRupee size={16} /> Subscribe now — {paisePriceLabel(pricing.totalAmountPaise)}
            </Button>

            {subscription?.status === 'payment_failed' && (
              <p className="text-[12px] text-red mt-2.5 text-center">Your last payment attempt didn't go through. You can try again above.</p>
            )}
          </Card>

          <Card>
            <CardHead><CardTitle>What you don't get access to</CardTitle></CardHead>
            <CardBody className="text-[12.5px] text-ink-secondary leading-relaxed">
              This plan does not open up MZOBS's general candidate database. You only ever see the resume and contact details of a candidate after they've applied to one of your own job postings — we never sell or expose candidate data outside of that.
            </CardBody>
          </Card>
        </div>
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
    </div>
  )
}
