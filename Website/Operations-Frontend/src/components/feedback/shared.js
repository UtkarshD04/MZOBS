// Labels, tones and formatters shared by the rejection-feedback screens.

export const STATUS_LABEL = {
  pending_review: 'Pending review',
  approved: 'Approved',
  returned: 'Returned to employer',
  flagged: 'Flagged',
  disputed: 'Disputed by candidate',
}
export const STATUS_TONE = { pending_review: 'gold', approved: 'green', returned: 'navy', flagged: 'red', disputed: 'red' }

export const NOTIFICATION_LABEL = { pending: 'Not delivered yet', sent: 'Delivered', failed: 'Delivery failed', suppressed: 'Candidate turned this off' }
export const NOTIFICATION_TONE = { pending: 'gold', sent: 'green', failed: 'red', suppressed: 'gray' }

export const FOLLOW_UP_LABEL = {
  missing_feedback: 'Feedback not submitted',
  returned_unanswered: 'Returned feedback not corrected',
  clarification_pending: 'Clarification pending',
}

export const DISPUTE_LABEL = { open: 'Open', investigating: 'Under investigation', resolved: 'Resolved' }

// The five queues. `status` is what the API understands; the follow-up queue is a separate list.
export const QUEUES = [
  { key: 'pending_review', label: 'Pending review', status: 'pending_review', count: 'pending_review', tone: 'text-gold-strong' },
  { key: 'approved', label: 'Approved', status: 'approved', count: 'approved', tone: 'text-green' },
  { key: 'returned', label: 'Returned', status: 'returned', count: 'returned', tone: 'text-navy' },
  { key: 'attention', label: 'Flagged / disputed', status: 'attention', count: 'attention', tone: 'text-red' },
  { key: 'followUp', label: 'Employer follow-up', status: null, count: 'followUp', tone: 'text-ink' },
]

export const dateTime = (iso) => (iso ? new Date(iso).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }) : '—')
export const dateOnly = (iso) => (iso ? new Date(iso).toLocaleDateString('en-IN', { dateStyle: 'medium' }) : '—')
export const errorMessage = (err, fallback = 'Something went wrong. Please try again.') => err?.response?.data?.message ?? err?.message ?? fallback
