import { FadeInView } from './employerMotion'
import ExplorerButton, { ExplorerTextLink } from '../../ui/ExplorerButton'

export default function EmployerCTABand() {
  return (
<<<<<<< Updated upstream
    <section id="contact" className="bg-[#eeefff] py-20 md:py-28 px-6 md:px-12">
      <FadeInView className="max-w-2xl mx-auto text-center">
        <h2 className="font-sans text-4xl sm:text-5xl font-bold text-[#111827] tracking-tight leading-tight">
          Ready to start hiring with more clarity?
        </h2>
        <p className="mt-4 text-base text-[#111827]/75 leading-relaxed max-w-lg mx-auto">
          Create your free employer account and start receiving relevant applications today.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-x-8 gap-y-4">
          <Link
            to="/employers/signup"
            className="inline-flex items-center justify-center gap-2 px-7 py-3.5 min-h-[44px] rounded-full bg-[#111827] text-[#eeefff] text-sm font-bold transition-all duration-200 hover:-translate-y-px"
          >
            Create employer account <ArrowRight size={16} />
          </Link>
          <Link
            to="/employers/signin"
            className="inline-flex items-center text-sm font-bold text-[#111827]/75 hover:text-[#111827] transition-colors"
          >
            Sign in to employer dashboard
          </Link>
=======
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
>>>>>>> Stashed changes
        </div>
      </FadeInView>
    </section>
  )
}
