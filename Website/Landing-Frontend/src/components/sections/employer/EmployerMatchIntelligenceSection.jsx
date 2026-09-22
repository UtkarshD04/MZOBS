import { useLayoutEffect, useRef } from 'react'
import { Briefcase, MapPin, ShieldCheck, Wallet } from 'lucide-react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { FadeInView } from './employerMotion'

gsap.registerPlugin(ScrollTrigger)

const DIMENSIONS = [
  { key: 'Skills', value: 96 },
  { key: 'Experience', value: 91 },
  { key: 'Location', value: 100 },
  { key: 'Availability', value: 88 },
  { key: 'Industry', value: 90 },
]

export default function EmployerMatchIntelligenceSection() {
  const ref = useRef(null)

  useLayoutEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined
    const ctx = gsap.context(() => {
      const bars = gsap.utils.toArray('[data-mi-bar]')
      gsap.set(bars, { scaleX: 0 })
      gsap.set('[data-mi-explain]', { autoAlpha: 0, y: 10 })
      gsap
        .timeline({ scrollTrigger: { trigger: ref.current, start: 'top 72%', once: true } })
        .to(bars, { scaleX: 1, duration: 0.8, stagger: 0.1, ease: 'power2.out' })
        .to('[data-mi-explain]', { autoAlpha: 1, y: 0, duration: 0.6, ease: 'power3.out' }, '-=0.3')
    }, ref)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={ref} className="bg-[#e8f8f5] py-16 md:py-24 px-6 md:px-12">
      <div className="max-w-7xl mx-auto">
        <FadeInView className="max-w-2xl">
          <span className="text-[12px] font-bold uppercase tracking-[0.14em] text-[#0a6f64]">Match Intelligence</span>
          <h2 className="mt-3 font-sans text-3xl sm:text-4xl md:text-[46px] font-bold text-[#102a43] tracking-tight leading-tight">
            Don't just find a candidate. Understand the match.
          </h2>
          <p className="mt-3 text-[15px] text-[#102a43]/70 leading-relaxed">
            Mzobs brings context behind every recommendation, so recruiters can see where a candidate fits — and where they don't.
          </p>
        </FadeInView>

        <div className="mt-12 grid lg:grid-cols-2 gap-6 items-stretch">
          <FadeInView delay={0.05}>
            <div className="h-full rounded-[28px] border border-[#102a43]/15 bg-white p-6 sm:p-8">
              <div className="flex items-start gap-4">
                <span className="grid h-14 w-14 shrink-0 place-items-center rounded-full bg-[#bfdbfe] text-[15px] font-extrabold text-[#102a43]">RS</span>
                <div>
                  <p className="flex items-center gap-1.5 text-[15px] font-bold text-[#102a43]">
                    Rahul Sharma <ShieldCheck size={14} className="text-[#0a6f64]" />
                  </p>
                  <p className="text-[13px] text-[#51697e]">Senior Python Developer</p>
                </div>
              </div>
              <div className="mt-6 grid grid-cols-2 gap-4 text-[12.5px] text-[#51697e]">
                <span className="flex items-center gap-2"><MapPin size={14} className="text-[#0a6f64]" /> Bengaluru</span>
                <span className="flex items-center gap-2"><Briefcase size={14} className="text-[#0a6f64]" /> 4 years experience</span>
                <span className="flex items-center gap-2"><Wallet size={14} className="text-[#0a6f64]" /> ₹22 LPA expected</span>
                <span className="flex items-center gap-2"><ShieldCheck size={14} className="text-[#0a6f64]" /> Profile verified</span>
              </div>
              <div className="mt-6 pt-6 border-t border-[#102a43]/10 flex flex-wrap gap-1.5">
                {['Python', 'FastAPI', 'AWS', 'PostgreSQL', 'Docker'].map((s) => (
                  <span key={s} className="text-[11.5px] font-medium px-2.5 py-1 rounded-full bg-[#F1EDE5] text-[#51697e]">{s}</span>
                ))}
              </div>
              <p className="mt-5 text-[11px] text-[#51697e]/70">Illustrative candidate profile — product preview, not a real person.</p>
            </div>
          </FadeInView>

          <FadeInView delay={0.12}>
            <div className="h-full rounded-[28px] border border-[#102a43]/15 bg-white p-6 sm:p-8">
              <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#51697e] mb-4">Match Intelligence</p>
              <div className="flex flex-col gap-3.5">
                {DIMENSIONS.map((d) => (
                  <div key={d.key}>
                    <div className="flex items-center justify-between text-[13px] mb-1.5">
                      <span className="font-medium text-[#102a43]">{d.key} Match</span>
                      <span className="font-bold text-[#102a43]">{d.value}%</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-[#F1EDE5] overflow-hidden">
                      <div data-mi-bar className="h-full rounded-full bg-[#0a6f64] origin-left" style={{ width: `${d.value}%` }} />
                    </div>
                  </div>
                ))}
              </div>

              <div data-mi-explain className="mt-6 pt-5 border-t border-[#102a43]/10">
                <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#51697e] mb-2">Why Mzobs recommended this profile</p>
                <p className="text-[13.5px] text-[#102a43] leading-relaxed">
                  "This candidate closely matches the technical requirements, has 4 years of backend experience and is based in Bengaluru."
                </p>
                <p className="mt-4 text-[11.5px] text-[#51697e]/80 leading-relaxed">
                  Match Intelligence is decision support, not an automated hiring decision — every recommendation is something you can check for yourself.
                </p>
              </div>
            </div>
          </FadeInView>
        </div>
      </div>
    </section>
  )
}
