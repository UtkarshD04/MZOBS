import { Link } from 'react-router-dom'
import { ArrowRight, Briefcase, Search, SlidersHorizontal, Inbox, ListChecks, CalendarCheck } from 'lucide-react'
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
  const [featured, ...rest] = FEATURES
  return (
    <section id="solutions" className="bg-(--explorer-bg) py-16 md:py-24 px-6 md:px-12">
      <div className="max-w-7xl mx-auto">
        <FadeInView className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="max-w-xl">
            <span className="text-[12px] font-bold uppercase tracking-[0.16em] text-(--explorer-blue)">One hiring workspace</span>
            <h2 className="mt-3 font-sans text-3xl sm:text-4xl md:text-[44px] font-bold text-(--explorer-navy) tracking-tight leading-tight">
              Everything You Need to Hire.
            </h2>
          </div>
          <p className="max-w-sm text-[15px] text-(--explorer-muted) leading-relaxed">
            From your first job post to the final interview, Mzobs keeps your hiring workflow simple.
          </p>
        </FadeInView>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {/* Featured card — the first step every employer takes */}
          <FadeInView className="h-full sm:col-span-2 lg:col-span-1 lg:row-span-2">
            <div className="relative flex h-full min-h-[280px] flex-col overflow-hidden rounded-[24px] bg-(--explorer-navy) p-7 sm:p-8 text-white">
              <div aria-hidden="true" className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-[#20c997]/30 blur-[70px]" />
              <div aria-hidden="true" className="absolute -bottom-20 -left-10 h-56 w-56 rounded-full bg-(--explorer-blue)/50 blur-[80px]" />
              <div className="relative flex items-center justify-between">
                <span className="grid h-12 w-12 place-items-center rounded-2xl bg-white/10 text-[#20c997] ring-1 ring-white/15">
                  <featured.icon size={21} strokeWidth={1.8} />
                </span>
                <span className="text-[13px] font-extrabold text-white/30">{featured.n}</span>
              </div>
              <h3 className="relative mt-auto pt-10 text-[26px] font-bold leading-tight tracking-tight">{featured.title}</h3>
              <p className="relative mt-3 max-w-sm text-[14.5px] leading-relaxed text-white/70">{featured.desc}</p>
              <Link
                to="/employers/signup"
                className="group relative mt-7 inline-flex w-fit items-center gap-2 rounded-full bg-white px-5 py-2.5 text-[13.5px] font-bold text-(--explorer-navy) transition-colors hover:bg-[#e4f8f1]"
              >
                Post your first job
                <ArrowRight size={15} className="motion-safe:transition-transform motion-safe:group-hover:translate-x-1" aria-hidden="true" />
              </Link>
            </div>
          </FadeInView>

          {rest.map((f, i) => {
            // Last card closes the bento row: full-width with a horizontal layout.
            const wide = i === rest.length - 1
            return (
            <FadeInView key={f.title} delay={(i + 1) * 0.05} className={`h-full ${wide ? 'sm:col-span-2 lg:col-span-3' : ''}`}>
              <div className={`group relative flex h-full overflow-hidden ${wide ? 'flex-col sm:flex-row sm:items-center sm:gap-6' : 'flex-col'} rounded-[22px] border border-(--explorer-border) bg-white p-6 sm:p-7 transition-all duration-300 hover:-translate-y-1 hover:border-(--explorer-blue-border) hover:shadow-[0_22px_40px_-26px_rgba(11,122,109,0.45)]`}>
                <span aria-hidden="true" className="absolute inset-x-0 top-0 h-[3px] origin-left scale-x-0 bg-[linear-gradient(90deg,#0b7a6d,#20c997)] transition-transform duration-300 group-hover:scale-x-100" />
                <div className={`flex items-center justify-between ${wide ? 'sm:shrink-0' : ''}`}>
                  <span className="grid h-11 w-11 place-items-center rounded-2xl bg-(--explorer-blue-surface) text-(--explorer-blue) transition-colors duration-300 group-hover:bg-(--explorer-blue) group-hover:text-white">
                    <f.icon size={19} strokeWidth={1.8} />
                  </span>
                  <span className={`text-[13px] font-extrabold text-(--explorer-navy)/20 ${wide ? 'sm:hidden' : ''}`}>{f.n}</span>
                </div>
                <div className={wide ? 'sm:flex-1' : ''}>
                  <h3 className={`text-[17px] font-bold text-(--explorer-navy) leading-snug ${wide ? 'mt-5 sm:mt-0' : 'mt-5'}`}>{f.title}</h3>
                  <p className="mt-2 text-[14px] text-(--explorer-muted) leading-relaxed">{f.desc}</p>
                </div>
                {wide && <span className="hidden text-[13px] font-extrabold text-(--explorer-navy)/20 sm:block">{f.n}</span>}
              </div>
            </FadeInView>
            )
          })}
        </div>
      </div>
    </section>
  )
}
