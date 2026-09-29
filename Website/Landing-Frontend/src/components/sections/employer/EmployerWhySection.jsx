import { Briefcase, Search, SlidersHorizontal, Inbox, ListChecks, CalendarCheck } from 'lucide-react'
import { FadeInView } from './employerMotion'

const FEATURES = [
  {
    n: '01',
    icon: Briefcase,
    title: 'Post Jobs',
    desc: 'Create and publish job opportunities with role, skills, location, experience and salary requirements.',
  },
  {
    n: '02',
    icon: Search,
    title: 'Find Candidates',
    desc: 'Discover candidates based on the role requirements that matter to you.',
  },
  {
    n: '03',
    icon: SlidersHorizontal,
    title: 'Search & Filter',
    desc: 'Find relevant talent using filters for skills, experience and location.',
  },
  {
    n: '04',
    icon: Inbox,
    title: 'Manage Applications',
    desc: 'Review and organize applications as they come in, all from one inbox.',
  },
  {
    n: '05',
    icon: ListChecks,
    title: 'Shortlist Talent',
    desc: 'Review candidate profiles and move the relevant ones forward.',
  },
  {
    n: '06',
    icon: CalendarCheck,
    title: 'Schedule Interviews',
    desc: 'Manage interview steps with the candidates you shortlist.',
  },
]

export default function EmployerWhySection() {
  return (
    <section id="solutions" className="bg-(--explorer-bg) py-16 md:py-24 px-6 md:px-12">
      <div className="max-w-7xl mx-auto">
        <FadeInView className="max-w-xl">
          <h2 className="font-sans text-3xl sm:text-4xl md:text-[44px] font-bold text-(--explorer-navy) tracking-tight leading-tight">
            Everything You Need to Hire.
          </h2>
          <p className="mt-3 text-[15px] text-(--explorer-muted) leading-relaxed">
            From your first job post to the final interview, Mzobs keeps your hiring workflow simple.
          </p>
        </FadeInView>

        <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {FEATURES.map((f, i) => (
            <FadeInView key={f.title} delay={i * 0.05} className="h-full">
              <div className="flex h-full flex-col rounded-[22px] border border-(--explorer-border) bg-white p-6 sm:p-7 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_35px_-24px_rgba(16,42,67,0.25)]">
                <div className="flex items-center justify-between">
                  <span className="grid h-11 w-11 place-items-center rounded-full bg-(--explorer-blue-surface) text-(--explorer-blue)">
                    <f.icon size={19} strokeWidth={1.8} />
                  </span>
                  <span className="text-[13px] font-extrabold text-(--explorer-border)">{f.n}</span>
                </div>
                <h3 className="mt-4 text-[17px] font-bold text-(--explorer-navy) leading-snug">{f.title}</h3>
                <p className="mt-2.5 text-[14px] text-(--explorer-muted) leading-relaxed">{f.desc}</p>
              </div>
            </FadeInView>
          ))}
        </div>
      </div>
    </section>
  )
}
