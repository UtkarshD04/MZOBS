import { useEffect, useState } from 'react'
import { ArrowRight } from 'lucide-react'
import Reveal from '../../ui/Reveal'
import { StaggerGroup, StaggerItem } from '../../ui/Stagger'
import { CATEGORY_DATA } from '../../../lib/content'
import { fetchCategoryCounts } from '../../../lib/publicJobs'

// Resolves a category's real, live count from GET /api/jobs/categories —
// `counts` is `{ tracks: { tech: N, ... }, freshers: N, remote: N, finance: N }`.
// Returns null (not 0) until the request has actually resolved, so the
// caller can tell "we don't know yet" apart from "genuinely zero right now".
function liveCount(cat, counts) {
  if (!counts) return null
  if (cat.trackKey === 'freshers') return counts.freshers ?? 0
  if (cat.trackKey === 'remote') return counts.remote ?? 0
  if (cat.trackKey === 'finance') return counts.finance ?? 0
  if (cat.trackKey) return counts.tracks?.[cat.trackKey] ?? 0
  return 0
}

// Clicking a tile filters "Latest jobs" in place — same pattern as the hero
// search bar and QuickDiscoveryStrip. 'finance' has no Job.track value the
// job-list endpoint's `track` filter accepts (see content.js's comment
// above CATEGORY_DATA), so it searches by title/skill/company text instead.
function paramsFor(cat) {
  if (cat.searchParams) return cat.searchParams
  if (cat.trackKey === 'finance') return { q: cat.title }
  return { track: cat.trackKey }
}

function CategoryTileSkeleton() {
  return (
    <div className="flex items-center gap-3 h-full bg-white border border-(--explorer-border) rounded-lg p-4 animate-pulse">
      <div className="w-9 h-9 rounded-lg bg-(--explorer-bg) shrink-0" />
      <div className="min-w-0 flex-1 flex flex-col gap-1.5">
        <div className="h-3 w-2/3 rounded bg-(--explorer-bg)" />
        <div className="h-2.5 w-1/3 rounded bg-(--explorer-bg)" />
      </div>
    </div>
  )
}

export default function CategoryGrid({ onSelect }) {
  const [counts, setCounts] = useState(null)
  const [countsFailed, setCountsFailed] = useState(false)

  useEffect(() => {
    const controller = new AbortController()
    fetchCategoryCounts({ signal: controller.signal })
      .then(setCounts)
      .catch((err) => {
        if (err?.name !== 'AbortError') setCountsFailed(true)
      })
    return () => controller.abort()
  }, [])

  const loaded = Boolean(counts) || countsFailed
  const categories = CATEGORY_DATA.categories.map((cat) => ({ ...cat, count: liveCount(cat, counts) }))
  const totalOpenings = categories.reduce((sum, c) => sum + (c.count ?? 0), 0)
  const maxCount = Math.max(...categories.map((c) => c.count ?? 0))
  // Quietly flags the single busiest category once real counts are in — a
  // small text tag, not a differently-sized/decorated tile, so the grid
  // stays even and the flag never causes layout shift while counts load.
  const topTitle = loaded && !countsFailed && maxCount > 0 ? categories.find((c) => c.count === maxCount)?.title : null

  function handleSelect(cat) {
    onSelect?.({ q: '', location: '', experience: '', ...paramsFor(cat) })
  }

  return (
    <section id="categories" className="bg-white py-16 md:py-20 px-6 md:px-10">
      <div className="max-w-7xl mx-auto">
        <Reveal direction="up" duration={0.7} className="max-w-xl mb-9">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-(--explorer-navy) tracking-tight">{CATEGORY_DATA.title}</h2>
          <p className="mt-2 text-[15px] text-(--explorer-muted)">
            {CATEGORY_DATA.subtitle}
            {loaded && !countsFailed && ` ${totalOpenings.toLocaleString('en-IN')} openings across ${CATEGORY_DATA.categories.length} categories.`}
          </p>
        </Reveal>

        <StaggerGroup className="grid sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {!loaded
            ? Array.from({ length: CATEGORY_DATA.categories.length }).map((_, i) => (
                <StaggerItem key={i}>
                  <CategoryTileSkeleton />
                </StaggerItem>
              ))
            : categories.map((cat) => {
                const Icon = cat.icon
                return (
                  <StaggerItem key={cat.title}>
                    <button
                      type="button"
                      onClick={() => handleSelect(cat)}
                      className="explorer-tile-btn group flex items-center gap-3 w-full h-full text-left bg-white border border-(--explorer-border) rounded-lg p-4 motion-safe:hover:-translate-y-px hover:border-(--explorer-teal-border) hover:shadow-[0_4px_16px_-8px_rgba(11,122,109,0.25)] transition-[border-color,box-shadow,transform] duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--explorer-teal)"
                    >
                      <span className="flex items-center justify-center w-9 h-9 rounded-lg bg-(--explorer-teal-surface) text-(--explorer-teal) shrink-0">
                        <Icon size={16} strokeWidth={1.75} aria-hidden="true" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block font-bold text-[13.5px] text-(--explorer-navy) truncate">{cat.title}</span>
                        <span className="block text-[12px] text-(--explorer-muted) truncate">
                          {countsFailed ? 'Browse roles' : `${cat.count} opening${cat.count === 1 ? '' : 's'}`}
                          {cat.title === topTitle && <span className="ml-1.5 font-bold uppercase tracking-wide text-(--explorer-teal)">· Most in-demand</span>}
                        </span>
                      </span>
                      <ArrowRight
                        size={14}
                        className="shrink-0 text-(--explorer-teal) opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all"
                        aria-hidden="true"
                      />
                    </button>
                  </StaggerItem>
                )
              })}
        </StaggerGroup>
      </div>
    </section>
  )
}
