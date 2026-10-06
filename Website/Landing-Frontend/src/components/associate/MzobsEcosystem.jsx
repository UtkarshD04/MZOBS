import { Briefcase, Building2, Handshake, MapPin, Sparkles, Users } from 'lucide-react'
import { Container, Reveal } from '../mz/primitives'

// 6 points evenly spaced on a hexagon around the central Mzobs node —
// purely a conceptual diagram of the ecosystem, not a literal map.
const NODES = [
  { label: 'Candidates', icon: Users, x: 200, y: 50 },
  { label: 'Employers', icon: Building2, x: 330, y: 125 },
  { label: 'Jobs', icon: Briefcase, x: 330, y: 275 },
  { label: 'Cities', icon: MapPin, x: 200, y: 350 },
  { label: 'Placement Partners', icon: Handshake, x: 70, y: 275 },
  { label: 'Opportunities', icon: Sparkles, x: 70, y: 125 },
]

export default function MzobsEcosystem() {
  return (
    <section className="relative overflow-hidden bg-[#F8FAFC] py-16 lg:py-24">
      <Container>
        <Reveal className="mx-auto max-w-xl text-center">
          <h2 className="text-[28px] font-extrabold tracking-[-0.02em] text-[#101828] sm:text-[36px]">Your network. Our ecosystem.</h2>
          <p className="mt-3 text-[15px] leading-relaxed text-[#475467]">
            As an associate, your candidates sit at the center of a connected network of employers, cities and opportunities.
          </p>
        </Reveal>

        <Reveal delay={0.1} className="relative mx-auto mt-14 aspect-square w-full max-w-[460px]">
          <svg viewBox="0 0 400 400" className="absolute inset-0 h-full w-full" aria-hidden="true">
            {NODES.map((node) => (
              <line key={node.label} className="assoc-line" x1="200" y1="200" x2={node.x} y2={node.y} stroke="#4F46E5" strokeWidth="1.4" opacity="0.3" />
            ))}
          </svg>

          <div className="assoc-node-glow absolute left-1/2 top-1/2 h-28 w-28 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#2563EB]/25 blur-xl" aria-hidden="true" />
          <div className="absolute left-1/2 top-1/2 flex h-[76px] w-[76px] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-gradient-to-br from-[#2563EB] to-[#4F46E5] text-[13px] font-extrabold text-white shadow-[0_18px_40px_-12px_rgba(37,99,235,0.5)]">
            Mzobs
          </div>

          {NODES.map(({ label, icon: Icon, x, y }, i) => (
            <div
              key={label}
              className={`absolute flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-1.5 ${i % 2 === 0 ? 'assoc-floating' : 'assoc-floating-slow'}`}
              style={{ left: `${(x / 400) * 100}%`, top: `${(y / 400) * 100}%`, animationDelay: `${i * 0.25}s` }}
            >
              <span className="assoc-glass flex h-11 w-11 items-center justify-center rounded-full text-[#2563EB] shadow-[0_12px_26px_-10px_rgba(16,24,40,0.2)]">
                <Icon size={18} aria-hidden="true" />
              </span>
              <span className="whitespace-nowrap rounded-full bg-white px-2 py-0.5 text-[11px] font-bold text-[#101828] shadow-sm">{label}</span>
            </div>
          ))}
        </Reveal>
      </Container>
    </section>
  )
}
