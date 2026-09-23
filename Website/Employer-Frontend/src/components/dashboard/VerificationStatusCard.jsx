import { useNavigate } from 'react-router-dom'
import { AlertTriangle, ShieldAlert } from 'lucide-react'
import Card from '../ui/Card'
import Button from '../ui/Button'

// Shows at most ONE priority notice on the dashboard — verification takes
// precedence over an inactive subscription, since it blocks everything else
// (a job can't go live to candidates either way). Returns null when there is
// nothing that needs the employer's attention right now, rather than an
// empty/placeholder card.
export default function VerificationStatusCard({ company, accessActive }) {
  const navigate = useNavigate()

  if (company?.verificationStatus !== 'verified') {
    return (
      <Card pad className="mb-5 flex items-start gap-3 border-amber/30 bg-amber-tint">
        <span className="w-9 h-9 rounded-[10px] bg-surface text-amber flex items-center justify-center flex-shrink-0">
          <ShieldAlert size={17} />
        </span>
        <div className="flex-1 min-w-0">
          <div className="text-[13.5px] font-semibold text-ink">Company verification in progress</div>
          <p className="text-[13px] text-ink-secondary mt-0.5">
            You can create drafts. Jobs will go live after GSTIN and PAN verification.
          </p>
        </div>
        <Button variant="secondary" size="sm" onClick={() => navigate('/company')} className="flex-shrink-0">
          View verification status
        </Button>
      </Card>
    )
  }

  if (accessActive === false) {
    return (
      <Card pad className="mb-5 flex items-start gap-3 border-amber/30 bg-amber-tint">
        <span className="w-9 h-9 rounded-[10px] bg-surface text-amber flex items-center justify-center flex-shrink-0">
          <AlertTriangle size={17} />
        </span>
        <div className="flex-1 min-w-0">
          <div className="text-[13.5px] font-semibold text-ink">Your employer plan is inactive</div>
          <p className="text-[13px] text-ink-secondary mt-0.5">Activate a plan to publish jobs and view applicant resumes.</p>
        </div>
        <Button variant="secondary" size="sm" onClick={() => navigate('/subscription')} className="flex-shrink-0">
          View plans
        </Button>
      </Card>
    )
  }

  return null
}
