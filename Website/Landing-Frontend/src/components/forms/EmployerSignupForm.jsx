import { useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { ArrowRight, Eye, EyeOff, CheckCircle2, User, Mail, Phone, Lock, Building2, Briefcase, Users, Globe, MapPin } from 'lucide-react'
import { Field, Input, Select, SubmitButton } from '../ui/AuthField'
import OtpInput from '../ui/OtpInput'
import TermsConsent from '../ui/TermsConsent'
import { GoogleAuthButton, OrDivider } from '../ui/GoogleAuthButton'
import { decodeGoogleCredential } from '../../lib/googleCredential'
import { signupEmployer, signupEmployerWithGoogle, verifyEmployerPhoneWidget, redirectToEmployerDashboard } from '../../lib/employerAuth'
import { sendWidgetOtp, verifyWidgetOtp, retryWidgetOtp } from '../../lib/msg91Widget'

const COMPANY_SIZES = ['1–50 employees', '51–200 employees', '201–500 employees', '501–1000 employees', '1000+ employees']
const RESEND_COOLDOWN = 30

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

function validate(form, hasGoogle, acceptedTerms, phoneVerified) {
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
  else if (!phoneVerified) errors.phone = 'Please verify your phone number via OTP.'
  if (!form.companyName.trim()) errors.companyName = 'Please enter your company name.'
  if (!form.industry.trim()) errors.industry = 'Please enter your industry.'
  if (!form.size) errors.size = 'Please select a company size.'
  if (!form.website.trim()) errors.website = 'Please enter your company website.'
  if (!form.hq.trim()) errors.hq = 'Please enter your headquarters city.'
  if (!acceptedTerms) errors.terms = 'Please accept the Terms & Conditions and Privacy Policy to create an account.'
  return errors
}

function SectionLabel({ children }) {
  return <div className="text-[11px] font-bold tracking-wide uppercase text-[#9E9E9E] pb-2 mb-1 border-b border-[#e0e0e0]">{children}</div>
}

export default function EmployerSignupForm() {
  const { state } = useLocation()
  const [form, setForm] = useState({ ...initialForm, ...(state?.prefill ?? {}) })
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('idle') // idle | submitting
  const [showPassword, setShowPassword] = useState(false)
  const [googleCredential, setGoogleCredential] = useState(null)
  const [acceptedTerms, setAcceptedTerms] = useState(false)

  // Phone OTP verification (MSG91 widget — same flow as the employee side,
  // see EmployeePhoneAuthForm.jsx). `phoneToken`/`verifiedPhone` only count
  // as a valid verification while `verifiedPhone` still matches the phone
  // currently typed — editing the number after verifying resets it.
  const [otpStep, setOtpStep] = useState('idle') // idle | sent
  const [otp, setOtp] = useState('')
  const [sendingOtp, setSendingOtp] = useState(false)
  const [verifyingOtp, setVerifyingOtp] = useState(false)
  const [otpError, setOtpError] = useState('')
  const [phoneToken, setPhoneToken] = useState(null)
  const [verifiedPhone, setVerifiedPhone] = useState(null)
  const [resendIn, setResendIn] = useState(0)
  const phoneVerified = Boolean(phoneToken) && verifiedPhone === form.phone

  const resendTimerRef = useRef(null)
  useEffect(() => {
    if (resendIn <= 0) return
    resendTimerRef.current = setTimeout(() => setResendIn((s) => s - 1), 1000)
    return () => clearTimeout(resendTimerRef.current)
  }, [resendIn])

  function update(key, value) {
    setForm((f) => ({ ...f, [key]: value }))
  }

  function updatePhone(value) {
    update('phone', value)
    // A changed number invalidates whatever was verified before, and
    // collapses back to the "enter number" state rather than leaving a
    // stale OTP box open for the old number.
    if (value !== verifiedPhone) {
      setOtpStep('idle')
      setOtp('')
      setOtpError('')
    }
  }

  async function handleSendOtp() {
    setErrors((e) => ({ ...e, phone: undefined }))
    setOtpError('')
    setSendingOtp(true)
    try {
      await sendWidgetOtp(form.phone)
      setOtpStep('sent')
      setOtp('')
      setResendIn(RESEND_COOLDOWN)
    } catch (err) {
      setOtpError(err.message)
    } finally {
      setSendingOtp(false)
    }
  }

  async function handleResendOtp() {
    setOtpError('')
    setSendingOtp(true)
    try {
      await retryWidgetOtp('SMS')
      setOtp('')
      setResendIn(RESEND_COOLDOWN)
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
      // before it's trusted (see verifyEmployerPhoneWidget).
      const widgetResult = await verifyWidgetOtp(otp)
      const { phoneToken: token } = await verifyEmployerPhoneWidget({ phone: form.phone, accessToken: widgetResult.message })
      setPhoneToken(token)
      setVerifiedPhone(form.phone)
      setOtpStep('idle')
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
    const nextErrors = validate(form, Boolean(googleCredential), acceptedTerms, phoneVerified)
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    setStatus('submitting')
    try {
      const { token } = googleCredential
        ? await signupEmployerWithGoogle({
            credential: googleCredential,
            companyName: form.companyName,
            phone: form.phone,
            industry: form.industry,
            size: form.size,
            website: form.website,
            hq: form.hq,
            phoneToken,
          })
        : await signupEmployer({ ...form, phoneToken })
      await redirectToEmployerDashboard(token)
    } catch (err) {
      setStatus('idle')
      setErrors({ form: err.message })
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <GoogleAuthButton onCredential={handleGoogleCredential} onError={(message) => setErrors({ form: message })} />
      <OrDivider />

      <SectionLabel>Your details</SectionLabel>

      {googleCredential ? (
        <div className="flex items-center gap-2.5 mb-4 px-4 py-3 rounded-xl bg-[var(--careers-tint-sage)] text-[13px] font-semibold text-[var(--careers-tint-sage-ink)]">
          <CheckCircle2 size={16} className="shrink-0" />
          Signed in as {form.name || form.email} — no password needed.
        </div>
      ) : (
        <>
          <Field label="Your full name">
            <Input icon={User} value={form.name} onChange={(e) => update('name', e.target.value)} placeholder="Rhea Kapoor" />
            {errors.name && <span className="text-xs text-red mt-1 block">{errors.name}</span>}
          </Field>

          <Field label="Work email">
            <Input icon={Mail} type="email" value={form.email} onChange={(e) => update('email', e.target.value)} placeholder="you@company.com" />
            {errors.email && <span className="text-xs text-red mt-1 block">{errors.email}</span>}
          </Field>
        </>
      )}

      <Field label="Phone number">
        <div className="flex gap-2">
          <div className="flex-1 min-w-0">
            <Input
              icon={Phone}
              type="tel"
              value={form.phone}
              onChange={(e) => updatePhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
              placeholder="98765 43210"
              disabled={phoneVerified}
            />
          </div>
          {!phoneVerified && (
            <button
              type="button"
              onClick={handleSendOtp}
              disabled={sendingOtp || form.phone.replace(/\D/g, '').length !== 10}
              className="shrink-0 h-11 px-4 rounded-xl text-[13px] font-bold text-white bg-[var(--careers-accent)] hover:bg-[var(--careers-accent-hover)] disabled:opacity-50 transition-colors"
            >
              {sendingOtp ? 'Sending...' : otpStep === 'sent' ? 'Resend' : 'Send OTP'}
            </button>
          )}
        </div>
        {phoneVerified && (
          <div className="flex items-center gap-1.5 mt-1.5 text-xs font-semibold text-[var(--careers-tint-sage-ink)]">
            <CheckCircle2 size={13} /> Phone verified
          </div>
        )}
        {errors.phone && <span className="text-xs text-red mt-1 block">{errors.phone}</span>}
      </Field>

      {otpStep === 'sent' && !phoneVerified && (
        <Field label={`Enter the 6-digit code sent to +91 ${form.phone}`}>
          <OtpInput value={otp} onChange={setOtp} error={otpError} disabled={verifyingOtp} autoFocus />
          <div className="flex items-center gap-4 mt-3">
            <button
              type="button"
              onClick={handleVerifyOtp}
              disabled={verifyingOtp || otp.length !== 6}
              className="h-9 px-4 rounded-lg text-[13px] font-bold text-white bg-[var(--careers-accent)] hover:bg-[var(--careers-accent-hover)] disabled:opacity-50 transition-colors"
            >
              {verifyingOtp ? 'Verifying...' : 'Verify'}
            </button>
            <button
              type="button"
              onClick={handleResendOtp}
              disabled={sendingOtp || resendIn > 0}
              className="text-[12.5px] font-bold text-[var(--careers-accent)] hover:underline disabled:opacity-50 disabled:no-underline"
            >
              {resendIn > 0 ? `Resend in 0:${String(resendIn).padStart(2, '0')}` : 'Resend OTP'}
            </button>
          </div>
        </Field>
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

      <div className="mt-2">
        <SectionLabel>Company details</SectionLabel>
      </div>

      <Field label="Company name">
        <Input icon={Building2} value={form.companyName} onChange={(e) => update('companyName', e.target.value)} placeholder="Acme Technologies" />
        {errors.companyName && <span className="text-xs text-red mt-1 block">{errors.companyName}</span>}
      </Field>

      <div className="grid sm:grid-cols-2 gap-x-4">
        <Field label="Industry">
          <Input icon={Briefcase} value={form.industry} onChange={(e) => update('industry', e.target.value)} placeholder="e.g. IT Services" />
          {errors.industry && <span className="text-xs text-red mt-1 block">{errors.industry}</span>}
        </Field>
        <Field label="Company size">
          <Select icon={Users} value={form.size} onChange={(e) => update('size', e.target.value)}>
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
          <Input icon={Globe} value={form.website} onChange={(e) => update('website', e.target.value)} placeholder="acme.com" />
          {errors.website && <span className="text-xs text-red mt-1 block">{errors.website}</span>}
        </Field>
        <Field label="Headquarters city">
          <Input icon={MapPin} value={form.hq} onChange={(e) => update('hq', e.target.value)} placeholder="Bengaluru" />
          {errors.hq && <span className="text-xs text-red mt-1 block">{errors.hq}</span>}
        </Field>
      </div>

      <TermsConsent tone="careers" checked={acceptedTerms} onChange={setAcceptedTerms} error={errors.terms} className="mb-4" />

      {errors.form && <p className="text-xs text-red mb-4 -mt-2">{errors.form}</p>}

      <SubmitButton disabled={status === 'submitting' || !acceptedTerms} className="mt-2">
        {status === 'submitting' ? (
          'Creating your workspace...'
        ) : (
          <>
            Create your account <ArrowRight size={16} />
          </>
        )}
      </SubmitButton>

    </form>
  )
}
