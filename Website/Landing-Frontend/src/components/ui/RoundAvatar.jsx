// Small circular "person" avatar with a tone-colored fill. Distinct from
// Avatar/CompanyLogo in Avatar.jsx, which only offer a navy gradient or
// square company-logo tiles — neither is a round, tone-colored avatar.
const TONES = {
  navy: 'bg-(--jobs-navy) text-white',
  teal: 'bg-(--jobs-teal-dark) text-white',
  violet: 'bg-violet-600 text-white',
  amber: 'bg-amber-500 text-white',
}

export default function RoundAvatar({ initials, tone = 'navy', className = '' }) {
  return (
    <div className={`rounded-full flex items-center justify-center font-bold shrink-0 ${TONES[tone] || TONES.navy} ${className}`}>
      {initials}
    </div>
  )
}
