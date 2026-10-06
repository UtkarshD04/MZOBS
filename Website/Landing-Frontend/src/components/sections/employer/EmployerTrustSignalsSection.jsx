import { useLayoutEffect, useRef } from 'react'
import { Check, Sparkles, FileText, GraduationCap, Briefcase, RefreshCw, MapPin } from 'lucide-react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { FadeInView } from './employerMotion'

gsap.registerPlugin(ScrollTrigger)

// Profile details an employer sees next to a candidate's match score.
const SIGNALS = [
  { icon: Sparkles, label: 'Skills listed' },
  { icon: MapPin, label: 'Location & work mode' },
  { icon: FileText, label: 'Resume available' },
  { icon: GraduationCap, label: 'Education information' },
  { icon: Briefcase, label: 'Employment information' },
  { icon: RefreshCw, label: 'Profile recently updated' },
]

export default function EmployerTrustSignalsSection() {
  const ref = useRef(null)

  useLayoutEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined
    const ctx = gsap.context(() => {
      gsap.set('[data-ts-item]', { autoAlpha: 0, y: 10 })
      gsap.to('[data-ts-item]', {
        autoAlpha: 1,
        y: 0,
        duration: 0.5,
        stagger: 0.08,
        ease: 'power3.out',
        scrollTrigger: { trigger: ref.current, start: 'top 75%', once: true },
      })
    }, ref)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={ref} className="bg-[#f7f8fc] py-16 md:py-24 px-6 md:px-12">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
        <FadeInView>
          <span className="text-[12px] font-bold uppercase tracking-[0.14em] text-[#075f55]">Candidate Insights</span>
          <h2 className="mt-3 font-sans text-3xl sm:text-4xl md:text-[46px] font-bold text-[#111827] tracking-tight leading-tight">
            More context on every candidate.
          </h2>
          <p className="mt-3 max-w-md text-[15px] text-[#111827]/70 leading-relaxed">
            Resume, skills, education and experience, brought together in one place.
          </p>
          <p className="mt-4 text-[13px] text-[#667085]">
            Shown alongside the Match Score — the score tells you how well someone fits, the insights show you why.
          </p>
        </FadeInView>

        <FadeInView delay={0.1}>
          <div className="rounded-[28px] border border-[#111827]/15 bg-white p-6 sm:p-8 max-w-md ml-auto shadow-[0_18px_35px_-24px_rgba(32,37,31,0.28)]">
            <div className="flex items-center gap-3.5">
              <span className="grid h-12 w-12 place-items-center rounded-full bg-[#b8d6d0] text-[13px] font-extrabold text-[#111827]">PM</span>
              <div>
                <p className="text-[14px] font-bold text-[#111827]">Priya Mehta</p>
                <p className="text-[12px] text-[#667085]">Backend Engineer</p>
              </div>
            </div>
            <div className="mt-6 grid grid-cols-2 gap-3.5">
              {SIGNALS.map((s) => (
                <div key={s.label} data-ts-item className="flex items-center gap-2">
                  <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-[#DCECE3] text-[#075f55]">
                    <Check size={12} strokeWidth={3} />
                  </span>
                  <span className="text-[12px] text-[#111827] leading-tight">{s.label}</span>
                </div>
              ))}
            </div>
            <p className="mt-5 pt-5 border-t border-[#111827]/10 text-[11px] text-[#667085]/80">Illustrative profile — product preview, not a real person.</p>
          </div>
        </FadeInView>
      </div>
    </section>
  )
}
