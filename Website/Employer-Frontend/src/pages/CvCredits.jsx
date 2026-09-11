import { useState } from 'react'
import { CheckCircle2, ShieldCheck, IndianRupee, Receipt, Wallet, Tag } from 'lucide-react'
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
import { useCreditBalanceQuery, useCreditPlansQuery, useCreditPurchasesQuery, useBuyCreditPlan } from '../hooks/useCvCredits'
import { fmtDate, fmtINR } from '../lib/utils'

const paymentStatusTone = { paid: 'green', created: 'amber', failed: 'red' }
const paymentStatusLabel = { paid: 'Paid', created: 'Pending', failed: 'Failed' }

export default function CvCredits() {
  const { data: balanceData, isLoading, isError, refetch } = useCreditBalanceQuery()
  const { data: plansData } = useCreditPlansQuery()
  const { data: purchases = [] } = useCreditPurchasesQuery()
  const buyPlan = useBuyCreditPlan()
  const [buyTarget, setBuyTarget] = useState(null)
  const [couponResult, setCouponResult] = useState(null)

  if (isLoading) return <PageSkeleton />
  if (isError || !balanceData) return <ErrorState onRetry={() => refetch()} />

  const wallet = balanceData.wallet
  const plans = plansData?.plans ?? []
  const rupeesPerCredit = balanceData.rupeesPerCredit ?? 25
  const lowBalance = wallet.remainingCredits <= 5

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
    buyPlan.mutate(
      { planId: buyTarget.id, couponCode: couponResult?.code },
      { onSuccess: closeBuyModal }
    )
  }

  return (
    <div>
      <PageHeader title="CV Credits" subtitle={`Unlock a candidate's contact details & resume for ${fmtINR(rupeesPerCredit)}/CV — pay once per candidate, view unlimited times after.`} />

      <Card className="mb-5">
        <CardBody className="flex items-start justify-between gap-4 flex-wrap">
          <div className="flex items-start gap-3.5">
            <span className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${lowBalance ? 'bg-amber-tint text-amber' : 'bg-navy-tint text-navy'}`}>
              <Wallet size={20} />
            </span>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <div className="text-[30px] font-bold tracking-tight leading-none">{wallet.remainingCredits}</div>
                <span className="text-[13px] text-ink-secondary">credits remaining</span>
                {lowBalance && <Badge tone="amber">Running low</Badge>}
              </div>
              <div className="text-[12.5px] text-ink-secondary mt-1.5">
                {wallet.totalCredits} purchased in total · {wallet.usedCredits} used
                {wallet.planName && <span className="text-ink-tertiary"> · Last plan: {wallet.planName}</span>}
              </div>
            </div>
          </div>
        </CardBody>
      </Card>

      <div className="mb-2 flex items-center gap-2 text-[13px] font-semibold text-ink-secondary">
        <Tag size={15} /> Buy CV credits
      </div>
      <div className="grid grid-cols-3 gap-5 mb-6 max-xl:grid-cols-1">
        {plans.map((plan) => (
          <Card key={plan.id} pad hover className="flex flex-col">
            <div className="text-[11.5px] font-semibold tracking-wide uppercase text-ink-tertiary">{plan.name}</div>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-[28px] font-bold tracking-tight">{fmtINR(plan.amountRupees)}</span>
            </div>
            <div className="text-[12.5px] text-ink-secondary mt-1">{plan.creditsGranted} CV credits</div>
            <div className="text-[11.5px] text-ink-tertiary mt-0.5">{fmtINR(plan.rupeesPerCredit)} per CV unlock</div>

            <ul className="mt-4 flex flex-col gap-2 flex-1">
              <li className="flex items-start gap-2 text-[12.5px]">
                <CheckCircle2 size={15} className="text-navy mt-0.5 flex-shrink-0" /> Unlock {plan.creditsGranted} candidate profiles
              </li>
              <li className="flex items-start gap-2 text-[12.5px]">
                <CheckCircle2 size={15} className="text-navy mt-0.5 flex-shrink-0" /> Unlimited views after unlock, no expiry
              </li>
            </ul>

            <Button variant="primary" size="md" className="w-full mt-4" onClick={() => openBuyModal(plan)}>
              <IndianRupee size={15} /> Buy {plan.name}
            </Button>
          </Card>
        ))}
      </div>

      <Card className="mb-5">
        <CardBody className="flex items-center gap-2 text-[12px] text-ink-tertiary">
          <ShieldCheck size={14} /> Secure payment via Razorpay. Credits never expire and are only ever spent when you unlock a new candidate.
        </CardBody>
      </Card>

      <Card>
        <CardHead><CardTitle>Purchase History</CardTitle></CardHead>
        {purchases.length === 0 ? (
          <EmptyState icon={Receipt} title="No purchases yet" body="Your CV-credit purchases will appear here." />
        ) : (
          <TableWrap className="rounded-none border-0">
            <Table columns={['Receipt', 'Plan', 'Date', 'Amount', 'Status']}>
              {purchases.map((p) => (
                <Tr key={p.id}>
                  <Td className="font-semibold">{p.receipt}</Td>
                  <Td>{p.creditPlan?.name ?? '—'} {p.creditsGranted ? `(${p.creditsGranted} credits)` : ''}</Td>
                  <Td>{fmtDate(p.createdAt)}</Td>
                  <Td>
                    {fmtINR(p.amount)}
                    {p.couponCode && <span className="text-[11px] text-ink-tertiary ml-1.5">({p.couponCode})</span>}
                  </Td>
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
        title={buyTarget ? `Buy ${buyTarget.name}` : ''}
        subtitle={buyTarget ? `${buyTarget.creditsGranted} CV credits · ${fmtINR(buyTarget.rupeesPerCredit)} per unlock` : ''}
        size="sm"
        footer={
          <>
            <Button variant="secondary" size="sm" onClick={closeBuyModal}>Cancel</Button>
            <Button variant="primary" size="sm" loading={buyPlan.isPending} onClick={confirmPurchase}>
              <IndianRupee size={14} /> Pay {fmtINR(couponResult?.finalAmount ?? buyTarget?.amountRupees ?? 0)}
            </Button>
          </>
        }
      >
        {buyTarget && (
          <>
            <div className="flex items-baseline gap-2 mb-4">
              <span className="text-[26px] font-bold tracking-tight">{fmtINR(couponResult?.finalAmount ?? buyTarget.amountRupees)}</span>
              {couponResult && <span className="text-[13px] text-ink-tertiary line-through">{fmtINR(buyTarget.amountRupees)}</span>}
            </div>
            <CouponBox planId={buyTarget.id} applied={couponResult} onApply={setCouponResult} onRemove={() => setCouponResult(null)} />
          </>
        )}
      </Modal>
    </div>
  )
}
