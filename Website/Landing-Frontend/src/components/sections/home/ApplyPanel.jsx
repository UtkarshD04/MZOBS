import { useEffect, useState } from 'react'
import {
  ArrowLeft,
  CheckCircle2,
  Clock3,
  FileUp,
  Loader2,
  ChevronDown,
  User,
  Mail,
  Phone,
  Lock,
  MapPin,
  Landmark,
  Hash,
  GraduationCap,
  Eye,
  EyeOff,
} from 'lucide-react'
import { GoogleAuthButton, OrDivider, decodeGoogleCredential } from '../../ui/GoogleAuthButton'
import { loginEmployee, loginEmployeeWithGoogle, signupEmployee, signupEmployeeWithGoogle, verifyEmployeePhoneWidget } from '../../../lib/employeeAuth'
import { sendWidgetOtp, verifyWidgetOtp, retryWidgetOtp } from '../../../lib/msg91Widget'
import { GRADUATION_OPTIONS } from '../../../lib/graduationOptions'
import { fetchEmployeeProfile, uploadEmployeeResume, applyToJob } from '../../../lib/employeeApi'

const TOKEN_KEY = 'mzobs-employee-token'
const inputClass =
  'w-full h-11 px-3.5 rounded-xl border border-(--jobs-border) bg-white text-[13.5px] text-(--jobs-navy) outline-none transition-all duration-150 placeholder:text-(--jobs-ink-soft)/60 hover:border-(--jobs-navy)/25 focus:border-(--jobs-blue) focus:ring-[3px] focus:ring-(--jobs-blue)/15'
const primaryButtonClass =
  'inline-flex items-center justify-center gap-2 h-12 px-6 rounded-xl bg-(--jobs-blue) text-white text-sm font-bold shadow-[0_1px_2px_rgba(0,0,0,0.06),0_8px_20px_-8px_var(--jobs-blue)] hover:bg-(--jobs-blue-dark) hover:shadow-[0_1px_2px_rgba(0,0,0,0.06),0_10px_24px_-8px_var(--jobs-blue-dark)] active:scale-[0.985] transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100'
const otpButtonClass =
  'h-11 px-4 rounded-xl text-[13px] font-bold border border-(--jobs-border) bg-white text-(--jobs-navy) hover:border-(--jobs-blue) hover:text-(--jobs-blue-dark) transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
const labelClass = 'block text-[12.5px] font-semibold text-(--jobs-navy) mb-1.5'
const errorClass = 'text-[12px] text-red-600 mt-1 mb-2'

function BackRow({ onBack, children }) {
  return (
    <button type="button" onClick={onBack} className="inline-flex items-center gap-1.5 text-[12.5px] font-semibold text-(--jobs-ink-soft) hover:text-(--jobs-navy) transition-colors mb-4">
      <ArrowLeft size={14} aria-hidden="true" /> {children}
    </button>
  )
}

// Icon + input, matching the leading-glyph look the rest of the site's forms
// use (JobSearchHero, the standalone /employees/signup page) rather than a
// bare text box.
function IconInput({ icon: Icon, className = '', ...props }) {
  return (
    <div className="relative">
      <Icon size={16} strokeWidth={1.8} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-(--jobs-ink-soft) pointer-events-none" aria-hidden="true" />
      <input className={`${inputClass} pl-10 ${className}`} {...props} />
    </div>
  )
}

function IconSelect({ icon: Icon, className = '', children, ...props }) {
  return (
    <div className="relative">
      <Icon size={16} strokeWidth={1.8} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-(--jobs-ink-soft) pointer-events-none" aria-hidden="true" />
      <select className={`${inputClass} pl-10 pr-9 appearance-none ${className}`} {...props}>
        {children}
      </select>
      <ChevronDown size={15} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-(--jobs-ink-soft) pointer-events-none" aria-hidden="true" />
    </div>
  )
}

function PasswordInput({ value, onChange, placeholder, className = '', autoComplete = 'current-password' }) {
  const [visible, setVisible] = useState(false)
  return (
    <div className="relative">
      <Lock size={16} strokeWidth={1.8} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-(--jobs-ink-soft) pointer-events-none" aria-hidden="true" />
      <input
        type={visible ? 'text' : 'password'}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        autoComplete={autoComplete}
        className={`${inputClass} pl-10 pr-10 ${className}`}
      />
      <button
        type="button"
        onClick={() => setVisible((v) => !v)}
        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-(--jobs-ink-soft) hover:text-(--jobs-navy) transition-colors"
        aria-label={visible ? 'Hide password' : 'Show password'}
      >
        {visible ? <EyeOff size={16} aria-hidden="true" /> : <Eye size={16} aria-hidden="true" />}
      </button>
    </div>
  )
}

function InlineLoginForm({ onSuccess }) {
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  function update(key, value) {
    setForm((f) => ({ ...f, [key]: value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      const { token } = await loginEmployee(form)
      onSuccess(token)
    } catch (err) {
      setError(err.message)
      setSubmitting(false)
    }
  }

  async function handleGoogle(credential) {
    setError('')
    setSubmitting(true)
    try {
      const { token } = await loginEmployeeWithGoogle({ credential })
      onSuccess(token)
    } catch (err) {
      setError(err.message)
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <GoogleAuthButton onCredential={handleGoogle} onError={setError} label="Continue with Google" />
      <OrDivider />
      <label className={labelClass}>Email</label>
      <IconInput
        icon={Mail}
        type="email"
        required
        autoComplete="email"
        value={form.email}
        onChange={(e) => update('email', e.target.value)}
        placeholder="you@example.com"
        className="mb-3"
      />
      <label className={labelClass}>Password</label>
      <PasswordInput
        value={form.password}
        onChange={(e) => update('password', e.target.value)}
        placeholder="Enter your password"
        autoComplete="current-password"
        className="mb-3"
      />
      {error && <p className="text-[12.5px] text-red-600 mb-3">{error}</p>}
      <button type="submit" disabled={submitting} className={`${primaryButtonClass} w-full`}>
        {submitting && <Loader2 size={15} className="animate-spin" aria-hidden="true" />}
        {submitting ? 'Signing in…' : 'Log in'}
      </button>
    </form>
  )
}

function SignupPrompt({ job, onCreateAccount }) {
  return (
    <div className="rounded-xl border border-(--jobs-border) bg-(--jobs-bg-subtle) p-4">
      <p className="text-[13px] text-(--jobs-ink-soft) leading-relaxed">
        New to Mzobs? Create a free account — you'll verify your phone, then come straight back to apply for{' '}
        <span className="font-semibold text-(--jobs-navy)">{job.title}</span>.
      </p>
      <button
        type="button"
        onClick={onCreateAccount}
        className="mt-3 inline-flex items-center justify-center gap-2 h-11 px-6 rounded-xl border border-(--jobs-navy) text-(--jobs-navy) text-[13.5px] font-bold hover:bg-(--jobs-navy) hover:text-white transition-colors"
      >
        Create free account
      </button>
    </div>
  )
}

const initialSignupForm = { name: '', email: '', phone: '', password: '', city: '', state: '', pincode: '', experience: 'fresher', graduation: '' }

function validateSignup(form, hasGoogle) {
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
  if (!form.city.trim()) errors.city = 'Please enter your city.'
  if (!form.state.trim()) errors.state = 'Please enter your state.'
  if (!form.pincode.trim()) errors.pincode = 'Please enter your pincode.'
  else if (!/^\d{6}$/.test(form.pincode.trim())) errors.pincode = 'Enter a valid 6-digit pincode.'
  if (!form.graduation) errors.graduation = 'Please select your graduation.'
  return errors
}

// Same signup as the dedicated /employees/signup page (Google + phone OTP +
// graduation + city/state/pincode), just re-themed to this panel's --jobs-*
// palette and, on success, handed straight to `onSuccess` instead of
// redirecting to the dashboard app's onboarding — the resume-upload/apply
// steps right below already cover what onboarding would otherwise do.
function InlineSignupForm({ onSuccess, onSwitchToLogin }) {
  const [form, setForm] = useState(initialSignupForm)
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('idle')
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
      const widgetResult = await verifyWidgetOtp(otp)
      const { phoneToken: verifiedToken } = await verifyEmployeePhoneWidget({ phone: form.phone, accessToken: widgetResult.message })
      setPhoneToken(verifiedToken)
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
      const { token } = await loginEmployeeWithGoogle({ credential })
      onSuccess(token)
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

  async function handleSubmit(e) {
    e.preventDefault()
    // OTP verification is temporarily optional — not required to continue
    // (same relaxation as EmployeeSignupForm's step 2), since the MSG91
    // widget config that phone verification depends on isn't reliably
    // available on every deployment yet.
    const nextErrors = validateSignup(form, Boolean(googleCredential))
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    setStatus('submitting')
    try {
      const shared = { phone: form.phone, experience: form.experience, graduation: form.graduation, city: form.city, state: form.state, pincode: form.pincode, phoneToken }
      const { token } = googleCredential
        ? await signupEmployeeWithGoogle({ credential: googleCredential, ...shared })
        : await signupEmployee({ ...form, ...shared })
      onSuccess(token)
    } catch (err) {
      setStatus('idle')
      setErrors({ form: err.message })
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <GoogleAuthButton onCredential={handleGoogleCredential} onError={(message) => setErrors({ form: message })} label="Continue with Google" />
      <OrDivider />

      {googleCredential ? (
        <div className="flex items-center gap-2 mb-3 px-3.5 py-2.5 rounded-lg bg-(--jobs-teal-tint) text-[12.5px] font-semibold text-(--jobs-teal-dark)">
          <CheckCircle2 size={15} className="shrink-0" aria-hidden="true" />
          Signed in as {form.name || form.email} — no password needed.
        </div>
      ) : (
        <>
          <label className={labelClass}>Full name</label>
          <IconInput icon={User} value={form.name} onChange={(e) => update('name', e.target.value)} placeholder="Ananya Iyer" autoComplete="name" className="mb-1" />
          {errors.name && <p className={errorClass}>{errors.name}</p>}

          <label className={labelClass}>Email</label>
          <IconInput
            icon={Mail}
            type="email"
            value={form.email}
            onChange={(e) => update('email', e.target.value)}
            placeholder="you@example.com"
            autoComplete="email"
            className="mb-1"
          />
          {errors.email && <p className={errorClass}>{errors.email}</p>}
        </>
      )}

      <label className={labelClass}>Phone number</label>
      <IconInput
        icon={Phone}
        type="tel"
        value={form.phone}
        onChange={(e) => update('phone', e.target.value.replace(/\D/g, '').slice(0, 10))}
        placeholder="98765 43210"
        disabled={Boolean(phoneToken)}
        autoComplete="tel-national"
        className="mb-1"
      />
      {errors.phone && <p className={errorClass}>{errors.phone}</p>}

      {phoneToken ? (
        <p className="flex items-center gap-1.5 mb-3 text-[12.5px] font-semibold text-(--jobs-teal-dark)">
          <CheckCircle2 size={14} className="shrink-0" aria-hidden="true" /> Mobile number verified
        </p>
      ) : otpSent ? (
        <div className="mb-3">
          <label className={labelClass}>Enter OTP</label>
          <IconInput
            icon={Hash}
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
            placeholder="6-digit code"
            inputMode="numeric"
            className="mb-2"
          />
          <div className="flex items-center gap-3">
            <button type="button" className={otpButtonClass} onClick={handleVerifyOtp} disabled={verifyingOtp || otp.length !== 6}>
              {verifyingOtp ? 'Verifying…' : 'Verify'}
            </button>
            <button
              type="button"
              onClick={handleSendOtp}
              disabled={sendingOtp}
              className="text-[12.5px] font-bold text-(--jobs-blue) hover:underline disabled:opacity-50"
            >
              {sendingOtp ? 'Resending…' : 'Resend OTP'}
            </button>
          </div>
          {otpError && <p className={errorClass}>{otpError}</p>}
        </div>
      ) : (
        <div className="mb-3">
          <button type="button" className={otpButtonClass} onClick={handleSendOtp} disabled={sendingOtp || form.phone.replace(/\D/g, '').length !== 10}>
            {sendingOtp ? 'Sending…' : 'Send OTP'}
          </button>
          {otpError && <p className={errorClass}>{otpError}</p>}
        </div>
      )}

      {!googleCredential && (
        <>
          <label className={labelClass}>Password</label>
          <PasswordInput
            value={form.password}
            onChange={(e) => update('password', e.target.value)}
            placeholder="At least 8 characters"
            autoComplete="new-password"
            className="mb-1"
          />
          {errors.password && <p className={errorClass}>{errors.password}</p>}
        </>
      )}

      <div className="grid grid-cols-2 gap-3 mb-1">
        <div>
          <label className={labelClass}>City</label>
          <IconInput icon={MapPin} value={form.city} onChange={(e) => update('city', e.target.value)} placeholder="Bengaluru" autoComplete="address-level2" />
          {errors.city && <p className={errorClass}>{errors.city}</p>}
        </div>
        <div>
          <label className={labelClass}>State</label>
          <IconInput icon={Landmark} value={form.state} onChange={(e) => update('state', e.target.value)} placeholder="Karnataka" autoComplete="address-level1" />
          {errors.state && <p className={errorClass}>{errors.state}</p>}
        </div>
      </div>

      <label className={labelClass}>Pincode</label>
      <IconInput
        icon={Hash}
        value={form.pincode}
        onChange={(e) => update('pincode', e.target.value.replace(/\D/g, '').slice(0, 6))}
        placeholder="560001"
        inputMode="numeric"
        autoComplete="postal-code"
        className="mb-1"
      />
      {errors.pincode && <p className={errorClass}>{errors.pincode}</p>}

      <label className={labelClass}>You are a...</label>
      <div className="grid grid-cols-2 gap-2 mb-3">
        {[
          { value: 'fresher', label: 'Fresher' },
          { value: 'experienced', label: 'Experienced' },
        ].map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => update('experience', opt.value)}
            className={`h-11 rounded-xl text-[13px] font-bold border transition-colors ${
              form.experience === opt.value
                ? 'bg-(--jobs-blue) border-(--jobs-blue) text-white'
                : 'bg-white border-(--jobs-border) text-(--jobs-ink-soft) hover:border-(--jobs-blue)'
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      <label className={labelClass}>Graduation</label>
      <IconSelect icon={GraduationCap} value={form.graduation} onChange={(e) => update('graduation', e.target.value)} className="mb-1">
        <option value="" disabled>
          Select your graduation
        </option>
        {GRADUATION_OPTIONS.map((g) => (
          <option key={g} value={g}>
            {g}
          </option>
        ))}
      </IconSelect>
      {errors.graduation && <p className={errorClass}>{errors.graduation}</p>}

      {errors.form && <p className="text-[12.5px] text-red-600 mb-3">{errors.form}</p>}

      <button type="submit" disabled={status === 'submitting'} className={`${primaryButtonClass} w-full mt-2`}>
        {status === 'submitting' && <Loader2 size={15} className="animate-spin" aria-hidden="true" />}
        {status === 'submitting' ? 'Creating your account…' : 'Create account'}
      </button>

      <button
        type="button"
        onClick={onSwitchToLogin}
        className="mt-3 w-full text-center text-[12.5px] font-semibold text-(--jobs-ink-soft) hover:text-(--jobs-navy) transition-colors"
      >
        Already have an account? Log in
      </button>
    </form>
  )
}

export default function ApplyPanel({ job, onClose }) {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY))
  const [authMode, setAuthMode] = useState('login') // 'login' | 'signup'
  const [profile, setProfile] = useState(null)
  const [profileLoading, setProfileLoading] = useState(false)
  const [profileError, setProfileError] = useState('')
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState('')
  const [applyStatus, setApplyStatus] = useState('idle') // idle | submitting | applied
  const [applyError, setApplyError] = useState('')

  function loadProfile(activeToken) {
    setProfileLoading(true)
    setProfileError('')
    fetchEmployeeProfile(activeToken)
      .then(setProfile)
      .catch((err) => setProfileError(err.message))
      .finally(() => setProfileLoading(false))
  }

  useEffect(() => {
    if (token) loadProfile(token)
  }, [token])

  function handleLoggedIn(newToken) {
    localStorage.setItem(TOKEN_KEY, newToken)
    setToken(newToken)
  }

  async function handleUpload(e) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    setUploadError('')
    try {
      await uploadEmployeeResume(token, file)
      loadProfile(token)
    } catch (err) {
      setUploadError(err.message)
    } finally {
      setUploading(false)
      e.target.value = ''
    }
  }

  async function handleApply() {
    setApplyStatus('submitting')
    setApplyError('')
    try {
      await applyToJob(token, job.id)
      setApplyStatus('applied')
    } catch (err) {
      setApplyError(err.message)
      setApplyStatus('idle')
    }
  }

  // --- not signed in ---
  if (!token) {
    return (
      <div>
        <BackRow onBack={onClose}>Back to job details</BackRow>
        {authMode === 'signup' ? (
          <>
            <h3 className="font-extrabold text-lg text-(--jobs-navy) leading-snug">Create your free account</h3>
            <p className="mt-1.5 text-[13px] text-(--jobs-ink-soft)">
              Verify your phone and you're set up to apply to <span className="font-semibold text-(--jobs-navy)">{job.title}</span> right here.
            </p>
            <div className="mt-5">
              <InlineSignupForm onSuccess={handleLoggedIn} onSwitchToLogin={() => setAuthMode('login')} />
            </div>
          </>
        ) : (
          <>
            <h3 className="font-extrabold text-lg text-(--jobs-navy) leading-snug">Sign in to apply</h3>
            <p className="mt-1.5 text-[13px] text-(--jobs-ink-soft)">
              Applying to <span className="font-semibold text-(--jobs-navy)">{job.title}</span> at {job.company}. Mzobs screens every applicant before
              forwarding a shortlist to the employer.
            </p>
            <div className="mt-5">
              <InlineLoginForm onSuccess={handleLoggedIn} />
            </div>
            <div className="mt-4">
              <SignupPrompt job={job} onCreateAccount={() => setAuthMode('signup')} />
            </div>
          </>
        )}
      </div>
    )
  }

  // --- profile still loading ---
  if (profileLoading && !profile) {
    return (
      <div className="flex items-center gap-2 text-[13.5px] text-(--jobs-ink-soft)">
        <Loader2 size={16} className="animate-spin" aria-hidden="true" /> Loading your profile…
      </div>
    )
  }

  if (profileError) {
    return (
      <div>
        <BackRow onBack={onClose}>Back to job details</BackRow>
        <p className="text-[13.5px] text-red-600">{profileError}</p>
        <button type="button" onClick={() => loadProfile(token)} className={`${primaryButtonClass} mt-3`}>
          Try again
        </button>
      </div>
    )
  }

  const resumeStatus = profile?.resume?.status ?? 'none'

  // --- resume pending staff verification ---
  if (resumeStatus === 'pending') {
    return (
      <div>
        <BackRow onBack={onClose}>Back to job details</BackRow>
        <div className="flex items-start gap-3">
          <Clock3 size={20} className="text-(--jobs-gold) mt-0.5 shrink-0" aria-hidden="true" />
          <div>
            <h3 className="font-extrabold text-lg text-(--jobs-navy) leading-snug">Resume under review</h3>
            <p className="mt-1.5 text-[13px] text-(--jobs-ink-soft) leading-relaxed">
              Your resume is with the Mzobs team for verification. Once it's approved you'll be able to apply to {job.title} — check back shortly.
            </p>
          </div>
        </div>
      </div>
    )
  }

  // --- resume missing, needs correction, or was rejected — upload/re-upload ---
  if (resumeStatus !== 'verified') {
    return (
      <div>
        <BackRow onBack={onClose}>Back to job details</BackRow>
        <h3 className="font-extrabold text-lg text-(--jobs-navy) leading-snug">
          {resumeStatus === 'none' ? 'Upload your resume' : 'Re-upload your resume'}
        </h3>
        <p className="mt-1.5 text-[13px] text-(--jobs-ink-soft) leading-relaxed">
          {resumeStatus === 'changes'
            ? "Mzobs asked for a few changes before this can be verified — upload an updated version."
            : resumeStatus === 'rejected'
              ? 'Your last upload was rejected. Upload a new resume to try again.'
              : "PDF or Word, up to 5MB. Mzobs verifies it before you're eligible to apply."}
        </p>
        <label className="mt-4 flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-(--jobs-border) bg-(--jobs-bg-subtle) px-4 py-8 text-center cursor-pointer hover:border-(--jobs-teal-dark) transition-colors">
          <FileUp size={22} className="text-(--jobs-ink-soft)" aria-hidden="true" />
          <span className="text-[13px] font-semibold text-(--jobs-navy)">{uploading ? 'Uploading…' : 'Choose a file'}</span>
          <span className="text-[11.5px] text-(--jobs-ink-soft)">PDF, DOC or DOCX</span>
          <input type="file" accept=".pdf,.doc,.docx" className="sr-only" disabled={uploading} onChange={handleUpload} />
        </label>
        {uploadError && <p className="mt-2 text-[12.5px] text-red-600">{uploadError}</p>}
      </div>
    )
  }

  // --- applied ---
  if (applyStatus === 'applied') {
    return (
      <div>
        <div className="flex items-start gap-3">
          <CheckCircle2 size={22} className="text-(--jobs-teal-dark) mt-0.5 shrink-0" aria-hidden="true" />
          <div>
            <h3 className="font-extrabold text-lg text-(--jobs-navy) leading-snug">Application sent</h3>
            <p className="mt-1.5 text-[13px] text-(--jobs-ink-soft) leading-relaxed">
              Mzobs will screen your profile against {job.title} at {job.company} and forward it to the employer if you're shortlisted.
            </p>
          </div>
        </div>
        <button type="button" onClick={onClose} className={`${primaryButtonClass} mt-4`}>
          Back to job details
        </button>
      </div>
    )
  }

  // --- paid, verified resume — ready to apply ---
  return (
    <div>
      <BackRow onBack={onClose}>Back to job details</BackRow>
      <h3 className="font-extrabold text-lg text-(--jobs-navy) leading-snug">You're ready to apply</h3>
      <p className="mt-1.5 text-[13px] text-(--jobs-ink-soft) leading-relaxed">
        Your application goes to the Mzobs hiring team, not directly to {job.company}. We screen you against the requirement and forward your verified
        resume if you're shortlisted.
      </p>
      {applyError && (
        <div className="mt-3 rounded-xl border border-(--jobs-border) bg-(--jobs-bg-subtle) p-3.5">
          <p className="text-[12.5px] text-red-600">{applyError}</p>
        </div>
      )}
      <button type="button" onClick={handleApply} disabled={applyStatus === 'submitting'} className={`${primaryButtonClass} mt-4`}>
        {applyStatus === 'submitting' && <Loader2 size={15} className="animate-spin" aria-hidden="true" />}
        {applyStatus === 'submitting' ? 'Submitting…' : 'Apply now'}
      </button>
    </div>
  )
}
