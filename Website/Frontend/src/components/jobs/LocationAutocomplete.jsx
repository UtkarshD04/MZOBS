import { useEffect, useId, useRef, useState } from 'react'
import { Laptop, MapPin, Globe, Loader2 } from 'lucide-react'
import { Input } from '../ui/Field'
import { useJobSuggestionsQuery } from '../../hooks/useJobs'
import { useAutocompleteNav } from '../../hooks/useAutocompleteNav'
import { useDebouncedValue } from '../../hooks/useDebouncedValue'
import { cn } from '../../lib/utils'

const ALL_LOCATIONS_ROW = { kind: 'all-locations' }

// Self-contained location autocomplete: owns its own (short) debounce for
// fetching suggestions, independent of whatever debounce the caller uses
// before committing the field to the URL — see FilterSidebar/
// DesktopFilterPanel, which handle "immediate" selections (this component's
// `onSelect`) separately from "still typing" ones (`onTyping`).
export default function LocationAutocomplete({ value, onTyping, onSelect }) {
  const [open, setOpen] = useState(false)
  const containerRef = useRef(null)
  const listboxId = useId()
  const debouncedValue = useDebouncedValue(value, 300)
  const hasQuery = debouncedValue.trim().length > 0

  const { data, isFetching } = useJobSuggestionsQuery({ type: 'location', q: debouncedValue, limit: 15 }, { enabled: open })
  const items = data?.items ?? []
  const rows = [...items, ALL_LOCATIONS_ROW]

  function selectRow(row) {
    onSelect(row.kind === 'all-locations' ? '' : row.value)
    setOpen(false)
  }

  const { highlighted, setHighlighted, onKeyDown } = useAutocompleteNav({
    rowCount: rows.length,
    open,
    onSelectIndex: (i) => selectRow(rows[i]),
    onClose: () => setOpen(false),
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
      <Input
        value={value}
        onChange={(e) => onTyping(e.target.value)}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
        onKeyDown={onKeyDown}
        placeholder="City, or “Remote”"
        aria-label="Filter by location"
        role="combobox"
        aria-expanded={open}
        aria-controls={listboxId}
        aria-autocomplete="list"
        aria-activedescendant={highlighted >= 0 ? `${listboxId}-opt-${highlighted}` : undefined}
        autoComplete="off"
      />

      {open && (
        <div className="absolute z-30 left-0 right-0 mt-1.5 bg-surface border border-border rounded-xl shadow-lg overflow-hidden">
          <div className="px-3.5 pt-3 pb-1.5 text-[11px] font-semibold tracking-wide uppercase text-ink-tertiary">
            {hasQuery ? 'Matching locations' : 'Popular cities'}
          </div>
          <ul id={listboxId} role="listbox" className="max-h-80 overflow-y-auto py-1">
            {isFetching && !items.length ? (
              <li className="px-3.5 py-3 text-[13px] text-ink-tertiary flex items-center gap-2">
                <Loader2 size={13} className="animate-spin" /> Loading…
              </li>
            ) : (
              rows.map((row, i) => (
                <li key={row.kind === 'all-locations' ? '__all' : row.value} role="presentation">
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
                      row.kind === 'all-locations' && 'border-t border-border mt-1',
                      i === highlighted ? 'bg-navy-tint text-navy' : 'text-ink hover:bg-surface-hover'
                    )}
                  >
                    {row.kind === 'all-locations' ? (
                      <>
                        <Globe size={15} className="flex-shrink-0 text-ink-tertiary" />
                        <span>All locations</span>
                      </>
                    ) : row.isRemote ? (
                      <>
                        <Laptop size={15} className="flex-shrink-0 text-ink-tertiary" />
                        <span className="truncate">
                          Remote{row.count > 0 && <span className="text-ink-tertiary"> · {row.count} job{row.count === 1 ? '' : 's'}</span>}
                        </span>
                      </>
                    ) : (
                      <>
                        <MapPin size={15} className="flex-shrink-0 text-ink-tertiary" />
                        <span className="truncate">
                          {row.source === 'curated' ? (
                            `Explore jobs in ${row.value}`
                          ) : (
                            <>
                              {row.value}
                              <span className="text-ink-tertiary"> · {row.count} job{row.count === 1 ? '' : 's'}</span>
                            </>
                          )}
                        </span>
                      </>
                    )}
                  </button>
                </li>
              ))
            )}
          </ul>
        </div>
      )}
    </div>
  )
}
