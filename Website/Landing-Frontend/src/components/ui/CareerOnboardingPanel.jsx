// Left-side onboarding panel for the employee signup/signin pages — a
// single illustration (a stack of abstract job-card shapes) instead of any
// headline, pitch copy, or stat numbers, so this reads as a designed visual
// rather than generated marketing text. Hidden on mobile in favour of a
// compact intro strip.
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

      <img src="/images/logo.png" alt="Mzobs" className="relative h-9 w-auto object-contain" />

      {/* Illustration — a loose stack of abstract job-card shapes, the only
          content this panel needs to make its point. */}
      <div className="relative flex-1 flex items-center justify-center py-6">
        <div className="relative w-56 h-64 sm:w-64 sm:h-72">
          <div
            aria-hidden="true"
            className="absolute inset-0 rounded-2xl bg-white/70 border border-(--jobs-border) shadow-md rotate-[-9deg] translate-x-3"
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 rounded-2xl bg-white/85 border border-(--jobs-border) shadow-md rotate-6 -translate-x-2 translate-y-2"
          />

          <div className="absolute inset-0 rounded-2xl bg-white border border-(--jobs-border) shadow-[0_1px_2px_rgba(16,42,67,0.04),0_24px_48px_-20px_rgba(16,42,67,0.28)] p-5 flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-(--jobs-teal-tint) flex items-center justify-center p-2" aria-hidden="true">
                <img src="/images/logo.png" alt="" className="w-full h-full object-contain" />
              </div>
              <div className="flex-1 flex flex-col gap-1.5">
                <div className="h-2.5 w-3/4 rounded-full bg-(--jobs-navy)/15" aria-hidden="true" />
                <div className="h-2 w-1/2 rounded-full bg-(--jobs-ink-soft)/20" aria-hidden="true" />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <div className="h-2 w-full rounded-full bg-(--jobs-border)" aria-hidden="true" />
              <div className="h-2 w-5/6 rounded-full bg-(--jobs-border)" aria-hidden="true" />
              <div className="h-2 w-2/3 rounded-full bg-(--jobs-border)" aria-hidden="true" />
            </div>

            <div className="mt-auto flex items-center gap-2">
              <div className="h-6 w-16 rounded-full bg-(--jobs-blue-tint)" aria-hidden="true" />
              <div className="h-6 w-12 rounded-full bg-(--jobs-teal-tint)" aria-hidden="true" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
