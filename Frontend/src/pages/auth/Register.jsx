import { Link, useNavigate } from 'react-router-dom'
import { Phone } from 'lucide-react'
import AuthLayout from './AuthLayout'
import Button from '../../components/ui/Button'
import { Field, Input } from '../../components/ui/Field'

export default function Register() {
  const navigate = useNavigate()

  return (
    <AuthLayout>
      <h1 className="text-2xl font-bold tracking-tight">Create your account</h1>
      <p className="text-sm text-ink-secondary mt-2 mb-7">Takes less than a minute — start your career success journey.</p>

      <Field label="Full name">
        <Input placeholder="e.g. Ananya Sharma" />
      </Field>
      <Field label="Email address">
        <Input type="email" placeholder="you@email.com" />
      </Field>
      <Field label="Mobile number">
        <div className="relative">
          <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-tertiary" />
          <Input placeholder="+91 98765 43210" className="pl-[38px]" />
        </div>
      </Field>
      <Field label="Password">
        <Input type="password" placeholder="Create a password" />
      </Field>

      <label className="flex items-start gap-2 text-[13px] text-ink-secondary mb-4 cursor-pointer">
        <input type="checkbox" defaultChecked className="mt-0.5 accent-navy w-[15px] h-[15px]" />
        I agree to the Terms of Service and Privacy Policy
      </label>

      <Button variant="primary" size="lg" className="w-full" onClick={() => navigate('/otp')}>
        Create account
      </Button>

      <p className="text-sm text-center mt-4">
        Already have an account?{' '}
        <Link to="/login" className="text-navy font-semibold hover:underline">
          Sign in
        </Link>
      </p>
    </AuthLayout>
  )
}
