import { useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Search, ArrowRight, X } from 'lucide-react'
import Reveal from '../../ui/Reveal'
import { CATEGORY_LABELS, POPULAR_SEARCH_CHIPS, SEARCH_PLACEHOLDER_EXAMPLES, searchFaqs } from '../../../lib/helpContent'

const RESULT_LIMIT = 6
const PLACEHOLDER_ROTATE_MS = 2800

// The page's primary interaction — a search box over the whole FAQ dataset
// with a live results dropdown, a softly-dimmed backdrop while focused, and
// a rotating "try this" hint instead of animating the native placeholder
// (which the browser doesn't let you transition).
export default function HelpSearchHero({ faqs, onSelectFaq, onGoToContact }) {
  const [query, setQuery] = useState('')
  const [focused, setFocused] = useState(false)
  const [hintIndex, setHintIndex] = useState(0)
  const containerRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    const id = setInterval(() => setHintIndex((i) => (i + 1) % SEARCH_PLACEHOLDER_EXAMPLES.length), PLACEHOLDER_ROTATE_MS)
    return () => clearInterval(id)
  }, [])

  useEffect(() => {
    function onClickOutside(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) setFocused(false)
    }
    document.addEventListener('mousedown', onClickOutside)
    return () => document.removeEventListener('mousedown', onClickOutside)
  }, [])

  // "/" jumps straight to the search box — a common enough convention (GitHub,
  // Slack) that it's a nice-to-have shortcut here, never required. Ignored
  // while the visitor is already typing into any field.
  useEffect(() => {
    function onKeyDown(e) {
      if (e.key !== '/') return
      const tag = document.activeElement?.tagName
      if (tag === 'INPUT' || tag === 'TEXTAREA' || document.activeElement?.isContentEditable) return
      e.preventDefault()
      inputRef.current?.focus()
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [])

  const results = useMemo(() => searchFaqs(faqs, query).slice(0, RESULT_LIMIT), [faqs, query])
  const showDropdown = focused && query.trim().length > 0

  function pickResult(faq) {
    setQuery('')
    setFocused(false)
    onSelectFaq(faq.id)
  }

  function pickChip(term) {
    setQuery(term)
    setFocused(true)
  }

  return (
    <section className="relative overflow-hidden pt-[104px] pb-16 md:pt-[124px] md:pb-20">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 800px 520px at 92% 6%, var(--explorer-blue-surface), transparent 66%), ' +
            'radial-gradient(ellipse 640px 420px at 4% 96%, var(--explorer-teal-surface), transparent 68%)',
        }}
        aria-hidden="true"
      />

      {/* Soft page dim while the search is focused — the signature interaction */}
      <motion.div
        className="fixed inset-0 bg-(--explorer-navy) pointer-events-none z-30"
        initial={{ opacity: 0 }}
        animate={{ opacity: focused ? 0.06 : 0 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        aria-hidden="true"
      />

      <div className="relative z-40 max-w-3xl mx-auto px-6 md:px-12 text-center">
        <Reveal direction="up" duration={0.5}>
          <p className="text-[12px] font-bold uppercase tracking-[0.24em] text-(--explorer-blue)">MZOBS Support Center</p>
        </Reveal>

        <Reveal direction="up" duration={0.55} delay={0.06}>
          <h1 className="mt-4 text-[32px] sm:text-[42px] md:text-[48px] font-extrabold leading-[1.14] tracking-tight text-(--explorer-navy)">
            How can we help you?
          </h1>
        </Reveal>

        <Reveal direction="up" duration={0.5} delay={0.14}>
          <p className="mt-4 text-[15px] sm:text-base text-(--explorer-muted) leading-relaxed font-medium">
            Find quick answers, explore helpful guides, or connect with the MZOBS support team.
          </p>
        </Reveal>

        <Reveal direction="up" duration={0.5} delay={0.2} className="mt-8">
          <div ref={containerRef} className="relative text-left">
            <div
              className={`relative flex items-center gap-3 bg-white rounded-2xl border px-5 h-14 transition-[border-color,box-shadow] duration-200 ${
                focused ? 'border-(--explorer-blue) shadow-[0_16px_36px_-16px_rgba(37,99,235,0.35)]' : 'border-(--explorer-border) shadow-[0_10px_28px_-16px_rgba(18,50,74,0.18)]'
              }`}
            >
              <Search size={19} className="text-(--explorer-muted) shrink-0" aria-hidden="true" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onFocus={() => setFocused(true)}
                placeholder="Search for a question, topic or problem..."
                aria-label="Search for help"
                className="w-full bg-transparent outline-none text-[15px] text-(--explorer-navy) placeholder:text-(--explorer-muted)/70"
              />
              {query.length > 0 ? (
                <button
                  type="button"
                  onClick={() => {
                    setQuery('')
                    inputRef.current?.focus()
                  }}
                  aria-label="Clear search"
                  className="shrink-0 flex items-center justify-center w-6 h-6 rounded-full text-(--explorer-muted) hover:bg-(--explorer-bg) hover:text-(--explorer-navy) transition-colors duration-150"
                >
                  <X size={14} aria-hidden="true" />
                </button>
              ) : (
                <kbd className="hidden sm:inline-flex shrink-0 items-center justify-center h-6 min-w-6 px-1.5 rounded-md border border-(--explorer-border) bg-(--explorer-bg) text-[11px] font-bold text-(--explorer-muted)">
                  /
                </kbd>
              )}
            </div>

            {/* Rotating example hint — only when the box is empty */}
            <div className="h-6 mt-2.5 px-1 overflow-hidden">
              <AnimatePresence mode="wait">
                {query.trim().length === 0 && (
                  <motion.p
                    key={hintIndex}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                    className="text-[12.5px] text-(--explorer-navy)/45 font-medium"
                  >
                    Try: <span className="italic font-serif text-(--explorer-navy)/60">“{SEARCH_PLACEHOLDER_EXAMPLES[hintIndex]}”</span>
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            {/* Popular search chips */}
            <div className="flex flex-wrap items-center gap-2 mt-1 px-1">
              <span className="text-[11.5px] font-bold uppercase tracking-wide text-(--explorer-navy)/40">Popular:</span>
              {POPULAR_SEARCH_CHIPS.map((term) => (
                <button
                  key={term}
                  type="button"
                  onClick={() => pickChip(term)}
                  className="text-[12.5px] font-semibold text-(--explorer-navy)/70 px-2.5 py-1 rounded-full border border-(--explorer-border) hover:border-(--explorer-blue-border) hover:text-(--explorer-blue) hover:bg-(--explorer-blue-surface) transition-colors duration-150"
                >
                  {term}
                </button>
              ))}
            </div>

            {/* Live results dropdown */}
            <AnimatePresence>
              {showDropdown && (
                <motion.div
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                  className="absolute left-0 right-0 top-[60px] z-50 bg-white rounded-2xl border border-(--explorer-border) shadow-[0_24px_48px_-16px_rgba(18,50,74,0.28)] overflow-hidden"
                >
                  {results.length > 0 ? (
                    <ul>
                      <li className="px-5 pt-4 pb-1 text-[11px] font-black uppercase tracking-[0.14em] text-(--explorer-navy)/40" aria-hidden="true">
                        Search results
                      </li>
                      {results.map((faq) => (
                        <li key={faq.id}>
                          <button
                            type="button"
                            onClick={() => pickResult(faq)}
                            className="group w-full flex items-center justify-between gap-3 px-5 py-3.5 text-left border-b border-(--explorer-border) last:border-b-0 hover:bg-(--explorer-blue-surface)/50 transition-colors duration-150"
                          >
                            <span>
                              <span className="block text-[14px] font-bold text-(--explorer-navy)">{faq.question}</span>
                              <span className="text-[11px] font-semibold uppercase tracking-wide text-(--explorer-blue)">{CATEGORY_LABELS[faq.category] ?? faq.category}</span>
                            </span>
                            <ArrowRight size={15} className="shrink-0 text-(--explorer-navy)/30 group-hover:text-(--explorer-blue) group-hover:translate-x-1 transition-all duration-150" aria-hidden="true" />
                          </button>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="px-5 py-6 text-center">
                      <p className="text-[13.5px] font-semibold text-(--explorer-navy)/60">No exact match found.</p>
                      <button
                        type="button"
                        onClick={() => {
                          setFocused(false)
                          onGoToContact()
                        }}
                        className="mt-2 text-[13.5px] font-bold text-(--explorer-blue) hover:text-(--explorer-blue-hover) inline-flex items-center gap-1"
                      >
                        Still need help? Talk to our team
                        <ArrowRight size={14} aria-hidden="true" />
                      </button>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
