import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { X, CheckCircle2, ArrowRight, Paperclip } from 'lucide-react'
import Reveal from '../../ui/Reveal'
import { PROBLEM_TYPES } from '../../../lib/helpContent'
import { submitContactMessage } from '../../../lib/contact'

const initialForm = { type: PROBLEM_TYPES[0], email: '', description: '' }

function validate(form) {
  const errors = {}
  if (!form.type) errors.type = 'Choose what this is about.'
  if (!form.email.trim()) errors.email = 'Please enter your email.'
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errors.email = 'Enter a valid email address.'
  if (!form.description.trim()) errors.description = 'Tell us what happened.'
  return errors
}

// Reuses the same real contact pipeline the query form below submits to
// (Backend's /api/contact — see lib/contact.js) rather than a separate,
// half-built "report" endpoint — the report just arrives as a clearly
// labeled message ("Report: Suspicious job") so support triages it the
// same way. The optional attachment is collected here for a human to ask
// for by email if needed; there's no file-upload endpoint yet, so it's
// deliberately not sent — never claiming a file was received when it wasn't.
function ReportModal({ onClose }) {
  const [form, setForm] = useState(initialForm)
  const [errors, setErrors] = useState({})
  const [file, setFile] = useState(null)
  const [status, setStatus] = useState('idle') // idle | submitting | success
  const [submitError, setSubmitError] = useState('')
  const dialogRef = useRef(null)

  useEffect(() => {
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    function onKeyDown(e) {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKeyDown)
    dialogRef.current?.focus()
    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [onClose])

  function update(key, value) {
    setForm((f) => ({ ...f, [key]: value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const nextErrors = validate(form)
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    setStatus('submitting')
    setSubmitError('')
    try {
      await submitContactMessage({
        name: 'Problem report',
        email: form.email,
        role: 'Other',
        subject: `Report: ${form.type}`,
        message: file ? `${form.description}\n\n(Attachment mentioned: ${file.name} — reply to this email to send it.)` : form.description,
      })
      setStatus('success')
    } catch (err) {
      setSubmitError(err.message)
      setStatus('idle')
    }
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-6">
      <motion.div
        className="absolute inset-0 bg-(--explorer-navy)/40 backdrop-blur-[2px]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        onClick={onClose}
        aria-hidden="true"
      />

      <motion.div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="report-problem-title"
        tabIndex={-1}
        className="relative w-full sm:max-w-lg bg-white rounded-t-3xl sm:rounded-2xl shadow-[0_32px_64px_-24px_rgba(18,50,74,0.4)] max-h-[92vh] overflow-y-auto outline-none"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 16 }}
        transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="flex items-start justify-between gap-4 px-6 sm:px-8 pt-6 sm:pt-8">
          <h2 id="report-problem-title" className="text-xl font-black text-(--explorer-navy) tracking-tight">
            Report a problem
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="shrink-0 flex items-center justify-center w-9 h-9 rounded-full text-(--explorer-navy)/50 hover:bg-(--explorer-bg) hover:text-(--explorer-navy) transition-colors duration-150"
          >
            <X size={18} aria-hidden="true" />
          </button>
        </div>

        <div className="px-6 sm:px-8 pb-8 sm:pb-9 pt-2">
          {status === 'success' ? (
            <div className="py-8 flex flex-col items-start">
              <div className="w-12 h-12 rounded-full bg-(--explorer-blue-surface) text-(--explorer-blue) flex items-center justify-center mb-5">
                <CheckCircle2 size={22} />
              </div>
              <p className="text-[15px] font-bold text-(--explorer-navy)">Thanks for letting us know.</p>
              <p className="mt-2 text-[13.5px] text-(--explorer-muted) font-medium leading-relaxed max-w-sm">
                Our team reviews every report and will follow up by email if we need anything else.
              </p>
              <button
                type="button"
                onClick={onClose}
                className="mt-7 h-11 px-6 rounded-md bg-(--explorer-navy) text-white text-[13px] font-bold uppercase tracking-wide hover:brightness-110 transition-[filter] duration-200"
              >
                Done
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
              <p className="text-[13.5px] text-(--explorer-muted) font-medium leading-relaxed">
                Help us keep MZOBS safe and trustworthy — every report is reviewed by our team.
              </p>

              <div className="flex flex-col gap-2">
                <label htmlFor="report-type" className="text-[11px] font-bold uppercase tracking-[0.14em] text-(--explorer-navy)/55">
                  What's this about?
                </label>
                <select
                  id="report-type"
                  value={form.type}
                  onChange={(e) => update('type', e.target.value)}
                  className="h-11 px-3 rounded-lg border border-(--explorer-border) bg-white text-[14.5px] text-(--explorer-navy) outline-none focus:border-(--explorer-blue) transition-colors duration-200"
                >
                  {PROBLEM_TYPES.map((t) => (
                    <option key={t}>{t}</option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="report-email" className="text-[11px] font-bold uppercase tracking-[0.14em] text-(--explorer-navy)/55">
                  Your email
                </label>
                <input
                  id="report-email"
                  type="email"
                  value={form.email}
                  onChange={(e) => update('email', e.target.value)}
                  placeholder="you@example.com"
                  aria-invalid={!!errors.email}
                  aria-describedby={errors.email ? 'report-email-error' : undefined}
                  className={`h-11 px-3 rounded-lg border bg-white text-[14.5px] text-(--explorer-navy) placeholder:text-(--explorer-muted)/60 outline-none transition-colors duration-200 ${
                    errors.email ? 'border-[#b42318]' : 'border-(--explorer-border) focus:border-(--explorer-blue)'
                  }`}
                />
                {errors.email && (
                  <span id="report-email-error" className="text-[12px] text-[#b42318]">
                    {errors.email}
                  </span>
                )}
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="report-description" className="text-[11px] font-bold uppercase tracking-[0.14em] text-(--explorer-navy)/55">
                  Description
                </label>
                <textarea
                  id="report-description"
                  value={form.description}
                  onChange={(e) => update('description', e.target.value)}
                  placeholder="Tell us what you saw and where — the more detail, the faster we can act."
                  aria-invalid={!!errors.description}
                  aria-describedby={errors.description ? 'report-description-error' : undefined}
                  className={`min-h-[104px] px-3 py-2.5 rounded-lg border bg-white text-[14.5px] text-(--explorer-navy) placeholder:text-(--explorer-muted)/60 outline-none resize-none transition-colors duration-200 ${
                    errors.description ? 'border-[#b42318]' : 'border-(--explorer-border) focus:border-(--explorer-blue)'
                  }`}
                />
                {errors.description && (
                  <span id="report-description-error" className="text-[12px] text-[#b42318]">
                    {errors.description}
                  </span>
                )}
              </div>

              <div className="flex flex-col gap-2">
                <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-(--explorer-navy)/55">Attachment (optional)</span>
                <label className="inline-flex items-center gap-2 w-fit px-3.5 h-10 rounded-lg border border-dashed border-(--explorer-border) text-[13px] font-semibold text-(--explorer-navy)/70 cursor-pointer hover:border-(--explorer-blue-border) hover:text-(--explorer-blue) transition-colors duration-150">
                  <Paperclip size={14} aria-hidden="true" />
                  {file ? file.name : 'Choose a screenshot or file'}
                  <input type="file" className="sr-only" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
                </label>
              </div>

              {submitError && <p className="text-[12.5px] text-[#b42318]">{submitError}</p>}

              <button
                type="submit"
                disabled={status === 'submitting'}
                className="group mt-1 inline-flex items-center justify-center gap-2 h-12 rounded-md bg-(--explorer-blue) text-white text-[13px] font-bold uppercase tracking-[0.09em] motion-safe:transition-[filter,transform] motion-safe:duration-200 hover:brightness-110 motion-safe:hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
              >
                {status === 'submitting' ? (
                  'Submitting...'
                ) : (
                  <>
                    Submit report
                    <ArrowRight size={15} className="motion-safe:transition-transform motion-safe:duration-200 group-hover:translate-x-1" aria-hidden="true" />
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </motion.div>
    </div>
  )
}

// The section's own CTA + the modal it opens, bundled as one component so
// Contact.jsx doesn't need to manage this state itself.
export default function ProblemReport() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <Reveal direction="up" duration={0.5} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">
        <div>
          <h3 className="text-[19px] sm:text-[21px] font-black text-(--explorer-navy) tracking-tight text-balance">
            Spotted something that doesn't look right?
          </h3>
          <p className="mt-1.5 text-[14px] text-(--explorer-muted) font-medium">Help us keep MZOBS safe and trustworthy.</p>
        </div>
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="group shrink-0 inline-flex items-center gap-2 h-12 px-6 rounded-md bg-(--explorer-blue) text-white text-[13px] font-bold uppercase tracking-wide motion-safe:transition-[filter,transform] motion-safe:duration-200 hover:brightness-110 motion-safe:hover:-translate-y-0.5"
        >
          Report a problem
          <ArrowRight size={15} className="motion-safe:transition-transform motion-safe:duration-200 group-hover:translate-x-1" aria-hidden="true" />
        </button>
      </Reveal>

      {typeof document !== 'undefined' &&
        createPortal(
          <AnimatePresence>{open && <ReportModal onClose={() => setOpen(false)} />}</AnimatePresence>,
          document.body
        )}
    </>
  )
}
