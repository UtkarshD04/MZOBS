import { useState } from 'react'
import { Plus, X } from 'lucide-react'
import { criteriaToChips, removeChip } from '../../lib/talentLens/parseQuery'
import { Input } from '../ui/Field'

// Shows how Mzobs understood a natural-language search as editable chips —
// transparent and correctable, instead of silently applying filters the
// recruiter can't see or undo.
export default function SmartFilterChips({ criteria, onChange }) {
  const [adding, setAdding] = useState(false)
  const [draft, setDraft] = useState('')
  const chips = criteriaToChips(criteria)

  function addKeyword() {
    const value = draft.trim()
    if (!value) {
      setAdding(false)
      return
    }
    onChange({ ...criteria, includeKeywords: [...(criteria.includeKeywords ?? []), value] })
    setDraft('')
    setAdding(false)
  }

  if (!chips.length && !adding) return null

  return (
    <div>
      <p className="text-[11.5px] font-semibold uppercase tracking-wide text-ink-tertiary mb-2">Your search</p>
      <div className="flex flex-wrap items-center gap-2">
        {chips.map((chip) => (
          <span key={chip.key} className="inline-flex items-center gap-1.5 text-[12.5px] font-medium pl-3 pr-2 py-[6px] rounded-full bg-navy-tint text-navy">
            {chip.label}
            <button onClick={() => onChange(removeChip(criteria, chip.key))} className="w-4 h-4 rounded-full flex items-center justify-center hover:bg-navy/15" aria-label={`Remove ${chip.label}`}>
              <X size={11} />
            </button>
          </span>
        ))}

        {adding ? (
          <Input
            autoFocus
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') addKeyword()
              if (e.key === 'Escape') setAdding(false)
            }}
            onBlur={addKeyword}
            placeholder="Add a keyword…"
            className="!h-8 !w-40 !text-[12.5px] !rounded-full"
          />
        ) : (
          <button onClick={() => setAdding(true)} className="inline-flex items-center gap-1 text-[12.5px] font-semibold text-ink-secondary hover:text-navy px-2.5 py-[6px] rounded-full border border-dashed border-border-strong hover:border-navy">
            <Plus size={13} /> Add requirement
          </button>
        )}
      </div>
    </div>
  )
}
