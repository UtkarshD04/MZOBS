import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react'
import AuthLayout from '../auth/AuthLayout'
import { loginStaff } from '../../services/authService'
import { GreenField, greenInputClass } from './authFieldHelpers'

export default function Login() {
  const navigate = useNavigate()
  const [showPw, setShowPw] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    setSubmitting(true)
    setError('')
    try {
      const { token } = await loginStaff({ email, password })
      localStorage.setItem('mzobs-ops-token', token)
      navigate('/app')
    } catch (err) {
      setError(err.response?.data?.message ?? 'Invalid email or password')
      setSubmitting(false)
    }
  }

  return (
    <AuthLayout brandTag="For Mzobs Operations">
      <form onSubmit={handleSubmit}>
        <span className="inline-block text-[10px] font-bold uppercase tracking-wide text-[#3d5c34] bg-[#e5efe0] px-2 py-[5px] rounded-md mb-3">
          Operations Portal
        </span>
        <h1 className="text-2xl font-bold tracking-tight text-[#111827]">Sign in</h1>
        <p className="text-sm text-[#666666] mt-2 mb-7">Mzobs operations portal — internal use only.</p>

        <GreenField label="Mzobs email">
          <div className="relative">
            <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9ca3af]" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="ops@mzobs.dev"
              className={`${greenInputClass} pl-[38px]`}
            />
          </div>
        </GreenField>

        <div className="flex flex-col gap-[7px] mb-6">
          <div className="flex items-center justify-between">
            <label className="text-[11px] font-bold uppercase tracking-wide text-[#595959]">Password</label>
            <Link to="/forgot-password" className="text-[11px] font-bold text-[#3d5c34] hover:text-[#314a2a] transition-colors">
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9ca3af]" />
            <input
              type={showPw ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`${greenInputClass} pl-[38px] pr-10`}
            />
            <button type="button" onClick={() => setShowPw((v) => !v)} className="absolute right-1 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center text-[#9ca3af] hover:text-[#111827]">
              {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        {error && <p className="text-sm text-[#b42318] mb-4 -mt-2">{error}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="group w-full h-12 rounded-full font-semibold text-[14.5px] text-white bg-[#3d5c34] hover:bg-[#314a2a] transition-all duration-200 inline-flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]"
        >
          {submitting ? 'Signing in...' : 'Sign in'}
          <ArrowRight size={15} className="transition-transform duration-200 group-hover:translate-x-1" />
        </button>
      </form>
    </AuthLayout>
  )
}
