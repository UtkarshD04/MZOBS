import { useEffect, useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'

gsap.registerPlugin(ScrollTrigger)

export function useEmployerSmoothScroll() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined
    const lenis = new Lenis({ duration: 1.15, smoothWheel: true, syncTouch: false })
    const update = (time) => lenis.raf(time * 1000)
    lenis.on('scroll', ScrollTrigger.update)
    gsap.ticker.add(update)
    gsap.ticker.lagSmoothing(0)
    return () => { gsap.ticker.remove(update); lenis.destroy() }
  }, [])
}

// Rubber-band "bounce" when the page is scrolled past its top or bottom
// edge — native overscroll only happens on some trackpads/mobile Safari,
// so this recreates that feel deliberately for wheel/trackpad input by
// nudging the whole page wrapper and springing it back with GSAP's
// elastic ease.
export function useEdgeBounce(ref) {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined
    const el = ref.current
    if (!el) return undefined

    let animating = false

    function playBounce(direction) {
      animating = true
      gsap.timeline({ onComplete: () => { animating = false } })
        .to(el, { y: direction * -18, duration: 0.22, ease: 'power2.out' })
        .to(el, { y: 0, duration: 0.6, ease: 'elastic.out(1, 0.45)' })
    }

    function onWheel(e) {
      if (animating) return
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight
      const atBottom = window.scrollY >= maxScroll - 2
      const atTop = window.scrollY <= 0
      if (atBottom && e.deltaY > 0) playBounce(1)
      else if (atTop && e.deltaY < 0) playBounce(-1)
    }

    let touchStartY = 0
    function onTouchStart(e) {
      touchStartY = e.touches[0].clientY
    }
    function onTouchMove(e) {
      if (animating) return
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight
      const atBottom = window.scrollY >= maxScroll - 2
      const atTop = window.scrollY <= 0
      const deltaY = touchStartY - e.touches[0].clientY
      if (atBottom && deltaY > 24) playBounce(1)
      else if (atTop && deltaY < -24) playBounce(-1)
    }

    window.addEventListener('wheel', onWheel, { passive: true })
    window.addEventListener('touchstart', onTouchStart, { passive: true })
    window.addEventListener('touchmove', onTouchMove, { passive: true })
    return () => {
      window.removeEventListener('wheel', onWheel)
      window.removeEventListener('touchstart', onTouchStart)
      window.removeEventListener('touchmove', onTouchMove)
    }
  }, [ref])
}

export function useHeroScene(ref) {
  useLayoutEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined
    const ctx = gsap.context(() => {
      gsap.to('[data-hero-orbit]', { rotation: 360, duration: 32, repeat: -1, ease: 'none' })
      gsap.to('[data-hero-board]', { y: -10, rotation: 1, duration: 3.2, repeat: -1, yoyo: true, ease: 'sine.inOut' })
      gsap.to('[data-hero-glow]', { scale: 1.15, opacity: 0.78, duration: 2.8, repeat: -1, yoyo: true, ease: 'sine.inOut' })
    }, ref)
    return () => ctx.revert()
  }, [ref])
}

export function useStoryProgress(ref) {
  useLayoutEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined
    const ctx = gsap.context(() => {
      const cards = gsap.utils.toArray('[data-story-card]')
      gsap.set(cards, { autoAlpha: 0.32, y: 18 })
      gsap.timeline({ scrollTrigger: { trigger: ref.current, start: 'top 72%', end: 'bottom 62%', scrub: 0.7 } })
        .to('[data-story-line]', { scaleX: 1, ease: 'none', duration: 1 }, 0)
        .to(cards, { autoAlpha: 1, y: 0, stagger: 0.22, ease: 'power2.out', duration: 0.72 }, 0)
    }, ref)
    return () => ctx.revert()
  }, [ref])
}

// One-time reveal for content that should animate in on page load (hero).
export function FadeInLoad({ children, delay = 0, className = '', ...props }) {
  const ref = useRef(null)
  useLayoutEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined
    const ctx = gsap.context(() => {
      gsap.fromTo(ref.current, { autoAlpha: 0, y: 28 }, { autoAlpha: 1, y: 0, duration: 0.75, delay, ease: 'power3.out' })
    }, ref)
    return () => ctx.revert()
  }, [delay])
  return <div ref={ref} className={className} {...props}>{children}</div>
}

// Gentle scroll-triggered reveal for page sections. Starts partially visible
// (not fully blank) so a section between scroll events — or one whose
// ScrollTrigger position shifted after fonts/images finished loading — never
// reads as empty; worst case it's dimmed, never invisible. Mirrors the
// autoAlpha floor useStoryProgress already uses successfully for process cards.
export function FadeInView({ children, delay = 0, className = '', ...props }) {
  const ref = useRef(null)
  useLayoutEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined
    const ctx = gsap.context(() => {
      gsap.fromTo(ref.current, { autoAlpha: 0.35, y: 20 }, {
        autoAlpha: 1, y: 0, duration: 0.7, delay, ease: 'power3.out',
        scrollTrigger: { trigger: ref.current, start: 'top 92%', once: true },
      })
    }, ref)
    return () => ctx.revert()
  }, [delay])
  return <div ref={ref} className={className} {...props}>{children}</div>
}
