import { Container } from '../mz/primitives'
import { AssociateCard, AssociateSectionHeading } from './associateUi'

const STEPS = [
  { title: 'Apply', desc: 'Submit your associate application.' },
  { title: 'Review', desc: 'Our team reviews your request and business details.' },
  { title: 'Connect', desc: 'We get in touch and discuss how we can work together.' },
  { title: 'Start working', desc: 'Connect candidates with opportunities through the Mzobs network.' },
]

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="associate-section associate-section--soft scroll-mt-20 border-y border-[#E1E9E8]">
      <Container>
<<<<<<< HEAD
        <AssociateSectionHeading title="How it works" description="A clear, straightforward process to start working together." />
        <ol className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
=======
        <h2 className="text-[#101828] text-[28px] sm:text-[34px] lg:text-[40px] font-extrabold leading-[1.1] tracking-tight">How it works</h2>
        <ol className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
>>>>>>> 505a7472e6e3593ddda92924986acbdc69c4c533
          {STEPS.map(({ title, desc }, i) => (
            <AssociateCard key={title} title={title} description={desc} number={i + 1} delay={i * 0.06} />
          ))}
        </ol>
      </Container>
    </section>
  )
}
