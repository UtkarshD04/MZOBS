import { FaAtom, FaBuildingColumns, FaChartPie, FaGlobe, FaLaptop, FaPenRuler, FaRobot, FaShieldHalved, FaTags, FaUser } from 'react-icons/fa6'
import { Container } from '../primitives'
import { KEYWORD_CATEGORIES, useCategoryCounts, useKeywordCategoryCounts } from '../../../lib/useHomeData'

// Loaded counts omit tracks with no live jobs — that is a real zero.
const trackCount = (c, key) => (c ? (c.tracks?.[key] ?? 0) : undefined)

// Each row's `params` is exactly the search a click runs, and its count is
// the real number of live jobs for that same search.
const CATEGORIES = [
  { key: 'tech', title: 'Technology', icon: FaLaptop, params: { track: 'tech' }, count: (c) => trackCount(c, 'tech') },
  { key: 'analytics', title: 'Data & Analytics', icon: FaAtom, params: { track: 'analytics' }, count: (c) => trackCount(c, 'analytics') },
  { key: 'ai', title: 'AI & ML', icon: FaRobot, params: { q: KEYWORD_CATEGORIES.ai }, count: (c, k) => k.ai },
  { key: 'cyber', title: 'Cybersecurity', icon: FaShieldHalved, params: { q: KEYWORD_CATEGORIES.cyber }, count: (c, k) => k.cyber },
  { key: 'design', title: 'Design', icon: FaPenRuler, params: { track: 'design' }, count: (c) => trackCount(c, 'design') },
  { key: 'marketing', title: 'Marketing', icon: FaChartPie, params: { track: 'marketing' }, count: (c) => trackCount(c, 'marketing') },
  { key: 'sales', title: 'Sales', icon: FaTags, params: { track: 'sales' }, count: (c) => trackCount(c, 'sales') },
  { key: 'finance', title: 'Finance', icon: FaBuildingColumns, params: { q: ['Finance', 'Accounting'] }, count: (c) => (c ? (c.finance ?? 0) : undefined) },
  { key: 'hr', title: 'HR', icon: FaUser, params: { track: 'hr' }, count: (c) => trackCount(c, 'hr') },
  { key: 'ops', title: 'Operations', icon: FaGlobe, params: { track: 'ops' }, count: (c) => trackCount(c, 'ops') },
]

function CountText({ value, loading }) {
  if (value == null) return loading ? <span className="mz-skeleton inline-block h-3 w-14 rounded" aria-hidden="true" /> : null
  return <span>{`${value.toLocaleString('en-IN')} ${value === 1 ? 'opening' : 'openings'}`}</span>
}

// Compact category list; a click filters the job feed above on this page.
export default function CategorySection({ onSelect }) {
  const { data: counts, status } = useCategoryCounts()
  const keywordCounts = useKeywordCategoryCounts()
  // Only categories with live openings show (a count still loading keeps its
  // tile until it settles); busiest first.
  const rows = CATEGORIES.map((c) => ({ ...c, value: c.count(counts, keywordCounts) }))
    .filter((c) => c.value !== 0)
    .sort((a, b) => (b.value ?? 0) - (a.value ?? 0))
  if (rows.length === 0) return null

  return (
    <section id="categories" aria-labelledby="categories-title" className="scroll-mt-20 bg-mz-bg py-10 lg:py-12">
      <Container>
        <h2 id="categories-title" className="text-mz-ink text-[28px] sm:text-[34px] lg:text-[40px] font-extrabold leading-[1.1] tracking-tight">Browse by category</h2>
        <p className="mt-1 text-mz-muted text-[16px] sm:text-[17px] font-normal leading-relaxed">Fields with open roles right now. Pick one to filter the jobs above.</p>

        <ul className="mt-5 grid grid-cols-1 gap-2.5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
          {rows.map(({ key, title, icon: Icon, params, value }) => {
            return (
              <li key={key}>
                <button
                  type="button"
                  onClick={() => onSelect?.({ q: [], location: [], experience: '', ...params })}
                  className="group flex h-full w-full items-center gap-3 rounded-[8px] border border-mz-line bg-white px-4 py-3.5 text-left transition-colors duration-150 hover:border-mz-line-strong focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-mz-primary"
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[6px] bg-mz-primary-tint text-mz-primary-strong">
                    <Icon size={17} aria-hidden="true" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-[15px] font-semibold text-mz-ink group-hover:underline">{title}</span>
                    <span className="mt-0.5 block text-[13px] text-mz-muted">
                      <CountText value={value} loading={KEYWORD_CATEGORIES[key] ? !(key in keywordCounts) : status === 'loading'} />
                    </span>
                  </span>
                </button>
              </li>
            )
          })}
        </ul>
      </Container>
    </section>
  )
}
