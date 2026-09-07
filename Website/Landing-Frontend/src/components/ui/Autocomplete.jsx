import { useEffect, useId, useRef, useState } from 'react'
import { Briefcase, Tag, Building2, MapPin, Globe, Plus, X } from 'lucide-react'

const DEBOUNCE_MS = 300

const KIND_ICON = {
  title: Briefcase,
  skill: Tag,
  company: Building2,
  location: MapPin,
  remote: Globe,
}

const KIND_GROUP_LABEL = {
  title: 'Job titles',
  skill: 'Skills',
  company: 'Companies',
  location: 'Popular locations',
  remote: '',
}

function countLabel(count) {
  if (!count) return null
  return `${count} job${count === 1 ? '' : 's'}`
}

// Original MZOBS multi-tag autocomplete for the home-page search bar — pick
// several job titles/skills/companies, or several cities/"Remote", into the
// same box (each a removable chip) and only search once "Find jobs" is
// clicked, rather than firing a search on every pick. A text input wired up
// as a combobox (WAI-ARIA combobox/listbox/option pattern) with a debounced,
// cancellable fetch, grouped/ranked suggestions, and keyboard navigation.
// Not a copy of any third-party job board's picker — own visuals (the
// page's --jobs-* palette), own grouping/icon/tag rules, own markup.
//
// `fetchItems(query, { signal })` must resolve to an array of
// `{ value, count?, kind? }` objects, already ordered/grouped the way they
// should render (this component renders a group header whenever `kind`
// changes from the previous item, it doesn't re-sort anything itself).
export default function Autocomplete({
  tags,
  onAddTag,
  onRemoveTag,
  fetchItems,
  placeholder,
  icon,
  label,
  searchActionLabel,
  className = '',
}) {
  const [open, setOpen] = useState(false)
  const [inputValue, setInputValue] = useState('')
  const [items, setItems] = useState([])
  const [activeIndex, setActiveIndex] = useState(-1)
  const [loading, setLoading] = useState(false)

  const inputRef = useRef(null)
  const debounceRef = useRef(null)
  const abortRef = useRef(null)
  const requestSeqRef = useRef(0)
  const listboxId = useId()

  const trimmed = inputValue.trim()
  const alreadyTagged = trimmed && tags.some((t) => t.value.toLowerCase() === trimmed.toLowerCase())
  const showAddAction = Boolean(trimmed && !alreadyTagged)
  // Add-current-text counts as one more selectable row after the fetched items.
  const rowCount = items.length + (showAddAction ? 1 : 0)

  function runFetch(query) {
    abortRef.current?.abort()
    const controller = new AbortController()
    abortRef.current = controller
    const requestId = ++requestSeqRef.current
    setLoading(true)

    fetchItems(query, { signal: controller.signal })
      .then((result) => {
        // Stale-response guard: a slower earlier request can still resolve
        // after a newer one — only the latest requestId is allowed to paint.
        if (requestId !== requestSeqRef.current) return
        setItems(Array.isArray(result) ? result : [])
        setActiveIndex(-1)
      })
      .catch((err) => {
        if (err?.name === 'AbortError') return
        if (requestId !== requestSeqRef.current) return
        setItems([])
      })
      .finally(() => {
        if (requestId === requestSeqRef.current) setLoading(false)
      })
  }

  function scheduleFetch(query) {
    clearTimeout(debounceRef.current)
    // Focusing with nothing typed yet needs the "popular defaults" list
    // right away — no reason to make that wait out the typing debounce.
    if (!query.trim()) {
      runFetch(query)
      return
    }
    debounceRef.current = setTimeout(() => runFetch(query), DEBOUNCE_MS)
  }

  useEffect(() => {
    return () => {
      clearTimeout(debounceRef.current)
      abortRef.current?.abort()
    }
  }, [])

  function handleFocus() {
    setOpen(true)
    scheduleFetch(inputValue)
  }

  function handleChange(e) {
    const next = e.target.value
    setInputValue(next)
    setOpen(true)
    scheduleFetch(next)
  }

  function addTag(item) {
    if (tags.some((t) => t.value.toLowerCase() === item.value.toLowerCase())) return
    onAddTag(item)
    setInputValue('')
    setActiveIndex(-1)
    // Keep the dropdown open on the "popular defaults" list so picking
    // several titles/cities in a row doesn't mean re-opening it each time.
    scheduleFetch('')
    inputRef.current?.focus()
  }

  function addTypedText() {
    if (!trimmed || alreadyTagged) return
    addTag({ value: trimmed, kind: undefined })
  }

  function activateRow(index) {
    if (index < items.length) addTag(items[index])
    else addTypedText()
  }

  function handleKeyDown(e) {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      if (!open) {
        setOpen(true)
        scheduleFetch(inputValue)
        return
      }
      setActiveIndex((i) => (rowCount ? (i + 1) % rowCount : -1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      if (!rowCount) return
      setActiveIndex((i) => (i <= 0 ? rowCount - 1 : i - 1))
    } else if (e.key === 'Enter') {
      if (open && activeIndex >= 0 && activeIndex < rowCount) {
        e.preventDefault()
        activateRow(activeIndex)
      } else if (trimmed) {
        e.preventDefault()
        addTypedText()
      }
    } else if (e.key === 'Escape') {
      if (open) {
        e.preventDefault()
        setOpen(false)
        setActiveIndex(-1)
      }
    } else if (e.key === 'Backspace' && !inputValue && tags.length) {
      onRemoveTag(tags.length - 1)
    }
  }

  const activeOptionId = activeIndex >= 0 ? `${listboxId}-option-${activeIndex}` : undefined
  let lastKind = null

  return (
    <div className={`relative flex-1 ${className}`}>
      <div className="flex flex-wrap items-center gap-1.5 px-3.5 py-2 h-full">
        <span className="text-(--jobs-ink-soft) shrink-0 pl-0.5" aria-hidden="true">
          {icon}
        </span>
        <span className="sr-only">{label}</span>

        {tags.map((tag, i) => {
          const Icon = KIND_ICON[tag.kind] ?? null
          return (
            <span
              key={`${tag.kind ?? 'tag'}-${tag.value}-${i}`}
              className="inline-flex items-center gap-1 h-7 pl-2 pr-1 rounded-md bg-(--jobs-blue-tint) text-(--jobs-blue-dark) text-[13px] font-semibold"
            >
              {Icon && <Icon size={11} className="shrink-0" aria-hidden="true" />}
              <span className="max-w-32 truncate">{tag.value}</span>
              <button
                type="button"
                onClick={() => onRemoveTag(i)}
                aria-label={`Remove ${tag.value}`}
                className="flex items-center justify-center w-4.5 h-4.5 rounded hover:bg-(--jobs-blue)/20 shrink-0"
              >
                <X size={11} aria-hidden="true" />
              </button>
            </span>
          )
        })}

        <input
          ref={inputRef}
          type="text"
          role="combobox"
          aria-autocomplete="list"
          aria-expanded={open}
          aria-controls={listboxId}
          aria-activedescendant={activeOptionId}
          value={inputValue}
          onChange={handleChange}
          onFocus={handleFocus}
          onKeyDown={handleKeyDown}
          onBlur={() => setOpen(false)}
          placeholder={tags.length ? '' : placeholder}
          autoComplete="off"
          className="flex-1 min-w-24 bg-transparent outline-none text-[14.5px] text-(--jobs-navy) placeholder:text-(--jobs-ink-soft)"
        />
      </div>

      {open && (rowCount > 0 || loading) && (
        <ul
          id={listboxId}
          role="listbox"
          aria-label={label}
          className="absolute z-30 left-0 right-0 top-full mt-2 max-h-96 overflow-y-auto rounded-lg border border-(--jobs-border) bg-white shadow-lg shadow-(--jobs-navy)/10 py-1.5"
        >
          {items.map((item, index) => {
            const showGroupHeader = item.kind && item.kind !== lastKind && KIND_GROUP_LABEL[item.kind]
            lastKind = item.kind
            const Icon = KIND_ICON[item.kind] ?? MapPin
            const active = index === activeIndex
            const tagged = tags.some((t) => t.value.toLowerCase() === item.value.toLowerCase())
            return (
              <li key={`${item.kind ?? 'item'}-${item.value}`} role="presentation">
                {showGroupHeader && (
                  <p role="presentation" className="px-3.5 pt-2 pb-1 text-[11px] font-bold uppercase tracking-wide text-(--jobs-ink-soft)">
                    {KIND_GROUP_LABEL[item.kind]}
                  </p>
                )}
                <div
                  id={`${listboxId}-option-${index}`}
                  role="option"
                  aria-selected={active}
                  aria-disabled={tagged}
                  // onMouseDown (not onClick) fires before the input's onBlur,
                  // so preventDefault here keeps focus in the input and lets
                  // the selection commit before the dropdown would otherwise
                  // close itself out from under the click.
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => !tagged && addTag(item)}
                  onMouseEnter={() => setActiveIndex(index)}
                  className={`flex items-center justify-between gap-3 mx-1.5 px-2.5 py-2 rounded-md text-[13.5px] ${
                    tagged
                      ? 'opacity-40 cursor-default'
                      : `cursor-pointer ${active ? 'bg-(--jobs-blue-tint) text-(--jobs-blue-dark)' : 'text-(--jobs-navy) hover:bg-(--jobs-blue-tint)/60'}`
                  }`}
                >
                  <span className="flex items-center gap-2 min-w-0">
                    <Icon size={14} className="shrink-0 text-(--jobs-ink-soft)" aria-hidden="true" />
                    <span className="truncate font-semibold">{item.value}</span>
                  </span>
                  {countLabel(item.count) && <span className="shrink-0 text-[12px] text-(--jobs-ink-soft)">{countLabel(item.count)}</span>}
                </div>
              </li>
            )
          })}

          {showAddAction && (
            <li role="presentation">
              <div
                id={`${listboxId}-option-${items.length}`}
                role="option"
                aria-selected={activeIndex === items.length}
                onMouseDown={(e) => e.preventDefault()}
                onClick={addTypedText}
                onMouseEnter={() => setActiveIndex(items.length)}
                className={`flex items-center gap-2 mx-1.5 mt-1 px-2.5 py-2 rounded-md cursor-pointer text-[13.5px] font-bold border-t border-(--jobs-border) ${
                  activeIndex === items.length ? 'bg-(--jobs-blue-tint) text-(--jobs-blue-dark)' : 'text-(--jobs-blue) hover:bg-(--jobs-blue-tint)/60'
                }`}
              >
                <Plus size={14} className="shrink-0" aria-hidden="true" />
                <span className="truncate">{searchActionLabel ? searchActionLabel(trimmed) : `Add “${trimmed}”`}</span>
              </div>
            </li>
          )}

          {!rowCount && loading && <li role="presentation" className="px-3.5 py-2.5 text-[13px] text-(--jobs-ink-soft)">Loading…</li>}
        </ul>
      )}
    </div>
  )
}
