import { useState } from 'react'
import { Search, Send, Users, Building2, UserCog } from 'lucide-react'
import Card, { CardHead } from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Chip from '../../components/ui/Chip'
import Badge from '../../components/ui/Badge'
import { PillTabs } from '../../components/ui/Tabs'
import { Field, Input, Textarea } from '../../components/ui/Field'
import { StaggerGroup, StaggerItem } from '../../components/ui/Stagger'
import { useApp } from '../../context/AppContext'
import { useRecipientsQuery, useSendNotificationMutation } from '../../hooks/useSendNotification'

const AUDIENCES = [
  { key: 'employee', label: 'Employees', plural: 'employees', icon: Users },
  { key: 'employer', label: 'Employers', plural: 'companies', icon: Building2 },
  { key: 'staff', label: 'Staff', plural: 'staff members', icon: UserCog },
]

export default function SendNotification() {
  const app = useApp()
  const [tab, setTab] = useState(0)
  const [search, setSearch] = useState('')
  const [selectedIds, setSelectedIds] = useState([])
  const [broadcast, setBroadcast] = useState(false)
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')

  const audience = AUDIENCES[tab]
  const { data: recipients = [], isLoading } = useRecipientsQuery({ audience: audience.key, search })
  const send = useSendNotificationMutation()

  function switchAudience(i) {
    setTab(i)
    setSearch('')
    setSelectedIds([])
    setBroadcast(false)
  }

  function toggleRecipient(id) {
    setSelectedIds((ids) => (ids.includes(id) ? ids.filter((x) => x !== id) : [...ids, id]))
  }

  function submit() {
    send.mutate(
      {
        audience: audience.key,
        recipientIds: broadcast ? undefined : selectedIds,
        broadcast,
        title,
        body,
      },
      {
        onSuccess: (data) => {
          app.addToast('success', `Sent to ${data.sent} ${data.sent === 1 ? audience.plural.replace(/s$/, '') : audience.plural}`)
          setSelectedIds([])
          setBroadcast(false)
          setTitle('')
          setBody('')
        },
        onError: (err) => app.addToast('error', err.response?.data?.message ?? 'Something went wrong'),
      }
    )
  }

  const canSubmit = title.trim() && body.trim() && (broadcast || selectedIds.length > 0) && !send.isPending

  return (
    <StaggerGroup>
      <StaggerItem className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Send Notification</h1>
        <p className="text-sm text-ink-secondary mt-1">Message a candidate, a company, or a teammate directly — delivered as an in-app notification and a push.</p>
      </StaggerItem>

      <StaggerItem className="grid lg:grid-cols-[1.1fr_1fr] gap-5">
        <Card>
          <CardHead>
            <PillTabs items={AUDIENCES.map((a) => a.label)} active={tab} onChange={switchAudience} />
          </CardHead>
          <div className="p-[22px] pt-3.5">
            <div className="flex items-center justify-between gap-3 mb-3">
              <div className="relative flex-1">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-tertiary" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  disabled={broadcast}
                  placeholder={`Search ${audience.plural}`}
                  className="h-9 pl-8 pr-3 rounded-[9px] border border-border-strong bg-surface text-[12.5px] w-full outline-none focus:border-navy focus:shadow-[0_0_0_3.5px_var(--color-navy-ring)] transition-[border-color,box-shadow] disabled:opacity-50"
                />
              </div>
              <Chip selected={broadcast} onClick={() => setBroadcast((b) => !b)}>
                Send to all
              </Chip>
            </div>

            {broadcast ? (
              <p className="text-[12.5px] text-ink-secondary bg-surface-sunken border border-border rounded-lg p-3">
                This message will be sent to every {audience.plural.replace(/s$/, '')} in the system, not just the ones listed below.
              </p>
            ) : (
              <>
                {selectedIds.length > 0 && (
                  <div className="text-xs text-ink-tertiary mb-2">
                    {selectedIds.length} selected
                  </div>
                )}
                <div className="flex flex-col gap-1.5 max-h-[320px] overflow-y-auto">
                  {isLoading && <p className="text-[13px] text-ink-secondary py-2">Loading...</p>}
                  {!isLoading && recipients.length === 0 && <p className="text-[13px] text-ink-secondary py-2">No {audience.plural} found.</p>}
                  {recipients.map((r) => (
                    <label
                      key={r.id}
                      className="flex items-center gap-2.5 px-2.5 py-2 rounded-[9px] cursor-pointer hover:bg-surface-hover"
                    >
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(r.id)}
                        onChange={() => toggleRecipient(r.id)}
                        className="accent-navy w-[15px] h-[15px]"
                      />
                      <div className="min-w-0">
                        <div className="text-[13px] font-medium truncate">{r.name}</div>
                        {r.email && <div className="text-[11px] text-ink-tertiary truncate">{r.email}</div>}
                      </div>
                    </label>
                  ))}
                </div>
              </>
            )}
          </div>
        </Card>

        <Card pad>
          <div className="text-[15px] font-semibold mb-3.5 flex items-center gap-2">
            Message <Badge tone="gray" dot={false}>System</Badge>
          </div>
          <Field label="Title">
            <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Update on your application" maxLength={120} />
          </Field>
          <Field label="Message">
            <Textarea value={body} onChange={(e) => setBody(e.target.value)} placeholder="What do you want to tell them?" maxLength={500} />
          </Field>
          <Button variant="primary" className="w-full mt-1" disabled={!canSubmit} onClick={submit}>
            <Send size={15} /> {send.isPending ? 'Sending...' : 'Send notification'}
          </Button>
        </Card>
      </StaggerItem>
    </StaggerGroup>
  )
}
