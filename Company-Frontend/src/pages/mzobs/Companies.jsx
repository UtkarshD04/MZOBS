import { useMemo, useState } from 'react'
import { Building2, ShieldCheck, Search, Globe, Phone } from 'lucide-react'
import Card from '../../components/ui/Card'
import Badge from '../../components/ui/Badge'
import Button from '../../components/ui/Button'
import CountUp from '../../components/ui/CountUp'
import { PillTabs } from '../../components/ui/Tabs'
import EmptyState from '../../components/ui/EmptyState'
import { StaggerGroup, StaggerItem } from '../../components/ui/Stagger'
import { useApp } from '../../context/AppContext'
import { openCompanyDrawer, openVerifyCompanyModal } from '../../lib/mzobsModals'
import { COMPANIES, COMPANY_STATUS, JOB_POSTS } from '../../lib/mzobsData'
import { fmtINR } from '../../lib/utils'

const TABS = ['Pending', 'Verified', 'Rejected', 'All']
const TAB_KEYS = ['pending', 'verified', 'rejected', null]

export default function Companies() {
  const app = useApp()
  const [tab, setTab] = useState(0)
  const [query, setQuery] = useState('')

  const rows = useMemo(() => {
    const key = TAB_KEYS[tab]
    return COMPANIES.filter((co) => {
      if (key && co.status !== key) return false
      if (query && !`${co.name} ${co.industry} ${co.hq} ${co.gst}`.toLowerCase().includes(query.toLowerCase())) return false
      return true
    })
  }, [tab, query])

  const counts = TAB_KEYS.map((k) => (k ? COMPANIES.filter((c) => c.status === k).length : COMPANIES.length))

  return (
    <StaggerGroup>
      <StaggerItem className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Companies</h1>
        <p className="text-sm text-ink-secondary mt-1">
          Employers register on their own portal; their details land here for KYC. Only a verified company can post a requirement.
        </p>
      </StaggerItem>

      <StaggerItem className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
        {TABS.map((label, i) => (
          <Card key={label} hover pad onClick={() => setTab(i)} className="cursor-pointer">
            <span className="text-xs font-semibold tracking-wide uppercase text-ink-tertiary">{label}</span>
            <div className={`text-[30px] font-bold tracking-tight mt-2 ${i === 0 ? 'text-gold-strong' : i === 1 ? 'text-green' : i === 2 ? 'text-red' : 'text-navy'}`}>
              <CountUp value={counts[i]} />
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
            placeholder="Search company, GSTIN, city"
            className="h-9 pl-8 pr-3 rounded-[9px] border border-border-strong bg-surface text-[12.5px] w-[260px] max-sm:w-full outline-none focus:border-navy focus:shadow-[0_0_0_3.5px_var(--color-navy-ring)] transition-[border-color,box-shadow]"
          />
        </div>
      </StaggerItem>

      <StaggerItem>
        {rows.length === 0 ? (
          <Card>
            <EmptyState icon={Building2} title="No companies here" body="Nothing matches this filter right now." />
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {rows.map((co) => {
              const st = COMPANY_STATUS[co.status]
              const openReqs = JOB_POSTS.filter((j) => j.companyId === co.id).length
              return (
                <Card key={co.id} hover pad className="flex flex-col">
                  <div className="flex items-start gap-3">
                    <div className="w-11 h-11 rounded-[11px] bg-navy-tint text-navy flex items-center justify-center text-sm font-bold flex-shrink-0">{co.logo}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-[15px] font-semibold">{co.name}</span>
                        {co.status === 'verified' && <ShieldCheck size={14} className="text-green flex-shrink-0" />}
                      </div>
                      <div className="text-[13px] text-ink-secondary mt-0.5">
                        {co.industry} · {co.size} employees
                      </div>
                      <div className="text-xs text-ink-tertiary mt-1 flex items-center gap-1">
                        <Globe size={11} /> {co.website} · {co.hq}
                      </div>
                    </div>
                    <Badge tone={st.tone}>{st.label}</Badge>
                  </div>

                  <div className="grid grid-cols-2 gap-2.5 mt-3.5">
                    <div className="bg-surface-sunken rounded-lg px-3 py-2">
                      <div className="text-[11px] text-ink-tertiary">GSTIN</div>
                      <div className="text-[12px] font-semibold mt-0.5">{co.gst}</div>
                    </div>
                    <div className="bg-surface-sunken rounded-lg px-3 py-2">
                      <div className="text-[11px] text-ink-tertiary">PAN</div>
                      <div className="text-[12px] font-semibold mt-0.5">{co.pan}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 text-xs text-ink-tertiary mt-3">
                    <Phone size={11} /> {co.contact.name} · {co.contact.role}
                  </div>

                  <div className="flex items-center gap-4 mt-3 text-[12.5px]">
                    <span className="text-ink-secondary">
                      <b className="text-ink">{openReqs}</b> requirement{openReqs === 1 ? '' : 's'}
                    </span>
                    <span className="text-ink-secondary">
                      <b className="text-ink">{co.openings}</b> openings
                    </span>
                    <span className="text-ink-secondary">
                      Billed <b className="text-ink">{fmtINR(co.paid)}</b>
                    </span>
                  </div>

                  <div className="flex items-center gap-2 mt-4 pt-3 border-t border-border">
                    {co.status === 'pending' ? (
                      <>
                        <Button variant="primary" size="sm" onClick={() => openVerifyCompanyModal(app, co, 'verify')}>
                          <ShieldCheck size={14} /> Verify
                        </Button>
                        <Button size="sm" onClick={() => openVerifyCompanyModal(app, co, 'reject')}>
                          Reject
                        </Button>
                      </>
                    ) : (
                      <Button size="sm" onClick={() => app.addToast('success', `Opened requirements for ${co.name}`)}>
                        Requirements
                      </Button>
                    )}
                    <Button variant="ghost" size="sm" className="ml-auto" onClick={() => openCompanyDrawer(app, co)}>
                      Open file
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
