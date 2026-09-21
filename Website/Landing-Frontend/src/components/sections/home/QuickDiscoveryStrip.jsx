import { useRef } from 'react'
import Reveal from '../../ui/Reveal'
import { StaggerGroup, StaggerItem } from '../../ui/Stagger'
import { QUICK_DISCOVERY_DATA } from '../../../lib/content'
import { useAutoRail } from '../../../lib/useAutoRail'

// `onSelect` filters the Latest jobs section further down this same page
// (see Home.jsx) instead of sending the visitor off to the dashboard app.
// Text-led shortcuts, not floating pills — each is just a small, useful
// link with a muted tinted backdrop, so this reads as "quick filters" not a
// second row of marketing badges competing with the search bar above it.
export default function QuickDiscoveryStrip({ onSelect }) {
  const sectionRef = useRef(null)
  useAutoRail(sectionRef)
  return (
    <section ref={sectionRef} className="hero-afterglow pt-5 pb-6 md:pt-6 md:pb-10 px-6 md:px-10">
      <Reveal direction="up" duration={0.5} className="max-w-7xl mx-auto">
        <StaggerGroup data-auto-rail="1100" className="flex flex-nowrap items-center gap-x-1 overflow-x-auto -mx-6 px-6 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:mx-0 sm:flex-wrap sm:justify-center sm:gap-y-2 sm:overflow-visible sm:px-0 sm:pb-0">
          {QUICK_DISCOVERY_DATA.map((item, i) => (
            <StaggerItem key={item.label} className="flex shrink-0 items-center whitespace-nowrap">
              <button
                type="button"
                onClick={() => onSelect?.({ q: '', location: '', experience: '', ...item.params })}
                className="h-8 px-3 rounded-md text-[13px] font-semibold text-(--explorer-navy) hover:bg-(--explorer-teal-surface) hover:text-(--explorer-teal) transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--explorer-teal)"
              >
                {item.label}
              </button>
              {i < QUICK_DISCOVERY_DATA.length - 1 && <span className="text-(--explorer-border)" aria-hidden="true">·</span>}
            </StaggerItem>
          ))}
        </StaggerGroup>
      </Reveal>
    </section>
  )
}
