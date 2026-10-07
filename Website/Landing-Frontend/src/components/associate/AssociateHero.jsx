import { Link } from 'react-router-dom'
import { Container } from '../mz/primitives'
import { CLIENT_ONLY_ROUTES } from '../../lib/routes'

const POINTS = [
  'Access verified openings from employers across industries and cities',
  'Connect your candidates beyond your local network',
  'Work directly with the Mzobs team',
]

export default function AssociateHero() {
  return (
    <section className="border-b border-[#E6E8F0] bg-[#F8FAFC] pb-14 pt-28 lg:pb-20 lg:pt-36">
      <Container className="grid grid-cols-1 items-center gap-10 lg:grid-cols-[1.2fr_1fr] lg:gap-16">
        <div>
          <p className="text-[13px] font-bold uppercase tracking-wide text-[#0b7a6d]">Associate Program</p>
          <h1 className="mt-3 text-[34px] font-extrabold leading-[1.15] text-[#101828] sm:text-[44px]">
            Become a Mzobs Associate
          </h1>
          <p className="mt-4 max-w-xl text-[16.5px] leading-relaxed text-[#475467]">
            Join the Mzobs hiring network and connect candidates with verified opportunities from employers across industries and cities.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link
              to={CLIENT_ONLY_ROUTES.associateApply}
              className="inline-flex h-12 items-center rounded-md bg-[#0b7a6d] px-6 text-[15px] font-semibold text-white hover:bg-[#096558] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0b7a6d]"
            >
              Apply as Associate
            </Link>
            <a
              href="#how-it-works"
              className="inline-flex h-12 items-center rounded-md border border-[#D0D5DD] bg-white px-6 text-[15px] font-semibold text-[#101828] hover:border-[#0b7a6d]"
            >
              How it works
            </a>
          </div>
        </div>

        <div className="rounded-lg border border-[#E6E8F0] bg-white p-6">
          <h2 className="text-[16px] font-bold text-[#101828]">What you get</h2>
          <ul className="mt-4 space-y-3">
            {POINTS.map((p) => (
              <li key={p} className="flex gap-3 text-[14.5px] leading-snug text-[#475467]">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#0b7a6d]" aria-hidden="true" />
                {p}
              </li>
            ))}
          </ul>
          <p className="mt-5 border-t border-[#EAECF0] pt-4 text-[13px] text-[#475467]">
            Every application is reviewed by the Mzobs team before onboarding.
          </p>
        </div>
      </Container>
    </section>
  )
}
