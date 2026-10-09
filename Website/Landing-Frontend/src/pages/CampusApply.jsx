import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { Check, Loader2 } from 'lucide-react'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import { Container } from '../components/mz/primitives'
import { submitCampusPartnerRequest } from '../lib/campusPartner'
import { CONTACT_EMAIL } from '../lib/config'
import { CLIENT_ONLY_ROUTES } from '../lib/routes'
import { COLLEGE_TYPES, loadStateColleges } from '../lib/colleges'
import CollegePicker from '../components/CollegePicker'
import DISTRICTS from '../data/districts.json'

// Same flow as the associate application: instructions first, then the form in
// sections A, B and C, then a confirmation.
const SECTIONS = [
  ['A', 'Details of your campus'],
  ['B', 'Where your campus is located'],
  ['C', 'Contact person'],
]

// Same types the college list is tagged with (lib/colleges.js).
const INSTITUTION_TYPES = COLLEGE_TYPES

const STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh',
  'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha',
  'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
  'Andaman and Nicobar Islands', 'Chandigarh', 'Dadra and Nagar Haveli and Daman and Diu', 'Delhi', 'Jammu and Kashmir',
  'Ladakh', 'Lakshadweep', 'Puducherry',
]

const EMPTY = { campusName: '', institutionType: '', website: '', studentStrength: '', city: '', state: '', contactPerson: '', officialEmail: '', phone: '', message: '' }

function validate(section, f) {
  const e = {}
  if (section === 0) {
    if (!f.state) e.state = 'Choose your state'
    if (!f.institutionType) e.institutionType = 'Choose the type of college'
    if (!f.campusName.trim()) e.campusName = 'Choose your college, or type its name'
    if (f.studentStrength && !/^\d+$/.test(f.studentStrength.trim())) e.studentStrength = 'Numbers only'
  }
  if (section === 1) {
    if (!f.state) e.state = 'Choose your state'
    if (!f.city.trim()) e.city = 'Choose or type your city'
  }
  if (section === 2) {
    if (!f.contactPerson.trim()) e.contactPerson = 'Add a contact name'
    if (!/^\S+@\S+\.\S+$/.test(f.officialEmail.trim())) e.officialEmail = 'Enter a valid email'
    if (!/^[\d\s+()-]+$/.test(f.phone.trim()) || f.phone.replace(/\D/g, '').length < 10) e.phone = 'Enter a valid 10-digit number'
  }
  return e
}

const inputCls = (err) =>
  `h-11 w-full rounded-[4px] border bg-white px-3.5 text-[15px] text-[#101828] outline-none transition-colors placeholder:text-[#98A2B3] focus:border-[#0b7a6d] focus:ring-2 focus:ring-[#0b7a6d]/25 ${err ? 'border-[#B42318]' : 'border-[#D0D5DD]'}`

const btnCls =
  'inline-flex h-11 items-center justify-center gap-2 rounded-[3px] px-7 text-[13px] font-bold uppercase tracking-wide transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0b7a6d] disabled:opacity-60'
const primaryBtn = `${btnCls} bg-[#0b7a6d] text-white hover:bg-[#096558]`
const ghostBtn = `${btnCls} border border-[#D0D5DD] bg-white text-[#475467] hover:border-[#101828]`

function Field({ label, error, optional, children }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[12.5px] font-bold uppercase tracking-wide text-[#101828]">
        {label} {optional && <span className="font-normal normal-case text-[#475467]">(optional)</span>}
      </span>
      {children}
      {error && <span role="alert" className="mt-1 block text-[13px] text-[#B42318]">{error}</span>}
    </label>
  )
}

function Instructions({ onNext }) {
  return (
    <>
      <div className="border border-[#D0D5DD]">
        <div className="bg-[#E6F6F3]/60 px-6 py-8 text-center sm:py-10">
          <p className="text-[18px] font-bold uppercase leading-tight text-[#101828] sm:text-[20px]">Bring your campus to</p>
          <p className="my-1 text-[34px] font-extrabold leading-none tracking-tight text-[#0b7a6d] sm:text-[44px]">Mzobs</p>
        </div>

        <div className="border-t border-[#D0D5DD] px-5 py-6 sm:px-8">
          <h2 className="text-center text-[15px] font-bold uppercase tracking-wide text-[#101828]">General instructions</h2>
          <ol className="mt-5 list-decimal space-y-3 pl-5 text-[14.5px] leading-relaxed text-[#475467] marker:font-semibold">
            <li>
              The application form has the following sections:
              <ul className="mt-2 space-y-1.5 pl-3">
                {SECTIONS.map(([k, title]) => (
                  <li key={k}>Section {k} – {title}</li>
                ))}
              </ul>
              <p className="mt-2">Please make sure every section is filled in before you submit.</p>
            </li>
            <li>Please make sure the information you give is correct. The Mzobs team may contact you to confirm the details.</li>
            <li>Once you submit, the team reviews your request and gets in touch with you by email or phone.</li>
          </ol>
        </div>
      </div>

      <p className="mt-4 text-[13px] text-[#475467]">
        Note: In case of any difficulty in submitting the form, please write to{' '}
        <a href={`mailto:${CONTACT_EMAIL}`} className="font-semibold text-[#0b7a6d] underline underline-offset-2">{CONTACT_EMAIL}</a>.
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
  const set = (k) => (e) => {
    const { value } = e.target
    setF((x) => ({ ...x, [k]: value }))
    setErrors((er) => (er[k] ? { ...er, [k]: undefined } : er))
  }
  const last = step === SECTIONS.length - 1

  // Changing the state clears a city picked for the old one.
  const changeState = (e) => {
    const { value } = e.target
    setF((x) => ({ ...x, state: value, city: value === x.state ? x.city : '' }))
    setErrors((er) => (er.state ? { ...er, state: undefined } : er))
  }
  // Districts of the chosen state (official list, src/data/districts.json).
  const cityOptions = (DISTRICTS[f.state] ?? []).map((name) => ({ name }))

  // Colleges for the chosen state (AICTE list, lib/colleges.js), narrowed to
  // the chosen type. The result remembers which state it was loaded for, so
  // "loading" is simply a result for a different state.
  const [loaded, setLoaded] = useState({ state: '', list: [], failed: false })
  useEffect(() => {
    if (!f.state) return
    let live = true
    loadStateColleges(f.state)
      .then((list) => live && setLoaded({ state: f.state, list, failed: false }))
      .catch(() => live && setLoaded({ state: f.state, list: [], failed: true }))
    return () => {
      live = false
    }
  }, [f.state])
  const collegesReady = !f.state || loaded.state === f.state
  const stateColleges = !f.state ? [] : collegesReady ? loaded.list : null
  const collegesFailed = collegesReady && loaded.failed
  const collegeOptions = (stateColleges ?? []).filter((c) => !f.institutionType || c.type === f.institutionType)
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
      await submitCampusPartnerRequest(Object.fromEntries(Object.entries(f).map(([k, v]) => [k, v.trim()])))
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
          <li key={k} aria-current={i === step ? 'step' : undefined} className={`flex items-center gap-2 text-[13px] font-bold uppercase tracking-wide ${i === step ? 'text-[#101828]' : i < step ? 'text-[#096558]' : 'text-[#98A2B3]'}`}>
            <span className={`flex h-6 w-6 items-center justify-center rounded-full text-[11.5px] ${i === step ? 'bg-[#0b7a6d] text-white' : i < step ? 'bg-[#E6F6F3] text-[#096558]' : 'bg-[#F8FAFC] text-[#98A2B3] ring-1 ring-[#D0D5DD]'}`}>
              {i < step ? <Check size={13} strokeWidth={3} aria-hidden="true" /> : k}
            </span>
            <span className="hidden sm:inline">{title}</span>
          </li>
        ))}
      </ol>

      <form onSubmit={submit} noValidate className="border border-[#D0D5DD] bg-white">
        <h2 className="border-b border-[#D0D5DD] bg-[#F8FAFC] px-5 py-3 text-[15px] font-bold uppercase tracking-wide text-[#101828] sm:px-8">
          Section {SECTIONS[step][0]} – {SECTIONS[step][1]}
        </h2>

        <div className="grid gap-5 px-5 py-6 sm:grid-cols-2 sm:px-8">
          {step === 0 && (
            <>
              <Field label="State" error={errors.state}>
                <select value={f.state} onChange={changeState} autoComplete="address-level1" autoFocus aria-invalid={!!errors.state} className={`${inputCls(errors.state)} cursor-pointer`}>
                  <option value="">Select a state</option>
                  {STATES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </Field>
              <Field label="College type" error={errors.institutionType}>
                <select value={f.institutionType} onChange={set('institutionType')} aria-invalid={!!errors.institutionType} className={`${inputCls(errors.institutionType)} cursor-pointer`}>
                  <option value="">Select a type</option>
                  {INSTITUTION_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </Field>
              <div className="sm:col-span-2">
                <Field label="Campus / college name" error={errors.campusName}>
                  <CollegePicker
                    value={f.campusName}
                    onChange={(v) => set('campusName')({ target: { value: v } })}
                    options={collegeOptions}
                    placeholder={f.state ? 'Click to choose, or type to search' : 'Choose your state first'}
                    invalid={!!errors.campusName}
                    describedBy="campus-college-hint"
                    className={inputCls(errors.campusName)}
                  />
                  <span id="campus-college-hint" className="mt-1.5 block text-[12.5px] text-[#667085]">
                    {!f.state
                      ? 'Pick your state to see AICTE-approved colleges there.'
                      : stateColleges === null
                        ? 'Loading colleges…'
                        : collegesFailed
                          ? 'Couldn’t load the college list. Type your college’s name instead.'
                          : collegeOptions.length
                            ? `${collegeOptions.length.toLocaleString('en-IN')} ${f.institutionType ? `${f.institutionType.toLowerCase()} ` : ''}listing${collegeOptions.length === 1 ? '' : 's'} in ${f.state} (AICTE-approved). Not listed? Just type your college’s name.`
                            : `No ${f.institutionType ? f.institutionType.toLowerCase() + ' ' : ''}listings in ${f.state} on our AICTE list. Type your college’s name.`}
                  </span>
                </Field>
              </div>
              <Field label="Approx. student strength" optional error={errors.studentStrength}>
                <input value={f.studentStrength} onChange={set('studentStrength')} placeholder="e.g. 1200" inputMode="numeric" maxLength={7} className={inputCls(errors.studentStrength)} />
              </Field>
              <Field label="College website" optional>
                <input value={f.website} onChange={set('website')} placeholder="www.example.edu" inputMode="url" autoComplete="url" maxLength={300} className={inputCls(false)} />
              </Field>
            </>
          )}

          {step === 1 && (
            <>
              <Field label="State" error={errors.state}>
                <select value={f.state} onChange={changeState} autoComplete="address-level1" aria-invalid={!!errors.state} className={`${inputCls(errors.state)} cursor-pointer`}>
                  <option value="">Select a state</option>
                  {STATES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </Field>
              <Field label="City / district" error={errors.city}>
                <CollegePicker
                  value={f.city}
                  onChange={(v) => set('city')({ target: { value: v } })}
                  options={cityOptions}
                  noun="cities"
                  autoFocus
                  placeholder={f.state ? 'Click to choose, or type your city' : 'Choose your state first'}
                  invalid={!!errors.city}
                  className={inputCls(errors.city)}
                />
              </Field>
            </>
          )}

          {step === 2 && (
            <>
              <Field label="Contact person" error={errors.contactPerson}>
                <input value={f.contactPerson} onChange={set('contactPerson')} placeholder="Full name" autoComplete="name" maxLength={120} autoFocus aria-invalid={!!errors.contactPerson} className={inputCls(errors.contactPerson)} />
              </Field>
              <Field label="Phone" error={errors.phone}>
                <input value={f.phone} onChange={set('phone')} placeholder="10-digit number" inputMode="tel" autoComplete="tel" maxLength={20} aria-invalid={!!errors.phone} className={inputCls(errors.phone)} />
              </Field>
              <div className="sm:col-span-2">
                <Field label="Official email" error={errors.officialEmail}>
                  <input type="email" value={f.officialEmail} onChange={set('officialEmail')} placeholder="you@institution.edu" autoComplete="email" maxLength={200} aria-invalid={!!errors.officialEmail} className={inputCls(errors.officialEmail)} />
                </Field>
              </div>
              <div className="sm:col-span-2">
                <Field label="Additional message" optional>
                  <textarea value={f.message} onChange={set('message')} rows={4} maxLength={2000} placeholder="Anything else you'd like us to know" className={`${inputCls(false)} h-auto py-3`} />
                </Field>
              </div>
            </>
          )}
        </div>

        {fail && <p role="alert" className="px-5 pb-2 text-[14px] text-[#B42318] sm:px-8">{fail}</p>}

        <div className="flex items-center justify-between gap-3 border-t border-[#D0D5DD] px-5 py-4 sm:px-8">
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
    <div role="status" className="border border-[#D0D5DD] bg-white p-8 text-center sm:p-12">
      <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#E6F6F3] text-[#096558]">
        <Check size={28} strokeWidth={2.6} aria-hidden="true" />
      </span>
      <h2 className="mt-5 text-[22px] font-extrabold tracking-tight text-[#101828]">Request received</h2>
      <p className="mx-auto mt-2 max-w-md text-[15px] text-[#475467]">
        Thank you, {f.contactPerson.split(' ')[0]}. The Mzobs team will review {f.campusName} and get in touch on {f.officialEmail}.
      </p>
      <Link to={CLIENT_ONLY_ROUTES.campusPartner} className={`${primaryBtn} mt-6`}>Back to Add Your Campus</Link>
    </div>
  )
}

export default function CampusApply() {
  const [stage, setStage] = useState('intro') // 'intro' | 'form' | 'sent'
  const [sentWith, setSentWith] = useState(null)

  useEffect(() => {
    const prev = document.title
    document.title = 'Campus application form | Mzobs'
    return () => { document.title = prev }
  }, [])

  return (
    <div className="mz-home min-h-screen bg-white font-sans text-mz-ink antialiased">
      <Navbar />
      <main className="pt-16">
        <Container className="max-w-4xl py-10 sm:py-14">
          <h1 className="mb-6 text-center text-[26px] font-extrabold uppercase tracking-tight text-[#101828] sm:text-[32px]">Campus application form</h1>
          {stage === 'intro' && <Instructions onNext={() => setStage('form')} />}
          {stage === 'form' && <ApplicationSections onSent={(f) => { setSentWith(f); setStage('sent') }} />}
          {stage === 'sent' && <Sent f={sentWith} />}
        </Container>
      </main>
      <Footer />
    </div>
  )
}
