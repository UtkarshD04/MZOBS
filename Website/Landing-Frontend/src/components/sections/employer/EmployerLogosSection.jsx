import Reveal from '../../ui/Reveal'
import SplitText from '../../ui/SplitText'
import FloatingElement from '../../ui/FloatingElement'
import { TRUSTED_LOGOS_DATA } from '../../../lib/content'

// Per-badge size/offset/animation variety so the cluster reads as scattered
// and organic rather than a grid — position comes from flex layout + a
// vertical nudge, not fixed coordinates, so it stays responsive.
const VARIANTS = [
  { size: 144, offset: -10, duration: 7, delay: 0 },
  { size: 130, offset: 28, duration: 8.5, delay: 0.6 },
  { size: 156, offset: -20, duration: 6.5, delay: 1.1 },
  { size: 136, offset: 32, duration: 9, delay: 0.3 },
  { size: 148, offset: -14, duration: 7.5, delay: 1.4 },
  { size: 132, offset: 30, duration: 8, delay: 0.8 },
  { size: 142, offset: -16, duration: 7, delay: 0.2 },
  { size: 134, offset: 28, duration: 9.5, delay: 1.0 },
]

export default function EmployerLogosSection() {
  return (
    <section className="bg-(--careers-tint-sage) py-12 md:py-16 px-6 md:px-12 overflow-hidden">
      <div className="max-w-7xl mx-auto space-y-10">
        <Reveal direction="up" duration={0.9} scale={0.94} blur className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl md:text-[42px] font-black text-black tracking-tight leading-tight">
            <SplitText text={TRUSTED_LOGOS_DATA.title} className="justify-center" />
          </h2>
        </Reveal>

        <div className="max-w-4xl mx-auto flex flex-wrap items-start justify-center gap-x-8 gap-y-12 sm:gap-x-10 py-4">
          {TRUSTED_LOGOS_DATA.logos.map((logo, i) => {
            const v = VARIANTS[i % VARIANTS.length]
            return (
              <FloatingElement
                key={logo.name + i}
                duration={v.duration}
                delay={v.delay}
                distance={10}
                rotate={false}
                style={{ marginTop: v.offset }}
              >
                <div className="group relative">
                  <div className="absolute -top-9 left-1/2 -translate-x-1/2 whitespace-nowrap px-2.5 py-1 rounded-full bg-[var(--careers-accent)] text-white text-[11px] font-bold opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100 transition-all duration-200 pointer-events-none">
                    {logo.name}
                    <span className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-[var(--careers-accent)]" />
                  </div>

                  <div
                    style={{ width: v.size, height: v.size }}
                    className="rounded-full bg-white border border-[#e0e0e0] shadow-sm flex items-center justify-center p-4 transition-all duration-300 hover:shadow-xl hover:scale-110 hover:border-(--careers-accent)/30 cursor-default"
                  >
                    <img src={logo.logo} alt={logo.name} className="max-w-full max-h-full object-contain" />
                  </div>
                </div>
              </FloatingElement>
            )
          })}
        </div>
      </div>
    </section>
  )
}
