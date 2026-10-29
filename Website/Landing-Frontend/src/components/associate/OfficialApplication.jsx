import { Container, Reveal } from '../mz/primitives'
import { ShieldAlert } from 'lucide-react'

export default function OfficialApplication() {
  return (
    <section className="bg-white py-8 sm:py-10">
      <Container>
        <Reveal className="associate-card flex items-start gap-4 p-5 sm:p-6">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[#EAF5F3] text-[#0A3A35]" aria-hidden="true">
            <ShieldAlert size={20} />
          </span>
          <div>
            <p className="text-[15px] font-bold text-[#12302D]">Apply only through the official Mzobs page.</p>
            <p className="mt-1 text-[14px] leading-relaxed text-[#5B6D79]">
              Never share sensitive information with unknown individuals claiming to represent Mzobs. If you receive a suspicious message, contact us through our official channels.
            </p>
          </div>
        </Reveal>
      </Container>
    </section>
  )
}
