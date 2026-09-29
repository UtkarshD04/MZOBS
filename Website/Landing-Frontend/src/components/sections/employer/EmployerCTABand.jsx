import { FadeInView } from './employerMotion'
import ExplorerButton, { ExplorerTextLink } from '../../ui/ExplorerButton'

export default function EmployerCTABand() {
  return (
    <section id="contact" className="bg-(--explorer-navy-deep) py-20 md:py-28 px-6 md:px-12">
      <FadeInView className="max-w-2xl mx-auto text-center">
        <h2 className="font-sans text-4xl sm:text-5xl font-bold text-white tracking-tight leading-tight">
          Ready to Build Your Team?
        </h2>
        <p className="mt-4 text-base text-white/65 leading-relaxed max-w-lg mx-auto">
          Start your hiring journey with Mzobs.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-x-8 gap-y-4">
          <ExplorerButton to="/employers/signup" size="xl">
            Post a Job →
          </ExplorerButton>
          <ExplorerTextLink to="/employers#discover-talent">
            Find Candidates
          </ExplorerTextLink>
        </div>
      </FadeInView>
    </section>
  )
}
