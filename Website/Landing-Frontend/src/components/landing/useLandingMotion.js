import { useEffect } from 'react'

const clamp = (v, a, b) => Math.max(a, Math.min(b, v))
const seg = (p, a, b) => clamp((p - a) / (b - a), 0, 1)
const ease = (t) => 1 - Math.pow(1 - t, 3)

// All client-only motion for the landing page, attached to its root element
// after mount (so the prerendered markup is the plain, fully visible layout):
//  - [data-r] elements fade/slide in once as they enter the viewport
//  - the hero (.pin-hero) is pinned: the wordmark shrinks, the tagline words
//    rise in and the product mockup slides up as you scroll through it
// Reduced motion, or a viewport too short/tall for the pin, keeps the static layout.
export function useLandingMotion(rootRef) {
  useEffect(() => {
    const root = rootRef.current
    if (!root) return undefined
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    const cleanups = []

    root.classList.add('lp-js')
    cleanups.push(() => root.classList.remove('lp-js'))

    // reveal
    const items = Array.from(root.querySelectorAll('[data-r]'))
    items.forEach((el) => {
      const siblings = Array.from(el.parentElement.children).filter((c) => c.hasAttribute('data-r'))
      el.style.transitionDelay = `${Math.min(siblings.indexOf(el), 5) * 90}ms`
    })
    if ('IntersectionObserver' in window) {
      const io = new IntersectionObserver(
        (entries) =>
          entries.forEach((e) => {
            if (!e.isIntersecting) return
            e.target.classList.add('lp-in')
            io.unobserve(e.target)
          }),
        { threshold: 0.15 },
      )
      items.forEach((el) => io.observe(el))
      cleanups.push(() => io.disconnect())
    } else {
      items.forEach((el) => el.classList.add('lp-in'))
    }
    // Safety net: anything already on screen after 2s is shown regardless.
    const t = setTimeout(() => {
      items.forEach((el) => {
        const r = el.getBoundingClientRect()
        if (r.top < window.innerHeight && r.bottom > 0) el.classList.add('lp-in')
      })
    }, 2000)
    cleanups.push(() => clearTimeout(t))

    // hero pin
    const pin = root.querySelector('.pin-hero')
    const layer = root.querySelector('.hero-layer')
    const word = root.querySelector('.hero-word')
    const device = root.querySelector('.hero-device')
    const hint = root.querySelector('[data-hint]')
    const words = Array.from(root.querySelectorAll('[data-hw]'))
    let scrolly = false
    let raf = 0

    const clear = () => {
      ;[layer, word, device].forEach((e) => e && (e.style.transform = ''))
      words.forEach((e) => {
        e.style.opacity = ''
        e.style.transform = ''
      })
      if (hint) hint.style.opacity = '0'
    }

    const frame = () => {
      raf = 0
      if (!scrolly || !pin) return
      const vh = window.innerHeight
      const r = pin.getBoundingClientRect()
      const p = clamp(-r.top / Math.max(1, r.height - vh), 0, 1)
      const a = ease(seg(p, 0, 0.5))
      if (word) word.style.transform = `scale(${1 - 0.6 * a})`
      if (layer) layer.style.transform = `translateY(${-0.31 * vh * a}px)`
      words.forEach((e) => {
        const i = +e.getAttribute('data-hw')
        const k = ease(seg(p, 0.03 + i * 0.07, 0.2 + i * 0.07))
        e.style.opacity = i === 0 ? 1 - seg(p, 0.15, 0.3) : k
        e.style.transform = i === 0 ? '' : `translateY(${30 * (1 - k)}px)`
      })
      const d = ease(seg(p, 0.32, 0.88))
      if (device) device.style.transform = `translateY(${100 - 100 * d}%) scale(${0.9 + 0.1 * d})`
      if (hint) hint.style.opacity = String(1 - seg(p, 0, 0.06))
    }
    const req = () => {
      if (!raf) raf = requestAnimationFrame(frame)
    }
    const mode = () => {
      const want = !reduce && pin && window.innerHeight < 1600 && window.innerHeight > 300
      if (want !== scrolly) {
        scrolly = !!want
        root.classList.toggle('lp-scrolly', scrolly)
        if (!scrolly) clear()
      }
      req()
    }
    window.addEventListener('scroll', req, { passive: true })
    window.addEventListener('resize', mode)
    cleanups.push(() => {
      window.removeEventListener('scroll', req)
      window.removeEventListener('resize', mode)
      if (raf) cancelAnimationFrame(raf)
      root.classList.remove('lp-scrolly')
    })
    mode()

    return () => cleanups.forEach((fn) => fn())
  }, [rootRef])
}
