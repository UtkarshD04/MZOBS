import { useMemo, useState } from 'react'
import { Contact, Search, Mail, Phone, ShieldCheck, Building2 } from 'lucide-react'
import Card from '../../components/ui/Card'
import Badge from '../../components/ui/Badge'
import CountUp from '../../components/ui/CountUp'
import { PillTabs } from '../../components/ui/Tabs'
import EmptyState from '../../components/ui/EmptyState'
import { StaggerGroup, StaggerItem } from '../../components/ui/Stagger'
import { PageSkeleton } from '../../components/ui/Skeleton'
import ErrorState from '../../components/ui/ErrorState'
import { useCompaniesQuery } from '../../hooks/useCompanies'

const TABS = ['All', 'Verified companies', 'Pending companies']
const TAB_STATUS = [null, 'verified', 'pending']
const STATUS_TONE = { pending: 'gold', verified: 'green', rejected: 'red' }

export default function HRContacts() {
  const [tab, setTab] = useState(0)
  const [query, setQuery] = useState('')
  const { data: companies = [], isLoading, isError, refetch } = useCompaniesQuery({})

  const contacts = useMemo(() => {
    return companies.flatMap((co) =>
      (co.hiringContacts ?? []).map((contact) => ({
        ...contact,
        companyId: co.id,
        companyName: co.name,
        companyLogo: co.logo || co.name?.slice(0, 2).toUpperCase(),
        industry: co.industry,
        verificationStatus: co.verificationStatus,
      }))
    )
  }, [companies])

  const filtered = useMemo(() => {
    const status = TAB_STATUS[tab]
    let rows = status ? contacts.filter((c) => c.verificationStatus === status) : contacts
    if (query) {
      const q = query.toLowerCase()
      rows = rows.filter((c) => `${c.name} ${c.email} ${c.companyName}`.toLowerCase().includes(q))
    }
    return rows
  }, [contacts, tab, query])

  const verifiedCompanies = useMemo(() => new Set(companies.filter((c) => c.verificationStatus === 'verified').map((c) => c.id)).size, [companies])
  const pendingCompanies = useMemo(() => new Set(companies.filter((c) => c.verificationStatus === 'pending').map((c) => c.id)).size, [companies])

  if (isLoading) return <PageSkeleton />
  if (isError) return <ErrorState onRetry={refetch} />

  return (
    <StaggerGroup>
      <StaggerItem className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">HR Contacts</h1>
        <p className="text-sm text-ink-secondary mt-1">Every hiring contact registered by an employer, in one directory.</p>
      </StaggerItem>

      <StaggerItem className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-5">
        {[
          ['HR contacts', contacts.length, 'text-navy'],
          ['Verified companies', verifiedCompanies, 'text-green'],
          ['Pending companies', pendingCompanies, 'text-gold-strong'],
        ].map(([label, val, cls]) => (
          <Card key={label} hover pad>
            <span className="text-xs font-semibold tracking-wide uppercase text-ink-tertiary">{label}</span>
            <div className={`text-[30px] font-bold tracking-tight mt-2 ${cls}`}>
              <CountUp value={val} />
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
            placeholder="Search name, email, company"
            className="h-9 pl-8 pr-3 rounded-[9px] border border-border-strong bg-surface text-[12.5px] w-[260px] max-sm:w-full outline-none focus:border-navy focus:shadow-[0_0_0_3.5px_var(--color-navy-ring)] transition-[border-color,box-shadow]"
          />
        </div>
      </StaggerItem>

      <StaggerItem>
        {filtered.length === 0 ? (
          <Card>
            <EmptyState icon={Contact} title="No HR contacts here" body="Nothing matches this filter right now." />
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {filtered.map((c) => (
              <Card key={`${c.companyId}-${c.id}`} hover pad>
                <div className="flex items-start gap-3">
                  <div className="w-11 h-11 rounded-[11px] bg-navy-tint text-navy flex items-center justify-center text-sm font-bold flex-shrink-0">
                    {c.name?.slice(0, 2)?.toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[15px] font-semibold truncate">{c.name || 'Unnamed contact'}</div>
                    <div className="text-[13px] text-ink-secondary mt-0.5">{c.role || 'Role not set'}</div>
                  </div>
                  <Badge tone={STATUS_TONE[c.verificationStatus] ?? 'navy'}>{c.verificationStatus}</Badge>
                </div>

                <div className="flex flex-col gap-1.5 mt-3.5 text-xs text-ink-tertiary">
                  {c.email && (
                    <span className="flex items-center gap-1.5">
                      <Mail size={12} /> {c.email}
                    </span>
                  )}
                  {c.phone && (
                    <span className="flex items-center gap-1.5">
                      <Phone size={12} /> {c.phone}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1.5 mt-3.5 pt-3 border-t border-border text-[12.5px]">
                  <Building2 size={13} className="text-ink-tertiary" />
                  <span className="font-semibold">{c.companyName}</span>
                  {c.industry && <span className="text-ink-tertiary">· {c.industry}</span>}
                  {c.verificationStatus === 'verified' && <ShieldCheck size={13} className="text-green ml-auto flex-shrink-0" />}
                </div>
              </Card>
            ))}
          </div>
        )}
      </StaggerItem>
    </StaggerGroup>
  )
}
