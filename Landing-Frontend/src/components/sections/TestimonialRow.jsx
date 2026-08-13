import { Quote } from 'lucide-react'
import Card from '../ui/Card'
import Avatar from '../ui/Avatar'
import SectionHeading from './SectionHeading'
import { StaggerGroup, StaggerItem } from '../ui/Stagger'
import { cn } from '../../lib/utils'

const cols = {
  1: 'sm:grid-cols-1 max-w-md mx-auto',
  2: 'sm:grid-cols-2 max-w-2xl mx-auto',
  3: 'sm:grid-cols-3',
}

export default function TestimonialRow({ eyebrow = 'TESTIMONIALS', title = 'What Our Community Says', testimonials = [] }) {
  return (
    <section className="max-w-6xl mx-auto px-6 py-16 sm:py-20">
      <SectionHeading eyebrow={eyebrow} title={title} className="mb-12" />

      <StaggerGroup className={cn('grid gap-5', cols[testimonials.length] || 'sm:grid-cols-3')}>
        {testimonials.map((t, idx) => {
          const initials = t.initials || (t.name ? t.name.split(' ').map(n => n[0]).join('') : 'MZ')
          const roleText = t.role || t.title || ''

          return (
            <StaggerItem key={t.name || idx}>
              <Card pad hover className="flex flex-col h-full">
                <Quote size={20} className="text-amber-500 mb-3" />
                <p className="text-[13.5px] text-slate-800 leading-relaxed flex-1">&ldquo;{t.quote}&rdquo;</p>
                <div className="flex items-center gap-2.5 mt-5 pt-5 border-t border-slate-200">
                  <Avatar initials={initials} gold />
                  <div className="text-left">
                    <div className="text-[13px] font-semibold text-slate-900">{t.name}</div>
                    <div className="text-[11.5px] text-slate-500">{roleText}</div>
                  </div>
                </div>
              </Card>
            </StaggerItem>
          )
        })}
      </StaggerGroup>
    </section>
  )
}

