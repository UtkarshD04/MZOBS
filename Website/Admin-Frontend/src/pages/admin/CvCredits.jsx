import { useState } from 'react'
import { Wallet, Users, Receipt, TrendingUp, Plus } from 'lucide-react'
import Card, { CardHead } from '../../components/ui/Card'
import Badge from '../../components/ui/Badge'
import Button from '../../components/ui/Button'
import CountUp from '../../components/ui/CountUp'
import { PillTabs } from '../../components/ui/Tabs'
import { TableWrap, Table, Tr, Td } from '../../components/ui/Table'
import { StaggerGroup, StaggerItem } from '../../components/ui/Stagger'
import { PageSkeleton } from '../../components/ui/Skeleton'
import ErrorState from '../../components/ui/ErrorState'
import EmptyState from '../../components/ui/EmptyState'
import { ModalHead, ModalBody, ModalFoot } from '../../components/ui/Modal'
import { Field, Input, Select, Textarea } from '../../components/ui/Field'
import { useApp } from '../../context/AppContext'
import { useCreditSummaryQuery, useCreditPurchasesQuery, useCvUnlocksQuery, useAdjustCreditsMutation } from '../../hooks/useCvCreditAdmin'
import { useCompaniesQuery } from '../../hooks/useCompanies'
import { fmtINR } from '../../lib/utils'

const TABS = ['Purchases', 'Unlocks']
const STATUS_OPTIONS = ['all', 'paid', 'created', 'failed']

function AdjustCreditsModal({ app }) {
  const [search, setSearch] = useState('')
  const [companyId, setCompanyId] = useState('')
  const [direction, setDirection] = useState('add')
  const [amount, setAmount] = useState('')
  const [reason, setReason] = useState('')
  const { data: companies = [] } = useCompaniesQuery({ search })
  const adjust = useAdjustCreditsMutation()

  const selectedCompany = companies.find((c) => c.id === companyId)
  const valid = companyId && Number(amount) > 0 && reason.trim().length > 0

  function submit() {
    const delta = direction === 'add' ? Number(amount) : -Number(amount)
    adjust.mutate(
      { companyId, delta, reason: reason.trim() },
      {
        onSuccess: () => {
          app.addToast('success', `${direction === 'add' ? 'Added' : 'Deducted'} ${amount} credit${amount === '1' ? '' : 's'} for ${selectedCompany?.name ?? 'employer'}`)
          app.closeModal()
        },
        onError: (err) => app.addToast('error', err.response?.data?.message ?? 'Something went wrong'),
      }
    )
  }

  return (
    <>
      <ModalHead title="Manually adjust CV credits" onClose={app.closeModal} />
      <ModalBody>
        <Field label="Employer" hint="Search by company name.">
          <Input value={search} onChange={(e) => { setSearch(e.target.value); setCompanyId('') }} placeholder="Search companies…" />
        </Field>
        {search && !companyId && (
          <div className="border border-border rounded-lg max-h-40 overflow-y-auto mb-4 -mt-2">
            {companies.length === 0 ? (
              <div className="px-3 py-2.5 text-xs text-ink-tertiary">No companies match "{search}"</div>
            ) : (
              companies.map((c) => (
                <button
                  key={c.id}
                  onClick={() => { setCompanyId(c.id); setSearch(c.name) }}
                  className="w-full text-left px-3 py-2.5 text-[13px] hover:bg-surface-hover border-b border-border last:border-b-0"
                >
                  {c.name}
                </button>
              ))
            )}
          </div>
        )}
        {selectedCompany && <div className="text-xs text-green mb-4">Selected: {selectedCompany.name}</div>}

        <div className="grid grid-cols-2 gap-3">
          <Field label="Direction">
            <Select value={direction} onChange={(e) => setDirection(e.target.value)}>
              <option value="add">Add credits</option>
              <option value="deduct">Deduct credits</option>
            </Select>
          </Field>
          <Field label="Credits">
            <Input type="number" min="1" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="e.g. 10" />
          </Field>
        </div>
        <Field label="Reason" hint="Required — this becomes a permanent CreditLedger entry, visible to the employer's audit trail.">
          <Textarea value={reason} onChange={(e) => setReason(e.target.value)} placeholder="e.g. Goodwill credit for a resume-quality issue" />
        </Field>
      </ModalBody>
      <ModalFoot>
        <Button onClick={app.closeModal} disabled={adjust.isPending}>Cancel</Button>
        <Button variant="primary" onClick={submit} disabled={!valid || adjust.isPending}>
          {adjust.isPending ? 'Saving...' : direction === 'add' ? 'Add credits' : 'Deduct credits'}
        </Button>
      </ModalFoot>
    </>
  )
}

export default function CvCredits() {
  const app = useApp()
  const [tab, setTab] = useState(0)
  const [status, setStatus] = useState('all')
  const [search, setSearch] = useState('')

  const { data: summary, isLoading: summaryLoading, isError: summaryError, refetch: refetchSummary } = useCreditSummaryQuery()
  const { data: purchases = [], isLoading: purchasesLoading } = useCreditPurchasesQuery(status !== 'all' ? { status } : {})
  const { data: unlocks = [], isLoading: unlocksLoading } = useCvUnlocksQuery()

  if (summaryLoading) return <PageSkeleton />
  if (summaryError) return <ErrorState onRetry={refetchSummary} />

  const rows = tab === 0 ? purchases : unlocks
  const isLoading = tab === 0 ? purchasesLoading : unlocksLoading

  const filteredRows = search
    ? rows.filter((r) => {
        const needle = search.toLowerCase()
        const employer = (r.company?.name ?? '').toLowerCase()
        const candidate = (r.candidate?.name ?? '').toLowerCase()
        const plan = (r.creditPlan?.name ?? '').toLowerCase()
        return employer.includes(needle) || candidate.includes(needle) || plan.includes(needle)
      })
    : rows

  return (
    <StaggerGroup>
      <StaggerItem className="flex items-start justify-between gap-5 flex-wrap mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">CV Credits</h1>
          <p className="text-sm text-ink-secondary mt-1">Employer CV-credit purchases, unlocks and manual balance adjustments — ₹25 per CV unlock.</p>
        </div>
        <Button variant="primary" onClick={() => app.openModal(<AdjustCreditsModal app={app} />)}>
          <Plus size={15} /> Adjust credits
        </Button>
      </StaggerItem>

      <StaggerItem className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
        <Card hover pad>
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold tracking-wide uppercase text-ink-tertiary">Credit revenue</span>
            <TrendingUp size={15} className="text-navy" />
          </div>
          <div className="text-[26px] font-bold tracking-tight mt-2 text-navy"><CountUp value={summary.totalRevenue} prefix="₹" /></div>
        </Card>
        <Card hover pad>
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold tracking-wide uppercase text-ink-tertiary">CV unlocks</span>
            <Users size={15} className="text-gold-strong" />
          </div>
          <div className="text-[26px] font-bold tracking-tight mt-2 text-gold-strong"><CountUp value={summary.totalUnlocks} /></div>
        </Card>
        <Card hover pad>
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold tracking-wide uppercase text-ink-tertiary">Outstanding credits</span>
            <Wallet size={15} className="text-teal" />
          </div>
          <div className="text-[26px] font-bold tracking-tight mt-2 text-teal"><CountUp value={summary.outstandingCredits} /></div>
        </Card>
        <Card hover pad>
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold tracking-wide uppercase text-ink-tertiary">Purchases</span>
            <Receipt size={15} className="text-violet" />
          </div>
          <div className="text-[26px] font-bold tracking-tight mt-2 text-violet"><CountUp value={summary.totalPurchases} /></div>
        </Card>
      </StaggerItem>

      <StaggerItem className="flex items-center justify-between gap-3 flex-wrap mb-4">
        <PillTabs items={TABS} active={tab} onChange={setTab} />
        <div className="flex items-center gap-2">
          <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search employer, candidate or plan…" className="w-64" />
          {tab === 0 && (
            <Select value={status} onChange={(e) => setStatus(e.target.value)} className="w-36">
              {STATUS_OPTIONS.map((s) => (
                <option key={s} value={s}>{s === 'all' ? 'All statuses' : s[0].toUpperCase() + s.slice(1)}</option>
              ))}
            </Select>
          )}
        </div>
      </StaggerItem>

      <StaggerItem>
        {isLoading ? null : filteredRows.length === 0 ? (
          <Card>
            <EmptyState icon={tab === 0 ? Receipt : Users} title={tab === 0 ? 'No purchases yet' : 'No unlocks yet'} body="Nothing matches this filter right now." />
          </Card>
        ) : tab === 0 ? (
          <Card>
            <CardHead><span className="text-[15px] font-semibold">{filteredRows.length} purchases</span></CardHead>
            <TableWrap className="border-none rounded-none">
              <Table columns={['Employer', 'Plan', 'Credits', 'Amount', 'Status', 'Date']}>
                {filteredRows.map((p) => (
                  <Tr key={p.id}>
                    <Td className="font-semibold">{p.company?.name ?? '—'}</Td>
                    <Td>{p.creditPlan?.name ?? '—'}</Td>
                    <Td>{p.creditsGranted ?? p.creditPlan?.creditsGranted ?? '—'}</Td>
                    <Td className="font-bold">{fmtINR(p.amount)}</Td>
                    <Td><Badge tone={p.status === 'paid' ? 'green' : p.status === 'failed' ? 'red' : 'amber'}>{p.status}</Badge></Td>
                    <Td>{p.createdAt ? new Date(p.createdAt).toLocaleDateString('en-IN') : ''}</Td>
                  </Tr>
                ))}
              </Table>
            </TableWrap>
          </Card>
        ) : (
          <Card>
            <CardHead><span className="text-[15px] font-semibold">{filteredRows.length} unlocks</span></CardHead>
            <TableWrap className="border-none rounded-none">
              <Table columns={['Employer', 'Candidate', 'Job', 'Credits used', 'Date']}>
                {filteredRows.map((u) => (
                  <Tr key={u.id}>
                    <Td className="font-semibold">{u.company?.name ?? '—'}</Td>
                    <Td>{u.candidate?.name ?? '—'}</Td>
                    <Td>{u.job?.title ?? '—'}</Td>
                    <Td>{u.creditsUsed}</Td>
                    <Td>{u.unlockedAt ? new Date(u.unlockedAt).toLocaleDateString('en-IN') : ''}</Td>
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
