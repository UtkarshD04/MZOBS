import { useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { FadeInView } from './employerMotion'

gsap.registerPlugin(ScrollTrigger)

const POOLS = [
  { emoji: '⭐', label: 'Top React Developers', count: 2 },
  { emoji: '⚡', label: 'Immediate Joiners', count: 3 },
  { emoji: '🎯', label: 'Future Hiring', count: 0 },
  { emoji: '💼', label: 'Sales Leadership', count: 0 },
]

export default function EmployerTalentPoolsSection() {
  const ref = useRef(null)

  useLayoutEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined
    const ctx = gsap.context(() => {
      gsap.set('[data-pool-card]', { autoAlpha: 0, y: 14 })
      gsap.to('[data-pool-card]', {
        autoAlpha: 1,
        y: 0,
        duration: 0.5,
        stagger: 0.08,
        ease: 'power3.out',
        scrollTrigger: { trigger: ref.current, start: 'top 78%', once: true },
      })
    }, ref)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={ref} className="bg-[#EEF1EE] py-16 md:py-20 px-6 md:px-12">
      <div className="max-w-5xl mx-auto">
        <FadeInView className="text-center">
          <span className="text-[12px] font-bold uppercase tracking-[0.14em] text-[#0a6f64]">Talent Pools</span>
          <h2 className="mt-3 font-sans text-3xl sm:text-4xl md:text-[40px] font-bold text-[#102a43] tracking-tight leading-tight">
            Keep promising people close, even when the timing isn't right.
          </h2>
        </FadeInView>

        <div className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-3.5">
          {POOLS.map((pool) => (
            <div data-pool-card key={pool.label} className="rounded-2xl border border-[#102a43]/15 bg-white p-4 sm:p-5">
              <span className="text-[22px]">{pool.emoji}</span>
              <p className="mt-2.5 text-[13px] font-bold text-[#102a43] leading-snug">{pool.label}</p>
              <p className="mt-1 text-[11.5px] text-[#51697e]">{pool.count} saved</p>
            </div>
          ))}
        </div>
        <p className="mt-6 text-center text-[11.5px] text-[#51697e]/80">Illustrative example — product preview.</p>
      </div>
    </section>
  )
}
