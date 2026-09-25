import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Trash2, Pencil, ArrowLeft, FolderOpen, X, FileText } from 'lucide-react'
import { Avatar, Button, EmptyState, Chip } from '../components/ui'
import { useWorkspace } from '../store/workspace'
import { getTalentMany } from '../services/talentService'
import { agoDate, years, lpa } from '../lib/format'
import { useActions } from '../components/useActions'
import { makeCriteria } from '../lib/talent/criteria'

function ListDetail({ list, onBack }) {
  const { removeFromShortlist, renameShortlist, deleteShortlist, toast } = useWorkspace()
  const { onAction, host } = useActions(makeCriteria())
  const [people, setPeople] = useState(null)
  const [renaming, setRenaming] = useState(false)
  const [name, setName] = useState(list.name)
  useEffect(() => {
    getTalentMany(list.candidateIds).then(setPeople)
  }, [list.candidateIds])

  return (
    <div>
      <button onClick={onBack} className="mb-3 inline-flex items-center gap-1.5 text-[13px] font-medium text-muted hover:text-ink"><ArrowLeft size={14} /> All shortlists</button>
      <div className="flex flex-wrap items-center justify-between gap-3">
        {renaming ? (
          <form onSubmit={(e) => { e.preventDefault(); if (name.trim()) renameShortlist(list.id, name.trim()); setRenaming(false) }} className="flex gap-2">
            <input autoFocus value={name} onChange={(e) => setName(e.target.value)} className="h-10 rounded-lg border border-line px-3 text-[16px] outline-none focus:border-accent" />
            <Button variant="primary">Save</Button>
          </form>
        ) : <h1 className="text-[26px] font-bold tracking-tight">{list.name}</h1>}
        <div className="flex gap-2">
          <Button icon={Pencil} onClick={() => setRenaming(true)}>Rename</Button>
          {list.id !== 'default' && <Button icon={Trash2} onClick={() => { deleteShortlist(list.id); toast('Shortlist deleted'); onBack() }}>Delete</Button>}
        </div>
      </div>
      <p className="mt-1 text-[13px] text-muted">{list.candidateIds.length} candidates · last activity {agoDate(list.lastActivity)}</p>

      {people && people.length === 0 && <EmptyState icon={FolderOpen} title="This shortlist is empty" body="Use Shortlist on any candidate card to add people here." />}
      <ul className="mt-5 space-y-2">
        {people?.map((c) => (
          <li key={c.id} className="flex flex-wrap items-center gap-3 rounded-2xl border border-line bg-white p-3.5 shadow-card">
            <Avatar candidate={c} size={40} />
            <div className="min-w-0 flex-1">
              <Link to={`/candidate/${c.id}`} className="font-semibold hover:text-accent">{c.name}</Link>
              <p className="truncate text-[13px] text-muted">{c.designation} · {years(c.experienceYears)} · {c.location} · {lpa(c.expectedSalaryLPA)}</p>
            </div>
            <div className="hidden gap-1 md:flex">{c.skills.slice(0, 3).map((s) => <Chip key={s}>{s}</Chip>)}</div>
            <Button size="sm" icon={FileText} onClick={() => onAction('resume', c)}>View CV</Button>
            <Button size="sm" onClick={() => onAction('contact', c)}>Contact</Button>
            <Button size="sm" variant="ghost" icon={X} onClick={() => removeFromShortlist(list.id, c.id)} aria-label={`Remove ${c.name}`} />
          </li>
        ))}
      </ul>
      {host}
    </div>
  )
}

export default function Shortlists() {
  const { shortlists, createShortlist } = useWorkspace()
  const [openId, setOpenId] = useState(null)
  const [name, setName] = useState('')
  const open = shortlists.find((l) => l.id === openId)

  return (
    <div className="mx-auto max-w-[980px] px-4 py-8 lg:px-6">
      {open ? <ListDetail list={open} onBack={() => setOpenId(null)} /> : (
        <>
          <h1 className="text-[30px] font-extrabold tracking-[-0.03em] text-ink">Shortlists</h1>
          <p className="mt-1 text-[14px] text-muted">Talent collections — group people by role, urgency or stage.</p>
          <form onSubmit={(e) => { e.preventDefault(); if (name.trim()) { createShortlist(name); setName('') } }} className="mt-5 flex max-w-md gap-2">
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="New shortlist, e.g. Senior Python Talent" className="h-10 flex-1 rounded-lg border border-line bg-white px-3 text-[14px] outline-none focus:border-accent" />
            <Button variant="primary" icon={Plus} disabled={!name.trim()} size="lg">Create</Button>
          </form>
          <ul className="mt-6 grid gap-3 sm:grid-cols-2">
            {shortlists.map((l) => (
              <li key={l.id}>
                <button onClick={() => setOpenId(l.id)} className="flex w-full items-center justify-between rounded-2xl border border-line bg-white p-4 text-left shadow-card transition-all hover:-translate-y-px hover:border-[#9fd5cc] hover:shadow-lift">
                  <div><p className="text-[15px] font-semibold">{l.name}</p><p className="text-[12.5px] text-muted">Last activity {agoDate(l.lastActivity)}</p></div>
                  <div className="text-right"><p className="text-[22px] font-bold tabular-nums">{l.candidateIds.length}</p><p className="text-[11.5px] text-muted">candidates</p></div>
                </button>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  )
}
