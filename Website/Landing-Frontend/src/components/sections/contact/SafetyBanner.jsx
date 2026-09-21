import { ShieldCheck, ArrowRight } from 'lucide-react'
import Reveal from '../../ui/Reveal'

// A calm, compact reminder — not a warning banner. Soft mint surface, one
// blue CTA, no red/orange alarm colors anywhere.
export default function SafetyBanner({ onLearnMore }) {
  return (
    <Reveal direction="up" duration={0.5}>
      <div className="flex flex-col sm:flex-row sm:items-center gap-5 sm:gap-7 rounded-2xl bg-(--explorer-teal-surface) px-6 sm:px-8 py-6 sm:py-7">
        <span className="shrink-0 flex items-center justify-center w-12 h-12 rounded-full bg-white text-(--explorer-teal)" aria-hidden="true">
          <ShieldCheck size={22} strokeWidth={1.8} />
        </span>
        <div className="flex-1 min-w-0">
          <h3 className="text-[13px] font-black uppercase tracking-wide text-(--explorer-navy)">Your safety matters</h3>
          <p className="mt-1 text-[14px] text-(--explorer-navy)/75 font-medium leading-relaxed max-w-2xl">
            Never share passwords, OTPs, banking PINs or other sensitive financial information with anyone claiming to represent MZOBS.
          </p>
        </div>
        <button
          type="button"
          onClick={onLearnMore}
          className="group shrink-0 inline-flex items-center gap-1.5 text-[13px] font-bold uppercase tracking-wide text-(--explorer-blue) hover:text-(--explorer-blue-hover) transition-colors duration-150"
        >
          Learn about safety
          <ArrowRight size={14} className="motion-safe:transition-transform motion-safe:duration-200 group-hover:translate-x-1" aria-hidden="true" />
        </button>
      </div>
    </Reveal>
  )
}
