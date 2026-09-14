import { useState } from 'react'
import Seo from '../components/Seo'
import { STATIC_PAGE_SEO } from '../lib/seoData'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import FloatingQuickNav from '../components/ui/FloatingQuickNav'
import JobSearchHero from '../components/sections/home/JobSearchHero'
import QuickDiscoveryStrip from '../components/sections/home/QuickDiscoveryStrip'
import JobMarketplace from '../components/sections/home/JobMarketplace'
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
  // Was shared with LatestJobs.jsx (a results list driven by this exact
  // state) before that section was removed in favor of Job marketplace
  // below, which owns its own independent filter/search/category state.
  // Still lifted here and still fed by every entry point above the fold
  // (hero search, quick-discovery pills, category tiles, company cards)
  // because applyJobFilters' scroll-down handoff below is still genuinely
  // useful — but note none of those callers' search terms currently reach
  // Job marketplace's own filters, only the scroll does. Wiring that up is
  // follow-up work, not done here.
  const [jobFilters, setJobFilters] = useState(EMPTY_FILTERS)

  // Used by every entry point above the Job marketplace section
  // (quick-discovery pills, popular searches, category tiles, company
  // cards, and the hero search bar's own "Find jobs" — see
  // JobSearchHero.jsx) — jumps the visitor down to it and reflects the
  // search in the URL as a #latest-jobs hash (kept as-is on purpose:
  // JobDetail.jsx's "Back to jobs" links and any existing bookmarks
  // already point at it) instead of redirecting to the dashboard app.
  function applyJobFilters(next) {
    setJobFilters((prev) => ({ ...prev, ...normalizeFilters(next) }))
    if (typeof window !== 'undefined') window.history.replaceState(null, '', '#latest-jobs')
    document.getElementById('latest-jobs')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
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

      {/* 4. Job marketplace — the hero's momentum turned into a real,
          filterable place to browse actual openings (own search/category/
          filter state, real listings feed — see JobMarketplace.jsx) */}
      <JobMarketplace />

      {/* 5. Hot jobs by city — where hiring is happening right now */}
      <HotJobsByCity />

      {/* 6. Explore jobs by category — scrolls up to Job marketplace (see
          applyJobFilters above), same pattern as the hero search /
          quick-discovery pills. */}
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
