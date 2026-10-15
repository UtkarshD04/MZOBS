import { useCallback, useEffect, useRef, useState } from 'react'
import { ChevronLeft, ChevronRight, Quote, User } from 'lucide-react'
import { Container } from '../primitives'
import { fetchPublicTestimonials } from '../../../lib/testimonials'
import { DRAFT_CANDIDATE_STORIES } from '../../../lib/candidateStories'

const NAVY = '#183451'
const TEAL = '#078F80'

// A candidate's photograph, or — until an approved photo exists — a clearly
// replaceable portrait slot (neutral silhouette, never initials). Set `photo`
// in lib/candidateStories.js and this swaps to the real image automatically.
function Portrait({ name, photo, tone = 'mint', className = '' }) {
  const [failed, setFailed] = useState(false)
  if (photo && !failed) {
    return (
      <img
        src={photo}
        alt={`Photo of ${name}`}
        loading="lazy"
        decoding="async"
        onError={() => setFailed(true)}
        className={`object-cover object-top ${className}`}
      />
    )
  }
  const tones = {
    mint: 'bg-[#DDF1EC] text-[#078F80]/55',
    sand: 'bg-[#EFE7DA] text-[#183451]/35',
  }
  return (
    <div
      role="img"
      aria-label={`Photo placeholder for ${name}`}
      className={`flex items-end justify-center overflow-hidden ${tones[tone]} ${className}`}
    >
      <User className="h-[78%] w-[78%] translate-y-[8%]" strokeWidth={0.8} aria-hidden="true" />
    </div>
  )
}

const TONES = ['mint', 'sand']

function StoryCard({ story, index }) {
  return (
    <li
      data-card
      className="group relative flex shrink-0 snap-start list-none overflow-hidden rounded-[24px] border border-[#183451]/10 bg-white shadow-[0_2px_4px_rgba(24,52,81,0.04),0_12px_28px_-12px_rgba(24,52,81,0.14)] transition duration-300 [flex-basis:var(--card-w)] hover:-translate-y-1 hover:shadow-[0_2px_4px_rgba(24,52,81,0.04),0_20px_36px_-14px_rgba(24,52,81,0.22)] motion-reduce:transition-none motion-reduce:hover:translate-y-0"
    >
      <figure className="m-0 flex min-h-[170px] w-full">
        <Portrait
          name={story.name}
          photo={story.photo}
          tone={TONES[index % TONES.length]}
          className="m-2 w-[30%] shrink-0 rounded-[18px]"
        />
        <div className="flex min-w-0 flex-1 flex-col py-3 pl-1 pr-4">
          <Quote className="h-4 w-4 shrink-0" style={{ color: TEAL }} fill="currentColor" strokeWidth={0} aria-hidden="true" />
          <blockquote className="m-0 mt-1.5 break-words text-[14px] leading-[1.5] text-[#344054]">{story.feedback}</blockquote>
          <figcaption className="mt-auto border-t border-[#183451]/10 pt-2">
            <p className="m-0 break-words text-[16px] font-bold leading-snug" style={{ color: NAVY }}>{story.name}</p>
            {story.tagline && <p className="m-0 mt-0.5 break-words text-[13px] font-semibold leading-snug" style={{ color: TEAL }}>{story.tagline}</p>}
            {story.placementVerified && <p className="m-0 mt-1 text-[12.5px] text-[#475467]">Placed through Mzobs</p>}
          </figcaption>
        </div>
      </figure>
    </li>
  )
}

function Carousel({ stories }) {
  const trackRef = useRef(null)
  const [active, setActive] = useState(0)
  const [atStart, setAtStart] = useState(true)
  const [atEnd, setAtEnd] = useState(false)

  const update = useCallback(() => {
    const el = trackRef.current
    if (!el) return
    const max = el.scrollWidth - el.clientWidth
    const progress = max > 0 ? el.scrollLeft / max : 0
    setActive(Math.round(progress * (stories.length - 1)))
    setAtStart(el.scrollLeft <= 2)
    setAtEnd(max <= 2 || el.scrollLeft >= max - 2)
  }, [stories.length])

  useEffect(() => {
    update()
    const el = trackRef.current
    if (!el) return
    const ro = new ResizeObserver(update)
    ro.observe(el)
    return () => ro.disconnect()
  }, [update])

  const behavior = () => (window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth')

  const goTo = (i) => {
    const el = trackRef.current
    const card = el?.querySelectorAll('[data-card]')[i]
    if (card) el.scrollTo({ left: card.offsetLeft - el.offsetLeft, behavior: behavior() })
  }

  const step = (dir) => {
    const el = trackRef.current
    const card = el?.querySelector('[data-card]')
    if (!el || !card) return
    const gap = parseFloat(getComputedStyle(el).columnGap) || 0
    el.scrollBy({ left: dir * (card.offsetWidth + gap), behavior: behavior() })
  }

  const onKeyDown = (e) => {
    if (e.key === 'ArrowRight') { e.preventDefault(); step(1) }
    else if (e.key === 'ArrowLeft') { e.preventDefault(); step(-1) }
    else if (e.key === 'Home') { e.preventDefault(); goTo(0) }
    else if (e.key === 'End') { e.preventDefault(); goTo(stories.length - 1) }
  }

  const arrow =
    'flex h-10 w-10 items-center justify-center rounded-full border border-[#183451]/15 bg-white text-[#183451] shadow-sm transition hover:border-[#078F80] hover:text-[#078F80] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#078F80] disabled:cursor-not-allowed disabled:opacity-35 disabled:hover:border-[#183451]/15 disabled:hover:text-[#183451]'

  return (
    <div role="region" aria-roledescription="carousel" aria-label="Candidate stories">
      <ul
        ref={trackRef}
        tabIndex={0}
        onScroll={update}
        onKeyDown={onKeyDown}
        aria-label="Candidate stories — use left and right arrow keys to browse"
        style={{ '--gap': '20px' }}
        className="m-0 flex snap-x snap-mandatory gap-[var(--gap)] overflow-x-auto overscroll-x-contain scroll-smooth p-0 py-1.5 [--card-w:100%] [scrollbar-width:none] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#078F80] sm:[--card-w:calc((100%-var(--gap))/2.12)] lg:[--card-w:calc((100%-2*var(--gap))/3.12)] [&::-webkit-scrollbar]:hidden"
      >
        {stories.map((s, i) => (
          <StoryCard key={s.id} story={s} index={i} />
        ))}
      </ul>

      <div className="mt-1 flex items-center justify-between gap-4">
        <div className="flex items-center gap-1" role="group" aria-label="Choose story">
          {stories.map((s, i) => (
            <button
              key={s.id}
              type="button"
              onClick={() => goTo(i)}
              aria-label={`Show ${s.name}`}
              aria-current={i === active || undefined}
              className="flex h-8 w-6 items-center justify-center focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#078F80]"
            >
              <span className={`h-2 rounded-full transition-all ${i === active ? 'w-6 bg-[#078F80]' : 'w-2 bg-[#183451]/20'}`} />
            </button>
          ))}
        </div>
        <div className="flex gap-3">
          <button type="button" className={arrow} onClick={() => step(-1)} disabled={atStart} aria-label="Previous stories">
            <ChevronLeft className="h-5 w-5" aria-hidden="true" />
          </button>
          <button type="button" className={arrow} onClick={() => step(1)} disabled={atEnd} aria-label="Next stories">
            <ChevronRight className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  )
}

export default function SuccessStoriesSection() {
  const [stories, setStories] = useState(null) // null = loading
  const [isFixture, setIsFixture] = useState(false)

  useEffect(() => {
    const controller = new AbortController()
    // Developer-only: `?demo-stories` on a local dev server swaps in layout
    // fixtures. The whole branch is dead code in production builds.
    if (import.meta.env.DEV && new URLSearchParams(window.location.search).has('demo-stories')) {
      import('../../../lib/testimonials.devFixtures').then((m) => {
        setStories(m.DEV_FIXTURES)
        setIsFixture(true)
      })
      return
    }
    fetchPublicTestimonials({ signal: controller.signal })
      .then(setStories)
      .catch((err) => {
        if (err?.name !== 'AbortError') setStories([])
      })
    return () => controller.abort()
  }, [])

  // Approved testimonials from the API win; the editable drafts fill in until then.
  const list = stories === null ? null : stories.length > 0 ? stories : DRAFT_CANDIDATE_STORIES
  // A story staff flagged as featured opens first.
  const ordered = list ? [...list].sort((a, b) => Number(!!b.featured) - Number(!!a.featured)) : null

  return (
    <section id="success-stories" aria-labelledby="stories-title" className="relative scroll-mt-20 overflow-hidden border-t border-[#e8e2d8] bg-[#F8F5F0] py-6 lg:py-7">
      <div aria-hidden="true" className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full border-[40px] border-[#078F80]/[0.06]" />
      <div aria-hidden="true" className="pointer-events-none absolute -bottom-32 -left-20 h-64 w-64 rounded-full bg-[#078F80]/[0.05]" />
      <Container className="relative">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-[12px] font-semibold uppercase tracking-[0.18em]" style={{ color: TEAL }}>
            Real stories. Real career journeys.
          </p>
          <h2 id="stories-title" className="mt-1.5 text-[22px] font-black leading-[1.1] tracking-[-0.03em] sm:text-[26px] lg:text-[30px]" style={{ color: NAVY }}>
            Big Dreams. <span style={{ color: TEAL }}>New Beginnings.</span>
          </h2>
          <p className="mt-1.5 text-[14px] leading-snug text-[#475467] sm:text-[15px]">
            Every opportunity opens a new chapter. Discover the stories of candidates moving forward with Mzobs.
          </p>
          {isFixture && (
            <p className="mt-4 inline-block rounded bg-amber-100 px-2.5 py-1 text-[12px] font-medium text-amber-900">
              Local layout fixtures (?demo-stories) — not real testimonials
            </p>
          )}
        </div>

        <div className="mt-4">
          {ordered === null ? (
            <div className="h-44 rounded-[24px] border border-[#183451]/10 bg-white/70 motion-safe:animate-pulse" aria-hidden="true" />
          ) : (
            <Carousel stories={ordered} />
          )}
        </div>
      </Container>
    </section>
  )
}
