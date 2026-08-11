import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, BarChart3, Briefcase, CalendarCheck2, CreditCard, FileCheck2, ShieldCheck, Users2 } from 'lucide-react'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import Badge from '../components/ui/Badge'
import Avatar from '../components/ui/Avatar'

const STATS = [
  ['12,400+', 'Verified candidates'],
  ['340+', 'Companies hiring'],
  ['18 days', 'Avg. time to offer'],
]

const FEATURES = [
  { icon: Users2, title: 'Verified Candidate Pipeline', desc: 'Every profile is screened and resume-checked by our operations team before it reaches you.' },
  { icon: Briefcase, title: 'Batch Hiring', desc: 'Fill dozens of roles at once with candidates matched to your requirement, not keyword-searched.' },
  { icon: CalendarCheck2, title: 'Structured Interviews', desc: 'Schedule, track and score interviews from one pipeline — no spreadsheets, no lost feedback.' },
  { icon: FileCheck2, title: 'Offer Management', desc: 'Issue, track and manage offers with full visibility into acceptance and onboarding status.' },
  { icon: BarChart3, title: 'Hiring Analytics', desc: 'Funnel conversion, time-to-fill and department-level reporting, always up to date.' },
  { icon: CreditCard, title: 'Simple Billing', desc: 'Transparent, consolidated invoicing for every hire — no surprise line items.' },
]

const STEPS = [
  { n: '01', title: 'Share your requirement', desc: 'Tell us the role, seniority and skills you need — we take it from there.' },
  { n: '02', title: 'Review verified candidates', desc: 'Receive a shortlist that has already cleared our screening and resume review.' },
  { n: '03', title: 'Interview & decide', desc: 'Run structured interviews and track feedback in one shared pipeline.' },
  { n: '04', title: 'Extend the offer', desc: 'Manage the offer, acceptance and onboarding handoff without leaving the portal.' },
]

const QUOTE = 'We used to spend weeks sifting resumes that went nowhere. With Mzobs, every candidate we interview is already pre-verified — our time-to-offer dropped by more than half.'
const AUTHOR = { initials: 'RK', name: 'Rhea Kapoor', role: 'Head of Talent, Solace Technologies' }

export default function Home() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-bg">
      {/* Nav */}
      <header className="sticky top-0 z-40 border-b border-border bg-bg/80 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-[10px] bg-gradient-to-br from-navy-700 to-navy text-white flex items-center justify-center text-base font-extrabold shadow-navy">M</div>
            <span className="font-bold text-lg tracking-tight">Mzobs</span>
            <span className="text-[10px] font-bold tracking-wide uppercase text-navy bg-navy-tint px-1.5 py-[3px] rounded-md">For Employers</span>
          </div>

          <nav className="hidden md:flex items-center gap-7 text-[13.5px] font-medium text-ink-secondary">
            <Link to="#features" className="hover:text-ink transition-colors duration-200">Platform</Link>
            <Link to="#how-it-works" className="hover:text-ink transition-colors duration-200">How it works</Link>
            <Link to="#story" className="hover:text-ink transition-colors duration-200">Customers</Link>
          </nav>

          <div className="flex items-center gap-2.5">
            <Link to="mailto:hiring@mzobs.com" className="hidden sm:inline-flex">
              <Button variant="ghost" size="md">Talk to us</Button>
            </Link>
            <Button variant="primary" size="md" onClick={() => navigate('/login')}>
              Sign in <ArrowRight size={15} />
            </Button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden bg-navy-950 text-white">
        <div
          className="absolute -inset-[10%]"
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
            <Badge tone="gold" className="mb-5">Hiring, without the noise</Badge>
            <h1 className="text-[clamp(2rem,5vw,3.25rem)] font-bold tracking-tight leading-[1.1]">
              Hire verified talent, not a stack of unread resumes.
            </h1>
            <p className="text-white/70 text-[15.5px] mt-5 max-w-xl mx-auto leading-relaxed">
              A single pipeline for requirements, interviews, offers and billing — filled only with candidates our team has personally screened.
            </p>

            <div className="flex items-center justify-center gap-3 mt-8 flex-wrap">
              <Button variant="primary" size="lg" onClick={() => navigate('/login')} className="bg-gradient-to-br from-gold-dot to-gold-strong shadow-none hover:brightness-110">
                Sign in to your portal <ArrowRight size={16} />
              </Button>
              <Link to="mailto:hiring@mzobs.com">
                <Button variant="secondary" size="lg" className="bg-white/5 border-white/15 text-white hover:bg-white/10 hover:border-white/25">
                  Talk to our team
                </Button>
              </Link>
            </div>

            <div className="flex items-center justify-center gap-9 mt-14 flex-wrap">
              {STATS.map(([n, l]) => (
                <div key={l}>
                  <b className="text-[26px] font-bold block">{n}</b>
                  <span className="text-xs text-white/55">{l}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="max-w-6xl mx-auto px-6 py-20">
        <div className="text-center max-w-xl mx-auto mb-12">
          <h2 className="text-2xl sm:text-[28px] font-bold tracking-tight">Everything hiring teams need, in one portal</h2>
          <p className="text-ink-secondary text-[14.5px] mt-2.5">From requirement to offer letter, without switching tools.</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {FEATURES.map(({ icon: Icon, title, desc }) => (
            <Card key={title} hover pad className="h-full">
              <div className="w-10 h-10 rounded-lg bg-navy-tint text-navy flex items-center justify-center mb-4">
                <Icon size={18} />
              </div>
              <h3 className="text-[15px] font-semibold">{title}</h3>
              <p className="text-[13.5px] text-ink-secondary mt-1.5 leading-relaxed">{desc}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="bg-bg-secondary border-y border-border">
        <div className="max-w-6xl mx-auto px-6 py-20">
          <div className="text-center max-w-xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-[28px] font-bold tracking-tight">How it works</h2>
            <p className="text-ink-secondary text-[14.5px] mt-2.5">Four steps from open requirement to signed offer.</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {STEPS.map((s, i) => (
              <div key={s.n} className="relative">
                <Card pad className="h-full">
                  <span className="text-xs font-bold text-gold-strong tracking-wide">{s.n}</span>
                  <h3 className="text-[14.5px] font-semibold mt-2">{s.title}</h3>
                  <p className="text-[13px] text-ink-secondary mt-1.5 leading-relaxed">{s.desc}</p>
                </Card>
                {i < STEPS.length - 1 && (
                  <ArrowRight size={16} className="hidden lg:block absolute top-1/2 -right-[22px] -translate-y-1/2 text-ink-tertiary" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonial */}
      <section id="story" className="max-w-4xl mx-auto px-6 py-20 text-center">
        <p className="text-[19px] sm:text-[22px] leading-relaxed font-medium tracking-tight text-ink">"{QUOTE}"</p>
        <div className="flex items-center justify-center gap-2.5 mt-6">
          <Avatar initials={AUTHOR.initials} size="md" gold />
          <div className="text-left">
            <div className="text-[13.5px] font-semibold">{AUTHOR.name}</div>
            <div className="text-xs text-ink-tertiary">{AUTHOR.role}</div>
          </div>
        </div>
      </section>

      {/* CTA banner */}
      <section className="max-w-6xl mx-auto px-6 pb-20">
        <Card className="bg-navy-950 border-none text-white text-center py-14 px-8">
          <ShieldCheck size={26} className="mx-auto text-gold-dot mb-4" />
          <h2 className="text-2xl font-bold tracking-tight">Ready to hire your next verified candidate?</h2>
          <p className="text-white/65 text-[14.5px] mt-2.5 max-w-md mx-auto">Employer accounts are provisioned by our team — sign in if you already have one, or reach out to get started.</p>
          <div className="flex items-center justify-center gap-3 mt-6 flex-wrap">
            <Button variant="primary" size="lg" onClick={() => navigate('/login')} className="bg-gradient-to-br from-gold-dot to-gold-strong shadow-none hover:brightness-110">
              Sign in <ArrowRight size={16} />
            </Button>
            <Link to="mailto:hiring@mzobs.com">
              <Button variant="secondary" size="lg" className="bg-white/5 border-white/15 text-white hover:bg-white/10 hover:border-white/25">
                Talk to our team
              </Button>
            </Link>
          </div>
        </Card>
      </section>

      {/* Footer */}
      <footer className="border-t border-border">
        <div className="max-w-6xl mx-auto px-6 py-10 flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-2.5">
            <div className="w-[22px] h-[22px] rounded-md bg-gradient-to-br from-navy-700 to-navy text-white flex items-center justify-center text-[10px] font-extrabold">M</div>
            <span className="text-xs text-ink-tertiary">© {new Date().getFullYear()} Mzobs · Employer Portal</span>
          </div>
          <div className="flex items-center gap-5 flex-wrap text-xs text-ink-tertiary">
            <Link to="/login" className="hover:text-navy transition-colors duration-200">Sign in</Link>
            <Link to="#privacy" className="hover:text-navy transition-colors duration-200">Privacy</Link>
            <Link to="#terms" className="hover:text-navy transition-colors duration-200">Terms</Link>
            <Link to="mailto:hiring@mzobs.com" className="hover:text-navy transition-colors duration-200">Contact sales</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
