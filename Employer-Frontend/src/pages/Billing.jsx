import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import { AlertTriangle, CreditCard, Download, FileStack, IndianRupee, Receipt, SkipForward, Users } from 'lucide-react'
import PageHeader from '../components/layout/PageHeader'
import Card, { CardBody, CardHead, CardTitle } from '../components/ui/Card'
import Button from '../components/ui/Button'
import ProgressBar from '../components/ui/ProgressBar'
import { InvoiceStatusBadge } from '../components/ui/StatusBadge'
import { Table, TableWrap, Td, Tr } from '../components/ui/Table'
import EmptyState from '../components/ui/EmptyState'
import ErrorState from '../components/ui/ErrorState'
import { PageSkeleton } from '../components/ui/Skeleton'
import { useBillingSummaryQuery, useInvoicesQuery } from '../hooks/useBilling'
import { useJobsQuery, usePayJobInvoice, useSetJobStatus } from '../hooks/useJobs'
import { fmtDate, fmtINR } from '../lib/utils'

export default function Billing() {
  const navigate = useNavigate()
  const { data: summary, isLoading, isError, refetch } = useBillingSummaryQuery()
  const { data: invoices = [], isLoading: invoicesLoading } = useInvoicesQuery()
  const { data: jobs = [] } = useJobsQuery()
  const payInvoice = usePayJobInvoice()
  const setJobStatus = useSetJobStatus()

  if (isLoading) return <PageSkeleton />
  if (isError || !summary) return <ErrorState onRetry={() => refetch()} />

  const dueJobs = jobs.filter((j) => j.status === 'awaiting_payment')

  return (
    <div>
      <PageHeader
        title="Billing"
        subtitle={`Mzobs charges ${fmtINR(summary.perOpeningFee)} per opening, paid upfront. No plan, no monthly fee, no cut of anyone's salary.`}
      />

      <div className="grid grid-cols-3 gap-5 mb-5 max-lg:grid-cols-1">
        <Card pad className="col-span-2 max-lg:col-span-1">
          <div className="flex items-start justify-between flex-wrap gap-3">
            <div>
              <div className="text-[11.5px] font-semibold tracking-wide uppercase text-ink-tertiary mb-1">Rate Card</div>
              <div className="text-[22px] font-bold tracking-tight">{fmtINR(summary.perOpeningFee)} per opening</div>
              <div className="text-[12.5px] text-ink-secondary mt-1">
                {summary.resumesPerOpening} screened resumes delivered for every opening you pay for
              </div>
            </div>
            <Button variant="secondary" size="sm" onClick={() => toast('Bulk-hiring rates are negotiated with your Mzobs account manager.', { icon: 'ℹ️' })}>
              Discuss bulk rate
            </Button>
          </div>
          <div className="mt-5 pt-5 border-t border-border">
            <div className="flex items-center justify-between text-[13px] mb-2">
              <span className="font-medium">Resumes delivered against paid openings</span>
              <span className="text-ink-secondary tabular-nums">
                {summary.resumesDelivered} / {summary.resumesPromised}
              </span>
            </div>
            <ProgressBar value={summary.resumesDelivered} max={summary.resumesPromised} tone="gold" />
            <p className="text-[12px] text-ink-tertiary mt-2">
              You've paid for {summary.openingsPaid} openings, so Mzobs owes you {summary.resumesPromised} resumes in total.
            </p>
          </div>
        </Card>

        <Card pad>
          <div className="text-[11.5px] font-semibold tracking-wide uppercase text-ink-tertiary mb-1">Payment Method</div>
          <div className="flex items-center gap-3 mt-2.5">
            <span className="w-11 h-8 rounded-md bg-navy-tint text-navy flex items-center justify-center flex-shrink-0"><CreditCard size={16} /></span>
            <div>
              <div className="text-[13.5px] font-semibold">{summary.paymentMethod.brand} •••• {summary.paymentMethod.last4}</div>
              <div className="text-[12px] text-ink-tertiary">Expires {summary.paymentMethod.expiry}</div>
            </div>
          </div>
          <Button variant="secondary" size="sm" className="w-full mt-4" onClick={() => toast.success('Redirecting to update payment method…')}>
            Update Payment Method
          </Button>
        </Card>
      </div>

      {dueJobs.length > 0 && (
        <Card className="mb-5">
          <CardHead>
            <CardTitle>Pending payment for sourcing</CardTitle>
            <span className="text-[12px] text-ink-tertiary">{fmtINR(summary.outstanding)} outstanding</span>
          </CardHead>
          <CardBody className="flex flex-col gap-3">
            {dueJobs.map((job) => (
              <div key={job.id} className="flex items-center gap-3 flex-wrap p-3 border border-border rounded-xl">
                <span className="w-9 h-9 rounded-[10px] bg-amber-tint text-amber flex items-center justify-center flex-shrink-0">
                  <AlertTriangle size={17} />
                </span>
                <div className="flex-1 min-w-[200px]">
                  <div className="text-[13.5px] font-semibold">{job.title}</div>
                  <div className="text-[12px] text-ink-tertiary mt-0.5">
                    {job.vacancies} opening{job.vacancies === 1 ? '' : 's'} × {fmtINR(summary.perOpeningFee)} · unlocks {job.resumesPromised} resumes
                  </div>
                </div>
                <div className="text-[17px] font-bold tracking-tight tabular-nums">{fmtINR(job.feeTotal)}</div>
                <Button variant="secondary" size="sm" loading={setJobStatus.isPending} onClick={() => setJobStatus.mutate({ id: job.id, status: 'sourcing' })}>
                  <SkipForward size={14} /> Skip for now
                </Button>
                <Button variant="primary" size="sm" loading={payInvoice.isPending} onClick={() => payInvoice.mutate(job.id)}>
                  <IndianRupee size={14} /> Pay now
                </Button>
              </div>
            ))}
          </CardBody>
        </Card>
      )}

      <div className="grid grid-cols-4 gap-4 mb-5 max-md:grid-cols-2">
        <StatCard icon={IndianRupee} label="Total Billed" value={fmtINR(summary.totalBilled)} tone="navy" />
        <StatCard icon={Users} label="Openings Paid For" value={summary.openingsPaid} tone="green" />
        <StatCard icon={FileStack} label="Resumes Received" value={summary.resumesDelivered} tone="gold" />
        <StatCard icon={AlertTriangle} label="Outstanding" value={fmtINR(summary.outstanding)} tone="gold" />
      </div>

      <Card>
        <CardHead>
          <CardTitle>Payment History</CardTitle>
          <button onClick={() => navigate('/jobs')} className="text-[12.5px] font-semibold text-navy hover:underline">
            View requirements
          </button>
        </CardHead>
        {invoicesLoading ? (
          <CardBody><EmptyState title="Loading invoices…" /></CardBody>
        ) : invoices.length === 0 ? (
          <EmptyState icon={Receipt} title="No invoices yet" body="Invoices appear here once Mzobs approves your first requirement." />
        ) : (
          <TableWrap className="rounded-none border-0">
            <Table columns={['Invoice', 'Requirement', 'Date', 'Amount', 'Status', '']}>
              {invoices.map((inv) => (
                <Tr key={inv.id}>
                  <Td className="font-semibold">{inv.id}</Td>
                  <Td>{inv.description}</Td>
                  <Td>{fmtDate(inv.date)}</Td>
                  <Td>{fmtINR(inv.amount)}</Td>
                  <Td><InvoiceStatusBadge status={inv.status} /></Td>
                  <Td className="text-right">
                    <Button variant="ghost" size="sm" onClick={() => toast.success(`Downloading ${inv.id}.pdf`)}>
                      <Download size={14} /> PDF
                    </Button>
                  </Td>
                </Tr>
              ))}
            </Table>
          </TableWrap>
        )}
      </Card>
    </div>
  )
}

function StatCard({ icon: Icon, label, value, tone }) {
  const style = { navy: { bg: 'var(--color-navy-tint)', fg: 'var(--color-navy)' }, green: { bg: 'var(--color-green-tint)', fg: 'var(--color-green)' }, gold: { bg: 'var(--color-gold-tint)', fg: 'var(--color-gold-strong)' } }[tone]
  return (
    <Card pad className="flex items-center gap-3.5">
      <span className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: style.bg, color: style.fg }}>
        <Icon size={18} />
      </span>
      <div>
        <div className="text-[11.5px] text-ink-secondary font-medium">{label}</div>
        <div className="text-[17px] font-bold tracking-tight tabular-nums">{value}</div>
      </div>
    </Card>
  )
}
