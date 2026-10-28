import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { Container, Reveal } from '../mz/primitives'
import { CLIENT_ONLY_ROUTES } from '../../lib/routes'

export default function FinalCTA() {
  return (
    <section className="relative bg-white py-16 lg:py-20">
      <Container>
        <Reveal className="mx-auto max-w-lg text-center">
          <h2 className="text-[#101828] text-[28px] sm:text-[34px] lg:text-[40px] font-extrabold leading-[1.1] tracking-tight">Let&rsquo;s connect opportunities, together.</h2>
          <p className="mt-3 text-[#475467] text-[16px] sm:text-[17px] font-normal leading-relaxed">
            Your network, our opportunities. One application starts the conversation.
          </p>
          <Link
            to={CLIENT_ONLY_ROUTES.associateApply}
            className="group mt-6 inline-flex h-[50px] items-center gap-2 rounded-full bg-gradient-to-r from-[#0b7a6d] to-[#0b7a6d] px-6 text-[15px] font-bold text-white shadow-[0_14px_30px_-10px_rgba(11,122,109,0.5)] transition-transform duration-200 hover:-translate-y-0.5"
          >
            Start Your Associate Application
            <ArrowRight size={17} className="transition-transform duration-200 group-hover:translate-x-0.5" aria-hidden="true" />
          </Link>
        </Reveal>
      </Container>
    </section>
  )
}
