import SectionHeading from './SectionHeading'

// Placeholder wordmarks (see src/lib/content.js TRUSTED_LOGOS) — swap for real
// client logo SVGs when available, same grid.
export default function LogoCloud({ eyebrow = 'TRUSTED BY', title = 'Companies Hiring on Mzobs', logos }) {
  return (
    <section className="bg-bg-secondary border-y border-border">
      <div className="max-w-6xl mx-auto px-6 py-16 sm:py-20">
        <SectionHeading eyebrow={eyebrow} title={title} className="mb-10" />

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 opacity-60">
          {logos.map((logo) => (
            <div key={logo} className="h-16 rounded-lg border border-border-strong bg-surface flex items-center justify-center px-3">
              <span className="text-[13px] font-bold tracking-tight text-ink-secondary text-center">{logo}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
