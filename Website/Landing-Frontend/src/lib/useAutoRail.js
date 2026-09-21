import { useEffect } from 'react'

// Auto-slides the horizontal swipe rails (mobile card rows) inside `rootRef`.
// Mark a rail with `data-auto-rail` (optionally `data-auto-rail="2500"` for a
// custom pause in ms; default 2200). Every so often the rail scrolls to its
// next card, and loops back to the start after the last one.
//
// It only runs while the rail is actually scrollable (i.e. on phones, where the
// grid becomes a rail), on screen, and the tab is visible — and it backs off
// for a few seconds after the visitor presses / touches / drags it so it never
// fights them. Mouse *hover* deliberately does not pause it: on phones (and in
// browser mobile emulation) the pointer just rests over the page.
const DEFAULT_MS = 2200
const IDLE_AFTER_USER_MS = 3000

export function useAutoRail(rootRef) {
  useEffect(() => {
    const root = rootRef.current
    if (!root) return undefined

    let lastUser = 0
    const touch = () => {
      lastUser = Date.now()
    }
    const events = ['pointerdown', 'touchstart']
    events.forEach((e) => root.addEventListener(e, touch, { passive: true, capture: true }))

    const nextAt = new WeakMap()

    const advance = (rail) => {
      const max = rail.scrollWidth - rail.clientWidth
      if (max <= 8) return
      const railLeft = rail.getBoundingClientRect().left
      const pad = parseFloat(getComputedStyle(rail).paddingLeft) || 0
      if (rail.scrollLeft >= max - 4) {
        rail.scrollTo({ left: 0, behavior: 'smooth' })
        return
      }
      for (const child of rail.children) {
        const left = child.getBoundingClientRect().left - railLeft + rail.scrollLeft - pad
        if (left > rail.scrollLeft + 6) {
          rail.scrollTo({ left: Math.min(left, max), behavior: 'smooth' })
          return
        }
      }
      rail.scrollTo({ left: 0, behavior: 'smooth' })
    }

    const tick = () => {
      if (document.hidden || Date.now() - lastUser < IDLE_AFTER_USER_MS) return
      const now = Date.now()
      root.querySelectorAll('[data-auto-rail]').forEach((rail) => {
        const rect = rail.getBoundingClientRect()
        const onScreen = rect.bottom > 0 && rect.top < window.innerHeight && rect.width > 0
        if (!onScreen || rail.scrollWidth - rail.clientWidth <= 8) return
        const every = Number(rail.dataset.autoRail) || DEFAULT_MS
        const due = nextAt.get(rail)
        if (due === undefined) {
          nextAt.set(rail, now + every)
        } else if (now >= due) {
          nextAt.set(rail, now + every)
          advance(rail)
        }
      })
    }
    const id = setInterval(tick, 400)

    return () => {
      clearInterval(id)
      events.forEach((e) => root.removeEventListener(e, touch, { capture: true }))
    }
  }, [rootRef])
}
