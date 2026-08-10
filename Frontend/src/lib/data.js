/**
 * Candidate portal — data layer.
 *
 * The candidate's path through Mzobs, in order:
 *   1. Sign up
 *   2. Pay the one-time ₹99 programme fee  ← everything below is locked until this
 *   3. Upload a resume
 *   4. Mzobs verifies the resume
 *   5. Mzobs runs a mock interview
 *   6. Mzobs assigns a skill track
 *   7. Apply to employer requirements — applications go to Mzobs, never straight
 *      to the company. Mzobs shortlists and forwards the resume; the candidate
 *      sees "Interview scheduled" once their profile has been shared.
 */

export const PROGRAM_FEE = 99

export const USER = {
  name: 'Ananya Sharma',
  initials: 'AS',
  role: 'Aspiring Product Analyst',
  email: 'ananya.sharma@gmail.com',
  phone: '+91 98765 43210',
  location: 'Bengaluru, Karnataka',
  memberSince: '12 Jul 2026',
  candidateId: 'CN-1041',
  profileCompletion: 82,
  careerScore: 78,
  atsScore: 92,
}

export const SUBSCRIPTION = {
  status: 'active',
  amount: PROGRAM_FEE,
  purchasedOn: '12 Jul 2026',
  invoice: 'MZ-SUB-10432',
  name: 'Placement Support Programme',
}

export const RESUME = {
  file: 'Ananya_Sharma_Resume_v3.pdf',
  version: 3,
  uploadedOn: '12 Jul 2026',
  status: 'verified', // none | pending | verified | changes
  verifiedOn: '15 Jul 2026',
  reviewer: 'Priya Kapoor',
  reviewerRole: 'Resume Verification Lead, Mzobs',
  score: 88,
  note: 'Quantified impact added in v3 and the formatting is fully ATS-parsable. Approved for employer dispatch.',
}

export const RESUME_HISTORY = [
  { version: 'v3', uploadedOn: '12 Jul 2026', score: '88/100', tone: 'green', status: 'Verified' },
  { version: 'v2', uploadedOn: '2 Jul 2026', score: '68/100', tone: 'gray', status: 'Archived' },
  { version: 'v1', uploadedOn: '20 Jun 2026', score: '51/100', tone: 'red', status: 'Changes requested' },
]

export const RESUME_CHECKS = [
  ['Identity & contact', 10, 10, 'Phone and email verified.'],
  ['Work history', 9, 10, 'Dates and titles cross-checked.'],
  ['Professional summary', 8, 10, 'Clear, could be one line shorter.'],
  ['Skills section', 9, 10, 'Matches your declared track.'],
  ['Formatting & ATS', 9, 10, 'Single column, fully parsable.'],
  ['Keyword match', 8, 10, 'Add "Data Visualization".'],
]

export const MOCK_INTERVIEW = {
  status: 'completed', // not_scheduled | scheduled | completed
  completedOn: '30 Jul 2026',
  panel: 'Rahul Verma',
  panelRole: 'Interview Panel, Mzobs',
  comm: 82,
  domain: 74,
  attitude: 88,
  overall: 81,
  duration: '28:14',
  feedback: [
    ['warn', 'Structure answers using the STAR method for behavioural questions.'],
    ['warn', 'Reduce filler words ("um", "like") — noted 14 times.'],
    ['good', 'Strong ownership examples and a confident, steady tone.'],
  ],
}

export const SKILL_TRACK = {
  key: 'analytics',
  label: 'Analytics & Data',
  tone: 'navy',
  grade: 'A',
  assignedOn: '31 Jul 2026',
  assignedBy: 'Mzobs hiring team',
  note: 'Grade A profiles are shared with employers first when a matching requirement opens.',
}

/** The five steps the candidate portal tracks end to end. */
export const JOURNEY = [
  { key: 'signup', label: 'Signed up', state: 'done', meta: '12 Jul 2026' },
  { key: 'subscription', label: `Paid ₹${PROGRAM_FEE}`, state: 'done', meta: 'One-time' },
  { key: 'resume', label: 'Resume verified', state: 'done', meta: 'by Mzobs' },
  { key: 'mock', label: 'Mock interview', state: 'done', meta: 'Scored 81/100' },
  { key: 'track', label: 'Skill track assigned', state: 'done', meta: 'Analytics · Grade A' },
  { key: 'placement', label: 'Placement support', state: 'current', meta: '3 live applications' },
]

/* Employer requirements published to the candidate portal by Mzobs. */
export const JOBS = [
  {
    id: 'JP-3012', co: 'Solace Technologies', logo: 'ST', role: 'Associate Product Analyst', loc: 'Bengaluru', mode: 'Hybrid',
    sal: '₹8L – ₹11L', match: 94, openings: 6, tags: ['Analytics', 'SQL', 'Product'], posted: '2 days ago', category: 'analytics', applied: true,
  },
  {
    id: 'JP-3013', co: 'Solace Technologies', logo: 'ST', role: 'Senior Backend Engineer', loc: 'Bengaluru', mode: 'Hybrid',
    sal: '₹28L – ₹38L', match: 62, openings: 2, tags: ['Node.js', 'PostgreSQL', 'System Design'], posted: '3 days ago', category: 'tech', applied: false,
  },
  {
    id: 'JP-3014', co: 'Kestrel Systems', logo: 'KS', role: 'Enterprise Sales Manager', loc: 'Mumbai', mode: 'On-site',
    sal: '₹12L – ₹18L', match: 71, openings: 5, tags: ['Enterprise Sales', 'Negotiation', 'CRM'], posted: '4 days ago', category: 'sales', applied: false,
  },
  {
    id: 'JP-3015', co: 'Nimbus Retail', logo: 'NR', role: 'Warehouse Operations Associate', loc: 'Bhiwandi', mode: 'On-site',
    sal: '₹2.4L – ₹3L', match: 58, openings: 50, tags: ['Inventory', 'WMS', 'Coordination'], posted: '3 days ago', category: 'support', applied: false,
  },
  {
    id: 'JP-3016', co: 'Kestrel Systems', logo: 'KS', role: 'UX Designer', loc: 'Pune', mode: 'Hybrid',
    sal: '₹9L – ₹14L', match: 64, openings: 3, tags: ['Figma', 'User Research', 'Design Systems'], posted: '1 day ago', category: 'design', applied: false,
  },
  {
    id: 'JP-3017', co: 'Solace Technologies', logo: 'ST', role: 'HR Executive — Talent Acquisition', loc: 'Bengaluru', mode: 'On-site',
    sal: '₹4L – ₹6L', match: 66, openings: 2, tags: ['Recruitment', 'HRMS', 'Onboarding'], posted: 'Today', category: 'hr', applied: false,
  },
  {
    id: 'JP-3018', co: 'Nimbus Retail', logo: 'NR', role: 'Digital Marketing Executive', loc: 'Gurugram', mode: 'Hybrid',
    sal: '₹5L – ₹7.5L', match: 79, openings: 4, tags: ['SEO', 'Google Ads', 'Performance Marketing'], posted: '1 week ago', category: 'marketing', applied: true,
  },
  {
    id: 'JP-3011', co: 'Nimbus Retail', logo: 'NR', role: 'Customer Support Executive', loc: 'Gurugram', mode: 'On-site',
    sal: '₹3.6L – ₹4.8L', match: 74, openings: 100, tags: ['Communication', 'CRM', 'Escalation'], posted: '2 weeks ago', category: 'support', applied: false,
  },
]

/**
 * The stages an application moves through. Note that the employer only enters
 * the picture at "Profile shared" — before that everything sits with Mzobs.
 */
export const APPLICATION_STAGES = ['Applied to Mzobs', 'Mzobs screening', 'Shortlisted', 'Profile shared with employer', 'Interview scheduled', 'Result']

export const APPLICATIONS = [
  {
    id: 'AP-9001', co: 'Solace Technologies', logo: 'ST', role: 'Associate Product Analyst', jobId: 'JP-3012',
    date: '30 Jul 2026', stage: 4, outcome: null,
    note: 'Your resume has been shared with Solace Technologies and an interview slot is confirmed.',
  },
  {
    id: 'AP-9014', co: 'Solace Technologies', logo: 'ST', role: 'Associate Product Analyst — Batch 2', jobId: 'JP-3012',
    date: '1 Aug 2026', stage: 3, outcome: null,
    note: 'Mzobs has forwarded your profile. The employer is reviewing the batch.',
  },
  {
    id: 'AP-9013', co: 'Nimbus Retail', logo: 'NR', role: 'Digital Marketing Executive', jobId: 'JP-3018',
    date: '20 Jul 2026', stage: 5, outcome: 'rejected',
    note: 'Not selected for this requirement. Your profile stays in the pool for the next matching role.',
  },
]

export const INTERVIEW_SCHEDULED = {
  co: 'Solace Technologies',
  logo: 'ST',
  role: 'Associate Product Analyst',
  round: 'Round 1 — Hiring Manager',
  when: '6 Aug 2026, 11:00 AM',
  duration: '45 minutes',
  mode: 'Video Call (Google Meet)',
  link: 'meet.google.com/mzb-sol-r1',
  sharedOn: '3 Aug 2026',
}

export const NOTIFS = [
  { ic: 'CheckCircle2', tone: 'green', title: 'Resume verified by the Mzobs team', body: 'Version 3 passed verification and is now eligible for employer dispatch.', time: '2h ago', unread: true, cat: 'resume' },
  { ic: 'Building2', tone: 'gold', title: 'Your profile was shared with Solace Technologies', body: 'Associate Product Analyst · Interview scheduled for 6 Aug, 11:00 AM.', time: '5h ago', unread: true, cat: 'applications' },
  { ic: 'Layers', tone: 'navy', title: 'Skill track assigned — Analytics & Data', body: 'Based on your mock interview score of 81/100. Grade A.', time: '1d ago', unread: true, cat: 'track' },
  { ic: 'Video', tone: 'navy', title: 'Mock interview feedback is ready', body: 'Rahul Verma has submitted your panel feedback.', time: '1d ago', unread: false, cat: 'interviews' },
  { ic: 'GraduationCap', tone: 'navy', title: 'Training session starts tomorrow', body: 'Live session: "Case Study Interviews" at 6:00 PM.', time: '2d ago', unread: false, cat: 'training' },
]

export const COURSES = [
  { title: 'Excel for Business Analysts', mentor: 'Karan Mehta', progress: 72, lessons: 18, done: 13, category: 'analytics' },
  { title: 'SQL for Product Analytics', mentor: 'Ritika Shah', progress: 40, lessons: 16, done: 6, category: 'analytics' },
  { title: 'Interview Communication Lab', mentor: 'Aman Gupta', progress: 15, lessons: 20, done: 3, category: 'support' },
]

export const TESTS_AVAILABLE = [
  { title: 'SQL for Analysts', dur: '30 min', qs: 25, diff: 'Intermediate' },
  { title: 'Business Communication', dur: '20 min', qs: 15, diff: 'Beginner' },
  { title: 'Graphic Design Fundamentals', dur: '25 min', qs: 18, diff: 'Beginner' },
  { title: 'Sales & Negotiation Skills', dur: '20 min', qs: 15, diff: 'Intermediate' },
  { title: 'Digital Marketing Basics', dur: '25 min', qs: 20, diff: 'Beginner' },
  { title: 'HR & Recruitment Practices', dur: '20 min', qs: 15, diff: 'Beginner' },
]

export const TESTS_DONE = [
  { title: 'Quantitative Aptitude', score: 82, percentile: 91, date: '28 Jul 2026' },
  { title: 'Verbal Reasoning', score: 76, percentile: 78, date: '25 Jul 2026' },
  { title: 'MS Excel Basics', score: 88, percentile: 95, date: '20 Jul 2026' },
]

export const INTERVIEWS_PAST = [
  { date: '30 Jul 2026', type: 'Mzobs verification round', interviewer: 'Rahul Verma', comm: 82, tech: 74, hr: 88, overall: 81 },
]

export const MESSAGES_THREADS = [
  { id: 1, name: 'Priya Kapoor', role: 'Resume Verification, Mzobs', last: "Your v3 is verified — you're now eligible for employer dispatch.", time: '10:42 AM', unread: 2, av: 'PK' },
  { id: 2, name: 'Rahul Verma', role: 'Interview Panel, Mzobs', last: 'Feedback from your mock interview is up on your portal.', time: 'Yesterday', unread: 0, av: 'RV' },
  { id: 3, name: 'Placement Desk', role: 'Mzobs Team', last: 'Your interview link for Solace has been shared.', time: 'Mon', unread: 0, av: 'PD' },
  { id: 4, name: 'Mzobs Support', role: 'Support', last: 'Let us know if you need anything else!', time: 'Fri', unread: 0, av: 'MS' },
]

export const CONVERSATIONS = {
  1: [
    ['in', "Hi Ananya! I've completed the verification review of your resume v3."],
    ['in', 'Great improvements — quantified impact really stands out now.'],
    ['out', 'Thank you Priya! Anything else I should fix?'],
    ['in', "Nothing blocking. You're verified and eligible for employer dispatch."],
  ],
  2: [
    ['in', 'Hi Ananya, thanks for joining the verification round today.'],
    ['out', 'Thank you for the detailed feedback!'],
    ['in', 'Feedback from your mock interview is up on your portal.'],
  ],
  3: [
    ['in', 'Your profile was shared with Solace Technologies for the Associate Product Analyst role.'],
    ['in', 'Interview scheduled for 6 Aug, 11:00 AM. The link is in your Interview Center.'],
    ['out', 'Got it, thank you!'],
  ],
  4: [['in', 'Hi Ananya, welcome to Mzobs! Let us know if you need anything.']],
}

export const INVOICES = [{ id: SUBSCRIPTION.invoice, desc: 'Placement Support Programme — one-time', date: SUBSCRIPTION.purchasedOn, amount: PROGRAM_FEE, status: 'paid' }]
