import { Lock } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import Card from './Card'
import Button from './Button'

// Shown in place of a page/section that's gated behind the one-time ₹299
// placement-support payment — Resume Center, Mock Interview, and job
// applications all route here instead of duplicating the same lock screen.
export default function PaymentLock({ title, body }) {
  const navigate = useNavigate()
  return (
    <Card pad className="text-center py-12 max-w-lg mx-auto">
      <div className="w-14 h-14 rounded-2xl bg-navy-tint text-navy flex items-center justify-center mx-auto mb-4">
        <Lock size={24} />
      </div>
      <div className="text-lg font-bold">{title}</div>
      <p className="text-sm text-ink-secondary mt-2">{body}</p>
      <Button variant="gold" className="mt-5" onClick={() => navigate('/app/subscription')}>
        Pay ₹299 & activate
      </Button>
    </Card>
  )
}
