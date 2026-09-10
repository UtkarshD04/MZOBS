import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowRight, ArrowLeft, Eye, EyeOff, CheckCircle2, User, Mail, Phone, Lock, ShieldCheck } from 'lucide-react'
import { Field, Input, PrimaryButton, SecondaryButton } from '../ui/JobsAuthField'
import { GoogleAuthButton, OrDivider, decodeGoogleCredential } from '../ui/GoogleAuthButton'
import StepProgress from '../ui/StepProgress'
import OtpInput from '../ui/OtpInput'
import { loginEmployeeWithGoogle, signupEmployee, signupEmployeeWithGoogle, verifyEmployeePhoneWidget } from '../../lib/employeeAuth'
import { saveEmployeeSession } from '../../lib/employeeSession'
import { sendWidgetOtp, verifyWidgetOtp, retryWidgetOtp } from '../../lib/msg91Widget'
import { MSG91_WIDGET_ID, MSG91_TOKEN_AUTH } from '../../lib/config'

// OTP verification is optional, but there's no point offering a "Send OTP"
// button that's guaranteed to fail when this deployment has no widget
// credentials — just skip straight to the phone-number-only step.
const OTP_CONFIGURED = Boolean(MSG91_WIDGET_ID && MSG91_TOKEN_AUTH)

const STEP_LABELS = ['Account', 'Mobile number']
const RESEND_COOLDOWN = 30

const initialForm = { name: '', email: '', phone: '', password: '' }

const stepTransition = {
  initial: { opacity: 0, x: 12 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -12 },
  transition: { duration: 0.18, ease: 'easeOut' },
}

function validateStep1(form, hasGoogle) {
  const errors = {}
  if (hasGoogle) return errors
  if (!form.name.trim()) errors.name = 'Please enter your full name.'
  if (!form.email.trim()) errors.email = 'Please enter your email.'
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errors.email = 'Enter a valid email address.'
  if (!form.password) errors.password = 'Please create a password.'
  else if (form.password.length < 8) errors.password = 'Password must be at least 8 characters.'
  return errors
}

function validateStep2(form) {
  const errors = {}
  if (!form.phone.trim()) errors.phone = 'Please enter your phone number.'
  else if (form.phone.replace(/\D/g, '').length !== 10) errors.phone = 'Enter a valid 10-digit phone number.'
  // OTP verification is temporarily optional — not required to continue.
  return errors
}

export default function EmployeeSignupForm() {
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [form, setForm] = useState(initialForm)
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('idle') // idle | submitting | success
  const [showPassword, setShowPassword] = useState(false)
  const [googleCredential, setGoogleCredential] = useState(null)

  const [otp, setOtp] = useState('')
  const [otpSent, setOtpSent] = useState(false)
  const [sendingOtp, setSendingOtp] = useState(false)
  const [verifyingOtp, setVerifyingOtp] = useState(false)
  const [otpError, setOtpError] = useState('')
  const [phoneToken, setPhoneToken] = useState(null)
  const [resendIn, setResendIn] = useState(0)

  const timerRef = useRef(null)

  useEffect(() => {
    if (resendIn <= 0) return
    timerRef.current = setTimeout(() => setResendIn((s) => s - 1), 1000)
    return () => clearTimeout(timerRef.current)
  }, [resendIn])

  function update(key, value) {
    setForm((f) => ({ ...f, [key]: value }))
    // Phone changed after verifying — the token was minted for the old
    // number, so it can't be trusted for the new one anymore.
    if (key === 'phone') {
      setPhoneToken(null)
      setOtpSent(false)
      setOtp('')
      setOtpError('')
      setResendIn(0)
    }
  }

  function handleChangePhoneNumber() {
    setPhoneToken(null)
    setOtpSent(false)
    setOtp('')
    setOtpError('')
    setResendIn(0)
  }

  async function handleSendOtp() {
    setOtpError('')
    setSendingOtp(true)
    try {
      if (otpSent) await retryWidgetOtp('SMS')
      else await sendWidgetOtp(form.phone)
      setOtpSent(true)
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
      // before we trust it (a client can't just assert "verified").
      const widgetResult = await verifyWidgetOtp(otp)
      const { phoneToken: token } = await verifyEmployeePhoneWidget({ phone: form.phone, accessToken: widgetResult.message })
      setPhoneToken(token)
      setErrors((e) => ({ ...e, phone: undefined }))
    } catch (err) {
      setOtpError(err.message)
    } finally {
      setVerifyingOtp(false)
    }
  }

  async function handleGoogleCredential(credential) {
    setErrors({})
    // If an account already exists for this Google email, log straight in
    // instead of walking them through the signup wizard again.
    try {
      const { token, employee } = await loginEmployeeWithGoogle({ credential })
      saveEmployeeSession({ token, employee })
      navigate('/')
      return
    } catch (err) {
      if (err.status !== 404) {
        setErrors({ form: err.message })
        return
      }
    }

    const { name, email } = decodeGoogleCredential(credential)
    setGoogleCredential(credential)
    setForm((f) => ({ ...f, name: name || f.name, email: email || f.email, password: '' }))
  }

  function handleContinueFromStep1(e) {
    e.preventDefault()
    const nextErrors = validateStep1(form, Boolean(googleCredential))
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return
    setStep(2)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const nextErrors = validateStep2(form)
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    setStatus('submitting')
    try {
      const { token, employee } = googleCredential
        ? await signupEmployeeWithGoogle({ credential: googleCredential, phone: form.phone, phoneToken })
        : await signupEmployee({ ...form, phoneToken })
      saveEmployeeSession({ token, employee })

      setStatus('success')
      setTimeout(() => navigate('/'), 900)
    } catch (err) {
      setStatus('idle')
      setErrors({ form: err.message })
    }
  }

  if (status === 'success') {
    return (
      <div className="py-10 flex flex-col items-center text-center gap-3">
        <div className="w-14 h-14 rounded-full bg-(--jobs-teal-tint) flex items-center justify-center">
          <CheckCircle2 size={28} className="text-(--jobs-teal-dark)" />
        </div>
        <p className="text-base font-black text-(--jobs-navy)">Your MZOBS account is ready.</p>
        <p className="text-[13px] text-(--jobs-ink-soft)">Taking you back home...</p>
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-start justify-between gap-3 mb-6">
        <div>
          <h1 className="text-lg font-black text-(--jobs-navy) tracking-tight">Create your MZOBS account</h1>
          <p className="text-[13px] text-(--jobs-ink-soft) mt-1">
            Already have an account?{' '}
            <Link to="/employees/signin" className="font-bold text-(--jobs-blue-dark) hover:text-(--jobs-navy) transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </div>

      <StepProgress steps={STEP_LABELS} current={step} />

      <AnimatePresence mode="wait" initial={false}>
        {step === 1 && (
          <motion.form key="step-1" {...stepTransition} onSubmit={handleContinueFromStep1} noValidate>
            <h2 className="text-base font-black text-(--jobs-navy)">Account details</h2>
            <p className="text-[13px] text-(--jobs-ink-soft) mt-1 mb-5">Get matched with verified employers in minutes.</p>

            <GoogleAuthButton onCredential={handleGoogleCredential} onError={(message) => setErrors({ form: message })} />
            <OrDivider label="or sign up with email" />

            {googleCredential ? (
              <div className="flex items-center gap-2.5 mb-4 px-4 py-3 rounded-xl bg-(--jobs-teal-tint) text-[13px] font-semibold text-(--jobs-teal-dark)">
                <CheckCircle2 size={16} className="shrink-0" />
                Signed in as {form.name || form.email} — no password needed.
              </div>
            ) : (
              <>
                <Field label="Full name" error={errors.name}>
                  <Input icon={User} value={form.name} onChange={(e) => update('name', e.target.value)} placeholder="Ananya Iyer" autoComplete="name" error={errors.name} />
                </Field>

                <Field label="Email address" error={errors.email}>
                  <Input icon={Mail} type="email" value={form.email} onChange={(e) => update('email', e.target.value)} placeholder="you@example.com" autoComplete="email" error={errors.email} />
                </Field>

                <Field label="Password" error={errors.password} hint={!errors.password ? 'At least 8 characters.' : undefined}>
                  <div className="relative">
                    <Input
                      icon={Lock}
                      type={showPassword ? 'text' : 'password'}
                      value={form.password}
                      onChange={(e) => update('password', e.target.value)}
                      placeholder="Create a password"
                      autoComplete="new-password"
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
              </>
            )}

            {errors.form && <p className="text-xs text-red-600 mb-4 -mt-2">{errors.form}</p>}

            <PrimaryButton className="mt-1">
              Continue <ArrowRight size={16} />
            </PrimaryButton>
          </motion.form>
        )}

        {step === 2 && (
          <motion.form key="step-2" {...stepTransition} onSubmit={handleSubmit} noValidate>
            <div className="flex items-center gap-2 mb-1">
              <button type="button" onClick={() => setStep(1)} className="text-(--jobs-ink-soft) hover:text-(--jobs-navy) transition-colors" aria-label="Back">
                <ArrowLeft size={16} />
              </button>
              <h2 className="text-base font-black text-(--jobs-navy)">Mobile number</h2>
            </div>
            <p className="text-[13px] text-(--jobs-ink-soft) mt-1 mb-5 ml-6">So employers can reach you about your applications.</p>

            <Field label="Mobile number" error={errors.phone}>
              <div className="flex flex-wrap sm:flex-nowrap gap-2">
                <div className="h-11 px-3.5 flex items-center rounded-xl border border-(--jobs-border) bg-(--jobs-bg-subtle) text-[13.5px] font-bold text-(--jobs-navy) shrink-0">
                  +91
                </div>
                <div className="flex-1 min-w-40">
                  <Input
                    icon={Phone}
                    type="tel"
                    inputMode="numeric"
                    value={form.phone}
                    onChange={(e) => update('phone', e.target.value.replace(/\D/g, '').slice(0, 10))}
                    placeholder="98765 43210"
                    disabled={Boolean(phoneToken)}
                    autoComplete="tel-national"
                    error={errors.phone}
                  />
                </div>
                {OTP_CONFIGURED && !otpSent && !phoneToken && (
                  <SecondaryButton
                    onClick={handleSendOtp}
                    disabled={sendingOtp || form.phone.replace(/\D/g, '').length !== 10}
                    className="shrink-0 whitespace-nowrap w-full sm:w-auto"
                  >
                    {sendingOtp ? 'Sending...' : 'Send OTP'}
                  </SecondaryButton>
                )}
              </div>
              {OTP_CONFIGURED && !otpSent && !phoneToken && otpError && <span className="text-xs text-red-600 mt-2 block">{otpError}</span>}
            </Field>

            {!OTP_CONFIGURED ? null : phoneToken ? (
              <div className="flex items-center gap-2 -mt-2 mb-4 px-3.5 py-2.5 rounded-xl bg-(--jobs-teal-tint) text-[13px] font-bold text-(--jobs-teal-dark)">
                <CheckCircle2 size={16} className="shrink-0" />
                Mobile number verified
              </div>
            ) : otpSent ? (
              <div className="-mt-1 mb-4">
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-[12.5px] font-bold text-(--jobs-navy) tracking-tight">Enter the 6-digit code</label>
                  <button
                    type="button"
                    onClick={handleChangePhoneNumber}
                    className="text-[12px] font-bold text-(--jobs-ink-soft) hover:text-(--jobs-blue-dark) transition-colors"
                  >
                    Change number
                  </button>
                </div>
                <div className="max-w-72">
                  <OtpInput value={otp} onChange={setOtp} error={otpError} disabled={verifyingOtp} autoFocus />
                </div>

                <div className="flex items-center gap-3 mt-3">
                  <SecondaryButton onClick={handleVerifyOtp} disabled={verifyingOtp || otp.length !== 6}>
                    {verifyingOtp ? 'Verifying...' : 'Verify code'}
                  </SecondaryButton>
                  <button
                    type="button"
                    onClick={handleSendOtp}
                    disabled={sendingOtp || resendIn > 0}
                    className="text-[12.5px] font-bold text-(--jobs-blue-dark) hover:underline disabled:opacity-50 disabled:no-underline disabled:text-(--jobs-ink-soft)"
                  >
                    {sendingOtp ? 'Resending...' : resendIn > 0 ? `Resend in 0:${String(resendIn).padStart(2, '0')}` : 'Resend OTP'}
                  </button>
                </div>
              </div>
            ) : null}

            {errors.form && <p className="text-xs text-red-600 mb-4 -mt-2">{errors.form}</p>}

            <PrimaryButton className="mt-1" disabled={status === 'submitting'}>
              {status === 'submitting' ? 'Creating your account...' : <>Create account <ArrowRight size={16} /></>}
            </PrimaryButton>

            <p className="flex items-start gap-2 mt-4 text-[11.5px] text-(--jobs-ink-soft) leading-relaxed">
              <ShieldCheck size={14} className="shrink-0 mt-0.5 text-(--jobs-teal-dark)" />
              Your profile is private. Employers see it only when you apply or are matched for a relevant role.
            </p>
          </motion.form>
        )}
      </AnimatePresence>

      <p className="text-[11.5px] text-(--jobs-ink-soft) text-center mt-5 leading-relaxed">
        By signing up, you agree to Mzobs'{' '}
        <Link to="/terms-of-service" className="font-bold text-(--jobs-navy) hover:text-(--jobs-blue-dark) transition-colors">
          Terms of Service
        </Link>{' '}
        and{' '}
        <Link to="/privacy-policy" className="font-bold text-(--jobs-navy) hover:text-(--jobs-blue-dark) transition-colors">
          Privacy Policy
        </Link>
        .
      </p>
    </div>
  )
}
