import {
  Target,
  Settings,
  Sparkles,
  BarChart3,
  Lightbulb,
  BarChart2,
  Rocket,
  ShieldCheck,
  Briefcase,
  Users2,
  Wallet,
  RefreshCw,
  TrendingUp,
  Cpu,
  Server,
  GraduationCap,
  CheckCircle2
} from 'lucide-react'
import { CONTACT_ADDRESS, CONTACT_EMAIL, CONTACT_PHONE } from './config'

export const NAV_LINKS = [
  { label: 'Home', href: '#home', to: '/' },
  { label: 'Who We Are', href: '#who-we-are', to: '/about' },
  { label: 'Employers', to: '/employers' },
  { label: 'Employees', to: '/employees' },
]

export const HERO_DATA = {
  titleLine1: "Hiring, Built",
  titleItalic: "Right From",
  titleLine2: "Both Sides.",
  subtitle: "Mzobs connects verified job seekers with employers who need them — every profile and every requirement checked by a real person before it goes live.",
  ctaText: "Get Started",
  bgImage: "/images/hero-bg.jpg",
  rotatingPrefix: "It's time to",
  rotatingWords: ["Get Hired!", "Hire Smarter!", "Get Verified!", "Grow!", "Build Your Team!"],
  searchPlaceholder: "Search jobs, roles or companies"
}

export const WHO_WE_ARE_DATA = {
  badge: "WHO WE ARE",
  heroTitleLine1: "Built On Trust,",
  heroTitleLine2: "Made For Both Sides.",
  heroSubtitle: "Every profile checked, every pipeline refined — a hiring platform where job seekers find roles they're right for, and employers find people worth hiring.",
  stats: [
    {
      number: "12,400+",
      label: "Job seeker profiles verified and rebuilt by our operations team."
    },
    {
      number: "340+",
      label: "Companies actively hiring qualified candidates through Mzobs."
    },
    {
      number: "3,180+",
      label: "Interviews arranged between verified candidates and employers."
    },
    {
      number: "96%",
      label: "Of candidates and employers would recommend Mzobs to others."
    }
  ]
}

export const SERVICES_DATA = {
  badge: "WHAT WE OFFER",
  titlePrefix: "Our ",
  titleItalic: "Platform",
  services: [
    {
      icon: Target,
      title: "Verified Candidate Pipeline",
      desc: "Every profile is screened and resume-checked by our team before it reaches an employer.",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=85"
    },
    {
      icon: Settings,
      title: "Guided Job Matching",
      desc: "Curated openings filtered to your track — no scrolling through noise.",
      image: "https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=800&q=85"
    },
    {
      icon: Sparkles,
      title: "Structured Interviews",
      desc: "Schedule, track and score interviews from one shared pipeline.",
      image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=800&q=85"
    },
    {
      icon: BarChart3,
      title: "Offer & Hiring Analytics",
      desc: "Track offers, acceptance and time-to-fill with full visibility.",
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=85"
    }
  ],
  featuredCard: {
    titlePrefix: "Start Your ",
    titleItalic: "Hiring Journey",
    ctaText: "Get In Touch",
    bgImage: "/images/new_images/featured_card.jpg"
  }
}

export const CASE_STUDIES_DATA = {
  badge: "SUCCESS STORIES",
  titlePrefix: "Real ",
  titleItalic: "Placements",
  titleSuffix: " On Both Sides",
  items: [
    {
      id: "razorpay-placement",
      tags: ["FOR EMPLOYEES", "PLACED IN 3 WEEKS"],
      title: "Helped a job seeker land a Business Analyst offer at Razorpay.",
      italicWords: "land a Business Analyst offer",
      desc: "Mzobs rebuilt their resume, ran two weeks of guided training and mock interviews, and matched them to a role they were actually qualified for.",
      bgImage: "/images/new_images/story_razorpay.jpg"
    },
    {
      id: "solace-technologies",
      tags: ["FOR EMPLOYERS", "TIME-TO-OFFER CUT IN HALF"],
      title: "Solace Technologies Cut Time-To-Offer By Half",
      italicWords: null,
      desc: "By sending only pre-verified, screened candidates into their pipeline, Mzobs helped Solace Technologies stop sifting resumes that went nowhere and start interviewing candidates worth their time.",
      bgImage: "/images/new_images/story_solace.jpg"
    },
    {
      id: "batch-hiring",
      tags: ["FOR EMPLOYERS", "BATCH HIRING"],
      title: "Filling Dozens of Roles At Once With Verified Talent",
      italicWords: "Verified Talent",
      desc: "A growing company used Mzobs to fill an entire team of open roles in one hiring cycle, with every candidate matched to the requirement instead of keyword-searched.",
      bgImage: "/images/new_images/story_batch.jpg"
    }
  ]
}

export const COMPANY_WORKFLOW_DATA = {
  badge: "FOR EMPLOYERS",
  titlePrefix: "How Companies ",
  titleItalic: "Hire",
  titleSuffix: " On Mzobs",
  subtitle: "One workflow, from open requirement to signed offer — with every candidate verified before they reach you.",
  steps: [
    {
      num: "01",
      icon: Briefcase,
      title: "Post The Requirement",
      desc: "Share the role, must-have skills and budget — live in minutes, not weeks.",
      bg: "#cfe8fb",
      accent: "#2563eb"
    },
    {
      num: "02",
      icon: ShieldCheck,
      title: "We Screen & Verify",
      desc: "Every applicant is manually reviewed and verified before reaching your pipeline.",
      bg: "#cdeec5",
      accent: "#16a34a"
    },
    {
      num: "03",
      icon: Users2,
      title: "Interview Shortlisted Talent",
      desc: "Meet only candidates matched to your requirement — no resume pile to dig through.",
      bg: "#ffe2b0",
      accent: "#d97706"
    },
    {
      num: "04",
      icon: CheckCircle2,
      title: "Extend & Track Offers",
      desc: "Issue offers and track acceptance status from one shared dashboard.",
      bg: "#ffd0de",
      accent: "#db2777"
    },
    {
      num: "05",
      icon: TrendingUp,
      title: "Onboard & Scale Hiring",
      desc: "Bring hires onboard, then reuse the same workflow for every open role.",
      bg: "#e3d5fb",
      accent: "#7c3aed"
    }
  ]
}

export const FAQ_DATA = {
  badge: "FAQS",
  titlePrefix: "Questions, ",
  titleItalic: "Answered",
  titleSuffix: "",
  subtitle: "Everything you need to know about hiring and getting hired on Mzobs.",
  items: [
    {
      q: "What is Mzobs?",
      a: "Mzobs is a hiring platform that verifies both sides of the match — job seekers get their resume rebuilt and screened, and employers only see candidates who are pre-verified against their requirement."
    },
    {
      q: "Is Mzobs free for job seekers?",
      a: "Yes. Creating a profile, applying to roles and getting matched is free for job seekers. We only charge employers for successful placements."
    },
    {
      q: "How does candidate verification work?",
      a: "Every applicant is manually reviewed by our team — we check their experience, rebuild their resume where needed, and run them through structured interviews before they're matched to any requirement."
    },
    {
      q: "How long does it take to fill a role?",
      a: "Most employers start receiving verified, matched candidates within days of posting a requirement, and see time-to-offer drop significantly since every candidate is already screened."
    },
    {
      q: "What roles and industries does Mzobs cover?",
      a: "From entry-level to leadership hiring across tech, operations, sales, finance and more — browse open categories on the Find Your Team section or share your requirement directly."
    },
    {
      q: "How do I get started as an employer?",
      a: "Sign up on the Employers page and post your requirement — our team verifies it and starts matching candidates from your very first job post."
    }
  ]
}

export const TESTIMONIALS_DATA = {
  badge: "TESTIMONIALS",
  titlePrefix: "What ",
  titleItalic: "Our People",
  titleSuffix: " Say",
  items: [
    {
      id: 1,
      image: "/images/new_images/testimonial_rohit.jpg",
      quote: "Mzobs didn't just help me find a job — my resume was rebuilt by an expert, I trained for two weeks, and I walked into my interview actually prepared.",
      name: "Rohit Kulkarni",
      title: "Placed as Business Analyst, Razorpay"
    },
    {
      id: 2,
      image: "/images/new_images/testimonial_rhea.jpg",
      quote: "We used to spend weeks sifting resumes that went nowhere. With Mzobs, every candidate we interview is already pre-verified.",
      name: "Rhea Kapoor",
      title: "Head of Talent, Solace Technologies"
    },
    {
      id: 3,
      image: "/images/new_images/testimonial_anna.jpg",
      quote: "Guided training and real mock interviews made the difference. I finally applied to roles I was actually qualified for.",
      name: "Anna White",
      title: "Placed as Product Analyst, Nexa Group"
    },
    {
      id: 4,
      image: "/images/new_images/testimonial_mario.jpg",
      quote: "Our time-to-offer dropped by more than half once every candidate arrived pre-screened and ready to interview.",
      name: "Mario Fotiou",
      title: "Talent Lead, Constructo"
    },
    {
      id: 5,
      image: "/images/new_images/testimonial_john.jpg",
      quote: "One dashboard for every application, interview and offer status — I always knew exactly where I stood.",
      name: "John Smith",
      title: "Placed as Software Engineer, Innovate"
    }
  ]
}

export const OUR_GOAL_DATA = {
  badge: "OUR MISSION",
  titlePrefix: "Turning ",
  titleItalic: "Hiring",
  titleSuffix: " Into A Fair Match",
  desc: "Mzobs started because hiring was broken on both sides — job seekers were applying into a void, and employers were drowning in unscreened resumes. Our team brings together operations, recruiting and product expertise with one shared mission: verify every profile and every requirement before it reaches the other side, so both sides get a faster, better hire.",
  ctaText: "Meet Our Team",
  image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=85"
}

export const OUR_STORY_DATA = {
  badge: "OUR STORY",
  titlePrefix: "How Mzobs ",
  titleItalic: "Started",
  titleSuffix: "",
  desc: "Mzobs started because hiring was broken on both sides — job seekers were applying into a void, and employers were drowning in unscreened resumes. We started as a small placement team rebuilding resumes by hand, and grew into a platform that verifies every profile and every requirement before it reaches the other side.",
  ctaText: "Get in touch",
  ctaHref: `mailto:${CONTACT_EMAIL}`,
  image: "/images/new_images/approach.jpg"
}

export const APPROACH_DATA = {
  badge: "OUR APPROACH",
  heading: [
    { text: "At Mzobs, we believe " },
    { text: "hiring", italic: true },
    { text: " should do more than " },
    { text: "collect resumes", italic: true },
    { text: " — it should drive a " },
    { text: "real, verified", italic: true },
    { text: " match." }
  ],
  image: "https://images.unsplash.com/photo-1553877522-43269d4ea984?auto=format&fit=crop&w=1200&q=85",
  steps: [
    {
      num: "01",
      icon: Lightbulb,
      title: "Create Your Profile",
      desc: "Job seekers sign up and tell us their target role; employers share their hiring requirement.",
      image: "/images/new_images/step_01.jpg"
    },
    {
      num: "02",
      icon: BarChart2,
      title: "Get Verified",
      desc: "Our team reviews and rebuilds every resume, and screens every candidate before they're matched.",
      image: "/images/new_images/step_02.jpg"
    },
    {
      num: "03",
      icon: Rocket,
      title: "Match & Interview",
      desc: "Verified candidates and open roles are matched, then run through structured interviews.",
      image: "/images/new_images/step_03.jpg"
    },
    {
      num: "04",
      icon: Target,
      title: "Hire & Get Placed",
      desc: "Offers are issued, accepted and tracked — from first application to signed offer.",
      image: "/images/new_images/step_04.jpg"
    }
  ]
}

export const EMPLOYEE_GOAL_DATA = {
  titlePrefix: "We're Not Another ",
  titleItalic: "Job Board",
  titleSuffix: " — We're Your Placement Team",
  desc: "Most platforms hand you a search bar and wish you luck. Mzobs assigns your resume to a real recruiter, runs you through mock interviews, and only puts you in front of employers hiring for roles you're actually qualified for.",
  ctaText: "See Your Journey",
  ctaHref: "#candidate-journey",
  image: "/images/new_images/employee_goal.jpg"
}

export const EMPLOYEE_APPROACH_DATA = {
  heading: [
    { text: "Getting hired shouldn't feel like " },
    { text: "guesswork", italic: true },
    { text: " — we build your resume, coach your interviews, and match you to roles that actually fit." }
  ],
  image: "/images/new_images/employee_approach.jpg",
  steps: [
    {
      num: "01",
      icon: ShieldCheck,
      title: "Verified Employer Network",
      desc: "Every company on Mzobs is vetted before their openings go live — no fake listings, no ghost jobs."
    },
    {
      num: "02",
      icon: Sparkles,
      title: "1:1 Resume & Interview Coaching",
      desc: "A real recruiter rebuilds your resume and runs you through mock interviews before you meet an employer."
    },
    {
      num: "03",
      icon: Target,
      title: "Matched, Not Searched",
      desc: "We match you to roles based on your verified skills — you stop scrolling job boards that go nowhere."
    },
    {
      num: "04",
      icon: TrendingUp,
      title: "Support After You're Hired",
      desc: "Our team stays in touch through your first month to make sure the placement actually works out."
    }
  ]
}

export const TRUSTED_LOGOS_DATA = {
  badge: "WHO HIRES ON MZOBS",
  title: "Companies Hiring On Mzobs",
  logos: [
    { name: "Logoipsum", variant: 1 },
    { name: "logo ipsum", variant: 2 },
    { name: "LOGOIPSUM", variant: 3 },
    { name: "logoipsum", variant: 4 },
    { name: "LOGOIPSUM", variant: 5 },
    { name: "logoipsum", variant: 6 },
    { name: "logoipsum", variant: 7 },
    { name: "Logoipsum", variant: 8 }
  ]
}

export const CATEGORY_DATA = {
  badge: "BROWSE OPENINGS",
  titlePrefix: "Find Your ",
  titleItalic: "Team",
  titleSuffix: "",
  subtitle: "Every role on Mzobs is tagged and verified by category — jump straight to the openings that match what you do.",
  categories: [
    { icon: TrendingUp, title: "Sales & Distribution", image: "/images/new_images/cat_sales.jpg" },
    { icon: Cpu, title: "Engineering & Technology", image: "/images/new_images/cat_engineering.jpg" },
    { icon: Server, title: "IT & Systems", image: "/images/new_images/cat_it.jpg" },
    { icon: GraduationCap, title: "HR & Training", image: "/images/new_images/cat_hr.jpg" },
    { icon: Wallet, title: "Finance & Accounting", image: "/images/new_images/cat_finance.jpg" },
    { icon: Settings, title: "Operations", image: "/images/new_images/cat_ops.jpg" }
  ]
}

export const CTA_BAND_DATA = {
  titlePrefix: "Ready To ",
  titleItalic: "Get Hired",
  titleSuffix: " Or Hire Faster?",
  desc: "Whichever side of hiring you're on, Mzobs verifies it before it goes live. Create a free account or reach out to our team to get started.",
  ctaText: "Get Started Today",
  bgImage: "/images/new_images/cta_band.jpg"
}

export const FOOTER_DATA = {
  logoSub: "HIRING PLATFORM",
  desc: "Mzobs connects verified job seekers with employers who need them — every profile and every requirement reviewed by a real person before it goes live.",
  ctaText: "Contact Us",
  menuTitle: "Menu",
  menuItems: [
    { label: "Home", to: "/" },
    { label: "Services", to: "/#services" },
    { label: "Who We Are", to: "/about" },
    { label: "Contact", to: "/contact" },
  ],
  socialsTitle: "Socials",
  socialsItems: ["Instagram", "Facebook", "LinkedIn", "Twitter (X)"],
  contactTitle: "Contact",
  phone: CONTACT_PHONE,
  email: CONTACT_EMAIL,
  address: CONTACT_ADDRESS,
  copyright: "© 2026 Mzobs. All rights reserved.",
  rightLinks: [
    { label: "Privacy Policy", to: "/privacy-policy" },
    { label: "Terms of Service", to: "/terms-of-service" },
  ]
}

export const PRICING_DATA = {
  badge: "PRICING",
  titlePrefix: "Simple, ",
  titleItalic: "Transparent",
  titleSuffix: " Pricing For Every Company",
  subtitle: "Whether you're a Tier 1 enterprise or a startup making your first hire, Mzobs has a model built for how you scale.",
  tier1: {
    kicker: "FOR TIER 1 COMPANIES",
    title: "Revenue Model Overview",
    subtitle: "Multiple income streams driving sustainable growth",
    chartLabel: "Total Monthly Revenue Mix (Illustrative)",
    segments: [
      {
        icon: Users2,
        title: "Candidate Subscriptions",
        percent: 37,
        color: "var(--color-navy)",
        desc: "Affordable revenue from candidate subscription/registration."
      },
      {
        icon: Briefcase,
        title: "Placement Fees",
        percent: 63,
        color: "var(--color-gold-dot)",
        desc: "Performance-based revenue from successful placements."
      }
    ],
    takeaways: [
      "Balanced revenue model with recurring + performance-based income.",
      "Low upfront cost for employers drives higher adoption.",
      "Scalable model with higher revenue potential as placements grow."
    ],
    steps: [
      { n: "01", title: "Candidates subscribe monthly", desc: "For job access and career support." },
      { n: "02", title: "Employers get hiring support", desc: "For up to 10 candidates." },
      { n: "03", title: "Beyond 10 successful hires", desc: "10% of first-month salary is applicable." },
      { n: "04", title: "Success fee is charged", desc: "Only after the employee completes one month." }
    ]
  },
  startup: {
    kicker: "REVENUE MODEL",
    title: "For Startups & Tier 3 Companies",
    subtitle: "Affordable to start. Easy to scale.",
    plan: {
      icon: Wallet,
      badge: "START & SCALE PLAN",
      price: "₹999",
      priceNote: "One-time",
      includes: "Hire up to 10 candidates",
      perks: ["No upfront placement commission", "Pay only for additional hires"]
    },
    addon: {
      icon: RefreshCw,
      badge: "RECHARGE ADD-ON",
      kicker: "Use our affordable Recharge Add-on",
      price: "₹499",
      priceNote: "Add-on",
      hireCount: "5",
      hireLabel: "candidates",
      perks: ["Pay only when you need more", "Keep scaling, keep saving"]
    },
    takeaways: [
      "Affordable entry with ₹999 for first 10 hires.",
      "Recharge with ₹499 to hire 5 more candidates.",
      "No upfront commission — pay only when you hire more.",
      "Designed for startups & Tier 3 companies to scale affordably."
    ],
    stats: [
      { value: "10", label: "Hires Included (₹999)" },
      { value: "+5", label: "Hires per Add-on (₹499)" },
      { value: "Unlimited", label: "Add-ons, Unlimited Growth" }
    ],
    steps: [
      { n: "01", title: "Pay ₹999", desc: "One-time and get hiring support for up to 10 candidates." },
      { n: "02", title: "Hire candidates", desc: "With our end-to-end support." },
      { n: "03", title: "Need to hire more?", desc: "Recharge with ₹499 to hire 5 more candidates." },
      { n: "04", title: "Continue recharging", desc: "As you grow. Pay only for what you use." }
    ]
  },
  keyTakeawayIcon: TrendingUp,
  ctaText: "Talk To Our Team",
  ctaHref: "/contact"
}

// Dedicated features data for Employees & Employers
export const EMPLOYEE_FEATURES = [
  {
    icon: Target,
    title: "Lifetime Platform Access",
    desc: "One-time ₹99 subscription gives you lifetime access to profile matching, resume reviews, and placement tools.",
    image: "/images/new_images/emp_feature_1.jpg"
  },
  {
    icon: Settings,
    title: "Expert Resume Verification",
    desc: "Our recruitment experts review and structure your resume to ensure it highlights your core strengths to employers.",
    image: "/images/new_images/emp_feature_2.jpg"
  },
  {
    icon: Sparkles,
    title: "Mock Interview Practice",
    desc: "Train with real mock interview sessions and receive actionable feedback before meeting actual hiring managers.",
    image: "/images/new_images/emp_feature_3.jpg"
  },
  {
    icon: BarChart3,
    title: "Smart Skill Categorisation",
    desc: "Your profile is categorized based on your technical and soft skills to match you with relevant hiring opportunities.",
    image: "/images/new_images/emp_feature_4.jpg"
  }
]

export const EMPLOYER_FEATURES = [
  {
    icon: ShieldCheck,
    title: "Pre-Screened Candidates",
    desc: "Receive candidates whose resumes, skills, and background have been verified by our operations team.",
    image: "/images/new_images/employer_feature_1.jpg"
  },
  {
    icon: Briefcase,
    title: "Single Hiring Dashboard",
    desc: "Manage open requisitions, candidate profiles, interview schedules, and offer letters from one portal.",
    image: "/images/new_images/employer_feature_2.jpg"
  },
  {
    icon: Users2,
    title: "Batch Hiring & Scalability",
    desc: "Easily scale your hiring needs from individual niche roles to full batch recruitment cycles effortlessly.",
    image: "/images/new_images/employer_feature_3.jpg"
  },
  {
    icon: TrendingUp,
    title: "Faster Time-to-Offer",
    desc: "Cut your hiring timeline in half by skipping unqualified resume stacks and interviewing ready candidates.",
    image: "/images/new_images/employer_feature_4.jpg"
  }
]
export const HOME_STATS = WHO_WE_ARE_DATA.stats.map(s => ({ display: s.number, label: s.label }))
export const EMPLOYEE_STATS = HOME_STATS
export const EMPLOYER_STATS = HOME_STATS
export const HOME_FEATURES = SERVICES_DATA.services
export const HOME_STEPS = APPROACH_DATA.steps
export const EMPLOYEE_STEPS = APPROACH_DATA.steps
export const EMPLOYER_STEPS = APPROACH_DATA.steps
export const TEAM = [
  { name: 'Ananya Rao', role: 'Founder & CEO', initials: 'AR', image: '/images/new_images/team_ananya.jpg' },
  { name: 'Vikram Shetty', role: 'Head of Operations', initials: 'VS', image: '/images/new_images/team_vikram.jpg' },
  { name: 'Priya Menon', role: 'Head of Talent', initials: 'PM', image: '/images/new_images/team_priya.jpg' },
  { name: 'Karan Malhotra', role: 'Head of Verification', initials: 'KM', image: '/images/new_images/team_karan.jpg' }
]
export const TRUSTED_LOGOS = TRUSTED_LOGOS_DATA.logos.map(l => l.name)
export const EMPLOYER_TESTIMONIAL = TESTIMONIALS_DATA.items[1]
export const HOME_TESTIMONIALS = TESTIMONIALS_DATA.items
export const EMPLOYEE_TESTIMONIALS = [TESTIMONIALS_DATA.items[0], TESTIMONIALS_DATA.items[2], TESTIMONIALS_DATA.items[4]]
export const GALLERY_IMAGES = [
  "/images/new_images/galleria_1.jpg",
  "/images/new_images/galleria_2.jpg",
  "/images/new_images/galleria_3.jpg",
  "/images/new_images/galleria_4.jpg",
  "/images/new_images/galleria_5_fix.jpg",
  "/images/new_images/galleria_6.jpg",
  "/images/new_images/galleria_7.jpg",
  "/images/new_images/galleria_8.jpg"
]
