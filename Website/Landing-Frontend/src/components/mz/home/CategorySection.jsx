import { ChevronRight } from 'lucide-react'
import { Container } from '../primitives'
import { KEYWORD_CATEGORIES, useCategoryCounts, useKeywordCategoryCounts } from '../../../lib/useHomeData'

// Loaded counts omit tracks with no live jobs — that is a real zero.
const trackCount = (c, key) => (c ? (c.tracks?.[key] ?? 0) : undefined)

// Each row's `params` is exactly the search a click runs, and its count is
// the real number of live jobs for that same search.
const CATEGORIES = [
  { key: 'tech', title: 'Technology', params: { track: 'tech' }, count: (c) => trackCount(c, 'tech') },
  { key: 'analytics', title: 'Data & Analytics', params: { track: 'analytics' }, count: (c) => trackCount(c, 'analytics') },
  { key: 'ai', title: 'AI & ML', params: { q: KEYWORD_CATEGORIES.ai }, count: (c, k) => k.ai },
  { key: 'cyber', title: 'Cybersecurity', params: { q: KEYWORD_CATEGORIES.cyber }, count: (c, k) => k.cyber },
  { key: 'design', title: 'Design', params: { track: 'design' }, count: (c) => trackCount(c, 'design') },
  { key: 'marketing', title: 'Marketing', params: { track: 'marketing' }, count: (c) => trackCount(c, 'marketing') },
  { key: 'sales', title: 'Sales', params: { track: 'sales' }, count: (c) => trackCount(c, 'sales') },
  { key: 'finance', title: 'Finance', params: { q: ['Finance', 'Accounting'] }, count: (c) => (c ? (c.finance ?? 0) : undefined) },
  { key: 'hr', title: 'HR', params: { track: 'hr' }, count: (c) => trackCount(c, 'hr') },
  { key: 'ops', title: 'Operations', params: { track: 'ops' }, count: (c) => trackCount(c, 'ops') },
]

function CountText({ value, loading }) {
  if (value == null) return loading ? <span className="mz-skeleton inline-block h-3 w-14 rounded" aria-hidden="true" /> : null
  return <span>{value === 0 ? 'No openings yet' : `${value.toLocaleString('en-IN')} ${value === 1 ? 'opening' : 'openings'}`}</span>
}

// Compact category list; a click filters the job feed above on this page.
export default function CategorySection({ onSelect }) {
  const { data: counts, status } = useCategoryCounts()
  const keywordCounts = useKeywordCategoryCounts()

  return (
    <section id="categories" aria-labelledby="categories-title" className="scroll-mt-20 bg-mz-bg py-10 lg:py-12">
      <Container>
        <h2 id="categories-title" className="text-[20px] font-bold tracking-[-0.015em] text-mz-ink sm:text-[22px]">Browse by category</h2>
        <p className="mt-1 text-[14px] text-mz-muted">Live opening counts. Pick one to filter the job feed.</p>

        <ul className="mt-5 grid grid-cols-2 gap-2 md:grid-cols-3 lg:grid-cols-5">
          {CATEGORIES.map(({ key, title, params, count }) => {
            const value = count(counts, keywordCounts)
            return (
              <li key={key}>
                <button
                  type="button"
                  onClick={() => onSelect?.({ q: [], location: [], experience: '', ...params })}
                  className="group flex w-full items-center justify-between gap-2 rounded-[10px] border border-mz-line bg-white px-3.5 py-3 text-left transition-colors duration-150 hover:border-mz-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-mz-primary"
                >
                  <span className="min-w-0">
                    <span className="block truncate text-[14.5px] font-semibold text-mz-ink group-hover:text-mz-primary-strong">{title}</span>
                    <span className="block text-[12.5px] text-mz-muted">
                      <CountText value={value} loading={KEYWORD_CATEGORIES[key] ? !(key in keywordCounts) : status === 'loading'} />
                    </span>
                  </span>
                  <ChevronRight size={16} className="shrink-0 text-mz-muted transition-transform duration-150 group-hover:translate-x-0.5 group-hover:text-mz-primary" aria-hidden="true" />
                </button>
              </li>
            )
          })}
        </ul>
      </Container>
    </section>
  )
}
