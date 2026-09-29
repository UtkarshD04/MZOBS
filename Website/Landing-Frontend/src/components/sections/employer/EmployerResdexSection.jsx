import { ArrowUpRight, Search, GraduationCap, MapPin, SlidersHorizontal } from 'lucide-react'
import { FadeInView } from './employerMotion'
import ExplorerButton from '../../ui/ExplorerButton'

const FILTERS = [
  { icon: GraduationCap, label: 'Experience' },
  { icon: SlidersHorizontal, label: 'Skills' },
  { icon: MapPin, label: 'Location' },
]

const POINTS = [
  'Search candidates by skill, experience and location — not just the people who applied to your postings.',
  'Browse full candidate profiles and resumes before you decide who to reach out to.',
]

// Empty-state search visual — the real search interface's shape (query +
// filters), with no results panel and no candidate data, since none exists
// until an employer actually searches.
function SearchStateVisual() {
  return (
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
          <h2 className="font-sans text-3xl sm:text-4xl md:text-[44px] font-bold text-(--explorer-navy) tracking-tight leading-[1.05]">
            Find Talent Beyond the Applications.
          </h2>
          <p className="mt-5 max-w-xl text-[15px] leading-relaxed text-(--explorer-muted)">
            Search for candidates based on the skills, experience and requirements that matter to your role.
          </p>

          <ul className="mt-8 space-y-4">
            {POINTS.map((point) => (
              <li key={point} className="flex items-start gap-3">
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-(--explorer-blue-surface) text-(--explorer-blue)">
                  <Search size={12} />
                </span>
                <span className="text-[14.5px] leading-relaxed text-(--explorer-navy)/85">{point}</span>
              </li>
            ))}
          </ul>

          <ExplorerButton to="/employers/signup" size="lg" className="mt-9">
            Search Candidates <ArrowUpRight size={16} />
          </ExplorerButton>
        </FadeInView>

        <FadeInView delay={0.1}>
          <SearchStateVisual />
        </FadeInView>
      </div>
    </section>
  )
}
