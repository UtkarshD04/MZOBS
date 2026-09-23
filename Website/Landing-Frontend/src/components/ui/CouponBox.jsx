import { useState } from 'react'
import { X, Loader2, CheckCircle2, Tag } from 'lucide-react'

// Coupon apply/remove widget for the employee subscription page (see
// EmployeeSubscription.jsx). `onPreview(code)` resolves to
// `{ code, discountAmount, finalAmount, ... }` (Backend's
// POST /subscription/coupon/preview) or rejects with a readable message —
// the server re-validates the code again for real at order-creation time.
export default function CouponBox({ onPreview, applied, onApply, onRemove }) {
  const [code, setCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function apply() {
    const trimmed = code.trim()
    if (!trimmed) return
    setError('')
    setLoading(true)
    try {
      const data = await onPreview(trimmed)
      onApply(data)
      setCode('')
    } catch (err) {
      setError(err.message ?? 'Invalid coupon code')
    } finally {
      setLoading(false)
    }
  }

  if (applied) {
    return (
      <div className="flex items-center justify-between gap-3 rounded-xl px-3.5 py-2.5 bg-(--jobs-teal-tint)">
        <div className="flex items-center gap-2 text-[13px] font-bold text-(--jobs-teal-dark)">
          <CheckCircle2 size={15} />
          {applied.code} applied — ₹{applied.discountAmount} off
        </div>
        <button type="button" onClick={onRemove} className="text-(--jobs-ink-soft) hover:text-(--jobs-navy) cursor-pointer">
          <X size={15} />
        </button>
      </div>
    )
  }

  return (
    <div>
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Tag size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-(--jobs-ink-soft)" aria-hidden="true" />
          <input
            type="text"
            placeholder="Have a coupon code?"
            value={code}
            onChange={(e) => {
              setCode(e.target.value.toUpperCase())
              setError('')
            }}
            onKeyDown={(e) => e.key === 'Enter' && apply()}
            className="w-full h-10 pl-9 pr-3 rounded-lg border border-(--jobs-border) text-[13.5px] text-(--jobs-navy) outline-none focus:border-(--jobs-teal-dark) transition-colors"
          />
        </div>
        <button
          type="button"
          onClick={apply}
          disabled={loading || !code.trim()}
          className="h-10 px-4 rounded-lg border border-(--jobs-border) text-[13px] font-bold text-(--jobs-navy) hover:bg-(--jobs-teal-tint) transition-colors disabled:opacity-50 disabled:hover:bg-transparent"
        >
          {loading ? <Loader2 size={14} className="animate-spin" /> : 'Apply'}
        </button>
      </div>
      {error && <p className="text-[12px] mt-1.5 text-red-600">{error}</p>}
    </div>
  )
}
