import { CheckCircle2 } from 'lucide-react'
import Card from '../ui/Card'
import Button, { goldSolidClass } from '../ui/Button'
import SectionHeading from './SectionHeading'
import Reveal from '../ui/Reveal'
import { StaggerGroup, StaggerItem } from '../ui/Stagger'
import { PRICING_DATA } from '../../lib/content'
import { cn } from '../../lib/utils'

function DonutChart({ segments, size = 180, thickness = 30 }) {
  let cumulative = 0
  const stops = segments
    .map((s) => {
      const start = cumulative
      cumulative += s.percent
      return `${s.color} ${start}% ${cumulative}%`
    })
    .join(', ')

  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <div className="absolute inset-0 rounded-full" style={{ background: `conic-gradient(${stops})` }} />
      <div className="absolute rounded-full bg-surface shadow-inner" style={{ inset: thickness }} />
    </div>
  )
}

function Takeaways({ items }) {
  const Icon = PRICING_DATA.keyTakeawayIcon
  return (
    <Card pad hover className="h-full">
      <div className="flex items-center gap-2 mb-4">
        <span className="w-2 h-2 rounded-full bg-gold-dot shrink-0" />
        <h4 className="text-[14.5px] font-bold text-ink">Key Takeaway</h4>
        {Icon && <Icon size={16} className="text-gold-strong ml-auto" />}
      </div>
      <ul className="space-y-3">
        {items.map((t, i) => (
          <li key={i} className="flex items-start gap-2.5 text-[13px] text-ink-secondary leading-relaxed">
            <span className="w-1.5 h-1.5 rounded-full bg-navy mt-1.5 shrink-0" />
            <span>{t}</span>
          </li>
        ))}
      </ul>
    </Card>
  )
}

import TiltCard from '../ui/TiltCard'

function HowItWorks({ steps }) {
  const images = [
    "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=600&q=85",
    "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=600&q=85",
    "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=85",
    "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=600&q=85"
  ]

  return (
    <StaggerGroup className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {steps.map((s, i) => (
        <StaggerItem key={s.n}>
          <TiltCard className="bg-white rounded-2xl border border-slate-200/60 shadow-sm hover:shadow-xl hover:border-slate-300 flex flex-col overflow-hidden h-full">
            <div className="h-28 w-full overflow-hidden relative bg-slate-100">
              <img
                src={images[i % images.length]}
                alt={s.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 ease-out-premium"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-white via-white/20 to-transparent" />
              <span className="absolute top-3 right-3 text-xs font-bold text-amber-700 bg-amber-50/90 backdrop-blur-xs px-2.5 py-0.5 rounded-full border border-amber-200/80 shadow-xs">
                {s.n}
              </span>
            </div>
            <div className="p-5 flex-1 flex flex-col justify-between">
              <div>
                <h5 className="text-[13.5px] font-bold text-ink group-hover:text-blue-900 transition-colors">{s.title}</h5>
                <p className="text-[12.5px] text-ink-secondary mt-1.5 leading-relaxed">{s.desc}</p>
              </div>
            </div>
          </TiltCard>
        </StaggerItem>
      ))}
    </StaggerGroup>
  )
}

function Tier1Block() {
  const d = PRICING_DATA.tier1
  return (
    <div className="space-y-8">
      <Reveal direction="up" className="text-center max-w-lg mx-auto">
        <span className="inline-block text-[11px] font-bold tracking-[0.14em] uppercase text-gold-strong mb-2">{d.kicker}</span>
        <h3 className="font-heading text-xl sm:text-2xl font-bold text-ink tracking-tight">{d.title}</h3>
        <p className="text-[13.5px] text-ink-secondary mt-1.5">{d.subtitle}</p>
      </Reveal>

      <div className="grid lg:grid-cols-12 gap-6 items-stretch">
        <Reveal direction="left" className="lg:col-span-7">
          <Card pad hover className="h-full">
            <h4 className="text-[13px] font-semibold text-ink mb-6">{d.chartLabel}</h4>
            <div className="flex flex-wrap items-center gap-8">
              <DonutChart segments={d.segments} />
              <div className="flex-1 min-w-[220px] space-y-5">
                {d.segments.map((s, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div
                      className="w-9 h-9 rounded-lg flex items-center justify-center text-white shrink-0"
                      style={{ backgroundColor: s.color }}
                    >
                      <s.icon size={17} />
                    </div>
                    <div>
                      <div className="flex items-baseline gap-2">
                        <h5 className="text-[13.5px] font-semibold text-ink">{s.title}</h5>
                        <span className="text-[15px] font-bold text-ink">{s.percent}%</span>
                      </div>
                      <p className="text-[12px] text-ink-secondary mt-0.5 leading-relaxed">{s.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </Reveal>

        <Reveal direction="right" delay={0.1} className="lg:col-span-5">
          <Takeaways items={d.takeaways} />
        </Reveal>
      </div>

      <HowItWorks steps={d.steps} />
    </div>
  )
}

function StartupBlock() {
  const d = PRICING_DATA.startup
  return (
    <div className="space-y-8">
      <Reveal direction="up" className="text-center max-w-lg mx-auto">
        <span className="inline-block text-[11px] font-bold tracking-[0.14em] uppercase text-gold-strong mb-2">{d.kicker}</span>
        <h3 className="font-heading text-xl sm:text-2xl font-bold text-ink tracking-tight">{d.title}</h3>
        <p className="text-[13.5px] text-ink-secondary mt-1.5">{d.subtitle}</p>
      </Reveal>

      <StaggerGroup className="grid lg:grid-cols-12 gap-6 items-stretch">
        <StaggerItem className="lg:col-span-4">
          <Card pad hover className="h-full flex flex-col">
            <span className="inline-flex self-start px-3 py-1 rounded-full bg-navy text-white text-[10.5px] font-bold tracking-wide uppercase mb-4">
              {d.plan.badge}
            </span>
            <div className="text-3xl font-bold text-ink tracking-tight">{d.plan.price}</div>
            <div className="text-[11.5px] text-ink-tertiary mb-4">{d.plan.priceNote}</div>
            <div className="rounded-lg border border-border bg-bg-secondary px-3.5 py-2.5 text-[13px] font-medium text-ink mb-4">
              {d.plan.includes}
            </div>
            <ul className="space-y-2 mt-auto">
              {d.plan.perks.map((p, i) => (
                <li key={i} className="flex items-center gap-2 text-[12.5px] text-ink-secondary">
                  <CheckCircle2 size={14} className="text-gold-strong shrink-0" />
                  {p}
                </li>
              ))}
            </ul>
          </Card>
        </StaggerItem>

        <StaggerItem className="lg:col-span-4">
          <Card pad hover className="h-full flex flex-col">
            <span className="inline-flex self-start px-3 py-1 rounded-full bg-gold-tint text-gold-strong text-[10.5px] font-bold tracking-wide uppercase mb-4">
              {d.addon.badge}
            </span>
            <p className="text-[12.5px] text-ink-secondary mb-3">{d.addon.kicker}</p>
            <div className="text-3xl font-bold text-ink tracking-tight">{d.addon.price}</div>
            <div className="text-[11.5px] text-ink-tertiary mb-4">{d.addon.priceNote}</div>
            <div className="rounded-lg border border-border bg-bg-secondary px-3.5 py-2.5 text-[13px] font-medium text-ink mb-4">
              Hire <span className="font-bold text-gold-strong">{d.addon.hireCount} more</span> {d.addon.hireLabel}
            </div>
            <ul className="space-y-2 mt-auto">
              {d.addon.perks.map((p, i) => (
                <li key={i} className="flex items-center gap-2 text-[12.5px] text-ink-secondary">
                  <CheckCircle2 size={14} className="text-gold-strong shrink-0" />
                  {p}
                </li>
              ))}
            </ul>
          </Card>
        </StaggerItem>

        <StaggerItem className="lg:col-span-4">
          <Takeaways items={d.takeaways} />
        </StaggerItem>
      </StaggerGroup>

      <Card pad className="grid sm:grid-cols-3 gap-6 text-center">
        {d.stats.map((s, i) => (
          <div key={i}>
            <div className="text-2xl font-bold text-ink tracking-tight">{s.value}</div>
            <div className="text-[12px] text-ink-secondary mt-1">{s.label}</div>
          </div>
        ))}
      </Card>

      <HowItWorks steps={d.steps} />
    </div>
  )
}

export default function PricingSection() {
  return (
    <section id="pricing" className="bg-bg-secondary border-y border-border">
      <div className="max-w-6xl mx-auto px-6 py-16 sm:py-20 space-y-16">
        <SectionHeading
          eyebrow={PRICING_DATA.badge}
          title={
            <>
              {PRICING_DATA.titlePrefix}
              <em className="italic text-gold-strong">{PRICING_DATA.titleItalic}</em>
              {PRICING_DATA.titleSuffix}
            </>
          }
          subtitle={PRICING_DATA.subtitle}
          maxWidth="max-w-2xl"
        />

        <Tier1Block />

        <div className="h-px bg-border" />

        <StartupBlock />

        <div className="text-center pt-2">
          <Button to={PRICING_DATA.ctaHref} variant="primary" size="lg" pill className={cn(goldSolidClass)}>
            {PRICING_DATA.ctaText}
          </Button>
        </div>
      </div>
    </section>
  )
}

