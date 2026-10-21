import { useCallback, useEffect, useRef, useState } from 'react'
import { ChevronLeft, ChevronRight, Quote, User } from 'lucide-react'
import { Container } from '../primitives'
import { fetchPublicTestimonials } from '../../../lib/testimonials'
import { DRAFT_CANDIDATE_STORIES } from '../../../lib/candidateStories'

const NAVY = '#183451'
const TEAL = '#078F80'

// Candidate photo, or a neutral circular placeholder until an approved photo
// exists. Set `photo` in lib/candidateStories.js (e.g. '/images/candidates/name.jpg')
// and this swaps to the real image automatically.
function Portrait({ name, photo, className = '' }) {
  const [failed, setFailed] = useState(false)
  if (photo && !failed) {
    return (
      <img
        src={photo}
        alt={`Photo of ${name}`}
        width={80}
        height={80}
        loading="lazy"
        decoding="async"
        onError={() => setFailed(true)}
        className={`object-cover object-top ${className}`}
      />
    )
  }
  return (
    <div
      role="img"
      aria-label={`Photo placeholder for ${name}`}
      className={`flex items-end justify-center overflow-hidden bg-[#EEF1F4] text-[#183451]/30 ${className}`}
    >
      <User className="h-[76%] w-[76%] translate-y-[10%]" strokeWidth={1} aria-hidden="true" />
    </div>
  )
}

function StoryCard({ story, index }) {
  return (
    <li
      data-card
      style={{ '--i': Math.min(index, 5) }}
      className="story-card group/card relative mt-10 flex shrink-0 snap-start list-none rounded-2xl border border-[#183451]/10 bg-white shadow-[0_1px_3px_rgba(24,52,81,0.05),0_10px_24px_-14px_rgba(24,52,81,0.16)] transition-[translate,box-shadow,border-color] duration-200 ease-out [flex-basis:var(--card-w)] hover:-translate-y-1 hover:border-[#078F80]/40 hover:shadow-[0_1px_3px_rgba(24,52,81,0.06),0_16px_30px_-14px_rgba(24,52,81,0.24)] motion-reduce:transition-none motion-reduce:hover:translate-y-0"
    >
      <figure className="m-0 flex w-full flex-col px-6 pb-6 pt-14">
        <Portrait
          name={story.name}
          photo={story.photo}
          className="story-avatar absolute left-1/2 top-0 h-20 w-20 -translate-x-1/2 -translate-y-1/2 rounded-full border-4 border-white ring-1 ring-[#183451]/10"
        />
        <Quote className="h-7 w-7 shrink-0 opacity-80 transition-opacity duration-200 group-hover/card:opacity-100" style={{ color: TEAL }} fill="currentColor" strokeWidth={0} aria-hidden="true" />
        <blockquote className="m-0 mt-3 flex-1 break-words text-[15px] leading-[1.65] text-[#344054]">{story.feedback}</blockquote>
        <figcaption className="mt-5 border-t border-[#183451]/10 pt-4">
          <p className="m-0 break-words text-[16px] font-bold leading-snug" style={{ color: NAVY }}>{story.name}</p>
          {story.tagline && <p className="m-0 mt-1 break-words text-[14px] font-medium leading-snug text-[#078F80] transition-colors duration-200 group-hover/card:text-[#056a5f]">{story.tagline}</p>}
        </figcaption>
      </figure>
    </li>
  )
}

function Carousel({ stories }) {
  const trackRef = useRef(null)
  const [active, setActive] = useState(0)
  const [positions, setPositions] = useState(stories.length)
  const [atStart, setAtStart] = useState(true)
  const [atEnd, setAtEnd] = useState(false)

  const update = useCallback(() => {
    const el = trackRef.current
    if (!el) return
    const max = el.scrollWidth - el.clientWidth
    const card = el.querySelector('[data-card]')
    const pitch = card ? card.offsetWidth + (parseFloat(getComputedStyle(el).columnGap) || 0) : 0
    const visible = pitch ? Math.max(1, Math.round((el.clientWidth + (pitch - card.offsetWidth)) / pitch)) : 1
    const count = Math.max(1, stories.length - visible + 1)
    setPositions(count)
    const idx = pitch ? Math.round(el.scrollLeft / pitch) : 0
    setActive(max <= 2 ? 0 : el.scrollLeft >= max - 2 ? count - 1 : Math.min(idx, count - 1))
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

  const busy = useRef(false)

  // DepthFlow + Cascade: the visible cards ease out one after another (a short
  // slide away, slight push back in depth, fade), the track jumps to the new
  // position, then the new visible cards cascade in from the opposite side.
  // Plain Web Animations on transform/opacity only; the track is clipped while it
  // runs so the sliding cards can't create horizontal overflow, and clicks that
  // arrive mid-transition are ignored.
  const moveTo = async (target) => {
    const el = trackRef.current
    if (!el || busy.current) return
    const max = el.scrollWidth - el.clientWidth
    const left = Math.max(0, Math.min(max, target))
    if (Math.abs(left - el.scrollLeft) < 2) return
    const dir = left > el.scrollLeft ? 1 : -1
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || typeof el.animate !== 'function') {
      el.scrollTo({ left, behavior: 'instant' })
      return
    }
    const visible = () => {
      const box = el.getBoundingClientRect()
      const cards = [...el.querySelectorAll('[data-card]')].filter((c) => {
        const r = c.getBoundingClientRect()
        return r.right > box.left + 8 && r.left < box.right - 8
      })
      // Cascade follows the direction of travel.
      return dir > 0 ? cards : cards.reverse()
    }
    busy.current = true
    el.style.overflowX = 'hidden'
    try {
      const out = visible().map((c, i) =>
        c.animate(
          [
            { opacity: 1, transform: 'translate3d(0,0,0) scale(1)' },
            { opacity: 0, transform: `translate3d(${-dir * 28}px,0,-60px) scale(0.96)` },
          ],
          { duration: 200, delay: i * 40, easing: 'cubic-bezier(0.4,0,1,1)', fill: 'forwards' },
        ),
      )
      await Promise.all(out.map((a) => a.finished))
      el.scrollTo({ left, behavior: 'instant' })
      const incoming = visible().map((c, i) =>
        c.animate(
          [
            { opacity: 0, transform: `translate3d(${dir * 48}px,14px,-60px) scale(0.96)` },
            { opacity: 1, transform: 'translate3d(0,0,0) scale(1)' },
          ],
          { duration: 380, delay: i * 80, easing: 'cubic-bezier(0.22,1,0.36,1)', fill: 'backwards' },
        ),
      )
      out.forEach((a) => a.cancel())
      await Promise.all(incoming.map((a) => a.finished))
    } catch {
      // An interrupted animation (e.g. unmount) just snaps to the target.
      el.scrollTo({ left, behavior: 'instant' })
    } finally {
      el.style.overflowX = ''
      busy.current = false
    }
  }

  const goTo = (i) => {
    const el = trackRef.current
    const card = el?.querySelectorAll('[data-card]')[i]
    if (card) moveTo(card.offsetLeft - el.offsetLeft)
  }

  const step = (dir) => {
    const el = trackRef.current
    const card = el?.querySelector('[data-card]')
    if (!el || !card) return
    const gap = parseFloat(getComputedStyle(el).columnGap) || 0
    moveTo(el.scrollLeft + dir * (card.offsetWidth + gap))
  }

  const onKeyDown = (e) => {
    if (e.key === 'ArrowRight') { e.preventDefault(); step(1) }
    else if (e.key === 'ArrowLeft') { e.preventDefault(); step(-1) }
    else if (e.key === 'Home') { e.preventDefault(); goTo(0) }
    else if (e.key === 'End') { e.preventDefault(); goTo(positions - 1) }
  }

  const arrow =
    'flex h-10 w-10 items-center justify-center rounded-full border transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#078F80] disabled:cursor-not-allowed disabled:opacity-40'
  const arrowGhost = `${arrow} border-[#183451]/15 bg-white text-[#183451] hover:border-[#078F80] hover:text-[#078F80] disabled:hover:border-[#183451]/15 disabled:hover:text-[#183451]`
  const arrowPrimary = `${arrow} border-[#078F80] bg-[#078F80] text-white hover:bg-[#067a6d]`

  return (
    <div role="region" aria-roledescription="carousel" aria-label="Candidate stories">
      <ul
        ref={trackRef}
        tabIndex={0}
        onScroll={update}
        onKeyDown={onKeyDown}
        aria-label="Candidate stories — use left and right arrow keys to browse"
        style={{ '--gap': '24px', perspective: '1200px' }}
        className="m-0 flex snap-x snap-mandatory gap-[var(--gap)] overflow-x-auto overscroll-x-contain -mt-1 p-0 pb-3 pt-1 [--card-w:100%] [scrollbar-width:none] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#078F80] sm:[--card-w:calc((100%-var(--gap))/2)] lg:[--card-w:calc((100%-2*var(--gap))/3)] [&::-webkit-scrollbar]:hidden"
      >
        {stories.map((s, i) => (
          <StoryCard key={s.id} story={s} index={i} />
        ))}
      </ul>

      <div className="relative mt-4 flex items-center justify-center">
        <div className="flex items-center gap-1" role="group" aria-label="Choose story">
          {positions > 1 && stories.slice(0, positions).map((s, i) => (
            <button
              key={s.id}
              type="button"
              onClick={() => goTo(i)}
              aria-label={`Show story ${i + 1} of ${positions}`}
              aria-current={i === active || undefined}
              className="flex h-8 w-6 items-center justify-center focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#078F80]"
            >
              <span className={`h-2 w-2 rounded-full transition-colors ${i === active ? 'bg-[#078F80]' : 'bg-[#183451]/20'}`} />
            </button>
          ))}
        </div>
        <div className="absolute right-0 top-1/2 flex -translate-y-1/2 gap-3 max-sm:static max-sm:ml-6 max-sm:translate-y-0">
          <button type="button" className={arrowGhost} onClick={() => step(-1)} disabled={atStart} aria-label="Previous stories">
            <ChevronLeft className="h-5 w-5" aria-hidden="true" />
          </button>
          <button type="button" className={`${arrowPrimary} disabled:!border-[#183451]/15 disabled:!bg-white disabled:!text-[#183451]`} onClick={() => step(1)} disabled={atEnd} aria-label="Next stories">
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
  const sectionRef = useRef(null)
  const [reveal, setReveal] = useState('in') // 'in' = visible; 'pending' hides until scrolled into view

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

  // One-shot entrance: arm only when the section is below the fold, and fall
  // back to visible if the observer is unavailable or never fires.
  useEffect(() => {
    const el = sectionRef.current
    if (!el || typeof IntersectionObserver === 'undefined' || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const r = el.getBoundingClientRect()
    if (r.top < window.innerHeight * 0.85) return
    setReveal('pending')
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setReveal('in')
          io.disconnect()
        }
      },
      { threshold: 0.15 },
    )
    io.observe(el)
    const failsafe = setTimeout(() => setReveal('in'), 8000)
    return () => {
      io.disconnect()
      clearTimeout(failsafe)
    }
  }, [])

  // Approved testimonials from the API win; the editable drafts fill in until then.
  const list = stories === null ? null : stories.length > 0 ? stories : DRAFT_CANDIDATE_STORIES
  // A story staff flagged as featured opens first.
  const ordered = list ? [...list].sort((a, b) => Number(!!b.featured) - Number(!!a.featured)) : null

  return (
    <section ref={sectionRef} data-reveal={reveal} id="success-stories" aria-labelledby="stories-title" className="relative scroll-mt-20 overflow-hidden border-t border-[#183451]/10 bg-white py-10 lg:py-14">
      <Container>
        <div className="story-head mx-auto max-w-2xl text-center">
          <p className="text-[12px] font-semibold uppercase tracking-[0.18em]" style={{ color: NAVY }}>
            Real stories. Real career journeys.
          </p>
          <h2 id="stories-title" className="mt-2 text-[28px] font-extrabold leading-[1.1] tracking-[-0.02em] sm:text-[34px] lg:text-[40px]" style={{ color: NAVY }}>
            What Our <span style={{ color: TEAL }}>Candidates Say</span>
          </h2>
          <p className="mx-auto mt-2.5 max-w-[30rem] text-balance text-[14.5px] font-normal leading-[1.6] text-[#475467] sm:max-w-none sm:text-[15px]">
            Behind every career move is a story of ambition, growth, and new possibilities.
            <br className="hidden sm:block" />{' '}
            Discover the journeys shaped with <span className="font-semibold" style={{ color: NAVY }}>Mzobs</span>.
          </p>
          {isFixture && (
            <p className="mt-4 inline-block rounded bg-amber-100 px-2.5 py-1 text-[12px] font-medium text-amber-900">
              Local layout fixtures (?demo-stories) — not real testimonials
            </p>
          )}
        </div>

        <div className="mt-6">
          {ordered === null ? (
            <div className="h-56 rounded-2xl border border-[#183451]/10 bg-white/70 motion-safe:animate-pulse" aria-hidden="true" />
          ) : (
            <Carousel stories={ordered} />
          )}
        </div>
      </Container>
    </section>
  )
}
