import { KEYWORD_CATEGORIES, useCategoryCounts, useKeywordCategoryCounts } from '../../lib/useHomeData'

const svg = (children) => (
  <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#0b7a6d" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{children}</svg>
)

const trackCount = (c, key) => (c ? (c.tracks?.[key] ?? 0) : undefined)

// A click runs exactly `params` against the job feed; the count is the real
// number of live jobs for that same search.
const CATEGORIES = [
  { key: 'tech', title: 'Technology', params: { track: 'tech' }, count: (c) => trackCount(c, 'tech'), icon: <path d="M8 7l-5 5 5 5M16 7l5 5-5 5" /> },
  { key: 'ai', title: 'AI & ML', params: { q: KEYWORD_CATEGORIES.ai }, count: (c, k) => k.ai, icon: <><circle cx="12" cy="12" r="3" /><path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M5.6 18.4l2.1-2.1M16.3 7.7l2.1-2.1" /></> },
  { key: 'cyber', title: 'Cybersecurity', params: { q: KEYWORD_CATEGORIES.cyber }, count: (c, k) => k.cyber, icon: <path d="M12 2l8 3v6c0 5-3.4 9-8 11-4.6-2-8-6-8-11V5z" /> },
  { key: 'design', title: 'Design', params: { track: 'design' }, count: (c) => trackCount(c, 'design'), icon: <path d="M12 19l7-7 3 3-7 7zM18 13l-1.5-7.5L2 2l3.5 14.5L13 18z" /> },
  { key: 'marketing', title: 'Marketing', params: { track: 'marketing' }, count: (c) => trackCount(c, 'marketing'), icon: <path d="M3 11v2a1 1 0 0 0 1 1h3l5 4V6L7 10H4a1 1 0 0 0-1 1zM16 8a5 5 0 0 1 0 8" /> },
  { key: 'sales', title: 'Sales', params: { track: 'sales' }, count: (c) => trackCount(c, 'sales'), icon: <path d="M3 17l6-6 4 4 8-8M15 7h6v6" /> },
  { key: 'hr', title: 'HR', params: { track: 'hr' }, count: (c) => trackCount(c, 'hr'), icon: <><circle cx="9" cy="8" r="4" /><path d="M2 21c1-4 3.6-6 7-6s6 2 7 6M17 11a3 3 0 1 0 0-6M22 21c-.6-2.6-2-4.3-4-5" /></> },
  { key: 'analytics', title: 'Data & Analytics', params: { track: 'analytics' }, count: (c) => trackCount(c, 'analytics'), icon: <path d="M4 20V10M10 20V4M16 20v-7M22 20H2" /> },
  { key: 'finance', title: 'Finance', params: { q: ['Finance', 'Accounting'] }, count: (c) => (c ? (c.finance ?? 0) : undefined), icon: <><rect x="2" y="6" width="20" height="13" rx="2" /><path d="M2 10h20M6 15h4" /></> },
  { key: 'ops', title: 'Operations', params: { track: 'ops' }, count: (c) => trackCount(c, 'ops'), icon: <><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z" /></> },
]

function countLabel(v) {
  if (v == null) return ' '
  return v === 0 ? 'No openings yet' : `${v.toLocaleString('en-IN')} ${v === 1 ? 'opening' : 'openings'}`
}

export default function Categories({ onPick }) {
  const { data: counts } = useCategoryCounts()
  const keywordCounts = useKeywordCategoryCounts()

  return (
    <section id="categories" style={{ background: '#f7f8fc', scrollMarginTop: 52 }}>
      <div className="sec">
        <div data-r=""><p className="eyebrow">Browse by category</p><h2 className="h2">Pick a path.<br /><span style={{ color: '#98a2b3' }}>We’ll show the roles.</span></h2></div>
        <div style={{ marginTop: 48, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 200px), 1fr))', gap: 12 }}>
          {CATEGORIES.map((c) => (
            <button key={c.key} type="button" className="cat" data-r="" onClick={() => onPick({ id: c.key, label: c.title, params: c.params })}>
              {svg(c.icon)}
              <span>
                <span style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 8 }}>
                  <strong style={{ fontSize: 19, letterSpacing: '-0.02em' }}>{c.title}</strong>
                  <span aria-hidden="true">→</span>
                </span>
                <span className="cat-sub" style={{ display: 'block', marginTop: 4, minHeight: '1.2em' }}>{countLabel(c.count(counts, keywordCounts))}</span>
              </span>
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}
