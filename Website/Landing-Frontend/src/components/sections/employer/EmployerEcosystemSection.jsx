import { Briefcase, UserRound } from 'lucide-react'
import { FadeInView } from './employerMotion'
import { ExplorerTextLink } from '../../ui/ExplorerButton'

export default function EmployerEcosystemSection() {
  return (
    <section className="bg-(--explorer-bg) py-20 md:py-28 px-6 md:px-12">
      <div className="max-w-5xl mx-auto">
        <FadeInView className="text-center max-w-2xl mx-auto">
          <h2 className="font-sans text-3xl sm:text-4xl md:text-[44px] font-bold text-(--explorer-navy) tracking-tight leading-tight">
            One Platform. Two Sides of Hiring.
          </h2>
        </FadeInView>

        <div className="mt-12 grid md:grid-cols-2 gap-5">
          <FadeInView delay={0.05}>
            <div className="h-full rounded-[26px] border border-(--explorer-border) bg-white p-7 sm:p-8">
              <span className="grid h-11 w-11 place-items-center rounded-full bg-(--explorer-blue-surface) text-(--explorer-blue)">
                <Briefcase size={19} />
              </span>
              <h3 className="mt-4 text-lg font-bold text-(--explorer-navy)">For Employers</h3>
              <p className="mt-2 text-[14px] text-(--explorer-muted) leading-relaxed">
                Post → Discover → Shortlist → Interview → Hire.
              </p>
              <ExplorerTextLink to="/employers" className="mt-5">
                Hire on Mzobs
              </ExplorerTextLink>
            </div>
          </FadeInView>

          <FadeInView delay={0.1}>
            <div className="h-full rounded-[26px] border border-(--explorer-border) bg-white p-7 sm:p-8">
              <span className="grid h-11 w-11 place-items-center rounded-full bg-(--explorer-teal-surface) text-(--explorer-teal)">
                <UserRound size={19} />
              </span>
              <h3 className="mt-4 text-lg font-bold text-(--explorer-navy)">For Candidates</h3>
              <p className="mt-2 text-[14px] text-(--explorer-muted) leading-relaxed">
                Discover → Apply → Interview → Opportunity.
              </p>
              <ExplorerTextLink to="/" className="mt-5">
                Find a job on Mzobs
              </ExplorerTextLink>
            </div>
          </FadeInView>
        </div>
      </div>
    </section>
  )
}
