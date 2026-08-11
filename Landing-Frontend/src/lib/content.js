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
  Users2
} from 'lucide-react'

export const NAV_LINKS = [
  { label: 'Home', href: '#home', to: '/' },
  { label: 'Services', href: '#services', to: '/services' },
  { label: 'About Us', href: '#who-we-are', to: '/about' },
  { label: 'Case Studies', href: '#case-studies', to: '/case-studies' },
  { label: 'FAQs', href: '#faqs', to: '/faqs' },
]

export const HERO_DATA = {
  titleLine1: "Strategy That",
  titleItalic: "Powers Your Next",
  titleLine2: "Level of Growth.",
  subtitle: "We help businesses unlock opportunities, scale faster, and achieve measurable results through data-driven strategies.",
  ctaText: "Book a Consultation",
  bgImage: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&w=2000&q=85"
}

export const WHO_WE_ARE_DATA = {
  badge: "WHO WE ARE",
  statement: [
    { text: "Stratwell Consulting is a " },
    { text: "results-driven", italic: true },
    { text: " business consultancy " },
    { text: "helping", italic: true },
    { text: " leaders " },
    { text: "navigate", italic: true },
    { text: " complexity, " },
    { text: "refine", italic: true },
    { text: " strategy, and " },
    { text: "achieve", italic: true },
    { text: " sustainable growth." }
  ],
  stats: [
    {
      number: "92%",
      label: "Of clients report measurable performance improvements within 1 year."
    },
    {
      number: "$50M+",
      label: "In revenue growth generated across client portfolios in the last 3 years."
    },
    {
      number: "100+",
      label: "Businesses advised across industries from tech startups to established enterprises."
    },
    {
      number: "15+",
      label: "Years of combined expertise guiding business strategy and execution."
    }
  ]
}

export const SERVICES_DATA = {
  badge: "OUR SERVICES",
  titlePrefix: "Our ",
  titleItalic: "Expertise",
  services: [
    {
      icon: Target,
      title: "Business Strategy",
      desc: "Set the right direction with market insights and actionable roadmaps."
    },
    {
      icon: Settings,
      title: "Operations Optimization",
      desc: "Streamline workflows, cut costs, and boost efficiency."
    },
    {
      icon: Sparkles,
      title: "Digital Transformation",
      desc: "Set the right direction with market insights and actionable roadmaps."
    },
    {
      icon: BarChart3,
      title: "Financial Advisory",
      desc: "Improve performance, reduce risk, and unlock growth capital."
    }
  ],
  featuredCard: {
    titlePrefix: "Start Your ",
    titleItalic: "Growth Journey",
    ctaText: "Get In Touch",
    bgImage: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=1200&q=85"
  }
}

export const CASE_STUDIES_DATA = {
  badge: "CASE STUDIES",
  titlePrefix: "Proven ",
  titleItalic: "Results",
  titleSuffix: " Across Industries",
  items: [
    {
      id: "saas-startup",
      tags: ["BUSINESS STRATEGY", "SAAS STARTUP"],
      title: "Helped a SaaS startup grow revenue 65% in 12 months.",
      italicWords: "grow revenue",
      desc: "We helped a fast-growing SaaS company refine its go-to-market strategy, resulting in a 65% increase in ARR in 12 months.",
      bgImage: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1600&q=85"
    },
    {
      id: "manufacturing",
      tags: ["OPERATIONS OPTIMIZATION", "MANUFACTURING"],
      title: "20% Cost Savings & Efficiency",
      italicWords: null,
      desc: "Through a detailed operations audit, process redesign, and automation of key workflows, we reduced overhead by 20% while improving on-time delivery rates and overall efficiency.",
      bgImage: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1600&q=85"
    },
    {
      id: "e-commerce",
      tags: ["FINANCIAL ADVISORY", "E-COMMERCE"],
      title: "Transforming Financial Strategy for Sustainable Growth",
      italicWords: "Financial Strategy",
      desc: "A leading consulting firm helped a mid-market enterprise optimize finances, improve cash flow, and implement strategic investments, resulting in increased profitability and long-term business roadmap.",
      bgImage: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1600&q=85"
    }
  ]
}

export const TESTIMONIALS_DATA = {
  badge: "TESTIMONIALS",
  titlePrefix: "What ",
  titleItalic: "Our Clients",
  titleSuffix: " Say",
  items: [
    {
      id: 1,
      image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=800&q=85",
      quote: "Stratwell provided key strategic insights that allowed us to double our operational speed in under 6 months.",
      name: "Sarah Jenkins",
      title: "VP Operations, Apex"
    },
    {
      id: 2,
      image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=800&q=85",
      quote: "Stratwell gave us clarity when we needed it most and results that exceeded expectations.",
      name: "Mike Scott",
      title: "COO, Tech"
    },
    {
      id: 3,
      image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=800&q=85",
      quote: "Working with them gave us back valuable time, reduced expenses, and simplified everything.",
      name: "Anna White",
      title: "CEO, Nexa Group"
    },
    {
      id: 4,
      image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=800&q=85",
      quote: "They transformed our work by streamlining operations, boosting efficiency, and delivering results.",
      name: "Mario Fotiou",
      title: "CFO, Constructo"
    },
    {
      id: 5,
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=85",
      quote: "What impressed me most was how quickly they understood our industry and delivered immediate value.",
      name: "John Smith",
      title: "CEO, Innovate"
    }
  ]
}

export const OUR_GOAL_DATA = {
  badge: "OUR GOAL",
  titlePrefix: "Transforming ",
  titleItalic: "Strategy",
  titleSuffix: " into Results",
  desc: "Our team brings together expertise in strategy, operations, finance, and digital transformation, with one shared mission: to simplify complexity and deliver results that last. Whether it's entering new markets, streamlining processes, or guiding organizational change, we focus on creating solutions that are practical, actionable, and aligned with your goals.",
  ctaText: "Meet Our Team",
  image: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=1200&q=85"
}

export const APPROACH_DATA = {
  badge: "OUR APPROACH",
  heading: [
    { text: "At Stratwell Consulting, we believe that " },
    { text: "strategy", italic: true },
    { text: " should do more than " },
    { text: "sit on paper", italic: true },
    { text: " — it should drive " },
    { text: "measurable", italic: true },
    { text: " change." }
  ],
  image: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1200&q=85",
  steps: [
    {
      num: "01",
      icon: Lightbulb,
      title: "Understand",
      desc: "We immerse ourselves in your business to uncover challenges and opportunities."
    },
    {
      num: "02",
      icon: BarChart2,
      title: "Strategize",
      desc: "We design tailored strategies that align with your goals and available resources."
    },
    {
      num: "03",
      icon: Rocket,
      title: "Implement",
      desc: "We guide execution to ensure solutions are practical, effective, and scalable."
    },
    {
      num: "04",
      icon: Target,
      title: "Measure",
      desc: "We monitor performance, refine processes, and deliver clear, tangible results."
    }
  ]
}

export const TRUSTED_LOGOS_DATA = {
  badge: "WE WORK WITH",
  title: "Trusted By",
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
  titlePrefix: "Ready to ",
  titleItalic: "Transform",
  titleSuffix: " Your Business?",
  desc: "Schedule a free consultation and discover how Stratwell Consulting can streamline your operations, optimize performance, and deliver measurable results.",
  ctaText: "Get Started Today",
  bgImage: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=2000&q=85"
}

export const FOOTER_DATA = {
  logoText: "Stratwell",
  logoSub: "CONSULTING",
  desc: "Stratwell Consulting helps businesses streamline operations, optimize performance, and achieve measurable growth.",
  ctaText: "Contact Us",
  menuTitle: "Menu",
  menuItems: ["Home", "Services", "About Us", "Case Studies", "FAQs", "Contact"],
  socialsTitle: "Socials",
  socialsItems: ["Instagram", "Facebook", "LinkedIn", "Twitter (X)"],
  contactTitle: "Contact",
  phone: "+1 (555) 087-6543",
  email: "contact@stratwellconsulting.com",
  address: "450 Stratwell Avenue, Suite 500, Boston, MA 02110, USA",
  copyright: "© 2026 Stratwell Consulting Framer Template",
  rightLinks: ["Privacy Policy", "Built in Framer", "Created by Champion"]
}

// Legacy exports compatibility
export const HOME_STATS = WHO_WE_ARE_DATA.stats.map(s => ({ value: s.number, label: s.label }))
export const EMPLOYEE_STATS = HOME_STATS
export const EMPLOYER_STATS = HOME_STATS
export const HOME_FEATURES = SERVICES_DATA.services
export const EMPLOYEE_FEATURES = SERVICES_DATA.services
export const EMPLOYER_FEATURES = SERVICES_DATA.services
export const HOME_STEPS = APPROACH_DATA.steps
export const EMPLOYEE_STEPS = APPROACH_DATA.steps
export const EMPLOYER_STEPS = APPROACH_DATA.steps
export const TEAM = [
  { name: 'Sarah Jenkins', role: 'VP Operations', initials: 'SJ' },
  { name: 'Mike Scott', role: 'COO', initials: 'MS' },
  { name: 'Anna White', role: 'CEO', initials: 'AW' },
  { name: 'Mario Fotiou', role: 'CFO', initials: 'MF' }
]
export const TRUSTED_LOGOS = TRUSTED_LOGOS_DATA.logos.map(l => l.name)
export const EMPLOYEE_TESTIMONIAL = TESTIMONIALS_DATA.items[0]
export const EMPLOYER_TESTIMONIAL = TESTIMONIALS_DATA.items[1]
export const HOME_TESTIMONIALS = TESTIMONIALS_DATA.items
