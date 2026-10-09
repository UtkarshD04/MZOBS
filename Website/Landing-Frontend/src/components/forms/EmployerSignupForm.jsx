import { useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { ArrowRight, ArrowLeft, Eye, EyeOff, CheckCircle2, User, Mail, Phone, Lock, Building2, Briefcase, Users, ShieldCheck, FileText } from 'lucide-react'
import { isValidGstin, normalizeGstin } from '../../lib/gstin'
import { Field, Input, Select, SubmitButton } from '../ui/AuthField'
import OtpInput from '../ui/OtpInput'
import TermsConsent from '../ui/TermsConsent'
import { GoogleAuthButton, OrDivider } from '../ui/GoogleAuthButton'
import { decodeGoogleCredential } from '../../lib/googleCredential'
import { signupEmployer, signupEmployerWithGoogle, verifyEmployerPhoneWidget, redirectToEmployerDashboard } from '../../lib/employerAuth'
import { sendWidgetOtp, verifyWidgetOtp, retryWidgetOtp } from '../../lib/msg91Widget'

const COMPANY_SIZES = ['1–50 employees', '51–200 employees', '201–500 employees', '501–1000 employees', '1000+ employees']
const RESEND_COOLDOWN = 30
// Server codes from the mandatory GST check (Backend utils/gstVerification.js).
const GSTIN_ERRORS = ['GSTIN_REQUIRED', 'INVALID_GSTIN', 'GSTIN_NOT_FOUND', 'INACTIVE_REGISTRATION', 'GSTIN_ALREADY_REGISTERED']
const LEGAL_NAME_ERRORS = ['INVALID_LEGAL_NAME', 'NAME_MISMATCH']

const initialForm = {
  name: '',
  email: '',
  phone: '',
  password: '',
  companyName: '',
  industry: '',
  size: '',
  gstin: '',
  gstLegalName: '',
}

const STEP_META = {
  account: { title: 'Let’s start with you', sub: 'Your name and work email.' },
  phone: { title: 'Verify your phone', sub: 'We’ll text you a 6-digit code to confirm it’s you.' },
  password: { title: 'Secure your account', sub: 'Choose a password with at least 8 characters.' },
  company: { title: 'Tell us about your company', sub: 'Last step. Your company details and GSTIN — every employer on Mzobs is GST-verified.' },
}

function validateStep(step, form, acceptedTerms, phoneVerified, hasGoogle) {
  const errors = {}
  if (step === 'account' && !hasGoogle) {
    if (!form.name.trim()) errors.name = 'Please enter your full name.'
    if (!form.email.trim()) errors.email = 'Please enter your email.'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errors.email = 'Enter a valid email address.'
  }
  if (step === 'phone') {
    if (!form.phone.trim()) errors.phone = 'Please enter your phone number.'
    else if (form.phone.replace(/\D/g, '').length !== 10) errors.phone = 'Enter a valid 10-digit phone number.'
    else if (!phoneVerified) errors.phone = 'Please confirm your phone number with the OTP.'
  }
  if (step === 'password') {
    if (!form.password) errors.password = 'Please create a password.'
    else if (form.password.length < 8) errors.password = 'Password must be at least 8 characters.'
  }
  if (step === 'company') {
    if (!form.companyName.trim()) errors.companyName = 'Please enter your company name.'
    if (!form.industry.trim()) errors.industry = 'Please enter your industry.'
    if (!form.size) errors.size = 'Please select a company size.'
    // GST verification is mandatory for every employer.
    if (!form.gstin) errors.gstin = 'Please enter your company’s 15-character GSTIN.'
    else if (!isValidGstin(form.gstin)) errors.gstin = 'That isn’t a valid GSTIN. Check the characters and the last (check) digit.'
    if (!form.gstLegalName.trim()) errors.gstLegalName = 'Enter the legal name exactly as on your GST certificate.'
    if (!acceptedTerms) errors.terms = 'Please accept the Terms & Conditions and Privacy Policy to create an account.'
  }
  return errors
}

function StepProgress({ steps, index }) {
  return (
    <div className="mb-7">
      <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-[0.14em] text-[#075f55] mb-2.5">
        <span>Step {index + 1} of {steps.length}</span>
      </div>
      <div className="flex gap-1.5" role="progressbar" aria-valuemin={1} aria-valuemax={steps.length} aria-valuenow={index + 1}>
        {steps.map((s, i) => (
          <div key={s} className={`h-1.5 flex-1 rounded-full transition-colors duration-300 ${i <= index ? 'bg-[#075f55]' : 'bg-[#111827]/10'}`} />
        ))}
      </div>
    </div>
  )
}

export default function EmployerSignupForm({ header }) {
  const { state } = useLocation()
  const [form, setForm] = useState({ ...initialForm, ...(state?.prefill ?? {}) })
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('idle') // idle | submitting
  const [showPassword, setShowPassword] = useState(false)
  const [googleCredential, setGoogleCredential] = useState(null)
  const [acceptedTerms, setAcceptedTerms] = useState(false)
  const [stepIndex, setStepIndex] = useState(0)
  const steps = googleCredential ? ['account', 'phone', 'company'] : ['account', 'phone', 'password', 'company']
  const step = steps[Math.min(stepIndex, steps.length - 1)]
  const isLast = stepIndex >= steps.length - 1

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
    // Name + email come from Google, so the account step is already done.
    setStepIndex(1)
  }

  function clearGoogle() {
    setGoogleCredential(null)
    setForm((f) => ({ ...f, name: '', email: '' }))
    setStepIndex(0)
  }

  function goBack() {
    setErrors({})
    setStepIndex((i) => Math.max(0, i - 1))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const nextErrors = validateStep(step, form, acceptedTerms, phoneVerified, Boolean(googleCredential))
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return
    if (!isLast) {
      setStepIndex((i) => i + 1)
      return
    }

    setStatus('submitting')
    // Mandatory GST: the server verifies it before creating the account. A
    // wrong GSTIN / legal name or an inactive registration refuses the signup
    // (shown on the GST fields); otherwise the account is created and, until
    // verified, opens on the dashboard's GST verification screen.
    const gst = { gstin: normalizeGstin(form.gstin), gstLegalName: form.gstLegalName.trim() }
    try {
      const { token } = googleCredential
        ? await signupEmployerWithGoogle({
            credential: googleCredential,
            companyName: form.companyName,
            phone: form.phone,
            industry: form.industry,
            size: form.size,
            phoneToken,
            ...gst,
          })
        : await signupEmployer({ ...form, phoneToken, ...gst })
      await redirectToEmployerDashboard(token)
    } catch (err) {
      setStatus('idle')
      // GST refusals belong next to the field the employer has to fix.
      if (GSTIN_ERRORS.includes(err.code)) setErrors({ gstin: err.message })
      else if (LEGAL_NAME_ERRORS.includes(err.code)) setErrors({ gstLegalName: err.message })
      else setErrors({ form: err.message })
    }
  }

  const meta = STEP_META[step]

  return (
    <form onSubmit={handleSubmit} noValidate>
      {header && <div className="mb-6">{header}</div>}
      <StepProgress steps={steps} index={stepIndex} />

      <h2 className="font-sans text-[26px] tracking-tight font-bold text-[#111827]">{meta.title}</h2>
      <p className="text-[14px] text-[#667085] mt-1 mb-6">{meta.sub}</p>

      {step === 'account' && (
        <>
          {googleCredential ? (
            <div className="flex items-center gap-2.5 mb-4 px-4 py-3 rounded-xl bg-[var(--careers-tint-sage)] text-[13px] font-semibold text-[var(--careers-tint-sage-ink)]">
              <CheckCircle2 size={16} className="shrink-0" />
              <span className="flex-1">Signed in as {form.name || form.email}, no password needed.</span>
              <button type="button" onClick={clearGoogle} className="underline font-bold shrink-0">Change</button>
            </div>
          ) : (
            <>
              <GoogleAuthButton onCredential={handleGoogleCredential} onError={(message) => setErrors({ form: message })} />
              <OrDivider label="or use email" />
              <Field label="Your full name">
                <Input icon={User} autoFocus value={form.name} onChange={(e) => update('name', e.target.value)} placeholder="Rhea Kapoor" />
                {errors.name && <span className="text-xs text-red mt-1 block">{errors.name}</span>}
              </Field>
              <Field label="Work email">
                <Input icon={Mail} type="email" value={form.email} onChange={(e) => update('email', e.target.value)} placeholder="you@company.com" />
                {errors.email && <span className="text-xs text-red mt-1 block">{errors.email}</span>}
              </Field>
            </>
          )}
        </>
      )}

      {step === 'phone' && (
        <>
          <Field label="Phone number">
            <div className="flex gap-2">
              <div className="flex-1 min-w-0">
                <Input
                  icon={Phone}
                  type="tel"
                  autoFocus
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
                  className="shrink-0 h-12 px-4 rounded-xl text-[13px] font-bold text-white bg-[#075f55] hover:bg-[#0b7a6d] disabled:opacity-50 transition-colors"
                >
                  {sendingOtp ? 'Sending...' : otpStep === 'sent' ? 'Resend' : 'Send OTP'}
                </button>
              )}
            </div>
            {phoneVerified && (
              <div className="flex items-center gap-1.5 mt-1.5 text-xs font-semibold text-[var(--careers-tint-sage-ink)]">
                <CheckCircle2 size={13} /> Phone confirmed
              </div>
            )}
            {errors.phone && <span className="text-xs text-red mt-1 block">{errors.phone}</span>}
            {otpError && otpStep !== 'sent' && <span className="text-xs text-red mt-1 block">{otpError}</span>}
          </Field>

          {otpStep === 'sent' && !phoneVerified && (
            <Field label={`Enter the 6-digit code sent to +91 ${form.phone}`}>
              <OtpInput value={otp} onChange={setOtp} error={otpError} disabled={verifyingOtp} autoFocus />
              <div className="flex items-center gap-4 mt-3">
                <button
                  type="button"
                  onClick={handleVerifyOtp}
                  disabled={verifyingOtp || otp.length !== 6}
                  className="h-9 px-4 rounded-lg text-[13px] font-bold text-white bg-[#075f55] hover:bg-[#0b7a6d] disabled:opacity-50 transition-colors"
                >
                  {verifyingOtp ? 'Checking...' : 'Confirm'}
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
        </>
      )}

      {step === 'password' && (
        <Field label="Password">
          <div className="relative">
            <Input
              icon={Lock}
              type={showPassword ? 'text' : 'password'}
              autoFocus
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

      {step === 'company' && (
        <>
          <Field label="Company name">
            <Input icon={Building2} autoFocus value={form.companyName} onChange={(e) => update('companyName', e.target.value)} placeholder="Company name" />
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

          <div className="mt-2 mb-3 border-t border-[#111827]/10 pt-4">
            <p className="flex items-center gap-2 text-[11px] font-bold tracking-[0.14em] uppercase text-[#075f55]">
              <ShieldCheck size={14} /> GST verification
            </p>
            <p className="mt-1 text-[12.5px] text-[#4b5563]">Every company on Mzobs is verified against the GST registry. Your account is activated once your GSTIN is verified.</p>
          </div>

          <div className="grid sm:grid-cols-2 gap-x-4">
            <Field label="GSTIN">
              <Input
                icon={FileText}
                value={form.gstin}
                onChange={(e) => update('gstin', normalizeGstin(e.target.value).slice(0, 15))}
                placeholder="e.g. 27AAPFU0939F1ZV"
                maxLength={15}
                autoComplete="off"
                spellCheck={false}
                className="font-mono uppercase tracking-wide"
              />
              {errors.gstin && <span className="text-xs text-red mt-1 block">{errors.gstin}</span>}
            </Field>
            <Field label="Legal name (as on GST certificate)">
              <Input icon={Building2} value={form.gstLegalName} onChange={(e) => update('gstLegalName', e.target.value)} placeholder="e.g. Acme Private Limited" maxLength={200} />
              {errors.gstLegalName && <span className="text-xs text-red mt-1 block">{errors.gstLegalName}</span>}
            </Field>
          </div>

          <TermsConsent tone="careers" checked={acceptedTerms} onChange={setAcceptedTerms} error={errors.terms} className="mb-4" />
        </>
      )}

      {errors.form && <p className="text-xs text-red mb-4">{errors.form}</p>}

      <div className="flex items-center gap-3 mt-2">
        {stepIndex > 0 && (
          <button
            type="button"
            onClick={goBack}
            disabled={status === 'submitting'}
            className="shrink-0 h-[52px] w-[52px] inline-flex items-center justify-center rounded-full border border-[#111827]/20 text-[#111827] hover:bg-[#111827]/5 transition-colors"
            aria-label="Back"
          >
            <ArrowLeft size={18} />
          </button>
        )}
        <SubmitButton disabled={status === 'submitting' || (isLast && !acceptedTerms) || (step === 'phone' && !phoneVerified)}>
            {status === 'submitting' ? (
              'Verifying GST & creating your workspace...'
            ) : isLast ? (
              <>
                Create your account <ArrowRight size={16} />
              </>
            ) : (
              <>
                Continue <ArrowRight size={16} />
              </>
            )}
          </SubmitButton>
      </div>
    </form>
  )
}
