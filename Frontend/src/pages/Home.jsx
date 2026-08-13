import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  ArrowRight,
  Briefcase,
  CheckCircle2,
  FileText,
  GraduationCap,
  ShieldCheck,
  Sparkles,
  Video,
} from 'lucide-react'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import Badge from '../components/ui/Badge'
import CountUp from '../components/ui/CountUp'
import { StaggerGroup, StaggerItem } from '../components/ui/Stagger'
import CandidateJourneySection from '../components/sections/CandidateJourneySection'
import { EMPLOYEE_SIGNIN_URL, EMPLOYEE_SIGNUP_URL } from '../lib/config'

const STATS = [
  [12400, '+', 'Profiles verified'],
  [3180, '+', 'Interviews arranged'],
  [96, '%', 'Would recommend'],
]

const FEATURES = [
  { icon: FileText, title: 'Resume Center', desc: 'Your resume rebuilt and reviewed by placement experts, not a template generator.', image: '/images/services/service-pipeline.jpg' },
  { icon: Video, title: 'Mock Interviews', desc: 'Practice with real interviewers so the actual one feels like a formality.', image: '/images/services/service-interviews.jpg' },
  { icon: GraduationCap, title: 'Guided Training', desc: 'Two-week focused tracks built around the roles that are actually hiring.', image: '/images/services/service-pipeline.jpg' },
  { icon: Briefcase, title: 'Job Matching', desc: 'Curated openings filtered to your track — no scrolling through noise.', image: '/images/services/service-matching.jpg' },
  { icon: Sparkles, title: 'Application Tracking', desc: 'One dashboard for every application, interview and offer status.', image: '/images/services/service-analytics.jpg' },
]

const ABOUT_STATS = [
  ['96%', 'Would recommend Mzobs to a friend'],
  ['12,400+', 'Profiles verified by our team'],
  ['3,180+', 'Interviews arranged for candidates'],
  ['2 weeks', 'Average time to first interview'],
]

export default function Home() {
  return (
    <div className="min-h-screen bg-bg">
      {/* Nav */}
      <header className="sticky top-0 z-40 border-b border-border bg-bg/80 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-[30px] h-[30px] rounded-[9px] bg-gradient-to-br from-navy-700 to-navy flex items-center justify-center text-sm font-extrabold text-white shadow-navy">M</div>
            <span className="text-[17px] font-bold">Mzobs</span>
            <span className="text-[10px] font-bold tracking-wide uppercase text-navy bg-navy-tint px-1.5 py-[3px] rounded-md">For Employees</span>
          </div>

          <nav className="hidden md:flex items-center gap-7 text-[13.5px] font-medium text-ink-secondary">
            <Link to="#features" className="hover:text-ink transition-colors duration-200">Features</Link>
            <Link to="#how-it-works" className="hover:text-ink transition-colors duration-200">How it works</Link>
            <Link to="#story" className="hover:text-ink transition-colors duration-200">Success stories</Link>
          </nav>

          <div className="flex items-center gap-2.5">
            <Button variant="ghost" size="md" onClick={() => (window.location.href = EMPLOYEE_SIGNIN_URL)}>Sign in</Button>
            <Button variant="primary" size="md" onClick={() => (window.location.href = EMPLOYEE_SIGNUP_URL)}>
              Get started <ArrowRight size={15} />
            </Button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden bg-navy-950 text-white">
        <div
          className="absolute -inset-[10%] animate-[blobPulse_13s_ease-in-out_infinite]"
          style={{
            background:
              'radial-gradient(560px 420px at 15% 10%, rgba(255,255,255,.08), transparent 60%), radial-gradient(520px 520px at 92% 88%, rgba(198,138,31,.20), transparent 60%), radial-gradient(460px 460px at 15% 85%, rgba(125,95,214,.22), transparent 65%), radial-gradient(420px 420px at 60% 40%, rgba(43,62,104,.35), transparent 65%)',
          }}
        />
        <div
          className="absolute inset-0 opacity-50"
          style={{
            backgroundImage: 'radial-gradient(rgba(255,255,255,.08) 1px, transparent 1px)',
            backgroundSize: '26px 26px',
            maskImage: 'radial-gradient(circle at 50% 20%, #000 0%, transparent 65%)',
          }}
        />

        <div className="relative max-w-4xl mx-auto px-6 pt-20 pb-24 text-center">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            <Badge tone="gold" className="mb-5">Career Success Platform</Badge>
            <h1 className="text-[clamp(2rem,5vw,3.25rem)] font-bold tracking-tight leading-[1.1]">
              Land the job you're actually qualified for — faster.
            </h1>
            <p className="text-white/70 text-[15.5px] mt-5 max-w-xl mx-auto leading-relaxed">
              Verified resumes, guided training and real mock interviews — everything between "job hunting" and "placed", in one dashboard.
            </p>

            <div className="flex items-center justify-center gap-3 mt-8 flex-wrap">
              <Button variant="primary" size="lg" onClick={() => (window.location.href = EMPLOYEE_SIGNUP_URL)} className="bg-gradient-to-br from-gold-dot to-gold-strong shadow-none hover:brightness-110">
                Create free account <ArrowRight size={16} />
              </Button>
              <Button variant="secondary" size="lg" onClick={() => (window.location.href = EMPLOYEE_SIGNIN_URL)} className="bg-white/5 border-white/15 text-white hover:bg-white/10 hover:border-white/25">
                Sign in
              </Button>
            </div>

            <div className="flex items-center justify-center gap-9 mt-14 flex-wrap">
              {STATS.map(([n, suffix, l]) => (
                <div key={l}>
                  <b className="text-[26px] font-bold block">
                    <CountUp value={n} suffix={suffix} duration={1200} />
                  </b>
                  <span className="text-xs text-white/55">{l}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* About statement + stats */}
      <section className="max-w-5xl mx-auto px-6 pt-20">
        <StaggerGroup>
          <StaggerItem>
            <h2 className="text-[24px] sm:text-[30px] font-bold tracking-tight leading-[1.4] text-center">
              Mzobs is a <em className="italic text-gold-dot">results-driven</em> career platform helping job
              seekers <em className="italic text-navy">navigate</em> the market, <em className="italic text-gold-dot">rebuild</em> their
              profile, and <em className="italic text-navy">land</em> roles that actually fit.
            </h2>
          </StaggerItem>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-12">
            {ABOUT_STATS.map(([n, l]) => (
              <StaggerItem key={l}>
                <Card pad className="h-full text-center lg:text-left">
                  <b className="text-2xl font-bold block">{n}</b>
                  <span className="text-[13px] text-ink-secondary mt-1.5 block leading-relaxed">{l}</span>
                </Card>
              </StaggerItem>
            ))}
          </div>
        </StaggerGroup>
      </section>

      {/* Features */}
      <section id="features" className="max-w-6xl mx-auto px-6 py-20">
        <StaggerGroup>
          <StaggerItem className="text-center max-w-xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-[28px] font-bold tracking-tight">Everything you need to get placed</h2>
            <p className="text-ink-secondary text-[14.5px] mt-2.5">One platform, from your first resume draft to your signed offer.</p>
          </StaggerItem>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {FEATURES.map(({ icon: Icon, title, desc, image }) => (
              <StaggerItem key={title}>
                <Card hover className="h-full overflow-hidden flex flex-col group border border-border">
                  {image && (
                    <div className="h-32 w-full overflow-hidden relative bg-slate-100">
                      <img
                        src={image}
                        alt={title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-white via-white/20 to-transparent" />
                      <div className="absolute top-3 right-3 w-8 h-8 rounded-lg bg-white/90 backdrop-blur-md border border-slate-200/80 shadow-xs flex items-center justify-center text-navy">
                        <Icon size={16} />
                      </div>
                    </div>
                  )}
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="text-[15px] font-semibold">{title}</h3>
                      <p className="text-[13.5px] text-ink-secondary mt-1.5 leading-relaxed">{desc}</p>
                    </div>
                  </div>
                </Card>
              </StaggerItem>
            ))}
          </div>
        </StaggerGroup>
      </section>

      {/* Candidate Journey Section */}
      <CandidateJourneySection />

      {/* CTA banner */}
      <section className="max-w-6xl mx-auto px-6 pb-20">
        <Card className="bg-navy-950 border-none text-white text-center py-14 px-8">
          <ShieldCheck size={26} className="mx-auto text-gold-dot mb-4" />
          <h2 className="text-2xl font-bold tracking-tight">Ready to start your placement journey?</h2>
          <p className="text-white/65 text-[14.5px] mt-2.5 max-w-md mx-auto">Free to join. Verified by our operations team before anything reaches an employer.</p>
          <Button variant="primary" size="lg" onClick={() => (window.location.href = EMPLOYEE_SIGNUP_URL)} className="mt-6 bg-gradient-to-br from-gold-dot to-gold-strong shadow-none hover:brightness-110">
            Create free account <ArrowRight size={16} />
          </Button>
        </Card>
      </section>

      {/* Footer */}
      <footer className="border-t border-border">
        <div className="max-w-6xl mx-auto px-6 py-10 flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-2.5">
            <div className="w-[22px] h-[22px] rounded-md bg-gradient-to-br from-navy-700 to-navy text-white flex items-center justify-center text-[10px] font-extrabold">M</div>
            <span className="text-xs text-ink-tertiary">© {new Date().getFullYear()} Mzobs · Career Success Platform</span>
          </div>
          <div className="flex items-center gap-5 flex-wrap text-xs text-ink-tertiary">
            <a href={EMPLOYEE_SIGNIN_URL} className="hover:text-navy transition-colors duration-200">Sign in</a>
            <Link to="#privacy" className="hover:text-navy transition-colors duration-200">Privacy</Link>
            <Link to="#terms" className="hover:text-navy transition-colors duration-200">Terms</Link>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 size={13} className="text-green" /> Hiring for your company? <Link to="/employer/login" className="text-navy font-semibold hover:underline">Employer Portal</Link>
            </span>
          </div>
        </div>
      </footer>
    </div>
  )
}
