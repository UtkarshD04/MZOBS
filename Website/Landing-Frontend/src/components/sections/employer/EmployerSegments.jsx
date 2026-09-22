import { useState } from 'react'
import { Link } from 'react-router-dom'
import { CheckCircle2, ArrowRight } from 'lucide-react'
import { FadeInView } from './employerMotion'

const SEGMENTS = [
  {
    key: 'growing',
    label: 'Growing businesses',
    benefits: [
      'Post your first role and start receiving applications the same day, no sales call required.',
      'A start-and-scale plan built for early hiring — hire your first roles with no upfront commission.',
      'Recharge only when you need to hire more, so cost tracks your actual hiring, not a flat subscription.',
    ],
    cta: 'Start hiring',
    to: '/employers/signup',
  },
  {
    key: 'established',
    label: 'Established hiring teams',
    benefits: [
      'Run every open requisition, from draft to filled, through a single hiring dashboard.',
      'Every applicant reaching your pipeline has already been checked against the role, cutting time spent on early screening.',
      'Track offers and acceptance status across every open role from one place, without chasing updates over email.',
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
    <section className="bg-[#f7f9fb] py-16 md:py-24 px-6 md:px-12">
      <div className="max-w-5xl mx-auto">
        <FadeInView className="text-center">
          <h2 className="font-sans text-3xl sm:text-4xl md:text-[46px] font-bold text-[#102a43] tracking-tight leading-tight">
            Hiring made simpler for your business
          </h2>
        </FadeInView>

        <FadeInView delay={0.08} className="mt-9 flex justify-center">
          <div className="inline-flex items-center gap-1 rounded-full bg-[#e8f8f5] border border-[#102a43]/15 p-1" role="tablist" aria-label="Hiring by business type">
            {SEGMENTS.map((s) => (
              <button
                key={s.key}
                type="button"
                role="tab"
                aria-selected={active === s.key}
                onClick={() => setActive(s.key)}
                className={`px-4 sm:px-5 h-10 rounded-md text-[13.5px] font-bold transition-colors duration-150 ${
                  active === s.key ? 'bg-[#102a43] text-[#e8f8f5] shadow-sm' : 'text-[#51697e] hover:text-[#102a43]'
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </FadeInView>

        <FadeInView delay={0.14} className="mt-10 rounded-[28px] border border-[#102a43]/15 bg-[#e8f8f5] p-7 sm:p-10">
          <ul className="grid sm:grid-cols-3 gap-6 sm:gap-8">
            {segment.benefits.map((b) => (
              <li key={b} className="flex flex-col gap-3">
                <CheckCircle2 size={18} strokeWidth={1.8} className="text-[#0a6f64]" />
                <p className="text-[14px] text-[#51697e] leading-relaxed">{b}</p>
              </li>
            ))}
          </ul>

          <div className="mt-8 flex justify-center">
            {isExternal ? (
              <Link
                to={segment.to}
                className="inline-flex items-center gap-2 text-sm font-bold text-[#0a6f64] hover:text-[#0a6f64] transition-colors"
              >
                {segment.cta} <ArrowRight size={15} />
              </Link>
            ) : (
              <a
                href={segment.to}
                className="inline-flex items-center gap-2 text-sm font-bold text-[#0a6f64] hover:text-[#0a6f64] transition-colors"
              >
                {segment.cta} <ArrowRight size={15} />
              </a>
            )}
          </div>
        </FadeInView>
      </div>
    </section>
  )
}
