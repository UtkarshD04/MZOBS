import { useState } from 'react'
import { ArrowRight, Eye, EyeOff } from 'lucide-react'
import { Field, Input } from '../ui/Field'
import Button, { goldSolidClass } from '../ui/Button'
import { EMPLOYER_APP_URL } from '../../lib/config'
import { signupEmployer } from '../../lib/employerAuth'

const initialForm = { companyName: '', name: '', email: '', password: '' }

function validate(form) {
  const errors = {}
  if (!form.companyName.trim()) errors.companyName = 'Please enter your company name.'
  if (!form.name.trim()) errors.name = 'Please enter your full name.'
  if (!form.email.trim()) errors.email = 'Please enter your email.'
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errors.email = 'Enter a valid email address.'
  if (!form.password) errors.password = 'Please create a password.'
  else if (form.password.length < 8) errors.password = 'Password must be at least 8 characters.'
  return errors
}

export default function EmployerSignupForm() {
  const [form, setForm] = useState(initialForm)
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('idle') // idle | submitting
  const [showPassword, setShowPassword] = useState(false)

  function update(key, value) {
    setForm((f) => ({ ...f, [key]: value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const nextErrors = validate(form)
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    setStatus('submitting')
    try {
      const { token } = await signupEmployer(form)
      window.location.href = `${EMPLOYER_APP_URL}/dashboard?token=${encodeURIComponent(token)}`
    } catch (err) {
      setStatus('idle')
      setErrors({ form: err.message })
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <Field label="Company name">
        <Input value={form.companyName} onChange={(e) => update('companyName', e.target.value)} placeholder="Acme Technologies" />
        {errors.companyName && <span className="text-xs text-red mt-1 block">{errors.companyName}</span>}
      </Field>

      <Field label="Your full name">
        <Input value={form.name} onChange={(e) => update('name', e.target.value)} placeholder="Rhea Kapoor" />
        {errors.name && <span className="text-xs text-red mt-1 block">{errors.name}</span>}
      </Field>

      <Field label="Work email">
        <Input type="email" value={form.email} onChange={(e) => update('email', e.target.value)} placeholder="you@company.com" />
        {errors.email && <span className="text-xs text-red mt-1 block">{errors.email}</span>}
      </Field>

      <Field label="Password">
        <div className="relative">
          <Input
            type={showPassword ? 'text' : 'password'}
            value={form.password}
            onChange={(e) => update('password', e.target.value)}
            placeholder="At least 8 characters"
            className="pr-10"
          />
          <button
            type="button"
            onClick={() => setShowPassword((s) => !s)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-tertiary hover:text-ink transition-colors"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
        {errors.password && <span className="text-xs text-red mt-1 block">{errors.password}</span>}
      </Field>

      {errors.form && <p className="text-xs text-red mb-4 -mt-2">{errors.form}</p>}

      <Button
        type="submit"
        variant="primary"
        size="lg"
        pill
        disabled={status === 'submitting'}
        className={`${goldSolidClass} w-full mt-2`}
      >
        {status === 'submitting' ? (
          'Creating your workspace...'
        ) : (
          <>
            Create your account <ArrowRight size={16} />
          </>
        )}
      </Button>

      <p className="text-[11.5px] text-ink-tertiary text-center mt-4 leading-relaxed">
        By signing up, you agree to Mzobs' Terms of Service and Privacy Policy.
      </p>
    </form>
  )
}
