import { Link } from 'react-router-dom'
import EmployerPlanCards from './EmployerPlanCards'

export default function EmployerPricingTeaser() {
  return (
    <section id="pricing" className="bg-(--explorer-bg) py-20 md:py-28 px-6 md:px-12">
      <div className="max-w-lg mx-auto text-center">
        <span className="text-[11px] font-bold uppercase tracking-[0.16em] text-(--explorer-blue)">Simple, transparent pricing</span>
        <h2 className="mt-3 font-sans text-3xl sm:text-4xl font-bold text-(--explorer-navy) tracking-tight">Pick the plan that fits.</h2>
      </div>

      <div className="mt-10">
        <EmployerPlanCards />
      </div>

      <p className="mt-8 text-center text-[12px] text-(--explorer-muted)">
        <Link to="/employers/pricing" className="font-bold text-(--explorer-blue) hover:text-(--explorer-blue-hover)">
          See full pricing details
        </Link>
      </p>
    </section>
  )
}
