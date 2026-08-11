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
  TrendingUp
} from 'lucide-react'
import { CONTACT_ADDRESS, CONTACT_EMAIL, CONTACT_PHONE } from './config'

export const NAV_LINKS = [
  { label: 'Home', href: '#home', to: '/' },
  { label: 'Who We Are', href: '#who-we-are', to: '/about' },
  { label: 'Employers', to: '/employers' },
  { label: 'Employees', to: '/employees' },
  { label: 'Job Opening', href: '#', to: null },
]

export const HERO_DATA = {
  titleLine1: "Hiring, Built",
  titleItalic: "Right From",
  titleLine2: "Both Sides.",
  subtitle: "Mzobs connects verified job seekers with employers who need them — every profile and every requirement checked by a real person before it goes live.",
  ctaText: "Get Started",
  bgImage: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&w=2000&q=85"
}

export const WHO_WE_ARE_DATA = {
  badge: "WHO WE ARE",
  statement: [
    { text: "Mzobs is a " },
    { text: "people-first", italic: true },
    { text: " hiring platform " },
    { text: "helping", italic: true },
    { text: " job seekers " },
    { text: "navigate", italic: true },
    { text: " to roles they qualify for, and helping employers " },
    { text: "refine", italic: true },
    { text: " their pipelines down to candidates worth their time — so both sides " },
    { text: "achieve", italic: true },
    { text: " a faster, better hire." }
  ],
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
      image: "/images/services/service-pipeline.jpg"
    },
    {
      icon: Settings,
      title: "Guided Job Matching",
      desc: "Curated openings filtered to your track — no scrolling through noise.",
      image: "/images/services/service-matching.jpg"
    },
    {
      icon: Sparkles,
      title: "Structured Interviews",
      desc: "Schedule, track and score interviews from one shared pipeline.",
      image: "/images/services/service-interviews.jpg"
    },
    {
      icon: BarChart3,
      title: "Offer & Hiring Analytics",
      desc: "Track offers, acceptance and time-to-fill with full visibility.",
      image: "/images/services/service-analytics.jpg"
    }
  ],
  featuredCard: {
    titlePrefix: "Start Your ",
    titleItalic: "Hiring Journey",
    ctaText: "Get In Touch",
    bgImage: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=1200&q=85"
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
      bgImage: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1600&q=85"
    },
    {
      id: "solace-technologies",
      tags: ["FOR EMPLOYERS", "TIME-TO-OFFER CUT IN HALF"],
      title: "Solace Technologies Cut Time-To-Offer By Half",
      italicWords: null,
      desc: "By sending only pre-verified, screened candidates into their pipeline, Mzobs helped Solace Technologies stop sifting resumes that went nowhere and start interviewing candidates worth their time.",
      bgImage: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1600&q=85"
    },
    {
      id: "batch-hiring",
      tags: ["FOR EMPLOYERS", "BATCH HIRING"],
      title: "Filling Dozens of Roles At Once With Verified Talent",
      italicWords: "Verified Talent",
      desc: "A growing company used Mzobs to fill an entire team of open roles in one hiring cycle, with every candidate matched to the requirement instead of keyword-searched.",
      bgImage: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1600&q=85"
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
      image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=800&q=85",
      quote: "Mzobs didn't just help me find a job — my resume was rebuilt by an expert, I trained for two weeks, and I walked into my interview actually prepared.",
      name: "Rohit Kulkarni",
      title: "Placed as Business Analyst, Razorpay"
    },
    {
      id: 2,
      image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=800&q=85",
      quote: "We used to spend weeks sifting resumes that went nowhere. With Mzobs, every candidate we interview is already pre-verified.",
      name: "Rhea Kapoor",
      title: "Head of Talent, Solace Technologies"
    },
    {
      id: 3,
      image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=800&q=85",
      quote: "Guided training and real mock interviews made the difference. I finally applied to roles I was actually qualified for.",
      name: "Anna White",
      title: "Placed as Product Analyst, Nexa Group"
    },
    {
      id: 4,
      image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=800&q=85",
      quote: "Our time-to-offer dropped by more than half once every candidate arrived pre-screened and ready to interview.",
      name: "Mario Fotiou",
      title: "Talent Lead, Constructo"
    },
    {
      id: 5,
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=85",
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
  image: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=1200&q=85"
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
  image: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1200&q=85",
  steps: [
    {
      num: "01",
      icon: Lightbulb,
      title: "Create Your Profile",
      desc: "Job seekers sign up and tell us their target role; employers share their hiring requirement."
    },
    {
      num: "02",
      icon: BarChart2,
      title: "Get Verified",
      desc: "Our team reviews and rebuilds every resume, and screens every candidate before they're matched."
    },
    {
      num: "03",
      icon: Rocket,
      title: "Match & Interview",
      desc: "Verified candidates and open roles are matched, then run through structured interviews."
    },
    {
      num: "04",
      icon: Target,
      title: "Hire & Get Placed",
      desc: "Offers are issued, accepted and tracked — from first application to signed offer."
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

export const CTA_BAND_DATA = {
  titlePrefix: "Ready To ",
  titleItalic: "Get Hired",
  titleSuffix: " Or Hire Faster?",
  desc: "Whichever side of hiring you're on, Mzobs verifies it before it goes live. Create a free account or reach out to our team to get started.",
  ctaText: "Get Started Today",
  bgImage: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=2000&q=85"
}

export const FOOTER_DATA = {
  logoText: "Mzobs",
  logoSub: "HIRING PLATFORM",
  desc: "Mzobs connects verified job seekers with employers who need them — every profile and every requirement reviewed by a real person before it goes live.",
  ctaText: "Contact Us",
  menuTitle: "Menu",
  menuItems: ["Home", "Services", "Who We Are", "Case Studies", "Testimonials", "Contact"],
  socialsTitle: "Socials",
  socialsItems: ["Instagram", "Facebook", "LinkedIn", "Twitter (X)"],
  contactTitle: "Contact",
  phone: CONTACT_PHONE,
  email: CONTACT_EMAIL,
  address: CONTACT_ADDRESS,
  copyright: "© 2026 Mzobs. All rights reserved.",
  rightLinks: ["Privacy Policy", "Terms of Service"]
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

// Legacy exports compatibility
export const HOME_STATS = WHO_WE_ARE_DATA.stats.map(s => ({ display: s.number, label: s.label }))
export const EMPLOYEE_STATS = HOME_STATS
export const EMPLOYER_STATS = HOME_STATS
export const HOME_FEATURES = SERVICES_DATA.services
export const EMPLOYEE_FEATURES = SERVICES_DATA.services
export const EMPLOYER_FEATURES = SERVICES_DATA.services
export const HOME_STEPS = APPROACH_DATA.steps
export const EMPLOYEE_STEPS = APPROACH_DATA.steps
export const EMPLOYER_STEPS = APPROACH_DATA.steps
export const TEAM = [
  { name: 'Ananya Rao', role: 'Founder & CEO', initials: 'AR' },
  { name: 'Vikram Shetty', role: 'Head of Operations', initials: 'VS' },
  { name: 'Priya Menon', role: 'Head of Talent', initials: 'PM' },
  { name: 'Karan Malhotra', role: 'Head of Verification', initials: 'KM' }
]
export const TRUSTED_LOGOS = TRUSTED_LOGOS_DATA.logos.map(l => l.name)
export const EMPLOYER_TESTIMONIAL = TESTIMONIALS_DATA.items[1]
export const HOME_TESTIMONIALS = TESTIMONIALS_DATA.items
