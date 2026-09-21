import { FileText, MessageSquare, Compass, ArrowUpRight } from 'lucide-react'
import Reveal from '../../ui/Reveal'

const ICONS = { 'resume-profile': FileText, 'interview-prep': MessageSquare, 'career-guidance': Compass }

// Editorial, not a third card grid — a single wide row per resource, an
// icon mark standing in for imagery (no stock photography in this project
// to draw from), title and description running alongside it, and the whole
// row sliding a few pixels on hover instead of lifting like a card would.
export default function ResourceSection({ resources, onSelect }) {
  return (
    <div className="divide-y divide-(--explorer-border) border-y border-(--explorer-border)">
      {resources.map((item, i) => {
        const Icon = ICONS[item.id] ?? FileText
        return (
          <Reveal key={item.id} direction="up" duration={0.45} delay={i * 0.06}>
            <button
              type="button"
              onClick={() => onSelect(item)}
              className="group w-full flex items-center gap-5 sm:gap-8 py-6 sm:py-7 text-left motion-safe:transition-transform motion-safe:duration-300 motion-safe:hover:translate-x-2"
            >
              <span className="shrink-0 flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-(--explorer-blue-surface) text-(--explorer-blue) motion-safe:transition-colors motion-safe:duration-300 group-hover:bg-(--explorer-navy) group-hover:text-white">
                <Icon size={24} strokeWidth={1.7} aria-hidden="true" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-[17px] sm:text-[19px] font-black text-(--explorer-navy) tracking-tight">{item.title}</span>
                <span className="mt-1 block text-[13.5px] sm:text-[14px] text-(--explorer-muted) font-medium leading-relaxed">{item.description}</span>
              </span>
              <ArrowUpRight
                size={20}
                className="shrink-0 text-(--explorer-navy)/30 motion-safe:transition-[transform,color] motion-safe:duration-300 group-hover:text-(--explorer-blue) group-hover:translate-x-1 group-hover:-translate-y-1"
                aria-hidden="true"
              />
            </button>
          </Reveal>
        )
      })}
    </div>
  )
}
