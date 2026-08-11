import {
  Briefcase,
  CalendarCheck2,
  CheckCircle2,
  ClipboardList,
  FileCheck2,
  FileText,
  GraduationCap,
  Headphones,
  ListChecks,
  ShieldCheck,
  Target,
  Trophy,
  UserPlus,
  Users2,
  Video,
} from 'lucide-react'

export const NAV_LINKS = [
  { label: 'Home', to: '/' },
  { label: 'About Us', to: '/about' },
  { label: 'Employees', to: '/employees' },
  { label: 'Employers', to: '/employers' },
]

// ---- Stats -----------------------------------------------------------
export const HOME_STATS = [
  { value: 12400, suffix: '+', label: 'Verified job seekers' },
  { value: 340, suffix: '+', label: 'Companies hiring' },
  { value: 96, suffix: '%', label: 'Would recommend Mzobs' },
  { display: '18 days', label: 'Avg. time to offer' },
]

export const EMPLOYEE_STATS = [
  { value: 12400, suffix: '+', label: 'Profiles verified' },
  { value: 3180, suffix: '+', label: 'Interviews arranged' },
  { value: 96, suffix: '%', label: 'Would recommend' },
]

export const EMPLOYER_STATS = [
  { display: '12,400+', label: 'Verified candidates' },
  { display: '340+', label: 'Companies hiring' },
  { display: '18 days', label: 'Avg. time to offer' },
]

// ---- Feature grids -----------------------------------------------------
export const HOME_FEATURES = [
  { icon: ShieldCheck, title: 'Verified Profiles', desc: 'Every job seeker and every company is screened by our team before they meet each other.' },
  { icon: Target, title: 'Fast Matching', desc: 'Curated matches on both sides — no keyword-stuffed noise to dig through.' },
  { icon: CalendarCheck2, title: 'Structured Interviews', desc: 'One shared pipeline to schedule, track and score every interview.' },
  { icon: Headphones, title: 'Dedicated Support', desc: 'A real operations team behind every profile, every requirement, every hire.' },
]

export const EMPLOYEE_FEATURES = [
  { icon: FileText, title: 'Resume Center', desc: 'Your resume rebuilt and reviewed by placement experts, not a template generator.' },
  { icon: ListChecks, title: 'Skill Assessment', desc: 'Benchmark yourself against the exact requirements employers screen for.' },
  { icon: Video, title: 'Mock Interviews', desc: 'Practice with real interviewers so the actual one feels like a formality.' },
  { icon: Briefcase, title: 'Job Matching', desc: 'Curated openings filtered to your track — no scrolling through noise.' },
]

export const EMPLOYER_FEATURES = [
  { icon: Users2, title: 'Verified Candidate Pipeline', desc: 'Every profile is screened and resume-checked by our operations team before it reaches you.' },
  { icon: Briefcase, title: 'Batch Hiring', desc: 'Fill dozens of roles at once with candidates matched to your requirement, not keyword-searched.' },
  { icon: CalendarCheck2, title: 'Structured Interviews', desc: 'Schedule, track and score interviews from one pipeline — no spreadsheets, no lost feedback.' },
  { icon: FileCheck2, title: 'Offer Management', desc: 'Issue, track and manage offers with full visibility into acceptance and onboarding status.' },
]

// ---- Approach / how-it-works steps -------------------------------------
export const HOME_STEPS = [
  { n: '01', icon: UserPlus, title: 'Sign Up', desc: 'Create a profile as a job seeker, or list your company as a hiring employer.' },
  { n: '02', icon: ShieldCheck, title: 'Get Verified', desc: 'Our operations team reviews and verifies every profile and every requirement.' },
  { n: '03', icon: Target, title: 'Get Matched', desc: 'Job seekers are matched to roles; employers are matched to screened candidates.' },
  { n: '04', icon: Trophy, title: 'Succeed', desc: 'Land the offer, or make the hire — with support until it is signed.' },
]

export const EMPLOYEE_STEPS = [
  { n: '01', icon: UserPlus, title: 'Create your profile', desc: 'Sign up and tell us your target role, experience and availability.' },
  { n: '02', icon: ShieldCheck, title: 'Get verified', desc: 'Our team reviews and rebuilds your resume so it clears the first screen.' },
  { n: '03', icon: GraduationCap, title: 'Train & practice', desc: 'Work through your track and sit mock interviews with real feedback.' },
  { n: '04', icon: CheckCircle2, title: 'Get placed', desc: 'Apply to matched openings and track every interview to offer.' },
]

export const EMPLOYER_STEPS = [
  { n: '01', icon: ClipboardList, title: 'Share your requirement', desc: 'Tell us the role, seniority and skills you need — we take it from there.' },
  { n: '02', icon: Users2, title: 'Review verified candidates', desc: 'Receive a shortlist that has already cleared our screening and resume review.' },
  { n: '03', icon: CalendarCheck2, title: 'Interview & decide', desc: 'Run structured interviews and track feedback in one shared pipeline.' },
  { n: '04', icon: FileCheck2, title: 'Extend the offer', desc: 'Manage the offer, acceptance and onboarding handoff without leaving the portal.' },
]

// ---- Testimonials --------------------------------------------------------
export const EMPLOYEE_TESTIMONIAL = {
  quote:
    "Mzobs didn't just help me find a job — my resume was rebuilt by an expert, I trained for two weeks, and I walked into my interview actually prepared.",
  name: 'Rohit Kulkarni',
  role: 'Placed as Business Analyst, Razorpay',
  initials: 'RK',
}

export const EMPLOYER_TESTIMONIAL = {
  quote:
    'We used to spend weeks sifting resumes that went nowhere. With Mzobs, every candidate we interview is already pre-verified — our time-to-offer dropped by more than half.',
  name: 'Rhea Kapoor',
  role: 'Head of Talent, Solace Technologies',
  initials: 'RK',
}

export const HOME_TESTIMONIALS = [
  EMPLOYEE_TESTIMONIAL,
  EMPLOYER_TESTIMONIAL,
  {
    quote: 'What stood out was how fast everything moved once we were verified — from first call to signed offer took less than three weeks.',
    name: 'Ananya Iyer',
    role: 'Placed as Product Designer, BluePeak',
    initials: 'AI',
  },
]

// ---- About page ------------------------------------------------------
export const TEAM = [
  { name: 'Ishaan Verma', role: 'Co-Founder & CEO', initials: 'IV' },
  { name: 'Priya Nair', role: 'Co-Founder & Head of Operations', initials: 'PN' },
  { name: 'Arjun Malhotra', role: 'Head of Candidate Success', initials: 'AM' },
  { name: 'Sana Sheikh', role: 'Head of Employer Partnerships', initials: 'SS' },
]

// Placeholder wordmarks — swap for real client logos (SVGs) when available.
export const TRUSTED_LOGOS = ['Northwind Labs', 'Solace Technologies', 'BluePeak', 'Corewave', 'Ferrovia', 'Lumen Analytics', 'Vertex Systems', 'Anchorpoint']
