import { useState } from 'react'
import Seo from '../components/Seo'
import { STATIC_PAGE_SEO } from '../lib/seoData'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import FloatingQuickNav from '../components/ui/FloatingQuickNav'
import JobSearchHero from '../components/sections/home/JobSearchHero'
import QuickDiscoveryStrip from '../components/sections/home/QuickDiscoveryStrip'
import LatestJobs from '../components/sections/home/LatestJobs'
import HotJobsByCity from '../components/sections/home/HotJobsByCity'
import CategoryGrid from '../components/sections/home/CategoryGrid'
import RecommendedForYou from '../components/sections/home/RecommendedForYou'
import CompaniesHiring from '../components/sections/home/CompaniesHiring'
import HomeEmployerCTA from '../components/sections/home/HomeEmployerCTA'

// q and location are each a *list* of terms — the hero search box lets a
// visitor tag on several job titles/skills/companies, or several
// cities/"Remote", at once (see JobSearchHero.jsx), searched as OR. Single-
// value shortcuts elsewhere on the page (quick-discovery pills, popular
// searches, category cards) still just pass one plain string — normalizeFilters
// below wraps it into a one-element list so every caller can stay simple.
const EMPTY_FILTERS = { q: [], location: [], experience: '', workMode: [], salary: '', employmentType: [], track: [], postedWithin: '' }

function toTermList(value) {
  if (Array.isArray(value)) return value
  return value ? [value] : []
}

function normalizeFilters(next) {
  const out = { ...next }
  if ('q' in out) out.q = toTermList(out.q)
  if ('location' in out) out.location = toTermList(out.location)
  return out
}

export default function Home() {
  // Lifted here (not local to LatestJobs) so the hero search bar and the
  // quick-discovery pills above it can both drive the same result set —
  // every "filter" entry point on this page (hero search, quick-discovery
  // pills, and the full Filters panel inside Latest jobs itself) now
  // searches the Latest jobs section in place instead of handing the
  // visitor off to the dashboard app.
  const [jobFilters, setJobFilters] = useState(EMPTY_FILTERS)

  // Used by entry points above the Latest jobs section (quick-discovery
  // pills, popular searches, and the hero search bar's own "Find jobs" —
  // see JobSearchHero.jsx) — jumps the visitor down to the results and
  // reflects it in the URL as a #latest-jobs hash, so a search never leaves
  // this page (and the URL stays shareable/bookmarkable) instead of
  // redirecting to the dashboard app.
  function applyJobFilters(next) {
    setJobFilters((prev) => ({ ...prev, ...normalizeFilters(next) }))
    if (typeof window !== 'undefined') window.history.replaceState(null, '', '#latest-jobs')
    document.getElementById('latest-jobs')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  // Used by the Filters panel inside Latest jobs itself — it's already in
  // view, so no need to scroll on every chip click.
  function updateJobFilters(next) {
    setJobFilters(normalizeFilters(next))
  }

  return (
    // id="services" preserves the shared Footer's "/#services" link
    // (Footer.jsx / FOOTER_DATA, rendered on every page) now that this
    // redesign has no dedicated services section of its own — it just
    // scrolls back to the top of the job-discovery home page instead
    // of landing on a missing anchor.
    <div id="services" className="min-h-screen bg-(--explorer-bg) text-(--explorer-navy) font-sans antialiased selection:bg-(--explorer-teal-surface)">
      <Seo path="/" {...STATIC_PAGE_SEO['/']} />

      {/* 1. Sticky job-discovery navigation (sitewide header) */}
      <Navbar />

      {/* 2. Hero: headline + job search bar + popular searches */}
      <JobSearchHero filters={jobFilters} onSearch={applyJobFilters} />

      {/* 3. Quick job-discovery strip: freshers, remote, top metros */}
      <QuickDiscoveryStrip onSelect={applyJobFilters} />

      {/* 4. Latest opportunities — the visual heart of the home page */}
      <LatestJobs filters={jobFilters} onFiltersChange={updateJobFilters} onClearFilters={() => setJobFilters(EMPTY_FILTERS)} />

      {/* 5. Hot jobs by city — where hiring is happening right now */}
      <HotJobsByCity />

      {/* 6. Explore jobs by category — tiles filter Latest jobs in place,
          same pattern as the hero search / quick-discovery pills above. */}
      <CategoryGrid onSelect={applyJobFilters} />

      {/* 7. Jobs matching your profile — signed-in visitors only (see RecommendedForYou.jsx) */}
      <RecommendedForYou />

      {/* 8. Companies hiring through MZOBS (single, consolidated company section) */}
      <CompaniesHiring onSelect={applyJobFilters} />

      {/* 9. Employer CTA band */}
      <HomeEmployerCTA />

      <Footer />

      {/* Floating quick-links button */}
      <FloatingQuickNav />
    </div>
  )
}
