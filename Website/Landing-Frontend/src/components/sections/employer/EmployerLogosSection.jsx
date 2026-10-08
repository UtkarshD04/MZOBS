import { useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ArrowUpRight, Building2 } from 'lucide-react'
import { FadeInView } from './employerMotion'
import { TRUSTED_LOGOS_DATA } from '../../../lib/content'

gsap.registerPlugin(ScrollTrigger)

export default function EmployerLogosSection() {
  const { badge, title, logos } = TRUSTED_LOGOS_DATA
  const gridRef = useRef(null)
  const ctaRef = useRef(null)

  // Cards reveal in sequence (not all at once), then the CTA fades up once
  // the last card has landed — a single ScrollTrigger pass, never repeated.
  useLayoutEffect(() => {
    const cards = gridRef.current?.children
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (reduce) {
      if (cards?.length) gsap.set(cards, { autoAlpha: 1, y: 0, scale: 1 })
      gsap.set(ctaRef.current, { autoAlpha: 1, y: 0 })
      return undefined
    }

    const ctx = gsap.context(() => {
      gsap.set(ctaRef.current, { autoAlpha: 0, y: 18 })
      if (!cards?.length) return
      gsap.fromTo(
        cards,
        { autoAlpha: 0, y: 26, scale: 0.96 },
        {
          autoAlpha: 1,
          y: 0,
          scale: 1,
          duration: 0.55,
          ease: 'power3.out',
          stagger: 0.09,
          scrollTrigger: { trigger: gridRef.current, start: 'top 90%', once: true },
          onComplete: () => gsap.to(ctaRef.current, { autoAlpha: 1, y: 0, duration: 0.5, ease: 'power2.out' }),
        }
      )
    }, gridRef)
    return () => ctx.revert()
  }, [])

  return (
    <section id="companies" className="relative overflow-hidden bg-(--explorer-bg) py-16 md:py-20 px-6 md:px-12">
      <div className="max-w-6xl mx-auto">
        <FadeInView className="text-center">
          {badge && (
            <span className="inline-flex items-center gap-2 rounded-full bg-(--explorer-blue-surface) px-3.5 py-1.5 text-[11.5px] font-bold tracking-wide text-(--explorer-blue)">
              <span className="h-1.5 w-1.5 rounded-full bg-current" aria-hidden="true" />
              {badge}
            </span>
          )}
          <h2 className="mt-4 text-2xl sm:text-3xl md:text-[34px] font-bold text-(--explorer-navy) tracking-tight leading-tight">
            {title}
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-[14.5px] text-(--explorer-muted) leading-relaxed">
            From renewable energy to steel and FMCG, real companies are already growing their teams on Mzobs.
          </p>
        </FadeInView>

        <div ref={gridRef} className="mt-10 grid grid-cols-2 gap-3.5 sm:grid-cols-3 md:grid-cols-4 lg:gap-5">
          {logos.map((logo) => (
            <div
              key={logo.name}
              className="group relative flex h-28 flex-col items-center justify-center gap-2.5 overflow-hidden rounded-2xl border border-(--explorer-border) bg-white p-4 shadow-[0_2px_10px_-4px_rgba(16,42,67,0.10)] transition-[transform,box-shadow,border-color] duration-[280ms] ease-out motion-safe:md:hover:-translate-y-1.5 md:hover:border-(--explorer-blue) md:hover:shadow-[0_20px_36px_-16px_rgba(11, 122, 109,0.38)]"
            >
              {/* Static top accent — always on, gives each card structure at rest */}
              <span
                className="absolute inset-x-0 top-0 h-[3px] scale-x-0 bg-(--explorer-blue) transition-transform duration-[320ms] ease-out md:group-hover:scale-x-100"
                aria-hidden="true"
              />
              {/* Subtle one-shot sheen, hover-only — not a loading shimmer */}
              <span
                className="pointer-events-none absolute inset-y-0 left-0 hidden w-1/3 bg-gradient-to-r from-transparent via-white/80 to-transparent opacity-0 md:group-hover:block md:group-hover:opacity-100 md:group-hover:[animation:mzCardSheen_0.9s_ease-out]"
                aria-hidden="true"
              />
              <img
                src={logo.logo}
                alt={logo.name}
                className="h-9 max-w-[82%] object-contain transition-transform duration-[280ms] ease-out motion-safe:md:group-hover:scale-[1.05]"
              />
              <span className="line-clamp-1 text-center text-[11px] font-semibold text-(--explorer-muted) transition-colors duration-[280ms] group-hover:text-(--explorer-navy)">
                {logo.name}
              </span>
              <span className="absolute bottom-2.5 right-2.5 grid h-6 w-6 place-items-center rounded-full bg-(--explorer-blue-surface) text-(--explorer-blue) opacity-50 transition-all duration-[280ms] ease-out motion-safe:md:group-hover:translate-x-0.5 md:group-hover:bg-(--explorer-blue) md:group-hover:text-white md:group-hover:opacity-100">
                <ArrowUpRight size={12} strokeWidth={2.4} aria-hidden="true" />
              </span>
            </div>
          ))}
        </div>

        <div ref={ctaRef} className="mt-9 flex justify-center">
          <span className="group inline-flex items-center gap-2.5 rounded-full bg-(--explorer-blue) px-5 py-2.5 text-[13.5px] font-semibold text-white shadow-[0_14px_28px_-14px_rgba(11, 122, 109,0.6)] transition-all duration-[280ms] ease-out motion-safe:hover:-translate-y-0.5 hover:bg-(--explorer-blue-hover) hover:shadow-[0_18px_34px_-14px_rgba(11, 122, 109,0.7)]">
            <Building2 size={15} aria-hidden="true" />
            {logos.length}+ companies hiring on Mzobs
            <ArrowUpRight
              size={15}
              className="transition-transform duration-[280ms] ease-out motion-safe:group-hover:translate-x-1.5"
              aria-hidden="true"
            />
          </span>
        </div>
      </div>
    </section>
  )
}
