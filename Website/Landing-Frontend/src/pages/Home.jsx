import { useState } from 'react'
import Seo from '../components/Seo'
import { STATIC_PAGE_SEO } from '../lib/seoData'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import Hero from '../components/mz/home/Hero'
import JobMarketplace from '../components/sections/home/JobMarketplace'
import MatchSection from '../components/mz/home/MatchSection'
import CategorySection from '../components/mz/home/CategorySection'
import CityMapSection from '../components/mz/home/CityMapSection'
import RecommendedForYou from '../components/sections/home/RecommendedForYou'
import CompaniesSection from '../components/mz/home/CompaniesSection'
import CampusSection from '../components/mz/home/CampusSection'

// q and location are each a *list* of terms (searched as OR) — the hero
// search box stages several titles/skills/companies or cities as tags. Single-
// value entry points (suggestion pills, category and city tiles, company
// cards) can pass a plain string; normalizeFilters wraps it into a list.
const EMPTY_FILTERS = { q: [], location: [], experience: '', track: '' }

const toTermList = (value) => (Array.isArray(value) ? value : value ? [value] : [])

function normalizeFilters(next) {
  return { ...EMPTY_FILTERS, ...next, q: toTermList(next.q), location: toTermList(next.location) }
}

export default function Home() {
  // The one search the whole page shares: every entry point above and below
  // the job list sets it, and JobMarketplace applies it to its own filters.
  const [jobFilters, setJobFilters] = useState(EMPTY_FILTERS)

  // Replaces (not merges) the search, jumps to the job list, and records the
  // #latest-jobs hash (JobDetail's "Back to jobs" links and old bookmarks
  // point at it).
  function applyJobFilters(next) {
    setJobFilters(normalizeFilters(next))
    if (typeof window !== 'undefined') window.history.replaceState(null, '', '#latest-jobs')
    document.getElementById('latest-jobs')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    // id="services" preserves the old "/#services" footer link used on other pages.
    <div id="services" className="min-h-screen bg-mz-bg font-sans text-mz-ink antialiased">
      <Seo path="/" {...STATIC_PAGE_SEO['/']} />
      <a href="#latest-jobs" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-mz-ink focus:px-4 focus:py-2 focus:text-white">
        Skip to jobs
      </a>
      <Navbar />
      <main>
        <Hero filters={jobFilters} onSearch={applyJobFilters} />
        <JobMarketplace external={jobFilters} />
        <MatchSection />
        <CategorySection onSelect={applyJobFilters} />
        <CityMapSection onSelect={applyJobFilters} />
        {/* Signed-in candidates only (renders nothing otherwise) */}
        <RecommendedForYou />
        <CompaniesSection onSelect={applyJobFilters} />
        <CampusSection />
      </main>
      <Footer />
    </div>
  )
}
