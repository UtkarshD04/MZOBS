import Reveal from '../../ui/Reveal'
import { StaggerGroup, StaggerItem } from '../../ui/Stagger'
import { QUICK_DISCOVERY_DATA } from '../../../lib/content'

// `onSelect` filters the Latest jobs section further down this same page
// (see Home.jsx) instead of sending the visitor off to the dashboard app.
// Text-led shortcuts, not floating pills — each is just a small, useful
// link with a muted tinted backdrop, so this reads as "quick filters" not a
// second row of marketing badges competing with the search bar above it.
export default function QuickDiscoveryStrip({ onSelect }) {
  return (
    <section className="hero-afterglow pt-6 pb-10 px-6 md:px-10">
      <Reveal direction="up" duration={0.5} className="max-w-7xl mx-auto">
        <StaggerGroup className="flex flex-wrap items-center justify-center gap-x-1 gap-y-2">
          {QUICK_DISCOVERY_DATA.map((item, i) => (
            <StaggerItem key={item.label} className="flex items-center">
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
