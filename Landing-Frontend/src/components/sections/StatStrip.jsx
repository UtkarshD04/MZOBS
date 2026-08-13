import CountUp from '../ui/CountUp'
import { StaggerGroup, StaggerItem } from '../ui/Stagger'
import { cn } from '../../lib/utils'

const cols = {
  2: 'grid-cols-2',
  3: 'grid-cols-2 sm:grid-cols-3',
  4: 'grid-cols-2 sm:grid-cols-4',
}

export default function StatStrip({ stats, tone = 'light' }) {
  return (
    <section className={cn('border-y', tone === 'dark' ? 'bg-navy-950 border-white/10' : 'bg-bg-secondary border-border')}>
      <div className="max-w-6xl mx-auto px-6 py-12">
        <StaggerGroup className={cn('grid gap-8', cols[stats.length] || 'grid-cols-2 sm:grid-cols-4')}>
          {stats.map((s) => (
            <StaggerItem key={s.label} className="text-center">
              <b className={cn('text-[28px] sm:text-[32px] font-bold block tracking-tight', tone === 'dark' ? 'text-white' : 'text-ink')}>
                {s.display ? s.display : <CountUp value={s.value} prefix={s.prefix} suffix={s.suffix} duration={1200} />}
              </b>
              <span className={cn('text-[13px] mt-1 block', tone === 'dark' ? 'text-white/60' : 'text-ink-secondary')}>{s.label}</span>
            </StaggerItem>
          ))}
        </StaggerGroup>
      </div>
    </section>
  )
}

