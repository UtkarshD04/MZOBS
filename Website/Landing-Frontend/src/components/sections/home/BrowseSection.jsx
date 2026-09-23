import { useEffect, useState } from 'react'
import { ArrowRight } from 'lucide-react'
import Reveal from '../../ui/Reveal'
import { CATEGORY_DATA, HOT_CITIES_DATA } from '../../../lib/content'
import { fetchCategoryCounts, fetchHotCities } from '../../../lib/publicJobs'
import { useInitialHomeData } from '../../../lib/initialHomeDataContext'

function liveCategoryCount(cat, counts) {
  if (!counts) return null
  if (cat.trackKey === 'freshers') return counts.freshers ?? 0
  if (cat.trackKey === 'remote') return counts.remote ?? 0
  if (cat.trackKey === 'finance') return counts.finance ?? 0
  if (cat.trackKey) return counts.tracks?.[cat.trackKey] ?? 0
  return 0
}

function categoryParams(cat) {
  if (cat.searchParams) return cat.searchParams
  if (cat.trackKey === 'finance') return { q: cat.title }
  return { track: cat.trackKey }
}

// Simple text links, not a big colorful card grid — one row per real,
// currently-hiring option. A category/city with zero live openings is
// dropped entirely rather than shown greyed out.
function BrowseLink({ label, count, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group flex items-center justify-between gap-3 w-full py-3 px-4 rounded-lg border border-(--explorer-border) bg-white text-left motion-safe:transition-colors motion-safe:duration-150 hover:border-(--explorer-blue-border) hover:bg-(--explorer-blue-surface) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--explorer-blue)"
    >
      <span className="text-[13.5px] font-semibold text-(--explorer-navy) truncate">{label}</span>
      <span className="flex items-center gap-1 shrink-0 text-[12px] font-semibold text-(--explorer-muted) group-hover:text-(--explorer-blue)">
        {count.toLocaleString('en-IN')}
        <ArrowRight size={12} className="motion-safe:transition-transform motion-safe:duration-150 group-hover:translate-x-0.5" aria-hidden="true" />
      </span>
    </button>
  )
}

function BrowseLinkSkeleton() {
  return <div className="h-11.5 rounded-lg border border-(--explorer-border) bg-(--explorer-bg) animate-pulse" />
}

// "Browse jobs" — two simple, real lists side by side: popular categories
// and popular cities, each sourced live from the same endpoints the rest of
// the site uses (fetchCategoryCounts / fetchHotCities). Anything with zero
// openings right now is left out, not shown greyed-out or fake.
export default function BrowseSection({ onSelectCategory, onSelectCity }) {
  const initialHomeData = useInitialHomeData()
  const [categoryCounts, setCategoryCounts] = useState(initialHomeData?.categories ?? null)
  const [cities, setCities] = useState(initialHomeData?.hotCities ?? null)

  useEffect(() => {
    const controller = new AbortController()
    fetchCategoryCounts({ signal: controller.signal })
      .then(setCategoryCounts)
      .catch((err) => {
        if (err?.name !== 'AbortError') setCategoryCounts((c) => c ?? {})
      })
    return () => controller.abort()
  }, [])

  useEffect(() => {
    const controller = new AbortController()
    fetchHotCities({ signal: controller.signal })
      .then((data) => setCities(data.cities))
      .catch((err) => {
        if (err?.name !== 'AbortError') setCities((c) => c ?? [])
      })
    return () => controller.abort()
  }, [])

  const categoriesLoaded = categoryCounts !== null
  const categories = categoriesLoaded
    ? CATEGORY_DATA.categories
        .map((cat) => ({ title: cat.title, trackKey: cat.trackKey, count: liveCategoryCount(cat, categoryCounts) ?? 0, params: categoryParams(cat) }))
        .filter((cat) => cat.count > 0)
        .sort((a, b) => b.count - a.count)
    : null

  const citiesLoaded = cities !== null
  const cityList = citiesLoaded
    ? cities
        .map((c) => {
          const meta = HOT_CITIES_DATA.cities.find((m) => m.slug === c.slug)
          const openings = c.byFilter?.all?.openings ?? 0
          if (!meta || openings <= 0) return null
          return { city: meta.city, slug: meta.slug, count: openings }
        })
        .filter(Boolean)
        .sort((a, b) => b.count - a.count)
        .slice(0, 8)
    : null

  if (categoriesLoaded && citiesLoaded && categories.length === 0 && cityList.length === 0) return null

  return (
    <section id="categories" className="bg-(--explorer-bg) py-16 md:py-20 px-6 md:px-10">
      <div className="max-w-7xl mx-auto">
        <Reveal direction="up" duration={0.5} className="max-w-2xl mb-10">
          <h2 className="text-[26px] sm:text-[32px] font-extrabold tracking-tight text-(--explorer-navy)">Browse open roles</h2>
          <p className="mt-1.5 text-[14.5px] text-(--explorer-muted)">Jump straight to what's hiring, by category or by city.</p>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <Reveal direction="up" duration={0.5} delay={0.05}>
            <h3 className="text-[12px] font-bold uppercase tracking-wide text-(--explorer-muted) mb-3">Popular categories</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {!categoriesLoaded
                ? Array.from({ length: 6 }).map((_, i) => <BrowseLinkSkeleton key={i} />)
                : categories.length === 0
                  ? <p className="text-[13.5px] text-(--explorer-muted) sm:col-span-2">No open categories right now — check back soon.</p>
                  : categories.map((cat) => (
                      <BrowseLink
                        key={cat.title}
                        label={cat.title}
                        count={cat.count}
                        onClick={() => onSelectCategory?.({ q: '', location: '', experience: '', ...cat.params })}
                      />
                    ))}
            </div>
          </Reveal>

          <Reveal direction="up" duration={0.5} delay={0.1}>
            <h3 className="text-[12px] font-bold uppercase tracking-wide text-(--explorer-muted) mb-3">Popular cities</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {!citiesLoaded
                ? Array.from({ length: 6 }).map((_, i) => <BrowseLinkSkeleton key={i} />)
                : cityList.length === 0
                  ? <p className="text-[13.5px] text-(--explorer-muted) sm:col-span-2">No live city data right now — check back soon.</p>
                  : cityList.map((c) => (
                      <BrowseLink key={c.slug} label={c.city} count={c.count} onClick={() => onSelectCity?.(c.slug)} />
                    ))}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
