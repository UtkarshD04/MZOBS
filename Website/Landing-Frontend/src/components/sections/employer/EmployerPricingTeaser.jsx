import { ExplorerTextLink } from '../../ui/ExplorerButton'
import EmployerPlanCards from './EmployerPlanCards'
import { FadeInView } from './employerMotion'
import { Accent, Eyebrow, h2Class } from './employerUi'

export default function EmployerPricingTeaser() {
  return (
    <section id="pricing" aria-labelledby="pricing-heading" className="bg-(--explorer-bg) px-4 py-20 sm:px-6 md:px-10 md:py-28">
      <FadeInView className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[1fr_auto] lg:items-end">
        <div>
          <Eyebrow index="06">Pricing</Eyebrow>
          <h2 id="pricing-heading" className={`${h2Class} max-w-2xl text-(--explorer-navy)`}>
            One annual payment. <Accent>No per‑job fees.</Accent>
          </h2>
        </div>
        <div className="max-w-sm">
          <p className="text-[15.5px] leading-relaxed text-(--explorer-muted)">
            Pay once for the year. No auto-renewal, and a GST invoice with every payment.
          </p>
          <ExplorerTextLink to="/employers/pricing" className="mt-3 min-h-11 text-[14px]">
            See full pricing details
          </ExplorerTextLink>
        </div>
      </FadeInView>

      <div className="mt-12">
        <EmployerPlanCards />
      </div>
    </section>
  )
}
