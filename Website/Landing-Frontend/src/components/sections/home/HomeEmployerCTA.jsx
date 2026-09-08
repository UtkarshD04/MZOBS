import { ArrowRight } from 'lucide-react'
import Reveal from '../../ui/Reveal'
import ExplorerButton from '../../ui/ExplorerButton'
import { HOME_EMPLOYER_CTA_DATA } from '../../../lib/content'

export default function HomeEmployerCTA() {
  return (
    <section className="bg-(--explorer-navy-deep) py-14 md:py-16 px-6 md:px-10">
      <Reveal
        direction="up"
        duration={0.7}
        className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left"
      >
        <div>
          <h2 className="text-2xl sm:text-[28px] font-extrabold text-white tracking-tight">{HOME_EMPLOYER_CTA_DATA.title}</h2>
          <p className="mt-2 text-[15px] text-white/70 max-w-lg">{HOME_EMPLOYER_CTA_DATA.subtitle}</p>
        </div>
        {/* Inline outlineColor (not a focus-visible:outline-* class) so it reliably
            wins over ExplorerButton's own teal focus ring on this dark section —
            two Tailwind classes setting the same outline-color property don't have
            a guaranteed cascade order, an inline style always does. */}
        <ExplorerButton to={HOME_EMPLOYER_CTA_DATA.ctaTo} size="xl" className="shrink-0" style={{ outlineColor: '#ffffff' }}>
          {HOME_EMPLOYER_CTA_DATA.ctaText} <ArrowRight size={16} aria-hidden="true" />
        </ExplorerButton>
      </Reveal>
    </section>
  )
}
