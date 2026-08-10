import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Mail, Lock, Eye, EyeOff, ArrowRight, ShieldCheck } from 'lucide-react'
import AuthLayout from '../auth/AuthLayout'
import Button from '../../components/ui/Button'
import { Field, Input } from '../../components/ui/Field'

const QUOTE =
  'Every resume, every company, every rupee moves through this desk. Nothing reaches an employer that our team has not personally verified first.'
const AUTHOR = { initials: 'IB', name: 'Ishaan Bhatia', role: 'Operations Manager, Mzobs' }
const STATS = [
  [1246, '', 'Candidates subscribed'],
  [388, '', 'Profiles shared with employers'],
  [132, '', 'Placements closed'],
]

export default function Login() {
  const navigate = useNavigate()
  const [showPw, setShowPw] = useState(false)

  return (
    <AuthLayout quote={QUOTE} author={AUTHOR} stats={STATS} brandTag="For Mzobs Management">
      <h1 className="text-2xl font-bold tracking-tight">Staff sign in</h1>
      <p className="text-sm text-ink-secondary mt-2 mb-7">Mzobs operations portal — internal use only.</p>

      <Field label="Mzobs email">
        <div className="relative">
          <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-tertiary" />
          <Input type="email" defaultValue="ishaan.bhatia@mzobs.com" className="pl-[38px]" />
        </div>
      </Field>

      <Field label="Password">
        <div className="relative">
          <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-tertiary" />
          <Input type={showPw ? 'text' : 'password'} defaultValue="password123" className="pl-[38px] pr-10" />
          <button type="button" onClick={() => setShowPw((v) => !v)} className="absolute right-1 top-1 w-8 h-8 flex items-center justify-center text-ink-tertiary hover:text-ink">
            {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
      </Field>

      <Field label="Two-factor code" hint="6-digit code from your authenticator app.">
        <Input inputMode="numeric" maxLength={6} placeholder="••••••" />
      </Field>

      <Button variant="primary" size="lg" className="w-full" onClick={() => navigate('/app/dashboard')}>
        Sign in <ArrowRight size={15} />
      </Button>

      <p className="text-xs text-center mt-5 pt-5 border-t border-border text-ink-tertiary flex items-center justify-center gap-1.5">
        <ShieldCheck size={13} className="text-green" /> Staff accounts are provisioned by the Mzobs admin team.
      </p>
    </AuthLayout>
  )
}
