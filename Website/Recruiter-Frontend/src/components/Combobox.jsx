import { useEffect, useId, useRef, useState } from 'react'
import clsx from 'clsx'
import { Loader2 } from 'lucide-react'

/**
 * Compact accessible autocomplete (ARIA 1.2 combobox): type to filter/search, ↑/↓ to move,
 * Enter to pick, Esc to close. The parent owns `value` (the text) and `options`
 * ({ key, label, hint? }); picking calls onSelect(option).
 */
export default function Combobox({ label, value, onInput, options, onSelect, loading, error, notice, emptyText = 'No matches', placeholder, disabled, hideLabel, inputClass, className }) {
  const id = useId()
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState(-1)
  const box = useRef(null)

  useEffect(() => setActive(-1), [options])
  useEffect(() => {
    const away = (e) => box.current && !box.current.contains(e.target) && setOpen(false)
    document.addEventListener('mousedown', away)
    return () => document.removeEventListener('mousedown', away)
  }, [])

  const pick = (o) => {
    setOpen(false)
    onSelect(o)
  }
  const onKey = (e) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setOpen(true); setActive((i) => Math.min(options.length - 1, i + 1)) }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setActive((i) => Math.max(0, i - 1)) }
    else if (e.key === 'Enter' && open && active >= 0 && options[active]) { e.preventDefault(); pick(options[active]) }
    else if (e.key === 'Escape') setOpen(false)
  }
  const showList = open && !disabled
  return (
    <div ref={box} className={clsx('relative', className)}>
      <label htmlFor={id} className={hideLabel ? 'sr-only' : 'text-[12.5px] font-medium text-ink-2'}>{label}</label>
      <div className={hideLabel ? '' : 'mt-1'}>
        <input
          id={id}
          role="combobox"
          aria-expanded={showList}
          aria-controls={`${id}-list`}
          aria-autocomplete="list"
          aria-activedescendant={active >= 0 ? `${id}-o${active}` : undefined}
          aria-invalid={error ? true : undefined}
          autoComplete="off"
          disabled={disabled}
          value={value}
          placeholder={placeholder}
          onChange={(e) => { onInput(e.target.value); setOpen(true) }}
          onFocus={() => setOpen(true)}
          onKeyDown={onKey}
          className={clsx('h-10 w-full rounded-lg border bg-white px-3 pr-8 text-[14px] outline-none focus:border-accent disabled:bg-line-2 disabled:text-muted', error ? 'border-bad' : 'border-line', inputClass)}
        />
        {loading && <Loader2 size={14} className="pointer-events-none absolute right-2.5 bottom-3 animate-spin text-muted" aria-hidden />}
      </div>
      {showList && (
        <ul id={`${id}-list`} role="listbox" aria-label={label} className="absolute z-20 mt-1 max-h-60 w-full overflow-auto rounded-lg border border-line bg-white py-1 shadow-lift">
          {options.map((o, i) => (
            <li
              key={o.key}
              id={`${id}-o${i}`}
              role="option"
              aria-selected={i === active}
              onMouseDown={(e) => { e.preventDefault(); pick(o) }}
              onMouseEnter={() => setActive(i)}
              className={clsx('cursor-pointer px-3 py-1.5 text-[13.5px]', i === active ? 'bg-accent-soft text-ink' : 'text-ink-2')}
            >
              <span className="block truncate">{o.label}</span>
              {o.hint && <span className="block truncate text-[11.5px] text-muted">{o.hint}</span>}
            </li>
          ))}
          {!options.length && <li className="px-3 py-2 text-[13px] text-muted" role="status">{loading ? 'Searching…' : emptyText}</li>}
        </ul>
      )}
      {error ? <p role="alert" className="mt-1 text-[12px] text-bad">{error}</p> : notice && <p className="mt-1 text-[12px] text-muted">{notice}</p>}
    </div>
  )
}
