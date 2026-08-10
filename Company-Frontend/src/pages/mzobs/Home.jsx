import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, Banknote, Building2, FileSearch, ShieldCheck, Users, Video } from 'lucide-react'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Badge from '../../components/ui/Badge'
import Avatar from '../../components/ui/Avatar'
import CountUp from '../../components/ui/CountUp'
import { StaggerGroup, StaggerItem } from '../../components/ui/Stagger'

const STATS = [
  [1246, '', 'Candidates subscribed'],
  [388, '', 'Profiles shared with employers'],
  [132, '', 'Placements closed'],
]

const MODULES = [
  { icon: Users, title: 'Candidate Desk', desc: 'Verify profiles, track subscriptions and manage the candidate pipeline end to end.' },
  { icon: FileSearch, title: 'Resume Queue', desc: 'Every resume is reviewed and rebuilt by ops before it reaches an employer.' },
  { icon: Video, title: 'Mock Interviews', desc: 'Schedule and score mock interviews ahead of the real employer round.' },
  { icon: Building2, title: 'Company & Requirements', desc: 'Manage employer accounts, open requirements and candidate dispatch.' },
  { icon: Banknote, title: 'Payments', desc: 'Track subscription and placement revenue across the funnel.' },
  { icon: ShieldCheck, title: 'Team & Access', desc: 'Control who on the ops team can see and act on what.' },
]

const QUOTE = 'Every resume, every company, every rupee moves through this desk. Nothing reaches an employer that our team has not personally verified first.'
const AUTHOR = { initials: 'IB', name: 'Ishaan Bhatia', role: 'Operations Manager, Mzobs' }

export default function Home() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-bg">
      {/* Nav */}
      <header className="sticky top-0 z-40 border-b border-border bg-bg/80 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-[30px] h-[30px] rounded-[9px] bg-gradient-to-br from-navy-700 to-navy flex items-center justify-center text-sm font-extrabold text-white shadow-navy">M</div>
            <span className="text-[17px] font-bold">Mzobs</span>
            <span className="text-[10px] font-bold tracking-wide uppercase text-navy bg-navy-tint px-1.5 py-[3px] rounded-md">For Mzobs Management</span>
          </div>

          <nav className="hidden md:flex items-center gap-7 text-[13.5px] font-medium text-ink-secondary">
            <a href="#modules" className="hover:text-ink transition-colors duration-200">Desks</a>
            <a href="#story" className="hover:text-ink transition-colors duration-200">Why it exists</a>
          </nav>

          <Button variant="primary" size="md" onClick={() => navigate('/login')}>
            Staff sign in <ArrowRight size={15} />
          </Button>
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
            <Badge tone="gold" className="mb-5">Internal Operations Portal</Badge>
            <h1 className="text-[clamp(2rem,5vw,3.25rem)] font-bold tracking-tight leading-[1.1]">
              The desk that runs Mzobs, end to end.
            </h1>
            <p className="text-white/70 text-[15.5px] mt-5 max-w-xl mx-auto leading-relaxed">
              Candidate verification, resume review, employer dispatch and payments — one portal for the team that keeps every placement honest.
            </p>

            <div className="flex items-center justify-center gap-3 mt-8 flex-wrap">
              <Button variant="primary" size="lg" onClick={() => navigate('/login')} className="bg-gradient-to-br from-gold-dot to-gold-strong shadow-none hover:brightness-110">
                Staff sign in <ArrowRight size={16} />
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

      {/* Modules */}
      <section id="modules" className="max-w-6xl mx-auto px-6 py-20">
        <StaggerGroup>
          <StaggerItem className="text-center max-w-xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-[28px] font-bold tracking-tight">Every desk, in one portal</h2>
            <p className="text-ink-secondary text-[14.5px] mt-2.5">From first resume upload to signed offer and settled invoice.</p>
          </StaggerItem>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {MODULES.map(({ icon: Icon, title, desc }) => (
              <StaggerItem key={title}>
                <Card hover pad className="h-full">
                  <div className="w-10 h-10 rounded-lg bg-navy-tint text-navy flex items-center justify-center mb-4">
                    <Icon size={18} />
                  </div>
                  <h3 className="text-[15px] font-semibold">{title}</h3>
                  <p className="text-[13.5px] text-ink-secondary mt-1.5 leading-relaxed">{desc}</p>
                </Card>
              </StaggerItem>
            ))}
          </div>
        </StaggerGroup>
      </section>

      {/* Why it exists */}
      <section id="story" className="bg-bg-secondary border-y border-border">
        <div className="max-w-4xl mx-auto px-6 py-20 text-center">
          <p className="text-[19px] sm:text-[22px] leading-relaxed font-medium tracking-tight text-ink">"{QUOTE}"</p>
          <div className="flex items-center justify-center gap-2.5 mt-6">
            <Avatar initials={AUTHOR.initials} size="md" gold />
            <div className="text-left">
              <div className="text-[13.5px] font-semibold">{AUTHOR.name}</div>
              <div className="text-xs text-ink-tertiary">{AUTHOR.role}</div>
            </div>
          </div>
        </div>
      </section>

      {/* Access banner */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <Card className="bg-navy-950 border-none text-white text-center py-14 px-8">
          <ShieldCheck size={26} className="mx-auto text-gold-dot mb-4" />
          <h2 className="text-2xl font-bold tracking-tight">Restricted to Mzobs staff</h2>
          <p className="text-white/65 text-[14.5px] mt-2.5 max-w-md mx-auto">Accounts are provisioned by the admin team. If you're on ops, sign in below.</p>
          <Button variant="primary" size="lg" onClick={() => navigate('/login')} className="mt-6 bg-gradient-to-br from-gold-dot to-gold-strong shadow-none hover:brightness-110">
            Staff sign in <ArrowRight size={16} />
          </Button>
        </Card>
      </section>

      {/* Footer */}
      <footer className="border-t border-border">
        <div className="max-w-6xl mx-auto px-6 py-10 flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-2.5">
            <div className="w-[22px] h-[22px] rounded-md bg-gradient-to-br from-navy-700 to-navy text-white flex items-center justify-center text-[10px] font-extrabold">M</div>
            <span className="text-xs text-ink-tertiary">© {new Date().getFullYear()} Mzobs · Internal Operations Portal</span>
          </div>
          <div className="flex items-center gap-5 flex-wrap text-xs text-ink-tertiary">
            <a href="#privacy" className="hover:text-navy transition-colors duration-200">Privacy</a>
            <a href="#terms" className="hover:text-navy transition-colors duration-200">Terms</a>
          </div>
        </div>
      </footer>
    </div>
  )
}
