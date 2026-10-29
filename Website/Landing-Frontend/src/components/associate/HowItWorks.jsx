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
        <AssociateSectionHeading title="How it works" description="A clear, straightforward process to start working together." />
        <ol className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map(({ title, desc }, i) => (
            <AssociateCard key={title} title={title} description={desc} number={i + 1} delay={i * 0.06} />
          ))}
        </ol>
      </Container>
    </section>
  )
}
