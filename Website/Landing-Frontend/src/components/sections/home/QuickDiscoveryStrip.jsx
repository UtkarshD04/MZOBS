import { ArrowUpRight } from 'lucide-react'
import Reveal from '../../ui/Reveal'
import { StaggerGroup, StaggerItem } from '../../ui/Stagger'
import { QUICK_DISCOVERY_DATA } from '../../../lib/content'

// `onSelect` filters the Latest jobs section further down this same page
// (see Home.jsx) instead of sending the visitor off to the dashboard app.
export default function QuickDiscoveryStrip({ onSelect }) {
  return (
    <section className="bg-linear-to-br from-(--jobs-blue-tint) to-(--jobs-teal-tint) pt-6 pb-16 md:pt-7 md:pb-20 px-6 md:px-10">
      <Reveal direction="up" duration={0.6} className="max-w-7xl mx-auto">
        <StaggerGroup className="flex flex-wrap justify-center gap-2.5">
          {QUICK_DISCOVERY_DATA.map((item) => (
            <StaggerItem key={item.label}>
              <button
                type="button"
                onClick={() => onSelect?.({ q: '', location: '', experience: '', ...item.params })}
                className="group inline-flex items-center gap-1.5 h-10 px-4 rounded-full border border-(--jobs-border) bg-white text-[13.5px] font-semibold text-(--jobs-navy) hover:border-(--jobs-teal-dark) hover:bg-(--jobs-teal-tint) transition-colors"
              >
                {item.label}
                <ArrowUpRight size={13} className="text-(--jobs-ink-soft) group-hover:text-(--jobs-teal-dark) transition-colors" aria-hidden="true" />
              </button>
            </StaggerItem>
          ))}
        </StaggerGroup>
      </Reveal>
    </section>
  )
}
