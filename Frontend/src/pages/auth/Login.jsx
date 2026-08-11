import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react'
import AuthLayout from './AuthLayout'
import Button from '../../components/ui/Button'
import { Field, Input } from '../../components/ui/Field'

export default function Login() {
  const navigate = useNavigate()
  const [showPw, setShowPw] = useState(false)

  return (
    <AuthLayout brandTag="For Employees">
      <h1 className="text-2xl font-bold tracking-tight">Welcome back</h1>
      <p className="text-sm text-ink-secondary mt-2 mb-7">Sign in to continue your career journey with Mzobs.</p>

      <Field label="Email address">
        <div className="relative">
          <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-tertiary" />
          <Input type="email" defaultValue="ananya.sharma@gmail.com" className="pl-[38px]" />
        </div>
      </Field>

      <Field
        label={
          <span className="flex items-center justify-between w-full">
            Password
            <Link to="/forgot-password" className="text-navy font-semibold text-[13px] hover:underline">
              Forgot password?
            </Link>
          </span>
        }
      >
        <div className="relative">
          <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-tertiary" />
          <Input type={showPw ? 'text' : 'password'} defaultValue="password123" className="pl-[38px] pr-10" />
          <button type="button" onClick={() => setShowPw((v) => !v)} className="absolute right-1 top-1 w-8 h-8 flex items-center justify-center text-ink-tertiary hover:text-ink">
            {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
      </Field>

      <label className="flex items-start gap-2 text-[13px] text-ink-secondary mb-4 cursor-pointer">
        <input type="checkbox" defaultChecked className="mt-0.5 accent-navy w-[15px] h-[15px]" />
        Keep me signed in on this device
      </label>

      <Button variant="primary" size="lg" className="w-full" onClick={() => navigate('/app/dashboard')}>
        Sign in <ArrowRight size={15} />
      </Button>

      <p className="text-sm text-center mt-4">
        New to Mzobs?{' '}
        <Link to="/register" className="text-navy font-semibold hover:underline">
          Create an account
        </Link>
      </p>
      <p className="text-xs text-center mt-5 pt-5 border-t border-border text-ink-tertiary">
        Hiring for your company?{' '}
        <Link to="/employer/login" className="text-navy font-semibold hover:underline">
          Access the Employer Portal
        </Link>
      </p>
    </AuthLayout>
  )
}
