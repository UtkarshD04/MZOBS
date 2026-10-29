import { useEffect, useState } from 'react'
import { ArrowRight, Mail, Phone } from 'lucide-react'
import { Field, Input, SubmitButton } from '../ui/AuthField'
import OtpInput from '../ui/OtpInput'
import { GoogleAuthButton, OrDivider } from '../ui/GoogleAuthButton'
import { loginEmployerWithGoogle, phoneLoginEmployer, verifyEmployerPhoneWidget, sendEmployerEmailOtp, verifyEmployerEmailOtp, emailLoginEmployer, redirectToEmployerDashboard } from '../../lib/employerAuth'
import { sendWidgetOtp, verifyWidgetOtp, retryWidgetOtp } from '../../lib/msg91Widget'

const RESEND_COOLDOWN = 30
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// Email-code sign-in — a 6-digit code sent to the account's email, no password needed.
function EmailOtpSignin({ onBack }) {
  const [email, setEmail] = useState('')
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

  async function send() {
    if (!EMAIL_RE.test(email.trim())) return setError('Enter a valid email address.')
    setError('')
    setBusy(true)
    try {
      await sendEmployerEmailOtp({ email })
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
      const { emailToken } = await verifyEmployerEmailOtp({ email, otp: code })
      const { token } = await emailLoginEmployer({ email, emailToken })
      await redirectToEmployerDashboard(token)
    } catch (err) {
      setBusy(false)
      setError(err.message)
    }
  }

  return (
    <div>
      <Field label="Work email">
        <div className="flex gap-2">
          <div className="flex-1 min-w-0">
            <Input icon={Mail} type="email" value={email} onChange={(e) => { setEmail(e.target.value); setSent(false); setOtp('') }} placeholder="you@company.com" autoComplete="email" autoFocus />
          </div>
          <button
            type="button"
            onClick={send}
            disabled={busy || !email.trim() || (sent && resendIn > 0)}
            className="shrink-0 h-12 px-4 rounded-xl text-[13px] font-bold text-white bg-[#075f55] hover:bg-[#0b7a6d] disabled:opacity-50 transition-colors"
          >
            {busy && !sent ? 'Sending...' : sent ? (resendIn > 0 ? `Resend in 0:${String(resendIn).padStart(2, '0')}` : 'Resend') : 'Send code'}
          </button>
        </div>
      </Field>

      {sent && (
        <Field label={`Enter the 6-digit code sent to ${email.trim()}`}>
          <OtpInput value={otp} onChange={(v) => { setOtp(v); if (v.length === 6 && otp.length < 6) confirm(v) }} disabled={busy} autoFocus />
        </Field>
      )}

      {error && <p className="text-xs text-red mb-4">{error}</p>}

      <SubmitButton type="button" onClick={() => confirm()} disabled={busy || !sent || otp.length !== 6} className="mt-2">
        {busy && sent ? 'Signing in...' : (<>Sign in <ArrowRight size={16} /></>)}
      </SubmitButton>

      <button type="button" onClick={onBack} className="block mx-auto mt-4 text-xs font-bold text-[#075f55] hover:text-[#111827] transition-colors">
        Sign in with mobile OTP instead
      </button>
    </div>
  )
}

// Mobile-OTP sign-in, with Google and email-code as the other ways in. No passwords.
function PhoneSignin({ onEmail }) {
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

  async function handleGoogleCredential(credential) {
    setError('')
    setBusy(true)
    try {
      const { token } = await loginEmployerWithGoogle({ credential })
      await redirectToEmployerDashboard(token)
    } catch (err) {
      setBusy(false)
      setError(err.message)
    }
  }

  return (
    <div>
      <GoogleAuthButton onCredential={handleGoogleCredential} onError={setError} />
      <button
        type="button"
        onClick={onEmail}
        className="w-full h-11 mb-2 inline-flex items-center justify-center gap-2 rounded-xl border border-[#C9C9C9] bg-white text-[13.5px] font-bold text-[#111827] hover:border-[#075f55] hover:text-[#075f55] transition-colors"
      >
        <Mail size={16} strokeWidth={1.8} aria-hidden="true" /> Continue with email
      </button>
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
    </div>
  )
}

export default function EmployerSigninForm() {
  const [mode, setMode] = useState('phone') // phone | email

  if (mode === 'email') return <EmailOtpSignin onBack={() => setMode('phone')} />
  return <PhoneSignin onEmail={() => setMode('email')} />
}
