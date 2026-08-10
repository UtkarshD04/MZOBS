import { useMemo, useState } from 'react'
import { Briefcase, MapPin, Search, IndianRupee, Send, Users } from 'lucide-react'
import Card from '../../components/ui/Card'
import Badge from '../../components/ui/Badge'
import Button from '../../components/ui/Button'
import Bar from '../../components/ui/Bar'
import CountUp from '../../components/ui/CountUp'
import { PillTabs } from '../../components/ui/Tabs'
import EmptyState from '../../components/ui/EmptyState'
import { StaggerGroup, StaggerItem } from '../../components/ui/Stagger'
import { useApp } from '../../context/AppContext'
import { openRecordPaymentModal, openReviewJobModal } from '../../lib/mzobsModals'
import { APPLICATIONS, JOB_POSTS, JOB_STATUS, PRICING, companyOf, trackOf } from '../../lib/mzobsData'
import { fmtINR } from '../../lib/utils'

const TABS = ['To review', 'Awaiting payment', 'Sourcing', 'Live', 'All']
const TAB_FILTER = [['pending_review'], ['awaiting_payment'], ['sourcing', 'delivered'], ['live'], null]

export default function Requirements() {
  const app = useApp()
  const [tab, setTab] = useState(0)
  const [query, setQuery] = useState('')

  const rows = useMemo(() => {
    const allowed = TAB_FILTER[tab]
    return JOB_POSTS.filter((j) => {
      if (allowed && !allowed.includes(j.status)) return false
      if (query) {
        const co = companyOf(j.companyId)
        if (!`${j.title} ${co.name} ${j.location} ${j.id}`.toLowerCase().includes(query.toLowerCase())) return false
      }
      return true
    })
  }, [tab, query])

  const totalOpenings = JOB_POSTS.reduce((n, j) => n + j.openings, 0)
  const billed = JOB_POSTS.reduce((n, j) => n + j.fee, 0)
  const resumesOwed = JOB_POSTS.filter((j) => ['sourcing', 'live', 'awaiting_payment'].includes(j.status)).reduce((n, j) => n + (j.resumesPromised - j.resumesShared), 0)

  return (
    <StaggerGroup>
      <StaggerItem className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Requirements</h1>
        <p className="text-sm text-ink-secondary mt-1">
          Job posts raised by verified employers. Each opening is billed at {fmtINR(PRICING.perOpeningFee)} and owes {PRICING.resumesPerOpening} shortlisted resumes.
        </p>
      </StaggerItem>

      <StaggerItem className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
        {[
          ['Requirements', JOB_POSTS.length, '', 'text-navy'],
          ['Total openings', totalOpenings, '', 'text-gold-strong'],
          ['Billed value', billed, '₹', 'text-green'],
          ['Resumes still owed', resumesOwed, '', 'text-teal'],
        ].map(([label, val, prefix, cls]) => (
          <Card key={label} hover pad>
            <span className="text-xs font-semibold tracking-wide uppercase text-ink-tertiary">{label}</span>
            <div className={`text-[30px] font-bold tracking-tight mt-2 ${cls}`}>
              <CountUp value={val} prefix={prefix} />
            </div>
          </Card>
        ))}
      </StaggerItem>

      <StaggerItem className="flex items-center justify-between gap-3 flex-wrap mb-4">
        <PillTabs items={TABS} active={tab} onChange={setTab} />
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-tertiary" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search role, company, city"
            className="h-9 pl-8 pr-3 rounded-[9px] border border-border-strong bg-surface text-[12.5px] w-[260px] max-sm:w-full outline-none focus:border-navy focus:shadow-[0_0_0_3.5px_var(--color-navy-ring)] transition-[border-color,box-shadow]"
          />
        </div>
      </StaggerItem>

      <StaggerItem>
        {rows.length === 0 ? (
          <Card>
            <EmptyState icon={Briefcase} title="No requirements here" body="Nothing matches this filter right now." />
          </Card>
        ) : (
          <div className="flex flex-col gap-4">
            {rows.map((j) => {
              const co = companyOf(j.companyId)
              const st = JOB_STATUS[j.status]
              const track = trackOf(j.track)
              const applied = APPLICATIONS.filter((a) => a.jobId === j.id).length
              const fill = j.resumesPromised ? Math.round((j.resumesShared / j.resumesPromised) * 100) : 0

              return (
                <Card key={j.id} pad>
                  <div className="flex items-start gap-4 flex-wrap">
                    <div className="w-11 h-11 rounded-[11px] bg-navy-tint text-navy flex items-center justify-center text-sm font-bold flex-shrink-0">{co.logo}</div>
                    <div className="flex-1 min-w-[220px]">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[15px] font-semibold">{j.title}</span>
                        <Badge tone={st.tone}>{st.label}</Badge>
                        <Badge tone={track.tone} dot={false}>
                          {track.label}
                        </Badge>
                      </div>
                      <div className="text-[13px] text-ink-secondary mt-1">
                        {co.name} · {j.id} · Posted {j.postedOn}
                      </div>
                      <div className="flex items-center gap-3.5 mt-2 text-[12.5px] text-ink-tertiary flex-wrap">
                        <span className="flex items-center gap-1">
                          <MapPin size={12} /> {j.location} · {j.mode}
                        </span>
                        <span>{j.salary}</span>
                        <span className="flex items-center gap-1">
                          <Users size={12} /> {applied} application{applied === 1 ? '' : 's'} held
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-1.5 mt-2.5">
                        {j.skills.map((s) => (
                          <span key={s} className="text-[11px] font-semibold text-ink-secondary bg-surface-sunken px-2 py-1 rounded-md">
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2.5 min-w-[280px]">
                      <div className="bg-surface-sunken rounded-lg px-3 py-2.5">
                        <div className="text-[11px] text-ink-tertiary">Openings</div>
                        <div className="text-[17px] font-bold tracking-tight mt-0.5">{j.openings}</div>
                      </div>
                      <div className="bg-surface-sunken rounded-lg px-3 py-2.5">
                        <div className="text-[11px] text-ink-tertiary">Fee</div>
                        <div className="text-[17px] font-bold tracking-tight mt-0.5">{fmtINR(j.fee)}</div>
                        <div className={`text-[10.5px] font-semibold mt-0.5 ${j.feeStatus === 'paid' ? 'text-green' : 'text-red'}`}>
                          {j.feeStatus === 'paid' ? `Paid ${j.paidOn}` : 'Unpaid'}
                        </div>
                      </div>
                      <div className="bg-surface-sunken rounded-lg px-3 py-2.5">
                        <div className="text-[11px] text-ink-tertiary">Resumes</div>
                        <div className="text-[17px] font-bold tracking-tight mt-0.5">
                          {j.resumesShared}
                          <span className="text-[12px] text-ink-tertiary">/{j.resumesPromised}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4">
                    <div className="flex items-center justify-between text-[12px] mb-1.5">
                      <span className="text-ink-secondary">Dispatch progress</span>
                      <span className="font-semibold">{fill}%</span>
                    </div>
                    <Bar value={fill} tone={fill === 100 ? 'green' : 'navy'} thin />
                  </div>

                  <div className="flex items-center gap-2 mt-4 pt-3.5 border-t border-border flex-wrap">
                    {j.status === 'pending_review' && (
                      <Button variant="primary" size="sm" onClick={() => openReviewJobModal(app, j)}>
                        Review & approve
                      </Button>
                    )}
                    {j.feeStatus === 'unpaid' && j.status !== 'pending_review' && (
                      <Button variant="gold" size="sm" onClick={() => openRecordPaymentModal(app, j)}>
                        <IndianRupee size={14} /> Record payment
                      </Button>
                    )}
                    {j.feeStatus === 'paid' && j.resumesShared < j.resumesPromised && (
                      <Button size="sm" onClick={() => app.addToast('success', `Opening dispatch batch for ${j.title}`)}>
                        <Send size={14} /> Build dispatch batch
                      </Button>
                    )}
                    {j.selected > 0 && (
                      <span className="text-[12.5px] text-ink-secondary">
                        <b className="text-ink">{j.selected}</b> of {j.openings} openings filled
                      </span>
                    )}
                    <Button variant="ghost" size="sm" className="ml-auto" onClick={() => openReviewJobModal(app, j)}>
                      Details
                    </Button>
                  </div>
                </Card>
              )
            })}
          </div>
        )}
      </StaggerItem>
    </StaggerGroup>
  )
}
