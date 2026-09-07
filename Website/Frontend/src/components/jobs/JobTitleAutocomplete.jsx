import { useEffect, useId, useRef, useState } from 'react'
import { Briefcase, Search, Loader2 } from 'lucide-react'
import { IconInput, Input } from '../ui/Field'
import { useJobSuggestionsQuery } from '../../hooks/useJobs'
import { useAutocompleteNav } from '../../hooks/useAutocompleteNav'
import { cn } from '../../lib/utils'

const SEARCH_ALL_ROW = { kind: 'search-all' }

// The "Job title, skills, or company" search box, with a rich title
// autocomplete dropdown layered on top. Typing/committing behaviour is
// unchanged from a plain input (`onChange` on every keystroke, `onCommit`
// on debounce elapsing elsewhere) — this only adds the suggestions panel.
export default function JobTitleAutocomplete({ value, debouncedValue, onChange, onCommit }) {
  const [open, setOpen] = useState(false)
  const containerRef = useRef(null)
  const listboxId = useId()

  const hasQuery = debouncedValue.trim().length > 0
  const { data, isFetching } = useJobSuggestionsQuery({ type: 'title', q: debouncedValue, limit: 15 }, { enabled: open })
  const items = data?.items ?? []
  const rows = hasQuery ? [...items, SEARCH_ALL_ROW] : items

  function selectRow(row) {
    const text = row.kind === 'search-all' ? value.trim() : row.value
    if (!text) return
    onChange(text)
    onCommit(text)
    setOpen(false)
  }

  const { highlighted, setHighlighted, onKeyDown } = useAutocompleteNav({
    rowCount: rows.length,
    open,
    onSelectIndex: (i) => selectRow(rows[i]),
    onClose: () => setOpen(false),
    onEnterFallback: value.trim() ? () => selectRow(SEARCH_ALL_ROW) : undefined,
  })

  useEffect(() => {
    if (!open) return
    function onDocMouseDown(e) {
      if (!containerRef.current?.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', onDocMouseDown)
    return () => document.removeEventListener('mousedown', onDocMouseDown)
  }, [open])

  return (
    <div ref={containerRef} className="relative">
      <IconInput icon={<Search size={15} />}>
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setOpen(true)}
          onBlur={() => setOpen(false)}
          onKeyDown={onKeyDown}
          placeholder="Job title, skills, or company"
          aria-label="Search jobs"
          role="combobox"
          aria-expanded={open}
          aria-controls={listboxId}
          aria-autocomplete="list"
          aria-activedescendant={highlighted >= 0 ? `${listboxId}-opt-${highlighted}` : undefined}
          autoComplete="off"
        />
      </IconInput>

      {open && (
        <div className="absolute z-30 left-0 right-0 mt-1.5 bg-surface border border-border rounded-xl shadow-lg overflow-hidden">
          <div className="px-3.5 pt-3 pb-1.5 text-[11px] font-semibold tracking-wide uppercase text-ink-tertiary">
            {hasQuery ? 'Matching titles' : 'Popular job titles'}
          </div>
          <ul id={listboxId} role="listbox" className="max-h-80 overflow-y-auto py-1">
            {isFetching && !items.length ? (
              <li className="px-3.5 py-3 text-[13px] text-ink-tertiary flex items-center gap-2">
                <Loader2 size={13} className="animate-spin" /> Loading…
              </li>
            ) : rows.length ? (
              rows.map((row, i) => (
                <li key={row.kind === 'search-all' ? '__search-all' : row.value} role="presentation">
                  <button
                    id={`${listboxId}-opt-${i}`}
                    role="option"
                    aria-selected={i === highlighted}
                    type="button"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => selectRow(row)}
                    onMouseEnter={() => setHighlighted(i)}
                    className={cn(
                      'w-full flex items-center gap-2.5 px-3.5 py-2.5 text-left text-[13.5px] cursor-pointer transition-colors',
                      row.kind === 'search-all' && 'border-t border-border mt-1',
                      i === highlighted ? 'bg-navy-tint text-navy' : 'text-ink hover:bg-surface-hover'
                    )}
                  >
                    {row.kind === 'search-all' ? (
                      <>
                        <Search size={15} className="flex-shrink-0 text-ink-tertiary" />
                        <span className="truncate">
                          Search all jobs for “{value.trim()}”
                        </span>
                      </>
                    ) : (
                      <>
                        <Briefcase size={15} className="flex-shrink-0 text-ink-tertiary" />
                        <span className="truncate">
                          {row.value}
                          {row.count > 0 && <span className="text-ink-tertiary"> · {row.count} job{row.count === 1 ? '' : 's'}</span>}
                        </span>
                      </>
                    )}
                  </button>
                </li>
              ))
            ) : (
              <li className="px-3.5 py-3 text-[13px] text-ink-tertiary">No matching titles</li>
            )}
          </ul>
        </div>
      )}
    </div>
  )
}
