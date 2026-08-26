import { useMemo, useState } from 'react'
import { IndianRupee, Users, Building2, AlertTriangle } from 'lucide-react'
import Card, { CardHead } from '../../components/ui/Card'
import Badge from '../../components/ui/Badge'
import Button from '../../components/ui/Button'
import CountUp from '../../components/ui/CountUp'
import { PillTabs } from '../../components/ui/Tabs'
import EmptyState from '../../components/ui/EmptyState'
import { TableWrap, Table, Tr, Td } from '../../components/ui/Table'
import { StaggerGroup, StaggerItem } from '../../components/ui/Stagger'
import { PageSkeleton } from '../../components/ui/Skeleton'
import ErrorState from '../../components/ui/ErrorState'
import { useApp } from '../../context/AppContext'
import { usePaymentsQuery, useRecordSubscriptionPaymentMutation } from '../../hooks/usePayments'
import { fmtINR } from '../../lib/utils'

const TABS = ['All', 'Employer invoices', 'Candidate subscriptions', 'Outstanding']

export default function Payments() {
  const app = useApp()
  const [tab, setTab] = useState(0)
  const { data: payments = [], isLoading, isError, refetch } = usePaymentsQuery()
  const recordSubscription = useRecordSubscriptionPaymentMutation()

  const rows = useMemo(() => {
    if (tab === 1) return payments.filter((p) => p.type === 'employer')
    if (tab === 2) return payments.filter((p) => p.type === 'candidate')
    if (tab === 3) return payments.filter((p) => p.status !== 'paid')
    return payments
  }, [payments, tab])

  if (isLoading) return <PageSkeleton />
  if (isError) return <ErrorState onRetry={refetch} />

  const employerCollected = payments.filter((p) => p.type === 'employer' && p.status === 'paid').reduce((n, p) => n + p.amount, 0)
  const subscriptionRevenue = payments.filter((p) => p.type === 'candidate' && p.status === 'paid').reduce((n, p) => n + p.amount, 0)
  const outstanding = payments.filter((p) => p.status !== 'paid').reduce((n, p) => n + p.amount, 0)
  const unpaidCandidates = payments.filter((p) => p.type === 'candidate' && p.status !== 'paid')

  function recordCandidatePayment(p) {
    recordSubscription.mutate(p.id, {
      onSuccess: () => app.addToast('success', `${fmtINR(p.amount)} recorded for ${p.party}`),
      onError: (err) => app.addToast('error', err.response?.data?.message ?? 'Something went wrong'),
    })
  }

  return (
    <StaggerGroup>
      <StaggerItem className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Payments</h1>
        <p className="text-sm text-ink-secondary mt-1">Every rupee in one place — candidate subscriptions and employer invoices.</p>
      </StaggerItem>

      <StaggerItem className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-5">
        <Card hover pad>
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold tracking-wide uppercase text-ink-tertiary">Employer revenue</span>
            <Building2 size={15} className="text-navy" />
          </div>
          <div className="text-[28px] font-bold tracking-tight mt-2 text-navy">
            <CountUp value={employerCollected} prefix="₹" />
          </div>
        </Card>
        <Card hover pad>
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold tracking-wide uppercase text-ink-tertiary">Subscription revenue</span>
            <Users size={15} className="text-gold-strong" />
          </div>
          <div className="text-[28px] font-bold tracking-tight mt-2 text-gold-strong">
            <CountUp value={subscriptionRevenue} prefix="₹" />
          </div>
        </Card>
        <Card hover pad>
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold tracking-wide uppercase text-ink-tertiary">Outstanding</span>
            <AlertTriangle size={15} className="text-red" />
          </div>
          <div className="text-[28px] font-bold tracking-tight mt-2 text-red">
            <CountUp value={outstanding} prefix="₹" />
          </div>
        </Card>
      </StaggerItem>

      {unpaidCandidates.length > 0 && (
        <StaggerItem className="mb-5">
          <Card>
            <CardHead>
              <span className="text-[15px] font-semibold">Candidate subscriptions to chase</span>
              <span className="text-xs text-ink-tertiary">{unpaidCandidates.length} unpaid</span>
            </CardHead>
            <div className="p-[22px] flex flex-col gap-3">
              {unpaidCandidates.map((p) => (
                <div key={p.id} className="flex items-center gap-3 p-3 border border-border rounded-xl flex-wrap">
                  <div className="w-9 h-9 rounded-[10px] bg-gold-tint text-gold-strong flex items-center justify-center flex-shrink-0">
                    <Users size={15} />
                  </div>
                  <div className="flex-1 min-w-[200px]">
                    <div className="text-[13.5px] font-semibold">{p.party}</div>
                    <div className="text-xs text-ink-tertiary mt-0.5">{p.desc}</div>
                  </div>
                  <div className="text-[15px] font-bold tracking-tight">{fmtINR(p.amount)}</div>
                  <Button size="sm" variant="gold" onClick={() => recordCandidatePayment(p)} disabled={recordSubscription.isPending}>
                    Record payment
                  </Button>
                </div>
              ))}
            </div>
          </Card>
        </StaggerItem>
      )}

      <StaggerItem className="mb-4">
        <PillTabs items={TABS} active={tab} onChange={setTab} />
      </StaggerItem>

      <StaggerItem>
        {rows.length === 0 ? (
          <Card>
            <EmptyState icon={IndianRupee} title="No payments here" body="Nothing matches this filter right now." />
          </Card>
        ) : (
          <Card>
            <TableWrap className="border-none rounded-none">
              <Table columns={['Party', 'Description', 'Date', 'Amount', 'Status', '']}>
                {rows.map((p) => (
                  <Tr key={p.id}>
                    <Td>
                      <div className="flex items-center gap-2">
                        {p.type === 'employer' ? <Building2 size={13} className="text-navy" /> : <Users size={13} className="text-gold-strong" />}
                        {p.party}
                      </div>
                    </Td>
                    <Td>{p.desc}</Td>
                    <Td>{p.date ? new Date(p.date).toLocaleDateString('en-IN') : ''}</Td>
                    <Td className="font-bold">{fmtINR(p.amount)}</Td>
                    <Td>
                      <Badge tone={p.status === 'paid' ? 'green' : 'red'}>{p.status === 'paid' ? 'Paid' : 'Due'}</Badge>
                    </Td>
                    <Td className="text-right">
                      {p.type === 'candidate' && p.status !== 'paid' && (
                        <Button size="sm" onClick={() => recordCandidatePayment(p)}>
                          Record
                        </Button>
                      )}
                    </Td>
                  </Tr>
                ))}
              </Table>
            </TableWrap>
          </Card>
        )}
      </StaggerItem>
    </StaggerGroup>
  )
}
