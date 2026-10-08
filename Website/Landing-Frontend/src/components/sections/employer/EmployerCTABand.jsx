import { Check } from 'lucide-react'
import { FadeInView } from './employerMotion'
import ExplorerButton from '../../ui/ExplorerButton'

const FACTS = ['Unlimited job posts', 'No per-job fee', 'GST invoice included']

export default function EmployerCTABand() {
  return (
    <section id="contact" className="bg-(--explorer-bg) py-16 md:py-24 px-6 md:px-12">
      <FadeInView className="relative mx-auto max-w-6xl overflow-hidden rounded-[32px] bg-(--explorer-navy) px-6 py-16 text-center sm:px-12 md:py-20">
        <div aria-hidden="true" className="absolute -top-24 left-1/2 h-72 w-[70%] -translate-x-1/2 rounded-full bg-(--explorer-blue)/60 blur-[100px]" />
        <div aria-hidden="true" className="absolute -bottom-24 -right-10 h-64 w-64 rounded-full bg-[#20c997]/30 blur-[90px]" />
        <div
          aria-hidden="true"
          className="absolute inset-0 opacity-40 [background-image:radial-gradient(rgba(255,255,255,0.18)_1px,transparent_1.3px)] [background-size:22px_22px] [mask-image:radial-gradient(ellipse_60%_70%_at_50%_40%,#000,transparent_75%)]"
        />

        <div className="relative">
          <span className="text-[12px] font-bold uppercase tracking-[0.16em] text-[#20c997]">Start hiring today</span>
          <h2 className="mx-auto mt-4 max-w-2xl font-sans text-4xl sm:text-5xl font-bold text-white tracking-tight leading-tight">
            Ready to Build Your Team?
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-base text-white/70 leading-relaxed">
            Create your employer account, post your first role and start reviewing applications in one place.
          </p>
          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <ExplorerButton to="/employers/signup" size="xl" className="w-full sm:w-auto">
              Post a Job →
            </ExplorerButton>
            <ExplorerButton
              to="/employers#discover-talent"
              variant="secondary"
              size="xl"
              className="w-full border-white/20! bg-white/5! text-white! hover:bg-white/15! sm:w-auto"
            >
              Find Candidates
            </ExplorerButton>
          </div>
          <ul className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
            {FACTS.map((fact) => (
              <li key={fact} className="flex items-center gap-2 text-[13px] font-semibold text-white/75">
                <Check size={14} strokeWidth={3} className="text-[#20c997]" aria-hidden="true" />
                {fact}
              </li>
            ))}
          </ul>
        </div>
      </FadeInView>
    </section>
  )
}
