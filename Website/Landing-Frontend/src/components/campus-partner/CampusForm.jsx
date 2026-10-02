import { useState } from 'react'
import { CheckCircle2, Loader2 } from 'lucide-react'
import { Container, Reveal } from '../mz/primitives'
import { submitCampusPartnerRequest } from '../../lib/campusPartner'

const CAMPUS_TYPES = ['University', 'Engineering College', 'Degree College', 'Management Institute', 'Polytechnic', 'Other']

const EMPTY = {
  institutionName: '',
  campusType: '',
  city: '',
  state: '',
  website: '',
  studentStrength: '',
  tpoName: '',
  email: '',
  phone: '',
  departments: '',
  message: '',
}

function validate(f) {
  const e = {}
  if (!f.institutionName.trim()) e.institutionName = 'Add your institution’s name'
  if (!f.campusType) e.campusType = 'Choose a campus type'
  if (!f.city.trim()) e.city = 'Add your city'
  if (!f.state.trim()) e.state = 'Add your state'
  if (!f.tpoName.trim()) e.tpoName = 'Add a contact name'
  if (!/^\S+@\S+\.\S+$/.test(f.email.trim())) e.email = 'Enter a valid email'
  if (f.phone.replace(/\D/g, '').length < 10) e.phone = 'Enter a 10-digit number'
  return e
}

const inputCls = (err) =>
  `h-12 w-full rounded-[12px] border bg-white px-4 text-[14.5px] text-mz-ink outline-none transition-colors placeholder:text-mz-muted/70 focus:ring-2 focus:ring-mz-primary/25 ${
    err ? 'border-red-400' : 'border-mz-line-strong focus:border-mz-primary'
  }`

function Field({ label, error, optional, className = '', children }) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-1.5 block text-[13px] font-semibold text-mz-ink">
        {label} {optional && <span className="font-normal text-mz-muted">(optional)</span>}
      </span>
      {children}
      {error && <span role="alert" className="mt-1 block text-[12.5px] text-red-600">{error}</span>}
    </label>
  )
}

function Success({ institutionName }) {
  return (
    <div role="status" className="rounded-[24px] border border-mz-line bg-white p-8 text-center shadow-mz-card sm:p-12">
      <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-mz-accent-tint text-mz-accent-ink">
        <CheckCircle2 size={28} strokeWidth={2.4} aria-hidden="true" />
      </span>
      <h3 className="mt-5 text-[22px] font-extrabold tracking-tight text-mz-ink">Campus Request Received!</h3>
      <p className="mx-auto mt-2 max-w-md text-[14.5px] leading-relaxed text-mz-muted">
        Thank you for your interest in partnering with Mzobs{institutionName ? ` on behalf of ${institutionName}` : ''}. Our team will review your request and get in touch with you.
      </p>
    </div>
  )
}

export default function CampusForm() {
  const [f, setF] = useState(EMPTY)
  const [errors, setErrors] = useState({})
  const [busy, setBusy] = useState(false)
  const [fail, setFail] = useState('')
  const [sent, setSent] = useState(false)

  const set = (k) => (e) => {
    const { value } = e.target
    setF((x) => ({ ...x, [k]: value }))
    setErrors((er) => (er[k] ? { ...er, [k]: undefined } : er))
  }

  async function submit(e) {
    e.preventDefault()
    const found = validate(f)
    setErrors(found)
    if (Object.keys(found).length) return
    setBusy(true)
    setFail('')
    try {
      await submitCampusPartnerRequest(Object.fromEntries(Object.entries(f).map(([k, v]) => [k, v.trim()])))
      setSent(true)
    } catch (err) {
      setFail(err.message || 'Something went wrong. Please try again.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <section id="campus-form" className="relative scroll-mt-20 bg-mz-bg py-16 lg:py-24">
      <Container className="max-w-3xl">
        <Reveal className="text-center">
          <h2 className="text-[28px] font-extrabold tracking-[-0.02em] text-mz-ink sm:text-[36px]">Ready to Bring Mzobs to Your Campus?</h2>
          <p className="mt-3 text-[15px] leading-relaxed text-mz-muted">Tell us about your institution and our team will connect with you.</p>
        </Reveal>

        <div className="mt-10">
          {sent ? (
            <Success institutionName={f.institutionName} />
          ) : (
            <form onSubmit={submit} noValidate className="rounded-[24px] border border-mz-line bg-white p-6 shadow-mz-card sm:p-9">
              <div className="grid gap-5 sm:grid-cols-2">
                <Field label="College / University Name" error={errors.institutionName} className="sm:col-span-2">
                  <input value={f.institutionName} onChange={set('institutionName')} placeholder="Your institution's name" autoComplete="organization" className={inputCls(errors.institutionName)} />
                </Field>

                <Field label="Campus Type" error={errors.campusType}>
                  <select value={f.campusType} onChange={set('campusType')} className={`${inputCls(errors.campusType)} cursor-pointer appearance-none`}>
                    <option value="" disabled>Select a type</option>
                    {CAMPUS_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                  </select>
                </Field>
                <Field label="Official Website" optional>
                  <input value={f.website} onChange={set('website')} placeholder="www.example.edu" inputMode="url" autoComplete="url" className={inputCls(false)} />
                </Field>

                <Field label="City" error={errors.city}>
                  <input value={f.city} onChange={set('city')} placeholder="City" autoComplete="address-level2" className={inputCls(errors.city)} />
                </Field>
                <Field label="State" error={errors.state}>
                  <input value={f.state} onChange={set('state')} placeholder="State" autoComplete="address-level1" className={inputCls(errors.state)} />
                </Field>

                <Field label="Approximate Student Strength" optional>
                  <input value={f.studentStrength} onChange={set('studentStrength')} placeholder="e.g. 1,200" inputMode="numeric" className={inputCls(false)} />
                </Field>
                <Field label="Departments / Courses" optional>
                  <input value={f.departments} onChange={set('departments')} placeholder="e.g. CSE, ECE, MBA" className={inputCls(false)} />
                </Field>

                <Field label="Placement / TPO Name" error={errors.tpoName}>
                  <input value={f.tpoName} onChange={set('tpoName')} placeholder="Full name" autoComplete="name" className={inputCls(errors.tpoName)} />
                </Field>
                <Field label="Contact Number" error={errors.phone}>
                  <input value={f.phone} onChange={set('phone')} placeholder="10-digit number" inputMode="tel" autoComplete="tel" className={inputCls(errors.phone)} />
                </Field>

                <Field label="Official Email" error={errors.email} className="sm:col-span-2">
                  <input type="email" value={f.email} onChange={set('email')} placeholder="you@institution.edu" autoComplete="email" className={inputCls(errors.email)} />
                </Field>

                <Field label="Message" optional className="sm:col-span-2">
                  <textarea value={f.message} onChange={set('message')} rows={4} placeholder="Anything else you'd like us to know" className={`${inputCls(false)} h-auto py-3`} />
                </Field>
              </div>

              {fail && <p role="alert" className="mt-4 text-[13.5px] text-red-600">{fail}</p>}

              <button
                type="submit"
                disabled={busy}
                className="mt-7 inline-flex h-[50px] w-full items-center justify-center gap-2 rounded-full text-[15px] font-bold text-white shadow-mz-cta transition-transform duration-200 hover:-translate-y-0.5 disabled:opacity-60 sm:w-auto sm:px-8"
                style={{ backgroundImage: 'var(--mz-gradient)' }}
              >
                {busy && <Loader2 size={16} className="animate-spin" aria-hidden="true" />}
                {busy ? 'Submitting…' : 'Submit Campus Request'}
              </button>
            </form>
          )}
        </div>
      </Container>
    </section>
  )
}
