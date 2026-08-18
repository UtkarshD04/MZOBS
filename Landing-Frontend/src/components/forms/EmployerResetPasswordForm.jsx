import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { ArrowRight, CheckCircle2, Eye, EyeOff } from 'lucide-react'
import { Field, Input, SubmitButton, LinkButton } from '../ui/AuthField'
import { resetPasswordEmployer } from '../../lib/employerAuth'

function validate(form) {
  const errors = {}
  if (!form.password) errors.password = 'Please enter a new password.'
  else if (form.password.length < 8) errors.password = 'Password must be at least 8 characters.'
  if (form.confirm !== form.password) errors.confirm = "Passwords don't match."
  return errors
}

export default function EmployerResetPasswordForm() {
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token') ?? ''
  const [form, setForm] = useState({ password: '', confirm: '' })
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
    try {
      await resetPasswordEmployer({ token, password: form.password })
      setStatus('success')
    } catch (err) {
      setStatus('idle')
      setErrors({ form: err.message })
    }
  }

  if (!token) {
    return (
      <div className="text-center py-6">
        <p className="text-sm text-[#595959]">
          This reset link is missing or invalid. Please request a new one.
        </p>
        <Link to="/employers/forgot-password" className="inline-block mt-4 text-xs font-bold text-[#595959] hover:text-black transition-colors">
          Request a new link
        </Link>
      </div>
    )
  }

  if (status === 'success') {
    return (
      <div className="flex flex-col items-center justify-center text-center py-6">
        <div className="w-14 h-14 rounded-full bg-green-tint text-green flex items-center justify-center mb-4">
          <CheckCircle2 size={26} />
        </div>
        <h3 className="text-lg font-black text-black">Password reset</h3>
        <p className="text-[13.5px] text-[#595959] mt-1.5 max-w-xs">
          Your password has been updated. You can now sign in with your new password.
        </p>
        <LinkButton to="/employers/signin" className="mt-6">
          Go to sign in <ArrowRight size={16} />
        </LinkButton>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <Field label="New password">
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

      <Field label="Confirm new password">
        <Input
          type={showPassword ? 'text' : 'password'}
          value={form.confirm}
          onChange={(e) => update('confirm', e.target.value)}
          placeholder="Re-enter your new password"
        />
        {errors.confirm && <span className="text-xs text-red mt-1 block">{errors.confirm}</span>}
      </Field>

      {errors.form && <p className="text-xs text-red mb-4 -mt-2">{errors.form}</p>}

      <SubmitButton disabled={status === 'submitting'} className="mt-2">
        {status === 'submitting' ? 'Resetting...' : 'Reset password'}
      </SubmitButton>
    </form>
  )
}
