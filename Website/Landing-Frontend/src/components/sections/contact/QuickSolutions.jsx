import { ArrowRight } from 'lucide-react'
import Reveal from '../../ui/Reveal'

// The "I'm stuck — what do I do right now?" shortcut list. Deliberately a
// tight column of rows (not another card grid) — each one is a single line
// a visitor can scan in under a second, with the actual answer living in
// the FAQ accordion below (onSelect just opens it there).
export default function QuickSolutions({ solutions, onSelect }) {
  return (
    <ul className="border-t border-(--explorer-border)">
      {solutions.map((item, i) => (
        <Reveal key={item.id} direction="up" duration={0.4} delay={i * 0.04}>
          <li className="border-b border-(--explorer-border)">
            <button
              type="button"
              onClick={() => onSelect(item.faqId)}
              className="group w-full flex items-center justify-between gap-4 py-4 sm:py-4.5 px-1 text-left motion-safe:transition-[background-color,transform] motion-safe:duration-200 hover:bg-(--explorer-blue-surface) motion-safe:hover:translate-x-1.5 rounded-md"
            >
              <span className="text-[14.5px] sm:text-[15px] font-bold text-(--explorer-navy)">{item.label}</span>
              <ArrowRight
                size={16}
                className="shrink-0 text-(--explorer-navy)/35 motion-safe:transition-[transform,color] motion-safe:duration-200 group-hover:translate-x-1 group-hover:text-(--explorer-blue)"
                aria-hidden="true"
              />
            </button>
          </li>
        </Reveal>
      ))}
    </ul>
  )
}
