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

<<<<<<< Updated upstream
function RolesFragment() {
  const rows = [
    { role: 'Backend Engineer', status: 'Live' },
    { role: 'Sales Associate', status: 'Live' },
    { role: 'Operations Lead', status: 'Draft' },
  ]
  return (
    <div className="rounded-xl border border-[#111827]/12 bg-[#f7f8fc] p-4">
      <div className="space-y-2">
        {rows.map((r) => (
          <div key={r.role} className="flex items-center justify-between text-[13px] py-1.5 border-b border-[#111827]/10 last:border-0">
            <span className="text-[#111827] font-medium">{r.role}</span>
            <span className={`text-[10.5px] font-bold px-2 py-0.5 rounded-full ${r.status === 'Live' ? 'bg-[#eeefff] text-[#4a4ed8]' : 'bg-white text-[#667085]'}`}>
              {r.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

function ApplicationsFragment() {
  const rows = ['Applicant reviewed today', 'Applicant reviewed today', 'Applicant reviewed yesterday']
  return (
    <div className="rounded-xl border border-[#111827]/12 bg-[#f7f8fc] p-4">
      <div className="space-y-2.5">
        {rows.map((r, i) => (
          <div key={i} className="flex items-center gap-2.5">
            <span className="w-6 h-6 rounded-full bg-[#20c997]/50 border border-[#111827]/10 shrink-0" />
            <span className="text-[12px] text-[#667085] font-medium">{r}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function ShortlistFragment() {
  const cols = ['Applied', 'Shortlisted', 'Interview', 'Offer']
  return (
    <div className="rounded-xl border border-[#111827]/12 bg-[#f7f8fc] p-4 grid grid-cols-4 gap-2">
      {cols.map((c, i) => (
        <div key={c} className="rounded-lg bg-white border border-[#111827]/10 p-2">
          <span className="text-[8.5px] font-bold text-[#667085] uppercase tracking-wide">{c}</span>
          <div className={`mt-2 h-1.5 rounded-full ${i === 0 ? 'bg-[#4a4ed8]/20' : i === 1 ? 'bg-[#4a4ed8]/40' : i === 2 ? 'bg-[#4a4ed8]/70' : 'bg-[#4a4ed8]'}`} />
        </div>
      ))}
    </div>
  )
}

function SolutionCard({ card }) {
  const isExternalRoute = card.to.startsWith('/')
  const Wrapper = isExternalRoute ? Link : 'a'
  const wrapperProps = isExternalRoute ? { to: card.to } : { href: card.to }

  return (
    <div className="flex flex-col h-full rounded-[24px] border border-[#111827]/15 bg-white p-6 sm:p-7 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_35px_-24px_rgba(16,42,67,0.38)]">
      <span className="w-10 h-10 rounded-full bg-[#ccceff] flex items-center justify-center text-[#4a4ed8] shrink-0">
        <card.icon size={19} strokeWidth={1.8} />
      </span>
      <h3 className="mt-4 text-lg font-bold text-[#111827] leading-snug">{card.title}</h3>
      <p className="mt-2.5 text-[14.5px] text-[#667085] leading-relaxed">{card.desc}</p>

      {card.Visual && (
        <div className="mt-5">
          <card.Visual />
        </div>
      )}

      <Wrapper {...wrapperProps} className="mt-auto pt-5 inline-flex items-center gap-1.5 text-[13.5px] font-bold text-[#4a4ed8] hover:text-[#111827] transition-colors">
        {card.cta} <ArrowRight size={14} />
      </Wrapper>
    </div>
  )
}

export default function EmployerWhySection() {
  return (
    <section id="solutions" className="bg-[#f7f8fc] py-16 md:py-24 px-6 md:px-12">
      <div className="max-w-7xl mx-auto">
        <FadeInView className="max-w-xl">
          <h2 className="font-sans text-3xl sm:text-4xl md:text-[46px] font-bold text-[#111827] tracking-tight leading-tight">
            One platform for every stage of hiring
          </h2>
          <p className="mt-3 text-[15px] text-[#111827]/70 leading-relaxed">
            From posting a role to making the offer, everything your hiring team needs lives in one workspace.
=======
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
>>>>>>> Stashed changes
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
