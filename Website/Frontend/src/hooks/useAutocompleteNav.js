import { useEffect, useState } from 'react'

// Shared open/highlight/keyboard-nav state for a flat list of selectable
// rows — used by both the job-title and location autocomplete dropdowns.
export function useAutocompleteNav({ rowCount, open, onSelectIndex, onClose, onEnterFallback }) {
  const [highlighted, setHighlighted] = useState(-1)

  useEffect(() => {
    setHighlighted(-1)
  }, [open, rowCount])

  function onKeyDown(e) {
    if (!open) return
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      if (rowCount) setHighlighted((i) => (i + 1) % rowCount)
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      if (rowCount) setHighlighted((i) => (i - 1 + rowCount) % rowCount)
    } else if (e.key === 'Enter') {
      if (highlighted >= 0 && highlighted < rowCount) {
        e.preventDefault()
        onSelectIndex(highlighted)
      } else if (onEnterFallback) {
        e.preventDefault()
        onEnterFallback()
      }
    } else if (e.key === 'Escape') {
      onClose()
    }
  }

  return { highlighted, setHighlighted, onKeyDown }
}
