import Reveal from '../../ui/Reveal'
import SectionLabel from '../../ui/SectionLabel'
import SplitText from '../../ui/SplitText'
import FloatingElement from '../../ui/FloatingElement'
import { TRUSTED_LOGOS_DATA } from '../../../lib/content'

function LogoMark({ variant }) {
  switch (variant) {
    case 1:
      return (
        <div className="flex items-center gap-1.5 font-black text-black text-[13px] tracking-tight">
          <div className="w-5 h-5 rounded-md bg-black flex items-center justify-center text-white text-[10px]">S</div>
          <span>Logoipsum</span>
        </div>
      )
    case 2:
      return (
        <div className="flex items-center gap-1.5 font-bold text-black text-[12px]">
          <div className="w-5 h-5 rounded-full border-2 border-black flex items-center justify-center text-[9px] font-bold text-black">+</div>
          <span>logo <span className="font-black">ipsum</span></span>
        </div>
      )
    case 3:
      return (
        <div className="flex items-center gap-1.5 font-black text-black text-[11px] tracking-wider uppercase">
          <span className="bg-black text-white px-1.5 py-0.5 rounded text-[9px]">LOG</span>
          <span>IPSUM</span>
        </div>
      )
    case 4:
      return (
        <div className="flex items-center gap-1.5">
          <div className="w-5 h-5 rounded-full bg-black" />
          <span className="font-black text-black text-[12px]">logoipsum</span>
        </div>
      )
    case 5:
      return <div className="font-black text-black text-[12px] tracking-widest uppercase">LOGOIPSUM</div>
    case 6:
      return (
        <div className="flex items-center gap-1.5 font-black text-black text-[12px]">
          <div className="w-4 h-4 rotate-45 border-2 border-black bg-[#F5F5F5]" />
          <span>logoipsum</span>
        </div>
      )
    case 7:
      return (
        <div className="flex items-center gap-1.5 text-black text-[12px] font-bold">
          <div className="grid grid-cols-2 gap-0.5 w-4 h-4">
            <div className="bg-black rounded-xs" />
            <div className="bg-[#595959] rounded-xs" />
            <div className="bg-[#9E9E9E] rounded-xs" />
            <div className="bg-black rounded-xs" />
          </div>
          <span>logoipsum</span>
        </div>
      )
    case 8:
    default:
      return (
        <div className="flex items-center gap-1.5 font-black text-black text-[12px]">
          <div className="w-5 h-5 rounded-full border-2 border-black flex items-center justify-center">
            <div className="w-2 h-2 rounded-full bg-black" />
          </div>
          <span>Logoipsum</span>
        </div>
      )
  }
}

// Per-badge size/offset/animation variety so the cluster reads as scattered
// and organic rather than a grid — position comes from flex layout + a
// vertical nudge, not fixed coordinates, so it stays responsive.
const VARIANTS = [
  { size: 108, offset: -14, duration: 7, delay: 0 },
  { size: 88, offset: 38, duration: 8.5, delay: 0.6 },
  { size: 124, offset: -28, duration: 6.5, delay: 1.1 },
  { size: 96, offset: 46, duration: 9, delay: 0.3 },
  { size: 112, offset: -18, duration: 7.5, delay: 1.4 },
  { size: 92, offset: 42, duration: 8, delay: 0.8 },
  { size: 104, offset: -22, duration: 7, delay: 0.2 },
  { size: 94, offset: 40, duration: 9.5, delay: 1.0 },
]

export default function EmployerLogosSection() {
  return (
    <section className="bg-[#F5F5F5] py-16 md:py-24 px-6 md:px-12 overflow-hidden">
      <div className="max-w-7xl mx-auto space-y-14">
        <Reveal direction="up" duration={0.9} scale={0.94} blur className="max-w-2xl mx-auto text-center">
          <SectionLabel className="mx-auto">{TRUSTED_LOGOS_DATA.badge}</SectionLabel>
          <h2 className="text-3xl sm:text-4xl md:text-[42px] font-black text-black tracking-tight leading-tight">
            <SplitText text={TRUSTED_LOGOS_DATA.title} className="justify-center" />
          </h2>
        </Reveal>

        <div className="max-w-3xl mx-auto flex flex-wrap items-start justify-center gap-x-8 gap-y-16 sm:gap-x-10 py-6">
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
                  <div className="absolute -top-9 left-1/2 -translate-x-1/2 whitespace-nowrap px-2.5 py-1 rounded-full bg-[#333333] text-white text-[11px] font-bold opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100 transition-all duration-200 pointer-events-none">
                    {logo.name}
                    <span className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-[#333333]" />
                  </div>

                  <div
                    style={{ width: v.size, height: v.size }}
                    className="rounded-full bg-white border border-[#e0e0e0] shadow-sm flex items-center justify-center px-3 transition-all duration-300 hover:shadow-xl hover:scale-110 hover:border-[#333333]/30 cursor-default"
                  >
                    <LogoMark variant={logo.variant} />
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
