import { ShieldCheck, Sparkles, FileText } from 'lucide-react'

const STATS = [
  { value: '10,000+', label: 'Verified jobs' },
  { value: '500+', label: 'Companies hiring' },
  { value: '48h', label: 'Avg. match time' },
]

// Left-side onboarding panel for the employee signup/signin pages — a
// visual centerpiece (an orbiting "verified" badge cluster) and a stat row
// instead of a marketing paragraph + feature list, so this reads as a
// designed panel rather than generated copy. Hidden on mobile in favour of
// a compact intro strip.
export default function CareerOnboardingPanel() {
  return (
    <div className="relative h-full overflow-hidden rounded-3xl bg-(--jobs-blue-tint) border border-(--jobs-border) px-8 py-10 sm:px-10 sm:py-12 flex flex-col">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 -right-20 w-72 h-72 rounded-full bg-white/60 blur-2xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-10 -left-16 w-56 h-56 rounded-full border border-(--jobs-blue)/15"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/3 left-1/2 -translate-x-1/2 w-40 h-40 rounded-full border border-(--jobs-teal)/20"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.4] bg-[radial-gradient(circle,rgba(37,99,235,0.12)_1px,transparent_1px)] bg-size-[22px_22px]"
      />

      <span className="relative inline-flex items-center gap-1.5 text-[11px] font-black tracking-[0.16em] text-(--jobs-blue-dark) uppercase">
        MZOBS Careers
      </span>

      {/* Visual centerpiece — a "verified" badge orbited by the match/
          resume icons, standing in for the old headline + bullet copy. */}
      <div className="relative flex-1 flex items-center justify-center py-8">
        <div className="relative w-44 h-44 sm:w-52 sm:h-52">
          <div className="absolute inset-0 rounded-full border border-(--jobs-blue)/20" aria-hidden="true" />
          <div className="absolute inset-7 rounded-full border border-dashed border-(--jobs-teal)/35" aria-hidden="true" />

          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-[22px] bg-white border border-(--jobs-border) shadow-[0_1px_2px_rgba(16,42,67,0.04),0_20px_40px_-18px_rgba(16,42,67,0.25)] flex items-center justify-center">
              <ShieldCheck size={32} strokeWidth={1.6} className="text-(--jobs-blue-dark)" />
            </div>
          </div>

          <div className="absolute -top-1 -right-3 w-12 h-12 rounded-full bg-white border border-(--jobs-border) shadow-sm flex items-center justify-center">
            <Sparkles size={17} strokeWidth={1.8} className="text-(--jobs-teal-dark)" />
          </div>
          <div className="absolute -bottom-2 -left-4 w-12 h-12 rounded-full bg-white border border-(--jobs-border) shadow-sm flex items-center justify-center">
            <FileText size={17} strokeWidth={1.8} className="text-(--jobs-blue-dark)" />
          </div>
        </div>
      </div>

      {/* Stat row instead of sentences — same "verified / matched /
          supported" story, told in numbers. */}
      <div className="relative grid grid-cols-3 gap-3 pt-6 border-t border-(--jobs-blue)/15">
        {STATS.map((s) => (
          <div key={s.label}>
            <p className="text-[18px] sm:text-[19px] font-black text-(--jobs-navy) tracking-tight">{s.value}</p>
            <p className="mt-0.5 text-[11px] text-(--jobs-ink-soft) leading-snug">{s.label}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
