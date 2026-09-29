import { Briefcase, Search, Inbox, ListChecks } from 'lucide-react'
import { FadeInView } from './employerMotion'

const POINTS = [
  {
    icon: Briefcase,
    title: 'Simple job posting',
    desc: 'Share a role once and it goes live — no per-job fees, no sales calls.',
  },
  {
    icon: Search,
    title: 'Relevant candidate discovery',
    desc: 'Search by skill, experience and location instead of only waiting on applications.',
  },
  {
    icon: Inbox,
    title: 'Organized applications',
    desc: "Every application lands in one dashboard, tagged to the role it's for.",
  },
  {
    icon: ListChecks,
    title: 'A smoother hiring workflow',
    desc: 'Shortlist, message or reject from one place, from applied through to offer.',
  },
]

export default function EmployerQualitySection() {
  return (
    <section className="relative overflow-hidden bg-(--explorer-teal-surface) py-20 md:py-28 px-6 md:px-12">
      <div aria-hidden="true" className="absolute -left-28 bottom-10 h-72 w-72 rounded-full bg-(--explorer-blue-surface) blur-[90px]" />
      <div className="relative max-w-7xl mx-auto">
        <FadeInView className="max-w-2xl">
          <h2 className="font-sans text-3xl sm:text-4xl md:text-[44px] font-bold text-(--explorer-navy) tracking-tight leading-[1.04]">
            Made for the Way Teams Hire Today.
          </h2>
        </FadeInView>

        <div className="mt-12 grid sm:grid-cols-2 gap-4 lg:grid-cols-4">
          {POINTS.map((point, i) => (
            <FadeInView key={point.title} delay={i * 0.06} className="h-full">
              <article className="group relative h-full overflow-hidden rounded-[24px] border border-(--explorer-border) bg-(--explorer-bg) p-6 transition-all duration-300 hover:-translate-y-1 hover:bg-white hover:shadow-[0_18px_35px_-24px_rgba(16,42,67,0.3)]">
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-(--explorer-blue-surface) text-(--explorer-blue) transition-transform duration-300 group-hover:scale-105">
                  <point.icon size={20} strokeWidth={1.8} />
                </span>
                <span className="absolute right-5 top-5 font-sans text-4xl italic text-(--explorer-navy)/10 transition-colors">0{i + 1}</span>
                <h3 className="mt-12 text-lg font-bold text-(--explorer-navy) leading-snug">{point.title}</h3>
                <p className="mt-3 text-[14px] text-(--explorer-muted) leading-relaxed">{point.desc}</p>
              </article>
            </FadeInView>
          ))}
        </div>
      </div>
    </section>
  )
}
