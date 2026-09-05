import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, CheckCircle2, Clock3, FileUp, Loader2 } from 'lucide-react'
import { GoogleAuthButton, OrDivider } from '../../ui/GoogleAuthButton'
import { loginEmployee, loginEmployeeWithGoogle } from '../../../lib/employeeAuth'
import { fetchEmployeeProfile, uploadEmployeeResume, applyToJob } from '../../../lib/employeeApi'

const TOKEN_KEY = 'mzobs-employee-token'
const inputClass =
  'w-full h-11 px-3.5 rounded-lg border border-(--jobs-border) bg-white text-[13.5px] text-(--jobs-navy) outline-none transition-colors placeholder:text-(--jobs-ink-soft)/60 focus:border-(--jobs-teal-dark)'
const primaryButtonClass =
  'inline-flex items-center justify-center gap-2 h-11 px-6 rounded-lg bg-(--jobs-teal-dark) text-white text-[13.5px] font-bold hover:bg-(--jobs-navy) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--jobs-teal-dark) transition-colors disabled:opacity-60 disabled:cursor-not-allowed'

function BackRow({ onBack, children }) {
  return (
    <button type="button" onClick={onBack} className="inline-flex items-center gap-1.5 text-[12.5px] font-semibold text-(--jobs-ink-soft) hover:text-(--jobs-navy) transition-colors mb-4">
      <ArrowLeft size={14} aria-hidden="true" /> {children}
    </button>
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
      <label className="block text-[12.5px] font-semibold text-(--jobs-navy) mb-1.5">Email</label>
      <input
        type="email"
        required
        value={form.email}
        onChange={(e) => update('email', e.target.value)}
        placeholder="you@example.com"
        className={`${inputClass} mb-3`}
      />
      <label className="block text-[12.5px] font-semibold text-(--jobs-navy) mb-1.5">Password</label>
      <input
        type="password"
        required
        value={form.password}
        onChange={(e) => update('password', e.target.value)}
        placeholder="Enter your password"
        className={`${inputClass} mb-3`}
      />
      {error && <p className="text-[12.5px] text-red-600 mb-3">{error}</p>}
      <button type="submit" disabled={submitting} className={`${primaryButtonClass} w-full`}>
        {submitting && <Loader2 size={15} className="animate-spin" aria-hidden="true" />}
        {submitting ? 'Signing in…' : 'Log in'}
      </button>
    </form>
  )
}

// New accounts go through onboarding (phone OTP, graduation) before landing
// in the dashboard — that step isn't duplicated inline here, so signup keeps
// using the existing dedicated flow rather than re-implementing it.
function SignupPrompt({ job }) {
  return (
    <div className="rounded-xl border border-(--jobs-border) bg-(--jobs-bg-subtle) p-4">
      <p className="text-[13px] text-(--jobs-ink-soft) leading-relaxed">
        New to Mzobs? Create a free account — you'll verify your phone, then come straight back to apply for{' '}
        <span className="font-semibold text-(--jobs-navy)">{job.title}</span>.
      </p>
      <Link
        to="/employees/signup"
        className="mt-3 inline-flex items-center justify-center gap-2 h-11 px-6 rounded-lg border border-(--jobs-navy) text-(--jobs-navy) text-[13.5px] font-bold hover:bg-(--jobs-navy) hover:text-white transition-colors"
      >
        Create free account
      </Link>
    </div>
  )
}

export default function ApplyPanel({ job, onClose }) {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY))
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
        <h3 className="font-extrabold text-lg text-(--jobs-navy) leading-snug">Sign in to apply</h3>
        <p className="mt-1.5 text-[13px] text-(--jobs-ink-soft)">
          Applying to <span className="font-semibold text-(--jobs-navy)">{job.title}</span> at {job.company}. Mzobs screens every applicant before
          forwarding a shortlist to the employer.
        </p>
        <div className="mt-5">
          <InlineLoginForm onSuccess={handleLoggedIn} />
        </div>
        <div className="mt-4">
          <SignupPrompt job={job} />
        </div>
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
