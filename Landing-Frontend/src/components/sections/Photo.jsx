import { cn } from '../../lib/utils'

// Placeholder for every photograph slot in the reference design. Renders a
// branded gradient tile + centered icon when no `src` is given, or a real
// <img> when one is — drop files into public/images/ and pass `src="/images/…"`
// to swap a placeholder for a real photo without touching any markup.
const tones = {
  navy: 'from-navy-900 to-navy-700',
  gold: 'from-gold-strong to-gold-dot',
  mixed: 'from-navy-950 via-navy-800 to-navy-700',
}

const ratios = {
  video: 'aspect-video',
  square: 'aspect-square',
  portrait: 'aspect-[3/4]',
  wide: 'aspect-[21/9]',
}

const roundedMap = {
  none: 'rounded-none',
  lg: 'rounded-xl',
  xl: 'rounded-2xl',
  full: 'rounded-full',
}

export default function Photo({ icon: Icon, tone = 'navy', ratio = 'video', fill, rounded = 'lg', src, alt = '', className }) {
  const shape = fill ? 'absolute inset-0 w-full h-full' : cn('relative w-full', ratios[ratio])

  if (src) {
    return <img src={src} alt={alt} className={cn(shape, roundedMap[rounded], 'object-cover', className)} />
  }

  return (
    <div className={cn(shape, roundedMap[rounded], 'relative overflow-hidden bg-gradient-to-br', tones[tone], className)} role="img" aria-label={alt}>
      <div
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage: 'radial-gradient(rgba(255,255,255,.18) 1px, transparent 1px)',
          backgroundSize: '20px 20px',
        }}
      />
      {Icon && (
        <div className="absolute inset-0 flex items-center justify-center">
          <Icon size={fill ? 56 : 40} className="text-white/25" strokeWidth={1.25} />
        </div>
      )}
    </div>
  )
}
