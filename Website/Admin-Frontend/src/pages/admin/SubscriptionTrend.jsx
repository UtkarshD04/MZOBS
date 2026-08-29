import { useState } from 'react'
import { Users, IndianRupee, Search } from 'lucide-react'
import Card, { CardHead } from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import CountUp from '../../components/ui/CountUp'
import { PillTabs } from '../../components/ui/Tabs'
import { AreaLineChart } from '../../components/ui/Charts'
import { StaggerGroup, StaggerItem } from '../../components/ui/Stagger'
import { PageSkeleton } from '../../components/ui/Skeleton'
import ErrorState from '../../components/ui/ErrorState'
import { useSubscriptionTrendQuery } from '../../hooks/usePayments'
import { fmtINR } from '../../lib/utils'

const TABS = ['1 Week', '1 Month', '1 Year']
const RANGES = ['week', 'month', 'year']
const MAX_CUSTOM_DAYS = 3650

export default function SubscriptionTrend() {
  const [tab, setTab] = useState(1)
  const [customDays, setCustomDays] = useState(null)
  const [customInput, setCustomInput] = useState('')

  function selectPreset(i) {
    setTab(i)
    setCustomDays(null)
  }

  function applyCustom() {
    const n = Number.parseInt(customInput, 10)
    if (!Number.isFinite(n) || n <= 0) return
    setCustomDays(Math.min(n, MAX_CUSTOM_DAYS))
  }

  const params = customDays ? { days: customDays } : { range: RANGES[tab] }
  const { data, isLoading, isError, refetch } = useSubscriptionTrendQuery(params)
  const activeLabel = customDays ? `Last ${customDays} day${customDays === 1 ? '' : 's'}` : TABS[tab]

  if (isLoading) return <PageSkeleton />
  if (isError) return <ErrorState onRetry={refetch} />

  const series = data?.series ?? []
  const chartData = series.map((p) => ({ label: p.label, value: p.count }))

  return (
    <StaggerGroup>
      <StaggerItem className="flex items-start justify-between gap-5 flex-wrap mb-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Subscriptions</h1>
          <p className="text-sm text-ink-secondary mt-1">Candidate subscription growth — pick a preset or any custom number of days.</p>
        </div>
        <PillTabs items={TABS} active={customDays ? -1 : tab} onChange={selectPreset} />
      </StaggerItem>

      <StaggerItem className="flex items-center gap-2 mb-6">
        <div className="relative">
          <input
            type="number"
            min="1"
            max={MAX_CUSTOM_DAYS}
            value={customInput}
            onChange={(e) => setCustomInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && applyCustom()}
            placeholder="Custom days, e.g. 45"
            className="h-9 pl-3 pr-3 rounded-[9px] border border-border-strong bg-surface text-[12.5px] w-[180px] outline-none focus:border-navy focus:shadow-[0_0_0_3.5px_var(--color-navy-ring)] transition-[border-color,box-shadow]"
          />
        </div>
        <Button size="sm" onClick={applyCustom} disabled={!customInput}>
          <Search size={13} /> View
        </Button>
      </StaggerItem>

      <StaggerItem className="grid grid-cols-2 gap-4 mb-5">
        <Card hover pad>
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold tracking-wide uppercase text-ink-tertiary">Subscriptions in range</span>
            <Users size={15} className="text-navy" />
          </div>
          <div className="text-[30px] font-bold tracking-tight mt-2 text-navy">
            <CountUp value={data?.totalCount ?? 0} />
          </div>
        </Card>
        <Card hover pad>
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold tracking-wide uppercase text-ink-tertiary">Revenue in range</span>
            <IndianRupee size={15} className="text-gold-strong" />
          </div>
          <div className="text-[30px] font-bold tracking-tight mt-2 text-gold-strong">
            <CountUp value={data?.totalAmount ?? 0} prefix="₹" />
          </div>
        </Card>
      </StaggerItem>

      <StaggerItem>
        <Card>
          <CardHead>
            <span className="text-[15px] font-semibold">New subscriptions</span>
            <span className="text-xs text-ink-tertiary">{activeLabel}</span>
          </CardHead>
          <div className="p-[22px] pt-6">
            {chartData.every((d) => d.value === 0) ? (
              <p className="text-[13px] text-ink-secondary">No subscriptions in this period yet.</p>
            ) : (
              <AreaLineChart data={chartData} formatValue={(v) => `${v} subscription${v === 1 ? '' : 's'}`} />
            )}
          </div>
        </Card>
      </StaggerItem>

      <StaggerItem className="mt-4">
        <Card>
          <CardHead>
            <span className="text-[15px] font-semibold">Revenue</span>
            <span className="text-xs text-ink-tertiary">{activeLabel}</span>
          </CardHead>
          <div className="p-[22px] pt-6">
            {series.every((p) => p.amount === 0) ? (
              <p className="text-[13px] text-ink-secondary">No revenue in this period yet.</p>
            ) : (
              <AreaLineChart data={series.map((p) => ({ label: p.label, value: p.amount }))} formatValue={fmtINR} />
            )}
          </div>
        </Card>
      </StaggerItem>
    </StaggerGroup>
  )
}
