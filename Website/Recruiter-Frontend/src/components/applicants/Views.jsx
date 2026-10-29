import { useState } from 'react'
import { Link } from 'react-router-dom'
import clsx from 'clsx'
import { BellRing, Briefcase, MapPin, Star } from 'lucide-react'
import { Avatar } from '../ui'
import { StagePill, Tag, fmtDate } from '../rc'
import { PIPELINE, STAGE_LABEL } from '../../services/recruiterService'

const dueNow = (c) => c.followUpOn && new Date(c.followUpOn) <= new Date()

function OwnerChip({ owner }) {
  if (!owner) return <span className="text-[11.5px] text-muted">Unassigned</span>
  const initials = owner.name.split(/\s+/).map((p) => p[0]).slice(0, 2).join('').toUpperCase()
  return (
    <span className="inline-flex items-center gap-1 text-[11.5px] text-ink-2" title={`Owner: ${owner.name}`}>
      <span className="grid h-4 w-4 place-items-center rounded-full bg-[#dfe7ee] text-[8.5px] font-bold text-ink-2">{initials}</span>
      {owner.name.split(' ')[0]}
    </span>
  )
}

function Highlights({ list, max = 2 }) {
  if (!list?.length) return null
  return (
    <div className="flex flex-wrap gap-1">
      {list.slice(0, max).map((h) => (
        <span key={h.label} title={h.detail} className={clsx('rounded px-1.5 py-px text-[11px] font-semibold', h.ok ? 'bg-accent-soft text-accent' : 'bg-[#f3efe6] text-[#7a5a14]')}>{h.label}</span>
      ))}
    </div>
  )
}

export function ApplicantCard({ c, selected, onSelect, onOpen, canManage, showJob, onDragStart }) {
  return (
    <article
      draggable={canManage}
      onDragStart={(e) => {
        e.dataTransfer.setData('text/plain', c.id)
        e.dataTransfer.effectAllowed = 'move'
        onDragStart?.(c)
      }}
      className={clsx('group rounded-lg border bg-white p-2.5 transition-colors', selected ? 'border-accent bg-accent-soft/30' : 'border-line hover:border-[#b9c8d2]', canManage && 'cursor-grab active:cursor-grabbing')}
    >
      <div className="flex items-start gap-2">
        {canManage && (
          <input type="checkbox" checked={selected} onChange={() => onSelect(c.id)} aria-label={`Select ${c.name}`} className="mt-1 h-3.5 w-3.5 shrink-0 accent-[#08685e]" />
        )}
        <Avatar candidate={c} size={30} />
        <button type="button" onClick={() => onOpen(c.id)} className="min-w-0 flex-1 text-left">
          <span className="block truncate text-[13.5px] font-semibold leading-tight text-ink group-hover:text-accent">{c.name}</span>
          <span className="block truncate text-[12px] text-muted">{c.currentRole || 'Role not stated'}</span>
        </button>
        {c.premium && <span title="Premium candidate" className="text-[#b8860b]"><Star size={12} fill="currentColor" /></span>}
      </div>
      <div className="mt-1.5 flex flex-wrap items-center gap-x-2.5 gap-y-0.5 text-[11.5px] text-ink-2">
        <span className="num">{c.experienceYears} yrs</span>
        {c.location && <span className="inline-flex items-center gap-0.5"><MapPin size={11} className="text-muted" />{c.location}</span>}
        <span className="text-muted">Applied {fmtDate(c.appliedAt, { day: 'numeric', month: 'short' })}</span>
      </div>
      {showJob && c.jobTitle && <p className="mt-1 flex items-center gap-1 truncate text-[11.5px] text-muted"><Briefcase size={11} />{c.jobTitle}</p>}
      <div className="mt-1.5"><Highlights list={c.highlights} /></div>
      {(c.tags.length > 0 || dueNow(c)) && (
        <div className="mt-1.5 flex flex-wrap items-center gap-1">
          {c.tags.slice(0, 2).map((t) => <Tag key={t}>{t}</Tag>)}
          {c.tags.length > 2 && <span className="text-[11px] text-muted">+{c.tags.length - 2}</span>}
          {dueNow(c) && <span className="inline-flex items-center gap-0.5 text-[11px] font-semibold text-warn" title={`Follow-up was due ${fmtDate(c.followUpOn)}`}><BellRing size={11} />Follow up</span>}
        </div>
      )}
      <div className="mt-1.5 border-t border-line-2 pt-1.5"><OwnerChip owner={c.owner} /></div>
    </article>
  )
}

export function Board({ items, counts, selected, onSelect, onOpen, canManage, showJob, onDropTo, columnCounts }) {
  const [over, setOver] = useState(null)
  return (
    <div className="scroll-thin -mx-4 flex gap-3 overflow-x-auto px-4 pb-3 lg:-mx-6 lg:px-6" role="list" aria-label="Applicant pipeline">
      {PIPELINE.map((col) => {
        const rows = items.filter((c) => c.stage === col.key)
        return (
          <section
            key={col.key}
            role="listitem"
            aria-label={`${col.label}, ${counts[col.key] ?? 0}`}
            onDragOver={(e) => {
              if (!canManage) return
              e.preventDefault()
              setOver(col.key)
            }}
            onDragLeave={() => setOver((o) => (o === col.key ? null : o))}
            onDrop={(e) => {
              e.preventDefault()
              setOver(null)
              const id = e.dataTransfer.getData('text/plain')
              if (id) onDropTo(id, col.key)
            }}
            className={clsx('flex w-[264px] shrink-0 flex-col rounded-xl border bg-[#efede6] transition-colors', over === col.key ? 'border-accent bg-accent-soft/50' : 'border-transparent')}
          >
            <header className="flex items-center justify-between px-3 py-2">
              <h3 className="text-[12px] font-bold uppercase tracking-[0.05em] text-ink-2">{col.label}</h3>
              <span className="num rounded bg-white px-1.5 py-px text-[11.5px] font-semibold text-ink-2">{columnCounts?.[col.key] ?? counts[col.key] ?? 0}</span>
            </header>
            <div className="scroll-thin flex max-h-[68vh] flex-1 flex-col gap-2 overflow-y-auto px-2 pb-2">
              {rows.length === 0 ? (
                <p className="px-1 py-6 text-center text-[12px] text-muted">{canManage ? 'Drop a candidate here' : 'Nobody here'}</p>
              ) : (
                rows.map((c) => <ApplicantCard key={c.id} c={c} selected={selected.has(c.id)} onSelect={onSelect} onOpen={onOpen} canManage={canManage} showJob={showJob} />)
              )}
            </div>
          </section>
        )
      })}
    </div>
  )
}

export function Table({ items, selected, onSelect, onSelectAll, onOpen, canManage, showJob }) {
  const all = items.length > 0 && items.every((c) => selected.has(c.id))
  return (
    <div className="overflow-x-auto rounded-xl border border-line bg-white">
      <table className="w-full min-w-[860px] text-left text-[13px]">
        <thead className="border-b border-line bg-[#faf9f6] text-[11.5px] font-bold uppercase tracking-[0.04em] text-ink-2">
          <tr>
            {canManage && <th className="w-9 px-3 py-2"><input type="checkbox" checked={all} onChange={() => onSelectAll(!all)} aria-label="Select all" className="h-3.5 w-3.5 accent-[#08685e]" /></th>}
            <th className="px-3 py-2">Candidate</th>
            {showJob && <th className="px-3 py-2">Job</th>}
            <th className="px-3 py-2">Stage</th>
            <th className="px-3 py-2">Exp.</th>
            <th className="px-3 py-2">City</th>
            <th className="px-3 py-2">Match</th>
            <th className="px-3 py-2">Owner</th>
            <th className="px-3 py-2">Applied</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-line-2">
          {items.map((c) => (
            <tr key={c.id} className={clsx('hover:bg-[#faf9f6]', selected.has(c.id) && 'bg-accent-soft/30')}>
              {canManage && <td className="px-3 py-2"><input type="checkbox" checked={selected.has(c.id)} onChange={() => onSelect(c.id)} aria-label={`Select ${c.name}`} className="h-3.5 w-3.5 accent-[#08685e]" /></td>}
              <td className="px-3 py-2">
                <button type="button" onClick={() => onOpen(c.id)} className="flex items-center gap-2 text-left">
                  <Avatar candidate={c} size={28} />
                  <span className="min-w-0"><span className="block truncate font-semibold text-ink hover:text-accent">{c.name}</span><span className="block truncate text-[12px] text-muted">{c.currentRole || '—'}</span></span>
                </button>
              </td>
              {showJob && <td className="px-3 py-2 text-ink-2">{c.jobId ? <Link to={`/jobs/${c.jobId}/applicants`} className="hover:text-accent hover:underline">{c.jobTitle}</Link> : '—'}</td>}
              <td className="px-3 py-2"><StagePill stage={c.stage} label={STAGE_LABEL[c.stage]} /></td>
              <td className="num px-3 py-2">{c.experienceYears} yrs</td>
              <td className="px-3 py-2 text-ink-2">{c.location || '—'}</td>
              <td className="px-3 py-2"><Highlights list={c.highlights} max={3} /></td>
              <td className="px-3 py-2"><OwnerChip owner={c.owner} /></td>
              <td className="px-3 py-2 text-muted">{fmtDate(c.appliedAt, { day: 'numeric', month: 'short' })}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
