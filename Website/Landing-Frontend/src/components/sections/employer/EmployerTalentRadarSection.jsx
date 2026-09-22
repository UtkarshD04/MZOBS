import { useLayoutEffect, useRef } from 'react'
import { ArrowRight, Check, Radar, Sparkles } from 'lucide-react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { FadeInView } from './employerMotion'

gsap.registerPlugin(ScrollTrigger)

export default function EmployerTalentRadarSection() {
  const ref = useRef(null)

  useLayoutEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined
    const ctx = gsap.context(() => {
      gsap.set('[data-radar-ping]', { scale: 0.6, autoAlpha: 0 })
      gsap.set('[data-radar-notification]', { autoAlpha: 0, y: 16, scale: 0.97 })
      gsap
        .timeline({ scrollTrigger: { trigger: ref.current, start: 'top 70%', once: true } })
        .to('[data-radar-ping]', { scale: 1, autoAlpha: 1, duration: 0.5, ease: 'power2.out' })
        .to('[data-radar-notification]', { autoAlpha: 1, y: 0, scale: 1, duration: 0.6, ease: 'back.out(1.4)' }, '+=0.3')
    }, ref)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={ref} className="relative overflow-hidden bg-[#F1EDE5] py-16 md:py-24 px-6 md:px-12">
      <div aria-hidden="true" className="absolute -right-24 top-1/2 -translate-y-1/2 h-80 w-80 rounded-full bg-[#bfdbfe]/50 blur-[90px]" />
      <div className="relative max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
        <FadeInView>
          <span className="text-[12px] font-bold uppercase tracking-[0.14em] text-[#0a6f64]">Talent Radar</span>
          <h2 className="mt-3 font-sans text-3xl sm:text-4xl md:text-[46px] font-bold text-[#102a43] tracking-tight leading-tight">
            Discover talent before you need to hire.
          </h2>
          <p className="mt-3 max-w-md text-[15px] text-[#102a43]/70 leading-relaxed">
            Save the kind of talent you may need next and let Mzobs surface relevant profiles as they become available.
          </p>
        </FadeInView>

        <FadeInView delay={0.1}>
          <div className="relative max-w-md ml-auto">
            <div className="rounded-[28px] border border-[#102a43] bg-white p-6 sm:p-7 sm:pb-16 shadow-[8px_10px_0_#102a43]">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.12em] text-[#0a6f64]">
                  <Radar size={13} /> Talent Watch
                </span>
                <span data-radar-ping className="relative flex h-2.5 w-2.5">
                  <span className="absolute inline-flex h-full w-full rounded-full bg-[#0a6f64] opacity-60" />
                  <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[#0a6f64]" />
                </span>
              </div>
              <h3 className="mt-4 text-[17px] font-bold text-[#102a43]">Senior React Developer</h3>
              <p className="mt-1 text-[13px] text-[#51697e]">3–5 years · Bengaluru · ₹8–12 LPA</p>
              <span className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-[#DCECE3] px-3 py-1.5 text-[12px] font-bold text-[#0a6f64]">
                <Check size={13} /> Watching
              </span>
            </div>

            <div data-radar-notification className="mt-4 rounded-2xl border border-[#102a43]/15 bg-[#102a43] p-4 sm:p-5 sm:absolute sm:-bottom-6 sm:left-1/2 sm:-translate-x-1/2 sm:w-[110%] shadow-[0_18px_35px_-16px_rgba(16,42,67,0.5)]">
              <div className="flex items-start gap-3">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[#0a6f64] text-white">
                  <Sparkles size={15} />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-[13px] font-bold text-white">New talent found</p>
                  <p className="text-[12px] text-white/70 mt-0.5">96% Match · Available in 18 days</p>
                </div>
                <span className="inline-flex items-center gap-1 text-[11.5px] font-bold text-[#bfdbfe] shrink-0">
                  View candidate <ArrowRight size={12} />
                </span>
              </div>
            </div>
          </div>
        </FadeInView>
      </div>
    </section>
  )
}
