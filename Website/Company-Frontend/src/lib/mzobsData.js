/**
 * Mzobs internal operations portal — data layer.
 *
 * This portal is the hub of the whole product. Nothing moves between the
 * candidate portal and the employer portal without passing through here:
 *
 *   Candidate pays ₹99 → uploads resume → Mzobs verifies it → Mzobs runs a mock
 *   interview → Mzobs assigns a skill track.
 *
 *   Employer registers → Mzobs verifies the company → employer posts a
 *   requirement → candidates apply (applications land HERE, never with the
 *   employer) → employer pays ₹2,000 per opening → Mzobs ships 5 resumes per
 *   opening → employer picks its final hires.
 */

export const PRICING = {
  candidateFee: 99, // one-time, unlocks the placement-support programme
  perOpeningFee: 2000, // employer pays this per opening, upfront
  resumesPerOpening: 5, // 100 openings → 500 resumes shipped
}

export const MZOBS_USER = {
  name: 'Ishaan Bhatia',
  initials: 'IB',
  role: 'Operations Manager',
  email: 'ishaan.bhatia@mzobs.com',
}

export const OPS_TEAM = [
  { name: 'Ishaan Bhatia', initials: 'IB', role: 'Operations Manager', email: 'ishaan.bhatia@mzobs.com', status: 'active', lastActive: 'Just now' },
  { name: 'Priya Kapoor', initials: 'PK', role: 'Resume Verification Lead', email: 'priya.kapoor@mzobs.com', status: 'active', lastActive: '12 min ago' },
  { name: 'Rahul Verma', initials: 'RV', role: 'Interview Panel', email: 'rahul.verma@mzobs.com', status: 'active', lastActive: '40 min ago' },
  { name: 'Sneha Iyer', initials: 'SI', role: 'Employer Success', email: 'sneha.iyer@mzobs.com', status: 'active', lastActive: '2h ago' },
  { name: 'Arjun Rao', initials: 'AR', role: 'Interview Panel', email: 'arjun.rao@mzobs.com', status: 'active', lastActive: 'Yesterday' },
  { name: 'Meera Nair', initials: 'MN', role: 'Compliance & KYC', email: 'meera.nair@mzobs.com', status: 'invited', lastActive: 'Never' },
]

export const SKILL_TRACKS = {
  analytics: { label: 'Analytics & Data', tone: 'navy' },
  design: { label: 'Design & Creative', tone: 'violet' },
  sales: { label: 'Sales & BD', tone: 'amber' },
  marketing: { label: 'Marketing', tone: 'teal' },
  hr: { label: 'HR & Recruitment', tone: 'green' },
  support: { label: 'Customer Success', tone: 'gray' },
  tech: { label: 'Engineering', tone: 'navy' },
  ops: { label: 'Operations', tone: 'gray' },
}

export function trackOf(key) {
  return SKILL_TRACKS[key] || { label: 'Unassigned', tone: 'gray' }
}

/* ------------------------------------------------------------------ */
/* Candidates — everyone who signed up on the candidate portal          */
/* ------------------------------------------------------------------ */

export const RESUME_STATUS = {
  pending: { label: 'Pending verification', tone: 'gold' },
  verified: { label: 'Verified', tone: 'green' },
  changes: { label: 'Changes requested', tone: 'amber' },
  rejected: { label: 'Rejected', tone: 'red' },
  none: { label: 'Not uploaded', tone: 'gray' },
}

export const MOCK_STATUS = {
  not_scheduled: { label: 'Not scheduled', tone: 'gray' },
  scheduled: { label: 'Scheduled', tone: 'gold' },
  completed: { label: 'Completed', tone: 'green' },
  no_show: { label: 'No show', tone: 'red' },
}

export const CANDIDATES = [
  {
    id: 'CN-1041', name: 'Ananya Sharma', initials: 'AS', email: 'ananya.sharma@gmail.com', phone: '+91 98765 43210',
    city: 'Bengaluru', exp: 2, expectedCtc: '₹8L', registeredOn: '12 Jul 2026',
    subscription: { status: 'paid', amount: 99, paidOn: '12 Jul 2026', invoice: 'MZ-SUB-10432' },
    resume: { file: 'Ananya_Sharma_Resume_v3.pdf', version: 3, uploadedOn: '12 Jul 2026', status: 'verified', reviewer: 'Priya Kapoor', score: 88, note: 'Quantified impact added in v3. ATS clean.' },
    mock: { status: 'completed', when: '30 Jul 2026, 6:00 PM', panel: 'Rahul Verma', comm: 82, domain: 74, attitude: 88, overall: 81 },
    track: 'analytics', grade: 'A', skills: ['SQL', 'Excel', 'Product Analytics', 'Dashboards'], applications: 3,
  },
  {
    id: 'CN-1042', name: 'Rohan Mehta', initials: 'RM', email: 'rohan.mehta@gmail.com', phone: '+91 98450 11223',
    city: 'Pune', exp: 4, expectedCtc: '₹14L', registeredOn: '14 Jul 2026',
    subscription: { status: 'paid', amount: 99, paidOn: '14 Jul 2026', invoice: 'MZ-SUB-10455' },
    resume: { file: 'Rohan_Mehta_Resume_v2.pdf', version: 2, uploadedOn: '15 Jul 2026', status: 'verified', reviewer: 'Priya Kapoor', score: 84, note: 'Work history verified against two prior employers.' },
    mock: { status: 'completed', when: '25 Jul 2026, 11:00 AM', panel: 'Arjun Rao', comm: 78, domain: 86, attitude: 80, overall: 82 },
    track: 'tech', grade: 'A', skills: ['Node.js', 'PostgreSQL', 'System Design'], applications: 2,
  },
  {
    id: 'CN-1043', name: 'Neha Kulkarni', initials: 'NK', email: 'neha.kulkarni@gmail.com', phone: '+91 99001 45678',
    city: 'Bengaluru', exp: 5, expectedCtc: '₹18L', registeredOn: '18 Jul 2026',
    subscription: { status: 'paid', amount: 99, paidOn: '18 Jul 2026', invoice: 'MZ-SUB-10488' },
    resume: { file: 'Neha_Kulkarni_Resume_v1.pdf', version: 1, uploadedOn: '19 Jul 2026', status: 'verified', reviewer: 'Priya Kapoor', score: 91, note: 'Strongest profile in the July batch.' },
    mock: { status: 'completed', when: '26 Jul 2026, 4:00 PM', panel: 'Rahul Verma', comm: 90, domain: 88, attitude: 92, overall: 90 },
    track: 'tech', grade: 'A', skills: ['Java', 'Spring Boot', 'Kafka', 'AWS'], applications: 2,
  },
  {
    id: 'CN-1044', name: 'Karan Malhotra', initials: 'KM', email: 'karan.malhotra@gmail.com', phone: '+91 90210 33445',
    city: 'Pune', exp: 3, expectedCtc: '₹10L', registeredOn: '22 Jul 2026',
    subscription: { status: 'paid', amount: 99, paidOn: '22 Jul 2026', invoice: 'MZ-SUB-10512' },
    resume: { file: 'Karan_Malhotra_Resume_v1.pdf', version: 1, uploadedOn: '23 Jul 2026', status: 'pending', reviewer: null, score: null, note: null },
    mock: { status: 'scheduled', when: '8 Aug 2026, 11:30 AM', panel: 'Arjun Rao', comm: null, domain: null, attitude: null, overall: null },
    track: null, grade: null, skills: ['Kubernetes', 'Terraform', 'CI/CD'], applications: 1,
  },
  {
    id: 'CN-1045', name: 'Priya Nair', initials: 'PN', email: 'priya.nair@gmail.com', phone: '+91 98330 22110',
    city: 'Mumbai', exp: 7, expectedCtc: '₹16L', registeredOn: '23 Jul 2026',
    subscription: { status: 'paid', amount: 99, paidOn: '23 Jul 2026', invoice: 'MZ-SUB-10520' },
    resume: { file: 'Priya_Nair_Resume_v2.pdf', version: 2, uploadedOn: '24 Jul 2026', status: 'verified', reviewer: 'Priya Kapoor', score: 86, note: 'Sales numbers corroborated with offer letters.' },
    mock: { status: 'completed', when: '29 Jul 2026, 5:00 PM', panel: 'Rahul Verma', comm: 92, domain: 84, attitude: 89, overall: 88 },
    track: 'sales', grade: 'A', skills: ['Enterprise Sales', 'Negotiation', 'CRM'], applications: 2,
  },
  {
    id: 'CN-1046', name: 'Vikram Rao', initials: 'VR', email: 'vikram.rao@gmail.com', phone: '+91 91234 88776',
    city: 'Hyderabad', exp: 4, expectedCtc: '₹11L', registeredOn: '25 Jul 2026',
    subscription: { status: 'paid', amount: 99, paidOn: '25 Jul 2026', invoice: 'MZ-SUB-10544' },
    resume: { file: 'Vikram_Rao_Resume_v2.pdf', version: 2, uploadedOn: '26 Jul 2026', status: 'changes', reviewer: 'Priya Kapoor', score: 64, note: 'Two roles missing dates. Asked candidate to re-upload with a full timeline.' },
    mock: { status: 'not_scheduled', when: null, panel: null, comm: null, domain: null, attitude: null, overall: null },
    track: null, grade: null, skills: ['Selenium', 'API Testing'], applications: 0,
  },
  {
    id: 'CN-1047', name: 'Simran Kaur', initials: 'SK', email: 'simran.kaur@gmail.com', phone: '+91 99887 66554',
    city: 'Delhi NCR', exp: 5, expectedCtc: '₹15L', registeredOn: '26 Jul 2026',
    subscription: { status: 'paid', amount: 99, paidOn: '26 Jul 2026', invoice: 'MZ-SUB-10561' },
    resume: { file: 'Simran_Kaur_Resume_v1.pdf', version: 1, uploadedOn: '26 Jul 2026', status: 'verified', reviewer: 'Priya Kapoor', score: 83, note: 'Clean profile, PM track.' },
    mock: { status: 'completed', when: '31 Jul 2026, 12:00 PM', panel: 'Arjun Rao', comm: 85, domain: 79, attitude: 84, overall: 83 },
    track: 'analytics', grade: 'B', skills: ['Product Strategy', 'SQL', 'Roadmapping'], applications: 1,
  },
  {
    id: 'CN-1048', name: 'Arjun Iyer', initials: 'AI', email: 'arjun.iyer@gmail.com', phone: '+91 90045 12398',
    city: 'Bengaluru', exp: 8, expectedCtc: '₹22L', registeredOn: '28 Jul 2026',
    subscription: { status: 'paid', amount: 99, paidOn: '28 Jul 2026', invoice: 'MZ-SUB-10588' },
    resume: { file: 'Arjun_Iyer_Resume_v1.pdf', version: 1, uploadedOn: '28 Jul 2026', status: 'verified', reviewer: 'Priya Kapoor', score: 93, note: 'Senior profile — fast-tracked to the panel.' },
    mock: { status: 'completed', when: '1 Aug 2026, 10:00 AM', panel: 'Rahul Verma', comm: 88, domain: 94, attitude: 86, overall: 90 },
    track: 'tech', grade: 'A', skills: ['React', 'TypeScript', 'Performance'], applications: 1,
  },
  {
    id: 'CN-1049', name: 'Fatima Sheikh', initials: 'FS', email: 'fatima.sheikh@gmail.com', phone: '+91 93456 77889',
    city: 'Chennai', exp: 4, expectedCtc: '₹9L', registeredOn: '29 Jul 2026',
    subscription: { status: 'paid', amount: 99, paidOn: '29 Jul 2026', invoice: 'MZ-SUB-10601' },
    resume: { file: 'Fatima_Sheikh_Resume_v1.pdf', version: 1, uploadedOn: '30 Jul 2026', status: 'pending', reviewer: null, score: null, note: null },
    mock: { status: 'not_scheduled', when: null, panel: null, comm: null, domain: null, attitude: null, overall: null },
    track: null, grade: null, skills: ['Account Management', 'Onboarding', 'CRM'], applications: 1,
  },
  {
    id: 'CN-1050', name: 'Aman Verma', initials: 'AV', email: 'aman.verma@gmail.com', phone: '+91 97654 32109',
    city: 'Remote', exp: 2, expectedCtc: '₹7L', registeredOn: '30 Jul 2026',
    subscription: { status: 'unpaid', amount: 99, paidOn: null, invoice: null },
    resume: { file: null, version: 0, uploadedOn: null, status: 'none', reviewer: null, score: null, note: null },
    mock: { status: 'not_scheduled', when: null, panel: null, comm: null, domain: null, attitude: null, overall: null },
    track: null, grade: null, skills: [], applications: 0,
  },
  {
    id: 'CN-1051', name: 'Divya Menon', initials: 'DM', email: 'divya.menon@gmail.com', phone: '+91 98111 22334',
    city: 'Kochi', exp: 3, expectedCtc: '₹8L', registeredOn: '31 Jul 2026',
    subscription: { status: 'paid', amount: 99, paidOn: '31 Jul 2026', invoice: 'MZ-SUB-10624' },
    resume: { file: 'Divya_Menon_Resume_v1.pdf', version: 1, uploadedOn: '31 Jul 2026', status: 'verified', reviewer: 'Priya Kapoor', score: 80, note: 'Portfolio link verified.' },
    mock: { status: 'scheduled', when: '7 Aug 2026, 3:00 PM', panel: 'Rahul Verma', comm: null, domain: null, attitude: null, overall: null },
    track: null, grade: null, skills: ['Figma', 'User Research', 'Usability Testing'], applications: 1,
  },
  {
    id: 'CN-1052', name: 'Sahil Khanna', initials: 'SH', email: 'sahil.khanna@gmail.com', phone: '+91 90909 45671',
    city: 'Bengaluru', exp: 0, expectedCtc: '₹4.5L', registeredOn: '1 Aug 2026',
    subscription: { status: 'paid', amount: 99, paidOn: '1 Aug 2026', invoice: 'MZ-SUB-10640' },
    resume: { file: 'Sahil_Khanna_Resume_v1.pdf', version: 1, uploadedOn: '2 Aug 2026', status: 'pending', reviewer: null, score: null, note: null },
    mock: { status: 'scheduled', when: '9 Aug 2026, 6:00 PM', panel: 'Arjun Rao', comm: null, domain: null, attitude: null, overall: null },
    track: null, grade: null, skills: ['SQL', 'Excel', 'Python'], applications: 1,
  },
  {
    id: 'CN-1053', name: 'Ritu Deshpande', initials: 'RD', email: 'ritu.deshpande@gmail.com', phone: '+91 98220 11009',
    city: 'Mumbai', exp: 2, expectedCtc: '₹6L', registeredOn: '2 Aug 2026',
    subscription: { status: 'paid', amount: 99, paidOn: '2 Aug 2026', invoice: 'MZ-SUB-10659' },
    resume: { file: 'Ritu_Deshpande_Resume_v1.pdf', version: 1, uploadedOn: '2 Aug 2026', status: 'verified', reviewer: 'Priya Kapoor', score: 76, note: 'Entry-level SDR profile, clean.' },
    mock: { status: 'completed', when: '4 Aug 2026, 2:00 PM', panel: 'Arjun Rao', comm: 84, domain: 70, attitude: 86, overall: 80 },
    track: 'sales', grade: 'B', skills: ['Lead Generation', 'Cold Outreach', 'CRM'], applications: 1,
  },
  {
    id: 'CN-1054', name: 'Yash Trivedi', initials: 'YT', email: 'yash.trivedi@gmail.com', phone: '+91 99770 55443',
    city: 'Ahmedabad', exp: 6, expectedCtc: '₹17L', registeredOn: '3 Aug 2026',
    subscription: { status: 'paid', amount: 99, paidOn: '3 Aug 2026', invoice: 'MZ-SUB-10671' },
    resume: { file: 'Yash_Trivedi_Resume_v1.pdf', version: 1, uploadedOn: '4 Aug 2026', status: 'pending', reviewer: null, score: null, note: null },
    mock: { status: 'not_scheduled', when: null, panel: null, comm: null, domain: null, attitude: null, overall: null },
    track: null, grade: null, skills: ['Python', 'Django', 'AWS'], applications: 1,
  },
  {
    id: 'CN-1055', name: 'Meghna Das', initials: 'MD', email: 'meghna.das@gmail.com', phone: '+91 96543 21870',
    city: 'Kolkata', exp: 1, expectedCtc: '₹5L', registeredOn: '4 Aug 2026',
    subscription: { status: 'paid', amount: 99, paidOn: '4 Aug 2026', invoice: 'MZ-SUB-10688' },
    resume: { file: 'Meghna_Das_Resume_v1.pdf', version: 1, uploadedOn: '5 Aug 2026', status: 'pending', reviewer: null, score: null, note: null },
    mock: { status: 'not_scheduled', when: null, panel: null, comm: null, domain: null, attitude: null, overall: null },
    track: null, grade: null, skills: ['Content Writing', 'SEO'], applications: 0,
  },
  {
    id: 'CN-1056', name: 'Imran Qureshi', initials: 'IQ', email: 'imran.qureshi@gmail.com', phone: '+91 90786 54321',
    city: 'Gurugram', exp: 3, expectedCtc: '₹9L', registeredOn: '5 Aug 2026',
    subscription: { status: 'unpaid', amount: 99, paidOn: null, invoice: null },
    resume: { file: null, version: 0, uploadedOn: null, status: 'none', reviewer: null, score: null, note: null },
    mock: { status: 'not_scheduled', when: null, panel: null, comm: null, domain: null, attitude: null, overall: null },
    track: null, grade: null, skills: [], applications: 0,
  },
]

/* ------------------------------------------------------------------ */
/* Employers — companies registered on the employer portal              */
/* ------------------------------------------------------------------ */

export const COMPANY_STATUS = {
  pending: { label: 'Pending verification', tone: 'gold' },
  verified: { label: 'Verified', tone: 'green' },
  rejected: { label: 'Rejected', tone: 'red' },
  suspended: { label: 'Suspended', tone: 'gray' },
}

export const COMPANIES = [
  {
    id: 'CO-2101', name: 'Solace Technologies', logo: 'ST', industry: 'Enterprise SaaS', size: '501–1000',
    hq: 'Bengaluru, Karnataka', website: 'solacetech.com', gst: '29ABCDE1234F1Z5', pan: 'ABCDE1234F',
    contact: { name: 'Rhea Kapoor', role: 'Talent Acquisition Lead', email: 'rhea.kapoor@solacetech.com', phone: '+91 98765 43210' },
    status: 'verified', registeredOn: '14 Jun 2026', verifiedOn: '18 Jun 2026', verifiedBy: 'Meera Nair',
    note: 'GST + PAN matched MCA records. Site visit not required.', openings: 108, paid: 216000,
  },
  {
    id: 'CO-2102', name: 'Nimbus Retail Pvt Ltd', logo: 'NR', industry: 'Retail & E-commerce', size: '1001–5000',
    hq: 'Gurugram, Haryana', website: 'nimbusretail.in', gst: '06NMBUS4321K1Z9', pan: 'NMBUS4321K',
    contact: { name: 'Aakash Sethi', role: 'HR Head', email: 'aakash.sethi@nimbusretail.in', phone: '+91 98110 33221' },
    status: 'verified', registeredOn: '2 Jul 2026', verifiedOn: '5 Jul 2026', verifiedBy: 'Meera Nair',
    note: 'Verified. Bulk hirer — expect repeat requirements each quarter.', openings: 150, paid: 300000,
  },
  {
    id: 'CO-2103', name: 'Kestrel Systems', logo: 'KS', industry: 'IT Services', size: '201–500',
    hq: 'Pune, Maharashtra', website: 'kestrelsystems.com', gst: '27KSTRL9876P1Z2', pan: 'KSTRL9876P',
    contact: { name: 'Priya Deshmukh', role: 'Head of Talent', email: 'priya.deshmukh@kestrelsystems.com', phone: '+91 90287 44556' },
    status: 'verified', registeredOn: '19 Jul 2026', verifiedOn: '21 Jul 2026', verifiedBy: 'Meera Nair',
    note: 'Verified against GSTIN portal.', openings: 25, paid: 50000,
  },
  {
    id: 'CO-2104', name: 'Brightline Foods', logo: 'BF', industry: 'FMCG', size: '51–200',
    hq: 'Ahmedabad, Gujarat', website: 'brightlinefoods.co.in', gst: '24BRGHT5544L1Z7', pan: 'BRGHT5544L',
    contact: { name: 'Nilesh Patel', role: 'Founder', email: 'nilesh@brightlinefoods.co.in', phone: '+91 99250 87766' },
    status: 'pending', registeredOn: '3 Aug 2026', verifiedOn: null, verifiedBy: null,
    note: 'GST certificate uploaded. Awaiting PAN cross-check and a call with the founder.', openings: 0, paid: 0,
  },
  {
    id: 'CO-2105', name: 'Vertex Logistics', logo: 'VL', industry: 'Logistics & Supply Chain', size: '201–500',
    hq: 'Chennai, Tamil Nadu', website: 'vertexlogistics.in', gst: '33VRTEX1122M1Z4', pan: 'VRTEX1122M',
    contact: { name: 'Suresh Balan', role: 'Operations Director', email: 'suresh.balan@vertexlogistics.in', phone: '+91 94440 22113' },
    status: 'pending', registeredOn: '5 Aug 2026', verifiedOn: null, verifiedBy: null,
    note: 'Registered yesterday. Documents not uploaded yet — reminder sent.', openings: 0, paid: 0,
  },
  {
    id: 'CO-2106', name: 'Quickhire Staffing', logo: 'QS', industry: 'Staffing Agency', size: '11–50',
    hq: 'Noida, Uttar Pradesh', website: 'quickhirestaffing.biz', gst: '09QCKHR0099N1Z1', pan: 'QCKHR0099N',
    contact: { name: 'Deepak Singh', role: 'Director', email: 'deepak@quickhirestaffing.biz', phone: '+91 98999 11223' },
    status: 'rejected', registeredOn: '28 Jul 2026', verifiedOn: '30 Jul 2026', verifiedBy: 'Meera Nair',
    note: 'Third-party staffing reseller. Rejected — we place candidates with the hiring company directly.', openings: 0, paid: 0,
  },
]

export function companyOf(id) {
  return COMPANIES.find((c) => c.id === id)
}

/* ------------------------------------------------------------------ */
/* Requirements — job posts raised by employers                         */
/* ------------------------------------------------------------------ */

export const JOB_STATUS = {
  pending_review: { label: 'Pending review', tone: 'gold' },
  awaiting_payment: { label: 'Awaiting payment', tone: 'amber' },
  live: { label: 'Live — collecting applications', tone: 'navy' },
  sourcing: { label: 'Sourcing shortlist', tone: 'violet' },
  delivered: { label: 'Resumes delivered', tone: 'teal' },
  closed: { label: 'Closed', tone: 'gray' },
  rejected: { label: 'Rejected', tone: 'red' },
}

export const JOB_POSTS = [
  {
    id: 'JP-3011', companyId: 'CO-2102', title: 'Customer Support Executive', dept: 'Operations',
    location: 'Gurugram', mode: 'On-site', type: 'Full-time', salary: '₹3.6L – ₹4.8L', track: 'support',
    openings: 100, postedOn: '20 Jul 2026', status: 'delivered', applications: 486,
    skills: ['Communication', 'CRM', 'Escalation Handling'],
    fee: 200000, feeStatus: 'paid', paidOn: '22 Jul 2026', invoice: 'MZ-EMP-4201',
    resumesPromised: 500, resumesShared: 500, selected: 87,
  },
  {
    id: 'JP-3012', companyId: 'CO-2101', title: 'Associate Product Analyst', dept: 'Product',
    location: 'Bengaluru', mode: 'Hybrid', type: 'Full-time', salary: '₹8L – ₹11L', track: 'analytics',
    openings: 6, postedOn: '29 Jul 2026', status: 'sourcing', applications: 142,
    skills: ['SQL', 'Excel', 'Product Analytics'],
    fee: 12000, feeStatus: 'paid', paidOn: '30 Jul 2026', invoice: 'MZ-EMP-4233',
    resumesPromised: 30, resumesShared: 18, selected: 0,
  },
  {
    id: 'JP-3013', companyId: 'CO-2101', title: 'Senior Backend Engineer', dept: 'Engineering',
    location: 'Bengaluru', mode: 'Hybrid', type: 'Full-time', salary: '₹28L – ₹38L', track: 'tech',
    openings: 2, postedOn: '30 Jul 2026', status: 'live', applications: 64,
    skills: ['Node.js', 'PostgreSQL', 'System Design'],
    fee: 4000, feeStatus: 'paid', paidOn: '31 Jul 2026', invoice: 'MZ-EMP-4240',
    resumesPromised: 10, resumesShared: 0, selected: 0,
  },
  {
    id: 'JP-3014', companyId: 'CO-2103', title: 'Enterprise Sales Manager', dept: 'Sales',
    location: 'Mumbai', mode: 'On-site', type: 'Full-time', salary: '₹12L – ₹18L', track: 'sales',
    openings: 5, postedOn: '31 Jul 2026', status: 'sourcing', applications: 78,
    skills: ['Enterprise Sales', 'Negotiation', 'CRM'],
    fee: 10000, feeStatus: 'paid', paidOn: '1 Aug 2026', invoice: 'MZ-EMP-4248',
    resumesPromised: 25, resumesShared: 12, selected: 0,
  },
  {
    id: 'JP-3015', companyId: 'CO-2102', title: 'Warehouse Operations Associate', dept: 'Operations',
    location: 'Bhiwandi', mode: 'On-site', type: 'Full-time', salary: '₹2.4L – ₹3L', track: 'ops',
    openings: 50, postedOn: '2 Aug 2026', status: 'awaiting_payment', applications: 96,
    skills: ['Inventory', 'WMS', 'Team Coordination'],
    fee: 100000, feeStatus: 'unpaid', paidOn: null, invoice: 'MZ-EMP-4256',
    resumesPromised: 250, resumesShared: 0, selected: 0,
  },
  {
    id: 'JP-3016', companyId: 'CO-2103', title: 'UX Designer', dept: 'Design',
    location: 'Pune', mode: 'Hybrid', type: 'Full-time', salary: '₹9L – ₹14L', track: 'design',
    openings: 3, postedOn: '4 Aug 2026', status: 'pending_review', applications: 0,
    skills: ['Figma', 'User Research', 'Design Systems'],
    fee: 6000, feeStatus: 'unpaid', paidOn: null, invoice: null,
    resumesPromised: 15, resumesShared: 0, selected: 0,
  },
  {
    id: 'JP-3017', companyId: 'CO-2101', title: 'HR Executive — Talent Acquisition', dept: 'People',
    location: 'Bengaluru', mode: 'On-site', type: 'Full-time', salary: '₹4L – ₹6L', track: 'hr',
    openings: 2, postedOn: '5 Aug 2026', status: 'pending_review', applications: 0,
    skills: ['Recruitment', 'HRMS', 'Onboarding'],
    fee: 4000, feeStatus: 'unpaid', paidOn: null, invoice: null,
    resumesPromised: 10, resumesShared: 0, selected: 0,
  },
  {
    id: 'JP-3018', companyId: 'CO-2102', title: 'Digital Marketing Executive', dept: 'Marketing',
    location: 'Gurugram', mode: 'Hybrid', type: 'Full-time', salary: '₹5L – ₹7.5L', track: 'marketing',
    openings: 4, postedOn: '18 Jul 2026', status: 'closed', applications: 121,
    skills: ['SEO', 'Google Ads', 'Performance Marketing'],
    fee: 8000, feeStatus: 'paid', paidOn: '19 Jul 2026', invoice: 'MZ-EMP-4188',
    resumesPromised: 20, resumesShared: 20, selected: 4,
  },
]

export function jobOf(id) {
  return JOB_POSTS.find((j) => j.id === id)
}

/* ------------------------------------------------------------------ */
/* Applications — candidate → job. Employers never see this table.      */
/* ------------------------------------------------------------------ */

export const APPLICATION_STATUS = {
  new: { label: 'New', tone: 'navy' },
  screening: { label: 'Under screening', tone: 'gold' },
  shortlisted: { label: 'Shortlisted', tone: 'violet' },
  shared: { label: 'Shared with employer', tone: 'teal' },
  interview: { label: 'Interview scheduled', tone: 'gold' },
  selected: { label: 'Selected', tone: 'green' },
  rejected: { label: 'Not selected', tone: 'red' },
}

export const APPLICATIONS = [
  { id: 'AP-9001', candidateId: 'CN-1041', jobId: 'JP-3012', appliedOn: '30 Jul 2026', status: 'interview', fit: 94 },
  { id: 'AP-9002', candidateId: 'CN-1047', jobId: 'JP-3012', appliedOn: '31 Jul 2026', status: 'shared', fit: 88 },
  { id: 'AP-9003', candidateId: 'CN-1052', jobId: 'JP-3012', appliedOn: '2 Aug 2026', status: 'screening', fit: 71 },
  { id: 'AP-9004', candidateId: 'CN-1042', jobId: 'JP-3013', appliedOn: '31 Jul 2026', status: 'shortlisted', fit: 91 },
  { id: 'AP-9005', candidateId: 'CN-1043', jobId: 'JP-3013', appliedOn: '31 Jul 2026', status: 'shortlisted', fit: 93 },
  { id: 'AP-9006', candidateId: 'CN-1054', jobId: 'JP-3013', appliedOn: '4 Aug 2026', status: 'new', fit: 85 },
  { id: 'AP-9007', candidateId: 'CN-1045', jobId: 'JP-3014', appliedOn: '1 Aug 2026', status: 'interview', fit: 92 },
  { id: 'AP-9008', candidateId: 'CN-1053', jobId: 'JP-3014', appliedOn: '3 Aug 2026', status: 'shared', fit: 79 },
  { id: 'AP-9009', candidateId: 'CN-1049', jobId: 'JP-3011', appliedOn: '30 Jul 2026', status: 'selected', fit: 82 },
  { id: 'AP-9010', candidateId: 'CN-1048', jobId: 'JP-3013', appliedOn: '5 Aug 2026', status: 'new', fit: 95 },
  { id: 'AP-9011', candidateId: 'CN-1051', jobId: 'JP-3016', appliedOn: '5 Aug 2026', status: 'new', fit: 87 },
  { id: 'AP-9012', candidateId: 'CN-1044', jobId: 'JP-3015', appliedOn: '3 Aug 2026', status: 'screening', fit: 74 },
  { id: 'AP-9013', candidateId: 'CN-1041', jobId: 'JP-3018', appliedOn: '20 Jul 2026', status: 'rejected', fit: 68 },
  { id: 'AP-9014', candidateId: 'CN-1043', jobId: 'JP-3012', appliedOn: '1 Aug 2026', status: 'shared', fit: 84 },
  { id: 'AP-9015', candidateId: 'CN-1045', jobId: 'JP-3011', appliedOn: '25 Jul 2026', status: 'selected', fit: 80 },
  { id: 'AP-9016', candidateId: 'CN-1042', jobId: 'JP-3012', appliedOn: '2 Aug 2026', status: 'screening', fit: 76 },
]

export function candidateOf(id) {
  return CANDIDATES.find((c) => c.id === id)
}

/* ------------------------------------------------------------------ */
/* Dispatch batches — the resumes Mzobs ships to an employer            */
/* ------------------------------------------------------------------ */

export const BATCH_STATUS = {
  building: { label: 'Building', tone: 'gold' },
  ready: { label: 'Ready to send', tone: 'navy' },
  sent: { label: 'Sent to employer', tone: 'teal' },
  reviewed: { label: 'Employer reviewed', tone: 'violet' },
  closed: { label: 'Closed', tone: 'green' },
}

export const BATCHES = [
  {
    id: 'BT-501', jobId: 'JP-3011', companyId: 'CO-2102', openings: 100, resumeCount: 500,
    status: 'closed', sentOn: '26 Jul 2026', selected: 87, interviewsScheduled: 500, note: 'Employer selected 87 of 100. Remaining 13 openings rolled into a follow-up requirement.',
  },
  {
    id: 'BT-502', jobId: 'JP-3018', companyId: 'CO-2102', openings: 4, resumeCount: 20,
    status: 'closed', sentOn: '21 Jul 2026', selected: 4, interviewsScheduled: 20, note: 'Fully closed. All 4 candidates joined.',
  },
  {
    id: 'BT-503', jobId: 'JP-3012', companyId: 'CO-2101', openings: 6, resumeCount: 30,
    status: 'building', sentOn: null, selected: 0, interviewsScheduled: 18, note: '18 of 30 resumes locked. Need 12 more verified Analytics-track profiles.',
  },
  {
    id: 'BT-504', jobId: 'JP-3014', companyId: 'CO-2103', openings: 5, resumeCount: 25,
    status: 'building', sentOn: null, selected: 0, interviewsScheduled: 12, note: '12 of 25 locked. Sales track shortlist in progress.',
  },
  {
    id: 'BT-505', jobId: 'JP-3013', companyId: 'CO-2101', openings: 2, resumeCount: 10,
    status: 'ready', sentOn: null, selected: 0, interviewsScheduled: 0, note: 'All 10 profiles locked and ready for dispatch.',
  },
]

/* ------------------------------------------------------------------ */
/* Mock interviews run by the Mzobs panel                               */
/* ------------------------------------------------------------------ */

export const MOCK_INTERVIEWS = [
  { id: 'MI-701', candidateId: 'CN-1051', when: 'Today, 3:00 PM – 3:45 PM', day: 'today', panel: 'Rahul Verma', mode: 'Google Meet', link: 'meet.google.com/mzb-divya', status: 'Confirmed' },
  { id: 'MI-702', candidateId: 'CN-1044', when: 'Tomorrow, 11:30 AM – 12:15 PM', day: 'tomorrow', panel: 'Arjun Rao', mode: 'Google Meet', link: 'meet.google.com/mzb-karan', status: 'Confirmed' },
  { id: 'MI-703', candidateId: 'CN-1052', when: '9 Aug, 6:00 PM – 6:45 PM', day: 'later', panel: 'Arjun Rao', mode: 'Google Meet', link: 'meet.google.com/mzb-sahil', status: 'Awaiting confirmation' },
]

export const MOCK_COMPLETED = [
  { candidateId: 'CN-1048', date: '1 Aug 2026', panel: 'Rahul Verma', overall: 90, track: 'tech', grade: 'A' },
  { candidateId: 'CN-1053', date: '4 Aug 2026', panel: 'Arjun Rao', overall: 80, track: 'sales', grade: 'B' },
  { candidateId: 'CN-1047', date: '31 Jul 2026', panel: 'Arjun Rao', overall: 83, track: 'analytics', grade: 'B' },
  { candidateId: 'CN-1041', date: '30 Jul 2026', panel: 'Rahul Verma', overall: 81, track: 'analytics', grade: 'A' },
  { candidateId: 'CN-1045', date: '29 Jul 2026', panel: 'Rahul Verma', overall: 88, track: 'sales', grade: 'A' },
]

/* ------------------------------------------------------------------ */
/* Money                                                                */
/* ------------------------------------------------------------------ */

export const PAYMENTS = [
  { id: 'MZ-EMP-4201', party: 'Nimbus Retail Pvt Ltd', type: 'employer', desc: 'Customer Support Executive — 100 openings × ₹2,000', date: '22 Jul 2026', amount: 200000, status: 'paid' },
  { id: 'MZ-EMP-4188', party: 'Nimbus Retail Pvt Ltd', type: 'employer', desc: 'Digital Marketing Executive — 4 openings × ₹2,000', date: '19 Jul 2026', amount: 8000, status: 'paid' },
  { id: 'MZ-EMP-4233', party: 'Solace Technologies', type: 'employer', desc: 'Associate Product Analyst — 6 openings × ₹2,000', date: '30 Jul 2026', amount: 12000, status: 'paid' },
  { id: 'MZ-EMP-4240', party: 'Solace Technologies', type: 'employer', desc: 'Senior Backend Engineer — 2 openings × ₹2,000', date: '31 Jul 2026', amount: 4000, status: 'paid' },
  { id: 'MZ-EMP-4248', party: 'Kestrel Systems', type: 'employer', desc: 'Enterprise Sales Manager — 5 openings × ₹2,000', date: '1 Aug 2026', amount: 10000, status: 'paid' },
  { id: 'MZ-EMP-4256', party: 'Nimbus Retail Pvt Ltd', type: 'employer', desc: 'Warehouse Ops Associate — 50 openings × ₹2,000', date: '2 Aug 2026', amount: 100000, status: 'due' },
  { id: 'MZ-SUB-10688', party: 'Meghna Das', type: 'candidate', desc: 'Placement support programme — one-time', date: '4 Aug 2026', amount: 99, status: 'paid' },
  { id: 'MZ-SUB-10671', party: 'Yash Trivedi', type: 'candidate', desc: 'Placement support programme — one-time', date: '3 Aug 2026', amount: 99, status: 'paid' },
  { id: 'MZ-SUB-10659', party: 'Ritu Deshpande', type: 'candidate', desc: 'Placement support programme — one-time', date: '2 Aug 2026', amount: 99, status: 'paid' },
  { id: 'MZ-SUB-10640', party: 'Sahil Khanna', type: 'candidate', desc: 'Placement support programme — one-time', date: '1 Aug 2026', amount: 99, status: 'paid' },
]

export const REVENUE_TREND = [
  { label: 'Mar', value: 96000 },
  { label: 'Apr', value: 142000 },
  { label: 'May', value: 118000 },
  { label: 'Jun', value: 186000 },
  { label: 'Jul', value: 234000 },
  { label: 'Aug', value: 126000 },
]

/* ------------------------------------------------------------------ */
/* Derived operational numbers                                          */
/* ------------------------------------------------------------------ */

const paidCandidates = CANDIDATES.filter((c) => c.subscription.status === 'paid')
const pendingResumes = CANDIDATES.filter((c) => c.resume.status === 'pending')
const scheduledMocks = CANDIDATES.filter((c) => c.mock.status === 'scheduled')
const pendingCompanies = COMPANIES.filter((c) => c.status === 'pending')
const pendingJobs = JOB_POSTS.filter((j) => j.status === 'pending_review')

export const QUEUE_COUNTS = {
  resumes: pendingResumes.length,
  mocks: scheduledMocks.length,
  companies: pendingCompanies.length,
  jobs: pendingJobs.length,
  applications: APPLICATIONS.filter((a) => a.status === 'new').length,
}

export const OPS_KPIS = {
  candidates: { label: 'Registered candidates', value: CANDIDATES.length, delta: `${paidCandidates.length} subscribed` },
  resumeQueue: { label: 'Resumes to verify', value: pendingResumes.length, delta: 'Oldest waiting 2 days' },
  mockQueue: { label: 'Mock interviews due', value: scheduledMocks.length, delta: 'Next one today' },
  companyQueue: { label: 'Companies to verify', value: pendingCompanies.length, delta: `${COMPANIES.filter((c) => c.status === 'verified').length} verified so far` },
  openings: { label: 'Live openings', value: JOB_POSTS.filter((j) => ['live', 'sourcing', 'awaiting_payment'].includes(j.status)).reduce((n, j) => n + j.openings, 0), delta: `${JOB_POSTS.length} requirements` },
  applications: { label: 'Applications held', value: APPLICATIONS.length, delta: 'Employers see none of these' },
}

export const PIPELINE_FUNNEL = [
  { label: 'Registered', value: 1840 },
  { label: 'Subscribed ₹99', value: 1246 },
  { label: 'Resume verified', value: 812 },
  { label: 'Mock cleared', value: 604 },
  { label: 'Shared with employers', value: 388 },
  { label: 'Selected', value: 132 },
]

export const TRACK_SPLIT = [
  { label: 'Customer Success', value: 186 },
  { label: 'Sales & BD', value: 142 },
  { label: 'Analytics & Data', value: 118 },
  { label: 'Operations', value: 94 },
  { label: 'Engineering', value: 64 },
]

export const ACTIVITY = [
  { text: 'Resume verified — **Ritu Deshpande** (score 76). Track: Sales & BD', time: '40 min ago', tone: 'green' },
  { text: '**Nimbus Retail** paid ₹2,00,000 for 100 Customer Support openings', time: '2h ago', tone: 'gold' },
  { text: 'Batch **BT-501** dispatched — 500 resumes sent to Nimbus Retail', time: 'Today, 9:20 AM', tone: 'teal' },
  { text: '**Brightline Foods** submitted GST documents for verification', time: 'Yesterday', tone: 'navy' },
  { text: 'Mock interview completed — **Arjun Iyer** scored 90/100', time: '2 days ago', tone: 'green' },
  { text: '**Quickhire Staffing** rejected — third-party staffing reseller', time: '6 days ago', tone: 'red' },
]

export const NOTIFS_OPS = [
  { ic: 'FileText', tone: 'gold', title: '5 resumes awaiting verification', body: 'Oldest in queue: Vikram Rao, waiting 2 days.', time: '20 min ago', unread: true, cat: 'resumes' },
  { ic: 'Building2', tone: 'navy', title: 'New company registration — Vertex Logistics', body: 'Chennai · Logistics · 201–500 employees. Documents pending.', time: '1h ago', unread: true, cat: 'companies' },
  { ic: 'CreditCard', tone: 'gold', title: 'Payment due — Nimbus Retail', body: '₹1,00,000 for 50 Warehouse Ops openings. Sourcing is on hold.', time: '3h ago', unread: true, cat: 'payments' },
  { ic: 'Send', tone: 'green', title: 'Batch BT-505 ready to dispatch', body: '10 resumes locked for Solace Technologies — Senior Backend Engineer.', time: 'Today, 8:05 AM', unread: false, cat: 'batches' },
  { ic: 'Video', tone: 'navy', title: 'Mock interview at 3:00 PM', body: 'Divya Menon with Rahul Verma via Google Meet.', time: 'Yesterday', unread: false, cat: 'interviews' },
]
