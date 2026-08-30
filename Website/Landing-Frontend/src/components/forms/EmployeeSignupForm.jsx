import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Eye, EyeOff, CheckCircle2, User, Mail, Phone, Lock, GraduationCap } from 'lucide-react'
import { Field, Input, Select, SubmitButton } from '../ui/AuthField'
import { GoogleAuthButton, OrDivider, decodeGoogleCredential } from '../ui/GoogleAuthButton'
import { EMPLOYEE_APP_URL } from '../../lib/config'
import { signupEmployee, signupEmployeeWithGoogle } from '../../lib/employeeAuth'

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

const initialForm = { name: '', email: '', phone: '', password: '', experience: 'fresher', graduation: '' }

function validate(form, hasGoogle) {
  const errors = {}
  if (!hasGoogle) {
    if (!form.name.trim()) errors.name = 'Please enter your full name.'
    if (!form.email.trim()) errors.email = 'Please enter your email.'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errors.email = 'Enter a valid email address.'
    if (!form.password) errors.password = 'Please create a password.'
    else if (form.password.length < 8) errors.password = 'Password must be at least 8 characters.'
  }
  if (!form.phone.trim()) errors.phone = 'Please enter your phone number.'
  else if (form.phone.replace(/\D/g, '').length !== 10) errors.phone = 'Enter a valid 10-digit phone number.'
  if (!form.graduation) errors.graduation = 'Please select your graduation.'
  return errors
}

export default function EmployeeSignupForm() {
  const [form, setForm] = useState(initialForm)
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('idle') // idle | submitting
  const [showPassword, setShowPassword] = useState(false)
  const [googleCredential, setGoogleCredential] = useState(null)

  function update(key, value) {
    setForm((f) => ({ ...f, [key]: value }))
  }

  function handleGoogleCredential(credential) {
    const { name, email } = decodeGoogleCredential(credential)
    setGoogleCredential(credential)
    setForm((f) => ({ ...f, name: name || f.name, email: email || f.email, password: '' }))
    setErrors({})
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const nextErrors = validate(form, Boolean(googleCredential))
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    setStatus('submitting')
    try {
      const { token } = googleCredential
        ? await signupEmployeeWithGoogle({
            credential: googleCredential,
            phone: form.phone,
            experience: form.experience,
            graduation: form.graduation,
          })
        : await signupEmployee(form)
      // Account is created unpaid — profile setup and the one-time ₹299
      // payment both happen inside the dashboard app, not here. Same
      // cross-app token handoff EmployeeSigninForm uses (localStorage isn't
      // shared across origins/ports; main.jsx on the other side reads ?token=).
      window.location.href = `${EMPLOYEE_APP_URL}/onboarding?token=${encodeURIComponent(token)}`
    } catch (err) {
      setStatus('idle')
      setErrors({ form: err.message })
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <GoogleAuthButton onCredential={handleGoogleCredential} onError={(message) => setErrors({ form: message })} />
      <OrDivider />

      {googleCredential ? (
        <div className="flex items-center gap-2.5 mb-4 px-4 py-3 rounded-xl bg-[var(--careers-tint-sage)] text-[13px] font-semibold text-[var(--careers-tint-sage-ink)]">
          <CheckCircle2 size={16} className="shrink-0" />
          Signed in as {form.name || form.email} — no password needed.
        </div>
      ) : (
        <>
          <Field label="Full name">
            <Input icon={User} value={form.name} onChange={(e) => update('name', e.target.value)} placeholder="Ananya Iyer" />
            {errors.name && <span className="text-xs text-red mt-1 block">{errors.name}</span>}
          </Field>

          <Field label="Email">
            <Input icon={Mail} type="email" value={form.email} onChange={(e) => update('email', e.target.value)} placeholder="you@example.com" />
            {errors.email && <span className="text-xs text-red mt-1 block">{errors.email}</span>}
          </Field>
        </>
      )}

      <Field label="Phone number">
        <Input
          icon={Phone}
          type="tel"
          value={form.phone}
          onChange={(e) => update('phone', e.target.value.replace(/\D/g, '').slice(0, 10))}
          placeholder="98765 43210"
        />
        {errors.phone && <span className="text-xs text-red mt-1 block">{errors.phone}</span>}
      </Field>

      {!googleCredential && (
        <Field label="Password">
          <div className="relative">
            <Input
              icon={Lock}
              type={showPassword ? 'text' : 'password'}
              value={form.password}
              onChange={(e) => update('password', e.target.value)}
              placeholder="At least 8 characters"
              className="pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword((s) => !s)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9E9E9E] hover:text-black transition-colors"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          {errors.password && <span className="text-xs text-red mt-1 block">{errors.password}</span>}
        </Field>
      )}

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
              className={`h-11 rounded-xl text-[13.5px] font-bold border transition-all duration-200 ${
                form.experience === opt.value
                  ? 'bg-[var(--careers-accent)] border-[var(--careers-accent)] text-white'
                  : 'bg-white border-[#C9C9C9] text-[#595959] hover:border-[var(--careers-accent)]'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </Field>

      <Field label="Graduation">
        <Select icon={GraduationCap} value={form.graduation} onChange={(e) => update('graduation', e.target.value)}>
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

      {errors.form && <p className="text-xs text-red mb-4 -mt-2">{errors.form}</p>}

      <SubmitButton disabled={status === 'submitting'} className="mt-2">
        {status === 'submitting' ? (
          'Creating your account...'
        ) : (
          <>
            Create account <ArrowRight size={16} />
          </>
        )}
      </SubmitButton>

      <p className="text-[11.5px] text-[#9E9E9E] text-center mt-4 leading-relaxed">
        By signing up, you agree to Mzobs'{' '}
        <Link to="/terms-of-service" className="text-[#595959] font-bold hover:text-[var(--careers-accent)] transition-colors">
          Terms of Service
        </Link>{' '}
        and{' '}
        <Link to="/privacy-policy" className="text-[#595959] font-bold hover:text-[var(--careers-accent)] transition-colors">
          Privacy Policy
        </Link>
        .
      </p>
    </form>
  )
}
