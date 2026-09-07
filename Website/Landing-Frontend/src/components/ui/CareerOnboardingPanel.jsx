import { ShieldCheck, Sparkles, FileText, MapPin, Briefcase } from 'lucide-react'

const BENEFITS = [
  { icon: ShieldCheck, title: 'Verified job opportunities', text: 'Every listing is checked before it goes live.' },
  { icon: Sparkles, title: 'Smart role matching', text: 'We surface roles that actually fit your profile.' },
  { icon: FileText, title: 'Resume and interview support', text: 'Get guidance to put your best profile forward.' },
]

// Left-side onboarding panel for the employee signup/signin pages — pure
// CSS shapes (no illustrations/stock art), a short pitch instead of a
// marketing paragraph, and a mocked "live opportunity" card as light
// social proof. Hidden on mobile in favour of a compact intro strip.
// Headline/subtitle are overridable so signin can reuse it with
// "welcome back" copy instead of the signup pitch.
export default function CareerOnboardingPanel({
  headline = 'Your next opportunity starts here.',
  subtitle = 'Create your profile, discover verified openings, and get matched with roles that fit your skills.',
  showBenefits = true,
  showJobPreview = true,
}) {
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

      <div className="relative">
        <span className="inline-flex items-center gap-1.5 text-[11px] font-black tracking-[0.16em] text-(--jobs-blue-dark) uppercase">
          MZOBS Careers
        </span>

        <h1 className="mt-4 text-[28px] sm:text-[32px] font-black leading-[1.15] text-(--jobs-navy) tracking-tight">
          {headline}
        </h1>

        <p className="mt-3 text-[14.5px] leading-relaxed text-(--jobs-ink-soft) max-w-sm">
          {subtitle}
        </p>
      </div>

      {showBenefits && (
        <div className="relative mt-9 flex flex-col gap-4">
          {BENEFITS.map(({ icon: Icon, title, text }) => (
            <div key={title} className="flex items-start gap-3">
              <div className="shrink-0 w-9 h-9 rounded-xl bg-white border border-(--jobs-border) flex items-center justify-center shadow-sm">
                <Icon size={16} strokeWidth={1.8} className="text-(--jobs-blue-dark)" />
              </div>
              <div>
                <p className="text-[13.5px] font-bold text-(--jobs-navy)">{title}</p>
                <p className="text-[12.5px] text-(--jobs-ink-soft) mt-0.5">{text}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {showJobPreview && (
        <div className="relative mt-auto pt-9">
          <div className="rounded-2xl bg-white border border-(--jobs-border) p-4 shadow-[0_1px_2px_rgba(16,42,67,0.04),0_16px_32px_-16px_rgba(16,42,67,0.16)]">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <div className="shrink-0 w-10 h-10 rounded-lg bg-(--jobs-teal-tint) flex items-center justify-center text-[12px] font-black text-(--jobs-teal-dark)">
                  TN
                </div>
                <div className="min-w-0">
                  <p className="text-[13.5px] font-bold text-(--jobs-navy) truncate">Frontend Engineer</p>
                  <p className="text-[12px] text-(--jobs-ink-soft) truncate">TechNova Solutions</p>
                </div>
              </div>
              <span className="shrink-0 inline-flex items-center h-5 px-2 rounded-full bg-(--jobs-teal-tint) text-[10px] font-black uppercase tracking-wide text-(--jobs-teal-dark)">
                New
              </span>
            </div>

            <div className="flex items-center gap-4 mt-3 pt-3 border-t border-(--jobs-border)">
              <span className="inline-flex items-center gap-1 text-[12px] font-semibold text-(--jobs-ink-soft)">
                <MapPin size={12} className="shrink-0" /> Bengaluru
              </span>
              <span className="inline-flex items-center gap-1 text-[12px] font-semibold text-(--jobs-ink-soft)">
                <Briefcase size={12} className="shrink-0" /> Hybrid
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
