import { useLayoutEffect, useRef } from 'react'
import { Sparkles } from 'lucide-react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { FadeInView } from './employerMotion'

gsap.registerPlugin(ScrollTrigger)

const EXCHANGES = [
  { q: 'Show candidates who can join within 15 days.', a: "I found 12 candidates matching your current requirements." },
  { q: 'Show me the strongest AWS profiles.', a: '7 candidates have strong AWS experience. Here are the top matches.' },
]

export default function EmployerCopilotSection() {
  const ref = useRef(null)

  useLayoutEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined
    const ctx = gsap.context(() => {
      gsap.set('[data-copilot-msg]', { autoAlpha: 0, y: 12 })
      gsap.to('[data-copilot-msg]', {
        autoAlpha: 1,
        y: 0,
        duration: 0.5,
        stagger: 0.16,
        ease: 'power3.out',
        scrollTrigger: { trigger: ref.current, start: 'top 72%', once: true },
      })
    }, ref)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={ref} className="bg-white py-16 md:py-24 px-6 md:px-12">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
        <FadeInView>
          <span className="text-[12px] font-bold uppercase tracking-[0.14em] text-[#0a6f64]">Mzobs Copilot</span>
          <h2 className="mt-3 font-sans text-3xl sm:text-4xl md:text-[46px] font-bold text-[#102a43] tracking-tight leading-tight">
            Your hiring questions, answered in context.
          </h2>
          <p className="mt-3 max-w-md text-[15px] text-[#102a43]/70 leading-relaxed">
            Ask Mzobs Copilot about the candidates in front of you — it works alongside your usual filters, not instead of them.
          </p>
        </FadeInView>

        <FadeInView delay={0.1}>
          <div className="rounded-[28px] border border-[#102a43]/15 bg-[#102a43] p-5 sm:p-6 max-w-md ml-auto shadow-[0_18px_35px_-20px_rgba(16,42,67,0.55)]">
            <div className="flex items-center gap-2.5 pb-4 border-b border-white/10">
              <span className="grid h-8 w-8 place-items-center rounded-full bg-[#0a6f64] text-white shrink-0">
                <Sparkles size={14} />
              </span>
              <span className="text-[13px] font-bold text-white">Mzobs Copilot</span>
              <span className="ml-auto text-[10px] font-bold uppercase tracking-wide text-white/40">Product preview</span>
            </div>

            <div className="pt-4 flex flex-col gap-3">
              {EXCHANGES.map((ex, i) => (
                <div key={i} className="flex flex-col gap-2">
                  <p data-copilot-msg className="self-end max-w-[85%] rounded-2xl rounded-tr-sm bg-[#e8f8f5] px-3.5 py-2 text-[12.5px] text-[#102a43]">
                    {ex.q}
                  </p>
                  <p data-copilot-msg className="self-start max-w-[85%] rounded-2xl rounded-tl-sm bg-white/10 px-3.5 py-2 text-[12.5px] text-white leading-relaxed">
                    {ex.a}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </FadeInView>
      </div>
    </section>
  )
}
