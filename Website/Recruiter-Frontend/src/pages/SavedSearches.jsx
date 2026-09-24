import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Play, Pencil, Trash2, Bell, BellOff, Bookmark } from 'lucide-react'
import { Button, Chip, EmptyState, Skeleton } from '../components/ui'
import { useWorkspace } from '../store/workspace'
import { criteriaToChips } from '../lib/talent/criteria'
import { searchTalent } from '../services/talentService'
import { agoDate } from '../lib/format'

function Row({ s }) {
  const nav = useNavigate()
  const { updateSavedSearch, deleteSavedSearch, toast } = useWorkspace()
  const [count, setCount] = useState(undefined)
  const [editing, setEditing] = useState(false)
  const [name, setName] = useState(s.name)

  useEffect(() => {
    searchTalent(s.criteria, { pageSize: 1 }).then((r) => setCount(r.total)).catch(() => setCount(null))
  }, [s.criteria])

  const fresh = count != null && s.lastCount != null ? Math.max(0, count - s.lastCount) : 0
  const run = () => {
    if (count != null) updateSavedSearch(s.id, { lastCount: count, lastRunAt: new Date().toISOString() })
    nav('/', { state: { criteria: s.criteria } })
  }

  return (
    <li className="rounded-2xl border border-line bg-white p-4 shadow-card transition-shadow hover:shadow-lift sm:p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          {editing ? (
            <form onSubmit={(e) => { e.preventDefault(); updateSavedSearch(s.id, { name: name.trim() || s.name }); setEditing(false) }} className="flex gap-2">
              <input autoFocus value={name} onChange={(e) => setName(e.target.value)} className="h-9 rounded-lg border border-line px-3 text-[14px] outline-none focus:border-accent" />
              <Button variant="primary" size="sm">Save</Button>
            </form>
          ) : (
            <h2 className="text-[16px] font-semibold">{s.name}</h2>
          )}
          <div className="mt-2 flex flex-wrap gap-1.5">{criteriaToChips(s.criteria).slice(0, 8).map((c) => <Chip key={c.key}>{c.label}</Chip>)}</div>
        </div>
        <div className="flex gap-6 text-right">
          <div><p className="text-[11.5px] uppercase tracking-wide text-muted">Candidates</p><p className="text-[20px] font-bold tabular-nums">{count === undefined ? <Skeleton className="ml-auto h-6 w-10" /> : count ?? '—'}</p></div>
          <div><p className="text-[11.5px] uppercase tracking-wide text-muted">New</p><p className={`text-[20px] font-bold tabular-nums ${fresh ? 'text-ok' : 'text-muted'}`}>{fresh ? `+${fresh}` : '0'}</p></div>
        </div>
      </div>
      <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-line-2 pt-3">
        <span className="text-[12px] text-muted">Last run {agoDate(s.lastRunAt)}</span>
        <div className="flex flex-wrap gap-1.5">
          <Button size="sm" variant="primary" icon={Play} onClick={run}>Run search</Button>
          <Button size="sm" icon={s.alert ? BellOff : Bell} onClick={() => { updateSavedSearch(s.id, { alert: !s.alert }); toast(s.alert ? 'Alert turned off' : 'Alert on — new matches will be flagged here') }}>{s.alert ? 'Alert on' : 'Create alert'}</Button>
          <Button size="sm" icon={Pencil} onClick={() => setEditing((v) => !v)}>Edit</Button>
          <Button size="sm" variant="ghost" icon={Trash2} onClick={() => { deleteSavedSearch(s.id); toast('Saved search deleted') }}>Delete</Button>
        </div>
      </div>
    </li>
  )
}

export default function SavedSearches() {
  const { saved } = useWorkspace()
  return (
    <div className="mx-auto max-w-[980px] px-4 py-8 lg:px-6">
      <h1 className="text-[30px] font-extrabold tracking-[-0.03em] text-ink">Saved searches</h1>
      <p className="mt-1 text-[14px] text-muted">Re-run a search in one click and see who's new since you last looked.</p>
      {saved.length === 0 ? (
        <EmptyState icon={Bookmark} title="No saved searches yet" body="Run a search, then choose “Save search” in the filters panel." action={<Button variant="primary" onClick={() => (window.location.href = '/')}>Search candidates</Button>} />
      ) : (
        <ul className="mt-6 space-y-3">{saved.map((s) => <Row key={s.id} s={s} />)}</ul>
      )}
      <p className="mt-6 text-[12px] text-muted">Alerts are flagged inside Mzobs on this device. Email alerts need the notifications service to be connected.</p>
    </div>
  )
}
