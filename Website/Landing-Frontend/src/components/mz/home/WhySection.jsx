import { Check, Minus } from 'lucide-react'
import { Container, Reveal, SectionHead } from '../primitives'

// "The usual way" vs Mzobs, row by row. Framed against common hiring
// problems rather than any named competitor.
const ROWS = [
  { area: 'Job discovery', usual: 'Scrolling the same generic listings', mzobs: 'Recommendations based on your skills, experience and location' },
  { area: 'Transparency', usual: 'Pay and work mode revealed late, if at all', mzobs: 'Work mode, experience and pay (when shared) on every listing' },
  { area: 'Intelligent matching', usual: 'Keyword search and endless scrolling', mzobs: 'Matches ranked by skills, experience, location and preference' },
  { area: 'Candidate discovery', usual: 'Hundreds of applications to read one by one', mzobs: 'Candidates ranked by fit, with search across skills and resumes' },
  { area: 'Interview scheduling', usual: 'Back-and-forth over email and phone', mzobs: 'Interviews scheduled and tracked from the hiring dashboard' },
  { area: 'Hiring experience', usual: 'Applications disappear without an update', mzobs: 'One pipeline from match to interview to offer' },
]

export default function WhySection() {
  return (
    <section id="why-mzobs" aria-labelledby="why-title" className="bg-white py-20 lg:py-28">
      <Container>
        <SectionHead id="why-title" eyebrow="Why Mzobs" title="Hiring, without the guesswork." align="center">
          What changes when matching does the heavy lifting.
        </SectionHead>

        <Reveal className="mx-auto mt-12 max-w-5xl overflow-hidden rounded-3xl ring-1 ring-mz-line">
          <table className="w-full border-collapse text-left">
            <caption className="sr-only">How hiring on Mzobs compares with the usual way</caption>
            <thead className="hidden md:table-header-group">
              <tr className="bg-mz-bg text-[13px] font-semibold uppercase tracking-wider">
                <th scope="col" className="w-[22%] px-6 py-4 text-mz-muted">&nbsp;</th>
                <th scope="col" className="w-[36%] px-6 py-4 text-mz-muted">The usual way</th>
                <th scope="col" className="px-6 py-4 text-mz-primary-strong">With Mzobs</th>
              </tr>
            </thead>
            <tbody>
              {ROWS.map((r) => (
                <tr key={r.area} className="group flex flex-col border-t border-mz-line first:border-t-0 md:table-row md:first:border-t">
                  <th scope="row" className="px-6 pb-1 pt-5 text-[15.5px] font-semibold text-mz-ink md:py-5">{r.area}</th>
                  <td className="flex items-start gap-2.5 px-6 py-1.5 text-[14.5px] text-mz-muted md:table-cell md:py-5">
                    <span className="inline-flex items-start gap-2.5">
                      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-mz-bg text-mz-muted ring-1 ring-mz-line"><Minus size={11} aria-hidden="true" /></span>
                      <span><span className="sr-only md:hidden">Usually: </span>{r.usual}</span>
                    </span>
                  </td>
                  <td className="flex items-start px-6 pb-5 pt-1.5 text-[14.5px] font-medium text-mz-ink transition-colors group-hover:bg-mz-primary-tint/40 md:table-cell md:py-5">
                    <span className="inline-flex items-start gap-2.5">
                      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-mz-accent text-white"><Check size={11} strokeWidth={3} aria-hidden="true" /></span>
                      <span><span className="sr-only md:hidden">With Mzobs: </span>{r.mzobs}</span>
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Reveal>
      </Container>
    </section>
  )
}
