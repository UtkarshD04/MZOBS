import { Container } from '../mz/primitives'

const STEPS = [
  { title: 'Apply', desc: 'Submit your associate application.' },
  { title: 'Review', desc: 'Our team reviews your request and business details.' },
  { title: 'Connect', desc: 'We get in touch and discuss how we can work together.' },
  { title: 'Start working', desc: 'Connect candidates with opportunities through the Mzobs network.' },
]

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="scroll-mt-20 border-y border-[#E6E8F0] bg-[#F8FAFC] py-14 lg:py-20">
      <Container>
        <h2 className="text-[26px] font-extrabold text-[#101828] sm:text-[32px]">How it works</h2>
        <ol className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map(({ title, desc }, i) => (
            <li key={title} className="rounded-lg border border-[#E6E8F0] bg-white p-5">
              <span className="flex h-8 w-8 items-center justify-center rounded-md bg-[#0b7a6d] text-[14px] font-bold text-white">{i + 1}</span>
              <h3 className="mt-3 text-[15.5px] font-bold text-[#101828]">{title}</h3>
              <p className="mt-1.5 text-[14px] leading-relaxed text-[#475467]">{desc}</p>
            </li>
          ))}
        </ol>
      </Container>
    </section>
  )
}
