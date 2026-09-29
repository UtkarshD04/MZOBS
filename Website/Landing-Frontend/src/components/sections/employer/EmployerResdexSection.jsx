import { ArrowUpRight, Search, GraduationCap, MapPin, SlidersHorizontal } from 'lucide-react'
import { FadeInView } from './employerMotion'
import ExplorerButton from '../../ui/ExplorerButton'

<<<<<<< Updated upstream
const RESULTS = [
  { initials: 'PK', name: 'Priya Kapoor', role: 'Senior React Developer', exp: '5 yrs', location: 'Bengaluru', tone: 'bg-[#ccceff]' },
  { initials: 'AV', name: 'Arjun Verma', role: 'Growth Marketing Lead', exp: '4 yrs', location: 'Pune', tone: 'bg-[#eeefff]' },
  { initials: 'SN', name: 'Sneha Nair', role: 'Product Designer', exp: '3 yrs', location: 'Remote', tone: 'bg-[#eeefff]' },
]

const POINTS = [
  "Search the full candidate database by skill, experience and location — not just people who applied to your postings.",
  "Every profile shows the resume, skills and experience side by side, so you're browsing real qualifications, not guesswork.",
  "Contact details stay locked until you choose to unlock — pay only for the candidates you actually want to reach out to.",
=======
const FILTERS = [
  { icon: GraduationCap, label: 'Experience' },
  { icon: SlidersHorizontal, label: 'Skills' },
  { icon: MapPin, label: 'Location' },
]

const POINTS = [
  'Search candidates by skill, experience and location — not just the people who applied to your postings.',
  'Browse full candidate profiles and resumes before you decide who to reach out to.',
>>>>>>> Stashed changes
]

// Empty-state search visual — the real search interface's shape (query +
// filters), with no results panel and no candidate data, since none exists
// until an employer actually searches.
function SearchStateVisual() {
  return (
<<<<<<< Updated upstream
    <div className="relative mx-auto max-w-[520px] lg:ml-auto">
      <div aria-hidden="true" className="absolute -top-8 -right-6 h-36 w-36 rounded-full bg-[#4a4ed8]/25 blur-[1px]" />
      <div aria-hidden="true" className="absolute -bottom-8 -left-6 h-28 w-28 rounded-full bg-[#ccceff]" />
      <div className="relative -rotate-[2deg] rounded-[30px] border border-[#111827] bg-[#f7f8fc] p-4 shadow-[10px_12px_0_#111827] sm:p-6">
        <div className="flex items-center gap-2 rounded-2xl border border-[#111827]/15 bg-white px-4 py-3">
          <Search size={16} className="text-[#667085] shrink-0" />
          <span className="text-sm font-semibold text-[#111827]">React developer, Bengaluru</span>
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          {['3-5 yrs', 'Immediate joiner', 'Remote OK'].map((chip) => (
            <span key={chip} className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-[#eeefff] text-[#4a4ed8]">{chip}</span>
          ))}
        </div>
        <div className="mt-4 space-y-3">
          {RESULTS.map((r, i) => (
            <div key={r.name} className="flex items-center gap-3 rounded-2xl border border-[#111827]/10 bg-white px-3 py-3" style={{ transform: `translateX(${i * 6}px)` }}>
              <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-full ${r.tone} text-xs font-extrabold text-[#111827]`}>{r.initials}</span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-bold text-[#111827]">{r.name}</p>
                <p className="text-xs text-[#667085] flex items-center gap-2 flex-wrap">
                  <span className="flex items-center gap-1"><Briefcase size={11} /> {r.role}</span>
                  <span className="flex items-center gap-1"><MapPin size={11} /> {r.location}</span>
                </p>
              </div>
              <span className="flex items-center gap-1 rounded-full bg-[#f7f8fc] border border-[#111827]/10 px-2.5 py-1 text-[10px] font-extrabold text-[#667085] shrink-0">
                <Lock size={10} /> {r.exp}
              </span>
            </div>
          ))}
        </div>
        <div className="mt-5 flex items-center justify-between rounded-2xl bg-[#111827] px-4 py-3 text-[#eeefff]">
          <span className="text-xs font-semibold">Profiles ranked by match</span>
          <Search size={16} className="text-[#ccceff]" />
=======
    <div className="relative mx-auto max-w-[460px] lg:ml-auto">
      <div aria-hidden="true" className="absolute -top-10 -right-8 h-48 w-48 rounded-full bg-(--color-violet)/8 blur-[100px]" />
      <div aria-hidden="true" className="absolute -bottom-8 -left-8 h-40 w-40 rounded-full bg-(--explorer-blue)/8 blur-[90px]" />

      <div className="relative rounded-[28px] border border-(--explorer-border) bg-white p-6 sm:p-8 shadow-[0_30px_60px_-30px_rgba(16,50,79,0.25)]">
        <div className="flex items-center gap-2.5 rounded-2xl border border-(--explorer-border) bg-(--explorer-bg) px-4 py-3.5">
          <Search size={17} className="shrink-0 text-(--explorer-muted)" />
          <span className="text-[13.5px] font-semibold text-(--explorer-navy)/40">Search by role, skill or keyword…</span>
        </div>

        <div className="mt-4 grid grid-cols-3 gap-2.5">
          {FILTERS.map((f) => (
            <div
              key={f.label}
              className="flex flex-col items-center gap-2 rounded-xl border border-(--explorer-border) bg-(--explorer-bg) px-2 py-3.5 text-center"
            >
              <f.icon size={16} className="text-(--explorer-blue)" />
              <span className="text-[11px] font-bold text-(--explorer-navy)">{f.label}</span>
            </div>
          ))}
        </div>

        <div className="mt-6 flex flex-col items-center gap-2 rounded-2xl border border-dashed border-(--explorer-border) py-10 text-center">
          <Search size={20} className="text-(--explorer-border)" />
          <p className="text-[12.5px] font-semibold text-(--explorer-muted)">Results appear here as you search</p>
>>>>>>> Stashed changes
        </div>
      </div>
    </div>
  )
}

export default function EmployerResdexSection() {
  return (
    <section id="discover-talent" className="relative overflow-hidden bg-white py-20 md:py-28 px-6 md:px-12">
      <div className="relative mx-auto grid max-w-7xl items-center gap-14 lg:grid-cols-[1fr_1fr] lg:gap-20">
        <FadeInView>
<<<<<<< Updated upstream
          <h2 className="font-sans text-3xl sm:text-4xl md:text-[46px] font-bold text-[#111827] tracking-tight leading-[1.05]">
            Don't just wait for applications. <em className="font-sans font-normal text-[#4a4ed8]">Go find your next hire.</em>
          </h2>
          <p className="mt-5 max-w-xl text-[15px] leading-relaxed text-[#667085]">
            Search Mzobs' entire candidate database — proactive sourcing, not just the people who happened to apply.
=======
          <h2 className="font-sans text-3xl sm:text-4xl md:text-[44px] font-bold text-(--explorer-navy) tracking-tight leading-[1.05]">
            Find Talent Beyond the Applications.
          </h2>
          <p className="mt-5 max-w-xl text-[15px] leading-relaxed text-(--explorer-muted)">
            Search for candidates based on the skills, experience and requirements that matter to your role.
>>>>>>> Stashed changes
          </p>

          <ul className="mt-8 space-y-4">
            {POINTS.map((point) => (
              <li key={point} className="flex items-start gap-3">
<<<<<<< Updated upstream
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#eeefff] text-[#4a4ed8]">
                  <Search size={12} />
                </span>
                <span className="text-[14.5px] leading-relaxed text-[#111827]/85">{point}</span>
=======
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-(--explorer-blue-surface) text-(--explorer-blue)">
                  <Search size={12} />
                </span>
                <span className="text-[14.5px] leading-relaxed text-(--explorer-navy)/85">{point}</span>
>>>>>>> Stashed changes
              </li>
            ))}
          </ul>

<<<<<<< Updated upstream
          <Link
            to="/employers/signup"
            className="mt-9 inline-flex min-h-12 items-center gap-2 rounded-full bg-[#111827] px-6 text-sm font-bold text-[#eeefff] transition-transform duration-200 hover:-translate-y-1"
          >
            Search candidates <ArrowUpRight size={17} />
          </Link>
=======
          <ExplorerButton to="/employers/signup" size="lg" className="mt-9">
            Search Candidates <ArrowUpRight size={16} />
          </ExplorerButton>
>>>>>>> Stashed changes
        </FadeInView>

        <FadeInView delay={0.1}>
          <SearchStateVisual />
        </FadeInView>
      </div>
    </section>
  )
}
