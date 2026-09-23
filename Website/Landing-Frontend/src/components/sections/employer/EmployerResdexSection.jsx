import { ArrowUpRight, Search, Lock, MapPin, Briefcase } from 'lucide-react'
import { Link } from 'react-router-dom'
import { FadeInView } from './employerMotion'

const RESULTS = [
  { initials: 'PK', name: 'Priya Kapoor', role: 'Senior React Developer', exp: '5 yrs', location: 'Bengaluru', tone: 'bg-[#bfdbfe]' },
  { initials: 'AV', name: 'Arjun Verma', role: 'Growth Marketing Lead', exp: '4 yrs', location: 'Pune', tone: 'bg-[#eef6ff]' },
  { initials: 'SN', name: 'Sneha Nair', role: 'Product Designer', exp: '3 yrs', location: 'Remote', tone: 'bg-[#e8f8f5]' },
]

const POINTS = [
  "Search the full verified candidate database by skill, experience and location — not just people who applied to your postings.",
  "Every profile has a Mzobs-verified resume, so you're browsing real qualifications, not guesswork.",
  "Contact details stay locked until you choose to unlock — pay only for the candidates you actually want to reach out to.",
]

function SearchMock() {
  return (
    <div className="relative mx-auto max-w-[520px] lg:ml-auto">
      <div aria-hidden="true" className="absolute -top-8 -right-6 h-36 w-36 rounded-full bg-[#0a6f64]/25 blur-[1px]" />
      <div aria-hidden="true" className="absolute -bottom-8 -left-6 h-28 w-28 rounded-full bg-[#bfdbfe]" />
      <div className="relative -rotate-[2deg] rounded-[30px] border border-[#102a43] bg-[#f7f9fb] p-4 shadow-[10px_12px_0_#102a43] sm:p-6">
        <div className="flex items-center gap-2 rounded-2xl border border-[#102a43]/15 bg-white px-4 py-3">
          <Search size={16} className="text-[#51697e] shrink-0" />
          <span className="text-sm font-semibold text-[#102a43]">React developer, Bengaluru</span>
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          {['3-5 yrs', 'Immediate joiner', 'Remote OK'].map((chip) => (
            <span key={chip} className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-[#e8f8f5] text-[#0a6f64]">{chip}</span>
          ))}
        </div>
        <div className="mt-4 space-y-3">
          {RESULTS.map((r, i) => (
            <div key={r.name} className="flex items-center gap-3 rounded-2xl border border-[#102a43]/10 bg-white px-3 py-3" style={{ transform: `translateX(${i * 6}px)` }}>
              <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-full ${r.tone} text-xs font-extrabold text-[#102a43]`}>{r.initials}</span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-bold text-[#102a43]">{r.name}</p>
                <p className="text-xs text-[#51697e] flex items-center gap-2 flex-wrap">
                  <span className="flex items-center gap-1"><Briefcase size={11} /> {r.role}</span>
                  <span className="flex items-center gap-1"><MapPin size={11} /> {r.location}</span>
                </p>
              </div>
              <span className="flex items-center gap-1 rounded-full bg-[#f7f9fb] border border-[#102a43]/10 px-2.5 py-1 text-[10px] font-extrabold text-[#51697e] shrink-0">
                <Lock size={10} /> {r.exp}
              </span>
            </div>
          ))}
        </div>
        <div className="mt-5 flex items-center justify-between rounded-2xl bg-[#102a43] px-4 py-3 text-[#e8f8f5]">
          <span className="text-xs font-semibold">2,400+ verified profiles match</span>
          <Search size={16} className="text-[#bfdbfe]" />
        </div>
      </div>
    </div>
  )
}

export default function EmployerResdexSection() {
  return (
    <section id="resume-search" className="relative overflow-hidden bg-white py-20 md:py-28 px-6 md:px-12">
      <div className="relative mx-auto grid max-w-7xl items-center gap-14 lg:grid-cols-[1fr_1fr] lg:gap-20">
        <FadeInView>
          <h2 className="font-sans text-3xl sm:text-4xl md:text-[46px] font-bold text-[#102a43] tracking-tight leading-[1.05]">
            Don't just wait for applications. <em className="font-sans font-normal text-[#0a6f64]">Go find your next hire.</em>
          </h2>
          <p className="mt-5 max-w-xl text-[15px] leading-relaxed text-[#51697e]">
            Search Mzobs' entire verified candidate database — proactive sourcing, not just the people who happened to apply.
          </p>

          <ul className="mt-8 space-y-4">
            {POINTS.map((point) => (
              <li key={point} className="flex items-start gap-3">
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#e8f8f5] text-[#0a6f64]">
                  <Search size={12} />
                </span>
                <span className="text-[14.5px] leading-relaxed text-[#102a43]/85">{point}</span>
              </li>
            ))}
          </ul>

          <Link
            to="/employers/signup"
            className="mt-9 inline-flex min-h-12 items-center gap-2 rounded-full bg-[#102a43] px-6 text-sm font-bold text-[#e8f8f5] transition-transform duration-200 hover:-translate-y-1"
          >
            Search candidates <ArrowUpRight size={17} />
          </Link>
        </FadeInView>

        <FadeInView delay={0.1}>
          <SearchMock />
        </FadeInView>
      </div>
    </section>
  )
}
