import { Container } from '../primitives'
import SearchBar from './SearchBar'

// The top of the homepage: no hero, just the search, sized so the job feed
// starts within the first screen.
export default function SearchTop({ filters, onSearch }) {
  return (
    <section
      id="job-search"
      aria-labelledby="search-title"
      className="relative border-b border-[#DCE5EC] bg-gradient-to-br from-white via-[#E3F3FF] to-[#CFF1E9] pb-7 pt-[88px] sm:pb-8 sm:pt-[96px]"
    >
      {/* Clip the decorative blobs here, not on the section, so the search dropdowns can overflow it. */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <div className="pointer-events-none absolute -right-16 -top-24 h-80 w-80 rounded-full bg-[#12A89D]/35 blur-2xl" aria-hidden="true" />
        <div className="pointer-events-none absolute -left-24 bottom-[-40px] h-64 w-64 rounded-full bg-[#9b8cf0]/30 blur-2xl" aria-hidden="true" />

        <div
          className="pointer-events-none absolute inset-0 opacity-[0.35] [mask-image:linear-gradient(to_bottom,black,transparent_85%)]"
          style={{ backgroundImage: 'radial-gradient(#12304A1f 1px, transparent 1px)', backgroundSize: '22px 22px' }}
          aria-hidden="true"
        />
      </div>

      <Container className="relative">
        <h1 id="search-title" className="text-[26px] font-bold leading-tight tracking-[-0.02em] text-[#12304A] sm:text-[44px]">
          Your ambition deserves the <span className="bg-gradient-to-r from-[#078B7D] to-[#12A89D] bg-clip-text text-transparent">right job.</span>
        </h1>
        <p className="mt-2 max-w-2xl text-[15px] leading-relaxed text-mz-muted">
          Live openings from employers hiring on Mzobs. Verified companies are marked on every listing.
        </p>

        <div className="relative mt-5">
          <div className="pointer-events-none absolute -inset-x-4 -inset-y-3 -z-10 rounded-[20px] bg-[#12A89D]/[0.06] blur-xl" aria-hidden="true" />
          <SearchBar filters={filters} onSearch={onSearch} />
        </div>
      </Container>
    </section>
  )
}
