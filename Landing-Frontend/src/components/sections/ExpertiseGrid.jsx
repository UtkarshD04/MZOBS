import { ArrowRight } from 'lucide-react'
import Card from '../ui/Card'
import Button, { goldSolidClass } from '../ui/Button'
import Photo from './Photo'
import SectionHeading from './SectionHeading'
import { cn } from '../../lib/utils'

export default function ExpertiseGrid({ eyebrow, title, subtitle, items, photoIcon, ctaLabel, ctaHref, reverse }) {
  return (
    <section className="max-w-6xl mx-auto px-6 py-16 sm:py-20">
      <div className="grid lg:grid-cols-2 gap-10 lg:gap-14 items-center">
        <div className={cn(reverse && 'lg:order-2')}>
          <SectionHeading eyebrow={eyebrow} title={title} subtitle={subtitle} align="left" maxWidth="" />

          <div className="grid sm:grid-cols-2 gap-4 mt-8">
            {items.map(({ icon: Icon, title: itemTitle, desc }) => (
              <Card key={itemTitle} hover pad>
                <div className="w-10 h-10 rounded-lg bg-navy-tint text-navy flex items-center justify-center mb-3">
                  <Icon size={18} />
                </div>
                <h3 className="text-[14.5px] font-semibold">{itemTitle}</h3>
                <p className="text-[13px] text-ink-secondary mt-1.5 leading-relaxed">{desc}</p>
              </Card>
            ))}
          </div>

          {ctaLabel && (
            <Button to={ctaHref} variant="primary" size="lg" pill className={cn(goldSolidClass, 'mt-7')}>
              {ctaLabel} <ArrowRight size={16} />
            </Button>
          )}
        </div>

        <div className={cn(reverse && 'lg:order-1')}>
          <Photo icon={photoIcon} tone="navy" ratio="portrait" rounded="xl" className="shadow-lg" />
        </div>
      </div>
    </section>
  )
}
