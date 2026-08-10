import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import AuthLayout from './AuthLayout'
import Button from '../../components/ui/Button'

export default function Otp() {
  const navigate = useNavigate()
  const [digits, setDigits] = useState(['4', '8', '2', '', '', ''])
  const [timer, setTimer] = useState(28)
  const refs = useRef([])

  useEffect(() => {
    if (timer <= 0) return
    const t = setTimeout(() => setTimer((s) => s - 1), 1000)
    return () => clearTimeout(t)
  }, [timer])

  function onChange(i, val) {
    const v = val.replace(/[^0-9]/g, '').slice(-1)
    setDigits((d) => {
      const next = [...d]
      next[i] = v
      return next
    })
    if (v && i < 5) refs.current[i + 1]?.focus()
  }
  function onKeyDown(i, e) {
    if (e.key === 'Backspace' && !digits[i] && i > 0) refs.current[i - 1]?.focus()
  }

  return (
    <AuthLayout>
      <Button variant="ghost" size="sm" className="pl-0 mb-4" onClick={() => navigate('/login')}>
        <ArrowLeft size={14} /> Back
      </Button>
      <h1 className="text-2xl font-bold tracking-tight">Verify your number</h1>
      <p className="text-sm text-ink-secondary mt-2 mb-6">We've sent a 6-digit code to +91 98765 43210.</p>

      <div className="flex gap-[9px] mb-4">
        {digits.map((d, i) => (
          <input
            key={i}
            ref={(el) => (refs.current[i] = el)}
            value={d}
            onChange={(e) => onChange(i, e.target.value)}
            onKeyDown={(e) => onKeyDown(i, e)}
            maxLength={1}
            className="w-[46px] h-[52px] text-center text-xl font-bold rounded-[10px] border border-border-strong bg-surface outline-none focus:border-navy focus:shadow-[0_0_0_3.5px_var(--color-navy-ring)]"
          />
        ))}
      </div>
      <p className="text-sm mb-4">
        Didn't get it?{' '}
        {timer > 0 ? (
          <span className="text-ink-tertiary">Resend in 0:{timer.toString().padStart(2, '0')}</span>
        ) : (
          <span className="text-navy font-semibold cursor-pointer hover:underline" onClick={() => setTimer(28)}>
            Resend code
          </span>
        )}
      </p>
      <Button variant="primary" size="lg" className="w-full" onClick={() => navigate('/onboarding')}>
        Verify &amp; continue
      </Button>
    </AuthLayout>
  )
}
