import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { Lock, Eye, EyeOff, ArrowRight, KeyRound, CheckCircle2 } from 'lucide-react'
import AuthLayout from '../auth/AuthLayout'
import { resetPasswordStaff } from '../../services/authService'
import { GreenField, greenInputClass } from './authFieldHelpers'

function validate({ password, confirm }) {
  const errors = {}
  if (!password) errors.password = 'Please enter a new password.'
  else if (password.length < 8) errors.password = 'Password must be at least 8 characters.'
  if (confirm !== password) errors.confirm = "Passwords don't match."
  return errors
}

export default function ResetPassword() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token') ?? ''
  const [form, setForm] = useState({ password: '', confirm: '' })
  const [showPw, setShowPw] = useState(false)
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('idle') // idle | submitting | success

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
      await resetPasswordStaff({ token, password: form.password })
      setStatus('success')
    } catch (err) {
      setStatus('idle')
      setErrors({ form: err.response?.data?.message ?? 'Something went wrong. Please try again.' })
    }
  }

  return (
    <AuthLayout brandTag="For Mzobs Management">
      {!token ? (
        <div className="text-center py-6">
          <p className="text-sm text-[#595959]">This reset link is missing or invalid. Please request a new one.</p>
          <Link to="/forgot-password" className="inline-block mt-4 text-xs font-bold text-[#595959] hover:text-[#111827] transition-colors">
            Request a new link
          </Link>
        </div>
      ) : status === 'success' ? (
        <div className="flex flex-col items-center justify-center text-center py-6">
          <div className="w-14 h-14 rounded-full bg-[#e5efe0] text-[#3d5c34] flex items-center justify-center mb-4">
            <CheckCircle2 size={26} />
          </div>
          <h3 className="text-lg font-bold text-[#111827]">Password reset</h3>
          <p className="text-[13.5px] text-[#595959] mt-1.5 max-w-xs">
            Your password has been updated. You can now sign in with your new password.
          </p>
          <button
            type="button"
            onClick={() => navigate('/login')}
            className="group mt-6 inline-flex items-center gap-2 h-11 px-6 rounded-full font-semibold text-[13.5px] text-white bg-[#3d5c34] hover:bg-[#314a2a] transition-all duration-200"
          >
            Go to sign in <ArrowRight size={15} className="transition-transform duration-200 group-hover:translate-x-1" />
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <span className="inline-block text-[10px] font-bold uppercase tracking-wide text-[#3d5c34] bg-[#e5efe0] px-2 py-[5px] rounded-md mb-3">
            Internal Operations Portal
          </span>
          <div className="flex items-center gap-2 mb-1">
            <KeyRound size={18} className="text-[#111827]" />
            <h1 className="text-2xl font-bold tracking-tight text-[#111827]">Reset your password</h1>
          </div>
          <p className="text-sm text-[#666666] mt-2 mb-6">Choose a new password for your admin account.</p>

          <GreenField label="New password">
            <div className="relative">
              <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9ca3af]" />
              <input
                type={showPw ? 'text' : 'password'}
                value={form.password}
                onChange={(e) => update('password', e.target.value)}
                placeholder="At least 8 characters"
                className={`${greenInputClass} pl-[38px] pr-10`}
              />
              <button type="button" onClick={() => setShowPw((v) => !v)} className="absolute right-1 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center text-[#9ca3af] hover:text-[#111827]">
                {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {errors.password && <span className="text-xs text-[#b42318] mt-1 block">{errors.password}</span>}
          </GreenField>

          <GreenField label="Confirm new password">
            <input
              type={showPw ? 'text' : 'password'}
              value={form.confirm}
              onChange={(e) => update('confirm', e.target.value)}
              placeholder="Re-enter your new password"
              className={greenInputClass}
            />
            {errors.confirm && <span className="text-xs text-[#b42318] mt-1 block">{errors.confirm}</span>}
          </GreenField>

          {errors.form && <p className="text-sm text-[#b42318] mb-4 -mt-2">{errors.form}</p>}

          <button
            type="submit"
            disabled={status === 'submitting'}
            className="group w-full h-12 rounded-full font-semibold text-[14.5px] text-white bg-[#3d5c34] hover:bg-[#314a2a] transition-all duration-200 inline-flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]"
          >
            {status === 'submitting' ? 'Resetting...' : 'Reset password'}
            <ArrowRight size={15} className="transition-transform duration-200 group-hover:translate-x-1" />
          </button>
        </form>
      )}
    </AuthLayout>
  )
}
