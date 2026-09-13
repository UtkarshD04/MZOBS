import { useState } from 'react'
import { CheckCircle2, ShieldCheck, IndianRupee, Receipt, Wallet, Tag, ArrowUpRight, LockKeyhole, UsersRound, TrendingUp } from 'lucide-react'
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
import { useCreditBalanceQuery, useCreditPlansQuery, useCreditPurchasesQuery, useUnlocksQuery, useBuyCreditPlan } from '../hooks/useCvCredits'
import { fmtDate, fmtINR } from '../lib/utils'

const paymentStatusTone = { paid: 'green', created: 'amber', failed: 'red' }
const paymentStatusLabel = { paid: 'Paid', created: 'Pending', failed: 'Failed' }

export default function CvCredits() {
  const { data: balanceData, isLoading, isError, refetch } = useCreditBalanceQuery()
  const { data: plansData } = useCreditPlansQuery()
  const { data: purchases = [] } = useCreditPurchasesQuery()
  const { data: unlocks = [] } = useUnlocksQuery()
  const buyPlan = useBuyCreditPlan()
  const [buyTarget, setBuyTarget] = useState(null)
  const [couponResult, setCouponResult] = useState(null)

  if (isLoading) return <PageSkeleton />
  if (isError || !balanceData) return <ErrorState onRetry={() => refetch()} />

  const wallet = balanceData.wallet
  const plans = plansData?.plans ?? []
  const rupeesPerCredit = balanceData.rupeesPerCredit ?? 25
  const lowBalance = wallet.remainingCredits <= 5
  const useRate = wallet.totalCredits ? Math.round((wallet.usedCredits / wallet.totalCredits) * 100) : 0
  const popularPlanId = plans.length ? plans.reduce((a, b) => (b.creditsGranted > a.creditsGranted ? b : a)).id : null

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

      <section className="mb-7 overflow-hidden rounded-2xl border border-navy/15 bg-gradient-to-br from-navy to-navy-900 text-white shadow-md">
        <div className="grid grid-cols-[1.25fr_.75fr] max-lg:grid-cols-1">
          <div className="relative p-7 sm:p-8 overflow-hidden">
            <div aria-hidden="true" className="absolute -right-10 -top-10 h-48 w-48 rounded-full border border-white/10" />
            <div aria-hidden="true" className="absolute right-24 -bottom-20 h-48 w-48 rounded-full bg-teal/20 blur-3xl" />
            <div className="relative">
              <div className="flex items-center gap-2 text-[11px] font-bold tracking-[0.14em] uppercase text-white/60"><Wallet size={14} /> CV access wallet</div>
              <div className="mt-5 flex items-end gap-3">
                <span className="text-6xl font-bold tracking-tight leading-none tabular-nums">{wallet.remainingCredits}</span>
                <span className="pb-1.5 text-sm font-medium text-white/70">CV credits available</span>
              </div>
              <div className="mt-6 max-w-md">
                <div className="flex justify-between text-[11.5px] text-white/60"><span>{wallet.usedCredits} profiles unlocked</span><span>{wallet.totalCredits} credits purchased</span></div>
                <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/15"><div className="h-full rounded-full bg-teal" style={{ width: `${useRate}%` }} /></div>
              </div>
              <p className="mt-5 text-[12.5px] text-white/65">One credit unlocks one candidate's phone, email and CV forever. No renewal or repeat deduction.</p>
            </div>
          </div>
          <div className="border-l border-white/10 bg-black/10 p-6 max-lg:border-l-0 max-lg:border-t max-lg:border-white/10 sm:p-8">
            <p className="text-[11px] font-bold tracking-[0.14em] uppercase text-white/55">Recruiter activity</p>
            <div className="mt-5 space-y-4">
              <WalletStat icon={UsersRound} label="Profiles unlocked" value={wallet.usedCredits} />
              <WalletStat icon={Wallet} label="Total credits purchased" value={wallet.totalCredits} />
              <WalletStat icon={IndianRupee} label="Cost per profile" value={fmtINR(rupeesPerCredit)} />
            </div>
          </div>
        </div>
      </section>

      {lowBalance && (
        <div className="mb-6 flex items-center gap-3 rounded-xl border border-amber/30 bg-amber-tint px-4 py-3 text-[12.5px] font-medium text-amber">
          <LockKeyhole size={16} className="flex-shrink-0" />
          {wallet.remainingCredits === 0
            ? "You're out of CV credits. Buy a pack below to keep unlocking candidates."
            : `Running low — only ${wallet.remainingCredits} CV credit${wallet.remainingCredits === 1 ? '' : 's'} left. Top up to avoid interruptions.`}
        </div>
      )}

      <Card className="mb-6">
        <CardBody className="flex items-start gap-2.5 text-[12.5px] text-ink-secondary leading-relaxed">
          <ShieldCheck size={15} className="text-navy mt-0.5 flex-shrink-0" />
          One credit unlocks a candidate's contact details and verified CV. Access remains available for your company after unlock.
        </CardBody>
      </Card>

      <div className="mb-4 flex items-end justify-between gap-4 flex-wrap"><div><div className="flex items-center gap-2 text-[13px] font-semibold text-ink-secondary"><Tag size={15} /> Credit packs</div><h2 className="mt-1 text-xl font-bold tracking-tight">Choose how many profiles you need</h2></div><span className="text-[12px] text-ink-tertiary">Flat rate · {fmtINR(rupeesPerCredit)} per verified CV</span></div>
      <div className="grid grid-cols-3 gap-5 mb-6 max-xl:grid-cols-1">
        {plans.map((plan) => (
          <Card key={plan.id} pad hover className="relative flex flex-col overflow-hidden border-border-strong">
            {plan.id === popularPlanId && <span className="absolute right-0 top-0 rounded-bl-xl bg-navy px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-white">Most popular</span>}
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
              Buy credits <ArrowUpRight size={15} />
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

      <div className="mt-6 grid grid-cols-[.92fr_1.08fr] gap-5 max-xl:grid-cols-1">
        <Card>
          <CardHead><CardTitle>How CV access works</CardTitle></CardHead>
          <CardBody className="space-y-4">
            <CreditStep number="01" title="Search verified talent" text="Review skills, work history and a masked contact preview before spending." />
            <CreditStep number="02" title="Unlock once" text={`Use one ${fmtINR(rupeesPerCredit)} credit to reveal contact details and resume access.`} />
            <CreditStep number="03" title="Keep access forever" text="That profile stays unlocked for your company. No repeat charge on views or downloads." />
          </CardBody>
        </Card>
        <Card>
          <CardHead><CardTitle>Recently unlocked profiles</CardTitle></CardHead>
          {unlocks.length === 0 ? <EmptyState icon={TrendingUp} title="No profiles unlocked yet" body="Unlock a candidate from Applicants and the activity will appear here." /> : (
            <div>{unlocks.slice(0, 4).map((unlock) => <div key={unlock.id} className="flex items-center gap-3 px-[22px] py-3.5 border-b border-border last:border-0"><span className="w-8 h-8 rounded-full bg-navy-tint text-navy flex items-center justify-center text-[11px] font-bold">{unlock.candidate?.name?.split(' ').map((x) => x[0]).slice(0, 2).join('') ?? 'CV'}</span><div className="min-w-0 flex-1"><p className="text-[13px] font-semibold truncate">{unlock.candidate?.name ?? 'Candidate'}</p><p className="text-[11.5px] text-ink-tertiary truncate">{unlock.candidate?.headline ?? unlock.job?.title ?? 'Profile unlocked'}</p></div><span className="text-[11px] text-ink-tertiary">{fmtDate(unlock.createdAt)}</span></div>)}</div>
          )}
        </Card>
      </div>

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

function WalletStat({ icon: Icon, label, value }) {
  return <div className="flex items-center gap-3"><span className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-teal"><Icon size={15} /></span><div><p className="text-[11px] text-white/50">{label}</p><p className="text-[13px] font-semibold text-white">{value}</p></div></div>
}

function CreditStep({ number, title, text }) {
  return <div className="flex gap-3"><span className="text-[11px] font-bold text-navy">{number}</span><div><p className="text-[13px] font-semibold">{title}</p><p className="mt-0.5 text-[12px] leading-relaxed text-ink-secondary">{text}</p></div></div>
}
