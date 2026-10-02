import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { ChevronDown, SlidersHorizontal } from 'lucide-react'
import { FILTER_GROUPS, OptionList, selectedCount } from './MarketplaceFilters'

const QUICK_KEYS = ['workModes', 'experience', 'salary', 'postedWithin', 'jobTypes']
const POPOVER_WIDTH = 280

const pillBase =
  'inline-flex h-9 shrink-0 items-center gap-1.5 rounded-full border px-3.5 text-[13.5px] font-medium transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#078B7D]'
const pillIdle = 'border-[#DCE5EC] bg-white text-mz-ink-2 hover:border-[#12A89D]/50 hover:bg-[#E8F7F4] hover:text-[#12304A]'
const pillActive = 'border-[#078B7D] bg-[#E8F7F4] text-[#078B7D]'

// One quick-filter dropdown. The row of pills scrolls sideways (and is
// edge-masked), so the popover is portalled to <body> and position: fixed,
// measured from the pill — nested in the row it would be clipped. It carries
// .mz-home itself so it keeps the homepage palette outside that wrapper.
// Changes apply to the feed as they're ticked — the popover is just a
// shortcut into the same filter state.
function QuickFilter({ groupKey, state, setState, facets, open, onOpen, onClose }) {
  const group = FILTER_GROUPS[groupKey]
  const count = selectedCount(groupKey, state)
  const buttonRef = useRef(null)
  const popoverRef = useRef(null)
  const [pos, setPos] = useState(null)

  useLayoutEffect(() => {
    if (!open) return
    const place = () => {
      const r = buttonRef.current.getBoundingClientRect()
      const width = Math.min(POPOVER_WIDTH, window.innerWidth - 32)
      setPos({
        top: r.bottom + 6,
        left: Math.max(16, Math.min(r.left, window.innerWidth - width - 16)),
        width,
      })
    }
    place()
    window.addEventListener('resize', place)
    return () => window.removeEventListener('resize', place)
  }, [open])

  useEffect(() => {
    if (!open) return
    const onDown = (e) => {
      if (!popoverRef.current?.contains(e.target) && !buttonRef.current?.contains(e.target)) onClose()
    }
    const onKey = (e) => {
      if (e.key !== 'Escape') return
      onClose()
      buttonRef.current?.focus()
    }
    // A fixed popover would detach from its pill as the page scrolls.
    const onScroll = () => onClose()
    document.addEventListener('mousedown', onDown)
    document.addEventListener('touchstart', onDown, { passive: true })
    window.addEventListener('keydown', onKey)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      document.removeEventListener('mousedown', onDown)
      document.removeEventListener('touchstart', onDown)
      window.removeEventListener('keydown', onKey)
      window.removeEventListener('scroll', onScroll)
    }
  }, [open, onClose])

  function clear() {
    setState((prev) => ({
      ...prev,
      [groupKey]: group.single ? '' : [],
      ...(groupKey === 'experience' ? { experienceYears: null } : {}),
    }))
  }

  const popoverId = `quick-filter-${groupKey}`
  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        onClick={() => (open ? onClose() : onOpen())}
        aria-expanded={open}
        aria-controls={open ? popoverId : undefined}
        className={`${pillBase} ${count ? pillActive : pillIdle}`}
      >
        {group.label}
        {count > 0 && <span className="text-[12px] font-bold tabular-nums">· {count}</span>}
        <ChevronDown size={14} className={`transition-transform duration-150 ${open ? 'rotate-180' : ''}`} aria-hidden="true" />
      </button>

      {open &&
        pos &&
        createPortal(
          <div
            ref={popoverRef}
            id={popoverId}
            role="group"
            aria-label={group.label}
            style={{ top: pos.top, left: pos.left, width: pos.width }}
            className="mz-home fixed z-[55] flex max-h-[60vh] flex-col rounded-[12px] border border-mz-line bg-white shadow-[0_12px_32px_-12px_rgba(22,50,79,0.28)]"
          >
            <div className="overflow-y-auto overscroll-contain p-2">
              <OptionList groupKey={groupKey} state={state} setState={setState} facets={facets} />
            </div>
            <div className="flex items-center justify-between border-t border-mz-line px-3 py-2">
              <button
                type="button"
                onClick={clear}
                disabled={!count}
                className="rounded-[8px] px-2 py-1.5 text-[13px] font-semibold text-mz-muted transition-colors hover:text-mz-ink disabled:invisible"
              >
                Clear
              </button>
              <button
                type="button"
                onClick={onClose}
                className="rounded-[8px] bg-gradient-to-r from-[#078B7D] to-[#056F68] px-3.5 py-1.5 text-[13px] font-semibold text-white transition-shadow hover:shadow-[0_4px_12px_-4px_rgba(7,139,125,0.55)]"
              >
                Done
              </button>
            </div>
          </div>,
          document.body,
        )}
    </>
  )
}

// The pill row above the feed: "All filters" (opens the full panel) plus the
// most-used groups as dropdowns.
export default function QuickFilters({ state, setState, facets, activeCount, onOpenAll }) {
  const [openKey, setOpenKey] = useState(null)
  const close = useRef(() => setOpenKey(null)).current

  return (
    <div className="mz-scroll-x mz-fade-end -mx-4 overflow-x-auto px-4 sm:mx-0 sm:px-0">
      <div className="flex min-w-max items-center gap-2 pr-6" role="toolbar" aria-label="Quick filters">
        <button
          type="button"
          onClick={() => {
            setOpenKey(null)
            onOpenAll()
          }}
          aria-haspopup="dialog"
          className={`${pillBase} ${activeCount ? pillActive : pillIdle} font-semibold`}
        >
          <SlidersHorizontal size={14} aria-hidden="true" />
          All filters
          {activeCount > 0 && (
            <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-[#078B7D] px-1 text-[11px] font-bold text-white">{activeCount}</span>
          )}
        </button>
        <span className="h-5 w-px bg-mz-line" aria-hidden="true" />
        {QUICK_KEYS.map((key) => (
          <QuickFilter
            key={key}
            groupKey={key}
            state={state}
            setState={setState}
            facets={facets}
            open={openKey === key}
            onOpen={() => setOpenKey(key)}
            onClose={close}
          />
        ))}
      </div>
    </div>
  )
}
