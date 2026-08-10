import Badge, { type Tone } from './Badge'
import type { CandidateStage, InterviewStatus, InvoiceStatus, JobStatus, OfferStatus, TeamStatus } from '../../types'

const jobMap: Record<JobStatus, { label: string; tone: Tone }> = {
  draft: { label: 'Draft', tone: 'gray' },
  pending_review: { label: 'Pending Mzobs review', tone: 'amber' },
  awaiting_payment: { label: 'Awaiting payment', tone: 'gold' },
  sourcing: { label: 'Mzobs sourcing', tone: 'violet' },
  delivered: { label: 'Resumes delivered', tone: 'green' },
  closed: { label: 'Closed', tone: 'navy' },
  archived: { label: 'Archived', tone: 'gray' },
}

const candidateMap: Record<CandidateStage, { label: string; tone: Tone }> = {
  shared: { label: 'Shared', tone: 'navy' },
  shortlisted: { label: 'Shortlisted', tone: 'violet' },
  interviewing: { label: 'Interviewing', tone: 'gold' },
  offered: { label: 'Offered', tone: 'teal' },
  hired: { label: 'Hired', tone: 'green' },
  rejected: { label: 'Rejected', tone: 'red' },
}

const interviewMap: Record<InterviewStatus, { label: string; tone: Tone }> = {
  Confirmed: { label: 'Confirmed', tone: 'green' },
  'Awaiting confirmation': { label: 'Awaiting confirmation', tone: 'amber' },
  Completed: { label: 'Completed', tone: 'navy' },
  Cancelled: { label: 'Cancelled', tone: 'red' },
  Rescheduled: { label: 'Rescheduled', tone: 'gold' },
}

const offerMap: Record<OfferStatus, { label: string; tone: Tone }> = {
  draft: { label: 'Draft', tone: 'gray' },
  pending: { label: 'Pending', tone: 'amber' },
  accepted: { label: 'Accepted', tone: 'green' },
  rejected: { label: 'Rejected', tone: 'red' },
  withdrawn: { label: 'Withdrawn', tone: 'gray' },
  expired: { label: 'Expired', tone: 'gray' },
}

const invoiceMap: Record<InvoiceStatus, { label: string; tone: Tone }> = {
  paid: { label: 'Paid', tone: 'green' },
  due: { label: 'Due', tone: 'amber' },
  overdue: { label: 'Overdue', tone: 'red' },
}

const teamMap: Record<TeamStatus, { label: string; tone: Tone }> = {
  active: { label: 'Active', tone: 'green' },
  invited: { label: 'Invited', tone: 'amber' },
  suspended: { label: 'Suspended', tone: 'red' },
}

function makeBadge<T extends string>(map: Record<T, { label: string; tone: Tone }>) {
  return function StatusBadgeInner({ status, className }: { status: T; className?: string }) {
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
