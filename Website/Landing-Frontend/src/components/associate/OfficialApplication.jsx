import { Container } from '../mz/primitives'

export default function OfficialApplication() {
  return (
    <section className="bg-white py-10">
      <Container>
        <div className="rounded-lg border border-[#FEDF89] bg-[#FFFAEB] px-5 py-4">
          <p className="text-[14.5px] font-bold text-[#101828]">Apply only through the official Mzobs page.</p>
          <p className="mt-1 text-[13.5px] leading-relaxed text-[#475467]">
            Never share sensitive information with unknown individuals claiming to represent Mzobs. If you receive a suspicious message, contact us through our official channels.
          </p>
        </div>
      </Container>
    </section>
  )
}
