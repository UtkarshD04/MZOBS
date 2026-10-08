import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Rocket, Store, Users, Handshake } from 'lucide-react'
import { FadeInView } from './employerMotion'
import { Accent, Eyebrow, h2Class } from './employerUi'

const SEGMENTS = [
  {
    key: 'startups',
    label: 'Startups',
    icon: Rocket,
    tagline: 'Make your first hires without a hiring team.',
    benefits: [
      'Post your first role without a sales call, straight from sign-up.',
      'One dashboard for every open role as the team grows.',
      'Full candidate profiles, not bare resume attachments.',
    ],
    cta: 'Create employer account',
    to: '/employers/signup',
  },
  {
    key: 'smb',
    label: 'Small & medium businesses',
    icon: Store,
    tagline: 'Reach relevant talent without a complicated process.',
    benefits: [
      'Search reviewed resumes directly instead of waiting on applications.',
      'Shortlist and track candidates in one simple pipeline.',
      'A single annual plan with a GST invoice, no per-hire negotiation.',
    ],
    cta: 'See plans and pricing',
    to: '/employers/pricing',
  },
  {
    key: 'growing',
    label: 'Growing teams',
    icon: Users,
    tagline: 'Run many roles at once and keep every one moving.',
    benefits: [
      'Unlimited job posts on every plan, so new roles cost nothing extra.',
      'Interviews and offers tracked per role, from New to Hired.',
      'Need several recruiters or high volume? Our team builds a custom plan.',
    ],
    cta: 'Ask for a custom plan',
    to: '/employers#pricing',
  },
  {
    key: 'agencies',
    label: 'Placement agencies',
    icon: Handshake,
    tagline: 'Recruit for clients? Partner with Mzobs.',
    benefits: [
      'Join the Mzobs Associate program as a placement company.',
      'Connect your candidates with employers hiring across cities.',
      'Every application is reviewed by the Mzobs team before onboarding.',
    ],
    cta: 'Become a Mzobs Associate',
    to: '/associate',
  },
]

export default function EmployerSegments() {
  const [active, setActive] = useState(0)
  const tabRefs = useRef([])
  const segment = SEGMENTS[active]

  // WAI-ARIA tabs keyboard pattern. The list is vertical on desktop and a grid
  // on mobile, so both arrow axes move between tabs.
  function onTabKeyDown(e, index) {
    const last = SEGMENTS.length - 1
    const prev = index === 0 ? last : index - 1
    const nextIdx = index === last ? 0 : index + 1
    const next = { ArrowRight: nextIdx, ArrowDown: nextIdx, ArrowLeft: prev, ArrowUp: prev, Home: 0, End: last }[e.key]
    if (next === undefined) return
    e.preventDefault()
    setActive(next)
    tabRefs.current[next]?.focus()
  }

  return (
    <section id="who-its-for" aria-labelledby="segments-heading" className="bg-white px-4 py-20 sm:px-6 md:px-10 md:py-28">
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-16">
        <FadeInView>
          <Eyebrow index="04">Who it's for</Eyebrow>
          <h2 id="segments-heading" className={`${h2Class} text-(--explorer-navy)`}>
            Built for teams <Accent>of every size.</Accent>
          </h2>
          <p className="mt-5 max-w-md text-[16px] leading-relaxed text-(--explorer-muted)">
            From a founder making the first hire to agencies recruiting for clients.
          </p>

          <div role="tablist" aria-label="Hiring by business type" className="mt-9 grid grid-cols-2 gap-2 lg:grid-cols-1">
            {SEGMENTS.map((s, i) => {
              const selected = active === i
              return (
                <button
                  key={s.key}
                  ref={(el) => (tabRefs.current[i] = el)}
                  id={`segment-tab-${s.key}`}
                  type="button"
                  role="tab"
                  aria-selected={selected}
                  aria-controls="segment-panel"
                  tabIndex={selected ? 0 : -1}
                  onClick={() => setActive(i)}
                  onKeyDown={(e) => onTabKeyDown(e, i)}
                  className={`flex min-h-14 items-center gap-3 rounded-2xl border px-3.5 py-3 text-left text-[14px] font-bold leading-tight transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--explorer-blue) sm:px-4 sm:text-[15px] ${
                    selected
                      ? 'border-(--explorer-navy) bg-(--explorer-navy) text-white'
                      : 'border-(--explorer-border) bg-white text-(--explorer-navy)/75 hover:border-(--explorer-blue-border) hover:text-(--explorer-navy)'
                  }`}
                >
                  <s.icon size={18} aria-hidden="true" className={`shrink-0 ${selected ? 'text-[#5fe0b8]' : 'text-(--explorer-blue)'}`} />
                  <span className="min-w-0">{s.label}</span>
                  <ArrowRight size={16} aria-hidden="true" className={`ml-auto hidden shrink-0 lg:block ${selected ? 'opacity-100' : 'opacity-0'}`} />
                </button>
              )
            })}
          </div>
        </FadeInView>

        <FadeInView delay={0.08} className="lg:pt-2">
          <div
            id="segment-panel"
            role="tabpanel"
            aria-labelledby={`segment-tab-${segment.key}`}
            tabIndex={0}
            className="flex h-full flex-col rounded-[28px] bg-(--explorer-bg) p-6 ring-1 ring-(--explorer-border) focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-(--explorer-blue) sm:p-10"
          >
            <p className="text-[12px] font-bold uppercase tracking-[0.14em] text-(--explorer-blue)">{segment.label}</p>
            <h3 className="mt-3 max-w-lg text-[26px] font-extrabold leading-[1.15] tracking-[-0.025em] text-(--explorer-navy) sm:text-[32px]">{segment.tagline}</h3>
            <ol className="mt-8 divide-y divide-(--explorer-border) border-y border-(--explorer-border)">
              {segment.benefits.map((b, i) => (
                <li key={b} className="flex items-start gap-4 py-4">
                  <span className="pt-0.5 text-[13px] font-extrabold tabular-nums text-(--explorer-blue)">{String(i + 1).padStart(2, '0')}</span>
                  <p className="text-[15.5px] leading-relaxed text-(--explorer-navy)/85">{b}</p>
                </li>
              ))}
            </ol>
            <Link
              to={segment.to}
              className="group mt-8 inline-flex min-h-11 w-fit items-center gap-2 rounded-md bg-(--explorer-navy) px-5 text-[14px] font-bold text-white transition-colors hover:bg-(--explorer-blue) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--explorer-blue) lg:mt-auto"
            >
              {segment.cta}
              <ArrowRight size={16} aria-hidden="true" className="motion-safe:transition-transform motion-safe:group-hover:translate-x-1" />
            </Link>
          </div>
        </FadeInView>
      </div>
    </section>
  )
}
