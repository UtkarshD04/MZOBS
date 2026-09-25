import { useEffect, useRef, useState } from 'react'
import { Check, Plus } from 'lucide-react'
import clsx from 'clsx'
import { useWorkspace } from '../store/workspace'
import { mirrorShortlistToPipeline } from './ActionModals'

/**
 * Anchored popover for choosing which shortlist a candidate goes into.
 * Adding confirms with a toast that offers Undo; picking a list the candidate is
 * already in removes them (so the same control both adds and removes).
 */
export default function ShortlistPicker({ candidate, onClose, className }) {
  const { shortlists, addToShortlist, removeFromShortlist, createShortlist, toast } = useWorkspace()
  const [name, setName] = useState('')
  const box = useRef(null)

  useEffect(() => {
    const onDoc = (e) => box.current && !box.current.contains(e.target) && onClose()
    const onKey = (e) => e.key === 'Escape' && (e.stopPropagation(), onClose())
    document.addEventListener('mousedown', onDoc)
    document.addEventListener('keydown', onKey, true)
    return () => {
      document.removeEventListener('mousedown', onDoc)
      document.removeEventListener('keydown', onKey, true)
    }
  }, [onClose])

  const add = (list) => {
    addToShortlist(list.id, [candidate.id])
    mirrorShortlistToPipeline([candidate.id])
    toast(`${candidate.name} added to ${list.name}`, { action: { label: 'Undo', run: () => removeFromShortlist(list.id, candidate.id) } })
    onClose()
  }
  const toggle = (list) => {
    if (list.candidateIds.includes(candidate.id)) {
      removeFromShortlist(list.id, candidate.id)
      toast(`${candidate.name} removed from ${list.name}`)
      onClose()
    } else add(list)
  }

  return (
    <div ref={box} role="dialog" aria-label="Choose shortlist" className={clsx('fade-up absolute z-40 w-64 rounded-2xl border border-line bg-white p-1.5 shadow-pop', className)}>
      <p className="px-2.5 pb-1 pt-1.5 text-[11px] font-semibold uppercase tracking-wide text-muted">Add to shortlist</p>
      <ul className="max-h-48 overflow-y-auto scroll-thin">
        {shortlists.map((l) => {
          const has = l.candidateIds.includes(candidate.id)
          return (
            <li key={l.id}>
              <button onClick={() => toggle(l)} className="flex w-full items-center justify-between gap-2 rounded-lg px-2.5 py-1.5 text-left text-[13px] transition-colors hover:bg-line-2">
                <span className="min-w-0 truncate">{l.name} <span className="text-[11.5px] text-muted">{l.candidateIds.length}</span></span>
                {has && <Check size={14} className="pop shrink-0 text-ok" />}
              </button>
            </li>
          )
        })}
      </ul>
      <form
        className="mt-1 flex gap-1 border-t border-line-2 p-1.5"
        onSubmit={(e) => {
          e.preventDefault()
          if (!name.trim()) return
          add(createShortlist(name))
        }}
      >
        <input autoFocus value={name} onChange={(e) => setName(e.target.value)} placeholder="New shortlist…" aria-label="New shortlist name" className="h-8 min-w-0 flex-1 rounded-lg border border-line px-2 text-[12.5px] outline-none focus:border-accent" />
        <button disabled={!name.trim()} aria-label="Create shortlist" className="grid h-8 w-8 place-items-center rounded-lg bg-accent text-white transition-colors hover:bg-ink disabled:opacity-40"><Plus size={15} /></button>
      </form>
    </div>
  )
}
