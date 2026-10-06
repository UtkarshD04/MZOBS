import { CheckCircle2, Handshake, Rocket, Send } from 'lucide-react'
import { Container, Reveal } from '../mz/primitives'

const STEPS = [
  { n: '01', icon: Send, title: 'Apply', desc: 'Submit your associate application.' },
  { n: '02', icon: CheckCircle2, title: 'Review', desc: 'Our team reviews your request and business details.' },
  { n: '03', icon: Handshake, title: 'Connect', desc: 'We get in touch and discuss how we can work together.' },
  { n: '04', icon: Rocket, title: 'Grow Together', desc: 'Start connecting candidates with opportunities through the Mzobs network.' },
]

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="relative scroll-mt-20 bg-[#F8FAFC] py-16 lg:py-24">
      <Container>
        <Reveal className="mx-auto max-w-xl text-center">
          <h2 className="text-[28px] font-extrabold tracking-[-0.02em] text-[#101828] sm:text-[36px]">Partner with Mzobs in 4 simple steps.</h2>
        </Reveal>

        <div className="relative mt-14">
          {/* Desktop connecting line */}
          <div className="absolute left-0 right-0 top-6 hidden h-px bg-gradient-to-r from-[#0b7a6d]/0 via-[#0b7a6d]/35 to-[#0F8F83]/0 lg:block" aria-hidden="true" />
          {/* Mobile connecting line */}
          <div className="absolute bottom-0 left-6 top-0 w-px bg-gradient-to-b from-[#0b7a6d]/0 via-[#0b7a6d]/30 to-[#0F8F83]/0 lg:hidden" aria-hidden="true" />

          <ol className="relative grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
            {STEPS.map(({ n, icon: Icon, title, desc }, i) => (
              <Reveal as="li" key={n} delay={i * 0.1} className="relative flex gap-4 pl-0 lg:flex-col lg:gap-0 lg:pl-0 lg:text-center">
                <span className="relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#0b7a6d] to-[#0b7a6d] text-white shadow-[0_12px_26px_-10px_rgba(11, 122, 109,0.5)] lg:mx-auto">
                  <Icon size={19} aria-hidden="true" />
                </span>
                <div className="lg:mt-5">
                  <span className="text-[12px] font-extrabold tracking-wide text-[#0b7a6d]">{n}</span>
                  <h3 className="mt-0.5 text-[16.5px] font-bold text-[#101828]">{title}</h3>
                  <p className="mt-1 text-[13.5px] leading-relaxed text-[#475467]">{desc}</p>
                </div>
              </Reveal>
            ))}
          </ol>
        </div>
      </Container>
    </section>
  )
}
