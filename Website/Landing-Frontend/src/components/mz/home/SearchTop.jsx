import { Container } from '../primitives'
import SearchBar from './SearchBar'
import { useCategoryCounts, useHotCities } from '../../../lib/useHomeData'
import { departmentLabel } from '../../../lib/jobFilters'

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
    <section id="job-search" aria-labelledby="search-title" className="border-b border-mz-line bg-white pb-7 pt-[88px] sm:pb-8 sm:pt-[96px]">
      <Container>
        <h1 id="search-title" className="text-[26px] font-bold leading-tight tracking-[-0.02em] text-mz-ink sm:text-[32px]">
          Your ambition deserves the right job.
        </h1>
        <p className="mt-2 max-w-2xl text-[15px] leading-relaxed text-mz-muted">
          Live openings from employers hiring on MZOBS &mdash; verified companies are marked on every listing.
        </p>

        <div className="mt-5">
          <SearchBar filters={filters} onSearch={onSearch} />
        </div>

        {links.length > 0 && (
          <nav aria-label="Quick searches" className="mz-scroll-x -mx-4 mt-4 overflow-x-auto px-4 sm:mx-0 sm:px-0">
            <ul className="flex min-w-max items-center gap-2 sm:min-w-0 sm:flex-wrap">
              {links.map((l) => (
                <li key={l.key}>
                  <button
                    type="button"
                    onClick={() => onSearch?.({ q: [], location: [], experience: '', ...l.params })}
                    className="inline-flex h-8 items-center gap-1.5 rounded-[8px] border border-mz-line bg-mz-bg px-3 text-[13px] font-medium text-mz-ink-2 transition-colors duration-150 hover:border-mz-primary hover:text-mz-primary-strong focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-mz-primary"
                  >
                    {l.label}
                    <span className="text-[12px] font-normal text-mz-muted tabular-nums">{l.count.toLocaleString('en-IN')}</span>
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        )}
      </Container>
    </section>
  )
}
