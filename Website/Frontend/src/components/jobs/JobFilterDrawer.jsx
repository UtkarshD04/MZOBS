import { useEffect, useRef, useState } from 'react'
import { DrawerHead, DrawerBody, DrawerFoot } from '../ui/Drawer'
import Button from '../ui/Button'
import FilterSidebar from './FilterSidebar'
import { countActiveFilters, DEFAULT_FILTERS } from '../../lib/jobFilters'

const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'

// Mobile/tablet filter drawer. Selections are staged in local `draft` state
// and only reach the URL (via onApply) when the user taps "Show results" —
// per spec, checkboxes here must not each trigger their own navigation.
export default function JobFilterDrawer({ filters, onApply, onClose, facets, lockedTrack }) {
  const [draft, setDraft] = useState(filters)
  const containerRef = useRef(null)

  useEffect(() => {
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    containerRef.current?.querySelector(FOCUSABLE)?.focus()

    function onKeyDown(e) {
      if (e.key === 'Escape') {
        e.stopPropagation()
        onClose()
        return
      }
      if (e.key !== 'Tab' || !containerRef.current) return
      const focusable = containerRef.current.querySelectorAll(FOCUSABLE)
      if (!focusable.length) return
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', onKeyDown, true)
    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', onKeyDown, true)
    }
  }, [onClose])

  const activeCount = countActiveFilters(draft)

  return (
    <div ref={containerRef} className="flex flex-col h-full" role="dialog" aria-modal="true" aria-label="Filter jobs">
      <DrawerHead title="Filters" subtitle={activeCount ? `${activeCount} active` : 'Refine your search'} onClose={onClose} />
      <DrawerBody>
        <FilterSidebar filters={draft} onChange={setDraft} facets={facets} lockedTrack={lockedTrack} idPrefix="drawer" />
      </DrawerBody>
      <DrawerFoot>
        <Button onClick={() => setDraft({ ...DEFAULT_FILTERS, sort: draft.sort })}>Clear all</Button>
        <Button variant="primary" onClick={() => onApply(draft)}>
          Show results
        </Button>
      </DrawerFoot>
    </div>
  )
}
