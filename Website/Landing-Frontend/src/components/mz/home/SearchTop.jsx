import { Container } from '../primitives'
import SearchBar from './SearchBar'
import { useCategoryCounts, useHotCities } from '../../../lib/useHomeData'
import { departmentLabel } from '../../../lib/jobFilters'

// A subtle, premium tint per quick-link kind — keeps the row mostly
// navy/teal (per the MZOBS palette) rather than reading as rainbow-colored.
const CHIP_TONES = {
  remote: { bg: 'bg-[#E8F7F4]', text: 'text-[#078B7D]' },
  freshers: { bg: 'bg-[#EEF5FA]', text: 'text-[#12304A]' },
  'track:hr': { bg: 'bg-[#F0EDFF]', text: 'text-[#5B4FD6]' },
  'track:sales': { bg: 'bg-[#E8F7F4]', text: 'text-[#0B9E92]' },
}
const DEFAULT_TONE = { bg: 'bg-[#EEF5FA]', text: 'text-[#12304A]' }

// Shortcuts under the search bar, built only from live counts: a link is
// shown only when its own filter currently returns at least one job, and the
// number next to it is that same count.
function quickLinks(categories, cities) {
  const links = []
  if (categories?.remote > 0) links.push({ key: 'remote', label: 'Remote jobs', count: categories.remote, params: { location: ['Remote'] } })
  if (categories?.freshers > 0) links.push({ key: 'freshers', label: 'Fresher jobs', count: categories.freshers, params: { experience: '0-1' } })
  Object.entries(categories?.tracks ?? {})
    .filter(([, n]) => n > 0)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .forEach(([track, n]) => links.push({ key: `track:${track}`, label: departmentLabel(track), count: n, params: { track } }))
  ;(cities ?? [])
    .map((c) => ({ city: c.city, n: c.byFilter?.all?.openings ?? 0 }))
    .filter((c) => c.city && c.n > 0)
    .sort((a, b) => b.n - a.n)
    .slice(0, 3)
    .forEach(({ city, n }) => links.push({ key: `city:${city}`, label: city, count: n, params: { location: [city] } }))
  return links
}

// The top of the homepage: no hero, just the search and a row of real
// shortcuts, sized so the job feed starts within the first screen.
export default function SearchTop({ filters, onSearch }) {
  const { data: categories } = useCategoryCounts()
  const { data: cities } = useHotCities()
  const links = quickLinks(categories, cities)

  return (
    <section
      id="job-search"
      aria-labelledby="search-title"
      className="relative overflow-hidden border-b border-[#DCE5EC] bg-gradient-to-br from-white via-[#E3F3FF] to-[#CFF1E9] pb-7 pt-[88px] sm:pb-8 sm:pt-[96px]"
    >
      <div className="pointer-events-none absolute -right-16 -top-24 h-80 w-80 rounded-full bg-[#12A89D]/35 blur-2xl" aria-hidden="true" />
      <div className="pointer-events-none absolute -left-24 bottom-[-40px] h-64 w-64 rounded-full bg-[#9b8cf0]/30 blur-2xl" aria-hidden="true" />

      <Container className="relative">
        <h1 id="search-title" className="text-[26px] font-bold leading-tight tracking-[-0.02em] text-[#12304A] sm:text-[32px]">
          Your ambition deserves the right job.
        </h1>
        <p className="mt-2 max-w-2xl text-[15px] leading-relaxed text-mz-muted">
          Live openings from employers hiring on Mzobs. Verified companies are marked on every listing.
        </p>

        <div className="relative mt-5">
          <div className="pointer-events-none absolute -inset-x-4 -inset-y-3 -z-10 rounded-[20px] bg-[#12A89D]/[0.06] blur-xl" aria-hidden="true" />
          <SearchBar filters={filters} onSearch={onSearch} />
        </div>

        {links.length > 0 && (
          <nav aria-label="Quick searches" className="mz-scroll-x -mx-4 mt-4 overflow-x-auto px-4 sm:mx-0 sm:px-0">
            <ul className="flex min-w-max items-center gap-2 sm:min-w-0 sm:flex-wrap">
              {links.map((l) => {
                const tone = CHIP_TONES[l.key] ?? DEFAULT_TONE
                return (
                  <li key={l.key}>
                    <button
                      type="button"
                      onClick={() => onSearch?.({ q: [], location: [], experience: '', ...l.params })}
                      className={`inline-flex h-8 items-center gap-1.5 rounded-[8px] px-3 text-[13px] font-semibold transition-colors duration-200 hover:brightness-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#078B7D] ${tone.bg} ${tone.text}`}
                    >
                      {l.label}
                      <span className="text-[12px] font-bold tabular-nums opacity-70">{l.count.toLocaleString('en-IN')}</span>
                    </button>
                  </li>
                )
              })}
            </ul>
          </nav>
        )}
      </Container>
    </section>
  )
}
