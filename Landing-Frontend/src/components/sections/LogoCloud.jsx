import SectionBadge from '../ui/SectionBadge'
import Reveal from '../ui/Reveal'
import { StaggerGroup, StaggerItem } from '../ui/Stagger'
import { TRUSTED_LOGOS_DATA } from '../../lib/content'

function LogoSvg({ variant }) {
  switch (variant) {
    case 1:
      return (
        <div className="flex items-center gap-2 font-bold text-slate-800 text-sm tracking-tight">
          <div className="w-5 h-5 rounded-md bg-blue-900 flex items-center justify-center text-white text-[10px]">S</div>
          <span>Logoipsum</span>
        </div>
      )
    case 2:
      return (
        <div className="flex items-center gap-2 font-semibold text-slate-800 text-sm">
          <div className="w-5 h-5 rounded-full border-2 border-blue-900 flex items-center justify-center text-[9px] font-bold text-blue-900">+</div>
          <span>logo <span className="font-bold">ipsum</span></span>
        </div>
      )
    case 3:
      return (
        <div className="flex items-center gap-2 font-black text-slate-900 text-xs tracking-wider uppercase">
          <span className="bg-slate-900 text-white px-1.5 py-0.5 rounded text-[9px]">LOG</span>
          <span>IPSUM</span>
        </div>
      )
    case 4:
      return (
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-full bg-blue-950" />
          <span className="font-bold text-slate-900 text-sm">logoipsum</span>
        </div>
      )
    case 5:
      return (
        <div className="font-serif font-bold text-slate-900 text-sm tracking-widest uppercase">
          LOGOIPSUM
        </div>
      )
    case 6:
      return (
        <div className="flex items-center gap-2 font-bold text-slate-800 text-sm">
          <div className="w-4 h-4 rotate-45 border-2 border-blue-900 bg-blue-100" />
          <span>logoipsum</span>
        </div>
      )
    case 7:
      return (
        <div className="flex items-center gap-2 text-slate-900 text-sm font-medium">
          <div className="grid grid-cols-2 gap-0.5 w-4 h-4">
            <div className="bg-blue-900 rounded-xs" />
            <div className="bg-blue-600 rounded-xs" />
            <div className="bg-blue-400 rounded-xs" />
            <div className="bg-blue-900 rounded-xs" />
          </div>
          <span className="font-bold">logoipsum</span>
        </div>
      )
    case 8:
    default:
      return (
        <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
          <div className="w-5 h-5 rounded-full border-2 border-blue-900 flex items-center justify-center">
            <div className="w-2 h-2 rounded-full bg-blue-900" />
          </div>
          <span>Logoipsum</span>
        </div>
      )
  }
}

export default function LogoCloud({
  eyebrow,
  title = TRUSTED_LOGOS_DATA.title,
  logos = TRUSTED_LOGOS_DATA.logos
}) {
  return (
    <section className="bg-[#EEF3F8] py-20 px-6 md:px-12 border-t border-slate-200/50">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Section Header */}
        <Reveal direction="up" className="text-center">
          {eyebrow && <SectionBadge label={eyebrow} />}
          <h2 className="text-3xl sm:text-4xl font-serif font-normal text-[#0B1220] tracking-tight">
            {title}
          </h2>
        </Reveal>

        {/* Logo Cards Grid */}
        <StaggerGroup className="grid grid-cols-2 sm:grid-cols-4 gap-5">
          {logos.map((logo, i) => {
            const variantNum = typeof logo === 'object' && logo.variant ? logo.variant : (i % 8) + 1
            const displayName = typeof logo === 'string' ? logo : logo.name

            return (
              <StaggerItem
                key={displayName + i}
                className="bg-white rounded-2xl p-6 border border-slate-200/60 shadow-sm hover:shadow-md transition-all duration-300 flex items-center justify-center min-h-[90px] group"
              >
                <div className="opacity-75 group-hover:opacity-100 transition-opacity">
                  <LogoSvg variant={variantNum} />
                </div>
              </StaggerItem>
            )
          })}
        </StaggerGroup>
      </div>
    </section>
  )
}
