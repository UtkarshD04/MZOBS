import { Quote } from 'lucide-react'
import Card from '../ui/Card'
import Avatar from '../ui/Avatar'
import SectionHeading from './SectionHeading'
import { cn } from '../../lib/utils'

const cols = {
  1: 'sm:grid-cols-1 max-w-md mx-auto',
  2: 'sm:grid-cols-2 max-w-2xl mx-auto',
  3: 'sm:grid-cols-3',
}

export default function TestimonialRow({ eyebrow = 'TESTIMONIALS', title = 'What Our Community Says', testimonials }) {
  return (
    <section className="max-w-6xl mx-auto px-6 py-16 sm:py-20">
      <SectionHeading eyebrow={eyebrow} title={title} className="mb-12" />

      <div className={cn('grid gap-5', cols[testimonials.length] || 'sm:grid-cols-3')}>
        {testimonials.map((t) => (
          <Card key={t.name} pad className="flex flex-col h-full">
            <Quote size={20} className="text-gold-dot mb-3" />
            <p className="text-[13.5px] text-ink leading-relaxed flex-1">&ldquo;{t.quote}&rdquo;</p>
            <div className="flex items-center gap-2.5 mt-5 pt-5 border-t border-border">
              <Avatar initials={t.initials} gold />
              <div className="text-left">
                <div className="text-[13px] font-semibold">{t.name}</div>
                <div className="text-[11.5px] text-ink-tertiary">{t.role}</div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </section>
  )
}
