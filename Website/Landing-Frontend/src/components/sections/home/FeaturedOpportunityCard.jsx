import { Clock, ArrowUpRight } from 'lucide-react'
import { CompanyMark, VerifiedMark, NewBadge } from './jobCardPrimitives'

const MAX_SKILLS = 3

// The "Open roles" section's editorial centerpiece — one large, calm panel
// for the newest job in the current result set. Three quiet zones (company
// identity / role / compensation) read left-to-right on desktop, stacking
// on mobile; a single soft gradient wash sits behind the identity zone for
// warmth, not decoration for its own sake. Deliberately grounded — no
// floating shapes bleeding past the panel's own edges, no card tilt, no
// orbiting elements — so it reads as one confident surface, not a
// composition of separate effects. Separate component from
// FeaturedJobCard.jsx on purpose: that one is also used by
// pages/CityJobs.jsx in a plain vertical-list layout this redesign must
// not touch, so this section gets its own dedicated "hero" treatment
// instead of reshaping a component something else depends on.
export default function FeaturedOpportunityCard({ job, onOpen }) {
  const isRecent = job.postedDaysAgo != null && job.postedDaysAgo <= 1
  const skills = (job.skills ?? []).slice(0, MAX_SKILLS)
  const facts = [
    { label: 'Location', value: job.location },
    { label: 'Work mode', value: job.workMode },
    { label: 'Experience', value: job.experience },
  ].filter((f) => f.value)

  return (
    <button
      type="button"
      onClick={onOpen}
      className="featured-card-surface group relative w-full min-w-0 text-left flex flex-col overflow-hidden rounded-[28px] border border-(--explorer-border) bg-white p-7 sm:p-10 md:p-12 shadow-[0_1px_2px_rgba(32,37,31,0.04),0_28px_56px_-32px_rgba(32,37,31,0.22)] motion-safe:transition-[transform,box-shadow] motion-safe:duration-300 motion-safe:hover:-translate-y-0.5 hover:shadow-[0_1px_2px_rgba(32,37,31,0.05),0_36px_64px_-28px_rgba(36,107,90,0.24)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--explorer-teal)"
    >
      {/* One soft color field behind the identity zone only (~28% of the
          panel width) — the redesign brief's "visual personality without
          making it colorful". Confined and masked to fade into the white
          surface, never bleeding past the panel's own rounded edges. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 left-0 w-[34%] opacity-80"
        style={{
          background:
            'radial-gradient(ellipse 260px 220px at 18% 22%, rgba(37, 99, 235, 0.07), transparent 65%), radial-gradient(ellipse 240px 240px at 22% 85%, rgba(36, 107, 90, 0.08), transparent 65%)',
          WebkitMaskImage: 'linear-gradient(to right, black 0%, black 55%, transparent 100%)',
          maskImage: 'linear-gradient(to right, black 0%, black 55%, transparent 100%)',
        }}
      />

      <div className="relative flex items-start justify-between gap-4">
        <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-(--explorer-teal)">Featured opportunity</p>
        <span className="inline-flex items-center gap-1.5 h-6 px-2.5 rounded-full bg-(--explorer-teal-surface) text-(--explorer-teal) text-[10.5px] font-bold uppercase tracking-wide shrink-0">
          <span className="live-dot w-1.5 h-1.5 rounded-full bg-(--explorer-teal)" aria-hidden="true" />
          Open now
        </span>
      </div>

      {/* Three quiet zones: identity, role, compensation. */}
      <div className="relative mt-8 flex flex-col lg:flex-row lg:items-start gap-6 lg:gap-10">
        <div className="flex items-center gap-3.5 lg:w-52 lg:shrink-0">
          <span className="relative shrink-0" aria-hidden="true">
            <span className="featured-mark-glow absolute -inset-3 rounded-full opacity-60 motion-safe:transition-opacity motion-safe:duration-300 group-hover:opacity-100" />
            <span className="relative block motion-safe:transition-transform motion-safe:duration-300 group-hover:scale-[1.02]">
              <CompanyMark company={job.company} logo={job.logo} size="lg" />
            </span>
          </span>
          <div className="min-w-0">
            <p className="font-bold text-[15px] text-(--explorer-navy) truncate">{job.company}</p>
            {job.verified && <VerifiedMark />}
          </div>
        </div>

        <div className="min-w-0 flex-1 lg:border-l lg:border-(--explorer-border) lg:pl-10">
          <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-(--explorer-muted)">Featured role</p>
          <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1.5">
            <h3 className="text-[28px] sm:text-[36px] font-extrabold text-(--explorer-navy) leading-[1.05] tracking-tight text-balance">{job.title}</h3>
            {isRecent && <NewBadge />}
          </div>
        </div>

        {job.salary && (
          <div className="lg:w-44 lg:shrink-0 lg:text-right lg:border-l lg:border-(--explorer-border) lg:pl-8">
            <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-(--explorer-muted)">Compensation</p>
            <p className="mt-2 text-[19px] sm:text-[21px] font-extrabold text-(--explorer-navy) text-balance">{job.salary}</p>
          </div>
        )}
      </div>

      {/* Clean spec row — location / work mode / experience, replacing what
          used to be a scattered inline metadata line. */}
      {facts.length > 0 && (
        <div className="relative mt-8 flex flex-wrap divide-x divide-(--explorer-border) rounded-2xl bg-(--explorer-bg) overflow-hidden">
          {facts.map((f) => (
            <div key={f.label} className="flex-1 min-w-[130px] px-5 py-3.5">
              <p className="text-[10px] font-bold uppercase tracking-wide text-(--explorer-muted)">{f.label}</p>
              <p className="mt-1 text-[14.5px] font-bold text-(--explorer-navy) truncate">{f.value}</p>
            </div>
          ))}
        </div>
      )}

      {skills.length > 0 && (
        <div className="relative mt-6 flex flex-wrap gap-2">
          {skills.map((skill) => (
            <span
              key={skill}
              className="inline-flex items-center h-6.5 px-2.5 rounded-full border border-(--explorer-border) bg-white text-[11.5px] font-medium text-(--explorer-navy)"
            >
              {skill}
            </span>
          ))}
        </div>
      )}

      {job.description && (
        <p className="relative mt-5 max-w-2xl text-[13.5px] text-(--explorer-muted) leading-relaxed line-clamp-2">
          {job.description} <span className="font-bold text-(--explorer-teal)">Read full role →</span>
        </p>
      )}

      <div className="relative mt-8 pt-6 border-t border-(--explorer-border) flex items-center justify-between gap-3">
        <span className="inline-flex items-center gap-1.5 h-11 px-6 rounded-full bg-(--explorer-teal) text-white text-[13.5px] font-bold group-hover:bg-(--explorer-teal-hover) motion-safe:transition-[background-color,transform] motion-safe:duration-200 motion-safe:group-hover:-translate-y-px">
          View role
          <ArrowUpRight
            size={16}
            aria-hidden="true"
            className="motion-safe:transition-transform motion-safe:duration-200 motion-safe:group-hover:translate-x-[3px]"
          />
        </span>
        <span className="flex items-center gap-1 text-[12px] text-(--explorer-muted)">
          <Clock size={12} className="shrink-0" aria-hidden="true" />
          Posted {job.postedDaysAgo === 0 ? 'today' : `${job.postedDaysAgo}d ago`}
        </span>
      </div>
    </button>
  )
}

// Mirrors FeaturedOpportunityCard's block shape so the layout never jumps
// once the real job replaces it.
export function FeaturedOpportunityCardSkeleton() {
  return (
    <div className="flex flex-col bg-white border border-(--explorer-border) rounded-[28px] p-7 sm:p-10 md:p-12 animate-pulse">
      <div className="flex items-start justify-between gap-4">
        <div className="h-3 w-32 rounded bg-(--explorer-bg)" />
        <div className="h-6 w-20 rounded-full bg-(--explorer-bg)" />
      </div>
      <div className="mt-8 flex flex-col lg:flex-row gap-6 lg:gap-10">
        <div className="flex items-center gap-3.5 lg:w-52 lg:shrink-0">
          <div className="w-15 h-15 rounded-2xl bg-(--explorer-bg) shrink-0" />
          <div className="flex flex-col gap-2">
            <div className="h-3 w-24 rounded bg-(--explorer-bg)" />
            <div className="h-2.5 w-20 rounded bg-(--explorer-bg)" />
          </div>
        </div>
        <div className="flex-1 flex flex-col gap-3">
          <div className="h-2.5 w-24 rounded bg-(--explorer-bg)" />
          <div className="h-9 w-2/3 rounded bg-(--explorer-bg)" />
        </div>
        <div className="lg:w-44 lg:shrink-0 flex flex-col gap-2">
          <div className="h-2.5 w-20 rounded bg-(--explorer-bg)" />
          <div className="h-6 w-24 rounded bg-(--explorer-bg)" />
        </div>
      </div>
      <div className="mt-8 h-20 w-full rounded-2xl bg-(--explorer-bg)" />
      <div className="mt-6 flex gap-1.5">
        <div className="h-6.5 w-16 rounded-full bg-(--explorer-bg)" />
        <div className="h-6.5 w-20 rounded-full bg-(--explorer-bg)" />
      </div>
      <div className="mt-5 flex flex-col gap-2">
        <div className="h-2.5 w-full rounded bg-(--explorer-bg)" />
        <div className="h-2.5 w-2/3 rounded bg-(--explorer-bg)" />
      </div>
      <div className="mt-8 pt-6 border-t border-(--explorer-border) flex items-center justify-between">
        <div className="h-11 w-32 rounded-full bg-(--explorer-bg)" />
        <div className="h-2.5 w-24 rounded bg-(--explorer-bg)" />
      </div>
    </div>
  )
}
