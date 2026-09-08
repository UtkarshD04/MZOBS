import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowRight, Eye, EyeOff, Mail, Lock } from 'lucide-react'
import { Field, Input, PrimaryButton } from '../ui/JobsAuthField'
import { GoogleAuthButton, OrDivider } from '../ui/GoogleAuthButton'
import { loginEmployee, loginEmployeeWithGoogle } from '../../lib/employeeAuth'
import { saveEmployeeSession } from '../../lib/employeeSession'

const initialForm = { email: '', password: '' }

function validate(form) {
  const errors = {}
  if (!form.email.trim()) errors.email = 'Please enter your email.'
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errors.email = 'Enter a valid email address.'
  if (!form.password) errors.password = 'Please enter your password.'
  return errors
}

export default function EmployeeSigninForm() {
  const navigate = useNavigate()
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
      // The dashboard app isn't wired up to render anything yet — land back
      // on this site's own home page after a successful login for now.
      const { token, employee } = await loginEmployee(form)
      saveEmployeeSession({ token, employee })
      navigate('/')
    } catch (err) {
      setStatus('idle')
      setErrors({ form: err.message })
    }
  }

  async function handleGoogleCredential(credential) {
    setErrors({})
    setStatus('submitting')
    try {
      const { token, employee } = await loginEmployeeWithGoogle({ credential })
      saveEmployeeSession({ token, employee })
      navigate('/')
    } catch (err) {
      setStatus('idle')
      setErrors({ form: err.message })
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <GoogleAuthButton onCredential={handleGoogleCredential} onError={(message) => setErrors({ form: message })} />
      <OrDivider label="or sign in with email" />

      <Field label="Email address" error={errors.email}>
        <Input icon={Mail} type="email" value={form.email} onChange={(e) => update('email', e.target.value)} placeholder="you@example.com" autoComplete="email" error={errors.email} />
      </Field>

      <Field label="Password" error={errors.password}>
        <div className="relative">
          <Input
            icon={Lock}
            type={showPassword ? 'text' : 'password'}
            value={form.password}
            onChange={(e) => update('password', e.target.value)}
            placeholder="Enter your password"
            autoComplete="current-password"
            className="pr-10"
            error={errors.password}
          />
          <button
            type="button"
            onClick={() => setShowPassword((s) => !s)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-(--jobs-ink-soft) hover:text-(--jobs-navy) transition-colors"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
      </Field>

      <div className="flex justify-end -mt-2 mb-4">
        <Link to="/employees/forgot-password" className="text-xs font-bold text-(--jobs-ink-soft) hover:text-(--jobs-navy) transition-colors">
          Forgot password?
        </Link>
      </div>

      {errors.form && <p className="text-xs text-red-600 mb-4 -mt-2">{errors.form}</p>}

      <PrimaryButton disabled={status === 'submitting'} className="mt-2">
        {status === 'submitting' ? (
          'Signing in...'
        ) : (
          <>
            Sign in <ArrowRight size={16} />
          </>
        )}
      </PrimaryButton>
    </form>
  )
}
