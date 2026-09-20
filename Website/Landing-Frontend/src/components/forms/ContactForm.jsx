import { useState } from 'react'
import { CheckCircle2, ChevronDown, Send, User, Mail, Tag } from 'lucide-react'
import ExplorerButton from '../ui/ExplorerButton'
import { submitContactMessage } from '../../lib/contact'

// Inputs scoped to the --explorer-* palette used by the rest of the
// job-discovery site (the shared AuthField inputs use the older --careers-*
// look and stay untouched for the sign-in/sign-up forms).
const inputClass =
  'h-11 px-4 rounded-lg border border-(--explorer-border) bg-white text-(--explorer-navy) text-[14px] font-medium w-full transition-colors duration-150 outline-none placeholder:text-(--explorer-muted)/70 hover:border-(--explorer-blue-border) focus:border-(--explorer-blue) focus:ring-[3px] focus:ring-(--explorer-blue)/15'

function Field({ label, htmlFor, error, children }) {
  return (
    <div className="flex flex-col gap-1.5 mb-4">
      <label htmlFor={htmlFor} className="text-[12.5px] font-bold text-(--explorer-navy)">
        {label}
      </label>
      {children}
      {error && <span className="text-xs text-red-600">{error}</span>}
    </div>
  )
}

function IconInput({ icon: Icon, ...props }) {
  return (
    <div className="relative">
      <Icon size={16} strokeWidth={1.8} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-(--explorer-muted) pointer-events-none" />
      <input className={`${inputClass} pl-10`} {...props} />
    </div>
  )
}

const initialForm = { name: '', email: '', role: 'Job Seeker', subject: '', message: '' }

function validate(form) {
  const errors = {}
  if (!form.name.trim()) errors.name = 'Please enter your name.'
  if (!form.email.trim()) errors.email = 'Please enter your email.'
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errors.email = 'Enter a valid email address.'
  if (!form.subject.trim()) errors.subject = 'Please add a subject.'
  if (!form.message.trim()) errors.message = 'Tell us a little about what you need.'
  return errors
}

export default function ContactForm() {
  const [form, setForm] = useState(initialForm)
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('idle') // idle | submitting | success
  const [submitError, setSubmitError] = useState('')

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
      await submitContactMessage(form)
      setStatus('success')
      setForm(initialForm)
    } catch (err) {
      setSubmitError(err.message)
      setStatus('idle')
    }
  }

  if (status === 'success') {
    return (
      <div className="flex flex-col items-center justify-center text-center h-full py-10">
        <div className="w-14 h-14 rounded-full bg-(--explorer-teal-surface) text-(--explorer-teal) flex items-center justify-center mb-4">
          <CheckCircle2 size={26} />
        </div>
        <h3 className="text-lg font-extrabold text-(--explorer-navy) tracking-tight">Message sent</h3>
        <p className="text-[14px] text-(--explorer-muted) mt-1.5 max-w-xs">
          Thanks for reaching out — our team will get back to you within one business day.
        </p>
        <ExplorerButton variant="secondary" className="mt-6" onClick={() => setStatus('idle')}>
          Send another message
        </ExplorerButton>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="grid sm:grid-cols-2 sm:gap-x-4">
        <Field label="Full name" htmlFor="contact-name" error={errors.name}>
          <IconInput id="contact-name" icon={User} value={form.name} onChange={(e) => update('name', e.target.value)} placeholder="Ananya Iyer" />
        </Field>
        <Field label="Email" htmlFor="contact-email" error={errors.email}>
          <IconInput id="contact-email" icon={Mail} type="email" value={form.email} onChange={(e) => update('email', e.target.value)} placeholder="you@example.com" />
        </Field>
      </div>

      <Field label="I am a..." htmlFor="contact-role">
        <div className="relative">
          <select id="contact-role" className={`${inputClass} appearance-none pr-9`} value={form.role} onChange={(e) => update('role', e.target.value)}>
            <option>Job Seeker</option>
            <option>Employer</option>
            <option>Other</option>
          </select>
          <ChevronDown size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-(--explorer-muted) pointer-events-none" />
        </div>
      </Field>

      <Field label="Subject" htmlFor="contact-subject" error={errors.subject}>
        <IconInput id="contact-subject" icon={Tag} value={form.subject} onChange={(e) => update('subject', e.target.value)} placeholder="What's this about?" />
      </Field>

      <Field label="Message" htmlFor="contact-message" error={errors.message}>
        <textarea
          id="contact-message"
          className={`${inputClass} h-auto min-h-[130px] py-3 resize-none`}
          value={form.message}
          onChange={(e) => update('message', e.target.value)}
          placeholder="Tell us a bit more..."
        />
      </Field>

      {submitError && <p className="text-xs text-red-600 mb-3">{submitError}</p>}

      <ExplorerButton type="submit" size="lg" disabled={status === 'submitting'} className="w-full sm:w-auto sm:px-8 mt-2">
        {status === 'submitting' ? (
          'Sending...'
        ) : (
          <>
            Send message <Send size={15} />
          </>
        )}
      </ExplorerButton>
    </form>
  )
}
