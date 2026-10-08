import { Link } from 'react-router-dom'
import { ArrowRight, Check, Search, LockKeyhole, BadgeCheck, MapPin, Clock3, SlidersHorizontal } from 'lucide-react'
import { FadeInView } from './employerMotion'
import { Accent, Eyebrow, h2Class } from './employerUi'
import ExplorerButton from '../../ui/ExplorerButton'

// Fields from the Backend Job model (title, department, employmentType,
// workMode, location, experience range, salary range, skills). Values are an
// example of a filled form, labelled as such in the UI.
const JOB_FIELDS = [
  { label: 'Job title', value: 'Field Sales Executive', wide: true },
  { label: 'Department', value: 'Sales' },
  { label: 'Employment type', value: 'Full-time' },
  { label: 'Location', value: 'Pune' },
  { label: 'Work mode', value: 'On-site' },
  { label: 'Experience', value: '1–3 years' },
  { label: 'Salary range', value: '₹2.4–3.6 LPA' },
]
const JOB_SKILLS = ['B2B sales', 'Lead generation', 'Marathi']

// Filters from Backend utils/resumeSearchFilters.js.
const SEARCH_FILTERS = ['Skills', 'Location', 'Experience', 'Work mode', 'Job type', 'Notice period']

const POST_POINTS = ['Unlimited job posts on every annual plan', 'Full resumes of everyone who applies', 'Reviewed by Mzobs before it goes live']
const SEARCH_POINTS = ['Only resumes reviewed by the Mzobs team', 'Contact details hidden until you unlock', 'One CV credit unlocks one profile']

function Points({ items, dark }) {
  return (
    <ul className="mt-6 space-y-2.5">
      {items.map((p) => (
        <li key={p} className={`flex items-start gap-2.5 text-[14.5px] leading-snug ${dark ? 'text-white/80' : 'text-(--explorer-navy)/80'}`}>
          <Check size={16} strokeWidth={2.6} aria-hidden="true" className={`mt-0.5 shrink-0 ${dark ? 'text-[#5fe0b8]' : 'text-(--explorer-blue)'}`} />
          {p}
        </li>
      ))}
    </ul>
  )
}

function JobFormPreview() {
  return (
    <div aria-hidden="true" className="rounded-2xl border border-(--explorer-border) bg-(--explorer-bg) p-4 sm:p-5">
      <div className="flex items-center justify-between">
        <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-(--explorer-muted)">New job · example</p>
        <span className="rounded-full bg-white px-2 py-0.5 text-[10.5px] font-bold text-(--explorer-gold-hover) ring-1 ring-(--explorer-gold)/30">Pending review</span>
      </div>
      <div className="mt-3 grid grid-cols-2 gap-2">
        {JOB_FIELDS.map((f) => (
          <div key={f.label} className={`rounded-lg border border-(--explorer-border) bg-white px-3 py-2 ${f.wide ? 'col-span-2' : ''}`}>
            <p className="text-[10px] font-semibold text-(--explorer-muted)">{f.label}</p>
            <p className="mt-0.5 truncate text-[12.5px] font-bold text-(--explorer-navy)">{f.value}</p>
          </div>
        ))}
        <div className="col-span-2 rounded-lg border border-(--explorer-border) bg-white px-3 py-2">
          <p className="text-[10px] font-semibold text-(--explorer-muted)">Required skills</p>
          <div className="mt-1 flex flex-wrap gap-1">
            {JOB_SKILLS.map((s) => (
              <span key={s} className="rounded-md bg-(--explorer-blue-surface) px-1.5 py-0.5 text-[11px] font-bold text-(--explorer-blue)">{s}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function SearchPreview() {
  return (
    <div aria-hidden="true" className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 sm:p-5">
      <div className="flex items-center gap-2.5 rounded-xl bg-white px-3.5 py-2.5">
        <Search size={15} className="shrink-0 text-(--explorer-muted)" />
        <span className="truncate text-[13px] font-semibold text-(--explorer-navy)">Sales executive</span>
        <span className="ml-auto inline-flex shrink-0 items-center gap-1 rounded-md bg-(--explorer-bg) px-2 py-1 text-[11px] font-bold text-(--explorer-navy)/70">
          <SlidersHorizontal size={11} /> Filters
        </span>
      </div>
      <div className="mt-3 flex flex-wrap gap-1.5">
        {SEARCH_FILTERS.map((f) => (
          <span key={f} className="rounded-full border border-white/15 px-2.5 py-1 text-[11px] font-semibold text-white/75">{f}</span>
        ))}
      </div>
      <div className="mt-4 space-y-2">
        {[
          { exp: '3 yrs', city: 'Pune', notice: '15 days' },
          { exp: '2 yrs', city: 'Mumbai', notice: 'Immediate' },
        ].map((r) => (
          <div key={r.city} className="flex items-center gap-3 rounded-xl bg-white/[0.06] px-3 py-2.5 ring-1 ring-white/10">
            <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-white/10 text-white/60">
              <LockKeyhole size={13} />
            </span>
            <div className="min-w-0 flex-1">
              <p className="flex items-center gap-1 text-[11.5px] font-bold text-white">
                <BadgeCheck size={12} className="text-[#5fe0b8]" /> Verified resume
              </p>
              <p className="mt-0.5 flex flex-wrap gap-x-2.5 text-[10.5px] font-semibold text-white/55">
                <span className="inline-flex items-center gap-1"><Clock3 size={10} /> {r.exp}</span>
                <span className="inline-flex items-center gap-1"><MapPin size={10} /> {r.city}</span>
                <span>Notice: {r.notice}</span>
              </p>
            </div>
            <span className="hidden shrink-0 rounded-md bg-[#5fe0b8] px-2 py-1 text-[10.5px] font-extrabold text-(--explorer-navy-deep) min-[400px]:inline">Unlock</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function EmployerSourcingSection() {
  return (
    <section id="hire" aria-labelledby="sourcing-heading" className="bg-white px-4 py-20 sm:px-6 md:px-10 md:py-28">
      <div className="mx-auto max-w-7xl">
        <FadeInView className="max-w-3xl">
          <Eyebrow index="02">Find candidates</Eyebrow>
          <h2 id="sourcing-heading" className={`${h2Class} text-(--explorer-navy)`}>
            Two ways to reach <Accent>the right people.</Accent>
          </h2>
          <p className="mt-5 max-w-xl text-[16px] leading-relaxed text-(--explorer-muted)">
            Let candidates come to you with a job post, or go to them through candidate search. Both run from the same dashboard.
          </p>
        </FadeInView>

        <div className="mt-12 grid gap-5 lg:grid-cols-2 lg:gap-6">
          {/* Channel 1: job posting */}
          <FadeInView className="flex flex-col rounded-[28px] border border-(--explorer-border) bg-white p-6 shadow-[0_30px_60px_-44px_rgba(16,42,67,0.35)] sm:p-8">
            <p className="text-[12px] font-bold uppercase tracking-[0.14em] text-(--explorer-muted)">Inbound</p>
            <h3 className="mt-2 text-[24px] font-extrabold tracking-[-0.025em] text-(--explorer-navy) sm:text-[28px]">Post a job</h3>
            <p className="mt-2 max-w-md text-[15px] leading-relaxed text-(--explorer-muted)">
              Describe the role once. After review it goes live to job seekers, and every application lands in your dashboard.
            </p>
            <Points items={POST_POINTS} />
            <div className="mt-7">
              <JobFormPreview />
            </div>
            <div className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-2 pt-1">
              <ExplorerButton to="/employers/signup" size="lg">
                Post your first job <ArrowRight size={16} aria-hidden="true" />
              </ExplorerButton>
            </div>
          </FadeInView>

          {/* Channel 2: candidate search */}
          <FadeInView
            id="discover-talent"
            delay={0.08}
            className="flex flex-col rounded-[28px] bg-(--explorer-navy-deep) p-6 text-white sm:p-8"
          >
            <p className="text-[12px] font-bold uppercase tracking-[0.14em] text-white/55">Outbound</p>
            <h3 className="mt-2 text-[24px] font-extrabold tracking-[-0.025em] sm:text-[28px]">Search candidates</h3>
            <p className="mt-2 max-w-md text-[15px] leading-relaxed text-white/70">
              Look beyond your applicants. Filter the Mzobs resume database and unlock only the profiles you want to contact.
            </p>
            <Points items={SEARCH_POINTS} dark />
            <div className="mt-7">
              <SearchPreview />
            </div>
            <div className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-2 pt-1">
              <ExplorerButton to="/employers/signup" size="lg" className="bg-[#5fe0b8]! text-(--explorer-navy-deep)! hover:bg-white!">
                Start searching candidates <ArrowRight size={16} aria-hidden="true" />
              </ExplorerButton>
              <Link
                to="/employers/signin"
                className="inline-flex min-h-11 items-center text-[14px] font-bold text-white/80 underline decoration-white/30 underline-offset-4 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white rounded-sm"
              >
                Have an account? Sign in to search
              </Link>
            </div>
          </FadeInView>
        </div>
      </div>
    </section>
  )
}
