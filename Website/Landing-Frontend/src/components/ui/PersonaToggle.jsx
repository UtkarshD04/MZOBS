import { Link } from 'react-router-dom'
import { Users, Building2 } from 'lucide-react'

// "Who are you joining as?" — Employer and Talent signup are genuinely
// separate flows/backends (different forms, different APIs), so this
// isn't a form step; it's a fast, clearly-framed switch between the two
// existing signup routes, styled as the choice the brief asks for.
export default function PersonaToggle({ active }) {
  const options = [
    { value: 'talent', to: '/employees/signup', label: 'Talent', hint: 'Discover trusted opportunities', icon: Users },
    { value: 'employer', to: '/employers/signup', label: 'Employer', hint: 'Connect with verified talent', icon: Building2 },
  ]

  return (
    <div className="grid grid-cols-2 gap-3 mb-6">
      {options.map((opt) => {
        const isActive = opt.value === active
        const Icon = opt.icon
        return (
          <Link
            key={opt.value}
            to={opt.to}
            aria-current={isActive ? 'true' : undefined}
            className={`group relative rounded-2xl border p-3.5 transition-all duration-200 ${
              isActive
                ? 'border-[var(--careers-accent)] bg-[var(--careers-tint-sage)]'
                : 'border-[#e0e0e0] bg-white hover:border-[#a8a8a8]'
            }`}
          >
            <div
              className={`w-8 h-8 rounded-lg flex items-center justify-center mb-2 transition-colors ${
                isActive ? 'bg-[var(--careers-accent)] text-white' : 'bg-[#F5F5F5] text-black'
              }`}
            >
              <Icon size={15} strokeWidth={1.8} />
            </div>
            <p className={`text-[13px] font-black ${isActive ? 'text-[var(--careers-tint-sage-ink)]' : 'text-black'}`}>{opt.label}</p>
            <p className="text-[10.5px] text-[#666] font-medium leading-snug mt-0.5">{opt.hint}</p>
          </Link>
        )
      })}
    </div>
  )
}
