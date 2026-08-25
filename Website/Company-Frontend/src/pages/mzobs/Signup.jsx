import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { User, Mail, Lock, Eye, EyeOff, ArrowRight, Briefcase } from 'lucide-react'
import AuthLayout from '../auth/AuthLayout'
import { signupStaff } from '../../services/authService'
import { GreenField, greenInputClass } from './authFieldHelpers'

const ROLES = ['Operations Manager', 'Resume Verification Lead', 'Interview Panel', 'Employer Success', 'Compliance & KYC']

export default function Signup() {
  const navigate = useNavigate()
  const [showPw, setShowPw] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState(ROLES[0])
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    setSubmitting(true)
    setError('')
    try {
      const { token } = await signupStaff({ name, email, password, role })
      localStorage.setItem('mzobs-staff-token', token)
      navigate('/app/dashboard')
    } catch (err) {
      setError(err.response?.data?.message ?? 'Something went wrong. Please try again.')
      setSubmitting(false)
    }
  }

  return (
    <AuthLayout brandTag="For Mzobs Management">
      <form onSubmit={handleSubmit}>
        <span className="inline-block text-[10px] font-bold uppercase tracking-wide text-[#3d5c34] bg-[#e5efe0] px-2 py-[5px] rounded-md mb-3">
          Internal Operations Portal
        </span>
        <h1 className="text-2xl font-bold tracking-tight text-[#111827]">Create staff account</h1>
        <p className="text-sm text-[#666666] mt-2 mb-7">Set up access to the Mzobs operations portal.</p>

        <GreenField label="Full name">
          <div className="relative">
            <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9ca3af]" />
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Jane Doe"
              required
              className={`${greenInputClass} pl-[38px]`}
            />
          </div>
        </GreenField>

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

        <GreenField label="Role">
          <div className="relative">
            <Briefcase size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9ca3af] pointer-events-none" />
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className={`${greenInputClass} pl-[38px] appearance-none`}
            >
              {ROLES.map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>
        </GreenField>

        <GreenField label="Password" hint="At least 8 characters.">
          <div className="relative">
            <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9ca3af]" />
            <input
              type={showPw ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
              className={`${greenInputClass} pl-[38px] pr-10`}
            />
            <button type="button" onClick={() => setShowPw((v) => !v)} className="absolute right-1 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center text-[#9ca3af] hover:text-[#111827]">
              {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </GreenField>

        {error && <p className="text-sm text-[#b42318] mb-4 -mt-2">{error}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="group w-full h-12 rounded-full font-semibold text-[14.5px] text-white bg-[#3d5c34] hover:bg-[#314a2a] transition-all duration-200 inline-flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]"
        >
          {submitting ? 'Creating account...' : 'Create account'}
          <ArrowRight size={15} className="transition-transform duration-200 group-hover:translate-x-1" />
        </button>

        <p className="text-xs text-center mt-5 pt-5 border-t border-[#e0e0e0] text-[#666666]">
          Already have an account?{' '}
          <Link to="/login" className="font-bold text-[#3d5c34] hover:text-[#314a2a] transition-colors">
            Sign in
          </Link>
        </p>
      </form>
    </AuthLayout>
  )
}
