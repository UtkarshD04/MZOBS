import { useState } from 'react'
import { ArrowRight, Eye, EyeOff } from 'lucide-react'
import { Field, Input } from '../ui/Field'
import Button, { goldSolidClass } from '../ui/Button'
import { EMPLOYEE_APP_URL } from '../../lib/config'
import { loginEmployee } from '../../lib/employeeAuth'

const initialForm = { email: '', password: '' }

function validate(form) {
  const errors = {}
  if (!form.email.trim()) errors.email = 'Please enter your email.'
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errors.email = 'Enter a valid email address.'
  if (!form.password) errors.password = 'Please enter your password.'
  return errors
}

export default function EmployeeSigninForm() {
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
      const { token } = await loginEmployee(form)
      window.location.href = `${EMPLOYEE_APP_URL}/app/dashboard?token=${encodeURIComponent(token)}`
    } catch (err) {
      setStatus('idle')
      setErrors({ form: err.message })
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
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
            placeholder="Enter your password"
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

      <div className="flex justify-end -mt-2 mb-4">
        <a href="#forgot-password" className="text-xs font-semibold text-slate-500 hover:text-[#0B1220] transition-colors">
          Forgot password?
        </a>
      </div>

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
          'Signing in...'
        ) : (
          <>
            Sign in <ArrowRight size={16} />
          </>
        )}
      </Button>
    </form>
  )
}
