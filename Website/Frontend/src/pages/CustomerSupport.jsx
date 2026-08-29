import { useState } from 'react'
import { HeadphonesIcon, Mail, Phone, MessageSquareText } from 'lucide-react'
import Card, { CardHead, CardBody } from '../components/ui/Card'
import Badge from '../components/ui/Badge'
import Button from '../components/ui/Button'
import EmptyState from '../components/ui/EmptyState'
import ErrorState from '../components/ui/ErrorState'
import { PageSkeleton } from '../components/ui/Skeleton'
import { Field, Input, Select, Textarea } from '../components/ui/Field'
import { StaggerGroup, StaggerItem } from '../components/ui/Stagger'
import { useApp } from '../context/AppContext'
import { useMyTicketsQuery, useSubmitTicketMutation } from '../hooks/useSupport'

const CATEGORIES = ['General', 'Resume Verification', 'Mock Interview', 'Application Status', 'Payment', 'Technical Issue']
const STATUS_TONE = { Open: 'gold', 'In Progress': 'navy', Resolved: 'green' }

export default function CustomerSupport() {
  const app = useApp()
  const [form, setForm] = useState({ subject: '', category: 'General', message: '' })
  const { data: tickets = [], isLoading, isError, refetch } = useMyTicketsQuery()
  const submitTicket = useSubmitTicketMutation()

  function submit() {
    if (!form.subject || !form.message) {
      app.addToast('error', 'Please fill in a subject and message.')
      return
    }
    submitTicket.mutate(form, {
      onSuccess: () => {
        app.addToast('success', "Query submitted — we'll respond within 24 hours.")
        setForm({ subject: '', category: 'General', message: '' })
      },
      onError: (err) => app.addToast('error', err.response?.data?.message ?? 'Could not submit your query. Please try again.'),
    })
  }

  return (
    <StaggerGroup>
      <StaggerItem className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Customer Support</h1>
        <p className="text-sm text-ink-secondary mt-1">Raise a query with the Mzobs team and track its status here.</p>
      </StaggerItem>

      <StaggerItem className="grid grid-cols-3 gap-4 mb-6 max-md:grid-cols-1">
        <ContactCard icon={MessageSquareText} title="Raise a Query" desc="We usually respond within a few hours" />
        <ContactCard icon={Mail} title="Email Support" desc="support@mzobs.com" onClick={() => app.addToast('success', 'Opening your email client…')} />
        <ContactCard icon={Phone} title="Call Us" desc="+91 80 4567 8900 · Mon–Sat, 9am–7pm" onClick={() => app.addToast('success', 'Redirecting to dialer…')} />
      </StaggerItem>

      <StaggerItem className="grid grid-cols-3 gap-5 max-xl:grid-cols-1">
        <Card className="col-span-1 max-xl:col-span-1 h-fit">
          <CardHead><span className="text-[15px] font-semibold">Raise a Query</span></CardHead>
          <CardBody>
            <Field label="Subject">
              <Input value={form.subject} onChange={(e) => setForm((f) => ({ ...f, subject: e.target.value }))} placeholder="Briefly describe your issue" />
            </Field>
            <Field label="Category">
              <Select value={form.category} onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}>
                {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
              </Select>
            </Field>
            <Field label="Message">
              <Textarea rows={4} value={form.message} onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))} placeholder="Tell us more…" />
            </Field>
            <Button variant="primary" size="md" className="w-full" disabled={submitTicket.isPending} onClick={submit}>
              <HeadphonesIcon size={15} /> {submitTicket.isPending ? 'Submitting...' : 'Submit Query'}
            </Button>
          </CardBody>
        </Card>

        <Card className="col-span-2 max-xl:col-span-1">
          <CardHead><span className="text-[15px] font-semibold">Your Queries</span></CardHead>
          <CardBody>
            {isLoading ? (
              <PageSkeleton />
            ) : isError ? (
              <ErrorState onRetry={refetch} />
            ) : tickets.length === 0 ? (
              <EmptyState icon={HeadphonesIcon} title="No queries yet" body="Queries you raise with the Mzobs team will show up here, along with their status." />
            ) : (
              <div className="flex flex-col gap-3">
                {tickets.map((t) => (
                  <div key={t.id} className="rounded-xl border border-border p-3.5">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="text-[13.5px] font-semibold">{t.subject}</div>
                        <div className="text-xs text-ink-tertiary mt-0.5">{t.category} · {new Date(t.createdAt).toLocaleDateString('en-IN')}</div>
                      </div>
                      <Badge tone={STATUS_TONE[t.status] ?? 'gray'}>{t.status}</Badge>
                    </div>
                    <p className="text-[13px] text-ink-secondary mt-2">{t.message}</p>
                    {t.reply && (
                      <div className="mt-3 rounded-lg bg-surface-sunken p-3">
                        <div className="text-[11px] font-semibold text-ink-tertiary uppercase tracking-wide mb-1">Mzobs response</div>
                        <p className="text-[13px]">{t.reply}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardBody>
        </Card>
      </StaggerItem>
    </StaggerGroup>
  )
}

function ContactCard({ icon: Icon, title, desc, onClick }) {
  return (
    <Card hover={!!onClick} pad className="flex items-start gap-3.5">
      <span className="w-10 h-10 rounded-xl bg-navy-tint text-navy flex items-center justify-center flex-shrink-0"><Icon size={18} /></span>
      <div className="flex-1 min-w-0">
        <div className="text-[13.5px] font-semibold">{title}</div>
        <div className="text-[12px] text-ink-tertiary mt-0.5">{desc}</div>
        {onClick && <button onClick={onClick} className="text-[12.5px] font-semibold text-navy hover:underline mt-2">Open →</button>}
      </div>
    </Card>
  )
}
