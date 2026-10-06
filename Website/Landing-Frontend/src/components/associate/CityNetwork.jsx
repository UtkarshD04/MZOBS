import { MapPin } from 'lucide-react'
import { Container, Reveal } from '../mz/primitives'
import { HOT_CITIES_DATA } from '../../lib/content'

// Real cities already tracked elsewhere on the site (see HOT_CITIES_DATA in
// lib/content.js) — not an invented list, since Mzobs doesn't claim
// operating cities that aren't already reflected in the live job data.
const CITY_SLUGS = ['delhi-ncr', 'mumbai', 'bengaluru', 'chennai', 'hyderabad', 'pune', 'kolkata', 'lucknow']
const CITIES = CITY_SLUGS.map((slug) => HOT_CITIES_DATA.cities.find((c) => c.slug === slug)?.city).filter(Boolean)

// 8 points evenly spaced on a 150-radius circle around a 400x400 viewBox
// center — an abstract network, not a literal map, so no claim is made
// about real geography.
const RADIUS = 150
const CENTER = 200
const NODES = CITIES.map((city, i) => {
  const angle = (-90 + i * (360 / CITIES.length)) * (Math.PI / 180)
  return { city, x: CENTER + RADIUS * Math.cos(angle), y: CENTER + RADIUS * Math.sin(angle) }
})

export default function CityNetwork() {
  return (
    <section className="relative overflow-hidden bg-[#101828] py-16 text-white lg:py-24">
      <div className="assoc-blob assoc-drift left-1/4 top-0 h-[360px] w-[360px] bg-[#2563EB]/20" aria-hidden="true" />
      <div className="assoc-blob assoc-drift right-1/4 bottom-0 h-[320px] w-[320px] bg-[#0F8F83]/18" aria-hidden="true" style={{ animationDelay: '4s' }} />
      <div className="mz-grid-bg-dark absolute inset-0" aria-hidden="true" />

      <Container className="relative">
        <Reveal className="mx-auto max-w-xl text-center">
          <h2 className="text-[28px] font-extrabold leading-[1.15] tracking-[-0.02em] sm:text-[36px]">From your city to every opportunity.</h2>
          <p className="mt-3 text-[15px] leading-relaxed text-white/65">
            Great talent and real opportunities can connect from anywhere — Mzobs brings placement partners and employers together, city by city.
          </p>
        </Reveal>

        <Reveal delay={0.1} className="relative mx-auto mt-12 aspect-square w-full max-w-[520px]">
          <svg viewBox="0 0 400 400" className="absolute inset-0 h-full w-full" aria-hidden="true">
            {NODES.map((node) => (
              <line
                key={node.city}
                className="assoc-line"
                x1={CENTER}
                y1={CENTER}
                x2={node.x}
                y2={node.y}
                stroke="#6366F1"
                strokeWidth="1.3"
                opacity="0.45"
              />
            ))}
          </svg>

          <div className="assoc-node-glow absolute left-1/2 top-1/2 h-24 w-24 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#4F46E5]/40 blur-xl" aria-hidden="true" />
          <div className="absolute left-1/2 top-1/2 flex h-[72px] w-[72px] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-gradient-to-br from-[#2563EB] to-[#4F46E5] text-[13px] font-extrabold shadow-[0_18px_40px_-12px_rgba(37,99,235,0.6)]">
            Mzobs
          </div>

          {NODES.map((node, i) => (
            <div
              key={node.city}
              className={`assoc-glass-dark absolute flex -translate-x-1/2 -translate-y-1/2 items-center gap-1.5 rounded-full px-3 py-1.5 ${i % 2 === 0 ? 'assoc-floating' : 'assoc-floating-slow'}`}
              style={{ left: `${(node.x / 400) * 100}%`, top: `${(node.y / 400) * 100}%`, animationDelay: `${i * 0.3}s` }}
            >
              <MapPin size={12} className="shrink-0 text-[#2563EB]" aria-hidden="true" />
              <span className="whitespace-nowrap text-[11.5px] font-bold text-white">{node.city}</span>
            </div>
          ))}
        </Reveal>
      </Container>
    </section>
  )
}
