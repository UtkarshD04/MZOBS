import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { Check, Loader2 } from 'lucide-react'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import { Container } from '../components/mz/primitives'
import { submitAssociateRequest } from '../lib/associates'
import { CONTACT_EMAIL } from '../lib/config'

// Instructions first, then the form in sections — the same flow as a dealer
// application: read the notes, press Next, fill Section A, B and C. Copy sticks to
// what the Mzobs team has asked for; commercial terms are agreed after review.
const SECTIONS = [
  ['A', 'Details of your company'],
  ['B', 'Where you operate'],
  ['C', 'About your placement work'],
]

const CITY_TYPES = ['Metro / large city', 'Small city / town']
const EMPTY = { companyName: '', contactName: '', email: '', phone: '', city: '', cityType: '', website: '', about: '' }

function validate(section, f) {
  const e = {}
  if (section === 0) {
    if (!f.companyName.trim()) e.companyName = 'Add your company name'
    if (!f.contactName.trim()) e.contactName = 'Tell us who we should speak to'
    if (f.phone.replace(/\D/g, '').length < 10) e.phone = 'Enter a 10-digit number'
    if (!/^\S+@\S+\.\S+$/.test(f.email.trim())) e.email = 'Enter a valid email'
  }
  if (section === 1) {
    if (!f.city.trim()) e.city = 'Add your city'
    if (!f.cityType) e.cityType = 'Choose one'
  }
  if (section === 2 && f.about.trim().length < 20) e.about = 'Tell us a little more (a couple of sentences)'
  return e
}

const inputCls = (err) =>
  `h-11 w-full rounded-[4px] border bg-white px-3.5 text-[15px] text-mz-ink outline-none transition-colors placeholder:text-mz-muted/70 focus:border-mz-primary focus:ring-2 focus:ring-mz-primary/25 ${err ? 'border-[#B42318]' : 'border-mz-line-strong'}`

const btnCls =
  'inline-flex h-11 items-center justify-center gap-2 rounded-[3px] px-7 text-[13px] font-bold uppercase tracking-wide transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-mz-primary disabled:opacity-60'
const primaryBtn = `${btnCls} bg-mz-primary text-white hover:bg-mz-primary-strong`
const ghostBtn = `${btnCls} border border-mz-line-strong bg-white text-mz-ink-2 hover:border-mz-ink`

function Field({ label, error, optional, children }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[12.5px] font-bold uppercase tracking-wide text-mz-ink">
        {label} {optional && <span className="font-normal normal-case text-mz-muted">(optional)</span>}
      </span>
      {children}
      {error && <span role="alert" className="mt-1 block text-[13px] text-[#B42318]">{error}</span>}
    </label>
  )
}

function Instructions({ onNext }) {
  return (
    <>
      <div className="border border-mz-line-strong">
        <div className="bg-mz-primary-tint/50 px-6 py-8 text-center sm:py-10">
          <p className="text-[18px] font-bold uppercase leading-tight text-mz-ink sm:text-[20px]">Become a part of</p>
          <p className="my-1 text-[34px] font-extrabold leading-none tracking-tight text-mz-primary sm:text-[44px]">Mzobs</p>
          <p className="text-[18px] font-bold uppercase leading-tight text-mz-ink sm:text-[20px]">Network</p>
        </div>

        <div className="border-t border-mz-line-strong px-5 py-6 sm:px-8">
          <h2 className="text-center text-[15px] font-bold uppercase tracking-wide text-mz-ink">General instructions</h2>
          <ol className="mt-5 list-decimal space-y-3 pl-5 text-[14.5px] leading-relaxed text-mz-ink-2 marker:font-semibold">
            <li>
              The application form has the following sections:
              <ul className="mt-2 space-y-1.5 pl-3">
                {SECTIONS.map(([k, title]) => (
                  <li key={k}>
                    Section {k} – {title}
                  </li>
                ))}
              </ul>
              <p className="mt-2">Please make sure every section is filled in before you submit.</p>
            </li>
            <li>Please make sure the information you give is correct. The Mzobs team may contact you to confirm the details.</li>
            <li>Once you submit, the team reviews your request and gets in touch with you by email or phone.</li>
          </ol>
        </div>
      </div>

      <p className="mt-4 text-[13px] text-mz-ink-2">
        Note: In case of any difficulty in submitting the form, please write to{' '}
        <a href={`mailto:${CONTACT_EMAIL}`} className="font-semibold text-mz-primary-strong underline underline-offset-2">{CONTACT_EMAIL}</a>.
      </p>
      <div className="mt-4 flex justify-end">
        <button type="button" onClick={onNext} className={primaryBtn}>Next</button>
      </div>
    </>
  )
}

function ApplicationSections({ onSent }) {
  const [step, setStep] = useState(0)
  const [f, setF] = useState(EMPTY)
  const [errors, setErrors] = useState({})
  const [busy, setBusy] = useState(false)
  const [fail, setFail] = useState('')
  const top = useRef(null)
  // Typing in a field clears that field's error straight away.
  const set = (k) => (e) => {
    const { value } = e.target
    setF((x) => ({ ...x, [k]: value }))
    setErrors((er) => (er[k] ? { ...er, [k]: undefined } : er))
  }
  const last = step === SECTIONS.length - 1

  const scrollTop = () => top.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })

  async function submit(e) {
    e.preventDefault()
    const found = validate(step, f)
    setErrors(found)
    if (Object.keys(found).length) return
    if (!last) {
      setStep((s) => s + 1)
      scrollTop()
      return
    }
    setBusy(true)
    setFail('')
    try {
      await submitAssociateRequest(Object.fromEntries(Object.entries(f).map(([k, v]) => [k, v.trim()])))
      onSent(f)
    } catch (err) {
      setFail(err.message || 'Something went wrong. Please try again.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div ref={top} className="scroll-mt-20">
      <ol className="mb-4 flex flex-wrap gap-x-6 gap-y-2" aria-label="Application sections">
        {SECTIONS.map(([k, title], i) => (
          <li key={k} aria-current={i === step ? 'step' : undefined} className={`flex items-center gap-2 text-[13px] font-bold uppercase tracking-wide ${i === step ? 'text-mz-ink' : i < step ? 'text-mz-primary-strong' : 'text-mz-muted'}`}>
            <span className={`flex h-6 w-6 items-center justify-center rounded-full text-[11.5px] ${i === step ? 'bg-mz-primary text-white' : i < step ? 'bg-mz-primary-tint text-mz-primary-strong' : 'bg-mz-bg text-mz-muted ring-1 ring-mz-line-strong'}`}>
              {i < step ? <Check size={13} strokeWidth={3} aria-hidden="true" /> : k}
            </span>
            <span className="hidden sm:inline">{title}</span>
          </li>
        ))}
      </ol>

      <form onSubmit={submit} noValidate className="border border-mz-line-strong bg-white">
        <h2 className="border-b border-mz-line-strong bg-mz-bg px-5 py-3 text-[15px] font-bold uppercase tracking-wide text-mz-ink sm:px-8">
          Section {SECTIONS[step][0]} – {SECTIONS[step][1]}
        </h2>

        <div className="grid gap-5 px-5 py-6 sm:grid-cols-2 sm:px-8">
          {step === 0 && (
            <>
              <div className="sm:col-span-2">
                <Field label="Placement company name" error={errors.companyName}>
                  <input value={f.companyName} onChange={set('companyName')} placeholder="Your company" autoComplete="organization" autoFocus aria-invalid={!!errors.companyName} className={inputCls(errors.companyName)} />
                </Field>
              </div>
              <Field label="Contact person" error={errors.contactName}>
                <input value={f.contactName} onChange={set('contactName')} placeholder="Full name" autoComplete="name" aria-invalid={!!errors.contactName} className={inputCls(errors.contactName)} />
              </Field>
              <Field label="Phone" error={errors.phone}>
                <input value={f.phone} onChange={set('phone')} placeholder="10-digit number" inputMode="tel" autoComplete="tel" aria-invalid={!!errors.phone} className={inputCls(errors.phone)} />
              </Field>
              <div className="sm:col-span-2">
                <Field label="Email" error={errors.email}>
                  <input type="email" value={f.email} onChange={set('email')} placeholder="you@company.com" autoComplete="email" aria-invalid={!!errors.email} className={inputCls(errors.email)} />
                </Field>
              </div>
            </>
          )}

          {step === 1 && (
            <>
              <Field label="City" error={errors.city}>
                <input value={f.city} onChange={set('city')} placeholder="City you operate from" autoComplete="address-level2" autoFocus aria-invalid={!!errors.city} className={inputCls(errors.city)} />
              </Field>
              <Field label="Website" optional>
                <input value={f.website} onChange={set('website')} placeholder="www.example.com" inputMode="url" autoComplete="url" className={inputCls(false)} />
              </Field>
              <fieldset className="sm:col-span-2">
                <legend className="mb-1.5 text-[12.5px] font-bold uppercase tracking-wide text-mz-ink">Type of city</legend>
                <div className="grid gap-3 sm:grid-cols-2">
                  {CITY_TYPES.map((t) => (
                    <label key={t} className={`flex cursor-pointer items-center gap-3 rounded-[4px] border px-3.5 py-3 text-[14.5px] font-medium transition-colors has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-mz-primary/40 ${f.cityType === t ? 'border-mz-primary bg-mz-primary-tint text-mz-primary-strong' : 'border-mz-line-strong text-mz-ink-2 hover:border-mz-primary/60'}`}>
                      <input type="radio" name="cityType" value={t} checked={f.cityType === t} onChange={set('cityType')} className="sr-only" />
                      <span className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border ${f.cityType === t ? 'border-mz-primary bg-mz-primary' : 'border-mz-line-strong bg-white'}`} aria-hidden="true">
                        {f.cityType === t && <span className="h-1.5 w-1.5 rounded-full bg-white" />}
                      </span>
                      {t}
                    </label>
                  ))}
                </div>
                {errors.cityType && <span role="alert" className="mt-1 block text-[13px] text-[#B42318]">{errors.cityType}</span>}
              </fieldset>
            </>
          )}

          {step === 2 && (
            <div className="sm:col-span-2">
              <Field label="About your placement company" error={errors.about}>
                <textarea value={f.about} onChange={set('about')} rows={6} autoFocus placeholder="What kind of placements do you do, roles, sectors, how many candidates you work with?" aria-invalid={!!errors.about} className={`${inputCls(errors.about)} h-auto py-3`} />
              </Field>
            </div>
          )}
        </div>

        {fail && <p role="alert" className="px-5 pb-2 text-[14px] text-[#B42318] sm:px-8">{fail}</p>}

        <div className="flex items-center justify-between gap-3 border-t border-mz-line-strong px-5 py-4 sm:px-8">
          {step > 0 ? (
            <button type="button" className={ghostBtn} disabled={busy} onClick={() => { setErrors({}); setStep((s) => s - 1); scrollTop() }}>Back</button>
          ) : (
            <span />
          )}
          <button type="submit" disabled={busy} className={primaryBtn}>
            {busy && <Loader2 size={15} className="animate-spin" aria-hidden="true" />}
            {busy ? 'Sending…' : last ? 'Submit' : 'Next'}
          </button>
        </div>
      </form>
    </div>
  )
}

function Sent({ f }) {
  return (
    <div role="status" className="border border-mz-line-strong bg-white p-8 text-center sm:p-12">
      <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-mz-primary-tint text-mz-primary-strong">
        <Check size={28} strokeWidth={2.6} aria-hidden="true" />
      </span>
      <h2 className="mt-5 text-[22px] font-extrabold tracking-tight text-mz-ink">Request received</h2>
      <p className="mx-auto mt-2 max-w-md text-[15px] text-mz-muted">
        Thank you, {f.contactName.split(' ')[0]}. The Mzobs team will review {f.companyName} and get in touch on {f.email}.
      </p>
      <Link to="/associate" className={`${primaryBtn} mt-6`}>Back to Associate with Mzobs</Link>
    </div>
  )
}

export default function AssociateApply() {
  const [stage, setStage] = useState('intro') // 'intro' | 'form' | 'sent'
  const [sentWith, setSentWith] = useState(null)

  useEffect(() => {
    const prev = document.title
    document.title = 'Associate application form | Mzobs'
    return () => { document.title = prev }
  }, [])

  return (
    <div className="mz-home min-h-screen bg-white font-sans text-mz-ink antialiased">
      <Navbar />
      <main className="pt-16">
        <Container className="max-w-4xl py-10 sm:py-14">
          <h1 className="mb-6 text-center text-[26px] font-extrabold uppercase tracking-tight text-mz-ink sm:text-[32px]">Associate application form</h1>
          {stage === 'intro' && <Instructions onNext={() => setStage('form')} />}
          {stage === 'form' && <ApplicationSections onSent={(f) => { setSentWith(f); setStage('sent') }} />}
          {stage === 'sent' && <Sent f={sentWith} />}
        </Container>
      </main>
      <Footer />
    </div>
  )
}
