import { useEffect, useId, useMemo, useRef, useState } from 'react'
import { ChevronDown, Search } from 'lucide-react'

const MAX_SHOWN = 60

// Searchable college dropdown for the "add campus" form. Opens on click/focus
// (unlike a native <datalist>, which many browsers only show after typing),
// filters as you type, and still accepts a name that isn't in the list.
export default function CollegePicker({ value, onChange, options, disabled, placeholder, invalid, describedBy, className }) {
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState(0)
  const wrap = useRef(null)
  const listRef = useRef(null)
  const listId = useId()

  const query = value.trim().toLowerCase()
  const matches = useMemo(() => {
    if (!query) return options
    const words = query.split(/\s+/)
    const starts = []
    const rest = []
    for (const o of options) {
      const name = o.name.toLowerCase()
      if (!words.every((w) => name.includes(w))) continue
      ;(name.startsWith(query) ? starts : rest).push(o)
    }
    return starts.concat(rest)
  }, [options, query])
  const shown = matches.slice(0, MAX_SHOWN)

  useEffect(() => {
    if (!open) return
    const close = (e) => wrap.current && !wrap.current.contains(e.target) && setOpen(false)
    document.addEventListener('mousedown', close)
    document.addEventListener('touchstart', close)
    return () => {
      document.removeEventListener('mousedown', close)
      document.removeEventListener('touchstart', close)
    }
  }, [open])

  useEffect(() => {
    listRef.current?.children[active]?.scrollIntoView({ block: 'nearest' })
  }, [active])

  const pick = (name) => {
    onChange(name)
    setOpen(false)
  }

  function onKeyDown(e) {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      if (!open) setOpen(true)
      else setActive((i) => Math.min(i + 1, shown.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActive((i) => Math.max(i - 1, 0))
    } else if (e.key === 'Enter' && open && shown[active]) {
      e.preventDefault()
      pick(shown[active].name)
    } else if (e.key === 'Escape') {
      setOpen(false)
    }
  }

  const showList = open && !disabled && options.length > 0

  return (
    <div ref={wrap} className="relative">
      <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#98a2b3]" />
      <input
        value={value}
        onChange={(e) => {
          onChange(e.target.value)
          setActive(0)
          setOpen(true)
        }}
        onFocus={() => setOpen(true)}
        onClick={() => setOpen(true)}
        onKeyDown={onKeyDown}
        disabled={disabled}
        placeholder={placeholder}
        autoComplete="off"
        maxLength={200}
        role="combobox"
        aria-expanded={showList}
        aria-controls={listId}
        aria-autocomplete="list"
        aria-invalid={invalid}
        aria-describedby={describedBy}
        className={`${className} pl-9 pr-9`}
      />
      <button
        type="button"
        tabIndex={-1}
        aria-label={showList ? 'Hide colleges' : 'Show colleges'}
        disabled={disabled}
        onClick={() => setOpen((o) => !o)}
        className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-[#667085] disabled:opacity-40"
      >
        <ChevronDown size={18} className={`transition-transform ${showList ? 'rotate-180' : ''}`} />
      </button>

      {showList && (
        <ul
          ref={listRef}
          id={listId}
          role="listbox"
          className="absolute z-30 mt-1 max-h-72 w-full overflow-y-auto rounded-[3px] border border-[#d0d5dd] bg-white py-1 shadow-lg"
        >
          {shown.length ? (
            shown.map((o, i) => (
              <li
                key={o.name}
                role="option"
                aria-selected={i === active}
                onMouseDown={(e) => {
                  e.preventDefault()
                  pick(o.name)
                }}
                onMouseEnter={() => setActive(i)}
                className={`cursor-pointer px-3 py-2 text-[14px] ${i === active ? 'bg-[#e8f4f2] text-[#075f55]' : 'text-[#101828]'}`}
              >
                {o.name}
                <span className="ml-2 text-[11.5px] text-[#98a2b3]">{o.type}</span>
              </li>
            ))
          ) : (
            <li className="px-3 py-2 text-[13px] text-[#667085]">No match in the list. Your typed name will be used.</li>
          )}
          {matches.length > MAX_SHOWN && (
            <li className="border-t border-[#eaecf0] px-3 py-2 text-[12px] text-[#667085]">
              Showing {MAX_SHOWN} of {matches.length.toLocaleString('en-IN')}. Type more to narrow down.
            </li>
          )}
        </ul>
      )}
    </div>
  )
}
