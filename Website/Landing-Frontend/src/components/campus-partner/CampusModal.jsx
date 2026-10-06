import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Check, Loader2, X } from 'lucide-react'
import { submitCampusPartnerRequest } from '../../lib/campusPartner'

const INSTITUTION_TYPES = ['University', 'Engineering College', 'Degree College', 'Management Institute', 'Polytechnic', 'Other']

const STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh',
  'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha',
  'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
  'Andaman and Nicobar Islands', 'Chandigarh', 'Dadra and Nagar Haveli and Daman and Diu', 'Delhi', 'Jammu and Kashmir',
  'Ladakh', 'Lakshadweep', 'Puducherry',
]

const EMPTY = {
  campusName: '',
  officialEmail: '',
  contactPerson: '',
  phone: '',
  institutionType: '',
  city: '',
  state: '',
  website: '',
  studentStrength: '',
  message: '',
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function validate(f) {
  const e = {}
  if (!f.campusName.trim()) e.campusName = 'Add your campus name'
  if (!EMAIL_RE.test(f.officialEmail.trim())) e.officialEmail = 'Enter a valid email address'
  if (!f.contactPerson.trim()) e.contactPerson = 'Add a contact name'
  if (!/^[\d\s+()-]+$/.test(f.phone.trim()) || f.phone.replace(/\D/g, '').length < 10) e.phone = 'Enter a valid 10-digit phone number'
  if (!f.institutionType) e.institutionType = 'Choose an institution type'
  if (!f.city.trim()) e.city = 'Add your city'
  if (!f.state) e.state = 'Choose your state'
  if (f.studentStrength && !/^\d+$/.test(f.studentStrength.trim())) e.studentStrength = 'Numbers only'
  return e
}

const inputCls = (err) =>
  `h-11 w-full rounded-[11px] border bg-white px-3.5 text-[14px] text-mz-ink outline-none transition-colors placeholder:text-mz-muted/70 focus:ring-2 focus:ring-[#0F8B7D]/25 ${
    err ? 'border-red-400' : 'border-mz-line-strong focus:border-[#0F8B7D]'
  }`

function Field({ label, error, optional, className = '', children }) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-1 block text-[12.5px] font-semibold text-mz-ink">
        {label}
        {optional ? <span className="font-normal text-mz-muted"> (optional)</span> : <span className="text-red-500"> *</span>}
      </span>
      {children}
      {error && <span role="alert" className="mt-1 block text-[12px] text-red-600">{error}</span>}
    </label>
  )
}

function Success({ onDone }) {
  return (
    <div role="status" className="px-6 py-12 text-center sm:px-10">
      <motion.span
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 260, damping: 18 }}
        className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#0F8B7D] text-white"
      >
        <Check size={30} strokeWidth={3} aria-hidden="true" />
      </motion.span>
      <h2 className="mt-6 text-[24px] font-extrabold tracking-tight text-mz-ink">Campus Request Submitted ✓</h2>
      <p className="mx-auto mt-2 max-w-sm text-[14.5px] leading-relaxed text-mz-muted">
        Thanks for your interest in Mzobs. Our team will review your campus details and contact you soon.
      </p>
      <button
        type="button"
        onClick={onDone}
        className="mt-7 inline-flex h-12 items-center justify-center rounded-full bg-[#073B3A] px-10 text-[15px] font-bold text-white transition-colors hover:bg-[#0F8B7D]"
      >
        Done
      </button>
    </div>
  )
}

export default function CampusModal({ open, onClose }) {
  const [f, setF] = useState(EMPTY)
  const [errors, setErrors] = useState({})
  const [busy, setBusy] = useState(false)
  const [fail, setFail] = useState('')
  const [sent, setSent] = useState(false)
  const panelRef = useRef(null)

  // Lock page scroll, close on Escape, and move focus into the dialog.
  useEffect(() => {
    if (!open) return undefined
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (e) => { if (e.key === 'Escape' && !busy) onClose() }
    window.addEventListener('keydown', onKey)
    panelRef.current?.focus()
    return () => {
      document.body.style.overflow = prevOverflow
      window.removeEventListener('keydown', onKey)
    }
  }, [open, busy, onClose])

  function close() {
    if (busy) return
    onClose()
    // Reset after the exit animation so a finished submission doesn't flash back to the form.
    setTimeout(() => { setF(EMPTY); setErrors({}); setFail(''); setSent(false) }, 250)
  }

  const set = (k) => (e) => {
    const { value } = e.target
    setF((x) => ({ ...x, [k]: value }))
    setErrors((er) => (er[k] ? { ...er, [k]: undefined } : er))
  }

  // Inline validation: re-check a field once the user leaves it.
  const check = (k) => () => {
    const found = validate(f)
    setErrors((er) => ({ ...er, [k]: found[k] }))
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
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-end justify-center bg-[#073B3A]/45 backdrop-blur-sm sm:items-center sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          onMouseDown={(e) => { if (e.target === e.currentTarget) close() }}
        >
          <motion.div
            ref={panelRef}
            tabIndex={-1}
            role="dialog"
            aria-modal="true"
            aria-labelledby="campus-modal-title"
            initial={{ opacity: 0, y: 28, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.98 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="relative flex max-h-[94vh] w-full max-w-[720px] flex-col overflow-hidden rounded-t-[24px] bg-white shadow-2xl outline-none sm:rounded-[24px]"
          >
            <span className="h-1 w-full shrink-0 bg-gradient-to-r from-[#0F8B7D] via-[#0F8B7D] to-[#0f8b7d]" aria-hidden="true" />
            <button
              type="button"
              onClick={close}
              aria-label="Close"
              className="absolute right-3.5 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full text-mz-muted transition-colors hover:bg-mz-bg hover:text-mz-ink"
            >
              <X size={18} aria-hidden="true" />
            </button>

            {sent ? (
              <Success onDone={close} />
            ) : (
              <form onSubmit={submit} noValidate className="flex min-h-0 flex-1 flex-col">
                <div className="px-6 pb-4 pt-6 sm:px-8">
                  <h2 id="campus-modal-title" className="pr-10 text-[22px] font-extrabold tracking-tight text-mz-ink">Add Your Campus</h2>
                  <p className="mt-1 text-[13.5px] text-mz-muted">Tell us a little about your institution.</p>
                </div>

                <div className="min-h-0 flex-1 overflow-y-auto px-6 pb-2 sm:px-8">
                  <div className="grid gap-3.5 sm:grid-cols-2">
                    <Field label="Campus / College Name" error={errors.campusName} className="sm:col-span-2">
                      <input value={f.campusName} onChange={set('campusName')} onBlur={check('campusName')} placeholder="Your institution's name" autoComplete="organization" maxLength={200} className={inputCls(errors.campusName)} />
                    </Field>
                    <Field label="Official Email" error={errors.officialEmail}>
                      <input type="email" value={f.officialEmail} onChange={set('officialEmail')} onBlur={check('officialEmail')} placeholder="you@institution.edu" autoComplete="email" maxLength={200} className={inputCls(errors.officialEmail)} />
                    </Field>
                    <Field label="Contact Person" error={errors.contactPerson}>
                      <input value={f.contactPerson} onChange={set('contactPerson')} onBlur={check('contactPerson')} placeholder="Full name" autoComplete="name" maxLength={120} className={inputCls(errors.contactPerson)} />
                    </Field>
                    <Field label="Phone Number" error={errors.phone}>
                      <input value={f.phone} onChange={set('phone')} onBlur={check('phone')} placeholder="10-digit number" inputMode="tel" autoComplete="tel" maxLength={20} className={inputCls(errors.phone)} />
                    </Field>
                    <Field label="Institution Type" error={errors.institutionType}>
                      <select value={f.institutionType} onChange={set('institutionType')} onBlur={check('institutionType')} className={`${inputCls(errors.institutionType)} cursor-pointer`}>
                        <option value="">Select a type</option>
                        {INSTITUTION_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                      </select>
                    </Field>
                    <Field label="City" error={errors.city}>
                      <input value={f.city} onChange={set('city')} onBlur={check('city')} placeholder="City" autoComplete="address-level2" maxLength={100} className={inputCls(errors.city)} />
                    </Field>
                    <Field label="State" error={errors.state}>
                      <select value={f.state} onChange={set('state')} onBlur={check('state')} autoComplete="address-level1" className={`${inputCls(errors.state)} cursor-pointer`}>
                        <option value="">Select a state</option>
                        {STATES.map((s) => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </Field>
                    <Field label="College Website" optional>
                      <input value={f.website} onChange={set('website')} placeholder="www.example.edu" inputMode="url" autoComplete="url" maxLength={300} className={inputCls(false)} />
                    </Field>
                    <Field label="Approx. Student Strength" optional error={errors.studentStrength}>
                      <input value={f.studentStrength} onChange={set('studentStrength')} onBlur={check('studentStrength')} placeholder="e.g. 1200" inputMode="numeric" maxLength={7} className={inputCls(errors.studentStrength)} />
                    </Field>
                    <Field label="Additional Message" optional className="sm:col-span-2">
                      <textarea value={f.message} onChange={set('message')} rows={3} maxLength={2000} placeholder="Anything else you'd like us to know" className={`${inputCls(false)} h-auto resize-none py-2.5`} />
                    </Field>
                  </div>
                </div>

                <div className="border-t border-mz-line px-6 py-4 sm:px-8">
                  {fail && <p role="alert" className="mb-3 text-[13px] text-red-600">{fail}</p>}
                  <button
                    type="submit"
                    disabled={busy}
                    className="group inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-[#0F8B7D] text-[15px] font-bold text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#0B7A6D] disabled:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {busy ? <Loader2 size={16} className="animate-spin" aria-hidden="true" /> : null}
                    {busy ? 'Submitting…' : 'Submit Campus Request →'}
                    
                  </button>
                </div>
              </form>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
