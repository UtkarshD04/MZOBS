import { useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import AuthLayout from './AuthLayout'
import Button from '../../components/ui/Button'
import { Field, Input } from '../../components/ui/Field'

export default function ForgotPassword() {
  const navigate = useNavigate()

  return (
    <AuthLayout>
      <Button variant="ghost" size="sm" className="pl-0 mb-4" onClick={() => navigate('/login')}>
        <ArrowLeft size={14} /> Back to sign in
      </Button>
      <h1 className="text-2xl font-bold tracking-tight">Reset your password</h1>
      <p className="text-sm text-ink-secondary mt-2 mb-7">Enter the email linked to your account and we'll send a 6-digit code.</p>
      <Field label="Email address">
        <Input type="email" placeholder="you@email.com" />
      </Field>
      <Button variant="primary" size="lg" className="w-full" onClick={() => navigate('/otp')}>
        Send code
      </Button>
    </AuthLayout>
  )
}
