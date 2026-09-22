import { ArrowRight, CheckCircle2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import Reveal from '../../ui/Reveal'
import { StaggerGroup, StaggerItem } from '../../ui/Stagger'
import { EMPLOYEE_PRICING_DATA } from '../../../lib/content'

export default function EmployeePricingSection() {
  const d = EMPLOYEE_PRICING_DATA
  return (
    <section id="pricing" className="bg-(--jobs-bg-subtle) py-16 md:py-24 px-6 md:px-12">
      <div className="max-w-5xl mx-auto">
        <Reveal direction="up" duration={0.9} scale={0.94} blur className="max-w-2xl mx-auto text-center mb-10">
          <span className="inline-block text-[11px] font-bold tracking-[0.14em] uppercase text-(--jobs-teal-dark) mb-3">{d.badge}</span>
          <h2 className="text-3xl sm:text-4xl md:text-[42px] font-black text-(--jobs-navy) tracking-tight leading-tight">
            {d.titlePrefix}
            <span className="text-(--jobs-teal-dark)">{d.titleHighlight}</span>
            {d.titleSuffix}
          </h2>
          <p className="mt-4 text-[15px] sm:text-base text-(--jobs-ink-soft) leading-relaxed font-medium">{d.desc}</p>
        </Reveal>

        <Reveal direction="up" delay={0.1} scale={0.96} className="rounded-[32px] border border-(--jobs-border) bg-white shadow-xl overflow-hidden">
          <div className="grid md:grid-cols-5">
            <div className="md:col-span-2 bg-gradient-to-br from-(--jobs-navy-deep) to-(--jobs-navy) p-8 sm:p-10 flex flex-col justify-center text-white">
              <div className="text-5xl sm:text-6xl font-black tracking-tight">{d.price}</div>
              <div className="text-sm text-white/70 mt-2 font-medium">{d.priceNote}</div>
              <Link
                to={d.ctaHref}
                className="mt-8 inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-(--jobs-teal) text-(--jobs-navy-deep) text-sm font-bold hover:bg-white transition-colors w-fit"
              >
                {d.ctaText} <ArrowRight size={16} />
              </Link>
            </div>

            <div className="md:col-span-3 p-8 sm:p-10">
              <StaggerGroup className="space-y-4">
                {d.perks.map((perk) => (
                  <StaggerItem key={perk} className="flex items-start gap-3">
                    <CheckCircle2 size={20} className="text-(--jobs-teal-dark) shrink-0 mt-0.5" />
                    <span className="text-[14px] sm:text-[15px] text-(--jobs-navy) font-medium leading-relaxed">{perk}</span>
                  </StaggerItem>
                ))}
              </StaggerGroup>
              <p className="mt-6 text-[13px] text-(--jobs-ink-soft) leading-relaxed border-t border-(--jobs-border) pt-5">
                {d.reassurance}
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
