import Badge from './Badge'

const jobMap = {
  draft: { label: 'Draft', tone: 'gray' },
  pending_review: { label: 'Pending Mzobs review', tone: 'amber' },
  awaiting_payment: { label: 'Awaiting payment', tone: 'amber' },
  sourcing: { label: 'Mzobs sourcing', tone: 'green' },
  delivered: { label: 'Resumes delivered', tone: 'green' },
  closed: { label: 'Closed', tone: 'gray' },
  archived: { label: 'Archived', tone: 'gray' },
}

const candidateMap = {
  shared: { label: 'New', tone: 'navy' },
  shortlisted: { label: 'Shortlisted', tone: 'green' },
  interviewing: { label: 'Interviewing', tone: 'navy' },
  offered: { label: 'Offered', tone: 'navy' },
  hired: { label: 'Hired', tone: 'green' },
  rejected: { label: 'Rejected', tone: 'red' },
}

const interviewMap = {
  Confirmed: { label: 'Confirmed', tone: 'green' },
  'Awaiting confirmation': { label: 'Awaiting confirmation', tone: 'amber' },
  Completed: { label: 'Completed', tone: 'navy' },
  Cancelled: { label: 'Cancelled', tone: 'red' },
  Rescheduled: { label: 'Rescheduled', tone: 'gold' },
}

const offerMap = {
  draft: { label: 'Draft', tone: 'gray' },
  pending: { label: 'Pending', tone: 'amber' },
  accepted: { label: 'Accepted', tone: 'green' },
  rejected: { label: 'Rejected', tone: 'red' },
  withdrawn: { label: 'Withdrawn', tone: 'gray' },
  expired: { label: 'Expired', tone: 'gray' },
}

const invoiceMap = {
  paid: { label: 'Paid', tone: 'green' },
  due: { label: 'Due', tone: 'amber' },
  overdue: { label: 'Overdue', tone: 'red' },
}

const teamMap = {
  active: { label: 'Active', tone: 'green' },
  invited: { label: 'Invited', tone: 'amber' },
  suspended: { label: 'Suspended', tone: 'red' },
}

function makeBadge(map) {
  return function StatusBadgeInner({ status, className }) {
    const cfg = map[status]
    return (
      <Badge tone={cfg.tone} className={className}>
        {cfg.label}
      </Badge>
    )
  }
}

export const JobStatusBadge = makeBadge(jobMap)
export const CandidateStageBadge = makeBadge(candidateMap)
export const InterviewStatusBadge = makeBadge(interviewMap)
export const OfferStatusBadge = makeBadge(offerMap)
export const InvoiceStatusBadge = makeBadge(invoiceMap)
export const TeamStatusBadge = makeBadge(teamMap)
