import { useState } from 'react'
import { ArrowRight, CheckCircle2, Eye, EyeOff } from 'lucide-react'
import { Field, Input, Select } from '../ui/Field'
import Button, { goldSolidClass } from '../ui/Button'

const GRADUATION_OPTIONS = [
  '12th / No Degree',
  'Diploma',
  'B.Tech / B.E.',
  'B.Sc',
  'B.Com',
  'BA',
  'BBA',
  'BCA',
  'M.Tech / M.E.',
  'MBA',
  'MCA',
  'M.Sc',
  'Other'
]

const initialForm = { name: '', email: '', password: '', experience: 'fresher', graduation: '' }

function validate(form) {
  const errors = {}
  if (!form.name.trim()) errors.name = 'Please enter your full name.'
  if (!form.email.trim()) errors.email = 'Please enter your email.'
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errors.email = 'Enter a valid email address.'
  if (!form.password) errors.password = 'Please create a password.'
  else if (form.password.length < 8) errors.password = 'Password must be at least 8 characters.'
  if (!form.graduation) errors.graduation = 'Please select your graduation.'
  return errors
}

export default function EmployeeSignupForm() {
  const [form, setForm] = useState(initialForm)
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('idle') // idle | submitting | success
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
    // TODO: wire up to the real Frontend registration endpoint once this
    // marketing site is connected to Backend / the employee app's auth API.
    await new Promise((resolve) => setTimeout(resolve, 700))
    setStatus('success')
  }

  if (status === 'success') {
    return (
      <div className="flex flex-col items-center justify-center text-center py-6">
        <div className="w-14 h-14 rounded-full bg-green-tint text-green flex items-center justify-center mb-4">
          <CheckCircle2 size={26} />
        </div>
        <h3 className="text-lg font-bold tracking-tight text-[#0B1220]">You're all set, {form.name.split(' ')[0]}!</h3>
        <p className="text-[13.5px] text-slate-600 mt-1.5 max-w-xs">
          Your Mzobs account has been created. Sign in to complete your profile and start getting matched.
        </p>
        <Button to="/employees/signin" variant="primary" size="lg" pill className={`${goldSolidClass} mt-6`}>
          Sign in to continue <ArrowRight size={16} />
        </Button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <Field label="Full name">
        <Input value={form.name} onChange={(e) => update('name', e.target.value)} placeholder="Ananya Iyer" />
        {errors.name && <span className="text-xs text-red mt-1 block">{errors.name}</span>}
      </Field>

      <Field label="Email">
        <Input type="email" value={form.email} onChange={(e) => update('email', e.target.value)} placeholder="you@example.com" />
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

      <Field label="You are a...">
        <div className="grid grid-cols-2 gap-3">
          {[
            { value: 'fresher', label: 'Fresher' },
            { value: 'experienced', label: 'Experienced' }
          ].map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => update('experience', opt.value)}
              className={`h-10 rounded-[9px] text-[13.5px] font-semibold border transition-all duration-200 ${
                form.experience === opt.value
                  ? 'bg-[#0B1220] border-[#0B1220] text-white shadow-sm'
                  : 'bg-surface border-border-strong text-ink-secondary hover:border-ink-tertiary'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </Field>

      <Field label="Graduation">
        <Select value={form.graduation} onChange={(e) => update('graduation', e.target.value)}>
          <option value="" disabled>
            Select your graduation
          </option>
          {GRADUATION_OPTIONS.map((g) => (
            <option key={g} value={g}>
              {g}
            </option>
          ))}
        </Select>
        {errors.graduation && <span className="text-xs text-red mt-1 block">{errors.graduation}</span>}
      </Field>

      <Button
        type="submit"
        variant="primary"
        size="lg"
        pill
        disabled={status === 'submitting'}
        className={`${goldSolidClass} w-full mt-2`}
      >
        {status === 'submitting' ? (
          'Creating your account...'
        ) : (
          <>
            Create free account <ArrowRight size={16} />
          </>
        )}
      </Button>

      <p className="text-[11.5px] text-ink-tertiary text-center mt-4 leading-relaxed">
        By signing up, you agree to Mzobs' Terms of Service and Privacy Policy.
      </p>
    </form>
  )
}
