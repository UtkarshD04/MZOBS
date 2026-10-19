import {
  Target,
  Settings,
  Sparkles,
  BarChart3,
  Lightbulb,
  BarChart2,
  Rocket,
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
  Globe
} from 'lucide-react'
import { CONTACT_ADDRESS, CONTACT_EMAIL, CONTACT_PHONE } from './config'

// Sitewide navbar — same on every route (Home included) so it never visibly
// "changes" when navigating between pages. The first three use `to` (not
// `href`) with a leading slash, same as FOOTER_DATA's "/#services" link, so
// React Router does a client-side transition to Home and ScrollToTop.jsx
// then scrolls to the matching id once it mounts, instead of a full reload.
export const NAV_LINKS = [
  { label: 'Find Jobs', to: '/#latest-jobs' },
  { label: 'Companies', to: '/#companies' },
  { label: 'Premium', to: '/employees/subscription' },
  {
    label: 'Resources',
    children: [
      { label: 'Our Story', to: '/our-story' },
      { label: 'Mzobs Ally', to: '/ally' },
      { label: 'Associate with Mzobs', to: '/associate', hideWhenSignedIn: true },
      { label: 'Add Your Campus', to: '/add-your-campus' },
    ],
  },
]

export const HERO_DATA = {
  titleLine1: "Hiring, Built",
  titleItalic: "Right From",
  titleLine2: "Both Sides.",
  subtitle: "Mzobs brings talent and opportunity together, connecting job seekers with employers through smart matching and one simple hiring workflow.",
  ctaText: "Get Started",
  bgImage: "/images/hero-bg.jpg",
  rotatingPrefix: "It's time to",
  rotatingWords: ["Get Hired!", "Hire Smarter!", "Get Matched!", "Grow!", "Build Your Team!"],
  searchPlaceholder: "Search jobs, roles or companies"
}

export const WHO_WE_ARE_DATA = {
  badge: "WHO WE ARE",
  heroTitleLine1: "Built For Smarter Hiring,",
  heroTitleLine2: "Made For Both Sides.",
  heroSubtitle: "Every profile checked, every pipeline refined: a hiring platform where job seekers find roles they're right for, and employers find people worth hiring.",
  stats: [
    {
      number: "12,400+",
      label: "Job seeker profiles built and improved with our operations team."
    },
    {
      number: "340+",
      label: "Companies actively hiring qualified candidates through Mzobs."
    },
    {
      number: "3,180+",
      label: "Interviews arranged between candidates and employers."
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
      title: "Quality Candidate Pipeline",
      desc: "Candidates are matched to each role on skills and experience before they reach an employer.",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=85",
      expandedText: "Every requirement on Mzobs is matched against candidate skills, experience, location and role preference, so employers start with the people who fit best, not a pile of unsorted applications. Candidates see why a role suits them, and employers see why a candidate suits the role."
    },
    {
      icon: Settings,
      title: "Guided Job Matching",
      desc: "Curated openings filtered to your track, no scrolling through noise.",
      image: "https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=800&q=85",
      expandedText: "Instead of handing job seekers a search bar and leaving them to scroll through hundreds of unrelated postings, Mzobs curates openings around the track they've told us they're targeting. Every opening a candidate sees is guided by what they actually want and are qualified for, so the matches are relevant from the start, cutting out the noise of a generic job board."
    },
    {
      icon: Sparkles,
      title: "Structured Interviews",
      desc: "Schedule, track and score interviews from one shared pipeline.",
      image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=800&q=85",
      expandedText: "Once a candidate is matched to a role, the interview process runs through one shared pipeline instead of scattered emails and calendar invites. Scheduling, tracking and scoring each round happens in the same place, so both our team and the employer can see exactly where a candidate stands at every stage, from first interview to final decision."
    },
    {
      icon: BarChart3,
      title: "Offer & Hiring Analytics",
      desc: "Track offers, acceptance and time-to-fill with full visibility.",
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=85",
      expandedText: "From the moment an offer goes out, Mzobs tracks its status (sent, accepted or declined) alongside how long each requirement took to fill. Employers get full visibility into where every hire stands, without having to chase updates across email threads or spreadsheets to find out."
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
      desc: "By sending only well-matched candidates into their pipeline, Mzobs helped Solace Technologies stop sifting resumes that went nowhere and start interviewing candidates worth their time.",
      bgImage: "/images/new_images/story_solace.jpg"
    },
    {
      id: "batch-hiring",
      tags: ["FOR EMPLOYERS", "BATCH HIRING"],
      title: "Filling Dozens of Roles At Once With Quality Talent",
      italicWords: "Quality Talent",
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
  subtitle: "One workflow, from open requirement to signed offer, with candidates matched to your role before they reach you.",
  steps: [
    {
      num: "01",
      icon: Briefcase,
      title: "Post The Requirement",
      desc: "Share the role, must-have skills and budget, live in minutes, not weeks.",
      bg: "#cfe8fb",
      accent: "#0b7a6d"
    },
    {
      num: "02",
      icon: Sparkles,
      title: "We Match & Shortlist",
      desc: "Applicants are matched to your requirement and shortlisted by fit before reaching your pipeline.",
      bg: "#cdeec5",
      accent: "#16a34a"
    },
    {
      num: "03",
      icon: Users2,
      title: "Interview Shortlisted Talent",
      desc: "Meet only candidates matched to your requirement, no resume pile to dig through.",
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
      a: "Mzobs is a trusted hiring marketplace: job seekers discover roles matched to their skills, and employers discover candidates ranked by fit for their requirement."
    },
    {
      q: "Is Mzobs free for job seekers?",
      a: "Yes. With the free Mzobs Basic plan, you can create a profile, get matched and apply to up to 10 jobs. Mzobs Premium is a one-time ₹499 lifetime plan that adds unlimited applications, expert resume review, mock interviews, career coaching and premium visibility to recruiters."
    },
    {
      q: "How does candidate matching work?",
      a: "Mzobs compares each candidate's skills, experience, location and role preference with the requirement, and shows employers the best-fitting candidates first."
    },
    {
      q: "How long does it take to fill a role?",
      a: "Matching starts as soon as a requirement is live, so employers can begin reviewing the best-fitting candidates right away."
    },
    {
      q: "What roles and industries does Mzobs cover?",
      a: "We cover everything from entry-level to leadership hiring across tech, operations, sales, finance and more. Browse open categories in the Find Your Team section or share your requirement directly."
    },
    {
      q: "How do I get started as an employer?",
      a: "Sign up on the Employers page and post your requirement. We start matching candidates from your very first job post."
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
      quote: "Mzobs didn't just help me find a job. My resume was rebuilt by an expert, I trained for two weeks, and I walked into my interview actually prepared.",
      name: "Rohit Kulkarni",
      title: "Placed as Business Analyst, Razorpay"
    },
    {
      id: 2,
      image: "/images/new_images/testimonial_rhea.jpg",
      quote: "We used to spend weeks sifting resumes that went nowhere. With Mzobs, every candidate we interview is already a strong match.",
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
      quote: "Our time-to-offer dropped by more than half once every candidate arrived well-matched and ready to interview.",
      name: "Mario Fotiou",
      title: "Talent Lead, Constructo"
    },
    {
      id: 5,
      image: "/images/new_images/testimonial_john.jpg",
      quote: "One dashboard for every application, interview and offer status. I always knew exactly where I stood.",
      name: "John Smith",
      title: "Placed as Software Engineer, Innovate"
    }
  ]
}

export const OUR_GOAL_DATA = {
  badge: "OUR MISSION",
  titlePrefix: "Turning ",
  titleItalic: "Hiring",
  titleSuffix: " Into a Smarter Match",
  desc: "Mzobs is built to make hiring faster and more relevant for both sides, helping job seekers showcase their skills and helping employers discover candidates who better fit their requirements.",
  ctaText: "Meet Our Team",
  image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=85"
}

export const OUR_VISION_DATA = {
  badge: "OUR VISION",
  titlePrefix: "We're building a future where opportunity finds ",
  titleItalic: "the right person",
  titleSuffix: ".",
  desc: "Not just faster hiring, smarter hiring. Talent matched to relevant opportunities, inside one hiring ecosystem both sides can rely on.",
  badges: [
    { icon: "Sparkles", text: "Verified, trusted listings" },
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
  desc: "Every feature, every screening step and every conversation on Mzobs points back to the same commitments. They're not a mission statement on a wall; they're what we measure ourselves against, on every single hire.",
  items: [
    {
      title: "Fair Match",
      desc: "Right candidate, right role, decided on skill, not luck.",
      detail: "No black-box algorithms and no back-channel referrals deciding who gets seen. Every candidate is matched against a role on skill, experience and real fit, so a great engineer from a small city gets the same shot as one from a big brand name.",
      icon: Target, bg: "var(--careers-cyan)", ink: "#0b3b3d"
    },
    {
      title: "Stronger Profiles",
      desc: "Resumes that show what candidates can really do.",
      detail: "Our team helps candidates rebuild their resumes and present their skills clearly, so the profile an employer sees reflects the person, not just an upload.",
      icon: Sparkles, bg: "var(--careers-mint)", ink: "#1f4d1a"
    },
    {
      title: "Faster Hiring",
      desc: "Better-matched candidates mean fewer filtering rounds.",
      detail: "Because the candidates in front of an employer are already matched to the role, interview loops can skip much of the early filtering and get to the right conversations sooner.",
      icon: Rocket, bg: "var(--careers-peach)", ink: "#7a3d0c"
    },
    {
      title: "Zero Ghosting",
      desc: "Every applicant gets a real update, always.",
      detail: "No application black hole. Every candidate who applies gets a real status update (selected, rejected or in progress) instead of silence. It's a small thing that most platforms skip, and we don't.",
      icon: MessageCircle, bg: "var(--careers-pink)", ink: "#7a1f42"
    },
    {
      title: "Employer Growth",
      desc: "Tools that grow with every team that hires.",
      detail: "From a first hire to a full team, employers post roles, discover candidates, schedule interviews and send offers from one dashboard, so hiring scales without extra spreadsheets.",
      icon: Building2, bg: "var(--careers-tint-blue)", ink: "var(--careers-tint-blue-ink)"
    },
    {
      title: "Long-Term Fit",
      desc: "We optimize for retention, not just placements.",
      detail: "We don't stop measuring success at the offer letter. We track how long a placement stays and how well it's working for both sides, and use that to keep improving the match, not just the count of hires.",
      icon: Heart, bg: "var(--careers-tint-sand)", ink: "var(--careers-tint-sand-ink)"
    }
  ]
}

export const WHAT_MAKES_US_DIFFERENT_DATA = {
  badge: "WHY MZOBS",
  titlePrefix: "What Makes ",
  titleItalic: "Us",
  titleSuffix: " Different",
  desc: "Most hiring platforms just moved the paperwork online. We rebuilt the process itself. Here's the same hire, done the old way and the Mzobs way.",
  columnLeft: "Traditional Hiring",
  columnRight: "The Mzobs Way",
  rows: [
    {
      traditional: "Resumes vanish into an ATS black hole, sorted by keyword luck.",
      mzobs: "Every candidate is matched on skills and fit, not keyword luck.",
      icon: Target, bg: "var(--careers-tint-blue)", ink: "var(--careers-tint-blue-ink)"
    },
    {
      traditional: "A resume is a keyword list that undersells the candidate.",
      mzobs: "Resume and interview coaching help candidates show what they can do.",
      icon: Sparkles, bg: "var(--careers-tint-sage)", ink: "var(--careers-tint-sage-ink)"
    },
    {
      traditional: "Weeks of filtering rounds before you ever talk to a human.",
      mzobs: "Well-matched candidates skip much of the filtering, so hiring moves faster.",
      icon: Rocket, bg: "var(--careers-tint-sand)", ink: "var(--careers-tint-sand-ink)"
    },
    {
      traditional: "Apply, and hear absolutely nothing back. Ever.",
      mzobs: "Every applicant gets a real status update, always.",
      icon: MessageCircle, bg: "var(--careers-tint-rose)", ink: "var(--careers-tint-rose-ink)"
    },
    {
      traditional: "Interviews scheduled over endless email and phone back-and-forth.",
      mzobs: "Interviews scheduled and tracked from one hiring dashboard.",
      icon: Building2, bg: "var(--careers-tint-blue)", ink: "var(--careers-tint-blue-ink)"
    },
    {
      traditional: "Success measured by resumes collected, not hires that stick.",
      mzobs: "We track retention, not just placements, long after the offer letter.",
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
    { text: "; it should drive a " },
    { text: "real, lasting", italic: true },
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
      title: "Set Your Preferences",
      desc: "Job seekers share the roles, locations and work modes they want, and employers define must-have skills, so Mzobs knows what a good match looks like for both sides.",
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
      desc: "Once the right opportunity and candidate come together, both sides can move forward with the hiring process through Mzobs.",
      image: "/images/new_images/step_04.jpg"
    }
  ]
}

export const EMPLOYEE_GOAL_DATA = {
  titlePrefix: "We're Not Another ",
  titleItalic: "Job Board",
  titleSuffix: ", We're Your Placement Team",
  desc: "Most platforms hand you a search bar and wish you luck. Mzobs assigns your resume to a real recruiter, runs you through mock interviews, and only puts you in front of employers hiring for roles you're actually qualified for.",
  ctaText: "See Your Journey",
  ctaHref: "#candidate-journey",
  image: "/images/new_images/employee_goal.jpg"
}

export const EMPLOYEE_APPROACH_DATA = {
  heading: [
    { text: "Getting hired shouldn't feel like " },
    { text: "guesswork", italic: true },
    { text: ". We build your resume, coach your interviews, and match you to roles that actually fit." }
  ],
  image: "/images/new_images/employee_approach.jpg",
  steps: [
    {
      num: "01",
      icon: Building2,
      title: "Top Employer Network",
      desc: "Discover openings from companies actively hiring on Mzobs, with role, pay and work mode up front."
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
      desc: "We match you to roles based on your skills and preferences, so you stop scrolling job boards that go nowhere."
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
  title: "Companies Hiring on Mzobs",
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

// Home page — "Explore jobs by category". Every count shown is fetched live
// from GET /api/jobs/categories (fetchCategoryCounts) — no offline/fallback
// number is kept here, so CategoryGrid.jsx shows a loading skeleton until
// that request resolves rather than ever displaying an invented figure.
//
// `trackKey` is how CategoryGrid.jsx looks a tile's live count up in that
// response — it matches the Backend Job.track enum exactly, or
// 'freshers'/'remote'/'finance' for the three virtual (filter-based, not
// track-based) tiles. Clicking a tile filters the Latest jobs section the
// same way the hero search / quick-discovery pills do (see
// CategoryGrid.jsx) — 'finance' has no Job.track value the job *list*
// endpoint's `track` filter accepts (only the categories-count endpoint
// special-cases it), so that one tile filters by a plain text search
// instead of `track` when clicked.
export const CATEGORY_DATA = {
  title: "Explore jobs by category",
  subtitle: "Jump straight to openings in the field you know best.",
  categories: [
    { title: "Technology", icon: Cpu, trackKey: "tech" },
    { title: "Sales", icon: TrendingUp, trackKey: "sales" },
    { title: "Marketing", icon: Megaphone, trackKey: "marketing" },
    { title: "Design", icon: PenTool, trackKey: "design" },
    { title: "Finance", icon: Wallet, trackKey: "finance" },
    { title: "HR", icon: Users2, trackKey: "hr" },
    { title: "Operations", icon: Settings, trackKey: "ops" },
    { title: "Customer Support", icon: Headset, trackKey: "support" },
    { title: "Freshers", icon: GraduationCap, searchParams: { experience: "0-1" }, trackKey: "freshers" },
    { title: "Remote Jobs", icon: Globe, searchParams: { location: "Remote" }, trackKey: "remote" }
  ]
}

export const CTA_BAND_DATA = {
  titlePrefix: "Ready To ",
  titleItalic: "Get Hired",
  titleSuffix: " Or Hire Faster?",
  desc: "Whichever side of hiring you're on, Mzobs matches you with the right people and roles. Create a free account or reach out to our team to get started.",
  ctaText: "Get Started Today",
  bgImage: "/images/new_images/cta_band.jpg"
}

export const FOOTER_DATA = {
  logoSub: "HIRING PLATFORM",
  desc: "Mzobs is where verified talent meets trusted opportunity, connecting people, skills and employers to build better careers and better hiring.",
  ctaText: "Contact Us",
  menuTitle: "Menu",
  menuItems: [
    { label: "Home", to: "/" },
    { label: "Services", to: "/#services" },
    { label: "Our Story", to: "/our-story" },
    { label: "Contact", to: "/contact" },
  ],
  socialsTitle: "Socials",
  socialsItems: [
    { label: "Instagram", href: "https://www.instagram.com/mzobs2601" },
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
    { label: "Terms & Conditions", to: "/terms-of-service" },
    { label: "Delete Account", to: "/delete-account" },
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
      { n: "01", title: "Candidates can upgrade to Premium", desc: "A one-time ₹499 lifetime plan for more job access and career support." },
      { n: "02", title: "Employers get hiring support", desc: "For up to 10 candidates." },
      { n: "03", title: "Beyond 10 successful hires", desc: "10% of the first month's salary applies." },
      { n: "04", title: "A success fee is charged", desc: "Only after the employee completes one month." }
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
      "Affordable entry with ₹999 for the first 10 hires.",
      "Recharge with ₹499 to hire 5 more candidates.",
      "No upfront commission. Pay only when you hire more.",
      "Designed for startups & Tier 3 companies to scale affordably."
    ],
    stats: [
      { value: "10", label: "Hires Included (₹999)" },
      { value: "+5", label: "Hires per Add-on (₹499)" },
      { value: "Unlimited", label: "Add-ons, Unlimited Growth" }
    ],
    steps: [
      { n: "01", title: "Pay ₹999", desc: "Pay once and get hiring support for up to 10 candidates." },
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
    desc: "A one-time ₹499 subscription gives you lifetime access to profile matching, resume reviews, and placement tools.",
    image: "/images/new_images/emp_feature_1.jpg"
  },
  {
    icon: Settings,
    title: "Expert Resume Review",
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
    title: "Smart Skill Categorization",
    desc: "Your profile is categorized based on your technical and soft skills to match you with relevant hiring opportunities.",
    image: "/images/new_images/emp_feature_4.jpg"
  }
]

export const EMPLOYER_FEATURES = [
  {
    icon: Sparkles,
    title: "Matched Candidates",
    desc: "Receive candidates whose resumes and skills match your requirement, ranked by fit.",
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
    desc: "Easily scale your hiring from individual niche roles to full batch recruitment cycles.",
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
    icon: Sparkles,
    title: "Well-Matched Resumes",
    desc: "Candidates are ranked on skills, experience and role fit, not just auto-filtered by keywords."
  },
  {
    icon: Target,
    title: "Matched To Your Requirement",
    desc: "Applicants are scored against the exact role, skills and experience you listed, not a generic resume dump."
  },
  {
    icon: MessageCircle,
    title: "No Middleman Delay",
    desc: "There's no staff queue sitting between a candidate and your dashboard. Once they apply, you see them."
  },
  {
    icon: CheckCircle2,
    title: "You're In Control",
    desc: "Shortlist, message or reject directly from your dashboard the moment an application comes in."
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
  { name: 'Karan Malhotra', role: 'Head of Candidate Operations', initials: 'KM', image: '/images/new_images/team_karan.jpg' }
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
  headlineLine1: "Where Talent",
  headlineLine2: "Meets Real Work.",
  subtitleLine1: "Get discovered, build your skills, and grow through real opportunities.",
  subtitleLine2: "One platform connecting candidates, employers, matching, feedback and growth.",
  toggleJobLabel: "I'm looking for a job",
  toggleEmployerLabel: "I'm hiring talent",
  titlePlaceholder: "Search jobs, skills or company",
  locationPlaceholder: "City, state or “Remote”",
  experienceOptions: [
    { value: "", label: "Any experience" },
    { value: "0-1", label: "Fresher" },
    { value: "1-3", label: "1–3 years" },
    { value: "3-5", label: "3–5 years" },
    { value: "5-10", label: "5–10 years" },
    { value: "10+", label: "10+ years" }
  ],
  searchCta: "Search Jobs",
  // Trimmed to 4–5 on the hero itself (see JobSearchHero.jsx) so this stays
  // a short, useful shortcut row rather than a wall of links.
  popularSearches: ["Software Developer", "Sales Executive", "HR Executive", "Data Analyst", "Fresher Jobs"]
}

// Reuses Mzobs' real logo partners (same assets as TRUSTED_LOGOS_DATA) —
// name/logo/industry are real; each company's open-role count is NOT stored
// here — CompaniesHiring.jsx fetches it live from the public jobs API
// (matching jobs by company name, same as a "View company jobs" search
// would) so the number shown is always real, never a fixed/illustrative
// figure that could drift from what's actually live.
export const COMPANIES_HIRING_DATA = [
  { name: "AMPIN Energy Transition", logo: "/industry-logos/ampin.png", industry: "Renewable Energy" },
  { name: "Amplus Solar", logo: "/industry-logos/amplus.jpg", industry: "Solar Energy" },
  { name: "Fourth Partner Energy", logo: "/industry-logos/fourthpartner.png", industry: "Clean Energy" },
  { name: "Haldiram's", logo: "/industry-logos/haldirams.png", industry: "FMCG & Food" },
  { name: "Prakash Steel", logo: "/industry-logos/prakash-steel.png", industry: "Steel & Metals" },
  { name: "Rimjhim Ispat", logo: "/industry-logos/rimjhim-ispat.png", industry: "Steel & Metals" },
  { name: "Sunsource Energy", logo: "/industry-logos/sunsource.svg", industry: "Solar Energy" },
  { name: "Sunsure Energy", logo: "/industry-logos/sunsure.svg", industry: "Renewable Energy" }
]

// "Campus Connect" section on the home page (see CampusNetwork.jsx).
//
// `count` is the number of colleges attached, shown as a "{count}+" count-up.
export const CAMPUS_NETWORK_DATA = {
  eyebrow: "Campus Connect",
  headline: ["Where Campus", "Talent Meets"],
  headlineAccent: "Opportunity.",
  subtitle: "Connect your campus with top employers, real opportunities and a smarter path from learning to hiring.",
  count: 100,
  statLabel: "Colleges attached",
  statNote: "Placement cells already on Mzobs",
  ctaText: "Bring Your Campus to Mzobs",
  ctaTo: "/contact"
}

export const HOME_EMPLOYER_CTA_DATA = {
  title: "Hiring for your team?",
  subtitle: "Post a requirement and reach candidates Mzobs has matched to it, ranked by fit before they reach you.",
  ctaText: "Post a requirement",
  ctaTo: "/employers/signup"
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

// "Hot Jobs by City" (see HotJobsByCity.jsx / pages/CityJobs.jsx) — display
// and routing metadata only. Every number shown in that section (openings,
// salary range, top categories, verified-employer count, new-this-week) is
// real, live data fetched from Backend's GET /api/jobs/hot-cities (see
// fetchHotCities in lib/publicJobs.js and hotCities.js's HOT_CITIES on the
// backend, which this list's `city`/`slug` values are kept in sync with) —
// nothing in this block is a stand-in for real data. `imageUrl`/
// `imageAttribution` are intentionally empty: the card/hero falls back to a
// gradient+monogram treatment when unset, and a real (properly licensed)
// landmark photo can be dropped in later by filling these in — no component
// changes needed.
// Real, properly licensed landmark photography (Wikimedia Commons — see
// each `imageAttribution` for photographer + license) for the "Hot Jobs by
// City" cards and city detail hero (HotJobsByCity.jsx / pages/CityJobs.jsx).
// Deliberately real photographs of a recognizable landmark per city, never
// an illustrated/generated skyline — this is the one place a future paid
// image API or licensed photo library would plug in instead; nothing else
// in either component needs to change for that, they just read `imageUrl`.
export const HOT_CITIES_DATA = {
  eyebrow: "Live Hiring Activity",
  title: "Explore Jobs by City",
  subtitle: "Where opportunity meets ambition.",
  brandLine: "Explore opportunities. Find your city. Get matched with the right job.",
  filters: [
    { key: "all", label: "All Jobs" },
    { key: "tech", label: "IT & Tech" },
    { key: "sales", label: "Sales" },
    { key: "finance", label: "Finance" },
    { key: "marketing", label: "Marketing" },
    { key: "ops", label: "Operations" }
  ],
  cities: [
    {
      city: "Bengaluru",
      slug: "bengaluru",
      state: "Karnataka",
      landmark: "Vidhana Soudha",
      imageUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/Vidhana_Soudha_2012.jpg?width=1200",
      imageAttribution: "Muhammad Mahdi Karim & Mydreamsparrow / Wikimedia Commons (GFDL 1.2)"
    },
    {
      city: "Mumbai",
      slug: "mumbai",
      state: "Maharashtra",
      landmark: "Gateway of India",
      imageUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/Mumbai_03-2016_30_Gateway_of_India.jpg?width=1200",
      imageAttribution: "A.Savin / Wikimedia Commons (Free Art License)"
    },
    {
      city: "Delhi NCR",
      slug: "delhi-ncr",
      state: "Delhi",
      landmark: "India Gate",
      imageUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/India_Gate_on_an_evening.jpg?width=1200",
      imageAttribution: "Deepak TL / Wikimedia Commons (CC BY-SA 4.0)"
    },
    {
      city: "Hyderabad",
      slug: "hyderabad",
      state: "Telangana",
      landmark: "Charminar",
      imageUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/Charminar_Hyderabad_1.jpg?width=1200",
      imageAttribution: "DidierTais / Wikimedia Commons (CC BY-SA 3.0)"
    },
    {
      city: "Pune",
      slug: "pune",
      state: "Maharashtra",
      landmark: "Shaniwar Wada",
      imageUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/Horizontal_side_view_of_Shaniwar_Wada_illuminated.jpg?width=1200",
      imageAttribution: "DesiBoy101 / Wikimedia Commons (CC BY 4.0)"
    },
    {
      city: "Chennai",
      slug: "chennai",
      state: "Tamil Nadu",
      landmark: "Marina Beach",
      imageUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/Chennai_Lighthouse,_Marina_Beach,_Chennai_01.jpg?width=1200",
      imageAttribution: "Pinakpani / Wikimedia Commons (CC BY 4.0)"
    },
    {
      city: "Noida",
      slug: "noida",
      state: "Uttar Pradesh",
      landmark: "DLF Mall of India",
      imageUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/DLF_Mall_of_India_from_outside_03.jpg?width=1200",
      imageAttribution: "AjayDas / Wikimedia Commons (CC BY-SA 4.0)"
    },
    {
      city: "Gurugram",
      slug: "gurugram",
      state: "Haryana",
      landmark: "Cyber Hub",
      imageUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/DLF_Cyber_Hub%2C_Gurgaon.jpg?width=1200",
      imageAttribution: "Slyronit / Wikimedia Commons (CC BY-SA 4.0)"
    },
    {
      city: "Kolkata",
      slug: "kolkata",
      state: "West Bengal",
      landmark: "Victoria Memorial",
      imageUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/Victoria_Memorial_situated_in_Kolkata.jpg?width=1200",
      imageAttribution: "Subhrajyoti07 / Wikimedia Commons (CC BY-SA 4.0)"
    },
    {
      city: "Lucknow",
      slug: "lucknow",
      state: "Uttar Pradesh",
      landmark: "Bara Imambara",
      imageUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/Bara_Imambara%2C_Lucknow_2.jpg?width=1200",
      imageAttribution: "Slyronit / Wikimedia Commons (CC BY-SA 4.0)"
    },
    {
      city: "Ahmedabad",
      slug: "ahmedabad",
      state: "Gujarat",
      landmark: "Atal Bridge, Sabarmati Riverfront",
      imageUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/River_Cruise_at_Atal_Pedestrian_Bridge.jpg?width=1200",
      imageAttribution: "GlobalUploader / Wikimedia Commons (CC BY-SA 4.0)"
    },
    {
      city: "Jaipur",
      slug: "jaipur",
      state: "Rajasthan",
      landmark: "Hawa Mahal",
      imageUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/East_facade_Hawa_Mahal_Jaipur_from_ground_level_(July_2022)_-_img_01.jpg?width=1200",
      imageAttribution: "Chainwit. / Wikimedia Commons (CC BY-SA 4.0)"
    },
    {
      city: "Chandigarh",
      slug: "chandigarh",
      state: "Chandigarh",
      landmark: "Open Hand Monument",
      imageUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/Open_Hand_Monument.JPG?width=1200",
      imageAttribution: "ShashankSharma2511 / Wikimedia Commons (CC BY 3.0)"
    },
    {
      city: "Indore",
      slug: "indore",
      state: "Madhya Pradesh",
      landmark: "Rajwada Palace",
      imageUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/Indore_Rajwada01.jpg?width=1200",
      imageAttribution: "DeepakNigam / Wikimedia Commons (CC BY-SA 4.0)"
    },
    {
      city: "Kochi",
      slug: "kochi",
      state: "Kerala",
      landmark: "Chinese Fishing Nets",
      imageUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/Chinese_fishingnet_kochi.jpg?width=1200",
      imageAttribution: "Challiyil Eswaramangalath Vipin / Wikimedia Commons (CC BY-SA 2.0)"
    },
    {
      city: "Bhopal",
      slug: "bhopal",
      state: "Madhya Pradesh",
      landmark: "Taj-ul-Masajid",
      imageUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/Taj-ul-Masjid%2C_Bhopal%2C_India.jpg?width=1200",
      imageAttribution: "Yann / Wikimedia Commons (CC BY-SA 4.0)"
    },
    {
      city: "Agra",
      slug: "agra",
      state: "Uttar Pradesh",
      landmark: "Taj Mahal",
      imageUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/Taj_Mahal%2C_Agra%2C_India.jpg?width=1200",
      imageAttribution: "Yann / Wikimedia Commons (CC BY-SA 4.0)"
    },
    {
      city: "Kanpur",
      slug: "kanpur",
      state: "Uttar Pradesh",
      landmark: "JK Temple",
      imageUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/JKTemple.JPG?width=1200",
      imageAttribution: "Sunshineroshan / Wikimedia Commons (CC BY-SA 3.0)"
    },
    {
      city: "Varanasi",
      slug: "varanasi",
      state: "Uttar Pradesh",
      landmark: "Dashashwamedh Ghat",
      locationTerms: "Varanasi,Banaras",
      imageUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/Dashashwamedh_Ghat%2C_Varanasi_(8717529602).jpg?width=1200",
      imageAttribution: "Matt Stabile / Wikimedia Commons (CC BY 2.0)"
    },
    {
      city: "Prayagraj",
      slug: "prayagraj",
      state: "Uttar Pradesh",
      landmark: "Triveni Sangam",
      locationTerms: "Prayagraj,Allahabad",
      imageUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/Prayagraj_Sangam_2.jpg?width=1200",
      imageAttribution: "Rangan Datta Wiki / Wikimedia Commons (CC BY-SA 4.0)"
    },
    {
      city: "Dehradun",
      slug: "dehradun",
      state: "Uttarakhand",
      landmark: "Forest Research Institute",
      imageUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/Forest_Research_Institute_in_Dehradun_39.jpg?width=1200",
      imageAttribution: "DesiBoy101 / Wikimedia Commons (CC BY 4.0)"
    },
    {
      city: "Haridwar",
      slug: "haridwar",
      state: "Uttarakhand",
      landmark: "Har Ki Pauri",
      imageUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/Har_ki_Pauri%2C_Haridwar_2.jpg?width=1200",
      imageAttribution: "आशीष_भटनागर / Wikimedia Commons (CC BY-SA 3.0)"
    },
    {
      city: "Jodhpur",
      slug: "jodhpur",
      state: "Rajasthan",
      landmark: "Mehrangarh Fort",
      imageUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/Mehrangarh_Fort_2%2C_Jodhpur%2C_Rajasthan%2C_India.jpg?width=1200",
      imageAttribution: "Yann / Wikimedia Commons (CC BY-SA 4.0)"
    },
    {
      city: "Ludhiana",
      slug: "ludhiana",
      state: "Punjab",
      landmark: "Thapar Hall, Punjab Agricultural University",
      imageUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/Thapar_Hall_PAU.jpg?width=1200",
      imageAttribution: "Jagmit Singh Brar / Wikimedia Commons (CC BY-SA 4.0)"
    },
    {
      city: "Amritsar",
      slug: "amritsar",
      state: "Punjab",
      landmark: "Golden Temple",
      imageUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/Golden_Temple%2C_Amritsar_01.jpg?width=1200",
      imageAttribution: "Bernard Gagnon / Wikimedia Commons (CC BY-SA 4.0)"
    },
    {
      city: "Jammu",
      slug: "jammu",
      state: "Jammu & Kashmir",
      landmark: "Bahu Fort",
      imageUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/Bahu_Fort%2C_Jammu%2C_India.jpg?width=1200",
      imageAttribution: "Nvvchar / Wikimedia Commons (CC BY-SA 3.0)"
    },
    {
      city: "Srinagar",
      slug: "srinagar",
      state: "Jammu & Kashmir",
      landmark: "Dal Lake",
      imageUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/Dal_Lake%2C_Srinagar%2C_Jammu_and_Kashmir.jpg?width=1200",
      imageAttribution: "Dashrathgoyal85 / Wikimedia Commons (CC BY-SA 4.0)"
    },
    {
      city: "Coimbatore",
      slug: "coimbatore",
      state: "Tamil Nadu",
      landmark: "Adiyogi Shiva Statue",
      imageUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/Adiyogi-2-Isha_yoga_centre-coimbatore-India.jpg?width=1200",
      imageAttribution: "Yercaud-elango / Wikimedia Commons (CC BY-SA 4.0)"
    },
    {
      city: "Thiruvananthapuram",
      slug: "thiruvananthapuram",
      state: "Kerala",
      landmark: "Padmanabhaswamy Temple",
      locationTerms: "Thiruvananthapuram,Trivandrum",
      imageUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/TVM_Padmanabhaswamy_Temple.jpg?width=1200",
      imageAttribution: "Shishirdasika / Wikimedia Commons (CC BY-SA 4.0)"
    },
    {
      city: "Kozhikode",
      slug: "kozhikode",
      state: "Kerala",
      landmark: "Kozhikode Beach",
      locationTerms: "Kozhikode,Calicut",
      imageUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/Kozhikode_Beach_Coastline.jpg?width=1200",
      imageAttribution: "Sulyab Thottungal / Wikimedia Commons (CC BY-SA 4.0)"
    },
    {
      city: "Mysuru",
      slug: "mysuru",
      state: "Karnataka",
      landmark: "Mysore Palace",
      locationTerms: "Mysuru,Mysore",
      imageUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/Mysore_Palace_WLM_2022_India_12.jpg?width=1200",
      imageAttribution: "Pavanaja / Wikimedia Commons (CC BY-SA 4.0)"
    },
    {
      city: "Mangaluru",
      slug: "mangaluru",
      state: "Karnataka",
      landmark: "St Aloysius Chapel",
      locationTerms: "Mangaluru,Mangalore",
      imageUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/St.Aloysius_Chapel%2CMangalore.jpg?width=1200",
      imageAttribution: "Vinay bhat / Wikimedia Commons (CC BY-SA 4.0)"
    },
    {
      city: "Visakhapatnam",
      slug: "visakhapatnam",
      state: "Andhra Pradesh",
      landmark: "RK Beach",
      locationTerms: "Visakhapatnam,Vizag",
      imageUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/RK_Beach_Visakhapatnam_Nov_2012_-_02.JPG?width=1200",
      imageAttribution: "Rishabh Tatiraju / Wikimedia Commons (CC BY-SA 3.0)"
    },
    {
      city: "Vijayawada",
      slug: "vijayawada",
      state: "Andhra Pradesh",
      landmark: "Prakasam Barrage",
      imageUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/Prakasam_Barrage%2CVijayawada_01.jpg?width=1200",
      imageAttribution: "Raghavan2010 / Wikimedia Commons (CC BY-SA 4.0)"
    },
    {
      city: "Tirupati",
      slug: "tirupati",
      state: "Andhra Pradesh",
      landmark: "Tirumala Hills",
      imageUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/Tirupati_city_from_Tirumala_ghat_road_(May_2019)_3.jpg?width=1200",
      imageAttribution: "IM3847 / Wikimedia Commons (CC BY-SA 4.0)"
    },
    {
      city: "Madurai",
      slug: "madurai",
      state: "Tamil Nadu",
      landmark: "Meenakshi Temple",
      imageUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/Meenakshi_Temple%2C_Madurai%2C_India.jpg?width=1200",
      imageAttribution: "Vyacheslav Argenberg / Wikimedia Commons (CC BY 4.0)"
    },
    {
      city: "Tiruchirappalli",
      slug: "tiruchirappalli",
      state: "Tamil Nadu",
      landmark: "Rockfort Temple",
      locationTerms: "Tiruchirappalli,Trichy",
      imageUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/ROCKFORT_TEMPLE%2C_Trichy.jpg?width=1200",
      imageAttribution: "Vijayshinde107 / Wikimedia Commons (CC BY-SA 4.0)"
    },
    {
      city: "Salem",
      slug: "salem",
      state: "Tamil Nadu",
      landmark: "Salem city view",
      imageUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/View_of_Salem_2.jpg?width=1200",
      imageAttribution: "Nancy Anburaj / Wikimedia Commons (CC BY-SA 4.0)"
    },
    {
      city: "Nashik",
      slug: "nashik",
      state: "Maharashtra",
      landmark: "Ram Kund",
      locationTerms: "Nashik,Nasik",
      imageUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/Ram_Kund%2C_Nashik_01.jpg?width=1200",
      imageAttribution: "Akshatha Inamdar / Wikimedia Commons (CC BY-SA 4.0)"
    },
    {
      city: "Nagpur",
      slug: "nagpur",
      state: "Maharashtra",
      landmark: "Deekshabhoomi",
      imageUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/Deekshabhoomi%2C_Nagpur_in_India.jpg?width=1200",
      imageAttribution: "Prakash Lokhande / Wikimedia Commons (CC BY-SA 4.0)"
    },
    {
      city: "Thane",
      slug: "thane",
      state: "Maharashtra",
      landmark: "Thane Creek",
      imageUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/ThaneCreek_-_August_2016.jpg?width=1200",
      imageAttribution: "Rehman Abubakr / Wikimedia Commons (CC BY-SA 4.0)"
    },
    {
      city: "Navi Mumbai",
      slug: "navi-mumbai",
      state: "Maharashtra",
      landmark: "Navi Mumbai skyline",
      imageUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/Navi_Mumbai_Skyline.jpg?width=1200",
      imageAttribution: "Anurupa Chowdhury / Wikimedia Commons (CC BY 3.0)"
    },
    {
      city: "Aurangabad",
      slug: "aurangabad",
      state: "Maharashtra",
      landmark: "Bibi Ka Maqbara",
      locationTerms: "Aurangabad,Sambhajinagar",
      imageUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/BIBI_KA_MAQBARA_(TOMB_OF_THE_LADY).jpg?width=1200",
      imageAttribution: "Abhideo21 / Wikimedia Commons (CC BY-SA 4.0)"
    },
    {
      city: "Surat",
      slug: "surat",
      state: "Gujarat",
      landmark: "Surat Fort",
      imageUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/Surat_Fort_(15345082318).jpg?width=1200",
      imageAttribution: "yndesai / Wikimedia Commons (CC BY-SA 2.0)"
    },
    {
      city: "Vadodara",
      slug: "vadodara",
      state: "Gujarat",
      landmark: "Laxmi Vilas Palace",
      locationTerms: "Vadodara,Baroda",
      imageUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/Laxmi_Vilas_Palace_-_Vadodara.jpg?width=1200",
      imageAttribution: "Emmanuel DYAN / Wikimedia Commons (CC BY 2.0)"
    },
    {
      city: "Rajkot",
      slug: "rajkot",
      state: "Gujarat",
      landmark: "Watson Museum",
      imageUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/Watson_Museum.jpg?width=1200",
      imageAttribution: "Sneha N Shetty / Wikimedia Commons (CC BY-SA 4.0)"
    },
    {
      city: "Gandhinagar",
      slug: "gandhinagar",
      state: "Gujarat",
      landmark: "Mahatma Mandir",
      imageUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/Mahatma_Mandir-Gandhinagar.jpg?width=1200",
      imageAttribution: "92saeedshaikh / Wikimedia Commons (CC BY-SA 4.0)"
    },
    {
      city: "Bhubaneswar",
      slug: "bhubaneswar",
      state: "Odisha",
      landmark: "Lingaraj Temple",
      imageUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/Lingaraja_Temple_01.jpg?width=1200",
      imageAttribution: "Bernard Gagnon / Wikimedia Commons (CC BY-SA 3.0)"
    },
    {
      city: "Cuttack",
      slug: "cuttack",
      state: "Odisha",
      landmark: "Barabati Fort",
      imageUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/Barabati_durga_Cuttack_Barabati_Fort_Front-1.JPG?width=1200",
      imageAttribution: "Daniel Limma / Wikimedia Commons (CC BY-SA 3.0)"
    },
    {
      city: "Guwahati",
      slug: "guwahati",
      state: "Assam",
      landmark: "Kamakhya Temple",
      imageUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/Kamakhya_Temple%2C_Guwahati.jpg?width=1200",
      imageAttribution: "Kunal Dalui / Wikimedia Commons (CC BY-SA 3.0)"
    },
    {
      city: "Ranchi",
      slug: "ranchi",
      state: "Jharkhand",
      landmark: "Pahari Mandir",
      imageUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/Pahari_Mandir_-_Ranchi_Hill_9242.JPG?width=1200",
      imageAttribution: "Biswarup Ganguly / Wikimedia Commons (CC BY 3.0)"
    },
    {
      city: "Jamshedpur",
      slug: "jamshedpur",
      state: "Jharkhand",
      landmark: "Jubilee Park",
      imageUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/Jubilee_Park_Jamshedpur.jpg?width=1200",
      imageAttribution: "Anupmahato / Wikimedia Commons (CC BY 3.0)"
    },
    {
      city: "Patna",
      slug: "patna",
      state: "Bihar",
      landmark: "Golghar",
      imageUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/Golghar%2C_Patna.jpg?width=1200",
      imageAttribution: "Nandanupadhyay / Wikimedia Commons (CC BY-SA 3.0)"
    },
    {
      city: "Gaya",
      slug: "gaya",
      state: "Bihar",
      landmark: "Vishnupad Temple",
      imageUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/Vishnupad_Temple-_Riverview.JPG?width=1200",
      imageAttribution: "Keymaker31 / Wikimedia Commons (CC BY-SA 3.0)"
    },
    {
      city: "Raipur",
      slug: "raipur",
      state: "Chhattisgarh",
      landmark: "Purkhouti Muktangan",
      imageUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/Purkhoti_Muktangan.jpg?width=1200",
      imageAttribution: "Shapeofyou20 / Wikimedia Commons (CC BY 4.0)"
    },
    {
      city: "Jabalpur",
      slug: "jabalpur",
      state: "Madhya Pradesh",
      landmark: "Marble Rocks, Bhedaghat",
      imageUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/Marble_Rocks_-_Jabalpur.jpg?width=1200",
      imageAttribution: "Anshikasjv12 / Wikimedia Commons (CC BY-SA 4.0)"
    },
    {
      city: "Gwalior",
      slug: "gwalior",
      state: "Madhya Pradesh",
      landmark: "Gwalior Fort",
      imageUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/Gwalior_Fort_-_Morning_View.jpg?width=1200",
      imageAttribution: "Abhishek Dwivedi / Wikimedia Commons (CC BY-SA 4.0)"
    },
    {
      city: "Faridabad",
      slug: "faridabad",
      state: "Haryana",
      landmark: "Surajkund",
      imageUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/Suraj_Kund_Masonary_004.jpg?width=1200",
      imageAttribution: "Anupamg / Wikimedia Commons (CC BY-SA 4.0)"
    },
    {
      city: "Ghaziabad",
      slug: "ghaziabad",
      state: "Uttar Pradesh",
      landmark: "Indirapuram",
      imageUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/Indirapuram.jpg?width=1200",
      imageAttribution: "Mnstwr2418 / Wikimedia Commons (CC BY-SA 3.0)"
    },
    {
      city: "Greater Noida",
      slug: "greater-noida",
      state: "Uttar Pradesh",
      landmark: "Greater Noida skyline",
      imageUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/Panoramic_view_of_Greater_Noida.jpg?width=1200",
      imageAttribution: "Him2586 / Wikimedia Commons (CC BY-SA 3.0)"
    },
    {
      city: "Sonipat",
      slug: "sonipat",
      state: "Haryana",
      landmark: "Sonipat city view",
      locationTerms: "Sonipat,Sonepat",
      imageUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/View_of_sonipat_city_from_one_corner_of_tomb.jpg?width=1200",
      imageAttribution: "Chiragb678 / Wikimedia Commons (CC BY-SA 4.0)"
    },
    {
      city: "Panipat",
      slug: "panipat",
      state: "Haryana",
      landmark: "Kabuli Bagh Mosque",
      imageUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/Kabuli_Bagh_Mosque.JPG?width=1200",
      imageAttribution: "Ramesh lalwani / Wikimedia Commons (CC BY-SA 3.0)"
    },
    {
      city: "Meerut",
      slug: "meerut",
      state: "Uttar Pradesh",
      landmark: "Ghantaghar",
      imageUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/Meerut_Ghantaghar.jpg?width=1200",
      imageAttribution: "Ravi Dwivedi / Wikimedia Commons (CC BY-SA 4.0)"
    },
    {
      city: "Bhiwadi",
      slug: "bhiwadi",
      state: "Rajasthan"
    },
    {
      city: "Tiruppur",
      slug: "tiruppur",
      state: "Tamil Nadu",
      landmark: "Tiruppur Kumaran Memorial",
      locationTerms: "Tiruppur,Tirupur",
      imageUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/Tiruppur_Kumaran_Memorial_20250418_01.jpg?width=1200",
      imageAttribution: "PJeganathan / Wikimedia Commons (CC BY-SA 4.0)"
    },
    {
      city: "Hubballi",
      slug: "hubballi",
      state: "Karnataka",
      landmark: "Unkal Lake",
      locationTerms: "Hubballi,Hubli",
      imageUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/Unkal_lake.jpg?width=1200",
      imageAttribution: "Mohammed aquib / Wikimedia Commons (CC BY-SA 4.0)"
    },
    {
      city: "Belagavi",
      slug: "belagavi",
      state: "Karnataka",
      landmark: "Kamal Basadi",
      locationTerms: "Belagavi,Belgaum",
      imageUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/Kamal_Basadi%2C_Belagavi%2C_Karnataka.jpg?width=1200",
      imageAttribution: "Nagaraj Sinhasan / Wikimedia Commons (CC BY-SA 4.0)"
    }
  ]
}

