import { useCallback, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import clsx from 'clsx'
import { Bell, CheckCheck, LifeBuoy, Mail, Settings as Cog, LogOut, CreditCard } from 'lucide-react'
import { Button, EmptyState, Skeleton } from '../components/ui'
import { useWorkspace } from '../store/workspace'
import { IS_DEMO } from '../lib/config'
import { getSession, logout } from '../services/liveApi'
import { listNotifications, markRead, markAllRead, submitTicket, NOTIFICATION_ROUTES, TICKET_CATEGORIES } from '../services/accountService'

function Page({ title, sub, children }) {
  return (
    <div className="mx-auto max-w-[820px] px-4 py-8 lg:px-6">
      <h1 className="text-[30px] font-extrabold tracking-[-0.03em] text-ink">{title}</h1>
      {sub && <p className="mt-1 text-[14px] text-muted">{sub}</p>}
      <div className="mt-6">{children}</div>
    </div>
  )
}

const TONE = { jobs: 'bg-blue-soft text-[#1f6fb2]', candidates: 'bg-accent-soft text-accent', billing: 'bg-warn-soft text-warn', interviews: 'bg-ai-soft text-[#0a6f64]', offers: 'bg-ok-soft text-[#1a8f5a]', batches: 'bg-accent-soft text-accent', system: 'bg-line-2 text-ink-2' }

export function Notifications() {
  const nav = useNavigate()
  const { toast } = useWorkspace()
  const [items, setItems] = useState(null)
  const [error, setError] = useState(false)

  const load = useCallback(() => listNotifications().then((r) => { setItems(r); setError(false) }).catch(() => setError(true)), [])
  useEffect(() => { load() }, [load])

  const open = async (n) => {
    if (n.unread) {
      setItems((x) => x.map((i) => (i.id === n.id ? { ...i, unread: false } : i)))
      markRead(n.id).then(() => window.dispatchEvent(new Event('mzt-notifications-changed'))).catch(() => {})
    }
    const to = NOTIFICATION_ROUTES[n.category]
    if (to) nav(to)
  }
  const readAll = async () => {
    try {
      await markAllRead()
      setItems((x) => x.map((i) => ({ ...i, unread: false })))
      window.dispatchEvent(new Event('mzt-notifications-changed'))
      toast('All notifications marked as read')
    } catch {
      toast('Could not update notifications', { tone: 'warn' })
    }
  }
  const unread = items?.filter((i) => i.unread).length ?? 0

  return (
    <Page title="Notifications" sub="Updates about your jobs, candidates, interviews and billing.">
      {error ? (
        <EmptyState icon={Bell} title="Couldn’t load notifications" action={<Button onClick={load}>Retry</Button>} />
      ) : !items ? (
        <div className="space-y-2">{[0, 1, 2].map((i) => <Skeleton key={i} className="h-16 w-full" />)}</div>
      ) : items.length === 0 ? (
        <EmptyState icon={Bell} title="You’re all caught up" body={IS_DEMO ? 'Demo mode has no notifications.' : 'New activity on your jobs and candidates shows up here.'} />
      ) : (
        <>
          <div className="mb-3 flex items-center justify-between">
            <p className="text-[13px] text-muted">{unread ? `${unread} unread` : 'All read'}</p>
            {unread > 0 && <Button size="sm" icon={CheckCheck} onClick={readAll}>Mark all as read</Button>}
          </div>
          <ul className="space-y-2">
            {items.map((n) => (
              <li key={n.id}>
                <button onClick={() => open(n)} className={clsx('flex w-full items-start gap-3 rounded-2xl border p-4 text-left shadow-card transition-all hover:-translate-y-px hover:shadow-lift', n.unread ? 'border-[#bfe6df] bg-[#f2fbf9]' : 'border-line bg-white')}>
                  <span className={clsx('mt-0.5 rounded-md px-2 py-0.5 text-[11px] font-semibold capitalize', TONE[n.category] ?? TONE.system)}>{n.category}</span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-[14px] font-semibold">{n.title}</span>
                    <span className="block text-[13px] text-ink-2">{n.body}</span>
                  </span>
                  <span className="flex shrink-0 flex-col items-end gap-1 text-[12px] text-muted">{n.time}{n.unread && <span className="h-2 w-2 rounded-full bg-accent" />}</span>
                </button>
              </li>
            ))}
          </ul>
        </>
      )}
    </Page>
  )
}

export function Help() {
  const { toast } = useWorkspace()
  const [f, setF] = useState({ subject: '', category: 'General', message: '' })
  const [busy, setBusy] = useState(false)
  const [sent, setSent] = useState(false)
  const set = (p) => setF((x) => ({ ...x, ...p }))
  const valid = f.subject.trim() && f.message.trim().length >= 10

  const send = async (e) => {
    e.preventDefault()
    if (IS_DEMO) return toast('Demo mode: tickets are not sent.', { tone: 'warn' })
    setBusy(true)
    try {
      await submitTicket({ subject: f.subject.trim(), category: f.category, message: f.message.trim() })
      setSent(true)
      setF({ subject: '', category: 'General', message: '' })
    } catch (err) {
      toast(err.response?.data?.message ?? 'Could not send your request', { tone: 'warn' })
    } finally {
      setBusy(false)
    }
  }
  const input = 'mt-1 w-full rounded-lg border border-line bg-white px-3 text-[14px] outline-none focus:border-accent'
  return (
    <Page title="Help & support" sub="Ask a question or report a problem — the Mzobs team replies by email.">
      {sent ? (
        <div className="fade-up rounded-2xl border border-[#bfe8cf] bg-ok-soft p-6 text-center">
          <LifeBuoy className="mx-auto text-[#1a8f5a]" />
          <h2 className="mt-2 text-[17px] font-bold">Request received</h2>
          <p className="mt-1 text-[13.5px] text-ink-2">We’ll get back to you soon.</p>
          <Button className="mt-4" onClick={() => setSent(false)}>Send another</Button>
        </div>
      ) : (
        <form onSubmit={send} className="space-y-4 rounded-2xl border border-line bg-white p-5 shadow-card">
          <label className="block text-[12.5px] font-medium text-ink-2">Topic
            <select value={f.category} onChange={(e) => set({ category: e.target.value })} className={clsx(input, 'h-10')}>{TICKET_CATEGORIES.map((c) => <option key={c}>{c}</option>)}</select>
          </label>
          <label className="block text-[12.5px] font-medium text-ink-2">Subject
            <input value={f.subject} onChange={(e) => set({ subject: e.target.value })} className={clsx(input, 'h-10')} placeholder="What do you need help with?" />
          </label>
          <label className="block text-[12.5px] font-medium text-ink-2">Message
            <textarea rows={6} value={f.message} onChange={(e) => set({ message: e.target.value })} className={clsx(input, 'p-3 leading-6')} placeholder="Describe the issue — include the job or candidate if it’s about one." />
          </label>
          <div className="flex items-center justify-between gap-3">
            <a href="mailto:hello@mzobs.com" className="inline-flex items-center gap-1.5 text-[13px] font-medium text-accent hover:underline"><Mail size={14} /> Or email hello@mzobs.com</a>
            <Button variant="primary" disabled={!valid || busy}>{busy ? 'Sending…' : 'Send request'}</Button>
          </div>
        </form>
      )}
    </Page>
  )
}

export function Settings() {
  const nav = useNavigate()
  const session = getSession()
  const signOut = () => {
    if (!window.confirm('Sign out of Mzobs Talent?')) return
    logout()
    window.dispatchEvent(new Event('mzt-signed-out'))
  }
  const row = (label, value) => (
    <div className="flex items-center justify-between gap-4 border-b border-line-2 py-3 last:border-0">
      <dt className="text-[13px] text-muted">{label}</dt>
      <dd className="text-[14px] font-medium">{value || '—'}</dd>
    </div>
  )
  return (
    <Page title="Recruiter settings" sub="Your account and workspace.">
      <div className="space-y-5">
        <section className="rounded-2xl border border-line bg-white p-5 shadow-card">
          <h2 className="mb-1 flex items-center gap-2 text-[15px] font-semibold"><Cog size={15} className="text-muted" /> Account</h2>
          {IS_DEMO ? <p className="py-3 text-[13px] text-muted">Demo mode has no signed-in account.</p> : (
            <dl>
              {row('Name', session?.user?.name)}
              {row('Email', session?.user?.email)}
              {row('Role', session?.user?.role)}
              {row('Company', session?.company?.name)}
            </dl>
          )}
        </section>
        <section className="rounded-2xl border border-line bg-white p-5 shadow-card">
          <h2 className="mb-3 text-[15px] font-semibold">Quick links</h2>
          <div className="flex flex-wrap gap-2">
            <Button icon={CreditCard} onClick={() => nav('/credits')}>Plan & credits</Button>
            <Button icon={Bell} onClick={() => nav('/notifications')}>Notifications</Button>
            <Button icon={LifeBuoy} onClick={() => nav('/help')}>Help & support</Button>
          </div>
        </section>
        {!IS_DEMO && <Button icon={LogOut} onClick={signOut}>Sign out</Button>}
        <p className="text-[12px] text-muted">Password and profile changes are managed from your Mzobs employer account. <Link to="/help" className="text-accent hover:underline">Need help?</Link></p>
      </div>
    </Page>
  )
}
