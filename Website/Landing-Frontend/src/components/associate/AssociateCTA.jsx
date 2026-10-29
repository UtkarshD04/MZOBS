import { Link } from 'react-router-dom'
import { Container, Reveal } from '../mz/primitives'
import { CONTACT_EMAIL } from '../../lib/config'
import { CLIENT_ONLY_ROUTES } from '../../lib/routes'

export default function AssociateCTA() {
  return (
    <section className="associate-cta bg-[#0A3A35] py-14 text-white lg:py-16">
      <Container>
        <Reveal className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
          <div>
            <h2 className="text-[24px] font-extrabold tracking-[-0.025em] sm:text-[28px]">Ready to partner with Mzobs?</h2>
            <p className="mt-1.5 text-[15px] leading-relaxed text-white/75">Submit your application and our team will get back to you.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link to={CLIENT_ONLY_ROUTES.associateApply} className="associate-button associate-button--primary">
              Apply as Associate
            </Link>
            <a href={`mailto:${CONTACT_EMAIL}`} className="associate-button border border-white/35 text-white hover:bg-white/10">
              Contact Mzobs
            </a>
          </div>
        </Reveal>
      </Container>
    </section>
  )
}
