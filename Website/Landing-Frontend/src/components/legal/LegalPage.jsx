import { Link } from 'react-router-dom'
import Seo from '../Seo'
import { STATIC_PAGE_SEO } from '../../lib/seoData'
import Navbar from '../layout/Navbar'
import Footer from '../layout/Footer'
import SectionLabel from '../ui/SectionLabel'
import Reveal from '../ui/Reveal'

// Block types: { p } paragraph | { h } subheading | { ul: [] } bullets | { ol: [] } numbered list
// A section may also carry `after` (any JSX rendered below its blocks).

const slug = (i) => `section-${i + 1}`

function Blocks({ blocks }) {
  return blocks.map((b, i) => {
    if (b.h) {
      return (
        <h3 key={i} className="text-[16.5px] font-black text-(--explorer-navy) pt-2">
          {b.h}
        </h3>
      )
    }
    if (b.ul) {
      return (
        <ul key={i} className="space-y-1.5 pl-1">
          {b.ul.map((item) => (
            <li key={item} className="flex gap-2.5 text-[15.5px] text-(--explorer-navy)/75 leading-relaxed font-medium">
              <span className="mt-[10px] h-1 w-1 rounded-full bg-(--explorer-blue) shrink-0" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      )
    }
    if (b.ol) {
      return (
        <ol key={i} className="space-y-1.5 pl-1">
          {b.ol.map((item, n) => (
            <li key={item} className="flex gap-2.5 text-[15.5px] text-(--explorer-navy)/75 leading-relaxed font-medium">
              <span className="font-black text-(--explorer-blue) tabular-nums w-5 shrink-0">{n + 1}.</span>
              <span>{item}</span>
            </li>
          ))}
        </ol>
      )
    }
    return (
      <p key={i} className="text-[15.5px] text-(--explorer-navy)/75 leading-relaxed font-medium">
        {b.p}
      </p>
    )
  })
}

export default function LegalPage({ seoPath, label, titleLead, titleAccent, lastUpdated, effectiveDate, intro, sections, seeAlso }) {
  return (
    <div className="min-h-screen bg-white text-(--explorer-navy) font-sans antialiased selection:bg-blue-200">
      <Seo path={seoPath} {...STATIC_PAGE_SEO[seoPath]} />
      <Navbar />

      <section className="hero-atmosphere relative pt-32 pb-16 md:pt-40 md:pb-20 overflow-hidden">
        <div className="relative z-10 max-w-3xl mx-auto px-6 md:px-10 text-center">
          <Reveal direction="up" duration={0.7} scale={0.96} blur>
            <SectionLabel>{label}</SectionLabel>
            <h1 className="text-[34px] sm:text-[44px] lg:text-[50px] font-extrabold leading-[1.08] tracking-tight text-balance text-(--explorer-navy)">
              {titleLead}{' '}
              <span
                style={{ backgroundImage: 'var(--hero-cta-gradient)', WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent' }}
              >
                {titleAccent}
              </span>
              .
            </h1>
            <p className="text-[15px] text-(--explorer-muted) font-medium mt-4">
              {effectiveDate && <>Effective: {effectiveDate} · </>}Last updated: {lastUpdated}
            </p>
            <div className="mt-5 space-y-3">{intro}</div>
          </Reveal>
        </div>
      </section>

      <section className="bg-(--explorer-bg) py-14 md:py-16">
        <div className="max-w-6xl mx-auto px-6 md:px-10">
          <div className="grid lg:grid-cols-[290px_minmax(0,1fr)] gap-10 lg:gap-14 items-start">
            <nav
              aria-label={`${label} sections`}
              className="lg:sticky lg:top-24 lg:max-h-[calc(100vh-120px)] lg:overflow-y-auto rounded-2xl border border-(--explorer-border) bg-white p-5 shadow-[0_10px_30px_-18px_rgba(16,50,79,0.3)]"
            >
              <p className="text-[12px] font-black uppercase tracking-widest text-(--explorer-muted) mb-3">On this page</p>
              <ol className="space-y-1.5">
                {sections.map((s, i) => (
                  <li key={s.title}>
                    <a
                      href={`#${slug(i)}`}
                      className="flex gap-2 text-[14px] leading-snug font-semibold text-(--explorer-navy)/75 hover:text-(--explorer-blue) transition-colors"
                    >
                      <span className="text-(--explorer-muted)/60 tabular-nums w-6 shrink-0">{i + 1}.</span>
                      <span>{s.title}</span>
                    </a>
                  </li>
                ))}
              </ol>
            </nav>

            <div className="space-y-10 min-w-0">
              {sections.map((section, i) => (
                <Reveal key={section.title} direction="up" duration={0.6} scale={0.98}>
                  <div id={slug(i)} className="scroll-mt-25">
                    <h2 className="text-[22px] font-black text-(--explorer-navy) mb-3">
                      {i + 1}. {section.title}
                    </h2>
                    <div className="space-y-3">
                      <Blocks blocks={section.blocks} />
                      {section.after}
                    </div>
                  </div>
                </Reveal>
              ))}

              {seeAlso && (
                <Reveal direction="up" duration={0.6} scale={0.98}>
                  <p className="text-[14.5px] text-(--explorer-muted) font-medium">
                    See also our{' '}
                    <Link to={seeAlso.to} className="text-(--explorer-blue) font-bold hover:underline">
                      {seeAlso.label}
                    </Link>
                    .
                  </p>
                </Reveal>
              )}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
