import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Trash2, Pencil, ArrowLeft, FolderOpen, X, FileText, CalendarPlus } from 'lucide-react'
import { Avatar, Button, EmptyState, Chip } from '../components/ui'
import { useWorkspace } from '../store/workspace'
import { getTalentMany, listPipelineShortlisted } from '../services/talentService'
import { setCandidateStage } from '../services/liveApi'
import { agoDate, years, lpa } from '../lib/format'
import { useActions } from '../components/useActions'
import { makeCriteria, STAGE_LABELS } from '../lib/talent/criteria'

// The default "Shortlisted" list is the server's own record, not just this device's: anyone in the company's
// pipeline at Shortlisted (or further along toward a hire) shows up in it, however they got there — the profile's
// Pipeline buttons, a teammate, another device — merged with whoever was added to it by hand on this device.
const DEFAULT_ID = 'default'

function ListDetail({ list, pipelineIds, onBack, onChanged }) {
  const { removeFromShortlist, renameShortlist, deleteShortlist, toast } = useWorkspace()
  const { onAction, host } = useActions(makeCriteria(), { onInterviewScheduled: onChanged })
  const [people, setPeople] = useState(null)
  const [renaming, setRenaming] = useState(false)
  const [name, setName] = useState(list.name)
  const idsKey = list.candidateIds.join(',')
  useEffect(() => {
    getTalentMany(list.candidateIds).then(setPeople)
    // eslint-disable-next-line react-hooks/exhaustive-deps -- keyed on the ids, not the array identity
  }, [idsKey])

  // Taking someone off the default list also takes them out of Shortlisted in the pipeline, otherwise they'd reappear.
  async function remove(c) {
    if (list.id === DEFAULT_ID && pipelineIds.has(c.id) && c._live?.candidateId) {
      try {
        await setCandidateStage(c._live.candidateId, 'shared')
      } catch (e) {
        return toast(e.response?.data?.message ?? 'Could not remove them from Shortlisted', { tone: 'warn' })
      }
    }
    removeFromShortlist(list.id, c.id)
    onChanged?.()
  }

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
          {list.id !== DEFAULT_ID && <Button icon={Trash2} onClick={() => { deleteShortlist(list.id); toast('Shortlist deleted'); onBack() }}>Delete</Button>}
        </div>
      </div>
      <p className="mt-1 text-[13px] text-muted">{list.candidateIds.length} candidates · last activity {agoDate(list.lastActivity)}</p>

      {people && people.length === 0 && <EmptyState icon={FolderOpen} title="This shortlist is empty" body="Use Shortlist on any candidate card to add people here." />}
      <ul className="mt-5 space-y-2">
        {people?.map((c) => {
          const stage = c._live?.stage
          const canRemove = !(list.id === DEFAULT_ID && pipelineIds.has(c.id) && stage !== 'shortlisted')
          return (
            <li key={c.id} className="flex flex-wrap items-center gap-3 rounded-2xl border border-line bg-white p-3.5 shadow-card">
              <Avatar candidate={c} size={40} />
              <div className="min-w-0 flex-1">
                <Link to={`/candidate/${c.id}`} className="font-semibold hover:text-accent">{c.name}</Link>
                <p className="truncate text-[13px] text-muted">{c.designation} · {years(c.experienceYears)} · {c.location} · {lpa(c.expectedSalaryLPA)}</p>
              </div>
              {stage && stage !== 'shared' && <Chip tone="accent">{STAGE_LABELS[stage] ?? stage}</Chip>}
              <div className="hidden gap-1 md:flex">{c.skills.slice(0, 3).map((s) => <Chip key={s}>{s}</Chip>)}</div>
              <Button size="sm" icon={FileText} onClick={() => onAction('resume', c)}>View CV</Button>
              <Button size="sm" icon={CalendarPlus} onClick={() => onAction('interview', c)}>Schedule interview</Button>
              <Button size="sm" onClick={() => onAction('contact', c)}>Contact</Button>
              {canRemove && <Button size="sm" variant="ghost" icon={X} onClick={() => remove(c)} aria-label={`Remove ${c.name}`} />}
            </li>
          )
        })}
      </ul>
      {host}
    </div>
  )
}

export default function Shortlists() {
  const { shortlists, createShortlist } = useWorkspace()
  const [openId, setOpenId] = useState(null)
  const [name, setName] = useState('')
  const [pipeline, setPipeline] = useState([])
  const reload = useCallback(() => listPipelineShortlisted().then(setPipeline).catch(() => setPipeline([])), [])
  useEffect(() => {
    reload()
  }, [reload])

  const pipelineIds = useMemo(() => new Set(pipeline.map((p) => p.id)), [pipeline])
  const lists = useMemo(
    () => shortlists.map((l) => (l.id === DEFAULT_ID ? { ...l, candidateIds: [...new Set([...l.candidateIds, ...pipelineIds])] } : l)),
    [shortlists, pipelineIds]
  )
  const open = lists.find((l) => l.id === openId)

  return (
    <div className="mx-auto max-w-[980px] px-4 py-8 lg:px-6">
      {open ? <ListDetail list={open} pipelineIds={pipelineIds} onBack={() => setOpenId(null)} onChanged={reload} /> : (
        <>
          <h1 className="text-[30px] font-extrabold tracking-[-0.03em] text-ink">Shortlists</h1>
          <p className="mt-1 text-[14px] text-muted">Talent collections — group people by role, urgency or stage. Candidates you shortlist anywhere appear in Shortlisted.</p>
          <form onSubmit={(e) => { e.preventDefault(); if (name.trim()) { createShortlist(name); setName('') } }} className="mt-5 flex max-w-md gap-2">
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="New shortlist, e.g. Senior Python Talent" className="h-10 flex-1 rounded-lg border border-line bg-white px-3 text-[14px] outline-none focus:border-accent" />
            <Button variant="primary" icon={Plus} disabled={!name.trim()} size="lg">Create</Button>
          </form>
          <ul className="mt-6 grid gap-3 sm:grid-cols-2">
            {lists.map((l) => (
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
