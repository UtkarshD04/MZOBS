// Shared heading primitives for the /employers page so every section speaks
// the same typographic language: a numbered eyebrow ("02 — Find candidates"),
// a heavy Inter headline, and an optional Playfair italic accent phrase.

export function Eyebrow({ index, children, tone = 'light', className = '' }) {
  const dark = tone === 'dark'
  return (
    <p className={`flex items-center gap-3 text-[12px] font-bold uppercase tracking-[0.16em] ${dark ? 'text-[#5fe0b8]' : 'text-(--explorer-blue)'} ${className}`}>
      {index && (
        <>
          <span className="tabular-nums">{index}</span>
          <span aria-hidden="true" className={`h-px w-8 ${dark ? 'bg-white/25' : 'bg-(--explorer-blue)/35'}`} />
        </>
      )}
      {children}
    </p>
  )
}

// Kept so headings can mark a phrase; it renders as plain heading text.
export function Accent({ children }) {
  return <>{children}</>
}

export const h2Class = 'mt-4 text-balance text-[32px] font-extrabold leading-[1.06] tracking-[-0.03em] sm:text-[40px] lg:text-[48px]'
