import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { ArrowRight, CheckCircle2, Eye, EyeOff, Lock } from 'lucide-react'
import { Field, Input, Select, SubmitButton, LinkButton } from '../ui/AuthField'
import { signupEmployee } from '../../lib/employeeAuth'
import { createGuestSubscriptionOrder, verifyGuestSubscriptionPayment, confirmGuestMockSubscriptionPayment } from '../../lib/employeePayment'
import { openRazorpayCheckout } from '../../lib/razorpay'

const GRADUATION_OPTIONS = [
  '12th / No Degree',
  'Diploma',
  'B.Tech / B.E.',
  'B.Sc',
  'B.Com',
  'BA',
  'BBA',
  'BCA',
  'M.Tech / M.E.',
  'MBA',
  'MCA',
  'M.Sc',
  'Other'
]

const initialForm = { name: '', email: '', phone: '', password: '', experience: 'fresher', graduation: '' }

const UNLOCKS = [
  'Resume verification by the Mzobs team',
  'A real mock interview, with written feedback',
  'A skill track matched to your strengths',
  'Your resume sent to employers on matching roles',
]

function validate(form) {
  const errors = {}
  if (!form.name.trim()) errors.name = 'Please enter your full name.'
  if (!form.email.trim()) errors.email = 'Please enter your email.'
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errors.email = 'Enter a valid email address.'
  if (!form.phone.trim()) errors.phone = 'Please enter your phone number.'
  else if (form.phone.replace(/\D/g, '').length < 10) errors.phone = 'Enter a valid phone number.'
  if (!form.password) errors.password = 'Please create a password.'
  else if (form.password.length < 8) errors.password = 'Password must be at least 8 characters.'
  if (!form.graduation) errors.graduation = 'Please select your graduation.'
  return errors
}

export default function EmployeeSignupForm() {
  const navigate = useNavigate()
  const location = useLocation()

  const [paymentOrderId, setPaymentOrderId] = useState(location.state?.paymentOrderId ?? null)
  const [paying, setPaying] = useState(false)
  const [payError, setPayError] = useState('')
  const [isMockPayment, setIsMockPayment] = useState(location.state?.isMockPayment ?? false)

  const [form, setForm] = useState(initialForm)
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('idle') // idle | submitting | success
  const [showPassword, setShowPassword] = useState(false)

  function update(key, value) {
    setForm((f) => ({ ...f, [key]: value }))
  }

  async function handlePay() {
    setPayError('')
    setPaying(true)
    try {
      const order = await createGuestSubscriptionOrder()

      if (order.mock) {
        const verified = await confirmGuestMockSubscriptionPayment(order.orderId)
        navigate('/employees/payment-success', { state: { paymentOrderId: verified.paymentOrderId, isMockPayment: true } })
        return
      }

      const result = await openRazorpayCheckout(order)
      const verified = await verifyGuestSubscriptionPayment({
        razorpay_order_id: result.razorpay_order_id,
        razorpay_payment_id: result.razorpay_payment_id,
        razorpay_signature: result.razorpay_signature,
      })
      navigate('/employees/payment-success', { state: { paymentOrderId: verified.paymentOrderId, isMockPayment: false } })
    } catch (err) {
      setPayError(err.message || 'Payment failed. Please try again.')
    } finally {
      setPaying(false)
    }
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const nextErrors = validate(form)
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    setStatus('submitting')
    try {
      await signupEmployee({ ...form, paymentOrderId })
      setStatus('success')
    } catch (err) {
      setStatus('idle')
      setErrors({ form: err.message })
    }
  }

  if (status === 'success') {
    return (
      <div className="flex flex-col items-center justify-center text-center py-6">
        <div className="w-14 h-14 rounded-full bg-green-tint text-green flex items-center justify-center mb-4">
          <CheckCircle2 size={26} />
        </div>
        <h3 className="text-lg font-black text-black">You're all set, {form.name.split(' ')[0]}!</h3>
        <p className="text-[13.5px] text-[#595959] mt-1.5 max-w-xs">
          Your Mzobs account has been created. Sign in to complete your profile and start getting matched.
        </p>
        <LinkButton to="/employees/signin" className="mt-6">
          Sign in to continue <ArrowRight size={16} />
        </LinkButton>
      </div>
    )
  }

  if (!paymentOrderId) {
    return (
      <div>
        <StepIndicator step={1} />

        <div className="rounded-2xl border border-[#e0e0e0] bg-[#FAFAF8] p-5">
          <div className="flex items-baseline justify-between pb-4 border-b border-[#e0e0e0]">
            <div>
              <div className="text-sm font-black text-black">Placement Support Programme</div>
              <div className="text-[11px] text-[#9E9E9E] mt-0.5">One-time · lifetime access</div>
            </div>
            <div className="text-[26px] font-black text-black">₹99</div>
          </div>
          <div className="flex flex-col gap-2 mt-4">
            {UNLOCKS.map((t) => (
              <div key={t} className="flex items-start gap-2 text-[12.5px] text-[#595959] font-medium">
                <CheckCircle2 size={14} className="text-[var(--careers-accent)] mt-0.5 shrink-0" />
                <span>{t}</span>
              </div>
            ))}
          </div>
        </div>

        {payError && <p className="text-xs text-red mt-3">{payError}</p>}

        <SubmitButton type="button" onClick={handlePay} disabled={paying} className="mt-5">
          {paying ? (
            'Processing…'
          ) : (
            <>
              Pay ₹99 &amp; continue <ArrowRight size={16} />
            </>
          )}
        </SubmitButton>

        <div className="flex items-center justify-center gap-2 mt-4 text-[11px] text-[#9E9E9E]">
          <Lock size={12} /> Secured by Razorpay · Cards, UPI &amp; netbanking
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <StepIndicator step={2} />
      {isMockPayment && (
        <p className="text-[11px] font-bold text-amber-600 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 mb-4">
          Test mode — payment was simulated because Razorpay isn't configured yet.
        </p>
      )}

      <Field label="Full name">
        <Input value={form.name} onChange={(e) => update('name', e.target.value)} placeholder="Ananya Iyer" />
        {errors.name && <span className="text-xs text-red mt-1 block">{errors.name}</span>}
      </Field>

      <Field label="Email">
        <Input type="email" value={form.email} onChange={(e) => update('email', e.target.value)} placeholder="you@example.com" />
        {errors.email && <span className="text-xs text-red mt-1 block">{errors.email}</span>}
      </Field>

      <Field label="Phone number">
        <Input type="tel" value={form.phone} onChange={(e) => update('phone', e.target.value)} placeholder="98765 43210" />
        {errors.phone && <span className="text-xs text-red mt-1 block">{errors.phone}</span>}
      </Field>

      <Field label="Password">
        <div className="relative">
          <Input
            type={showPassword ? 'text' : 'password'}
            value={form.password}
            onChange={(e) => update('password', e.target.value)}
            placeholder="At least 8 characters"
            className="pr-10"
          />
          <button
            type="button"
            onClick={() => setShowPassword((s) => !s)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9E9E9E] hover:text-black transition-colors"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
        {errors.password && <span className="text-xs text-red mt-1 block">{errors.password}</span>}
      </Field>

      <Field label="You are a...">
        <div className="grid grid-cols-2 gap-3">
          {[
            { value: 'fresher', label: 'Fresher' },
            { value: 'experienced', label: 'Experienced' }
          ].map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => update('experience', opt.value)}
              className={`h-11 rounded-xl text-[13.5px] font-bold border transition-all duration-200 ${
                form.experience === opt.value
                  ? 'bg-[var(--careers-accent)] border-[var(--careers-accent)] text-white'
                  : 'bg-white border-[#C9C9C9] text-[#595959] hover:border-[var(--careers-accent)]'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </Field>

      <Field label="Graduation">
        <Select value={form.graduation} onChange={(e) => update('graduation', e.target.value)}>
          <option value="" disabled>
            Select your graduation
          </option>
          {GRADUATION_OPTIONS.map((g) => (
            <option key={g} value={g}>
              {g}
            </option>
          ))}
        </Select>
        {errors.graduation && <span className="text-xs text-red mt-1 block">{errors.graduation}</span>}
      </Field>

      {errors.form && <p className="text-xs text-red mb-4 -mt-2">{errors.form}</p>}

      <SubmitButton disabled={status === 'submitting'} className="mt-2">
        {status === 'submitting' ? (
          'Creating your account...'
        ) : (
          <>
            Create account <ArrowRight size={16} />
          </>
        )}
      </SubmitButton>

      <p className="text-[11.5px] text-[#9E9E9E] text-center mt-4 leading-relaxed">
        By signing up, you agree to Mzobs'{' '}
        <Link to="/terms-of-service" className="text-[#595959] font-bold hover:text-[var(--careers-accent)] transition-colors">
          Terms of Service
        </Link>{' '}
        and{' '}
        <Link to="/privacy-policy" className="text-[#595959] font-bold hover:text-[var(--careers-accent)] transition-colors">
          Privacy Policy
        </Link>
        .
      </p>
    </form>
  )
}

function StepIndicator({ step }) {
  return (
    <div className="flex items-center gap-2 mb-5">
      <span
        className={`w-6 h-6 rounded-full text-[11px] font-black flex items-center justify-center shrink-0 ${
          step >= 1 ? 'bg-[var(--careers-accent)] text-white' : 'bg-[#F5F5F5] text-[#9E9E9E]'
        }`}
      >
        {step > 1 ? <CheckCircle2 size={13} /> : 1}
      </span>
      <span className={`text-[13px] font-bold ${step >= 1 ? 'text-black' : 'text-[#9E9E9E]'}`}>Payment</span>
      <span className="flex-1 h-px bg-[#e0e0e0]" />
      <span
        className={`w-6 h-6 rounded-full text-[11px] font-black flex items-center justify-center shrink-0 ${
          step >= 2 ? 'bg-[var(--careers-accent)] text-white' : 'bg-[#F5F5F5] text-[#9E9E9E]'
        }`}
      >
        2
      </span>
      <span className={`text-[13px] font-bold ${step >= 2 ? 'text-black' : 'text-[#9E9E9E]'}`}>Your details</span>
    </div>
  )
}
