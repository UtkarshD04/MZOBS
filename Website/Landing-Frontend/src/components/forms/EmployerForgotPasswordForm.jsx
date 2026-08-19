import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, CheckCircle2, MailCheck } from 'lucide-react'
import { Field, Input, SubmitButton } from '../ui/AuthField'
import { forgotPasswordEmployer } from '../../lib/employerAuth'

function validate(form) {
  const errors = {}
  if (!form.email.trim()) errors.email = 'Please enter your email.'
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errors.email = 'Enter a valid email address.'
  return errors
}

export default function EmployerForgotPasswordForm() {
  const [email, setEmail] = useState('')
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('idle') // idle | submitting | success

  async function handleSubmit(e) {
    e.preventDefault()
    const nextErrors = validate({ email })
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    setStatus('submitting')
    try {
      await forgotPasswordEmployer({ email })
      setStatus('success')
    } catch (err) {
      setStatus('idle')
      setErrors({ form: err.message })
    }
  }

  if (status === 'success') {
    return (
      <div className="flex flex-col items-center justify-center text-center py-6">
        <div className="w-14 h-14 rounded-full bg-green-tint text-green flex items-center justify-center mb-4">
          <CheckCircle2 size={26} />
        </div>
        <h3 className="text-lg font-black text-black">Check your email</h3>
        <p className="text-[13.5px] text-[#595959] mt-1.5 max-w-xs">
          If an account exists for <strong>{email}</strong>, we've sent a link to reset your password. It expires in 30 minutes.
        </p>
        <Link to="/employers/signin" className="text-xs font-bold text-[#595959] hover:text-black transition-colors mt-6">
          Back to sign in
        </Link>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="flex items-center gap-2 text-[#595959] mb-4">
        <MailCheck size={16} />
        <p className="text-[13px] font-medium">We'll email you a link to reset your password.</p>
      </div>

      <Field label="Work email">
        <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@company.com" autoFocus />
        {errors.email && <span className="text-xs text-red mt-1 block">{errors.email}</span>}
      </Field>

      {errors.form && <p className="text-xs text-red mb-4 -mt-2">{errors.form}</p>}

      <SubmitButton disabled={status === 'submitting'} className="mt-2">
        {status === 'submitting' ? (
          'Sending link...'
        ) : (
          <>
            Send reset link <ArrowRight size={16} />
          </>
        )}
      </SubmitButton>
    </form>
  )
}
