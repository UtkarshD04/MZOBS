import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Eye, EyeOff, Mail, Lock, Phone } from 'lucide-react'
import { Field, Input, SubmitButton } from '../ui/AuthField'
import OtpInput from '../ui/OtpInput'
import { GoogleAuthButton, OrDivider } from '../ui/GoogleAuthButton'
import { loginEmployer, loginEmployerWithGoogle, phoneLoginEmployer, verifyEmployerPhoneWidget, redirectToEmployerDashboard } from '../../lib/employerAuth'
import { sendWidgetOtp, verifyWidgetOtp, retryWidgetOtp } from '../../lib/msg91Widget'

const RESEND_COOLDOWN = 30

const initialForm = { email: '', password: '' }

function validate(form) {
  const errors = {}
  if (!form.email.trim()) errors.email = 'Please enter your email.'
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errors.email = 'Enter a valid email address.'
  if (!form.password) errors.password = 'Please enter your password.'
  return errors
}

// Mobile-OTP sign-in — the way back in for accounts registered without a password.
function PhoneSignin({ onGoogleCredential, onSwitch }) {
  const [phone, setPhone] = useState('')
  const [otp, setOtp] = useState('')
  const [sent, setSent] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [resendIn, setResendIn] = useState(0)

  useEffect(() => {
    if (resendIn <= 0) return
    const t = setTimeout(() => setResendIn((n) => n - 1), 1000)
    return () => clearTimeout(t)
  }, [resendIn])

  async function send(resend = false) {
    if (phone.length !== 10) return setError('Enter a valid 10-digit phone number.')
    setError('')
    setBusy(true)
    try {
      if (resend) await retryWidgetOtp('SMS')
      else await sendWidgetOtp(phone)
      setSent(true)
      setOtp('')
      setResendIn(RESEND_COOLDOWN)
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }

  async function confirm(code = otp) {
    if (busy) return
    setError('')
    setBusy(true)
    try {
      const widgetResult = await verifyWidgetOtp(code)
      const { phoneToken } = await verifyEmployerPhoneWidget({ phone, accessToken: widgetResult.message })
      const { token } = await phoneLoginEmployer({ phone, phoneToken })
      await redirectToEmployerDashboard(token)
    } catch (err) {
      setBusy(false)
      setError(err.message)
    }
  }

  return (
    <div>
      <GoogleAuthButton onCredential={onGoogleCredential} onError={setError} />
      <OrDivider />
      <Field label="Phone number">
        <div className="flex gap-2">
          <div className="flex-1 min-w-0">
            <Input icon={Phone} type="tel" value={phone} onChange={(e) => { setPhone(e.target.value.replace(/\D/g, '').slice(0, 10)); setSent(false); setOtp('') }} placeholder="98765 43210" />
          </div>
          <button
            type="button"
            onClick={() => send(sent)}
            disabled={busy || phone.length !== 10 || (sent && resendIn > 0)}
            className="shrink-0 h-12 px-4 rounded-xl text-[13px] font-bold text-white bg-[#075f55] hover:bg-[#0b7a6d] disabled:opacity-50 transition-colors"
          >
            {busy && !sent ? 'Sending...' : sent ? (resendIn > 0 ? `Resend in 0:${String(resendIn).padStart(2, '0')}` : 'Resend') : 'Send OTP'}
          </button>
        </div>
      </Field>

      {sent && (
        <Field label={`Enter the 6-digit code sent to +91 ${phone}`}>
          <OtpInput value={otp} onChange={(v) => { setOtp(v); if (v.length === 6 && otp.length < 6) confirm(v) }} disabled={busy} autoFocus />
        </Field>
      )}

      {error && <p className="text-xs text-red mb-4">{error}</p>}

      <SubmitButton type="button" onClick={() => confirm()} disabled={busy || !sent || otp.length !== 6} className="mt-2">
        {busy && sent ? 'Signing in...' : (<>Sign in <ArrowRight size={16} /></>)}
      </SubmitButton>

      <button type="button" onClick={onSwitch} className="block mx-auto mt-4 text-xs font-bold text-[#075f55] hover:text-[#111827] transition-colors">
        Sign in with email &amp; password instead
      </button>
    </div>
  )
}

export default function EmployerSigninForm() {
  const [mode, setMode] = useState('phone') // phone | email
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
      await redirectToEmployerDashboard(token)
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
      await redirectToEmployerDashboard(token)
    } catch (err) {
      setStatus('idle')
      setErrors({ form: err.message })
    }
  }

  if (mode === 'phone') return <PhoneSignin onGoogleCredential={handleGoogleCredential} onSwitch={() => setMode('email')} />

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
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9E9E9E] hover:text-[#20251F] transition-colors"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
        {errors.password && <span className="text-xs text-red mt-1 block">{errors.password}</span>}
      </Field>

      <div className="flex justify-end -mt-2 mb-4">
        <Link to="/employers/forgot-password" className="text-xs font-bold text-[#075f55] hover:text-[#111827] transition-colors">
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

      <button type="button" onClick={() => setMode('phone')} className="block mx-auto mt-4 text-xs font-bold text-[#075f55] hover:text-[#111827] transition-colors">
        Sign in with mobile OTP instead
      </button>
    </form>
  )
}
