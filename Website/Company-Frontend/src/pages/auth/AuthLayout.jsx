import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { CheckCircle2 } from 'lucide-react'
import CountUp from '../../components/ui/CountUp'

const MOTIVATION = [
  'Every resume you verify is someone’s shot at a better career.',
  'The care you put in today is the trust an employer places in us tomorrow.',
  'Small, honest work here adds up to a placement that changes someone’s life.',
]

const DEFAULT_QUOTE = "Mzobs didn't just help me find a job — my resume was rebuilt by an expert, I trained for two weeks, and I walked into my interview at Razorpay actually prepared."
const DEFAULT_AUTHOR = { initials: 'RK', name: 'Rohit Kulkarni', role: 'Placed as Business Analyst, Razorpay' }
const DEFAULT_STATS = [
  [12400, '+', 'Profiles verified'],
  [3180, '+', 'Interviews arranged'],
  [96, '%', 'Would recommend'],
]

function Brand({ className }) {
  return (
    <div className={className}>
      <img src="/images/logo.png" alt="Mzobs" className="h-9 w-auto object-contain" />
    </div>
  )
}

export default function AuthLayout({ children, quote = DEFAULT_QUOTE, author = DEFAULT_AUTHOR, stats = DEFAULT_STATS, brandTag }) {
  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-white text-[#111827]">
      <div className="hidden lg:flex relative overflow-hidden flex-col justify-between p-11 bg-gradient-to-br from-[#eef3ea] to-[#e2ebdd]">
        <div
          className="absolute inset-0 opacity-60 pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(rgba(61,92,52,.14) 1px, transparent 1px)',
            backgroundSize: '26px 26px',
            maskImage: 'radial-gradient(circle at 25% 15%, #000 0%, transparent 65%)',
          }}
        />
        <div
          className="absolute -inset-[10%] pointer-events-none animate-[blobPulse_13s_ease-in-out_infinite]"
          style={{
            background:
              'radial-gradient(520px 480px at 90% 90%, rgba(61,92,52,.16), transparent 60%), radial-gradient(460px 460px at 10% 0%, rgba(61,92,52,.10), transparent 65%)',
          }}
        />

        <div className="relative flex items-center gap-3">
          <Brand />
          {brandTag && (
            <span className="text-[10px] font-bold tracking-wide uppercase text-[#3d5c34] bg-white px-2 py-[5px] rounded-md shadow-sm">
              {brandTag}
            </span>
          )}
        </div>

        <div className="relative flex flex-col gap-5 max-w-md">
          <h2 className="text-[30px] leading-[1.2] font-bold tracking-tight text-[#111827]">
            The desk that runs Mzobs, end to end.
          </h2>
          <ul className="flex flex-col gap-3">
            {MOTIVATION.map((line) => (
              <li key={line} className="flex items-start gap-2.5 text-[14px] leading-snug text-[#3d3d3d]">
                <CheckCircle2 size={17} className="text-[#3d5c34] flex-shrink-0 mt-0.5" />
                <span>{line}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="relative flex flex-col gap-6">
          <p className="text-[19px] leading-relaxed font-medium tracking-tight text-[#111827]">"{quote}"</p>
          <div className="flex items-center gap-2.5">
            <div className="w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0 font-bold text-white bg-[#3d5c34]">
              {author.initials}
            </div>
            <div>
              <div className="text-[13px] font-semibold">{author.name}</div>
              <div className="text-xs text-[#666666]">{author.role}</div>
            </div>
          </div>
          <div className="flex gap-7">
            {stats.map(([n, suffix, l]) => (
              <div key={l}>
                <b className="text-[22px] font-bold block text-[#3d5c34]">
                  <CountUp value={n} suffix={suffix} duration={1200} />
                </b>
                <span className="text-xs text-[#666666]">{l}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="relative flex flex-col items-center justify-center p-6 sm:p-10 bg-white overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.35] pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(#e0e0e0 1px, transparent 1px)',
            backgroundSize: '28px 28px',
            maskImage: 'radial-gradient(circle at 50% 0%, #000 0%, transparent 70%)',
          }}
        />

        <div className="lg:hidden flex flex-col items-center gap-2.5 mb-8 relative">
          <Brand />
          {brandTag && (
            <span className="text-[10px] font-bold tracking-wide uppercase text-[#3d5c34] bg-[#e5efe0] px-2 py-[5px] rounded-md">{brandTag}</span>
          )}
        </div>

        <motion.div
          className="relative w-full max-w-[400px] flex-1 flex flex-col justify-center"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="bg-white border border-[#e0e0e0] rounded-2xl shadow-[0_20px_45px_-24px_rgba(17,24,39,0.25)] p-7 sm:p-9">{children}</div>
        </motion.div>

        <footer className="relative w-full max-w-[400px] pt-8 flex items-center justify-between gap-4 flex-wrap">
          <span className="text-xs text-[#666666]">© {new Date().getFullYear()} Mzobs</span>
          <div className="flex items-center gap-4">
            <Link to="#privacy" className="text-xs text-[#666666] hover:text-[#3d5c34] transition-colors duration-200">
              Privacy
            </Link>
            <Link to="#terms" className="text-xs text-[#666666] hover:text-[#3d5c34] transition-colors duration-200">
              Terms
            </Link>
            <Link to="#support" className="text-xs text-[#666666] hover:text-[#3d5c34] transition-colors duration-200">
              Support
            </Link>
          </div>
        </footer>
      </div>
    </div>
  )
}
