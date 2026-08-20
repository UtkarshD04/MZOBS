import { useState } from 'react'
import { ArrowRight, Eye, EyeOff } from 'lucide-react'
import { Field, Input, Select, SubmitButton } from '../ui/AuthField'
import { EMPLOYER_APP_URL } from '../../lib/config'
import { signupEmployer } from '../../lib/employerAuth'

const COMPANY_SIZES = ['1–50 employees', '51–200 employees', '201–500 employees', '501–1000 employees', '1000+ employees']

const initialForm = {
  name: '',
  email: '',
  phone: '',
  password: '',
  companyName: '',
  industry: '',
  size: '',
  website: '',
  hq: '',
}

function validate(form) {
  const errors = {}
  if (!form.name.trim()) errors.name = 'Please enter your full name.'
  if (!form.email.trim()) errors.email = 'Please enter your email.'
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errors.email = 'Enter a valid email address.'
  if (!form.phone.trim()) errors.phone = 'Please enter your phone number.'
  else if (form.phone.replace(/\D/g, '').length !== 10) errors.phone = 'Enter a valid 10-digit phone number.'
  if (!form.password) errors.password = 'Please create a password.'
  else if (form.password.length < 8) errors.password = 'Password must be at least 8 characters.'
  if (!form.companyName.trim()) errors.companyName = 'Please enter your company name.'
  if (!form.industry.trim()) errors.industry = 'Please enter your industry.'
  if (!form.size) errors.size = 'Please select a company size.'
  if (!form.website.trim()) errors.website = 'Please enter your company website.'
  if (!form.hq.trim()) errors.hq = 'Please enter your headquarters city.'
  return errors
}

function SectionLabel({ children }) {
  return <div className="text-[11px] font-bold tracking-wide uppercase text-[#9E9E9E] pb-2 mb-1 border-b border-[#e0e0e0]">{children}</div>
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
      <SectionLabel>Your details</SectionLabel>

      <Field label="Your full name">
        <Input value={form.name} onChange={(e) => update('name', e.target.value)} placeholder="Rhea Kapoor" />
        {errors.name && <span className="text-xs text-red mt-1 block">{errors.name}</span>}
      </Field>

      <div className="grid sm:grid-cols-2 gap-x-4">
        <Field label="Work email">
          <Input type="email" value={form.email} onChange={(e) => update('email', e.target.value)} placeholder="you@company.com" />
          {errors.email && <span className="text-xs text-red mt-1 block">{errors.email}</span>}
        </Field>
        <Field label="Phone number">
          <Input type="tel" value={form.phone} onChange={(e) => update('phone', e.target.value.replace(/\D/g, '').slice(0, 10))} placeholder="98765 43210" />
          {errors.phone && <span className="text-xs text-red mt-1 block">{errors.phone}</span>}
        </Field>
      </div>

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
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9E9E9E] hover:text-black transition-colors"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
        {errors.password && <span className="text-xs text-red mt-1 block">{errors.password}</span>}
      </Field>

      <div className="mt-2">
        <SectionLabel>Company details</SectionLabel>
      </div>

      <Field label="Company name">
        <Input value={form.companyName} onChange={(e) => update('companyName', e.target.value)} placeholder="Acme Technologies" />
        {errors.companyName && <span className="text-xs text-red mt-1 block">{errors.companyName}</span>}
      </Field>

      <div className="grid sm:grid-cols-2 gap-x-4">
        <Field label="Industry">
          <Input value={form.industry} onChange={(e) => update('industry', e.target.value)} placeholder="e.g. IT Services" />
          {errors.industry && <span className="text-xs text-red mt-1 block">{errors.industry}</span>}
        </Field>
        <Field label="Company size">
          <Select value={form.size} onChange={(e) => update('size', e.target.value)}>
            <option value="" disabled>
              Select size
            </option>
            {COMPANY_SIZES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </Select>
          {errors.size && <span className="text-xs text-red mt-1 block">{errors.size}</span>}
        </Field>
      </div>

      <div className="grid sm:grid-cols-2 gap-x-4">
        <Field label="Website">
          <Input value={form.website} onChange={(e) => update('website', e.target.value)} placeholder="acme.com" />
          {errors.website && <span className="text-xs text-red mt-1 block">{errors.website}</span>}
        </Field>
        <Field label="Headquarters city">
          <Input value={form.hq} onChange={(e) => update('hq', e.target.value)} placeholder="Bengaluru" />
          {errors.hq && <span className="text-xs text-red mt-1 block">{errors.hq}</span>}
        </Field>
      </div>

      {errors.form && <p className="text-xs text-red mb-4 -mt-2">{errors.form}</p>}

      <SubmitButton disabled={status === 'submitting'} className="mt-2">
        {status === 'submitting' ? (
          'Creating your workspace...'
        ) : (
          <>
            Create your account <ArrowRight size={16} />
          </>
        )}
      </SubmitButton>

      <p className="text-[11.5px] text-[#9E9E9E] text-center mt-4 leading-relaxed">
        By signing up, you agree to Mzobs' Terms of Service and Privacy Policy.
      </p>
    </form>
  )
}
