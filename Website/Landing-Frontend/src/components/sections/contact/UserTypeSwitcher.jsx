import { motion } from 'framer-motion'

// "I need help as:" — drives both the topic grid and the FAQ list below it
// so switching audience feels like the page itself reconfigured, not a
// second, mostly-duplicate section. A real segmented control (one pill
// slides between two buttons), not two separate toggle buttons.
export default function UserTypeSwitcher({ value, onChange }) {
  const options = [
    { value: 'seeker', label: 'Job Seeker' },
    { value: 'employer', label: 'Employer' },
  ]

  return (
    <div
      role="radiogroup"
      aria-label="I need help as"
      className="relative inline-grid grid-cols-2 w-full sm:w-auto p-1 rounded-full bg-(--explorer-bg) border border-(--explorer-border)"
    >
      {options.map((opt) => {
        const active = value === opt.value
        return (
          <button
            key={opt.value}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onChange(opt.value)}
            className={`relative z-10 px-6 sm:px-8 h-10 rounded-full text-[13px] font-bold uppercase tracking-wide transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--explorer-blue) ${
              active ? 'text-white' : 'text-(--explorer-navy)/60 hover:text-(--explorer-navy)'
            }`}
          >
            {active && (
              <motion.span
                layoutId="user-type-pill"
                className="absolute inset-0 -z-10 rounded-full bg-(--explorer-navy)"
                transition={{ type: 'spring', stiffness: 400, damping: 32 }}
              />
            )}
            {opt.label}
          </button>
        )
      })}
    </div>
  )
}
