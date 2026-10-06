import { Building2, Network, MapPin, ShieldCheck } from 'lucide-react'
import { Container, Reveal } from '../mz/primitives'

// Qualitative, not numeric — Mzobs doesn't publish a live associate-network
// counter, so this strip states real benefits rather than inventing stats.
const ITEMS = [
  { icon: Network, title: 'Growing Network', desc: 'More placement partners joining Mzobs' },
  { icon: ShieldCheck, title: 'Verified Opportunities', desc: 'Every employer listing is reviewed' },
  { icon: MapPin, title: 'Multiple Cities', desc: 'From metros to emerging hiring hubs' },
  { icon: Building2, title: 'Employer Connections', desc: 'Real companies hiring through Mzobs' },
]

export default function NetworkStats() {
  return (
    <div className="relative z-10 -mt-10 px-4 sm:-mt-12 sm:px-6 lg:-mt-14">
      <Container className="px-0">
        <Reveal className="assoc-glass grid grid-cols-2 gap-4 rounded-3xl p-5 shadow-[0_30px_60px_-24px_rgba(16,24,40,0.22)] sm:p-7 lg:grid-cols-4 lg:gap-6">
          {ITEMS.map(({ icon: Icon, title, desc }, i) => (
            <div key={title} className={`flex items-start gap-3 ${i % 2 === 1 ? 'border-l border-[#101828]/[0.06] pl-4' : ''} ${i >= 2 ? 'lg:border-l lg:pl-4' : ''}`}>
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[11px] bg-gradient-to-br from-[#0b7a6d] to-[#0b7a6d] text-white">
                <Icon size={18} aria-hidden="true" />
              </span>
              <span className="min-w-0">
                <span className="block text-[14.5px] font-bold leading-tight text-[#101828]">{title}</span>
                <span className="mt-0.5 block text-[12.5px] leading-snug text-[#475467]">{desc}</span>
              </span>
            </div>
          ))}
        </Reveal>
      </Container>
    </div>
  )
}
