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
  GraduationCap,
  CheckCircle2,
  MessageCircle,
  Building2,
  Heart,
  Megaphone,
  PenTool,
  Headset,
  Globe,
  FileCheck2,
  MessageSquare,
  Handshake
} from 'lucide-react'
import { CONTACT_ADDRESS, CONTACT_EMAIL, CONTACT_PHONE } from './config'

// Sitewide navbar — same on every route (Home included) so it never visibly
// "changes" when navigating between pages. The first three use `to` (not
// `href`) with a leading slash, same as FOOTER_DATA's "/#services" link, so
// React Router does a client-side transition to Home and ScrollToTop.jsx
// then scrolls to the matching id once it mounts, instead of a full reload.
export const NAV_LINKS = [
  { label: 'Find Jobs', to: '/#job-search' },
  { label: 'Companies', to: '/#companies' },
  { label: 'Career Support', to: '/#career-support' },
  { label: 'For Employers', to: '/employers' },
]

export const HERO_DATA = {
  titleLine1: "Hiring, Built",
  titleItalic: "Right From",
  titleLine2: "Both Sides.",
  subtitle: "MZOBS bridges the gap between verified talent and genuine employment opportunities — connecting job seekers with employers through a trusted, human-verified hiring process.",
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
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=85",
      expandedText: "Every candidate profile that reaches an employer on Mzobs has already been reviewed by our team, not just run through an automated filter. We check the details on each profile, rebuild resumes where needed, and only pass a candidate forward once they're verified against the role. That means employers spend their time meeting people who are actually qualified — not sifting through a pile of unscreened applications."
    },
    {
      icon: Settings,
      title: "Guided Job Matching",
      desc: "Curated openings filtered to your track — no scrolling through noise.",
      image: "https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=800&q=85",
      expandedText: "Instead of handing job seekers a search bar and leaving them to scroll through hundreds of unrelated postings, Mzobs curates openings around the track they've told us they're targeting. Every opening a candidate sees is guided by what they actually want and are qualified for, so the matches are relevant from the start — cutting out the noise of a generic job board."
    },
    {
      icon: Sparkles,
      title: "Structured Interviews",
      desc: "Schedule, track and score interviews from one shared pipeline.",
      image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=800&q=85",
      expandedText: "Once a candidate is matched to a role, the interview process runs through one shared pipeline instead of scattered emails and calendar invites. Scheduling, tracking and scoring each round happens in the same place, so both our team and the employer can see exactly where a candidate stands at every stage — from first interview to final decision."
    },
    {
      icon: BarChart3,
      title: "Offer & Hiring Analytics",
      desc: "Track offers, acceptance and time-to-fill with full visibility.",
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=85",
      expandedText: "From the moment an offer goes out, Mzobs tracks its status — sent, accepted or declined — alongside how long each requirement took to fill. Employers get full visibility into where every hire stands, without having to chase updates across email threads or spreadsheets to find out."
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
  titleSuffix: " Into a Trusted Match",
  desc: "MZOBS is built to make hiring more trustworthy and relevant for both sides — helping job seekers showcase their skills and helping employers discover candidates who better fit their requirements.",
  ctaText: "Meet Our Team",
  image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=85"
}

export const OUR_VISION_DATA = {
  badge: "OUR VISION",
  titlePrefix: "We're building a future where opportunity finds ",
  titleItalic: "the right person",
  titleSuffix: ".",
  desc: "Not just faster hiring — a system both sides can actually trust. Verified people, matched to relevant opportunities, inside one hiring ecosystem people rely on.",
  badges: [
    { icon: "ShieldCheck", text: "Every profile, verified" },
    { icon: "Users", text: "Matched, not just listed" }
  ],
  ctaText: "Get in touch",
  ctaHref: `mailto:${CONTACT_EMAIL}`,
  image: "/images/new_images/approach.jpg"
}

export const ABOUT_GOAL_DATA = {
  badge: "OUR GOAL",
  titlePrefix: "What ",
  titleItalic: "Drives",
  titleSuffix: " Everything We Build",
  desc: "Every feature, every screening step and every conversation on Mzobs points back to the same commitments. They're not a mission statement on a wall — they're what we measure ourselves against, on every single hire.",
  items: [
    {
      title: "Fair Match",
      desc: "Right candidate, right role — decided on skill, not luck.",
      detail: "No black-box algorithms and no back-channel referrals deciding who gets seen. Every candidate is matched against a role on skill, experience and verified fit — so a great engineer from a small city gets the same shot as one from a big brand name.",
      icon: Target, bg: "var(--careers-cyan)", ink: "#0b3b3d"
    },
    {
      title: "Verified Profiles",
      desc: "Every resume checked and rebuilt before it's shared.",
      detail: "Our team manually reviews and rebuilds every resume that goes out, and screens every candidate before a profile is shared with an employer. What reaches the other side has already been checked — not just uploaded.",
      icon: ShieldCheck, bg: "var(--careers-mint)", ink: "#1f4d1a"
    },
    {
      title: "Faster Hiring",
      desc: "Pre-screened candidates cut time-to-hire in half.",
      detail: "Because every candidate in front of an employer is already screened and verified, interview loops skip the early filtering rounds entirely — most roles on Mzobs close in half the time of a typical job-board hire.",
      icon: Rocket, bg: "var(--careers-peach)", ink: "#7a3d0c"
    },
    {
      title: "Zero Ghosting",
      desc: "Every applicant gets a real update, always.",
      detail: "No application black hole. Every candidate who applies gets a real status update — selected, rejected or in-progress — instead of silence. It's a small thing that most platforms skip, and we don't.",
      icon: MessageCircle, bg: "var(--careers-pink)", ink: "#7a1f42"
    },
    {
      title: "Employer Trust",
      desc: "Only genuine, verified requirements reach candidates.",
      detail: "Every hiring requirement posted on Mzobs is verified before it goes live, so candidates never waste time chasing a role that doesn't exist or a company that isn't really hiring.",
      icon: Building2, bg: "var(--careers-tint-blue)", ink: "var(--careers-tint-blue-ink)"
    },
    {
      title: "Long-Term Fit",
      desc: "We optimize for retention, not just placements.",
      detail: "We don't stop measuring success at the offer letter. We track how long a placement stays and how well it's working for both sides, and use that to keep improving the match — not just the count of hires.",
      icon: Heart, bg: "var(--careers-tint-sand)", ink: "var(--careers-tint-sand-ink)"
    }
  ]
}

export const WHAT_MAKES_US_DIFFERENT_DATA = {
  badge: "WHY MZOBS",
  titlePrefix: "What Makes ",
  titleItalic: "Us",
  titleSuffix: " Different",
  desc: "Most hiring platforms just moved the paperwork online. We rebuilt the process itself — here's the same hire, done the old way and the Mzobs way.",
  columnLeft: "Traditional Hiring",
  columnRight: "The Mzobs Way",
  rows: [
    {
      traditional: "Résumés vanish into an ATS black hole, sorted by keyword luck.",
      mzobs: "Every candidate is matched on verified skill and fit — not keyword luck.",
      icon: Target, bg: "var(--careers-tint-blue)", ink: "var(--careers-tint-blue-ink)"
    },
    {
      traditional: "Anyone can upload an embellished, unchecked resume.",
      mzobs: "Every resume is manually reviewed and rebuilt before it's shared.",
      icon: ShieldCheck, bg: "var(--careers-tint-sage)", ink: "var(--careers-tint-sage-ink)"
    },
    {
      traditional: "Weeks of filtering rounds before you ever talk to a human.",
      mzobs: "Pre-screened candidates skip the filtering — time-to-hire is cut in half.",
      icon: Rocket, bg: "var(--careers-tint-sand)", ink: "var(--careers-tint-sand-ink)"
    },
    {
      traditional: "Apply, and hear absolutely nothing back. Ever.",
      mzobs: "Every applicant gets a real status update, always.",
      icon: MessageCircle, bg: "var(--careers-tint-rose)", ink: "var(--careers-tint-rose-ink)"
    },
    {
      traditional: "Job posts that turn out to be fake, stale or already filled.",
      mzobs: "Every requirement is verified as genuine before it goes live.",
      icon: Building2, bg: "var(--careers-tint-blue)", ink: "var(--careers-tint-blue-ink)"
    },
    {
      traditional: "Success measured by resumes collected, not hires that stick.",
      mzobs: "We track retention, not just placements — long after the offer letter.",
      icon: Heart, bg: "var(--careers-tint-sand)", ink: "var(--careers-tint-sand-ink)"
    }
  ]
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
      desc: "Job seekers create their profile with their skills, experience and preferred opportunities, while employers share the roles and requirements they are looking to fill.",
      image: "/images/new_images/step_01.jpg"
    },
    {
      num: "02",
      icon: BarChart2,
      title: "Build Your Trust Profile",
      desc: "MZOBS helps build credibility through profile verification and trust-based information, giving both job seekers and employers greater confidence in the hiring process.",
      image: "/images/new_images/step_02.jpg"
    },
    {
      num: "03",
      icon: Rocket,
      title: "Discover & Match",
      desc: "Job seekers can discover relevant opportunities, while employers can find talent based on the requirements of their roles.",
      image: "/images/new_images/step_03.jpg"
    },
    {
      num: "04",
      icon: Target,
      title: "Connect & Hire",
      desc: "Once the right opportunity and candidate come together, both sides can move forward with the hiring process through MZOBS.",
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
    { name: "AMPIN Energy Transition", logo: "/industry-logos/ampin.png" },
    { name: "Amplus Solar", logo: "/industry-logos/amplus.jpg" },
    { name: "Fourth Partner Energy", logo: "/industry-logos/fourthpartner.png" },
    { name: "Haldiram's", logo: "/industry-logos/haldirams.png" },
    { name: "Prakash Steel", logo: "/industry-logos/prakash-steel.png" },
    { name: "Rimjhim Ispat", logo: "/industry-logos/rimjhim-ispat.png" },
    { name: "Sunsource Energy", logo: "/industry-logos/sunsource.svg" },
    { name: "Sunsure Energy", logo: "/industry-logos/sunsure.svg" }
  ]
}

// Home page — "Explore jobs by category". Each tile routes into the real,
// existing employee job listing — see CategoryGrid.jsx for how `browseCategory`
// / `searchParams` become a destination. `browseCategory` values match the
// BROWSE_CATEGORY_TRACKS keys in Website/Frontend/src/lib/category.js (the
// employee app's own "Find Your Team" category cards) so a title here lands
// on the same, already-working `/app/jobs?category=...` filter that app
// reads in JobMatching.jsx — not a new destination. Titles with no matching
// track (Marketing, Design, Customer Support) fall back to the unfiltered
// listing rather than a guaranteed-empty filter.
export const CATEGORY_DATA = {
  title: "Explore jobs by category",
  subtitle: "Jump straight to openings in the field you know best.",
  categories: [
    { title: "Technology", icon: Cpu, count: 128, browseCategory: "Engineering & Technology" },
    { title: "Sales", icon: TrendingUp, count: 96, browseCategory: "Sales & Distribution" },
    { title: "Marketing", icon: Megaphone, count: 42 },
    { title: "Design", icon: PenTool, count: 35 },
    { title: "Finance", icon: Wallet, count: 51, browseCategory: "Finance & Accounting" },
    { title: "HR", icon: Users2, count: 47, browseCategory: "HR & Training" },
    { title: "Operations", icon: Settings, count: 63, browseCategory: "Operations" },
    { title: "Customer Support", icon: Headset, count: 39 },
    { title: "Freshers", icon: GraduationCap, count: 84, searchParams: { experience: "0-1" } },
    { title: "Remote Jobs", icon: Globe, count: 58, searchParams: { location: "Remote" } }
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
  socialsItems: [
    { label: "Instagram", href: "https://www.instagram.com/mzobs2601?igsi=MXA5ODdrZGFzbWptYw==" },
    { label: "Facebook", href: "#" },
    { label: "LinkedIn", href: "#" },
    { label: "Twitter (X)", href: "#" },
  ],
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
    desc: "One-time ₹299 subscription gives you lifetime access to profile matching, resume reviews, and placement tools.",
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
export const EMPLOYER_QUALITY_POINTS = [
  {
    icon: ShieldCheck,
    title: "Manually Verified Resumes",
    desc: "Every resume is personally checked by our operations team — not just auto-filtered by keywords."
  },
  {
    icon: Target,
    title: "Real Skills, Not Just Claims",
    desc: "Technical skills, certificates and past experience are validated before a profile is shortlisted."
  },
  {
    icon: MessageCircle,
    title: "Mock Interviews Conducted",
    desc: "Candidates go through a mock interview round so you meet people who can actually communicate and perform."
  },
  {
    icon: CheckCircle2,
    title: "Curated Shortlists, No Resume Dumps",
    desc: "You receive only genuine, job-ready profiles matched to your requirement — never a mass forward of unread resumes."
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

// ============================================================
// HOME — job-discovery redesign (JobSearchHero, CategoryGrid,
// LatestJobs, CompaniesHiring, HowItWorksSteps, HomeEmployerCTA). The
// navbar itself is sitewide now — see NAV_LINKS above, used by the
// shared layout/Navbar.jsx. Home-only data below — see each
// component for where it's consumed.
// ============================================================

export const JOB_SEARCH_DATA = {
  headlineLead: "Find jobs that match your",
  headlineAccent: "skills",
  subtitle: "Search verified opportunities from companies hiring through MZOBS.",
  titlePlaceholder: "Job title, skill or company",
  locationPlaceholder: "City, state or “Remote”",
  experienceOptions: [
    { value: "", label: "Any experience" },
    { value: "0-1", label: "Fresher" },
    { value: "1-3", label: "1–3 years" },
    { value: "3-5", label: "3–5 years" },
    { value: "5-10", label: "5–10 years" },
    { value: "10+", label: "10+ years" }
  ],
  searchCta: "Find jobs",
  popularSearches: ["Software Developer", "Sales Executive", "HR Executive", "Data Analyst", "Customer Support", "Fresher Jobs"],
  // Reuses the same verified numbers as WHO_WE_ARE_DATA.stats so this
  // trust row never drifts out of sync with the figures shown elsewhere
  // on the site. Only the "new roles today" figure is unique to this row.
  trustRow: [
    { value: "38+", label: "new roles posted today" },
    { value: WHO_WE_ARE_DATA.stats[1].number, label: "verified companies hiring" },
    { value: WHO_WE_ARE_DATA.stats[2].number, label: "candidates interviewed" }
  ],
  socialProof: {
    avatars: [
      { initials: "RK", tone: "teal" },
      { initials: "AN", tone: "navy" },
      { initials: "SP", tone: "violet" },
      { initials: "MJ", tone: "amber" }
    ],
    label: "Joined by 12,400+ job seekers already placed"
  }
}

// Realistic Indian sample listings — Backend's /jobs routes all sit
// behind requireAuth (see Backend/src/routes/jobRoutes.js), so there's
// no public jobs API this marketing site can call yet. Company names
// here are intentionally fictional (unlike COMPANIES_HIRING_DATA below,
// which uses Mzobs' real logo partners) since each entry pairs a name
// with a specific fabricated title/salary/date. Shape mirrors the real
// Job model (Backend/src/models/Job.js) so swapping in a live feed
// later is a data change, not a component rewrite.
export const LATEST_JOBS_DATA = [
  {
    title: "Senior React Developer", company: "Brightloop Technologies", location: "Bengaluru, Karnataka", experience: "3–6 yrs", salary: "₹12L – ₹18L", workMode: "Hybrid", postedDaysAgo: 1, recruiterOnline: true,
    description: "Brightloop Technologies is looking for a Senior React Developer to lead the frontend for their core product — a React + TypeScript codebase serving over 200,000 monthly users.",
    highlights: ["Own frontend architecture across two product squads", "Mentor two mid-level engineers and review their PRs", "Partner directly with design and product on new features"],
    benefits: ["Health insurance for you and your family", "Flexible hybrid schedule — 2 days in office", "Annual learning & conference budget"]
  },
  {
    title: "Sales Executive", company: "Northgate Distributors", location: "Pune, Maharashtra", experience: "1–3 yrs", salary: "₹4L – ₹6L", workMode: "On-site", postedDaysAgo: 2,
    description: "Northgate Distributors is hiring a Sales Executive to manage B2B accounts across the Pune region and grow their distributor network.",
    highlights: ["Manage and grow a portfolio of 30+ B2B accounts", "Visit distributor sites across the Pune region weekly", "Report pipeline and forecasts to the regional sales lead"],
    benefits: ["Fixed salary plus monthly incentive on targets", "Travel allowance for field visits", "Provident fund and health cover"]
  },
  {
    title: "HR Executive", company: "Solace Manufacturing", location: "Gurugram, Haryana", experience: "2–4 yrs", salary: "₹5L – ₹7.5L", workMode: "On-site", postedDaysAgo: 2, recruiterOnline: true,
    description: "Solace Manufacturing needs an HR Executive to run hiring and employee relations for their Gurugram plant, covering roughly 180 staff.",
    highlights: ["Run end-to-end hiring for shop-floor and office roles", "Handle onboarding, attendance and employee queries", "Coordinate monthly engagement activities on-site"],
    benefits: ["Health insurance and annual bonus", "On-site cafeteria", "Five-day work week"]
  },
  {
    title: "Data Analyst", company: "Vertex Financial Services", location: "Mumbai, Maharashtra", experience: "2–5 yrs", salary: "₹8L – ₹12L", workMode: "Hybrid", postedDaysAgo: 3,
    description: "Vertex Financial Services is hiring a Data Analyst to support their risk and operations teams with reporting and dashboards built on SQL and Power BI.",
    highlights: ["Build and maintain dashboards for risk and ops teams", "Write and optimize SQL queries against large datasets", "Present monthly analysis to department leads"],
    benefits: ["Hybrid schedule — 3 days in office", "Health insurance and annual performance bonus", "Sponsored certifications in analytics tools"]
  },
  {
    title: "Customer Support Associate", company: "Clearline Healthcare", location: "Hyderabad, Telangana", experience: "0–2 yrs", salary: "₹3L – ₹4.5L", workMode: "Remote", postedDaysAgo: 3, recruiterOnline: true,
    description: "Clearline Healthcare is looking for a remote Customer Support Associate to handle patient and provider queries over chat and phone.",
    highlights: ["Resolve patient and provider queries over chat and call", "Log every interaction accurately in the support tool", "Escalate unresolved cases to the right internal team"],
    benefits: ["Fully remote — work from anywhere in India", "Health insurance from day one", "Fixed rotational shifts, no night shifts"]
  },
  {
    title: "Graphic Designer", company: "Sundial Media", location: "Ahmedabad, Gujarat", experience: "1–3 yrs", salary: "₹4.5L – ₹6.5L", workMode: "Hybrid", postedDaysAgo: 4,
    description: "Sundial Media is hiring a Graphic Designer to produce social and campaign creatives for a roster of consumer brand clients.",
    highlights: ["Design social, print and campaign creatives for clients", "Turn around revisions within agreed client timelines", "Maintain brand guidelines across every deliverable"],
    benefits: ["Hybrid schedule with flexible hours", "Latest design software and hardware provided", "Health insurance"]
  },
  {
    title: "Operations Manager", company: "Anchorpoint Logistics", location: "Chennai, Tamil Nadu", experience: "4–7 yrs", salary: "₹10L – ₹14L", workMode: "On-site", postedDaysAgo: 5, recruiterOnline: true,
    description: "Anchorpoint Logistics needs an Operations Manager to run day-to-day warehouse and dispatch operations out of their Chennai hub.",
    highlights: ["Oversee daily warehouse and dispatch operations", "Manage a team of 25+ warehouse staff and supervisors", "Track SLAs and cut down dispatch delays"],
    benefits: ["Health insurance for you and your family", "Annual performance bonus", "Company transport for late shifts"]
  },
  {
    title: "Business Development Associate", company: "Meridian Retail Group", location: "Noida, Uttar Pradesh", experience: "1–2 yrs", salary: "₹3.5L – ₹5L", workMode: "Remote", postedDaysAgo: 6,
    description: "Meridian Retail Group is hiring a remote Business Development Associate to source and qualify new retail partnership leads.",
    highlights: ["Source and qualify new retail partnership leads", "Run discovery calls and maintain the CRM pipeline", "Coordinate handoffs to the partnerships team"],
    benefits: ["Fully remote role", "Performance-linked incentives", "Health insurance"]
  }
]

// Reuses Mzobs' real logo partners (same assets as TRUSTED_LOGOS_DATA)
// with illustrative industry/open-roles figures layered on — kept as a
// separate export since TRUSTED_LOGOS_DATA is also used by LogoCloud
// and EmployerLogosSection on other pages.
export const COMPANIES_HIRING_DATA = [
  { name: "AMPIN Energy Transition", logo: "/industry-logos/ampin.png", industry: "Renewable Energy", openRoles: 6 },
  { name: "Amplus Solar", logo: "/industry-logos/amplus.jpg", industry: "Solar Energy", openRoles: 4 },
  { name: "Fourth Partner Energy", logo: "/industry-logos/fourthpartner.png", industry: "Clean Energy", openRoles: 9 },
  { name: "Haldiram's", logo: "/industry-logos/haldirams.png", industry: "FMCG & Food", openRoles: 12 },
  { name: "Prakash Steel", logo: "/industry-logos/prakash-steel.png", industry: "Steel & Metals", openRoles: 5 },
  { name: "Rimjhim Ispat", logo: "/industry-logos/rimjhim-ispat.png", industry: "Steel & Metals", openRoles: 3 },
  { name: "Sunsource Energy", logo: "/industry-logos/sunsource.svg", industry: "Solar Energy", openRoles: 7 },
  { name: "Sunsure Energy", logo: "/industry-logos/sunsure.svg", industry: "Renewable Energy", openRoles: 8 }
]

export const HOME_EMPLOYER_CTA_DATA = {
  title: "Looking to hire?",
  subtitle: "Connect with job-ready candidates through MZOBS.",
  ctaText: "Post a requirement",
  ctaTo: "/employers/signup"
}

// "How it works" — 3-step explainer, common on Naukri/Indeed home pages.
// Step 2 deliberately foregrounds direct employer chat instead of a
// generic "apply" step.
export const HOW_IT_WORKS_DATA = {
  title: "How Mzobs gets you hired",
  subtitle: "Not just a job board — here's exactly what Mzobs does for you, from profile to offer.",
  steps: [
    {
      icon: ShieldCheck,
      title: "Build your verified profile",
      desc: "Share your skills and experience — our team personally reviews and rebuilds your resume, so it actually gets seen by employers."
    },
    {
      icon: Sparkles,
      title: "Get matched & interview-ready",
      desc: "We match you to roles based on your verified skills, not keyword luck, and run you through mock interviews before you meet an employer."
    },
    {
      icon: Target,
      title: "Interview & get hired",
      desc: "Meet only vetted, verified employers, get a real status update on every application, and get support from our team through your first month."
    }
  ]
}

// Compact discovery row directly under the hero — quick, one-tap filters
// for the searches people run most (fresher-friendly, remote, or a specific
// metro), each just a preset query string onto the same /app/jobs listing
// the hero search itself targets. See QuickDiscoveryStrip.jsx.
export const QUICK_DISCOVERY_DATA = [
  { label: "Remote jobs", params: { location: "Remote" } },
  { label: "Jobs for freshers", params: { experience: "0-1" } },
  { label: "Bengaluru", params: { location: "Bengaluru" } },
  { label: "Delhi NCR", params: { location: "Delhi NCR" } },
  { label: "Mumbai", params: { location: "Mumbai" } },
  { label: "Hyderabad", params: { location: "Hyderabad" } }
]

// "MZOBS career support" — what Mzobs does beyond listing jobs. Kept to
// four factual, non-guarantee points (see CareerSupportSection.jsx).
export const CAREER_SUPPORT_DATA = {
  title: "More than a job list",
  subtitle: "Our operations team supports every candidate from application to offer.",
  points: [
    {
      icon: FileCheck2,
      title: "Resume review",
      desc: "Our team reviews your resume and helps rebuild it so it's ready for real employers."
    },
    {
      icon: MessageSquare,
      title: "Interview preparation",
      desc: "Get guidance and mock interviews before you meet an employer."
    },
    {
      icon: Target,
      title: "Job matching",
      desc: "We match your skills and experience to roles that genuinely fit."
    },
    {
      icon: Handshake,
      title: "Direct employer access",
      desc: "Once shortlisted, connect straight with the employer — no black box in between."
    }
  ]
}
