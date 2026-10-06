import { FaAtom, FaBuildingColumns, FaChartPie, FaGlobe, FaLaptop, FaPenRuler, FaRobot, FaShieldHalved, FaTags, FaUser } from 'react-icons/fa6'
import { Container } from '../primitives'
import { KEYWORD_CATEGORIES, useCategoryCounts, useKeywordCategoryCounts } from '../../../lib/useHomeData'

// Loaded counts omit tracks with no live jobs — that is a real zero.
const trackCount = (c, key) => (c ? (c.tracks?.[key] ?? 0) : undefined)

// Each row's `params` is exactly the search a click runs, and its count is
// the real number of live jobs for that same search.
const CATEGORIES = [
  { key: 'tech', title: 'Technology', icon: FaLaptop, tone: '#0b7a6d', params: { track: 'tech' }, count: (c) => trackCount(c, 'tech') },
  { key: 'analytics', title: 'Data & Analytics', icon: FaAtom, tone: '#4d7c0f', params: { track: 'analytics' }, count: (c) => trackCount(c, 'analytics') },
  { key: 'ai', title: 'AI & ML', icon: FaRobot, tone: '#a21caf', params: { q: KEYWORD_CATEGORIES.ai }, count: (c, k) => k.ai },
  { key: 'cyber', title: 'Cybersecurity', icon: FaShieldHalved, tone: '#102a43', params: { q: KEYWORD_CATEGORIES.cyber }, count: (c, k) => k.cyber },
  { key: 'design', title: 'Design', icon: FaPenRuler, tone: '#e11d74', params: { track: 'design' }, count: (c) => trackCount(c, 'design') },
  { key: 'marketing', title: 'Marketing', icon: FaChartPie, tone: '#ea580c', params: { track: 'marketing' }, count: (c) => trackCount(c, 'marketing') },
  { key: 'sales', title: 'Sales', icon: FaTags, tone: '#0891b2', params: { track: 'sales' }, count: (c) => trackCount(c, 'sales') },
  { key: 'finance', title: 'Finance', icon: FaBuildingColumns, tone: '#15803d', params: { q: ['Finance', 'Accounting'] }, count: (c) => (c ? (c.finance ?? 0) : undefined) },
  { key: 'hr', title: 'HR', icon: FaUser, tone: '#7c3aed', params: { track: 'hr' }, count: (c) => trackCount(c, 'hr') },
  { key: 'ops', title: 'Operations', icon: FaGlobe, tone: '#b45309', params: { track: 'ops' }, count: (c) => trackCount(c, 'ops') },
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

        <ul className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-5">
          {CATEGORIES.map(({ key, title, icon: Icon, tone, params, count }) => {
            const value = count(counts, keywordCounts)
            return (
              <li key={key}>
                <button
                  type="button"
                  onClick={() => onSelect?.({ q: [], location: [], experience: '', ...params })}
                  className="group flex h-full w-full flex-col items-center justify-center gap-3 rounded-[18px] border border-mz-line bg-white px-3 py-7 text-center transition-colors duration-150 hover:bg-mz-bg hover:border-mz-line-strong focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-mz-primary"
                >
                  <span className="flex h-12 w-12 items-center justify-center rounded-[14px] text-white shadow-[0_8px_18px_-8px_var(--tone)] transition-transform duration-150 group-hover:scale-110" style={{ background: tone, '--tone': tone }}>
                    <Icon size={22} aria-hidden="true" />
                  </span>
                  <span className="block">
                    <span className="block text-[15px] font-semibold text-mz-ink">{title}</span>
                    <span className="mt-0.5 block text-[12.5px] text-mz-muted">
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
