import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { ShieldCheck } from 'lucide-react'
import Button from '../components/ui/Button'
import { Field, Input } from '../components/ui/Field'
import { loginSchema } from '../schemas/authSchema'

export default function Login() {
  const navigate = useNavigate()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(loginSchema), defaultValues: { email: 'rhea.kapoor@solacetech.com', password: '' } })

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg-secondary px-4">
      <div className="w-full max-w-[420px]">
        <div className="flex items-center justify-center gap-[9px] font-bold text-lg tracking-tight mb-8">
          <div className="w-9 h-9 rounded-[10px] bg-gradient-to-br from-navy-700 to-navy text-white flex items-center justify-center text-base font-extrabold shadow-navy">M</div>
          <span>Mzobs</span>
          <span className="text-[10px] font-bold tracking-wide uppercase text-navy bg-navy-tint px-1.5 py-[3px] rounded-md">For Employers</span>
        </div>

        <div className="bg-surface border border-border rounded-2xl shadow-md p-8">
          <h1 className="text-[19px] font-bold tracking-tight text-center">Welcome back</h1>
          <p className="text-[13px] text-ink-secondary text-center mt-1.5 mb-6">Sign in to manage hiring for your company.</p>

          <form onSubmit={handleSubmit(() => navigate('/dashboard'))}>
            <Field label="Work Email" error={errors.email?.message}>
              <Input type="email" error={!!errors.email} {...register('email')} />
            </Field>
            <Field label="Password" error={errors.password?.message}>
              <Input type="password" placeholder="••••••••" error={!!errors.password} {...register('password')} />
            </Field>
            <Button type="submit" variant="primary" size="lg" className="w-full mt-2">
              Sign In
            </Button>
          </form>

          <div className="flex items-center gap-2 text-[12px] text-ink-tertiary justify-center mt-5">
            <ShieldCheck size={13} className="text-green" /> Verified employer accounts only
          </div>
        </div>
      </div>
    </div>
  )
}
