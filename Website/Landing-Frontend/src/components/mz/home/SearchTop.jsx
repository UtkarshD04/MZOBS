import { Container } from '../primitives'
import SearchBar from './SearchBar'

// The top of the homepage: no hero, just the search, sized so the job feed
// starts within the first screen.
export default function SearchTop({ filters, onSearch }) {
  return (
    <section id="job-search" aria-labelledby="search-title" className="relative border-b border-mz-line bg-white pb-7 pt-[88px] sm:pb-8 sm:pt-[96px]">
      <Container className="relative">
        <h1 id="search-title" className="text-mz-ink text-[30px] sm:text-[38px] lg:text-[44px] font-extrabold leading-[1.1] tracking-tight">
          Find your next job on Mzobs
        </h1>
        <p className="mt-2 max-w-2xl text-mz-muted text-[16px] sm:text-[17px] font-normal leading-relaxed">
          Live openings from employers hiring on Mzobs. Verified companies are marked on every listing.
        </p>

        <div className="mt-5">
          <SearchBar filters={filters} onSearch={onSearch} />
        </div>
      </Container>
    </section>
  )
}
