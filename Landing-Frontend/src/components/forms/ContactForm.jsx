import { useState } from 'react'
import { CheckCircle2, Send } from 'lucide-react'
import { Field, Input, Select, Textarea } from '../ui/Field'
import Button from '../ui/Button'
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
        <div className="w-14 h-14 rounded-full bg-green-tint text-green flex items-center justify-center mb-4">
          <CheckCircle2 size={26} />
        </div>
        <h3 className="text-lg font-bold tracking-tight">Message sent</h3>
        <p className="text-[13.5px] text-ink-secondary mt-1.5 max-w-xs">
          Thanks for reaching out — our team will get back to you within one business day.
        </p>
        <Button variant="secondary" size="md" className="mt-6" onClick={() => setStatus('idle')}>
          Send another message
        </Button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="grid sm:grid-cols-2 gap-x-4">
        <Field label="Full name">
          <Input value={form.name} onChange={(e) => update('name', e.target.value)} placeholder="Ananya Iyer" />
          {errors.name && <span className="text-xs text-red mt-1 block">{errors.name}</span>}
        </Field>
        <Field label="Email">
          <Input type="email" value={form.email} onChange={(e) => update('email', e.target.value)} placeholder="you@example.com" />
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
        <Input value={form.subject} onChange={(e) => update('subject', e.target.value)} placeholder="What's this about?" />
        {errors.subject && <span className="text-xs text-red mt-1 block">{errors.subject}</span>}
      </Field>

      <Field label="Message">
        <Textarea value={form.message} onChange={(e) => update('message', e.target.value)} placeholder="Tell us a bit more..." />
        {errors.message && <span className="text-xs text-red mt-1 block">{errors.message}</span>}
      </Field>

      {submitError && <p className="text-xs text-red mb-3">{submitError}</p>}

      <Button type="submit" variant="primary" size="lg" pill disabled={status === 'submitting'} className="w-full sm:w-auto mt-2">
        {status === 'submitting' ? (
          'Sending...'
        ) : (
          <>
            Send Message <Send size={15} />
          </>
        )}
      </Button>
    </form>
  )
}
