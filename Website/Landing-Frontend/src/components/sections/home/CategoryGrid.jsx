import { useEffect, useRef, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { ArrowUpRight, Sparkles } from 'lucide-react'
import Reveal from '../../ui/Reveal'
import { CATEGORY_DATA } from '../../../lib/content'
import { fetchCategoryCounts } from '../../../lib/publicJobs'
import { useAutoRail } from '../../../lib/useAutoRail'

function liveCount(cat, counts) {
  if (!counts) return null
  if (cat.trackKey === 'freshers') return counts.freshers ?? 0
  if (cat.trackKey === 'remote') return counts.remote ?? 0
  if (cat.trackKey === 'finance') return counts.finance ?? 0
  if (cat.trackKey) return counts.tracks?.[cat.trackKey] ?? 0
  return 0
}

function paramsFor(cat) {
  if (cat.searchParams) return cat.searchParams
  if (cat.trackKey === 'finance') return { q: cat.title }
  return { track: cat.trackKey }
}

// Each category gets a distinct tonal card — same soft palette as
// JobMarketplace — keyed by trackKey (not array position) so a category's
// color stays fixed even as the grid below re-sorts by live opening count.
const CATEGORY_TONES = {
  tech: { bg: '#EAF2FE', border: '#D3E4FC', icon: '#2563EB', bar: '#2563EB' },
  sales: { bg: '#FDF0E6', border: '#F6DDC3', icon: '#EA580C', bar: '#EA580C' },
  marketing: { bg: '#E8F7F1', border: '#CBEADD', icon: '#059669', bar: '#059669' },
  design: { bg: '#F1EEFC', border: '#DDD2F7', icon: '#7C3AED', bar: '#7C3AED' },
  finance: { bg: '#FBF7EF', border: '#EEE2C9', icon: '#D97706', bar: '#D97706' },
  hr: { bg: '#E0F2FE', border: '#BAE6FD', icon: '#0284C7', bar: '#0284C7' },
  ops: { bg: '#FFF1F2', border: '#FECDD3', icon: '#E11D48', bar: '#E11D48' },
  support: { bg: '#F0FDFA', border: '#99F6E4', icon: '#0D9488', bar: '#0D9488' },
  freshers: { bg: '#ECFDF5', border: '#A7F3D0', icon: '#16A34A', bar: '#16A34A' },
  remote: { bg: '#EFF6FF', border: '#BFDBFE', icon: '#3B82F6', bar: '#3B82F6' },
}
const DEFAULT_TONE = CATEGORY_TONES.tech
const SKELETON_TONES = Object.values(CATEGORY_TONES)

// A muted, low-saturation treatment for a category with zero real openings
// right now — same card, same click-through, just visually quieter than a
// populated one so an empty category never competes for attention with an
// actually-hiring one.
const EMPTY_TONE = { bg: '#F6F8FB', border: 'var(--explorer-border)', icon: 'var(--explorer-muted)', bar: 'var(--explorer-border)' }

function CategoryCardSkeleton({ tone }) {
  return (
    <div
      className="animate-pulse rounded-2xl border p-5 min-h-[148px] flex flex-col justify-between"
      style={{ backgroundColor: tone.bg, borderColor: tone.border }}
    >
      <div className="flex items-start justify-between">
        <div className="w-10 h-10 rounded-xl bg-white/60" />
      </div>
      <div>
        <div className="h-3.5 w-2/3 rounded-full bg-white/70 mb-2" />
        <div className="h-2.5 w-1/3 rounded-full bg-white/60" />
        <div className="mt-3 h-[3px] w-full rounded-full bg-white/50" />
      </div>
    </div>
  )
}

export default function CategoryGrid({ onSelect }) {
  const sectionRef = useRef(null)
  useAutoRail(sectionRef)
  const reduceMotion = useReducedMotion()
  const [counts, setCounts] = useState(null)
  const [countsFailed, setCountsFailed] = useState(false)

  useEffect(() => {
    const controller = new AbortController()
    fetchCategoryCounts({ signal: controller.signal })
      .then(setCounts)
      .catch((err) => { if (err?.name !== 'AbortError') setCountsFailed(true) })
    return () => controller.abort()
  }, [])

  const loaded = Boolean(counts) || countsFailed
  // Busiest category first — with a small/real dataset, a fixed content
  // order left populated categories scattered among several "0 openings"
  // ones; leading with what's actually hiring reads as alive, not sparse.
  const categories = CATEGORY_DATA.categories
    .map((cat) => ({ ...cat, count: liveCount(cat, counts) }))
    .sort((a, b) => (b.count ?? 0) - (a.count ?? 0))
  const totalOpenings = categories.reduce((sum, c) => sum + (c.count ?? 0), 0)
  const maxCount = Math.max(...categories.map((c) => c.count ?? 0), 1)
  const topTitle = loaded && !countsFailed && maxCount > 0 ? categories.find((c) => c.count === maxCount)?.title : null

  function handleSelect(cat) {
    onSelect?.({ q: '', location: '', experience: '', ...paramsFor(cat) })
  }

  return (
    <section ref={sectionRef} id="categories" className="hero-afterglow-faint py-16 md:py-20 px-6 md:px-10">
      <div className="max-w-7xl mx-auto">

        {/* Header — mirrors JobMarketplace's editorial header style */}
        <Reveal direction="up" duration={0.6} className="max-w-2xl mb-10">
          <motion.span
            initial={reduceMotion ? false : { scaleY: 0 }}
            whileInView={{ scaleY: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="block w-px h-8 mb-4 origin-top"
            style={{ backgroundImage: 'linear-gradient(180deg, transparent, var(--explorer-blue-border))' }}
            aria-hidden="true"
          />
          <h2 className="text-[32px] sm:text-[40px] font-black leading-[1.08] tracking-tight text-balance text-(--explorer-navy)">
            {CATEGORY_DATA.title}
          </h2>
          <p className="mt-3 text-[15px] text-(--explorer-navy)/70 leading-relaxed">
            {CATEGORY_DATA.subtitle}
            {loaded && !countsFailed && (
              <span className="ml-1 font-bold text-(--explorer-navy)">
                {totalOpenings.toLocaleString('en-IN')} openings across {CATEGORY_DATA.categories.length} categories.
              </span>
            )}
          </p>
        </Reveal>

        {/* Card grid */}
        <motion.div
          data-auto-rail
          className="flex snap-x snap-mandatory gap-3.5 overflow-x-auto scroll-px-6 -mx-6 px-6 pb-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:mx-0 sm:grid sm:snap-none sm:grid-cols-2 sm:overflow-visible sm:px-0 sm:pb-0 lg:grid-cols-3 xl:grid-cols-5"
          initial={reduceMotion ? false : 'hidden'}
          whileInView="show"
          viewport={{ once: true, amount: 0.15 }}
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.06 } } }}
        >
          {!loaded
            ? SKELETON_TONES.map((tone, i) => (
                <motion.div
                  key={i}
                  className="w-[64%] shrink-0 snap-start sm:w-auto"
                                    variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}
                  transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                >
                  <CategoryCardSkeleton tone={tone} />
                </motion.div>
              ))
            : categories.map((cat, i) => {
                const Icon = cat.icon
                const isEmpty = loaded && !countsFailed && cat.count === 0
                const tone = isEmpty ? EMPTY_TONE : CATEGORY_TONES[cat.trackKey] ?? DEFAULT_TONE
                const pct = cat.count != null ? Math.round((cat.count / maxCount) * 100) : 0
                const isTop = cat.title === topTitle

                return (
                  <motion.div
                    key={cat.title}
                    className="w-[64%] shrink-0 snap-start sm:w-auto"
                                        variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}
                    transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <button
                      type="button"
                      onClick={() => handleSelect(cat)}
                      className="job-card-sheen group relative w-full h-full min-h-[148px] text-left flex flex-col justify-between rounded-2xl border p-5 motion-safe:transition-[transform,box-shadow] motion-safe:duration-300 motion-safe:hover:-translate-y-1 hover:shadow-[0_16px_40px_-16px_rgba(22,50,79,0.22),inset_0_0_0_1px_rgba(22,50,79,0.1)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--explorer-blue)"
                      style={{ backgroundColor: tone.bg, borderColor: tone.border }}
                    >
                      {/* Top row: icon + arrow */}
                      <div className="flex items-start justify-between gap-2">
                        <span
                          className="flex items-center justify-center w-10 h-10 rounded-xl bg-white/70 motion-safe:transition-transform motion-safe:duration-300 group-hover:scale-110 shrink-0"
                          style={{ color: tone.icon }}
                        >
                          <Icon size={18} strokeWidth={1.75} aria-hidden="true" />
                        </span>
                        <ArrowUpRight
                          size={15}
                          className="opacity-0 group-hover:opacity-100 motion-safe:transition-all motion-safe:duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 mt-0.5 shrink-0"
                          style={{ color: tone.icon }}
                          aria-hidden="true"
                        />
                      </div>

                      {/* Bottom: title + count + bar */}
                      <div className="mt-3">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="text-[13.5px] font-extrabold text-(--explorer-navy) leading-snug">{cat.title}</span>
                          {isTop && (
                            <span
                              className="inline-flex items-center gap-0.5 text-[9.5px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-white/70"
                              style={{ color: tone.icon }}
                            >
                              <Sparkles size={8} aria-hidden="true" /> Top
                            </span>
                          )}
                        </div>
                        <p className="text-[12px] font-semibold mt-0.5" style={{ color: tone.icon }}>
                          {countsFailed ? 'Browse roles' : isEmpty ? 'No openings yet' : `${cat.count} opening${cat.count === 1 ? '' : 's'}`}
                        </p>

                        {/* Demand bar — skipped for an empty category; a
                            0%-width fill just reads as a rendering glitch,
                            not a real "no demand" signal. */}
                        {!countsFailed && cat.count > 0 && (
                          <div className="mt-3 h-[3px] w-full rounded-full bg-white/50 overflow-hidden">
                            <motion.div
                              className="h-full rounded-full"
                              style={{ background: tone.bar }}
                              initial={{ width: 0 }}
                              whileInView={{ width: `${pct}%` }}
                              viewport={{ once: true }}
                              transition={{ duration: 0.8, delay: 0.1 + i * 0.04, ease: [0.16, 1, 0.3, 1] }}
                            />
                          </div>
                        )}
                      </div>
                    </button>
                  </motion.div>
                )
              })}
        </motion.div>
      </div>
    </section>
  )
}
