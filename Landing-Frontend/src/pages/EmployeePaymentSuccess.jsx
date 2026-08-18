import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, Check } from 'lucide-react'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import FloatingElement from '../components/ui/FloatingElement'

const CRACKER_COLORS = ['#3d5c34', '#cafdc7', '#2c4a63', '#7a5424', '#7a3d4c', '#c68a1f', '#e3edf5']

function Firecracker() {
  const [bursts] = useState(() =>
    Array.from({ length: 3 }, (_, b) =>
      Array.from({ length: 22 }, (_, i) => {
        const angle = (Math.PI * 2 * i) / 22 + Math.random() * 0.25
        const distance = 100 + Math.random() * 110
        return {
          id: `${b}-${i}`,
          dx: Math.cos(angle) * distance,
          dy: Math.sin(angle) * distance,
          color: CRACKER_COLORS[(i + b * 3) % CRACKER_COLORS.length],
          size: 4 + Math.random() * 6,
          delay: b * 0.18 + Math.random() * 0.15,
          duration: 0.9 + Math.random() * 0.5,
        }
      })
    ).flat()
  )

  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-visible">
      {bursts.map((p) => (
        <motion.span
          key={p.id}
          initial={{ x: 0, y: 0, opacity: 1, scale: 1, rotate: 0 }}
          animate={{ x: p.dx, y: p.dy, opacity: 0, scale: 0.3, rotate: 180 }}
          transition={{ duration: p.duration, delay: p.delay, ease: [0.16, 1, 0.3, 1] }}
          style={{ width: p.size, height: p.size, background: p.color, borderRadius: '3px' }}
          className="absolute"
        />
      ))}
    </div>
  )
}

export default function EmployeePaymentSuccess() {
  const navigate = useNavigate()
  const location = useLocation()
  const { paymentOrderId, isMockPayment } = location.state ?? {}

  useEffect(() => {
    if (!paymentOrderId) navigate('/employees/signup', { replace: true })
  }, [paymentOrderId, navigate])

  if (!paymentOrderId) return null

  return (
    <div className="min-h-screen bg-white text-black font-sans antialiased selection:bg-blue-200">
      <title>Payment Successful — Mzobs</title>
      <Navbar />

      <section className="relative bg-white pt-[76px] overflow-hidden">
        <FloatingElement duration={9} distance={16} className="absolute top-24 right-[8%] w-64 h-64 rounded-full bg-[#F5F5F5] blur-3xl pointer-events-none" />
        <FloatingElement duration={11} delay={1.5} distance={20} className="absolute bottom-10 left-[4%] w-72 h-72 rounded-full bg-[var(--careers-mint)]/40 blur-3xl pointer-events-none" />

        <div className="relative max-w-2xl mx-auto px-6 py-20 md:py-28 text-center">
          <div className="relative w-32 h-32 mx-auto mb-6">
            <Firecracker />
            <motion.div
              initial={{ scale: 0.4, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 260, damping: 16 }}
              className="relative w-24 h-24 mx-auto mt-4 rounded-full bg-[var(--careers-mint)] flex items-center justify-center"
            >
              <motion.div
                initial={{ scale: 0, rotate: -20 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.15, type: 'spring', stiffness: 300, damping: 14 }}
                className="w-14 h-14 rounded-full bg-[var(--careers-accent)] flex items-center justify-center text-white"
              >
                <Check size={28} strokeWidth={3.5} />
              </motion.div>
            </motion.div>
          </div>

          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.5 }}>
            <h1 className="text-3xl sm:text-4xl font-black text-black tracking-tight">Payment successful!</h1>
            <p className="text-base text-[#595959] mt-3 max-w-md mx-auto leading-relaxed font-medium">
              Your ₹99 Placement Support Programme is active for life — no renewals, no plans. One quick step left: tell us a bit about yourself.
            </p>
          </motion.div>

          {isMockPayment && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.45 }}
              className="text-[11px] font-bold text-amber-600 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 mt-5 inline-block"
            >
              Test mode — payment was simulated because Razorpay isn't configured yet.
            </motion.p>
          )}

          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55, duration: 0.5 }}>
            <button
              onClick={() => navigate('/employees/signup', { state: { paymentOrderId, isMockPayment } })}
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-[var(--careers-accent)] text-white text-sm font-bold border border-[var(--careers-accent)] hover:bg-white hover:text-[#595959] hover:border-[#666] transition-colors mt-8"
            >
              Continue to sign up <ArrowRight size={16} />
            </button>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
