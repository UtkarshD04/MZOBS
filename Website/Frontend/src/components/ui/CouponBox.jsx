import { useState } from 'react'
import { X, Loader2, CheckCircle2 } from 'lucide-react'
import { Input } from './Field'
import Button from './Button'
import { usePreviewCouponMutation } from '../../hooks/useSubscription'

// Coupon apply/remove widget shared by the onboarding payment step and the
// account Subscription page — both just pass the discount preview up via
// `onApply` and pass the coupon code back through when creating the order.
export default function CouponBox({ applied, onApply, onRemove, dark = false }) {
  const [code, setCode] = useState('')
  const [error, setError] = useState('')
  const preview = usePreviewCouponMutation()

  function apply() {
    const trimmed = code.trim()
    if (!trimmed) return
    setError('')
    preview.mutate(trimmed, {
      onSuccess: (data) => onApply(data),
      onError: (err) => setError(err.response?.data?.message ?? 'Invalid coupon code'),
    })
  }

  if (applied) {
    return (
      <div className={`flex items-center justify-between gap-3 rounded-xl px-3.5 py-2.5 ${dark ? 'bg-white/10' : 'bg-green-tint'}`}>
        <div className={`flex items-center gap-2 text-[13px] font-semibold ${dark ? 'text-white' : 'text-green'}`}>
          <CheckCircle2 size={15} />
          {applied.code} applied — ₹{applied.discountAmount} off
        </div>
        <button onClick={onRemove} className={dark ? 'text-white/70 hover:text-white cursor-pointer' : 'text-ink-tertiary hover:text-ink cursor-pointer'}>
          <X size={15} />
        </button>
      </div>
    )
  }

  return (
    <div>
      <div className="flex gap-2">
        <Input
          placeholder="Have a coupon code?"
          value={code}
          onChange={(e) => {
            setCode(e.target.value.toUpperCase())
            setError('')
          }}
          onKeyDown={(e) => e.key === 'Enter' && apply()}
          className={dark ? '!bg-white/10 !border-white/20 !text-white placeholder:!text-white/50' : ''}
        />
        <Button variant={dark ? 'gold' : 'secondary'} onClick={apply} disabled={preview.isPending || !code.trim()}>
          {preview.isPending ? <Loader2 size={14} className="animate-spin" /> : 'Apply'}
        </Button>
      </div>
      {error && <p className={`text-xs mt-1.5 ${dark ? 'text-gold-dot' : 'text-red'}`}>{error}</p>}
    </div>
  )
}
