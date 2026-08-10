import { useMemo, useState } from 'react'
import { Download, IndianRupee, Users, Building2, AlertTriangle } from 'lucide-react'
import Card, { CardHead } from '../../components/ui/Card'
import Badge from '../../components/ui/Badge'
import Button from '../../components/ui/Button'
import CountUp from '../../components/ui/CountUp'
import AreaLineChart from '../../components/ui/Charts'
import { PillTabs } from '../../components/ui/Tabs'
import { TableWrap, Table, Tr, Td } from '../../components/ui/Table'
import { StaggerGroup, StaggerItem } from '../../components/ui/Stagger'
import { useApp } from '../../context/AppContext'
import { openRecordPaymentModal } from '../../lib/mzobsModals'
import { CANDIDATES, JOB_POSTS, PAYMENTS, PRICING, REVENUE_TREND, companyOf } from '../../lib/mzobsData'
import { fmtINR } from '../../lib/utils'

const TABS = ['All', 'Employer invoices', 'Candidate subscriptions', 'Outstanding']

export default function Payments() {
  const app = useApp()
  const [tab, setTab] = useState(0)

  const rows = useMemo(() => {
    if (tab === 1) return PAYMENTS.filter((p) => p.type === 'employer')
    if (tab === 2) return PAYMENTS.filter((p) => p.type === 'candidate')
    if (tab === 3) return PAYMENTS.filter((p) => p.status !== 'paid')
    return PAYMENTS
  }, [tab])

  const employerCollected = PAYMENTS.filter((p) => p.type === 'employer' && p.status === 'paid').reduce((n, p) => n + p.amount, 0)
  const outstanding = PAYMENTS.filter((p) => p.status !== 'paid').reduce((n, p) => n + p.amount, 0)
  const subscribers = CANDIDATES.filter((c) => c.subscription.status === 'paid').length
  const unpaidJobs = JOB_POSTS.filter((j) => j.feeStatus === 'unpaid' && j.status !== 'pending_review')

  return (
    <StaggerGroup>
      <StaggerItem className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Payments</h1>
        <p className="text-sm text-ink-secondary mt-1">
          Two revenue lines: ₹{PRICING.candidateFee} one-time from each candidate, and {fmtINR(PRICING.perOpeningFee)} per opening from each employer.
        </p>
      </StaggerItem>

      <StaggerItem className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
        <Card hover pad>
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold tracking-wide uppercase text-ink-tertiary">Employer revenue</span>
            <Building2 size={15} className="text-navy" />
          </div>
          <div className="text-[28px] font-bold tracking-tight mt-2 text-navy">
            <CountUp value={employerCollected} prefix="₹" />
          </div>
          <div className="text-[11px] text-ink-tertiary mt-1">Collected across paid requirements</div>
        </Card>
        <Card hover pad>
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold tracking-wide uppercase text-ink-tertiary">Subscription revenue</span>
            <Users size={15} className="text-gold-strong" />
          </div>
          <div className="text-[28px] font-bold tracking-tight mt-2 text-gold-strong">
            <CountUp value={subscribers * PRICING.candidateFee} prefix="₹" />
          </div>
          <div className="text-[11px] text-ink-tertiary mt-1">
            {subscribers} candidates × ₹{PRICING.candidateFee}
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
          <div className="text-[11px] text-ink-tertiary mt-1">Sourcing paused until cleared</div>
        </Card>
        <Card hover pad>
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold tracking-wide uppercase text-ink-tertiary">Rate card</span>
            <IndianRupee size={15} className="text-green" />
          </div>
          <div className="text-[17px] font-bold tracking-tight mt-2.5">₹{PRICING.candidateFee} / candidate</div>
          <div className="text-[17px] font-bold tracking-tight">{fmtINR(PRICING.perOpeningFee)} / opening</div>
        </Card>
      </StaggerItem>

      {unpaidJobs.length > 0 && (
        <StaggerItem className="mb-5">
          <Card>
            <CardHead>
              <span className="text-[15px] font-semibold">Invoices to chase</span>
              <span className="text-xs text-ink-tertiary">{unpaidJobs.length} requirement{unpaidJobs.length === 1 ? '' : 's'} on hold</span>
            </CardHead>
            <div className="p-[22px] flex flex-col gap-3">
              {unpaidJobs.map((j) => {
                const co = companyOf(j.companyId)
                return (
                  <div key={j.id} className="flex items-center gap-3 p-3 border border-border rounded-xl flex-wrap">
                    <div className="w-9 h-9 rounded-[10px] bg-navy-tint text-navy flex items-center justify-center text-[11px] font-bold flex-shrink-0">{co.logo}</div>
                    <div className="flex-1 min-w-[200px]">
                      <div className="text-[13.5px] font-semibold">
                        {j.title} · {co.name}
                      </div>
                      <div className="text-xs text-ink-tertiary mt-0.5">
                        {j.openings} openings × {fmtINR(PRICING.perOpeningFee)} · Raised {j.postedOn}
                      </div>
                    </div>
                    <div className="text-[15px] font-bold tracking-tight">{fmtINR(j.fee)}</div>
                    <Button size="sm" variant="gold" onClick={() => openRecordPaymentModal(app, j)}>
                      Record payment
                    </Button>
                  </div>
                )
              })}
            </div>
          </Card>
        </StaggerItem>
      )}

      <StaggerItem className="mb-5">
        <Card>
          <CardHead>
            <span className="text-[15px] font-semibold">Revenue trend</span>
            <span className="text-xs text-ink-tertiary">Both lines combined, last 6 months</span>
          </CardHead>
          <div className="px-[10px] pt-4 pb-2">
            <AreaLineChart data={REVENUE_TREND} height={232} formatValue={(v) => fmtINR(v)} />
          </div>
        </Card>
      </StaggerItem>

      <StaggerItem className="mb-4">
        <PillTabs items={TABS} active={tab} onChange={setTab} />
      </StaggerItem>

      <StaggerItem>
        <Card>
          <TableWrap className="border-none rounded-none">
            <Table columns={['Reference', 'Party', 'Description', 'Date', 'Amount', 'Status', '']}>
              {rows.map((p) => (
                <Tr key={p.id}>
                  <Td className="font-semibold">{p.id}</Td>
                  <Td>
                    <div className="flex items-center gap-2">
                      {p.type === 'employer' ? <Building2 size={13} className="text-navy" /> : <Users size={13} className="text-gold-strong" />}
                      {p.party}
                    </div>
                  </Td>
                  <Td>{p.desc}</Td>
                  <Td>{p.date}</Td>
                  <Td className="font-bold">{fmtINR(p.amount)}</Td>
                  <Td>
                    <Badge tone={p.status === 'paid' ? 'green' : 'red'}>{p.status === 'paid' ? 'Paid' : 'Due'}</Badge>
                  </Td>
                  <Td className="text-right">
                    <Button variant="ghost" size="sm" onClick={() => app.addToast('success', `Downloading ${p.id}.pdf`)}>
                      <Download size={14} /> PDF
                    </Button>
                  </Td>
                </Tr>
              ))}
            </Table>
          </TableWrap>
        </Card>
      </StaggerItem>
    </StaggerGroup>
  )
}
