import { useState, useEffect, useRef } from 'react'
import { ArrowRight, BriefcaseBusiness, Check, ChevronDown, Clock3, MapPin, Menu, ShieldCheck, Sparkles, UserRound, X } from 'lucide-react'
import { AnimatePresence, motion, useReducedMotion, useScroll, useSpring, useTransform } from 'framer-motion'
import { Link } from 'react-router-dom'
import { NAV_LINKS } from '../Landing-Frontend/src/lib/content'
import { CLIENT_ONLY_ROUTES } from '../Landing-Frontend/src/lib/routes'
import { buildJobsUrl } from '../Landing-Frontend/src/lib/jobsUrl'
import Seo from '../Landing-Frontend/src/components/Seo'
import { STATIC_PAGE_SEO } from '../Landing-Frontend/src/lib/seoData'
import { fetchLatestJobs } from '../Landing-Frontend/src/lib/publicJobs'
import CampusSection from '../Landing-Frontend/src/components/mz/home/CampusSection'
import { Reveal as BaseReveal } from '../Landing-Frontend/src/components/mz/primitives'
import CompaniesSection from '../Landing-Frontend/src/components/mz/home/CompaniesSection'
import Footer from '../Landing-Frontend/src/components/layout/Footer'
import SuccessStoriesSection from '../Landing-Frontend/src/components/mz/home/SuccessStoriesSection'
import LocomotiveScroll from 'locomotive-scroll';


const GET_STARTED_CARDS = [
  {
    title: 'For candidates',
    description: 'Get matched, not lost in the crowd. Build one profile and let the right jobs find you.',
    features: [
      'Verified companies, marked on every job',
      'Jobs matched to your skills and experience',
      'Track every application, step by step',
    ],
    Icon: UserRound,
    to: CLIENT_ONLY_ROUTES.employeeSignup,
    action: 'Create free account',
    mock: 'match',
    theme: 'candidate',
  },
  {
    title: 'For employers',
    description: 'Get quality talent, not a pile of resumes. Post, shortlist and hire in one pipeline.',
    features: [
      'Candidates matched to your requirement',
      'Post, shortlist and hire in one place',
      'Direct reach into 100+ campuses',
    ],
    Icon: BriefcaseBusiness,
    to: CLIENT_ONLY_ROUTES.employerSignup,
    action: 'Post a job',
    mock: 'pipeline',
    theme: 'employer',
  },
]

const ROLE_CATEGORIES = [
  { title: 'Technology', subtitle: 'Engineering, AI/ML', emoji: '💻', filters: { track: ['tech'] } },
  { title: 'Design & Creative', subtitle: 'Product, brand', emoji: '🎨', filters: { track: ['design'] } },
  { title: 'Marketing', subtitle: 'Growth, SEO', emoji: '📣', filters: { track: ['marketing'] } },
  { title: 'Sales & BD', subtitle: 'Field, inside', emoji: '📈', filters: { track: ['sales'] } },
  { title: 'HR & Recruitment', subtitle: 'Talent, people ops', emoji: '👥', filters: { track: ['hr'] } },
  { title: 'Data & Analytics', subtitle: 'BI, data science', emoji: '📊', filters: { track: ['analytics'] } },
  { title: 'Operations', subtitle: 'Supply, logistics', emoji: '⚙️', filters: { track: ['ops'] } },
  { title: 'Fresher jobs', subtitle: 'Internships, trainee', emoji: '🎓', filters: { experience: '0-1' } },
]

const JOURNEY_STEPS = {
  candidate: [
    { title: 'Create your free profile', description: 'Add your skills, experience and resume. It takes minutes, not an afternoon.' },
    { title: 'Get matched', description: 'See jobs that fit you, not random listings.' },
    { title: 'Apply and track', description: 'Follow every application in one place, from applied to interview.' },
    { title: 'Get hired', description: 'Go from profile to offer, faster.' },
  ],
  employer: [
    { title: 'Post your requirement', description: 'Describe the role in minutes: title, skills, location and budget.' },
    { title: 'Meet matched talent', description: 'Reach candidates who fit your needs, ranked by fit.' },
    { title: 'Shortlist and connect', description: 'Manage everything in one pipeline with your whole team.' },
    { title: 'Hire with confidence', description: 'Verified, relevant and quick.' },
  ],
}

const WHY_MZOBS_ROWS = [
  { label: 'Employer verification', typical: 'Inconsistent', mzobs: 'Every employer verified' },
  { label: "How you're matched", typical: 'Keyword search', mzobs: 'Skills & experience fit' },
  { label: 'Application tracking', typical: 'Scattered across sites', mzobs: 'One dashboard, every stage' },
  { label: 'Campus hiring', typical: 'Rarely built in', mzobs: '100+ campus partnerships' },
  { label: 'Recruiter tools', typical: 'Paid add-ons', mzobs: 'Built into every account' },
]

const FAQS = [
  { question: 'Is Mzobs free for candidates?', answer: 'Yes. Candidates can create a profile and explore opportunities for free.' },
  { question: 'Can freshers apply for jobs on Mzobs?', answer: 'Yes. Browse internships and entry-level roles, and connect with employers through campus hiring.' },
  { question: 'How are employers verified?', answer: 'Employers are reviewed before their jobs are published, helping candidates find more trustworthy opportunities.' },
  { question: 'How do I post a job?', answer: 'Create an employer account, add your role requirements, and manage applicants from your hiring pipeline.' },
  { question: 'How can I contact Mzobs support?', answer: 'Email support@mzobs.com or call +91 8756992444.' },
]

const H2 = 'font-heading text-[34px] font-medium leading-[1.18] tracking-[-0.04em] text-[#183451] sm:text-[40px]'

function Reveal(props) {
  return <BaseReveal once={false} {...props} />
}

function LatestJobCard({ job, decorative = false }) {
  const postedLabel = job.postedDaysAgo === 0
    ? 'Posted today'
    : job.postedDaysAgo === 1
      ? 'Posted yesterday'
      : job.postedDaysAgo != null
        ? `Posted ${job.postedDaysAgo} days ago`
        : 'Job opening'

  return (
    <Link
      to={`/jobs/${job.id ?? encodeURIComponent(job.title)}`}
      state={{ job }}
      tabIndex={decorative ? -1 : undefined}
      className="group relative flex h-[300px] w-[min(82vw,300px)] shrink-0 flex-col overflow-hidden rounded-2xl bg-white p-5 shadow-[0_14px_34px_-18px_rgba(22,50,79,0.28)] ring-1 ring-[#e5eaf0] transition-[transform,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-[0_14px_34px_-18px_rgba(22,50,79,0.28)] hover:ring-[#0b7a6d] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0b7a6d] sm:w-[320px]"
    >
      <span className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-[#0b7a6d] opacity-[0.07] transition-transform duration-500 group-hover:scale-125" aria-hidden="true" />
      <div className="relative flex items-start gap-3">
        <span className="grid h-9 w-9 shrink-0 place-items-center overflow-hidden rounded-full bg-[#0b7a6d] text-[13px] font-bold text-white">
          {job.logo ? (
            <img src={job.logo} alt="" loading="lazy" decoding="async" className="h-full w-full bg-white object-contain p-1" />
          ) : (
            (job.company || 'M').slice(0, 1).toUpperCase()
          )}
        </span>
        <div className="min-w-0 flex-1">
          <h3 className="line-clamp-2 min-h-10 text-[16px] font-bold leading-5 text-[#16324f] transition-colors group-hover:text-[#0b7a6d]">
            {job.title}
          </h3>
          <p className="mt-1 truncate text-[13px] text-[#627d8b]">
            {job.company || 'Mzobs employer'}
            {job.verified && <span className="font-semibold text-[#08745c]"> · Verified</span>}
          </p>
        </div>
        <ArrowRight size={15} aria-hidden="true" className="mt-1 shrink-0 text-[#0b7a6d]" />
      </div>
      <div className="relative mt-4 flex min-h-10 flex-wrap content-start gap-x-3 gap-y-1.5 text-[12px] text-[#627d8b]">
        {job.location && (
          <span className="inline-flex items-center gap-1">
            <MapPin size={12} aria-hidden="true" />
            {job.location}
          </span>
        )}
        {job.workMode && <span>{job.workMode}</span>}
        {job.experience && <span>{job.experience} experience</span>}
      </div>
      <div className="relative mt-3 flex flex-wrap items-center gap-2">
        {job.salary && <p className="line-clamp-2 text-[13px] font-semibold text-[#08745c]">{job.salary}</p>}
        {job.employmentType && (
          <span className="rounded-full bg-[#e7f5f1] px-2 py-0.5 text-[10px] font-semibold text-[#08745c]">
            {job.employmentType}
          </span>
        )}
      </div>
      {job.skills?.length > 0 && (
        <ul className="relative mt-3 flex max-h-12 flex-wrap gap-1.5 overflow-hidden" aria-label="Required skills">
          {job.skills.slice(0, 3).map((skill) => (
            <li key={skill} className="rounded-full bg-[#f3f6f8] px-2 py-1 text-[10px] text-[#627d8b]">
              {skill}
            </li>
          ))}
        </ul>
      )}
      <p className="relative mt-auto border-t border-[#e5eaf0] pt-3 text-[11px] font-medium text-[#8495a1]">
        <Clock3 size={12} aria-hidden="true" className="mr-1 inline-block align-[-2px]" />
        {postedLabel}
      </p>
    </Link>
  )
}

function CardMock({ type }) {
  if (type === 'match') {
    return (
      <div className="mt-5 rounded-[12px] bg-[#fafbf8] p-4 sm:p-[18px]">
        <div className="flex items-center justify-between gap-3">
          <p className="flex items-center gap-1.5 text-[10px] font-semibold text-[#08745c]">
            <Sparkles size={13} aria-hidden="true" />
            Sample match
          </p>
          <span className="text-[8px] font-bold uppercase tracking-wide text-[#82938a]">Product preview</span>
        </div>
        <div className="mt-4 flex items-end justify-between gap-3">
          <div>
            <p className="text-[12px] font-bold text-[#203b32]">Your profile fit</p>
            <p className="mt-0.5 text-[10px] text-[#819087]">Skills &amp; experience aligned</p>
          </div>
          <span className="text-[27px] font-semibold leading-none tracking-[-0.04em] text-[#08745c] sm:text-[30px]">92%</span>
        </div>
        <div className="mt-2.5 h-[6px] overflow-hidden rounded-full bg-[#d9e2d7]">
          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: '92%' }}
            viewport={{ once: true }}
            transition={{ duration: 1.4, delay: 0.3 }}
            className="h-full rounded-full bg-[#08745c]"
          />
        </div>
      </div>
    )
  }

  return (
    <div className="mt-5 rounded-[12px] bg-[#fafbf8] p-4 sm:p-[18px]">
      <div className="flex items-center justify-between gap-3">
        <p className="flex items-center gap-1.5 text-[10px] font-semibold text-[#08745c]">
          <BriefcaseBusiness size={13} aria-hidden="true" />
          Sample pipeline
        </p>
        <span className="text-[8px] font-bold uppercase tracking-wide text-[#82938a]">Product preview</span>
      </div>
      <div className="mt-3 grid grid-cols-4 gap-1.5 text-[9px] font-medium text-[#08745c] sm:gap-2">
        {[
          ['24', 'Applied'],
          ['9', 'Shortlist'],
          ['3', 'Interview'],
          ['1', 'Hired'],
        ].map(([count, label]) => (
          <div key={label} className="min-w-0 rounded-[6px] bg-[#edf2e9] px-2 py-2.5 sm:px-2.5">
            <b className="block text-[19px] font-semibold leading-none text-[#203b32] sm:text-[21px]">{count}</b>
            {label}
            <span className="mt-1.5 block h-[2px] w-7 max-w-full bg-[#08745c]" aria-hidden="true" />
          </div>
        ))}
      </div>
    </div>
  )
}

function Hero() {
  const reduceMotion = useReducedMotion()
  const heroRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end end'],
  })
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    restDelta: 0.001,
  })
  const progress = reduceMotion ? scrollYProgress : smoothProgress
  const logoOpacity = useTransform(progress, [0, 0.35, 0.72, 0.9], [1, 1, 0.25, 0])
  const logoScale = useTransform(progress, [0, 1], [1, 0.35])
  const logoY = useTransform(progress, [0, 1], ['0vh', '-24vh'])
  const taglineOpacity = useTransform(progress, [0, 0.28, 0.62, 0.82], [0, 0, 1, 1])
  const taglineScale = useTransform(progress, [0, 0.28, 0.82], [0.55, 0.55, 1.2])
  const taglineY = useTransform(progress, [0, 0.82], [20, 0])
  const ctaOpacity = useTransform(progress, [0.55, 0.82], [0, 1])
  const taglineWords = 'Unstoppable Yet Untrouble'.split(' ')

  return (
    <div ref={heroRef} className="relative h-[160vh]">
      <section
        id="home"
        className="sticky top-0 isolate flex h-screen items-center justify-center overflow-hidden bg-gradient-to-b from-teal-950 via-teal-900 to-slate-900 px-4"
      >
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute left-1/2 top-1/4 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-teal-500/15 blur-3xl" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(4,31,29,0.32)_100%)]" />
        </div>

        <div className="absolute inset-0 z-10 grid place-items-center px-4 text-center">
          <motion.div
            style={{ scale: logoScale, opacity: logoOpacity, y: logoY }}
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
          >
            <img
              src="/images/white-logo.png"
              alt="Mzobs"
              className="h-[clamp(160px,30vw,300px)] w-[min(92vw,800px)] object-contain"
            />
          </motion.div>

          <motion.div
            style={{ scale: taglineScale, y: taglineY, opacity: taglineOpacity }}
            className="absolute left-1/2 top-1/2 w-full -translate-x-1/2 -translate-y-1/2 px-2"
          >
            <h1
              className="font-heading flex flex-wrap justify-center gap-x-3 gap-y-1 text-4xl font-extrabold leading-[1.12] tracking-[-0.045em] text-white sm:text-5xl md:text-6xl"
            >
              {taglineWords.map((word, index) => (
                <motion.span
                  key={word}
                  initial={reduceMotion ? false : { y: 20, filter: 'blur(8px)' }}
                  animate={{ y: 0, filter: 'blur(0px)' }}
                  transition={{ duration: 0.5, delay: reduceMotion ? 0 : index * 0.1, ease: 'easeOut' }}
                  className={index === 1 ? 'italic text-teal-300' : 'text-white'}
                >
                  {word}
                </motion.span>
              ))}
            </h1>
          </motion.div>

          <motion.div style={{ opacity: ctaOpacity }} className="absolute bottom-10 left-1/2 -translate-x-1/2">
            <a
              href="#get-started-heading"
              className="group inline-flex items-center gap-2 rounded-full bg-teal-400 px-8 py-4 font-semibold text-teal-950 shadow-lg shadow-teal-900/40 transition-all hover:bg-teal-300 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-teal-200"
            >
              <span>Explore what&apos;s possible</span>
              <ArrowRight size={16} aria-hidden="true" className="transition-transform group-hover:translate-x-1" />
            </a>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

function WhyMzobsSection() {
  return (
    <section aria-labelledby="why-mzobs-heading" className="bg-[#f5f9f8] py-14 sm:py-16 lg:py-20">
      <div className="mx-auto max-w-[970px] px-5 sm:px-7">
       
        <Reveal as="h2" effect="heading" id="why-mzobs-heading" delay={0.04} className="mt-4 font-sans text-[34px] font-medium leading-[1.18] tracking-[-0.04em] text-[#183451] sm:text-[40px]">
          Why choose Mzobs?
          <span className="block text-[#078f80]">Why we stand apart.</span>
        </Reveal>
        <Reveal as="p" delay={0.08} className="mt-4 text-[14px] leading-6 text-[#8295a0] sm:text-[15px]">
          Others show you more jobs. Mzobs helps you find the right ones.
        </Reveal>

        <div className="mt-8 overflow-hidden rounded-[22px] border border-[#dcebe7] bg-white shadow-[0_18px_40px_-28px_rgba(24,52,81,0.28)]">
          <table className="w-full table-fixed border-collapse text-left">
            <colgroup>
              <col className="w-[31%]" />
              <col className="w-[31%]" />
              <col className="w-[38%]" />
            </colgroup>
            <thead>
              <tr className="text-[10px] font-extrabold uppercase tracking-[0.06em] text-[#8295a0] sm:text-[11px]">
                <th scope="col" className="h-[72px] px-3 align-middle sm:px-6">
                  <span className="mb-1.5 block h-[2px] w-6 bg-[#078f80]" aria-hidden="true" />
                  Feature
                </th>
                <th scope="col" className="h-[72px] px-2 align-middle sm:px-6">
                  Most job portals
                </th>
                <th scope="col" className="h-[72px] bg-[#078577] px-3 align-middle text-white sm:px-6">
                  <span className="block text-[18px] font-bold normal-case tracking-normal sm:text-[20px]">Mzobs</span>
                  <ShieldCheck size={18} strokeWidth={1.7} aria-hidden="true" className="mt-1" />
                </th>
              </tr>
            </thead>
            <tbody>
              {WHY_MZOBS_ROWS.map(({ label, typical, mzobs }) => (
                <tr key={label} className="border-t border-[#e2ece9]">
                  <th scope="row" className="h-[62px] px-3 text-[11px] font-bold leading-4 text-[#183451] sm:h-[70px] sm:px-6 sm:text-[13px]">
                    {label}
                  </th>
                  <td className="h-[62px] px-2 text-[10px] leading-4 text-[#8295a0] sm:h-[70px] sm:px-6 sm:text-[13px]">
                    {typical}
                  </td>
                  <td className="h-[62px] bg-[#eaf6f3] px-3 text-[10px] font-semibold leading-4 text-[#087c71] sm:h-[70px] sm:px-6 sm:text-[13px]">
                    <span className="flex items-center gap-2 sm:gap-3">
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-white text-[#078f80]">
                        <Check size={12} strokeWidth={3} aria-hidden="true" />
                      </span>
                      {mzobs}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}


const HomeLanding = () => {

  const locomotiveScroll = new LocomotiveScroll();

  const reduceMotion = useReducedMotion()
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const [journeyAudience, setJourneyAudience] = useState('candidate')
  const [jobs, setJobs] = useState([])
  const [jobsLoading, setJobsLoading] = useState(true)
  const [jobsError, setJobsError] = useState('')
  const [jobsRetry, setJobsRetry] = useState(0)
  const lightNavbar = scrolled || open

  const navLinks = NAV_LINKS.map((link) =>
    link.label === 'Find Jobs' ? { ...link, label: 'Candidate' } : link
  )

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY
      setScrolled(y > 4)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const controller = new AbortController()
    setJobsLoading(true)
    setJobsError('')
    fetchLatestJobs({ limit: 6, sort: 'newest' }, { signal: controller.signal })
      .then(({ jobs: latestJobs }) => setJobs(latestJobs))
      .catch((error) => {
        if (error?.name !== 'AbortError') {
          console.error('Failed to load latest jobs:', error)
          setJobs([])
          setJobsError('We couldn’t load the latest jobs. Check the jobs API connection and try again.')
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) setJobsLoading(false)
      })
    return () => controller.abort()
  }, [jobsRetry])

  return (
    <>
      <main id="services" className="min-h-screen bg-white pb-16 font-sans text-[#16324f] md:pb-0">
        <Seo path="/" {...STATIC_PAGE_SEO['/']} />


        <header className="fixed inset-x-0 top-0 z-50 h-16">
          <div
            className={`relative mx-auto flex items-center justify-between gap-6 border transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${scrolled || open
              ? 'mt-1.5 h-[52px] w-[calc(100%-24px)] max-w-[1080px] rounded-full border-white/70 bg-white/55 px-5 shadow-[0_12px_32px_-14px_rgba(16,42,67,0.3)] backdrop-blur-xl backdrop-saturate-150 md:px-7'
              : 'h-full w-full max-w-[1200px] border-transparent px-4 sm:px-6 lg:px-8'
              }`}
          >

            <Link to="/" aria-label="Mzobs home" className="shrink-0">
              <img src="/images/logo.png" alt="Mzobs" className="h-22 w-auto max-w-[225px] object-contain mix-blend-multiply sm:h-14" />
            </Link>

            <nav aria-label="Main navigation" className={`hidden flex-1 items-center gap-7 text-sm font-medium md:flex ${lightNavbar ? 'text-[#16324f]' : 'text-white'}`}>
              {navLinks.map((link) => (
                link.children ? (
                  <details key={link.label} className="group relative">
                    <summary className={`flex cursor-pointer list-none items-center gap-1 transition-colors ${lightNavbar ? 'hover:text-[#0b7a6d]' : 'hover:text-white/75'}`}>
                      {link.label}<ChevronDown size={14} aria-hidden="true" className="transition-transform group-open:rotate-180" />
                    </summary>
                    <div className="absolute left-0 top-full z-10 min-w-48 pt-3">
                      <div className="rounded-lg border border-[#dce5ec] bg-white py-1.5 shadow-lg">
                        {link.children.map((child) => (
                          <Link key={child.label} to={child.to} className="block px-4 py-2 text-sm text-[#16324f] hover:bg-[#eef8f4] hover:text-[#0b7a6d]">
                            {child.label}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </details>
                ) : (
                  <Link key={link.label} to={link.to} className={`transition-colors ${lightNavbar ? 'hover:text-[#0b7a6d]' : 'hover:text-white/75'}`}>
                    {link.label}
                  </Link>
                )
              ))}
            </nav>

            <div className="flex items-center gap-2">
              <Link to="/employers" className="rounded-[10px] bg-[#0b7a6d] px-3.5 py-2 text-xs font-semibold text-white shadow-[0_6px_16px_rgba(11,122,109,0.18)] transition-colors hover:bg-[#075f55] sm:px-4 sm:text-sm">
                For Employers
              </Link>
              <Link to="/employees/signin" className="rounded-[10px] bg-[#16324f] px-3.5 py-2 text-xs font-semibold text-white shadow-[0_6px_16px_rgba(22,50,79,0.18)] transition-colors hover:bg-[#10263d] sm:px-4 sm:text-sm">
                Sign in
              </Link>
            </div>
            <button
              type="button"
              aria-label={open ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={open}
              onClick={() => setOpen((value) => !value)}
              className={`flex h-10 w-10 items-center justify-center rounded-lg border md:hidden ${lightNavbar ? 'border-[#dce5ec] text-[#16324f]' : 'border-white/50 text-white'}`}
            >
              {open ? <X size={19} aria-hidden="true" /> : <Menu size={19} aria-hidden="true" />}
            </button>
          </div>
        </header>

        <Hero />

        <section aria-labelledby="get-started-heading" className="border-t border-[#e5eaf0] bg-[#f8faf7] py-12 sm:py-14">
          <div className="mx-auto max-w-[1024px] px-5 sm:px-7">
            <div className="max-w-[820px]">
              <Reveal as="h2" effect="heading" id="get-started-heading" delay={0.04} className="font-heading text-[38px] font-semibold leading-[1.08] tracking-[-0.045em] text-[#17372f] sm:text-[46px]">
                What&apos;s Mzobs?
              </Reveal>
              <Reveal as="p" delay={0.08} className="mt-4 text-[14px] leading-[1.75] text-[#718279] sm:text-[15px]">
                Mzobs is a hiring platform where candidates get matched, not lost in the crowd, and employers get quality talent, not a pile of resumes. Whether you&apos;re a fresher chasing your first role, a professional ready for the next move, or a company that needs the right hire fast, you get one place to make it happen.
              </Reveal>
            </div>
            <div className="mt-8 grid gap-4 md:grid-cols-2 sm:mt-9">
              {GET_STARTED_CARDS.map(({ title, description, features, Icon, to, action, mock, theme }, index) => {
                const candidate = theme === 'candidate'
                return (
                <Reveal
                  as="article"
                  key={title}
                  delay={index * 0.08}
                  className={`group flex min-h-[430px] flex-col rounded-[18px] p-5 transition-transform duration-300 hover:-translate-y-1 sm:min-h-[450px] sm:p-6 ${candidate ? 'bg-[#edf2e9] ring-1 ring-[#d8e2d5]' : 'bg-[#103f33] text-white'}`}
                >
                  <div className="flex items-center gap-3">
                    <span className={`flex h-[36px] w-[36px] shrink-0 items-center justify-center rounded-[9px] ${candidate ? 'bg-white/80 text-[#08745c]' : 'bg-[#08745c] text-[#d4e9a5]'}`}>
                      <Icon size={17} strokeWidth={1.8} aria-hidden="true" />
                    </span>
                    <Reveal as="h3" effect="heading" className={`font-heading text-[20px] font-semibold leading-tight tracking-[-0.025em] sm:text-[22px] ${candidate ? 'text-[#203b32]' : 'text-white'}`}>{title}</Reveal>
                  </div>
                  <p className={`mt-3 text-[12px] leading-[1.65] sm:text-[13px] ${candidate ? 'text-[#718279]' : 'text-white/65'}`}>{description}</p>
                  <CardMock type={mock} />
                  <ul className={`mt-4 grid gap-2 text-[11px] leading-4 sm:text-[12px] ${candidate ? 'text-[#344a40]' : 'text-white/70'}`}>
                    {features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2">
                        <Check size={14} strokeWidth={2.4} aria-hidden="true" className={`mt-0.5 shrink-0 ${candidate ? 'text-[#08745c]' : 'text-[#d4e9a5]'}`} />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Link to={to} className={`mt-auto inline-flex h-[40px] w-full items-center justify-between rounded-[6px] px-4 text-[11px] font-bold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#08745c] ${candidate ? 'bg-[#08745c] text-white hover:bg-[#066249]' : 'bg-[#d4e9a5] text-[#17372f] hover:bg-[#c7df91]'}`}>
                    {action} <ArrowRight size={15} aria-hidden="true" />
                  </Link>
                </Reveal>
                )
              })}
            </div>
            <p className="mt-3 flex items-center gap-1.5 text-[9px] leading-4 text-[#84938b]">
              <span aria-hidden="true" className="text-[11px]">ⓘ</span>
              Illustrative product previews. Match scores and pipeline counts are sample data, not performance claims.
            </p>
          </div>
        </section>

        <section aria-labelledby="journey-heading" className="bg-[#eef8f4] py-12 sm:py-14">
          <div className="mx-auto max-w-[940px] px-5 sm:px-7 lg:px-0">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
              <Reveal as="h2" effect="heading" id="journey-heading" className={H2}>
                How Mzobs works.<br className="hidden sm:block" /> Four steps, either side.
              </Reveal>
              <Reveal as="div" delay={0.08} role="group" aria-label="Choose your journey" className="inline-flex w-fit rounded-[12px] border border-[#dce5ec] bg-white p-1">
                {[
                  { id: 'candidate', label: 'For candidates' },
                  { id: 'employer', label: 'For employers' },
                ].map(({ id, label }) => (
                  <button
                    key={id}
                    type="button"
                    aria-pressed={journeyAudience === id}
                    onClick={() => setJourneyAudience(id)}
                    className={`min-h-10 rounded-[9px] px-4 text-[13px] font-semibold transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0b7a6d] ${journeyAudience === id
                      ? 'bg-[#0b7a6d] text-white shadow-sm'
                      : 'text-[#627d8b] hover:text-[#16324f]'
                      }`}
                  >
                    {label}
                  </button>
                ))}
              </Reveal>
            </div>
            <AnimatePresence mode="wait" initial={false}>
              <motion.ol
                key={journeyAudience}
                initial={reduceMotion ? false : { opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduceMotion ? { opacity: 1 } : { opacity: 0, y: -8 }}
                transition={{ duration: reduceMotion ? 0 : 0.28, ease: [0.22, 1, 0.36, 1] }}
                className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
              >
                {JOURNEY_STEPS[journeyAudience].map(({ title, description }, index) => (
                  <Reveal
                    as="li"
                    key={`${journeyAudience}-${title}`}
                    delay={index * 0.08}
                    className="group relative flex min-h-[220px] flex-col overflow-hidden rounded-2xl bg-white p-5 shadow-[0_14px_34px_-18px_rgba(22,50,79,0.28)] ring-1 ring-[#e5eaf0] transition-[transform,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-[0_14px_34px_-18px_rgba(22,50,79,0.28)]"
                  >
                    <span className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-[#0b7a6d] opacity-[0.07] transition-transform duration-500 group-hover:scale-125" aria-hidden="true" />
                    <span className="relative flex h-9 w-9 items-center justify-center rounded-full bg-[#0b7a6d] text-[14px] font-bold text-white">
                      {index + 1}
                    </span>
                    <Reveal as="h3" effect="heading" className="relative mt-4 text-[16px] font-bold leading-5 text-[#16324f]">{title}</Reveal>
                    <p className="relative mt-2 flex-1 text-[13.5px] leading-relaxed text-[#627d8b]">{description}</p>
                  </Reveal>
                ))}
              </motion.ol>
            </AnimatePresence>
          </div>
        </section>

        <section id="latest-jobs" aria-labelledby="latest-jobs-heading" className="scroll-mt-20 bg-white py-12 sm:py-14">
          <div className="mx-auto max-w-[940px] px-5 sm:px-7 lg:px-0">
            <div className="flex items-end justify-between gap-4">
              <Reveal as="h2" effect="heading" id="latest-jobs-heading" className={H2}>
                Latest jobs on Mzobs
              </Reveal>
              <Link to="/jobs" className="mb-1 inline-flex shrink-0 items-center gap-1 text-[13px] font-semibold text-[#0b7a6d] transition-colors hover:text-[#075f55]">
                View all jobs <ArrowRight size={14} aria-hidden="true" />
              </Link>
            </div>
            <div className="mt-7 overflow-hidden" aria-busy={jobsLoading || undefined}>
              {jobsLoading ? (
                <div className="flex gap-4">
                  {Array.from({ length: 3 }).map((_, index) => (
                    <div key={index} className="h-[190px] w-[min(82vw,300px)] shrink-0 animate-pulse rounded-[18px] bg-[#eef8f4] sm:w-[320px]" />
                  ))}
                </div>
              ) : jobsError ? (
                <div role="alert" className="rounded-lg border border-[#f0d7c8] bg-[#fff9f5] px-4 py-6 text-center">
                  <p className="text-[12px] text-[#81543b]">{jobsError}</p>
                  <button
                    type="button"
                    onClick={() => setJobsRetry((attempt) => attempt + 1)}
                    className="mt-3 rounded-full bg-[#0b7a6d] px-4 py-2 text-[12px] font-semibold text-white transition-colors hover:bg-[#075f55] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0b7a6d]"
                  >
                    Try again
                  </button>
                </div>
              ) : jobs.length ? (
                <motion.div
                  initial={reduceMotion ? { x: 0 } : { x: '-50%' }}
                  animate={reduceMotion ? { x: 0 } : { x: ['-50%', '0%'] }}
                  transition={reduceMotion ? undefined : { duration: Math.max(24, jobs.length * 5), ease: 'linear', repeat: Infinity }}
                  className="flex w-max"
                  role="region"
                  aria-label="Latest job openings"
                  aria-roledescription="carousel"
                >
                  {[true, false].map((decorative) => (
                    <ul key={String(decorative)} className="flex shrink-0 gap-4 pr-4" aria-hidden={decorative || undefined}>
                      {jobs.map((job) => (
                        <li key={`${decorative ? 'copy-' : ''}${job.id ?? job.title}`}>
                          <LatestJobCard job={job} decorative={decorative} />
                        </li>
                      ))}
                    </ul>
                  ))}
                </motion.div>
              ) : (
                <p className="rounded-lg border border-dashed border-[#dce5e8] px-4 py-6 text-center text-[12px] text-[#627d8b]">
                  New opportunities are on their way. Check back soon.
                </p>
              )}
            </div>
          </div>
        </section>

        <section id="categories" aria-labelledby="role-categories-heading" className="scroll-mt-20 bg-[#eef8f4] py-12 sm:py-14">
          <div className="mx-auto max-w-[940px] px-5 sm:px-7 lg:px-0">
          <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
            <Reveal as="h2" effect="heading" id="role-categories-heading" className="font-heading max-w-[440px] text-[34px] font-medium leading-[1.18] tracking-[-0.04em] text-[#16324f] sm:text-[40px]">
              Browse roles by<br className="hidden sm:block" /> what you&apos;re good at.
            </Reveal>
            <Reveal as="div" delay={0.08}>
              <Link to="/#categories" className="inline-flex items-center gap-1 text-[13px] font-semibold text-[#0b7a6d] transition-colors hover:text-[#075f55] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0b7a6d]">
                See all categories <ArrowRight size={15} aria-hidden="true" />
              </Link>
            </Reveal>
          </div>
          <ul className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            {ROLE_CATEGORIES.map(({ title, subtitle, emoji, filters }, index) => (
              <Reveal as="li" key={title} delay={index * 0.05}>
                <a
                  href={buildJobsUrl(filters)}
                  className={`group flex min-h-[104px] flex-col justify-center rounded-[16px] bg-white px-5 py-4 transition-[transform,box-shadow] duration-300 hover:-translate-y-1.5 hover:shadow-[0_14px_34px_-18px_rgba(22,50,79,0.28)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0b7a6d]`}
                >
                  <span className="text-[22px]" aria-hidden="true">{emoji}</span>
                  <span className="mt-1 text-[14px] font-bold text-[#16324f]">{title}</span>
                  <span className="text-[12px] text-[#627d8b]">{subtitle}</span>
                </a>
              </Reveal>
            ))}
          </ul>
          </div>
        </section>

        <CompaniesSection />

        <WhyMzobsSection />

        <CampusSection />
        <SuccessStoriesSection />

        <section aria-labelledby="faq-heading" className="bg-white py-12 sm:py-14">
          <div className="mx-auto max-w-[940px] px-5 sm:px-7 lg:px-0">
            <Reveal as="h2" effect="heading" id="faq-heading" className={H2}>
              Frequently asked questions.
            </Reveal>
            <div className="mt-6 max-w-[720px] space-y-3">
              {FAQS.map(({ question, answer }) => (
                <Reveal key={question}>
                  <details className="group rounded-[14px] bg-white px-5 py-4 ring-1 ring-[#e5eaf0]">
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-[14px] font-bold text-[#16324f]">
                      {question}
                      <span aria-hidden="true" className="text-[20px] font-normal text-[#0b7a6d] transition-transform duration-300 group-open:rotate-45">+</span>
                    </summary>
                    <p className="mt-2.5 text-[14px] leading-6 text-[#627d8b]">{answer}</p>
                  </details>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-[#eef8f4] px-5 py-12 sm:px-7 sm:py-14">
          <Reveal>
            <div className="relative mx-auto max-w-[940px] overflow-hidden rounded-[22px] bg-[#0A3A35] px-6 py-14 text-center sm:px-10">
              <div aria-hidden="true" className="absolute -left-16 -top-20 h-[300px] w-[300px] rounded-full bg-[#0b7a6d] opacity-30 blur-[70px]" />
              <Reveal as="h2" effect="heading" className="relative mx-auto max-w-[520px] font-sans text-[26px] font-extrabold leading-[1.18] tracking-[-0.035em] text-white sm:text-[32px]">
                Talent is everywhere. Opportunity is here.
              </Reveal>
              <p className="relative mt-3 text-[14px] text-white/75">Let&apos;s connect the two.</p>
              <div className="relative mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <Link to={CLIENT_ONLY_ROUTES.employeeSignup} className="inline-flex h-[44px] items-center gap-1.5 rounded-full bg-white px-6 text-[13px] font-bold text-[#0A3A35] transition-transform hover:-translate-y-0.5">
                  Create free account <ArrowRight size={15} aria-hidden="true" />
                </Link>
                <Link to={CLIENT_ONLY_ROUTES.employerSignup} className="inline-flex h-[44px] items-center rounded-full border border-white/50 px-6 text-[13px] font-bold text-white transition-colors hover:bg-white/10">
                  Post a job
                </Link>
              </div>
            </div>
          </Reveal>
        </section>

        <div className="fixed inset-x-0 bottom-0 z-40 flex gap-2.5 border-t border-[#e5eaf0] bg-white px-3.5 pb-[calc(10px+env(safe-area-inset-bottom,0px))] pt-2.5 md:hidden">
          <Link to={CLIENT_ONLY_ROUTES.employeeSignup} className="flex-1 rounded-full bg-[#16324f] py-3 text-center text-[13px] font-bold text-white">
            Find jobs
          </Link>
          <Link to={CLIENT_ONLY_ROUTES.employerSignup} className="flex-1 rounded-full bg-[#0b7a6d] py-3 text-center text-[13px] font-bold text-white">
            Post a job
          </Link>
        </div>

        <AnimatePresence>
          {open && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 top-16 z-40 bg-black/25 md:hidden"
                onClick={() => setOpen(false)}
                aria-hidden="true"
              />
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.18 }}
                className="fixed inset-x-0 top-16 z-40 max-h-[calc(100vh-4rem)] overflow-y-auto border-b border-[#e5eaf0] bg-white shadow-lg md:hidden"
              >
                <nav aria-label="Mobile navigation" className="flex flex-col px-5 pb-5 pt-2">
                  {navLinks.map((link) => (
                    <div key={link.label} className="border-b border-[#e5eaf0] py-3">
                      {link.to ? (
                        <Link to={link.to} onClick={() => setOpen(false)} className="text-sm font-semibold text-[#16324f]">
                          {link.label}
                        </Link>
                      ) : (
                        <>
                          <span className="text-sm font-semibold text-[#16324f]">{link.label}</span>
                          <div className="mt-2 flex flex-col gap-2 pl-3">
                            {link.children.map((child) => (
                              <Link key={child.label} to={child.to} onClick={() => setOpen(false)} className="text-sm text-[#627d8b] hover:text-[#0b7a6d]">
                                {child.label}
                              </Link>
                            ))}
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                </nav>
              </motion.div>
            </>
          )}
        </AnimatePresence>


      </main>
      <div className="pb-16 md:pb-0">
        <Footer />
      </div>
    </>
  )
}

export default HomeLanding
