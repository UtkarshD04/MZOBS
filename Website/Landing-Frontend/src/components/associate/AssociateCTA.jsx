import { Link } from 'react-router-dom'
import { Container } from '../mz/primitives'
import { CONTACT_EMAIL } from '../../lib/config'
import { CLIENT_ONLY_ROUTES } from '../../lib/routes'

export default function AssociateCTA() {
  return (
    <section className="bg-[#101828] py-14 text-white lg:py-16">
      <Container className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
        <div>
          <h2 className="text-[24px] font-extrabold sm:text-[28px]">Ready to partner with Mzobs?</h2>
          <p className="mt-1.5 text-[15px] text-white/70">Submit your application and our team will get back to you.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link to={CLIENT_ONLY_ROUTES.associateApply} className="inline-flex h-12 items-center rounded-md bg-[#0b7a6d] px-6 text-[15px] font-semibold text-white hover:bg-[#0F8F83]">
            Apply as Associate
          </Link>
          <a href={`mailto:${CONTACT_EMAIL}`} className="inline-flex h-12 items-center rounded-md border border-white/30 px-6 text-[15px] font-semibold text-white hover:bg-white/10">
            Contact Mzobs
          </a>
        </div>
      </Container>
    </section>
  )
}
