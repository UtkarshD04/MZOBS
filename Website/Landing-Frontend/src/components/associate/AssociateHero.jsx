import { Link } from 'react-router-dom'
import { ArrowRight, BadgeCheck } from 'lucide-react'
import { Container, Reveal } from '../mz/primitives'
import { CLIENT_ONLY_ROUTES } from '../../lib/routes'

const POINTS = [
  'Access verified openings from employers across industries and cities',
  'Connect your candidates beyond your local network',
  'Work directly with the Mzobs team',
]

export default function AssociateHero() {
  return (
    <section className="associate-hero associate-section--soft border-b border-[#E1E9E8]">
      <Container className="grid grid-cols-1 items-center gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16">
        <Reveal>
          <h1 className="mt-3 max-w-3xl text-[clamp(2.4rem,5.5vw,4rem)] font-extrabold leading-[1.08] tracking-[-0.045em] text-[#12302D]">
            Become a Mzobs Associate
          </h1>
          <p className="mt-5 max-w-xl text-[16px] leading-[1.8] text-[#5B6D79] sm:text-[17px]">
            Join the Mzobs hiring network and connect candidates with verified opportunities from employers across industries and cities.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link
              to={CLIENT_ONLY_ROUTES.associateApply}
              className="associate-button associate-button--primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0F766E]"
            >
              Apply as Associate <ArrowRight className="ml-2" size={17} aria-hidden="true" />
            </Link>
            <a
              href="#how-it-works"
              className="associate-button associate-button--secondary"
            >
              How it works
            </a>
          </div>
        </Reveal>

        <Reveal delay={0.08} className="associate-card p-6 sm:p-7">
          <div className="flex items-center gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-full bg-[#EAF5F3] text-[#0A3A35]" aria-hidden="true">
              <BadgeCheck size={23} strokeWidth={1.8} />
            </span>
            <h2 className="text-[17px] font-bold tracking-[-0.015em] text-[#12302D]">What you get</h2>
          </div>
          <ul className="mt-5 space-y-4">
            {POINTS.map((p) => (
              <li key={p} className="flex gap-3 text-[14.5px] leading-relaxed text-[#5B6D79]">
                <span className="mt-1 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-[#EAF5F3] text-[#0A3A35]" aria-hidden="true">
                  <BadgeCheck size={13} strokeWidth={2.5} />
                </span>
                {p}
              </li>
            ))}
          </ul>
          <p className="mt-5 border-t border-[#E8EFEE] pt-4 text-[13px] leading-relaxed text-[#5B6D79]">
            Every application is reviewed by the Mzobs team before onboarding.
          </p>
        </Reveal>
      </Container>
    </section>
  )
}
