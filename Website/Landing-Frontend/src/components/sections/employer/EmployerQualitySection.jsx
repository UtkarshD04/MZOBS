import { ShieldCheck, FileCheck2, Inbox, ListChecks } from 'lucide-react'
import { FadeInView } from './employerMotion'

const POINTS = [
  {
    icon: ShieldCheck,
    title: 'Genuine hiring requirements',
    desc: 'Every requirement posted on MZOBS comes from a real employer with a real opening, so applicants are responding to genuine work.',
  },
  {
    icon: FileCheck2,
    title: 'Real candidate profiles and resumes',
    desc: 'Every candidate on MZOBS fills a complete profile and resume, giving you real details to go on — not just keyword matches.',
  },
  {
    icon: Inbox,
    title: 'Direct access to applications',
    desc: "There's no staff queue sitting between a candidate and your dashboard — once they apply, you see them directly.",
  },
  {
    icon: ListChecks,
    title: 'Clear hiring workflow',
    desc: 'Shortlist, message or reject from one place, and follow every application from applied through to offer.',
  },
]

export default function EmployerQualitySection() {
  return (
    <section className="relative overflow-hidden bg-[#FAF7F1] py-20 md:py-28 px-6 md:px-12">
      <div aria-hidden="true" className="absolute -left-28 bottom-10 h-72 w-72 rounded-full bg-[#DDE6DF]/60 blur-[90px]" />
      <div className="relative max-w-7xl mx-auto">
        <FadeInView className="max-w-2xl">
          <h2 className="font-serif text-3xl sm:text-4xl md:text-[48px] font-bold text-[#20251F] tracking-tight leading-[1.04]">
            Built to make every step feel more certain.
          </h2>
          <p className="mt-5 max-w-xl text-[15px] leading-relaxed text-[#526051]">The details that usually create delay and doubt are handled before they ever reach your desk.</p>
        </FadeInView>

        <div className="mt-12 grid sm:grid-cols-2 gap-4 lg:grid-cols-4">
          {POINTS.map((point, i) => (
            <FadeInView key={point.title} delay={i * 0.06} className="h-full">
              <article className="group relative h-full overflow-hidden rounded-[24px] border border-[#20251F]/15 bg-[#F5F6F4] p-6 transition-all duration-300 hover:-translate-y-1 hover:bg-white hover:shadow-[0_18px_35px_-24px_rgba(32,37,31,0.38)]">
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#DDE6DF] text-[#246B5A] transition-transform duration-300 group-hover:scale-105">
                  <point.icon size={20} strokeWidth={1.8} />
                </span>
                <span className="absolute right-5 top-5 font-serif text-4xl italic text-[#20251F]/12 transition-colors group-hover:text-white/10">0{i + 1}</span>
                <h3 className="mt-12 text-lg font-bold text-[#20251F] leading-snug">{point.title}</h3>
                <p className="mt-3 text-[14px] text-[#526051] leading-relaxed">{point.desc}</p>
              </article>
            </FadeInView>
          ))}
        </div>
      </div>
    </section>
  )
}
