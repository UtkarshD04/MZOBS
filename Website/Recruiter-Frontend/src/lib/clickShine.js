// Click "shine": a soft diagonal highlight sweeps across a button when it is
// clicked. Installed once, globally, with a delegated listener — so every
// button/link that has a fill gets it without touching each component, and
// nothing about the element itself (position, overflow, popovers inside it)
// changes: the shine is a short-lived overlay pinned to the element's box.
//
// Skipped for: transparent/text-only links (nothing to shine on), disabled
// controls, very large elements (cards), and users who prefer reduced motion.
// Add `data-shine` to force it on a non-button, `data-no-shine` to opt out.

const SELECTOR = 'button, a[href], [role="button"], [data-shine]'
const DURATION = 650

let ctx
function rgba(color) {
  // A canvas resolves any CSS colour syntax (rgb, oklab, color-mix…) to plain RGBA.
  ctx ??= document.createElement('canvas').getContext('2d', { willReadFrequently: true })
  ctx.canvas.width = ctx.canvas.height = 1
  ctx.clearRect(0, 0, 1, 1)
  ctx.fillStyle = '#000'
  ctx.fillStyle = color
  ctx.fillRect(0, 0, 1, 1)
  const [r, g, b, a] = ctx.getImageData(0, 0, 1, 1).data
  return { r, g, b, a: a / 255 }
}

const luminance = ({ r, g, b }) => (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255

function shineFor(el) {
  const cs = getComputedStyle(el)
  const forced = el.hasAttribute('data-shine')
  const hasGradient = cs.backgroundImage && cs.backgroundImage !== 'none'
  const bg = rgba(cs.backgroundColor)
  if (!forced && bg.a < 0.15 && !hasGradient) return null // nothing filled to shine on
  // Light surfaces need a faint cool sheen; dark/coloured ones a white glint.
  const light = !hasGradient && bg.a >= 0.15 && luminance(bg) > 0.82
  return light ? 'rgba(16, 42, 67, 0.16)' : 'rgba(255, 255, 255, 0.62)'
}

function play(el) {
  const rect = el.getBoundingClientRect()
  if (rect.width < 24 || rect.height < 20 || rect.width > 720 || rect.height > 220) return
  const tint = shineFor(el)
  if (!tint) return

  const cs = getComputedStyle(el)
  const box = document.createElement('span')
  Object.assign(box.style, {
    position: 'fixed',
    left: `${rect.left}px`,
    top: `${rect.top}px`,
    width: `${rect.width}px`,
    height: `${rect.height}px`,
    borderRadius: cs.borderRadius,
    overflow: 'hidden',
    pointerEvents: 'none',
    zIndex: '2147483000',
  })
  box.setAttribute('aria-hidden', 'true')

  const sweep = document.createElement('span')
  Object.assign(sweep.style, {
    position: 'absolute',
    top: '-20%',
    bottom: '-20%',
    left: '0',
    width: '55%',
    background: `linear-gradient(100deg, transparent 0%, ${tint} 50%, transparent 100%)`,
    transform: 'translateX(-130%) skewX(-18deg)',
  })
  box.appendChild(sweep)
  document.body.appendChild(box)

  const anim = sweep.animate([{ transform: 'translateX(-130%) skewX(-18deg)' }, { transform: 'translateX(300%) skewX(-18deg)' }], { duration: DURATION, easing: 'cubic-bezier(0.22, 0.61, 0.36, 1)' })
  anim.onfinish = anim.oncancel = () => box.remove()
}

export function installClickShine() {
  if (typeof document === 'undefined' || window.__mztShineInstalled) return
  window.__mztShineInstalled = true
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)')
  document.addEventListener(
    'click',
    (e) => {
      if (reduced.matches || !(e.target instanceof Element)) return
      const el = e.target.closest(SELECTOR)
      if (!el || el.disabled || el.getAttribute('aria-disabled') === 'true' || el.closest('[data-no-shine]')) return
      play(el)
    },
    true
  )
}
