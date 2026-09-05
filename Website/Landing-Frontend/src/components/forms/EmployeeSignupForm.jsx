import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Eye, EyeOff, CheckCircle2, User, Mail, Phone, Lock, GraduationCap } from 'lucide-react'
import { Field, Input, Select, SubmitButton } from '../ui/AuthField'
import { GoogleAuthButton, OrDivider, decodeGoogleCredential } from '../ui/GoogleAuthButton'
import { EMPLOYEE_APP_URL } from '../../lib/config'
import { signupEmployee, signupEmployeeWithGoogle, verifyEmployeePhoneWidget } from '../../lib/employeeAuth'
import { sendWidgetOtp, verifyWidgetOtp, retryWidgetOtp } from '../../lib/msg91Widget'

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

const otpButtonClass =
  'h-11 px-4 rounded-xl text-[13px] font-bold border border-[#C9C9C9] bg-white text-[#595959] hover:border-[var(--careers-accent)] hover:text-[var(--careers-accent)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed'

export default function EmployeeSignupForm() {
  const [form, setForm] = useState(initialForm)
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('idle') // idle | submitting
  const [showPassword, setShowPassword] = useState(false)
  const [googleCredential, setGoogleCredential] = useState(null)

  const [otp, setOtp] = useState('')
  const [otpSent, setOtpSent] = useState(false)
  const [sendingOtp, setSendingOtp] = useState(false)
  const [verifyingOtp, setVerifyingOtp] = useState(false)
  const [otpError, setOtpError] = useState('')
  const [phoneToken, setPhoneToken] = useState(null)

  function update(key, value) {
    setForm((f) => ({ ...f, [key]: value }))
    // Phone changed after verifying — the token was minted for the old
    // number, so it can't be trusted for the new one anymore.
    if (key === 'phone') {
      setPhoneToken(null)
      setOtpSent(false)
      setOtp('')
      setOtpError('')
    }
  }

  async function handleSendOtp() {
    setOtpError('')
    setSendingOtp(true)
    try {
      if (otpSent) await retryWidgetOtp('SMS')
      else await sendWidgetOtp(form.phone)
      setOtpSent(true)
    } catch (err) {
      setOtpError(err.message)
    } finally {
      setSendingOtp(false)
    }
  }

  async function handleVerifyOtp() {
    setOtpError('')
    setVerifyingOtp(true)
    try {
      // MSG91's widget verifies the code itself and hands back a signed
      // access-token — that still has to be confirmed server-to-server
      // before we trust it (a client can't just assert "verified").
      const widgetResult = await verifyWidgetOtp(otp)
      const { phoneToken: token } = await verifyEmployeePhoneWidget({ phone: form.phone, accessToken: widgetResult.message })
      setPhoneToken(token)
    } catch (err) {
      setOtpError(err.message)
    } finally {
      setVerifyingOtp(false)
    }
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
    if (!phoneToken) nextErrors.phone = nextErrors.phone ?? 'Please verify your mobile number.'
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
            phoneToken,
          })
        : await signupEmployee({ ...form, phoneToken })
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
          disabled={Boolean(phoneToken)}
        />
        {errors.phone && <span className="text-xs text-red mt-1 block">{errors.phone}</span>}
      </Field>

      {phoneToken ? (
        <div className="flex items-center gap-2 -mt-2 mb-4 text-[13px] font-semibold text-[var(--careers-tint-sage-ink)]">
          <CheckCircle2 size={15} className="shrink-0" />
          Mobile number verified
        </div>
      ) : otpSent ? (
        <div className="-mt-2 mb-4">
          <Field label="Enter OTP">
            <Input
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
              placeholder="6-digit code"
              inputMode="numeric"
            />
          </Field>
          <div className="flex items-center gap-3 -mt-2">
            <button type="button" className={otpButtonClass} onClick={handleVerifyOtp} disabled={verifyingOtp || otp.length !== 6}>
              {verifyingOtp ? 'Verifying...' : 'Verify'}
            </button>
            <button
              type="button"
              onClick={handleSendOtp}
              disabled={sendingOtp}
              className="text-[12.5px] font-bold text-[var(--careers-accent)] hover:underline disabled:opacity-50"
            >
              {sendingOtp ? 'Resending...' : 'Resend OTP'}
            </button>
          </div>
          {otpError && <span className="text-xs text-red mt-2 block">{otpError}</span>}
        </div>
      ) : (
        <div className="-mt-2 mb-4">
          <button type="button" className={otpButtonClass} onClick={handleSendOtp} disabled={sendingOtp || form.phone.replace(/\D/g, '').length !== 10}>
            {sendingOtp ? 'Sending...' : 'Send OTP'}
          </button>
          {otpError && <span className="text-xs text-red mt-2 block">{otpError}</span>}
        </div>
      )}

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

      <SubmitButton disabled={status === 'submitting' || !phoneToken} className="mt-2">
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
