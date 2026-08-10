export type EmploymentType = 'Full-time' | 'Part-time' | 'Contract' | 'Internship'
export type WorkMode = 'On-site' | 'Hybrid' | 'Remote'

/**
 * A requirement's life inside Mzobs:
 *   draft            — still being written here
 *   pending_review   — submitted; Mzobs is reviewing it
 *   awaiting_payment — approved; invoice raised at ₹2,000 per opening
 *   sourcing         — paid; Mzobs is screening applicants and building the batch
 *   delivered        — the resume batch (5 per opening) has landed in Shared Profiles
 *   closed/archived  — done
 */
export type JobStatus = 'draft' | 'pending_review' | 'awaiting_payment' | 'sourcing' | 'delivered' | 'closed' | 'archived'

export type FeeStatus = 'unpaid' | 'paid'

export interface Job {
  id: string
  title: string
  department: string
  employmentType: EmploymentType
  experienceMin: number
  experienceMax: number
  salaryMin: number
  salaryMax: number
  /** Openings — this is what Mzobs bills against. */
  vacancies: number
  location: string
  workMode: WorkMode
  skills: string[]
  description: string
  benefits: string[]
  deadline: string
  status: JobStatus
  /** vacancies × PER_OPENING_FEE */
  feeTotal: number
  feeStatus: FeeStatus
  paidOn?: string
  invoiceId?: string
  /** vacancies × RESUMES_PER_OPENING — what Mzobs owes us. */
  resumesPromised: number
  /** Resumes actually delivered so far. */
  candidatesShared: number
  /** Candidates we selected out of the batch. */
  hiresSelected: number
  submittedOn: string | null
  postedOn: string | null
  updatedOn: string
  hiringTeam: string[]
  closingSoon?: boolean
}

export type CandidateStage =
  | 'shared'
  | 'shortlisted'
  | 'interviewing'
  | 'offered'
  | 'hired'
  | 'rejected'

export interface Candidate {
  id: string
  name: string
  initials: string
  photo?: string
  headline: string
  appliedFor: string
  jobId: string
  experienceYears: number
  location: string
  expectedSalary: string
  availability: string
  resumeVerified: boolean
  identityVerified: boolean
  hasVideoIntro: boolean
  hasPortfolio: boolean
  certificates: number
  skills: string[]
  education: { degree: string; institute: string; year: string }[]
  projects: { name: string; description: string; link?: string }[]
  workHistory: { company: string; role: string; duration: string }[]
  portfolioLink?: string
  email: string
  phone: string
  source: 'Mzobs Verified Pool'
  stage: CandidateStage
  sharedOn: string
  rejectionReason?: string
}

export type InterviewMode = 'Video Call' | 'Phone Call' | 'On-site'
export type InterviewStatus = 'Confirmed' | 'Awaiting confirmation' | 'Completed' | 'Cancelled' | 'Rescheduled'

export interface Interview {
  id: string
  candidateId: string
  candidateName: string
  initials: string
  role: string
  round: string
  startsAt: string
  durationMins: number
  mode: InterviewMode
  location?: string
  meetingLink?: string
  panel: string[]
  status: InterviewStatus
  feedback?: { score: number; notes: string; outcome: 'Selected' | 'Not selected' | 'On hold' }
}

export type OfferStatus = 'draft' | 'pending' | 'accepted' | 'rejected' | 'withdrawn' | 'expired'

export interface Offer {
  id: string
  candidateId: string
  candidateName: string
  initials: string
  role: string
  jobId: string
  ctc: number
  joiningDate: string
  status: OfferStatus
  sentOn: string
  respondedOn?: string
  expiresOn: string
}

export interface HiringContact {
  id: string
  name: string
  role: string
  email: string
  phone: string
}

export type CompanyVerification = 'pending' | 'verified' | 'rejected'

export interface Company {
  id: string
  name: string
  logo: string
  logoUrl?: string
  industry: string
  size: string
  founded: string
  website: string
  linkedin: string
  about: string
  hq: string
  locations: string[]
  hiringContacts: HiringContact[]
  gstin: string
  pan: string
  /** Mzobs verifies every company before it can raise a requirement. */
  verificationStatus: CompanyVerification
  submittedOn: string
  verifiedOn: string | null
  verifiedBy?: string
  openingsPurchased: number
  totalBilled: number
}

export type BatchStatus = 'preparing' | 'delivered' | 'closed'

/** A set of resumes Mzobs ships against one paid requirement. */
export interface ResumeBatch {
  id: string
  jobId: string
  jobTitle: string
  openings: number
  resumesPromised: number
  resumesDelivered: number
  deliveredOn: string | null
  status: BatchStatus
  selected: number
  note: string
}

export type TeamRole = 'Admin' | 'Hiring Manager' | 'Recruiter' | 'Interviewer'
export type TeamStatus = 'active' | 'invited' | 'suspended'

export interface TeamMember {
  id: string
  name: string
  initials: string
  role: TeamRole
  email: string
  status: TeamStatus
  lastActive: string
  joinedOn: string
}

export type NotificationCategory = 'candidates' | 'interviews' | 'offers' | 'billing' | 'jobs' | 'system' | 'batches'

export interface AppNotification {
  id: string
  category: NotificationCategory
  title: string
  body: string
  time: string
  unread: boolean
}

export type InvoiceStatus = 'paid' | 'due' | 'overdue'

export interface Invoice {
  id: string
  description: string
  date: string
  amount: number
  status: InvoiceStatus
}

export interface EmployerUser {
  id: string
  name: string
  initials: string
  role: string
  email: string
}

export interface DashboardStats {
  openRequirements: number
  openRequirementsDelta: string
  openingsPaid: number
  openingsPaidDelta: string
  resumesReceived: number
  resumesReceivedDelta: string
  interviewsScheduled: number
  interviewsDelta: string
  offersSent: number
  offersDelta: string
  employeesJoined: number
  employeesJoinedDelta: string
}

export interface FunnelStage {
  label: string
  value: number
}

export interface TrendPoint {
  label: string
  value: number
}
