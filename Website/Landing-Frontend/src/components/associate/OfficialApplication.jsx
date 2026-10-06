import { Link } from 'react-router-dom'
import { ChevronsRight, ShieldCheck } from 'lucide-react'
import { Container, Reveal } from '../mz/primitives'
import { CONTACT_EMAIL } from '../../lib/config'
import { CLIENT_ONLY_ROUTES } from '../../lib/routes'

export default function OfficialApplication() {
  return (
    <section className="relative bg-[#F8FAFC] py-16 lg:py-20">
      <Container>
        <Reveal className="mx-auto max-w-3xl rounded-[28px] border border-[#E6E8F0] bg-white p-8 text-center shadow-[0_30px_60px_-30px_rgba(16,24,40,0.18)] sm:p-10">
          <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#EEF2FF] text-[#0b7a6d]">
            <ShieldCheck size={22} aria-hidden="true" />
          </span>
          <h2 className="mt-5 text-[22px] font-extrabold tracking-[-0.015em] text-[#101828] sm:text-[26px]">
            Apply only through the official Mzobs page.
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-[14.5px] leading-relaxed text-[#475467]">
            Never share sensitive information with unknown individuals claiming to represent Mzobs. If you receive a suspicious message, contact us through our official channels.
          </p>

          <div className="mt-7 flex flex-wrap items-center justify-center gap-3.5">
            <Link
              to={CLIENT_ONLY_ROUTES.associateApply}
              className="inline-flex h-[46px] items-center gap-1.5 rounded-full bg-gradient-to-r from-[#0b7a6d] to-[#0b7a6d] px-5 text-[14px] font-bold text-white shadow-[0_12px_26px_-10px_rgba(11, 122, 109,0.5)] transition-transform duration-200 hover:-translate-y-0.5"
            >
              Official Associate Application
              <ChevronsRight size={16} aria-hidden="true" />
            </Link>
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="inline-flex h-[46px] items-center rounded-full border border-[#D5D8E4] px-5 text-[14px] font-bold text-[#101828] transition-colors hover:border-[#0b7a6d] hover:text-[#0b7a6d]"
            >
              Contact Mzobs
            </a>
          </div>
        </Reveal>
      </Container>
    </section>
  )
}
