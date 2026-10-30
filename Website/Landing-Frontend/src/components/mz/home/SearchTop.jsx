import { Container } from '../primitives'
import SearchBar from './SearchBar'

// The top of the homepage: no hero, just the search, sized so the job feed
// starts within the first screen. A soft mint wash plus a faint diagonal-line
// texture on the right gives it colour without competing with the search.
export default function SearchTop({ filters, onSearch }) {
  return (
    <section
      id="job-search"
      aria-labelledby="search-title"
      className="relative border-b border-[#D3E9E2] bg-[linear-gradient(180deg,#DBF0E9_0%,#E9F6F2_55%,#F5FAFA_100%)] pb-8 pt-[88px] sm:pb-10 sm:pt-[100px]"
    >
      {/* Clipped here, not on the section, so the search dropdowns can overflow it. */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <div
          className="absolute inset-y-0 right-0 w-[60%] mask-[radial-gradient(ellipse_at_top_right,black_20%,transparent_75%)]"
          style={{ backgroundImage: 'repeating-linear-gradient(135deg, rgba(11,122,109,0.18) 0 1.5px, transparent 1.5px 14px)' }}
        />
      </div>

      <Container className="relative">
        <h1 id="search-title" className="text-mz-ink text-[30px] sm:text-[38px] lg:text-[44px] font-extrabold leading-[1.1] tracking-tight">
          Your ambition deserves the{' '}
          <span className="relative inline-block whitespace-nowrap text-mz-primary">
            real job
            <svg className="absolute -bottom-2 left-0 h-[10px] w-full" viewBox="0 0 200 10" preserveAspectRatio="none" fill="none" aria-hidden="true">
              <path d="M2 7 C 50 2, 120 2, 198 6" stroke="#F2B544" strokeWidth="4" strokeLinecap="round" />
            </svg>
          </span>{' '}
          . Let&apos;s find it.
        </h1>
        <p className="mt-3 max-w-2xl text-mz-ink-2 text-[16px] sm:text-[17px] font-normal leading-relaxed">
          Live openings from employers hiring on Mzobs. Verified companies are marked on every listing.
        </p>

        <div className="mt-6 rounded-[12px] shadow-[0_12px_32px_-18px_rgba(11,95,85,0.35)]">
          <SearchBar filters={filters} onSearch={onSearch} />
        </div>
      </Container>
    </section>
  )
}
