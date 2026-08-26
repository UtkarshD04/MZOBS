import { motion } from 'framer-motion'
import { Inbox, Contact, Building2, Briefcase, ShieldCheck } from 'lucide-react'

const FEATURES = [
  { icon: Inbox, title: 'Resumes', body: "Every subscribed candidate's resume lands here first." },
  { icon: Contact, title: 'HR Contacts', body: 'One directory for every hiring contact, across every employer.' },
  { icon: Building2, title: 'Companies', body: 'KYC and verification status for every registered employer.' },
  { icon: Briefcase, title: 'Requirements', body: 'Review, approve and bill every job posting that comes in.' },
]

function Brand({ className }) {
  return (
    <div className={className}>
      <img src="/images/logo.png" alt="Mzobs" className="h-9 w-auto object-contain" />
    </div>
  )
}

export default function AuthLayout({ children, brandTag }) {
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
              'radial-gradient(520px 480px at 90% 90%, rgba(61,92,52,.16), transparent 60%), radial-gradient(460px 460px at 10% 0%, rgba(198,138,31,.12), transparent 65%)',
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

        <div className="relative flex flex-col gap-6 max-w-md">
          <h2 className="text-[30px] leading-[1.2] font-bold tracking-tight text-[#111827]">
            The full-control desk for running Mzobs, end to end.
          </h2>
          <div className="flex flex-col gap-3.5">
            {FEATURES.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.08 * i, duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                className="flex items-start gap-3 bg-white/60 border border-white rounded-xl px-3.5 py-3 backdrop-blur-sm"
              >
                <div className="w-8 h-8 rounded-lg bg-[#3d5c34] text-white flex items-center justify-center flex-shrink-0">
                  <f.icon size={16} />
                </div>
                <div className="min-w-0">
                  <div className="text-[13.5px] font-semibold text-[#111827]">{f.title}</div>
                  <div className="text-[12.5px] text-[#595959] leading-snug mt-0.5">{f.body}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="relative flex items-center gap-2.5 text-[12.5px] text-[#595959]">
          <ShieldCheck size={16} className="text-[#3d5c34] flex-shrink-0" />
          Restricted to Mzobs admins — every action here is logged.
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
          <span className="text-xs text-[#666666]">Admin Portal</span>
        </footer>
      </div>
    </div>
  )
}
