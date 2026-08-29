import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Mail, ArrowRight, KeyRound, CheckCircle2, MailCheck } from 'lucide-react'
import AuthLayout from '../auth/AuthLayout'
import { forgotPasswordStaff } from '../../services/authService'
import { GreenField, greenInputClass } from './authFieldHelpers'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState('idle') // idle | submitting | success
  const [error, setError] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    setStatus('submitting')
    setError('')
    try {
      await forgotPasswordStaff({ email })
      setStatus('success')
    } catch (err) {
      setError(err.response?.data?.message ?? 'Something went wrong. Please try again.')
      setStatus('idle')
    }
  }

  return (
    <AuthLayout brandTag="For Mzobs Management">
      {status === 'success' ? (
        <div className="flex flex-col items-center justify-center text-center py-6">
          <div className="w-14 h-14 rounded-full bg-[#e5efe0] text-[#3d5c34] flex items-center justify-center mb-4">
            <CheckCircle2 size={26} />
          </div>
          <h3 className="text-lg font-bold text-[#111827]">Check your email</h3>
          <p className="text-[13.5px] text-[#595959] mt-1.5 max-w-xs">
            If a staff account exists for <strong>{email}</strong>, we've sent a link to reset your password. It expires in 30 minutes.
          </p>
          <Link to="/login" className="text-xs font-bold text-[#595959] hover:text-[#111827] transition-colors mt-6">
            Back to sign in
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <span className="inline-block text-[10px] font-bold uppercase tracking-wide text-[#3d5c34] bg-[#e5efe0] px-2 py-[5px] rounded-md mb-3">
            Internal Operations Portal
          </span>
          <div className="flex items-center gap-2 mb-1">
            <KeyRound size={18} className="text-[#111827]" />
            <h1 className="text-2xl font-bold tracking-tight text-[#111827]">Forgot password?</h1>
          </div>
          <p className="text-sm text-[#666666] mt-2 mb-6">We'll email you a link to reset your password.</p>

          <GreenField label="Mzobs email">
            <div className="relative">
              <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9ca3af]" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ops@mzobs.dev"
                required
                className={`${greenInputClass} pl-[38px]`}
              />
            </div>
          </GreenField>

          {error && <p className="text-sm text-[#b42318] mb-4 -mt-2">{error}</p>}

          <button
            type="submit"
            disabled={status === 'submitting'}
            className="group w-full h-12 rounded-full font-semibold text-[14.5px] text-white bg-[#3d5c34] hover:bg-[#314a2a] transition-all duration-200 inline-flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]"
          >
            {status === 'submitting' ? 'Sending link...' : 'Send reset link'}
            <ArrowRight size={15} className="transition-transform duration-200 group-hover:translate-x-1" />
          </button>

          <p className="text-xs text-center mt-5 pt-5 border-t border-[#e0e0e0] text-[#666666] flex items-center justify-center gap-1.5">
            <MailCheck size={13} className="text-[#3d5c34]" />
            <Link to="/login" className="hover:text-[#111827] transition-colors">Back to sign in</Link>
          </p>
        </form>
      )}
    </AuthLayout>
  )
}
