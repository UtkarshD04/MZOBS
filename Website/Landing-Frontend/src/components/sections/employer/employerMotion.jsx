import { useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

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
