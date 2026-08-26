import { useMemo, useState } from 'react'
import { Star, ArrowRightCircle } from 'lucide-react'
import Card from '../../components/ui/Card'
import Badge from '../../components/ui/Badge'
import Button from '../../components/ui/Button'
import Avatar from '../../components/ui/Avatar'
import CountUp from '../../components/ui/CountUp'
import { PillTabs } from '../../components/ui/Tabs'
import EmptyState from '../../components/ui/EmptyState'
import { TableWrap, Table, Tr, Td } from '../../components/ui/Table'
import { StaggerGroup, StaggerItem } from '../../components/ui/Stagger'
import { PageSkeleton } from '../../components/ui/Skeleton'
import ErrorState from '../../components/ui/ErrorState'
import { useApp } from '../../context/AppContext'
import { useShortlistQuery, useBulkTransferToOperationsMutation } from '../../hooks/useShortlist'

const TABS = ['Shortlisted', 'Sent to Operations']
const TAB_KEYS = ['shortlisted', 'sent_to_ops']

export default function Shortlisted() {
  const app = useApp()
  const [tab, setTab] = useState(0)
  const [selected, setSelected] = useState(() => new Set())
  const status = TAB_KEYS[tab]
  const { data: rows = [], isLoading, isError, refetch } = useShortlistQuery({ status })
  const { data: allRows = [] } = useShortlistQuery({})
  const bulkTransfer = useBulkTransferToOperationsMutation()

  const counts = useMemo(() => TAB_KEYS.map((k) => allRows.filter((c) => c.shortlist?.status === k).length), [allRows])
  const avgTrustScore = useMemo(() => {
    if (allRows.length === 0) return 0
    return Math.round(allRows.reduce((n, c) => n + (c.shortlist?.trustScore ?? 0), 0) / allRows.length)
  }, [allRows])

  if (isLoading) return <PageSkeleton />
  if (isError) return <ErrorState onRetry={refetch} />

  const isShortlistedTab = tab === 0
  const allSelected = rows.length > 0 && selected.size === rows.length

  function toggleAll() {
    setSelected(allSelected ? new Set() : new Set(rows.map((c) => c.id)))
  }
  function toggleRow(id) {
    setSelected((cur) => {
      const next = new Set(cur)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }
  function changeTab(i) {
    setTab(i)
    setSelected(new Set())
  }

  function transferSelected() {
    bulkTransfer.mutate([...selected], {
      onSuccess: (data) => {
        app.addToast('success', `${data.modifiedCount} candidate(s) sent to Operations`)
        setSelected(new Set())
        refetch()
      },
      onError: (err) => app.addToast('error', err.response?.data?.message ?? 'Something went wrong'),
    })
  }

  return (
    <StaggerGroup>
      <StaggerItem className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Shortlisted</h1>
        <p className="text-sm text-ink-secondary mt-1">Candidates who cleared a mock interview and earned a trust score. Send the ones ready for a requirement back to Operations.</p>
      </StaggerItem>

      <StaggerItem className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-5">
        <Card hover pad>
          <span className="text-xs font-semibold tracking-wide uppercase text-ink-tertiary">Shortlisted</span>
          <div className="text-[30px] font-bold tracking-tight mt-2 text-gold-strong">
            <CountUp value={counts[0]} />
          </div>
        </Card>
        <Card hover pad>
          <span className="text-xs font-semibold tracking-wide uppercase text-ink-tertiary">Sent to Operations</span>
          <div className="text-[30px] font-bold tracking-tight mt-2 text-navy">
            <CountUp value={counts[1]} />
          </div>
        </Card>
        <Card hover pad>
          <span className="text-xs font-semibold tracking-wide uppercase text-ink-tertiary">Average trust score</span>
          <div className="text-[30px] font-bold tracking-tight mt-2 text-green">
            <CountUp value={avgTrustScore} />
          </div>
        </Card>
      </StaggerItem>

      <StaggerItem className="mb-4 flex items-center justify-between gap-2 flex-wrap">
        <PillTabs items={TABS} active={tab} onChange={changeTab} />
        {isShortlistedTab && selected.size > 0 && (
          <Button variant="primary" size="sm" onClick={transferSelected} disabled={bulkTransfer.isPending}>
            <ArrowRightCircle size={14} /> {bulkTransfer.isPending ? 'Sending...' : `Transfer ${selected.size} to Operation`}
          </Button>
        )}
      </StaggerItem>

      <StaggerItem>
        {rows.length === 0 ? (
          <Card>
            <EmptyState icon={Star} tone="green" title="Nothing here" body="Score a completed mock interview to shortlist a candidate." />
          </Card>
        ) : (
          <Card>
            <TableWrap className="border-none rounded-none">
              <Table
                columns={
                  isShortlistedTab
                    ? [<input key="all" type="checkbox" checked={allSelected} onChange={toggleAll} className="accent-navy" />, 'Candidate', 'Trust score', 'Scored by', 'Note']
                    : ['Candidate', 'Trust score', 'Sent by', 'Sent on']
                }
              >
                {rows.map((c) => (
                  <Tr key={c.id}>
                    {isShortlistedTab && (
                      <Td>
                        <input type="checkbox" checked={selected.has(c.id)} onChange={() => toggleRow(c.id)} className="w-4 h-4 accent-navy" />
                      </Td>
                    )}
                    <Td>
                      <div className="flex items-center gap-2.5">
                        <Avatar initials={c.name?.slice(0, 2)?.toUpperCase()} size="sm" />
                        <div className="min-w-0">
                          <div className="font-semibold truncate">{c.name}</div>
                          <div className="text-xs text-ink-tertiary truncate">{c.currentCity || 'City not set'}</div>
                        </div>
                      </div>
                    </Td>
                    <Td>
                      <Badge tone={c.shortlist?.trustScore >= 85 ? 'green' : 'gold'} dot={false}>
                        {c.shortlist?.trustScore}/100
                      </Badge>
                    </Td>
                    {isShortlistedTab ? (
                      <>
                        <Td className="text-ink-tertiary">{c.shortlist?.scoredBy || '—'}</Td>
                        <Td className="text-ink-secondary max-w-[260px] truncate">{c.shortlist?.note || '—'}</Td>
                      </>
                    ) : (
                      <>
                        <Td className="text-ink-tertiary">
                          {c.shortlist?.sentToOpsBy?.name ?? '—'}
                        </Td>
                        <Td className="text-ink-tertiary whitespace-nowrap">
                          {c.shortlist?.sentToOpsOn ? new Date(c.shortlist.sentToOpsOn).toLocaleDateString('en-IN') : '—'}
                        </Td>
                      </>
                    )}
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
