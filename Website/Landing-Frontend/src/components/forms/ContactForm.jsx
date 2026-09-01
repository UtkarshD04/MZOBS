import { useState } from 'react'
import { CheckCircle2, Send, User, Mail, Tag, MessageSquare } from 'lucide-react'
import { Field, Input, Select, Textarea, SubmitButton } from '../ui/AuthField'
import { submitContactMessage } from '../../lib/contact'

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
        <div className="w-14 h-14 rounded-full bg-[var(--careers-tint-sage)] text-[var(--careers-accent)] flex items-center justify-center mb-4">
          <CheckCircle2 size={26} />
        </div>
        <h3 className="text-lg font-black text-black tracking-tight">Message sent</h3>
        <p className="text-[13.5px] text-[#595959] font-medium mt-1.5 max-w-xs">
          Thanks for reaching out — our team will get back to you within one business day.
        </p>
        <button
          type="button"
          onClick={() => setStatus('idle')}
          className="mt-6 h-10 px-5 inline-flex items-center justify-center rounded-full border border-[#e0e0e0] bg-white text-sm font-bold text-black hover:border-[var(--careers-accent)] hover:text-[var(--careers-accent)] transition-colors duration-150"
        >
          Send another message
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="grid sm:grid-cols-2 sm:gap-x-4">
        <Field label="Full name">
          <Input icon={User} value={form.name} onChange={(e) => update('name', e.target.value)} placeholder="Ananya Iyer" />
          {errors.name && <span className="text-xs text-red mt-1 block">{errors.name}</span>}
        </Field>
        <Field label="Email">
          <Input icon={Mail} type="email" value={form.email} onChange={(e) => update('email', e.target.value)} placeholder="you@example.com" />
          {errors.email && <span className="text-xs text-red mt-1 block">{errors.email}</span>}
        </Field>
      </div>

      <Field label="I am a...">
        <Select value={form.role} onChange={(e) => update('role', e.target.value)}>
          <option>Job Seeker</option>
          <option>Employer</option>
          <option>Other</option>
        </Select>
      </Field>

      <Field label="Subject">
        <Input icon={Tag} value={form.subject} onChange={(e) => update('subject', e.target.value)} placeholder="What's this about?" />
        {errors.subject && <span className="text-xs text-red mt-1 block">{errors.subject}</span>}
      </Field>

      <Field label="Message">
        <Textarea value={form.message} onChange={(e) => update('message', e.target.value)} placeholder="Tell us a bit more..." />
        {errors.message && <span className="text-xs text-red mt-1 block">{errors.message}</span>}
      </Field>

      {submitError && <p className="text-xs text-red mb-3">{submitError}</p>}

      <SubmitButton disabled={status === 'submitting'} className="w-full sm:w-auto sm:px-8 mt-2">
        {status === 'submitting' ? (
          'Sending...'
        ) : (
          <>
            Send Message <Send size={15} />
          </>
        )}
      </SubmitButton>
    </form>
  )
}
