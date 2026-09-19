// Mandatory "I agree to the Terms & Conditions and Privacy Policy" tick shown
// wherever a NEW account is about to be created. The parent owns the state and
// must keep its submit action blocked until `checked` is true. Links open in a
// new tab so the half-filled signup form isn't lost.
const TONES = {
  jobs: { text: 'text-(--jobs-ink-soft)', link: 'text-(--jobs-navy) hover:text-(--jobs-blue-dark)', accent: 'accent-[#2563eb]' },
  careers: { text: 'text-[#595959]', link: 'text-black hover:text-(--careers-accent)', accent: 'accent-[#3d5c34]' },
}

export default function TermsConsent({ checked, onChange, error, tone = 'jobs', className = '' }) {
  const t = TONES[tone] ?? TONES.jobs
  const linkCls = `font-bold underline underline-offset-2 transition-colors ${t.link}`
  return (
    <div className={className}>
      <label className={`flex items-start gap-2.5 cursor-pointer text-[12.5px] leading-relaxed ${t.text}`}>
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          aria-required="true"
          aria-invalid={error ? 'true' : undefined}
          className={`mt-0.5 h-4 w-4 shrink-0 cursor-pointer ${t.accent}`}
        />
        <span>
          I have read and agree to the Mzobs{' '}
          <a href="/terms-of-service" target="_blank" rel="noopener noreferrer" className={linkCls}>
            Terms &amp; Conditions
          </a>{' '}
          and{' '}
          <a href="/privacy-policy" target="_blank" rel="noopener noreferrer" className={linkCls}>
            Privacy Policy
          </a>
          .
        </span>
      </label>
      {error && <p className="text-xs text-red-600 mt-1.5 ml-6.5">{error}</p>}
    </div>
  )
}
