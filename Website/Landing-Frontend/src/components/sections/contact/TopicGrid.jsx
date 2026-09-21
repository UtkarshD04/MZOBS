import { ArrowRight, ArrowUpRight } from 'lucide-react'
import { StaggerGroup, StaggerItem } from '../../ui/Stagger'

// Editorial grid, not a row of identical rounded cards — a bordered
// spreadsheet-like grid (shared top/left rule, divided cells) with the
// first topic (the most-used one) carrying a touch more visual weight via a
// quiet background wash rather than a bigger box.
export default function TopicGrid({ topics, onQuestionClick, onViewAll, onSwitchAudience }) {
  return (
    <StaggerGroup className="grid sm:grid-cols-2 lg:grid-cols-3 border-t border-l border-(--explorer-border) divide-x divide-y divide-(--explorer-border)">
      {topics.map((topic, i) => (
        <StaggerItem key={topic.id} y={14} duration={0.5} className={i === 0 ? 'bg-(--explorer-blue-surface)/35' : ''}>
          <div className="h-full flex flex-col p-7 sm:p-8">
            <span className="text-[11px] font-bold tracking-[0.16em] text-(--explorer-navy)/35">{topic.index}</span>
            <h3 className="mt-2 text-[16px] font-black text-(--explorer-navy) tracking-tight">{topic.title}</h3>
            <p className="mt-1.5 text-[13px] text-(--explorer-muted) font-medium leading-relaxed">{topic.description}</p>

            {topic.switchesAudience ? (
              <button
                type="button"
                onClick={() => onSwitchAudience(topic.switchesAudience)}
                className="group mt-5 inline-flex w-fit items-center gap-1.5 text-[12.5px] font-bold uppercase tracking-wide text-(--explorer-blue) hover:text-(--explorer-blue-hover)"
              >
                Switch to employer support
                <ArrowRight size={13} className="motion-safe:transition-transform motion-safe:duration-200 group-hover:translate-x-1" aria-hidden="true" />
              </button>
            ) : (
              <>
                <ul className="mt-4 space-y-2">
                  {topic.questions.map((q) => (
                    <li key={q}>
                      <button
                        type="button"
                        onClick={() => onQuestionClick(topic.id, q)}
                        className="text-left text-[13.5px] font-semibold text-(--explorer-navy)/75 hover:text-(--explorer-blue) transition-colors duration-150"
                      >
                        {q}
                      </button>
                    </li>
                  ))}
                </ul>

                <button
                  type="button"
                  onClick={() => onViewAll(topic.id)}
                  className="group mt-auto pt-5 inline-flex w-fit items-center gap-1 text-[11.5px] font-bold uppercase tracking-[0.1em] text-(--explorer-navy)/60 hover:text-(--explorer-blue) transition-colors duration-150"
                >
                  View all
                  <ArrowUpRight size={12} className="motion-safe:transition-transform motion-safe:duration-200 group-hover:translate-x-1 group-hover:-translate-y-0.5" aria-hidden="true" />
                </button>
              </>
            )}
          </div>
        </StaggerItem>
      ))}
    </StaggerGroup>
  )
}
