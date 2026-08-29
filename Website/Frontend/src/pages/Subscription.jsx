import { useState } from 'react'
import { ShieldCheck, Video, Layers, Send, GraduationCap, MessageSquare, Download, Info, Check, Loader2 } from 'lucide-react'
import Card, { CardHead } from '../components/ui/Card'
import Badge from '../components/ui/Badge'
import Button from '../components/ui/Button'
import CountUp from '../components/ui/CountUp'
import { TableWrap, Table, Tr, Td } from '../components/ui/Table'
import { StaggerGroup, StaggerItem } from '../components/ui/Stagger'
import { PageSkeleton } from '../components/ui/Skeleton'
import ErrorState from '../components/ui/ErrorState'
import { fmtINR } from '../lib/utils'
import {
  useSubscriptionQuery,
  useCreateSubscriptionOrderMutation,
  useVerifySubscriptionPaymentMutation,
  useConfirmMockSubscriptionPaymentMutation,
} from '../hooks/useSubscription'
import { useProfileQuery } from '../hooks/useProfile'
import { openRazorpayCheckout } from '../lib/razorpay'
import CouponBox from '../components/ui/CouponBox'

const UNLOCKS = [
  [ShieldCheck, 'Resume verification', 'Our team reviews your resume line by line and verifies your work history before any employer sees it.', 'navy'],
  [Video, 'Mock interview with our panel', 'A real interview round with a Mzobs panel member, with written feedback and a score.', 'gold'],
  [Layers, 'Skill track assignment', 'We place you in the track that matches your strengths, so you are matched against the right requirements.', 'violet'],
  [Send, 'Profile dispatch to employers', 'When a matching requirement opens, we shortlist and send your resume to the company directly.', 'teal'],
  [GraduationCap, 'Training & assessments', 'Full access to courses, practice tests and live sessions for your track.', 'amber'],
  [MessageSquare, 'Placement desk support', 'Direct line to the Mzobs team through your entire job search.', 'green'],
]

const TINT = {
  navy: 'bg-navy-tint text-navy',
  gold: 'bg-gold-tint text-gold-strong',
  violet: 'bg-violet-tint text-violet',
  teal: 'bg-teal-tint text-teal',
  amber: 'bg-amber-tint text-amber',
  green: 'bg-green-tint text-green',
}

export default function Subscription() {
  const { data: subscription, isLoading: subLoading, isError: subError, refetch: refetchSub } = useSubscriptionQuery()
  const { data: profile, isLoading: profileLoading, isError: profileError, refetch: refetchProfile } = useProfileQuery()
  const createOrder = useCreateSubscriptionOrderMutation()
  const verifyPayment = useVerifySubscriptionPaymentMutation()
  const confirmMockPayment = useConfirmMockSubscriptionPaymentMutation()
  const [paying, setPaying] = useState(false)
  const [payError, setPayError] = useState('')
  const [couponResult, setCouponResult] = useState(null)

  if (subLoading || profileLoading) return <PageSkeleton />
  if (subError || profileError) return <ErrorState onRetry={() => (subError ? refetchSub() : refetchProfile())} />

  const fee = subscription.amount ?? 299

  // Same order → Checkout → signature-verify flow as the onboarding wizard,
  // for anyone whose subscription is still unpaid (payment skipped/failed
  // during onboarding) — the account page had no way to retry it before.
  async function payNow() {
    setPayError('')
    setPaying(true)
    try {
      const order = await createOrder.mutateAsync(couponResult?.code)
      if (order.mock) {
        await confirmMockPayment.mutateAsync(order.orderId)
        return
      }
      const result = await openRazorpayCheckout(order)
      await verifyPayment.mutateAsync({
        razorpay_order_id: result.razorpay_order_id,
        razorpay_payment_id: result.razorpay_payment_id,
        razorpay_signature: result.razorpay_signature,
      })
    } catch (err) {
      setPayError(err.response?.data?.message ?? err.message ?? 'Something went wrong. Please try again.')
    } finally {
      setPaying(false)
    }
  }

  return (
    <StaggerGroup>
      <StaggerItem className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Subscription</h1>
        <p className="text-sm text-ink-secondary mt-1">Your one-time ₹{fee} Placement Support Programme.</p>
      </StaggerItem>

      <StaggerItem>
        <div className="rounded-2xl p-6 text-white relative overflow-hidden mb-5 bg-gradient-to-br from-navy-950 to-navy-900">
          <div
            className="absolute inset-0"
            style={{
              background:
                'radial-gradient(320px 220px at 88% 20%, rgba(198,138,31,.25), transparent 65%), radial-gradient(280px 260px at 8% 95%, rgba(125,95,214,.20), transparent 65%)',
            }}
          />
          <div className="flex items-center justify-between flex-wrap gap-4 relative">
            <div>
              <Badge dot={false} className={subscription.status === 'paid' ? '!bg-white/15 !text-white' : '!bg-red/20 !text-white'}>
                {subscription.status === 'paid' ? 'Active' : 'Inactive'}
              </Badge>
              <div className="text-2xl font-bold tracking-tight mt-2.5">Placement Support Programme</div>
              <div className="text-[13px] text-white/70 mt-1.5">
                {subscription.paidOn ? `Purchased ${new Date(subscription.paidOn).toLocaleDateString('en-IN')} · ` : ''}One-time payment · No renewal, no monthly fee
              </div>
              <div className="text-[13px] text-white/70 mt-1">Candidate ID {profile.id}</div>
            </div>
            <div className="text-right">
              {couponResult ? (
                <>
                  <div className="text-xs text-white/50 line-through">₹{fee}</div>
                  <div className="text-[30px] font-bold">
                    <CountUp value={couponResult.finalAmount} prefix="₹" duration={900} />
                  </div>
                </>
              ) : (
                <div className="text-[30px] font-bold">
                  <CountUp value={fee} prefix="₹" duration={900} />
                </div>
              )}
              {subscription.status === 'paid' ? (
                <div className="text-xs text-white/60">Paid once, valid for life</div>
              ) : (
                <Button variant="gold" size="sm" disabled={paying} onClick={payNow} className="mt-2">
                  {paying ? (
                    <>
                      <Loader2 size={14} className="animate-spin" /> Processing...
                    </>
                  ) : (
                    `Pay ₹${couponResult?.finalAmount ?? fee} now`
                  )}
                </Button>
              )}
            </div>
          </div>
          {subscription.status !== 'paid' && (
            <div className="mt-5 relative max-w-[360px]">
              <CouponBox applied={couponResult} onApply={setCouponResult} onRemove={() => setCouponResult(null)} dark />
            </div>
          )}
        </div>
      </StaggerItem>

      {payError ? (
        <StaggerItem className="mb-6">
          <Card pad className="text-[13px] text-red">
            {payError}
          </Card>
        </StaggerItem>
      ) : null}

      <StaggerItem className="mb-6">
        <Card pad className="flex items-start gap-3 border-gold-dot/40 bg-gold-tint">
          <Info size={18} className="text-gold-strong mt-0.5 flex-shrink-0" />
          <div>
            <div className="text-[13.5px] font-semibold">This is placement support, not a job guarantee</div>
            <p className="text-[13px] text-ink-secondary mt-1">
              The ₹{fee} fee covers verification, a mock interview, training and getting your resume in front of hiring companies. Whether you
              are selected is the employer's decision — we do not promise a job, and we never charge you again at any stage.
            </p>
          </div>
        </Card>
      </StaggerItem>

      <StaggerItem className="text-xl font-bold mb-3">What your ₹{fee} unlocks</StaggerItem>
      <StaggerItem className="grid md:grid-cols-3 gap-5 mb-6">
        {UNLOCKS.map(([Icon, title, desc, tone]) => (
          <Card key={title} pad hover>
            <div className="flex items-center justify-between">
              <div className={`w-9 h-9 rounded-[10px] flex items-center justify-center ${TINT[tone]}`}>
                <Icon size={17} />
              </div>
              <Check size={15} className="text-green" />
            </div>
            <div className="text-[15px] font-semibold mt-3">{title}</div>
            <div className="text-xs text-ink-tertiary mt-1 leading-relaxed">{desc}</div>
          </Card>
        ))}
      </StaggerItem>

      <StaggerItem className="mb-6">
        <Card>
          <CardHead>
            <span className="text-[15px] font-semibold">What you will never be charged for</span>
          </CardHead>
          <div className="p-[22px] grid md:grid-cols-3 gap-4">
            {[
              ['Applying to a job', 'Every requirement on your portal is free to apply to.'],
              ['Being shortlisted', 'Employers pay Mzobs for shortlists — you never do.'],
              ['Getting placed', 'No success fee, no cut of your salary. Ever.'],
            ].map(([t, b]) => (
              <div key={t} className="flex gap-2.5">
                <div className="w-[30px] h-[30px] rounded-[9px] bg-green-tint text-green flex items-center justify-center flex-shrink-0">
                  <Check size={14} />
                </div>
                <div>
                  <div className="text-[13px] font-semibold">{t}</div>
                  <div className="text-xs text-ink-tertiary mt-0.5">{b}</div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </StaggerItem>

      <StaggerItem>
        <Card>
          <CardHead>
            <span className="text-[15px] font-semibold">Payment history</span>
          </CardHead>
          <TableWrap className="border-none rounded-none">
            <Table columns={['Description', 'Date', 'Amount', 'Status', '']}>
              {subscription.status === 'paid' ? (
                <Tr>
                  <Td>Mzobs placement programme — one-time fee</Td>
                  <Td>{subscription.paidOn ? new Date(subscription.paidOn).toLocaleDateString('en-IN') : ''}</Td>
                  <Td className="font-bold">{fmtINR(fee)}</Td>
                  <Td>
                    <Badge tone="green">Paid</Badge>
                  </Td>
                  <Td>
                    <Button variant="ghost" size="sm" disabled>
                      <Download size={14} /> Invoice
                    </Button>
                  </Td>
                </Tr>
              ) : (
                <Tr>
                  <Td colSpan={5}>No payment recorded yet.</Td>
                </Tr>
              )}
            </Table>
          </TableWrap>
        </Card>
      </StaggerItem>
    </StaggerGroup>
  )
}
