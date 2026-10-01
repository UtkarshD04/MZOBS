import { ArrowUpRight, BarChart3, BrainCircuit, Code2, Landmark, Megaphone, PenTool, Settings2, ShieldHalf, TrendingUp, Users } from 'lucide-react'
import { Container, Reveal, SectionHead } from '../primitives'
import { KEYWORD_CATEGORIES, useCategoryCounts, useKeywordCategoryCounts } from '../../../lib/useHomeData'

// Loaded counts omit tracks with no live jobs — that is a real zero.
const trackCount = (c, key) => (c ? (c.tracks?.[key] ?? 0) : undefined)

// Each tile's `params` is exactly the search a click runs, and its count is
// the real number of live jobs for that same search.
const CATEGORIES = [
  { key: 'tech', title: 'Technology', icon: Code2, params: { track: 'tech' }, count: (c) => trackCount(c, 'tech') },
  { key: 'analytics', title: 'Data & Analytics', icon: BarChart3, params: { track: 'analytics' }, count: (c) => trackCount(c, 'analytics') },
  { key: 'ai', title: 'AI & ML', icon: BrainCircuit, params: { q: KEYWORD_CATEGORIES.ai }, count: (c, k) => k.ai },
  { key: 'cyber', title: 'Cybersecurity', icon: ShieldHalf, params: { q: KEYWORD_CATEGORIES.cyber }, count: (c, k) => k.cyber },
  { key: 'design', title: 'Design', icon: PenTool, params: { track: 'design' }, count: (c) => trackCount(c, 'design') },
  { key: 'marketing', title: 'Marketing', icon: Megaphone, params: { track: 'marketing' }, count: (c) => trackCount(c, 'marketing') },
  { key: 'sales', title: 'Sales', icon: TrendingUp, params: { track: 'sales' }, count: (c) => trackCount(c, 'sales') },
  { key: 'finance', title: 'Finance', icon: Landmark, params: { q: ['Finance', 'Accounting'] }, count: (c) => (c ? (c.finance ?? 0) : undefined) },
  { key: 'hr', title: 'HR', icon: Users, params: { track: 'hr' }, count: (c) => trackCount(c, 'hr') },
  { key: 'ops', title: 'Operations', icon: Settings2, params: { track: 'ops' }, count: (c) => trackCount(c, 'ops') },
]

function CountLine({ value, loading }) {
  if (value == null) {
    return loading ? <span className="mz-skeleton inline-block h-3 w-20 rounded" aria-hidden="true" /> : <span className="text-mz-muted">Explore roles</span>
  }
  if (value === 0) return <span className="text-mz-muted">No live roles yet</span>
  return (
    <span>
      <span className="font-semibold text-mz-ink">{value.toLocaleString('en-IN')}</span> {value === 1 ? 'opportunity' : 'opportunities'}
    </span>
  )
}

export default function CategorySection({ onSelect }) {
  const { data: counts, status } = useCategoryCounts()
  const keywordCounts = useKeywordCategoryCounts()

  return (
    <section id="categories" aria-labelledby="categories-title" className="bg-mz-bg mz-section">
      <Container>
        <SectionHead id="categories-title" eyebrow="Explore by category" title="Find your field.">
          Ten areas where companies are hiring on Mzobs &mdash; counts are live.
        </SectionHead>

        <ul className="mt-12 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-5">
          {CATEGORIES.map(({ key, title, icon: Icon, params, count }, i) => (
            <Reveal as="li" key={key} delay={(i % 5) * 0.05}>
              <button
                type="button"
                onClick={() => onSelect?.({ q: [], location: [], experience: '', ...params })}
                className="group relative flex h-full w-full flex-col overflow-hidden rounded-3xl bg-white p-4 text-left ring-1 ring-mz-line transition-[transform,box-shadow] duration-300 motion-safe:hover:-translate-y-1 hover:shadow-mz-lift focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-mz-primary sm:p-5"
              >
                <span className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100" style={{ backgroundImage: 'var(--mz-gradient-soft)' }} aria-hidden="true" />
                <span className="relative flex items-start justify-between">
                  <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-mz-primary-tint text-mz-primary-strong transition-[transform,background-color,color] duration-300 group-hover:scale-105 group-hover:bg-mz-primary group-hover:text-white">
                    <Icon size={20} aria-hidden="true" />
                  </span>
                  <ArrowUpRight size={17} className="text-mz-muted opacity-0 transition-[opacity,transform] duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100" aria-hidden="true" />
                </span>
                <span className="relative mt-5 text-[15.5px] font-semibold tracking-[-0.01em] text-mz-ink">{title}</span>
                <span className="relative mt-1 text-[13px] text-mz-ink-2">
                  <CountLine value={count(counts, keywordCounts)} loading={KEYWORD_CATEGORIES[key] ? !(key in keywordCounts) : status === 'loading'} />
                </span>
              </button>
            </Reveal>
          ))}
        </ul>
      </Container>
    </section>
  )
}
