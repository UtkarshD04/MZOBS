import Reveal from '../../ui/Reveal'
import SectionLabel from '../../ui/SectionLabel'
import SplitText from '../../ui/SplitText'
import TiltCard from '../../ui/TiltCard'
import { StaggerGroup, StaggerItem } from '../../ui/Stagger'
import { TRUSTED_LOGOS_DATA } from '../../../lib/content'

function LogoMark({ variant }) {
  switch (variant) {
    case 1:
      return (
        <div className="flex items-center gap-2 font-black text-black text-sm tracking-tight">
          <div className="w-5 h-5 rounded-md bg-black flex items-center justify-center text-white text-[10px]">S</div>
          <span>Logoipsum</span>
        </div>
      )
    case 2:
      return (
        <div className="flex items-center gap-2 font-bold text-black text-sm">
          <div className="w-5 h-5 rounded-full border-2 border-black flex items-center justify-center text-[9px] font-bold text-black">+</div>
          <span>logo <span className="font-black">ipsum</span></span>
        </div>
      )
    case 3:
      return (
        <div className="flex items-center gap-2 font-black text-black text-xs tracking-wider uppercase">
          <span className="bg-black text-white px-1.5 py-0.5 rounded text-[9px]">LOG</span>
          <span>IPSUM</span>
        </div>
      )
    case 4:
      return (
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-full bg-black" />
          <span className="font-black text-black text-sm">logoipsum</span>
        </div>
      )
    case 5:
      return <div className="font-black text-black text-sm tracking-widest uppercase">LOGOIPSUM</div>
    case 6:
      return (
        <div className="flex items-center gap-2 font-black text-black text-sm">
          <div className="w-4 h-4 rotate-45 border-2 border-black bg-[#F5F5F5]" />
          <span>logoipsum</span>
        </div>
      )
    case 7:
      return (
        <div className="flex items-center gap-2 text-black text-sm font-bold">
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
        <div className="flex items-center gap-2 font-black text-black text-sm">
          <div className="w-5 h-5 rounded-full border-2 border-black flex items-center justify-center">
            <div className="w-2 h-2 rounded-full bg-black" />
          </div>
          <span>Logoipsum</span>
        </div>
      )
  }
}

export default function EmployerLogosSection() {
  return (
    <section className="bg-[#F5F5F5] py-16 md:py-24 px-6 md:px-12">
      <div className="max-w-7xl mx-auto space-y-10">
        <Reveal direction="up" duration={0.9} scale={0.94} blur className="max-w-2xl mx-auto text-center">
          <SectionLabel className="mx-auto">{TRUSTED_LOGOS_DATA.badge}</SectionLabel>
          <h2 className="text-3xl sm:text-4xl md:text-[42px] font-black text-black tracking-tight leading-tight">
            <SplitText text={TRUSTED_LOGOS_DATA.title} className="justify-center" />
          </h2>
        </Reveal>

        <StaggerGroup className="grid grid-cols-2 sm:grid-cols-4 gap-5">
          {TRUSTED_LOGOS_DATA.logos.map((logo, i) => (
            <StaggerItem key={logo.name + i}>
              <TiltCard maxTilt={3} className="bg-white rounded-2xl p-6 border border-[#e0e0e0] shadow-sm hover:shadow-lg flex items-center justify-center min-h-[90px] w-full">
                <div className="opacity-75 group-hover:opacity-100 group-hover:scale-105 transition-all">
                  <LogoMark variant={logo.variant} />
                </div>
              </TiltCard>
            </StaggerItem>
          ))}
        </StaggerGroup>
      </div>
    </section>
  )
}
