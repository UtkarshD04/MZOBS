import { useState } from 'react'
import { CheckCircle2, ArrowRight } from 'lucide-react'
import { FadeInView } from './employerMotion'
import { ExplorerTextLink } from '../../ui/ExplorerButton'

const SEGMENTS = [
  {
    key: 'startups',
    label: 'Startups',
    tagline: 'Find the people who help you build and grow.',
    benefits: [
      'Post your first role and start receiving applications the same day, no sales call required.',
      'One dashboard to manage every open role as your team grows.',
      'Full candidate profiles, not bare resume attachments.',
    ],
    cta: 'Start hiring',
    to: '/employers/signup',
  },
  {
    key: 'smb',
    label: 'Small & Medium Businesses',
    tagline: 'Reach relevant talent without complicated hiring workflows.',
    benefits: [
      'Search the candidate database directly instead of waiting on applications.',
      'Shortlist and track candidates from one simple pipeline.',
      'A single annual plan — no per-hire negotiation.',
    ],
    cta: 'See pricing',
    to: '/employers/pricing',
  },
  {
    key: 'growing',
    label: 'Growing Teams',
    tagline: 'Manage multiple opportunities and candidates from one place.',
    benefits: [
      'Run every open requisition, from draft to filled, through a single hiring dashboard.',
      'Track offers and interview status across every open role in one place.',
      'Keep hiring activity organized as your headcount scales.',
    ],
    cta: 'Explore employer solutions',
    to: '#solutions',
  },
]

export default function EmployerSegments() {
  const [active, setActive] = useState(SEGMENTS[0].key)
  const segment = SEGMENTS.find((s) => s.key === active)
  const isExternal = segment.to.startsWith('/')

  return (
    <section className="bg-(--explorer-bg) py-16 md:py-24 px-6 md:px-12">
      <div className="max-w-5xl mx-auto">
        <FadeInView className="text-center">
          <h2 className="font-sans text-3xl sm:text-4xl md:text-[44px] font-bold text-(--explorer-navy) tracking-tight leading-tight">
            Built for Growing Teams.
          </h2>
        </FadeInView>

        <FadeInView delay={0.08} className="mt-9 flex justify-center">
          <div className="inline-flex flex-wrap items-center justify-center gap-1 rounded-full bg-white border border-(--explorer-border) p-1" role="tablist" aria-label="Hiring by business type">
            {SEGMENTS.map((s) => (
              <button
                key={s.key}
                type="button"
                role="tab"
                aria-selected={active === s.key}
                onClick={() => setActive(s.key)}
                className={`px-4 sm:px-5 h-10 rounded-full text-[13.5px] font-bold transition-colors duration-150 ${
                  active === s.key ? 'bg-(--explorer-navy) text-white shadow-sm' : 'text-(--explorer-muted) hover:text-(--explorer-navy)'
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </FadeInView>

        <FadeInView delay={0.14} className="mt-10 rounded-[28px] border border-(--explorer-border) bg-white p-7 sm:p-10">
          <p className="text-center text-[15px] font-bold text-(--explorer-navy)">{segment.tagline}</p>
          <ul className="mt-7 grid sm:grid-cols-3 gap-6 sm:gap-8">
            {segment.benefits.map((b) => (
              <li key={b} className="flex flex-col gap-3">
                <CheckCircle2 size={18} strokeWidth={1.8} className="text-(--explorer-blue)" />
                <p className="text-[14px] text-(--explorer-muted) leading-relaxed">{b}</p>
              </li>
            ))}
          </ul>

          <div className="mt-8 flex justify-center">
            {isExternal ? (
              <ExplorerTextLink to={segment.to}>{segment.cta}</ExplorerTextLink>
            ) : (
              <a href={segment.to} className="inline-flex items-center gap-1.5 text-sm font-bold text-(--explorer-blue) hover:text-(--explorer-blue-hover) transition-colors">
                {segment.cta} <ArrowRight size={15} />
              </a>
            )}
          </div>
        </FadeInView>
      </div>
    </section>
  )
}
