import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Plus, ThumbsUp, ThumbsDown } from 'lucide-react'
import { StaggerGroup, StaggerItem } from '../../ui/Stagger'

function HelpfulVote({ faqId }) {
  const [vote, setVote] = useState(null)
  if (vote) {
    return <p className="mt-4 text-[12.5px] font-semibold text-(--explorer-blue)">Thanks for the feedback.</p>
  }
  return (
    <div className="mt-4 flex items-center gap-3">
      <span className="text-[11.5px] font-bold uppercase tracking-wide text-(--explorer-navy)/45">Was this helpful?</span>
      <button
        type="button"
        onClick={() => setVote('yes')}
        aria-label={`Yes, "${faqId}" was helpful`}
        className="flex items-center justify-center w-7 h-7 rounded-full border border-(--explorer-border) text-(--explorer-navy)/50 hover:border-(--explorer-blue-border) hover:text-(--explorer-blue) transition-colors duration-150"
      >
        <ThumbsUp size={12} aria-hidden="true" />
      </button>
      <button
        type="button"
        onClick={() => setVote('no')}
        aria-label={`No, "${faqId}" was not helpful`}
        className="flex items-center justify-center w-7 h-7 rounded-full border border-(--explorer-border) text-(--explorer-navy)/50 hover:border-(--explorer-blue-border) hover:text-(--explorer-blue) transition-colors duration-150"
      >
        <ThumbsDown size={12} aria-hidden="true" />
      </button>
    </div>
  )
}

function FaqItem({ faq, isOpen, justOpened, onToggle }) {
  return (
    <StaggerItem>
      <div
        id={`faq-${faq.id}`}
        className="border-b border-(--explorer-border) transition-colors duration-700 rounded-lg"
        style={{ backgroundColor: justOpened ? 'var(--explorer-blue-surface)' : 'transparent' }}
      >
        <button
          type="button"
          onClick={onToggle}
          aria-expanded={isOpen}
          className="w-full flex items-center justify-between gap-4 px-4 py-5 text-left group"
        >
          <span className="text-[14.5px] sm:text-[15px] font-bold text-(--explorer-navy) group-hover:text-(--explorer-blue) transition-colors duration-200">
            {faq.question}
          </span>
          <motion.span
            animate={{ rotate: isOpen ? 45 : 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            className={`shrink-0 w-7 h-7 rounded-full flex items-center justify-center transition-colors duration-200 ${
              isOpen ? 'bg-(--explorer-blue) text-white' : 'bg-(--explorer-bg) text-(--explorer-navy) group-hover:bg-(--explorer-blue-surface)'
            }`}
          >
            <Plus size={14} strokeWidth={2.5} aria-hidden="true" />
          </motion.span>
        </button>

        <AnimatePresence initial={false}>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="overflow-hidden"
            >
              <div className="px-4 pb-5 pr-10">
                <p className="text-[13.5px] text-(--explorer-muted) leading-relaxed font-medium">{faq.answer}</p>
                <HelpfulVote faqId={faq.id} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </StaggerItem>
  )
}

export default function FaqAccordion({ faqs, categories, activeCategory, onCategoryChange, openId, onToggle, justOpenedId }) {
  const filtered = activeCategory === 'all' ? faqs : faqs.filter((f) => f.category === activeCategory)

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-8">
        <FilterChip label="All" active={activeCategory === 'all'} onClick={() => onCategoryChange('all')} />
        {categories.map((c) => (
          <FilterChip key={c.id} label={c.title} active={activeCategory === c.id} onClick={() => onCategoryChange(c.id)} />
        ))}
      </div>

      {/* Keyed so switching audience or category filter remounts just this
          list, never the filter chips above it — StaggerGroup's
          whileInView only fires once per mounted instance (viewport.once),
          so reusing the same instance across a content swap left the
          second set of items permanently stuck at their initial (invisible)
          variant instead of animating in. */}
      <StaggerGroup key={`${activeCategory}-${filtered.map((f) => f.id).join(',')}`} className="max-w-3xl">
        {filtered.map((faq) => (
          <FaqItem key={faq.id} faq={faq} isOpen={openId === faq.id} justOpened={justOpenedId === faq.id} onToggle={() => onToggle(openId === faq.id ? null : faq.id)} />
        ))}
        {filtered.length === 0 && <p className="text-[14px] text-(--explorer-muted) font-medium py-6">No questions in this topic yet.</p>}
      </StaggerGroup>
    </div>
  )
}

function FilterChip({ label, active, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`text-[12.5px] font-bold uppercase tracking-wide px-3.5 py-1.5 rounded-full border transition-colors duration-150 ${
        active
          ? 'bg-(--explorer-navy) border-(--explorer-navy) text-white'
          : 'border-(--explorer-border) text-(--explorer-navy)/65 hover:border-(--explorer-blue-border) hover:text-(--explorer-blue)'
      }`}
    >
      {label}
    </button>
  )
}
