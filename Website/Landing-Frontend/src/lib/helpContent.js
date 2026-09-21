// Local demo dataset for the MZOBS Help Center (Contact page). Deliberately
// plain data (no framework-specific shapes) so it can be swapped for a real
// help/FAQ API later without touching the components that consume it —
// every component here takes `topics`/`faqs` as props rather than importing
// this file directly at render time.

export const AUDIENCES = {
  seeker: 'Job Seeker',
  employer: 'Employer',
}

// "id" here doubles as the FAQ category id used for filtering below.
export const HELP_TOPICS = {
  seeker: [
    {
      id: 'job-search',
      index: '01',
      title: 'Job Search',
      description: 'Find roles that actually fit what you’re looking for.',
      questions: ['Find jobs', 'Search by city', 'Search by category', 'Save jobs'],
    },
    {
      id: 'applications',
      index: '02',
      title: 'Applications',
      description: 'Apply with confidence and keep track of where things stand.',
      questions: ['How to apply', 'Application status', 'Interview process', 'Withdraw application'],
    },
    {
      id: 'profile',
      index: '03',
      title: 'My Profile',
      description: 'Build a profile recruiters actually notice.',
      questions: ['Create profile', 'Update profile', 'Resume', 'Profile visibility'],
    },
    {
      id: 'recruiters',
      index: '04',
      title: 'Recruiters',
      description: 'How conversations with employers and recruiters work.',
      questions: ['Contacting recruiters', 'Recruiter responses', 'Interview communication'],
    },
    {
      id: 'for-employers',
      index: '05',
      title: 'Employers',
      description: 'Hiring instead of applying? Switch to employer support.',
      questions: ['Post a job', 'Manage applications', 'Employer account', 'Hiring support'],
      switchesAudience: 'employer',
    },
    {
      id: 'safety',
      index: '06',
      title: 'Safety & Security',
      description: 'Stay protected while you search and apply.',
      questions: ['Report a suspicious job', 'Recruiter safety', 'Fraud prevention', 'Account security'],
    },
  ],
  employer: [
    {
      id: 'post-job',
      index: '01',
      title: 'Post a Job',
      description: 'Get your opening live and in front of the right candidates.',
      questions: ['Create a job post', 'Edit a live posting', 'Boost visibility', 'Posting guidelines'],
    },
    {
      id: 'manage-jobs',
      index: '02',
      title: 'Manage Jobs',
      description: 'Keep every open role organized in one place.',
      questions: ['Pause or close a job', 'Track performance', 'Duplicate a posting'],
    },
    {
      id: 'find-candidates',
      index: '03',
      title: 'Find Candidates',
      description: 'Search and shortlist talent directly.',
      questions: ['Search the candidate pool', 'Save a candidate', 'Contact a candidate'],
    },
    {
      id: 'candidate-applications',
      index: '04',
      title: 'Candidate Applications',
      description: 'Review, respond to, and move applicants forward.',
      questions: ['Review applications', 'Message an applicant', 'Update application status'],
    },
    {
      id: 'employer-profile',
      index: '05',
      title: 'Employer Profile',
      description: 'Your company page, team access, and account details.',
      questions: ['Edit company profile', 'Add team members', 'Verify your company'],
    },
    {
      id: 'billing',
      index: '06',
      title: 'Billing & Support',
      description: 'Plans, invoices, and getting help fast.',
      questions: ['View plans & pricing', 'Update billing details', 'Talk to hiring support'],
    },
  ],
}

// audience: 'seeker' | 'employer' | 'both'
export const FAQS = [
  {
    id: 'search-jobs',
    category: 'job-search',
    audience: 'seeker',
    question: 'How do I search for jobs?',
    answer: 'Use the search bar on the homepage to look up a job title, skill or company, add a location, and hit Search Jobs. You can also browse by city or category, or save common searches as quick shortcuts.',
  },
  {
    id: 'apply-job',
    category: 'applications',
    audience: 'seeker',
    question: 'How do I apply for a job?',
    answer: 'Open any listing and click Apply Now. Make sure your profile and resume are up to date first — employers see your MZOBS profile alongside your application.',
  },
  {
    id: 'application-status',
    category: 'applications',
    audience: 'seeker',
    question: 'How do I check my application status?',
    answer: 'Go to your dashboard’s Applications tab to see every job you’ve applied to and its current status — Submitted, Under Review, Interviewing, or Closed.',
  },
  {
    id: 'update-profile',
    category: 'profile',
    audience: 'seeker',
    question: 'How do I update my profile?',
    answer: 'Open your profile from the account menu and edit any section — experience, skills, education, or your resume. Changes save automatically and are visible to recruiters right away.',
  },
  {
    id: 'upload-resume',
    category: 'profile',
    audience: 'seeker',
    question: 'How do I upload my resume?',
    answer: 'From your profile page, use Upload Resume to add a PDF or Word document. You can keep multiple versions and choose which one to attach to each application.',
  },
  {
    id: 'profile-visibility',
    category: 'profile',
    audience: 'seeker',
    question: 'How can I make my profile visible to recruiters?',
    answer: 'Turn on "Visible to recruiters" in your privacy settings. A complete profile with a resume and clear skills section is far more likely to be discovered in recruiter searches.',
  },
  {
    id: 'contact-recruiter',
    category: 'recruiters',
    audience: 'seeker',
    question: 'How do I contact an employer or recruiter?',
    answer: 'Once you’ve applied to a role, replies from the employer arrive in your MZOBS messages and by email. We don’t currently support messaging a recruiter before applying.',
  },
  {
    id: 'report-suspicious',
    category: 'safety',
    audience: 'both',
    question: 'How do I report a suspicious job or recruiter?',
    answer: 'Open the listing or message in question and use Report, or contact our team directly through the form below with as much detail as you can share. We review every report.',
  },
  {
    id: 'reset-password',
    category: 'safety',
    audience: 'both',
    question: 'How do I reset my password?',
    answer: 'From the sign-in page, select Forgot password and follow the email link we send you. For security, the link expires after 60 minutes.',
  },
  {
    id: 'delete-account',
    category: 'safety',
    audience: 'both',
    question: 'How do I delete my account?',
    answer: 'Contact our team through the form below with your registered email and we’ll process the deletion, including removing your resume and profile data.',
  },
  {
    id: 'post-job-faq',
    category: 'post-job',
    audience: 'employer',
    question: 'How do I post a job?',
    answer: 'From your employer dashboard, select Post a Job, fill in the role details, and publish. Most listings go live within minutes.',
  },
  {
    id: 'manage-applications',
    category: 'candidate-applications',
    audience: 'employer',
    question: 'How do I manage candidate applications?',
    answer: 'Every posting has its own Applications tab where you can filter, shortlist, message candidates, and update each application’s status.',
  },
  {
    id: 'find-candidates-faq',
    category: 'find-candidates',
    audience: 'employer',
    question: 'How do I search for candidates directly?',
    answer: 'Use Find Candidates in your dashboard to search the talent pool by skill, experience, or location, and reach out to profiles that match your open roles.',
  },
  {
    id: 'billing-faq',
    category: 'billing',
    audience: 'employer',
    question: 'Where do I manage billing and plans?',
    answer: 'Your plan, invoices, and payment details live under Employer Profile → Billing. Reach out through the form below for anything billing support can’t resolve directly.',
  },
]

// category id -> display label, built from both topic lists so a FAQ's
// category badge reads correctly regardless of which audience it belongs to.
export const CATEGORY_LABELS = Object.fromEntries(
  [...HELP_TOPICS.seeker, ...HELP_TOPICS.employer].map((topic) => [topic.id, topic.title])
)

// "I'm stuck — what do I do right now?" — the handful of things visitors
// ask most, each pointing at a real FAQ id above rather than a duplicate,
// hand-written answer.
export const QUICK_SOLUTIONS = [
  { id: 'cant-apply', label: "I can't apply for a job", faqId: 'apply-job' },
  { id: 'no-update', label: "I haven't received an application update", faqId: 'application-status' },
  { id: 'edit-profile', label: 'I want to edit my profile', faqId: 'update-profile' },
  { id: 'forgot-password', label: 'I forgot my password', faqId: 'reset-password' },
  { id: 'report-job', label: 'I want to report a suspicious job', faqId: 'report-suspicious' },
]

// Editorial "keep going" links — each one just deep-links into the FAQ
// section below with a topic/audience preselected, rather than pointing at
// a blog or resource hub that doesn't exist yet.
export const RESOURCES = [
  {
    id: 'resume-profile',
    title: 'Resume & Profile',
    description: 'Build a profile recruiters actually notice.',
    audience: 'seeker',
    category: 'profile',
  },
  {
    id: 'interview-prep',
    title: 'Interview Preparation',
    description: 'Know what to expect before your next interview.',
    audience: 'seeker',
    category: 'applications',
  },
  {
    id: 'career-guidance',
    title: 'Career Guidance',
    description: 'Make smarter, more confident career moves.',
    audience: 'seeker',
    category: 'job-search',
  },
]

// The query form's "Topic" dropdown — broad enough to route a message
// without duplicating the Report a Problem categories below.
export const QUERY_TOPICS = [
  'Profile & account',
  'Job search & applications',
  'Employer & hiring',
  'Billing',
  'Safety & security',
  'Something else',
]

// Report a Problem modal's category list.
export const PROBLEM_TYPES = ['Suspicious job', 'Fake recruiter', 'Incorrect company information', 'Account problem', 'Technical issue', 'Other']

export const POPULAR_SEARCH_CHIPS = ['Resume', 'Profile', 'Apply', 'Interview', 'Recruiter', 'Safety']

export const SEARCH_PLACEHOLDER_EXAMPLES = [
  'How do I apply for a job?',
  'How do I update my profile?',
  'How do I contact a recruiter?',
  'How do I report a suspicious job?',
]

export function searchFaqs(faqs, query) {
  const q = query.trim().toLowerCase()
  if (!q) return []
  return faqs.filter((item) => item.question.toLowerCase().includes(q) || item.category.toLowerCase().includes(q))
}
