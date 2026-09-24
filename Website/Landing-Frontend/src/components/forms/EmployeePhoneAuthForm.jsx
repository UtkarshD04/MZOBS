import { useEffect, useRef, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowRight, ArrowLeft, CheckCircle2, User, Mail, Phone, UploadCloud, FileText, Trash2, ShieldCheck, ArrowUpRight } from 'lucide-react'
import { Field, Input, PrimaryButton, SecondaryButton } from '../ui/JobsAuthField'
import { GoogleAuthButton, OrDivider } from '../ui/GoogleAuthButton'
import { decodeGoogleCredential } from '../../lib/googleCredential'
import OtpInput from '../ui/OtpInput'
import TermsConsent from '../ui/TermsConsent'
import {
  loginEmployeeWithGoogle,
  phoneLoginEmployee,
  sendEmployeeEmailOtp,
  verifyEmployeeEmailOtp,
  emailLoginEmployee,
  signupEmployee,
  signupEmployeeWithGoogle,
  verifyEmployeePhoneWidget,
} from '../../lib/employeeAuth'
import { saveEmployeeSession, buildAppRedirectUrl } from '../../lib/employeeSession'
import { uploadEmployeeResume, validateResumeFileClientSide } from '../../lib/employeeResume'
import { sendWidgetOtp, verifyWidgetOtp, retryWidgetOtp } from '../../lib/msg91Widget'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const RESEND_COOLDOWN = 30

const stepTransition = {
  initial: { opacity: 0, x: 12 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -12 },
  transition: { duration: 0.18, ease: 'easeOut' },
}

// A single entry point for both signin and signup (no password anywhere).
// Two ways in, "or" between them:
//   - mobile number: verify the OTP; an existing account opens straight away, a new
//     number collects name + email, then a resume.
//   - email ("Continue with Email"): verify a code emailed to you; an existing account
//     opens straight away, a new email collects name + mobile number, the number is
//     verified with an OTP too, then a resume.
// Either way, if the number OR the email already belongs to an account, that account
// opens instead of a duplicate being created.
// Both EmployeeSignin.jsx and EmployeeSignup.jsx render this same form, and
// EmployeeAuthModal.jsx embeds it in a popup for on-site "Sign in" clicks
// (passing onAuthComplete so the modal can close itself once auth finishes).
export default function EmployeePhoneAuthForm({ onAuthComplete } = {}) {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const redirect = searchParams.get('redirect')

  // 'phone' | 'otp' | 'profile' | 'resume'  (mobile number path)
  // 'email' | 'emailOtp' | 'emailProfile'     (email path; a new email then reuses 'otp' to verify the number)
  const [step, setStep] = useState('phone')
  const [phone, setPhone] = useState('')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  // Required before a NEW account is created (profile step, or the phone step
  // when a new Google user still needs to verify a number). Existing accounts
  // signing in never see this.
  const [acceptedTerms, setAcceptedTerms] = useState(false)

  const [googleCredential, setGoogleCredential] = useState(null)

  const [otp, setOtp] = useState('')
  const [sendingOtp, setSendingOtp] = useState(false)
  const [verifyingOtp, setVerifyingOtp] = useState(false)
  const [checkingAccount, setCheckingAccount] = useState(false)
  const [otpError, setOtpError] = useState('')
  const [phoneToken, setPhoneToken] = useState(null)
  const [resendIn, setResendIn] = useState(0)

  const [creatingAccount, setCreatingAccount] = useState(false)

  // Email path: proof the address was verified (sent along with signup).
  const [emailToken, setEmailToken] = useState(null)
  const [emailOtp, setEmailOtp] = useState('')
  const [emailBusy, setEmailBusy] = useState(false)
  const [emailError, setEmailError] = useState('')

  // Resume step (new accounts only) — the account already exists and its
  // token is already known by the time this shows, so upload here hits the
  // API authenticated the same way it would from the dashboard app.
  const [authToken, setAuthToken] = useState(null)
  const [authEmployee, setAuthEmployee] = useState(null)
  const [resumeFile, setResumeFile] = useState(null)
  const [resumeError, setResumeError] = useState('')
  const [uploading, setUploading] = useState(false)
  const [uploadDone, setUploadDone] = useState(false)

  const timerRef = useRef(null)
  useEffect(() => {
    if (resendIn <= 0) return
    timerRef.current = setTimeout(() => setResendIn((s) => s - 1), 1000)
    return () => clearTimeout(timerRef.current)
  }, [resendIn])

  // Arrived via the dashboard app's `?redirect=` handoff (e.g. from "Apply"
  // on a job) — send them back there with the token instead of landing on
  // this site's own home page.
  async function completeAuth(token, employee) {
    if (redirect) {
      window.location.href = await buildAppRedirectUrl(redirect, token)
      return
    }
    saveEmployeeSession({ token, employee })
    // Inside the modal, stay right where the user clicked "Sign in" from —
    // Navbar picks up the new session itself (onEmployeeSessionChange). The
    // standalone pages have no such caller, so they still land on home.
    if (onAuthComplete) onAuthComplete()
    else navigate('/')
  }

  function resetToPhoneStep() {
    // In the email path the number step is 'emailProfile' (name + number); "back" from
    // its OTP screen should return there, not drop the verified email.
    setStep(emailToken ? 'emailProfile' : 'phone')
    setOtp('')
    setOtpError('')
    setPhoneToken(null)
    setResendIn(0)
  }

  async function handleSendOtp() {
    setError('')
    setOtpError('')
    setSendingOtp(true)
    try {
      await sendWidgetOtp(phone)
      setStep('otp')
      setOtp('')
      setResendIn(RESEND_COOLDOWN)
    } catch (err) {
      setError(err.message)
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

  // Signs an existing account straight in with nothing but the verified
  // phoneToken. A 404 means this number has never signed up — the expected
  // branch into "collect a name/email" (or, for a new Google user, straight
  // into signup since we already have those from Google).
  async function proceedAfterVerification(token) {
    setCheckingAccount(true)
    try {
      const { token: sessionToken, employee } = await phoneLoginEmployee({ phone, phoneToken: token })
      await completeAuth(sessionToken, employee)
    } catch (err) {
      if (err.status === 404) {
        // Google and email paths already know name + email, so the account can be
        // created now; the plain number path still has to ask for them.
        if (googleCredential || emailToken) await finishSignup(token)
        else setStep('profile')
      } else {
        setOtpError(err.message)
      }
    } finally {
      setCheckingAccount(false)
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
      const { phoneToken: token } = await verifyEmployeePhoneWidget({ phone, accessToken: widgetResult.message })
      setPhoneToken(token)
      await proceedAfterVerification(token)
    } catch (err) {
      setOtpError(err.message)
    } finally {
      setVerifyingOtp(false)
    }
  }

  async function handleGoogleCredential(credential) {
    setError('')
    try {
      const { token, employee } = await loginEmployeeWithGoogle({ credential })
      await completeAuth(token, employee)
      return
    } catch (err) {
      if (err.status !== 404) {
        setError(err.message)
        return
      }
    }
    // No account for this Google email yet — still need a verified phone
    // number, so stay on this step and let them enter it; name/email are
    // already known from Google.
    const { name: gName, email: gEmail } = decodeGoogleCredential(credential)
    setGoogleCredential(credential)
    setName(gName || '')
    setEmail(gEmail || '')
  }

  async function finishSignup(token) {
    setError('')
    if (!acceptedTerms) {
      setError('Please accept the Terms & Conditions and Privacy Policy to continue.')
      return
    }
    setCreatingAccount(true)
    try {
      const { token: sessionToken, employee } = googleCredential
        ? await signupEmployeeWithGoogle({ credential: googleCredential, phone, phoneToken: token })
        : await signupEmployee({ name: name.trim(), email: email.trim(), phone, phoneToken: token, emailToken: emailToken ?? undefined })
      setAuthToken(sessionToken)
      setAuthEmployee(employee)
      setStep('resume')
    } catch (err) {
      setError(err.message)
    } finally {
      setCreatingAccount(false)
    }
  }

  // ── Email path ────────────────────────────────────────────────────────────
  function startEmailFlow() {
    setError('')
    setEmailError('')
    setEmailOtp('')
    setEmailToken(null)
    setGoogleCredential(null)
    setStep('email')
  }

  function leaveEmailFlow() {
    setEmailToken(null)
    setEmailOtp('')
    setEmailError('')
    setError('')
    setResendIn(0)
    setStep('phone')
  }

  async function handleSendEmailCode() {
    setEmailError('')
    if (!EMAIL_RE.test(email.trim())) return setEmailError('Enter a valid email address.')
    setEmailBusy(true)
    try {
      await sendEmployeeEmailOtp({ email: email.trim() })
      setStep('emailOtp')
      setEmailOtp('')
      setResendIn(RESEND_COOLDOWN)
    } catch (err) {
      setEmailError(err.message)
    } finally {
      setEmailBusy(false)
    }
  }

  async function handleResendEmailCode() {
    setEmailError('')
    setEmailBusy(true)
    try {
      await sendEmployeeEmailOtp({ email: email.trim() })
      setEmailOtp('')
      setResendIn(RESEND_COOLDOWN)
    } catch (err) {
      setEmailError(err.message)
    } finally {
      setEmailBusy(false)
    }
  }

  // Verifies the emailed code, then opens the account for that address — or, if there
  // isn't one (404), moves on to collecting name + mobile number for a new account.
  async function handleVerifyEmailCode() {
    setEmailError('')
    setEmailBusy(true)
    try {
      const { emailToken: verified } = await verifyEmployeeEmailOtp({ email: email.trim(), otp: emailOtp })
      setEmailToken(verified)
      try {
        const { token, employee } = await emailLoginEmployee({ email: email.trim(), emailToken: verified })
        await completeAuth(token, employee)
      } catch (err) {
        if (err.status === 404) setStep('emailProfile')
        else throw err
      }
    } catch (err) {
      setEmailError(err.message)
    } finally {
      setEmailBusy(false)
    }
  }

  // New email: we still need a verified mobile number (recruiters call it), so verify it
  // with the same OTP step the number path uses.
  function handleContinueEmailProfile(e) {
    e.preventDefault()
    setError('')
    if (!name.trim()) return setError('Please enter your full name.')
    if (phone.length !== 10) return setError('Enter your 10-digit mobile number.')
    if (!acceptedTerms) return setError('Please accept the Terms & Conditions and Privacy Policy to continue.')
    handleSendOtp()
  }

  function handleContinueProfile(e) {
    e.preventDefault()
    setError('')
    if (!name.trim()) return setError('Please enter your full name.')
    if (!EMAIL_RE.test(email.trim())) return setError('Enter a valid email address.')
    if (!acceptedTerms) return setError('Please accept the Terms & Conditions and Privacy Policy to continue.')
    finishSignup(phoneToken)
  }

  function handleResumeChange(e) {
    const file = e.target.files?.[0] ?? null
    e.target.value = ''
    if (!file) return
    const err = validateResumeFileClientSide(file)
    if (err) { setResumeError(err); return }
    setResumeError('')
    setResumeFile(file)
  }

  async function handleUploadResume() {
    if (!resumeFile || !authToken) return
    setUploading(true)
    setResumeError('')
    try {
      await uploadEmployeeResume(authToken, resumeFile)
      setUploadDone(true)
    } catch (err) {
      setResumeError(err.message || 'Upload failed. You can add your resume later.')
    } finally {
      setUploading(false)
    }
  }

  async function handleFinish() {
    try {
      await completeAuth(authToken, authEmployee)
    } catch (err) {
      setResumeError(err.message)
    }
  }

  if (step === 'resume') {
    return (
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }} className="py-6">
        <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-(--jobs-teal-tint) text-(--jobs-teal-dark) mb-6">
          <CheckCircle2 size={20} className="shrink-0" />
          <div>
            <p className="text-[13.5px] font-bold">Account created successfully!</p>
            <p className="text-[12px] opacity-80">Now upload your CV so employers can find you.</p>
          </div>
        </div>

        {!uploadDone ? (
          <>
            <p className="text-[13.5px] font-bold text-(--jobs-navy) mb-3">Upload your resume</p>

            {resumeFile ? (
              <div className="flex items-center gap-3 px-4 py-3 rounded-xl border border-(--jobs-border) bg-(--jobs-bg-subtle) mb-3">
                <FileText size={18} className="text-(--jobs-blue-dark) shrink-0" />
                <span className="flex-1 min-w-0 text-[13px] font-semibold text-(--jobs-navy) truncate">{resumeFile.name}</span>
                <button
                  type="button"
                  onClick={() => { setResumeFile(null); setResumeError('') }}
                  className="text-(--jobs-ink-soft) hover:text-red-600 transition-colors shrink-0"
                  aria-label="Remove"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ) : (
              <label className="flex items-center gap-3 px-4 py-4 rounded-xl border-2 border-dashed border-(--jobs-border) bg-(--jobs-bg-subtle) cursor-pointer hover:border-(--jobs-blue)/50 transition-colors mb-3">
                <UploadCloud size={20} className="text-(--jobs-ink-soft) shrink-0" />
                <div>
                  <p className="text-[13px] font-semibold text-(--jobs-navy)">Click to upload your CV</p>
                  <p className="text-[11.5px] text-(--jobs-ink-soft)">PDF, DOC or DOCX — up to 5MB</p>
                </div>
                <input type="file" accept=".pdf,.doc,.docx" className="sr-only" onChange={handleResumeChange} />
              </label>
            )}

            {resumeError && <p className="text-xs text-red-600 mb-3">{resumeError}</p>}

            <div className="flex flex-col gap-2">
              <PrimaryButton type="button" onClick={handleUploadResume} disabled={!resumeFile || uploading}>
                {uploading ? 'Uploading...' : <><UploadCloud size={16} /> Upload CV</>}
              </PrimaryButton>
              <button
                type="button"
                onClick={handleFinish}
                className="text-[13px] font-semibold text-(--jobs-ink-soft) hover:text-(--jobs-navy) transition-colors py-2"
              >
                Skip for now
              </button>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center text-center gap-3 py-4">
            <div className="w-12 h-12 rounded-full bg-(--jobs-teal-tint) flex items-center justify-center">
              <CheckCircle2 size={24} className="text-(--jobs-teal-dark)" />
            </div>
            <p className="text-[14px] font-bold text-(--jobs-navy)">CV uploaded!</p>
            <button
              type="button"
              onClick={handleFinish}
              className="inline-flex items-center gap-1.5 text-[13px] font-bold text-(--jobs-blue-dark) hover:underline"
            >
              Continue <ArrowUpRight size={14} />
            </button>
          </div>
        )}
      </motion.div>
    )
  }

  return (
    <AnimatePresence mode="wait" initial={false}>
      {step === 'phone' && (
        <motion.div key="phone" {...stepTransition}>
          <h2 className="text-base font-black text-(--jobs-navy)">Welcome to Mzobs</h2>
          <p className="text-[13px] text-(--jobs-ink-soft) mt-1 mb-5">Enter your mobile number to sign in or create an account.</p>

          {googleCredential ? (
            <div className="flex items-center gap-2.5 mb-4 px-4 py-3 rounded-xl bg-(--jobs-teal-tint) text-[13px] font-semibold text-(--jobs-teal-dark)">
              <CheckCircle2 size={16} className="shrink-0" />
              Signing up as {name || email} via Google
            </div>
          ) : null}

          <form
            onSubmit={(e) => {
              e.preventDefault()
              if (googleCredential && !acceptedTerms) return setError('Please accept the Terms & Conditions and Privacy Policy to continue.')
              if (phone.replace(/\D/g, '').length === 10) handleSendOtp()
            }}
          >
            <Field label="Mobile number">
              <div className="flex gap-2">
                <div className="h-11 px-3.5 flex items-center rounded-xl border border-(--jobs-border) bg-(--jobs-bg-subtle) text-[13.5px] font-bold text-(--jobs-navy) shrink-0">
                  +91
                </div>
                <div className="flex-1 min-w-0">
                  <Input
                    icon={Phone}
                    type="tel"
                    inputMode="numeric"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                    placeholder="98765 43210"
                    autoComplete="tel-national"
                    autoFocus
                  />
                </div>
              </div>
            </Field>

            {error && <p className="text-xs text-red-600 mb-4 -mt-2">{error}</p>}

            {googleCredential && <TermsConsent checked={acceptedTerms} onChange={setAcceptedTerms} className="mb-4" />}

            <PrimaryButton className="mt-1" disabled={sendingOtp || phone.length !== 10 || (googleCredential && !acceptedTerms)}>
              {sendingOtp ? 'Sending...' : <>Send OTP <ArrowRight size={16} /></>}
            </PrimaryButton>
          </form>

          <OrDivider label="or continue with Google" />
          <GoogleAuthButton onCredential={handleGoogleCredential} onError={(message) => setError(message)} />
          {!googleCredential && (
            <button
              type="button"
              onClick={startEmailFlow}
              className="mt-3 w-full h-11 inline-flex items-center justify-center gap-2 rounded-xl text-[13px] font-bold border border-(--jobs-border) bg-white text-(--jobs-navy) hover:border-(--jobs-blue) hover:text-(--jobs-blue-dark) transition-colors"
            >
              <Mail size={16} strokeWidth={1.8} aria-hidden="true" /> Continue with Email
            </button>
          )}

          {!googleCredential && <p className="text-[11.5px] text-(--jobs-ink-soft) text-center mt-5 leading-relaxed">
            By continuing, you agree to Mzobs'{' '}
            <a href="/terms-of-service" className="font-bold text-(--jobs-navy) hover:text-(--jobs-blue-dark) transition-colors">
              Terms &amp; Conditions
            </a>{' '}
            and{' '}
            <a href="/privacy-policy" className="font-bold text-(--jobs-navy) hover:text-(--jobs-blue-dark) transition-colors">
              Privacy Policy
            </a>
            .
          </p>}
        </motion.div>
      )}

      {step === 'email' && (
        <motion.form key="email" {...stepTransition} onSubmit={(e) => { e.preventDefault(); handleSendEmailCode() }} noValidate>
          <div className="flex items-center gap-2 mb-1">
            <button type="button" onClick={leaveEmailFlow} className="text-(--jobs-ink-soft) hover:text-(--jobs-navy) transition-colors" aria-label="Back">
              <ArrowLeft size={16} />
            </button>
            <h2 className="text-base font-black text-(--jobs-navy)">Continue with Email</h2>
          </div>
          <p className="text-[13px] text-(--jobs-ink-soft) mt-1 mb-5 ml-6">
            Enter your email and we will send you a 6-digit code. If you already have an account it opens, otherwise we will create one.
          </p>

          <Field label="Email address">
            <Input icon={Mail} type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" autoComplete="email" autoFocus />
          </Field>

          {emailError && <p className="text-xs text-red-600 mb-4 -mt-2">{emailError}</p>}

          <PrimaryButton className="mt-1" disabled={emailBusy || !email.trim()}>
            {emailBusy ? 'Sending...' : <>Send code <ArrowRight size={16} /></>}
          </PrimaryButton>
          <button type="button" onClick={leaveEmailFlow} className="block mx-auto mt-4 text-[12.5px] font-bold text-(--jobs-blue-dark) hover:underline">
            Use mobile number instead
          </button>
        </motion.form>
      )}

      {step === 'emailOtp' && (
        <motion.form key="emailOtp" {...stepTransition} onSubmit={(e) => { e.preventDefault(); if (emailOtp.length === 6) handleVerifyEmailCode() }}>
          <div className="flex items-center gap-2 mb-1">
            <button type="button" onClick={() => setStep('email')} className="text-(--jobs-ink-soft) hover:text-(--jobs-navy) transition-colors" aria-label="Back">
              <ArrowLeft size={16} />
            </button>
            <h2 className="text-base font-black text-(--jobs-navy)">Verify your email</h2>
          </div>
          <div className="flex items-center justify-between mt-1 mb-5 ml-6">
            <p className="text-[13px] text-(--jobs-ink-soft) break-all">Enter the 6-digit code sent to {email.trim()}</p>
            <button type="button" onClick={() => setStep('email')} className="text-[12px] font-bold text-(--jobs-ink-soft) hover:text-(--jobs-blue-dark) transition-colors shrink-0 ml-2">
              Change
            </button>
          </div>

          <div className="max-w-72">
            <OtpInput value={emailOtp} onChange={setEmailOtp} error={emailError} disabled={emailBusy} autoFocus />
          </div>

          <div className="flex items-center gap-3 mt-4">
            <SecondaryButton onClick={handleVerifyEmailCode} disabled={emailBusy || emailOtp.length !== 6}>
              {emailBusy ? 'Verifying...' : 'Verify & continue'}
            </SecondaryButton>
            <button
              type="button"
              onClick={handleResendEmailCode}
              disabled={emailBusy || resendIn > 0}
              className="text-[12.5px] font-bold text-(--jobs-blue-dark) hover:underline disabled:opacity-50 disabled:no-underline disabled:text-(--jobs-ink-soft)"
            >
              {resendIn > 0 ? `Resend in 0:${String(resendIn).padStart(2, '0')}` : 'Resend code'}
            </button>
          </div>
        </motion.form>
      )}

      {step === 'emailProfile' && (
        <motion.form key="emailProfile" {...stepTransition} onSubmit={handleContinueEmailProfile} noValidate>
          <h2 className="text-base font-black text-(--jobs-navy)">Almost there</h2>
          <p className="text-[13px] text-(--jobs-ink-soft) mt-1 mb-5 break-all">
            {email.trim()} is verified. Add your name and mobile number so employers can reach you.
          </p>

          <Field label="Full name">
            <Input icon={User} value={name} onChange={(e) => setName(e.target.value)} placeholder="Ananya Iyer" autoComplete="name" autoFocus />
          </Field>

          <Field label="Mobile number" hint="We will send an OTP to this number to verify it.">
            <div className="flex gap-2">
              <div className="h-11 px-3.5 flex items-center rounded-xl border border-(--jobs-border) bg-(--jobs-bg-subtle) text-[13.5px] font-bold text-(--jobs-navy) shrink-0">
                +91
              </div>
              <div className="flex-1 min-w-0">
                <Input
                  icon={Phone}
                  type="tel"
                  inputMode="numeric"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                  placeholder="98765 43210"
                  autoComplete="tel-national"
                />
              </div>
            </div>
          </Field>

          <TermsConsent checked={acceptedTerms} onChange={setAcceptedTerms} className="mb-4" />

          {error && <p className="text-xs text-red-600 mb-4 -mt-2">{error}</p>}

          <PrimaryButton className="mt-1" disabled={sendingOtp || !name.trim() || phone.length !== 10 || !acceptedTerms}>
            {sendingOtp ? 'Sending...' : <>Send OTP <ArrowRight size={16} /></>}
          </PrimaryButton>
        </motion.form>
      )}

      {step === 'otp' && (
        <motion.form key="otp" {...stepTransition} onSubmit={(e) => { e.preventDefault(); if (otp.length === 6) handleVerifyOtp() }}>
          <div className="flex items-center gap-2 mb-1">
            <button type="button" onClick={resetToPhoneStep} className="text-(--jobs-ink-soft) hover:text-(--jobs-navy) transition-colors" aria-label="Back">
              <ArrowLeft size={16} />
            </button>
            <h2 className="text-base font-black text-(--jobs-navy)">Verify your number</h2>
          </div>
          <div className="flex items-center justify-between mt-1 mb-5 ml-6">
            <p className="text-[13px] text-(--jobs-ink-soft)">Enter the 6-digit code sent to +91 {phone}</p>
            <button type="button" onClick={resetToPhoneStep} className="text-[12px] font-bold text-(--jobs-ink-soft) hover:text-(--jobs-blue-dark) transition-colors shrink-0">
              Change
            </button>
          </div>

          <div className="max-w-72">
            <OtpInput value={otp} onChange={setOtp} error={otpError} disabled={verifyingOtp || checkingAccount} autoFocus />
          </div>

          <div className="flex items-center gap-3 mt-4">
            <SecondaryButton onClick={handleVerifyOtp} disabled={verifyingOtp || checkingAccount || otp.length !== 6}>
              {verifyingOtp || checkingAccount ? 'Verifying...' : 'Verify & continue'}
            </SecondaryButton>
            <button
              type="button"
              onClick={handleResendOtp}
              disabled={sendingOtp || resendIn > 0}
              className="text-[12.5px] font-bold text-(--jobs-blue-dark) hover:underline disabled:opacity-50 disabled:no-underline disabled:text-(--jobs-ink-soft)"
            >
              {sendingOtp ? 'Resending...' : resendIn > 0 ? `Resend in 0:${String(resendIn).padStart(2, '0')}` : 'Resend OTP'}
            </button>
          </div>
        </motion.form>
      )}

      {step === 'profile' && (
        <motion.form key="profile" {...stepTransition} onSubmit={handleContinueProfile}>
          <h2 className="text-base font-black text-(--jobs-navy)">Tell us about yourself</h2>
          <p className="text-[13px] text-(--jobs-ink-soft) mt-1 mb-5">So employers know who's applying.</p>

          <Field label="Full name">
            <Input icon={User} value={name} onChange={(e) => setName(e.target.value)} placeholder="Ananya Iyer" autoComplete="name" autoFocus />
          </Field>

          <Field label="Email address">
            <Input icon={Mail} type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" autoComplete="email" />
          </Field>

          <TermsConsent checked={acceptedTerms} onChange={setAcceptedTerms} className="mb-4" />

          {error && <p className="text-xs text-red-600 mb-4 -mt-2">{error}</p>}

          <PrimaryButton className="mt-1" disabled={creatingAccount || !acceptedTerms}>
            {creatingAccount ? 'Creating your account...' : <>Continue <ArrowRight size={16} /></>}
          </PrimaryButton>

          <p className="flex items-start gap-2 mt-4 text-[11.5px] text-(--jobs-ink-soft) leading-relaxed">
            <ShieldCheck size={14} className="shrink-0 mt-0.5 text-(--jobs-teal-dark)" />
            Your profile is private. Employers see it only when you apply or are matched for a relevant role.
          </p>
        </motion.form>
      )}
    </AnimatePresence>
  )
}
