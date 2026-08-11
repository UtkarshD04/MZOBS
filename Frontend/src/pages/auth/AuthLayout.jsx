import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import Avatar from '../../components/ui/Avatar'
import CountUp from '../../components/ui/CountUp'

const DEFAULT_QUOTE = "Mzobs didn't just help me find a job — my resume was rebuilt by an expert, I trained for two weeks, and I walked into my interview at Razorpay actually prepared."
const DEFAULT_AUTHOR = { initials: 'RK', name: 'Rohit Kulkarni', role: 'Placed as Business Analyst, Razorpay' }
const DEFAULT_STATS = [
  [12400, '+', 'Profiles verified'],
  [3180, '+', 'Interviews arranged'],
  [96, '%', 'Would recommend'],
]

export default function AuthLayout({ children, quote = DEFAULT_QUOTE, author = DEFAULT_AUTHOR, stats = DEFAULT_STATS, brandTag }) {
  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      <div className="hidden lg:flex relative overflow-hidden flex-col justify-between p-11 text-white bg-navy-950">
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
            maskImage: 'radial-gradient(circle at 30% 20%, #000 0%, transparent 65%)',
          }}
        />
        <div className="relative flex items-center gap-2">
          <div className="w-[30px] h-[30px] rounded-[9px] bg-gradient-to-br from-navy-700 to-navy flex items-center justify-center text-sm font-extrabold shadow-navy">M</div>
          <span className="text-[17px] font-bold">Mzobs</span>
          {brandTag && <span className="text-[10px] font-bold tracking-wide uppercase text-white/80 bg-white/10 px-1.5 py-[3px] rounded-md">{brandTag}</span>}
        </div>
        <div className="relative flex flex-col gap-6">
          <p className="text-[19px] leading-relaxed font-medium tracking-tight">"{quote}"</p>
          <div className="flex items-center gap-2.5">
            <Avatar initials={author.initials} size="md" gold />
            <div>
              <div className="text-[13px] font-semibold">{author.name}</div>
              <div className="text-xs text-white/55">{author.role}</div>
            </div>
          </div>
          <div className="flex gap-7">
            {stats.map(([n, suffix, l]) => (
              <div key={l}>
                <b className="text-[22px] font-bold block">
                  <CountUp value={n} suffix={suffix} duration={1200} />
                </b>
                <span className="text-xs text-white/60">{l}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="relative flex flex-col items-center justify-center p-6 sm:p-10 bg-bg overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.35] pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(var(--color-border) 1px, transparent 1px)',
            backgroundSize: '28px 28px',
            maskImage: 'radial-gradient(circle at 50% 0%, #000 0%, transparent 70%)',
          }}
        />

        <div className="lg:hidden flex items-center gap-2 mb-8 relative">
          <div className="w-[30px] h-[30px] rounded-[9px] bg-gradient-to-br from-navy-700 to-navy flex items-center justify-center text-sm font-extrabold text-white shadow-navy">M</div>
          <span className="text-[17px] font-bold">Mzobs</span>
          {brandTag && <span className="text-[10px] font-bold tracking-wide uppercase text-navy bg-navy-tint px-1.5 py-[3px] rounded-md">{brandTag}</span>}
        </div>

        <motion.div
          className="relative w-full max-w-[400px] flex-1 flex flex-col justify-center"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="bg-surface border border-border rounded-xl shadow-sm p-7 sm:p-9">{children}</div>
        </motion.div>

        <footer className="relative w-full max-w-[400px] pt-8 flex items-center justify-between gap-4 flex-wrap">
          <span className="text-xs text-ink-tertiary">© {new Date().getFullYear()} Mzobs</span>
          <div className="flex items-center gap-4">
            <Link to="#privacy" className="text-xs text-ink-tertiary hover:text-navy transition-colors duration-200">
              Privacy
            </Link>
            <Link to="#terms" className="text-xs text-ink-tertiary hover:text-navy transition-colors duration-200">
              Terms
            </Link>
            <Link to="#support" className="text-xs text-ink-tertiary hover:text-navy transition-colors duration-200">
              Support
            </Link>
          </div>
        </footer>
      </div>
    </div>
  )
}
