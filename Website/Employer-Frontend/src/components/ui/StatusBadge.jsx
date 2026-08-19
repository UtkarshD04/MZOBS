import Badge from './Badge'

const jobMap = {
  draft: { label: 'Draft', tone: 'gray' },
  pending_review: { label: 'Pending Mzobs review', tone: 'amber' },
  awaiting_payment: { label: 'Awaiting payment', tone: 'gold' },
  sourcing: { label: 'Mzobs sourcing', tone: 'violet' },
  delivered: { label: 'Resumes delivered', tone: 'green' },
  closed: { label: 'Closed', tone: 'navy' },
  archived: { label: 'Archived', tone: 'gray' },
}

const candidateMap = {
  shared: { label: 'Shared', tone: 'navy' },
  shortlisted: { label: 'Shortlisted', tone: 'violet' },
  interviewing: { label: 'Interviewing', tone: 'gold' },
  offered: { label: 'Offered', tone: 'teal' },
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
