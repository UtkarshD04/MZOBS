import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Eye, EyeOff, Mail, Lock } from 'lucide-react'
import { Field, Input, SubmitButton } from '../ui/AuthField'
import { GoogleAuthButton, OrDivider } from '../ui/GoogleAuthButton'
import { EMPLOYER_APP_URL } from '../../lib/config'
import { loginEmployer, loginEmployerWithGoogle } from '../../lib/employerAuth'

const initialForm = { email: '', password: '' }

function validate(form) {
  const errors = {}
  if (!form.email.trim()) errors.email = 'Please enter your email.'
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errors.email = 'Enter a valid email address.'
  if (!form.password) errors.password = 'Please enter your password.'
  return errors
}

export default function EmployerSigninForm() {
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
      const { token } = await loginEmployer(form)
      window.location.href = `${EMPLOYER_APP_URL}/dashboard?token=${encodeURIComponent(token)}`
    } catch (err) {
      setStatus('idle')
      setErrors({ form: err.message })
    }
  }

  async function handleGoogleCredential(credential) {
    setErrors({})
    setStatus('submitting')
    try {
      const { token } = await loginEmployerWithGoogle({ credential })
      window.location.href = `${EMPLOYER_APP_URL}/dashboard?token=${encodeURIComponent(token)}`
    } catch (err) {
      setStatus('idle')
      setErrors({ form: err.message })
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <GoogleAuthButton onCredential={handleGoogleCredential} onError={(message) => setErrors({ form: message })} />
      <OrDivider />

      <Field label="Work email">
        <Input icon={Mail} type="email" value={form.email} onChange={(e) => update('email', e.target.value)} placeholder="you@company.com" />
        {errors.email && <span className="text-xs text-red mt-1 block">{errors.email}</span>}
      </Field>

      <Field label="Password">
        <div className="relative">
          <Input
            icon={Lock}
            type={showPassword ? 'text' : 'password'}
            value={form.password}
            onChange={(e) => update('password', e.target.value)}
            placeholder="Enter your password"
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

      <div className="flex justify-end -mt-2 mb-4">
        <Link to="/employers/forgot-password" className="text-xs font-bold text-[#595959] hover:text-black transition-colors">
          Forgot password?
        </Link>
      </div>

      {errors.form && <p className="text-xs text-red mb-4 -mt-2">{errors.form}</p>}

      <SubmitButton disabled={status === 'submitting'} className="mt-2">
        {status === 'submitting' ? (
          'Signing in...'
        ) : (
          <>
            Sign in <ArrowRight size={16} />
          </>
        )}
      </SubmitButton>
    </form>
  )
}
