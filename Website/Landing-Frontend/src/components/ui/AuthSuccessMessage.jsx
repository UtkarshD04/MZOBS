import { motion } from 'framer-motion'

// Shown inside AuthCard's successOverlay slot once login/signup succeeds —
// the card becomes the "convergence point" the constellation collapses
// into, echoing the logo instead of just redirecting instantly.
export default function AuthSuccessMessage({ title, subtitle }) {
  return (
    <>
      <motion.img
        src="/images/logo.png"
        alt="Mzobs"
        initial={{ scale: 0.7, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="h-12 w-auto object-contain"
      />
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.15 }}
      >
        <p className="text-base font-black text-black">{title}</p>
        <p className="text-[13px] text-[#595959] mt-1 font-medium">{subtitle}</p>
      </motion.div>
      <div className="flex gap-1.5 mt-1">
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="w-1.5 h-1.5 rounded-full bg-[var(--careers-accent)]"
            animate={{ opacity: [0.25, 1, 0.25] }}
            transition={{ duration: 1.1, repeat: Infinity, delay: i * 0.15, ease: 'easeInOut' }}
          />
        ))}
      </div>
    </>
  )
}
