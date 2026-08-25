import { useMemo, useState } from 'react'
import { Building2, ShieldCheck, Search, Globe, Phone, AlertTriangle, Ban, Trash2 } from 'lucide-react'
import Card from '../../components/ui/Card'
import Badge from '../../components/ui/Badge'
import Button from '../../components/ui/Button'
import CountUp from '../../components/ui/CountUp'
import { PillTabs } from '../../components/ui/Tabs'
import EmptyState from '../../components/ui/EmptyState'
import { StaggerGroup, StaggerItem } from '../../components/ui/Stagger'
import { PageSkeleton } from '../../components/ui/Skeleton'
import ErrorState from '../../components/ui/ErrorState'
import { ModalHead, ModalBody, ModalFoot } from '../../components/ui/Modal'
import { Field, Select, Textarea } from '../../components/ui/Field'
import { useApp } from '../../context/AppContext'
import {
  useCompaniesQuery,
  useVerifyCompanyMutation,
  useRejectCompanyMutation,
  useBlockCompanyMutation,
  useUnblockCompanyMutation,
  useDeleteCompanyMutation,
} from '../../hooks/useCompanies'

const TABS = ['Pending', 'Verified', 'Rejected', 'All']
const TAB_KEYS = ['pending', 'verified', 'rejected', null]
const STATUS_TONE = { pending: 'gold', verified: 'green', rejected: 'red' }

function VerifyCompanyModal({ app, company, mode, onDone }) {
  const verify = mode === 'verify'
  const [method, setMethod] = useState('gstin_pan')
  const [note, setNote] = useState('')
  const verifyMutation = useVerifyCompanyMutation()
  const rejectMutation = useRejectCompanyMutation()
  const pending = verifyMutation.isPending || rejectMutation.isPending

  function submit() {
    const mutation = verify ? verifyMutation : rejectMutation
    mutation.mutate(
      { id: company.id, method: verify ? method : undefined, note },
      {
        onSuccess: () => {
          app.closeModal()
          app.addToast(verify ? 'success' : 'error', verify ? `${company.name} verified` : `${company.name} rejected`)
          onDone?.()
        },
        onError: (err) => app.addToast('error', err.response?.data?.message ?? 'Something went wrong'),
      }
    )
  }

  return (
    <>
      <ModalHead title={verify ? `Verify ${company.name}?` : `Reject ${company.name}?`} onClose={app.closeModal} />
      <ModalBody>
        <div className="flex items-start gap-3 mb-4">
          <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${verify ? 'bg-green-tint text-green' : 'bg-red-tint text-red'}`}>
            {verify ? <ShieldCheck size={20} /> : <AlertTriangle size={20} />}
          </div>
          <p className="text-[13px] text-ink-secondary">
            {verify
              ? `Verification unlocks the employer portal for ${company.name} — they can post requirements, which land in our review queue before going live to candidates.`
              : `${company.name} will be told their registration could not be verified.`}
          </p>
        </div>
        {verify && (
          <Field label="Verification method">
            <Select value={method} onChange={(e) => setMethod(e.target.value)}>
              <option value="gstin_pan">GSTIN + PAN cross-check</option>
              <option value="mca">MCA company master data</option>
              <option value="video_call">Video call with authorised signatory</option>
              <option value="site_visit">Site visit</option>
            </Select>
          </Field>
        )}
        <Field label="Internal note" optional>
          <Textarea value={note} onChange={(e) => setNote(e.target.value)} placeholder="Visible to the Mzobs team only" />
        </Field>
      </ModalBody>
      <ModalFoot>
        <Button onClick={app.closeModal} disabled={pending}>
          Cancel
        </Button>
        <Button variant={verify ? 'primary' : 'danger'} onClick={submit} disabled={pending}>
          {pending ? 'Saving...' : verify ? 'Verify company' : 'Reject registration'}
        </Button>
      </ModalFoot>
    </>
  )
}

function BlockCompanyModal({ app, company, onDone }) {
  const [reason, setReason] = useState('')
  const block = useBlockCompanyMutation()

  function submit() {
    block.mutate(
      { id: company.id, reason },
      {
        onSuccess: () => {
          app.closeModal()
          app.addToast('error', `${company.name} blocked`)
          onDone?.()
        },
        onError: (err) => app.addToast('error', err.response?.data?.message ?? 'Something went wrong'),
      }
    )
  }

  return (
    <>
      <ModalHead title={`Block ${company.name}?`} onClose={app.closeModal} />
      <ModalBody>
        <div className="flex items-start gap-3 mb-4">
          <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 bg-red-tint text-red">
            <Ban size={20} />
          </div>
          <p className="text-[13px] text-ink-secondary">
            {company.name} will not be able to sign in or post requirements until unblocked. Existing sessions are cut off immediately.
          </p>
        </div>
        <Field label="Reason" optional>
          <Textarea value={reason} onChange={(e) => setReason(e.target.value)} placeholder="Visible to the Mzobs team only" />
        </Field>
      </ModalBody>
      <ModalFoot>
        <Button onClick={app.closeModal} disabled={block.isPending}>
          Cancel
        </Button>
        <Button variant="danger" onClick={submit} disabled={block.isPending}>
          {block.isPending ? 'Blocking...' : 'Block company'}
        </Button>
      </ModalFoot>
    </>
  )
}

function DeleteCompanyModal({ app, company, onDone }) {
  const del = useDeleteCompanyMutation()

  function submit() {
    del.mutate(company.id, {
      onSuccess: () => {
        app.closeModal()
        app.addToast('error', `${company.name} deleted`)
        onDone?.()
      },
      onError: (err) => app.addToast('error', err.response?.data?.message ?? 'Something went wrong'),
    })
  }

  return (
    <>
      <ModalHead title={`Delete ${company.name}?`} onClose={app.closeModal} />
      <ModalBody>
        <div className="flex items-start gap-3">
          <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 bg-red-tint text-red">
            <AlertTriangle size={20} />
          </div>
          <p className="text-[13px] text-ink-secondary">
            This permanently removes {company.name} and its login accounts. This cannot be undone. Requirements, applications and invoices already
            on record are kept as history.
          </p>
        </div>
      </ModalBody>
      <ModalFoot>
        <Button onClick={app.closeModal} disabled={del.isPending}>
          Cancel
        </Button>
        <Button variant="danger" onClick={submit} disabled={del.isPending}>
          {del.isPending ? 'Deleting...' : 'Delete company'}
        </Button>
      </ModalFoot>
    </>
  )
}

export default function Companies() {
  const app = useApp()
  const [tab, setTab] = useState(0)
  const [query, setQuery] = useState('')
  const status = TAB_KEYS[tab]
  const { data: rows = [], isLoading, isError, refetch } = useCompaniesQuery(status ? { status } : {})
  const { data: allRows = [] } = useCompaniesQuery({})
  const unblockCompany = useUnblockCompanyMutation()

  const filtered = useMemo(() => {
    if (!query) return rows
    const q = query.toLowerCase()
    return rows.filter((co) => `${co.name} ${co.industry} ${co.hq} ${co.gstin}`.toLowerCase().includes(q))
  }, [rows, query])

  const counts = TAB_KEYS.map((k) => (k ? allRows.filter((c) => c.verificationStatus === k).length : allRows.length))

  if (isLoading) return <PageSkeleton />
  if (isError) return <ErrorState onRetry={refetch} />

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
        {filtered.length === 0 ? (
          <Card>
            <EmptyState icon={Building2} title="No companies here" body="Nothing matches this filter right now." />
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {filtered.map((co) => (
              <Card key={co.id} hover pad className="flex flex-col">
                <div className="flex items-start gap-3">
                  <div className="w-11 h-11 rounded-[11px] bg-navy-tint text-navy flex items-center justify-center text-sm font-bold flex-shrink-0">{co.logo || co.name?.slice(0, 2).toUpperCase()}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-[15px] font-semibold">{co.name}</span>
                      {co.verificationStatus === 'verified' && <ShieldCheck size={14} className="text-green flex-shrink-0" />}
                    </div>
                    <div className="text-[13px] text-ink-secondary mt-0.5">
                      {co.industry || 'Industry not set'} {co.size ? `· ${co.size}` : ''}
                    </div>
                    <div className="text-xs text-ink-tertiary mt-1 flex items-center gap-1">
                      <Globe size={11} /> {co.website || 'No website'} · {co.hq || 'No HQ'}
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <Badge tone={STATUS_TONE[co.verificationStatus] ?? 'navy'}>{co.verificationStatus}</Badge>
                    {co.blocked && <Badge tone="red">blocked</Badge>}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2.5 mt-3.5">
                  <div className="bg-surface-sunken rounded-lg px-3 py-2">
                    <div className="text-[11px] text-ink-tertiary">GSTIN</div>
                    <div className="text-[12px] font-semibold mt-0.5">{co.gstin || '—'}</div>
                  </div>
                  <div className="bg-surface-sunken rounded-lg px-3 py-2">
                    <div className="text-[11px] text-ink-tertiary">PAN</div>
                    <div className="text-[12px] font-semibold mt-0.5">{co.pan || '—'}</div>
                  </div>
                </div>

                {co.hiringContacts?.[0] && (
                  <div className="flex items-center gap-1.5 text-xs text-ink-tertiary mt-3">
                    <Phone size={11} /> {co.hiringContacts[0].name} · {co.hiringContacts[0].role}
                  </div>
                )}

                <div className="flex items-center gap-4 mt-3 text-[12.5px]">
                  <span className="text-ink-secondary">
                    <b className="text-ink">{co.openingsPurchased ?? 0}</b> openings
                  </span>
                </div>

                {co.verificationStatus === 'pending' && (
                  <div className="flex items-center gap-2 mt-4 pt-3 border-t border-border">
                    <Button variant="primary" size="sm" onClick={() => app.openModal(<VerifyCompanyModal app={app} company={co} mode="verify" onDone={refetch} />)}>
                      <ShieldCheck size={14} /> Verify
                    </Button>
                    <Button size="sm" onClick={() => app.openModal(<VerifyCompanyModal app={app} company={co} mode="reject" onDone={refetch} />)}>
                      Reject
                    </Button>
                  </div>
                )}

                <div className="flex items-center gap-2 mt-3 pt-3 border-t border-border">
                  {co.blocked ? (
                    <Button size="sm" onClick={() => unblockCompany.mutate(co.id, { onSuccess: () => app.addToast('success', `${co.name} unblocked`), onError: (err) => app.addToast('error', err.response?.data?.message ?? 'Something went wrong') })} disabled={unblockCompany.isPending}>
                      <Ban size={14} /> Unblock
                    </Button>
                  ) : (
                    <Button size="sm" onClick={() => app.openModal(<BlockCompanyModal app={app} company={co} onDone={refetch} />)}>
                      <Ban size={14} /> Block
                    </Button>
                  )}
                  <Button variant="danger" size="sm" onClick={() => app.openModal(<DeleteCompanyModal app={app} company={co} onDone={refetch} />)}>
                    <Trash2 size={14} /> Delete
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </StaggerItem>
    </StaggerGroup>
  )
}
