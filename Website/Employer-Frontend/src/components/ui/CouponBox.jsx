import { useState } from 'react'
import { X, Loader2, CheckCircle2 } from 'lucide-react'
import { Input } from './Field'
import Button from './Button'
import { usePreviewCvCreditCoupon } from '../../hooks/useCvCredits'

// Coupon apply/remove widget for the CV-credits purchase modal. Previews
// the discount for one specific plan (planId) before an order is created —
// the server re-validates the code again for real at order-creation time.
export default function CouponBox({ planId, applied, onApply, onRemove }) {
  const [code, setCode] = useState('')
  const [error, setError] = useState('')
  const preview = usePreviewCvCreditCoupon()

  function apply() {
    const trimmed = code.trim()
    if (!trimmed) return
    setError('')
    preview.mutate(
      { planId, code: trimmed },
      {
        onSuccess: (data) => onApply(data),
        onError: (err) => setError(err.response?.data?.message ?? 'Invalid coupon code'),
      }
    )
  }

  if (applied) {
    return (
      <div className="flex items-center justify-between gap-3 rounded-xl px-3.5 py-2.5 bg-green-tint">
        <div className="flex items-center gap-2 text-[13px] font-semibold text-green">
          <CheckCircle2 size={15} />
          {applied.code} applied — ₹{applied.discountAmount} off
        </div>
        <button onClick={onRemove} className="text-ink-tertiary hover:text-ink cursor-pointer">
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
        />
        <Button variant="secondary" onClick={apply} disabled={preview.isPending || !code.trim()}>
          {preview.isPending ? <Loader2 size={14} className="animate-spin" /> : 'Apply'}
        </Button>
      </div>
      {error && <p className="text-xs mt-1.5 text-red">{error}</p>}
    </div>
  )
}
