import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import Card from '../ui/Card'
import Photo from './Photo'

export default function PathCard({ photoIcon, tags = [], title, desc, ctaLabel, href }) {
  return (
    <Card hover className="overflow-hidden p-0">
      <div className="relative">
        <Photo icon={photoIcon} tone="mixed" ratio="video" rounded="none" />
        <div className="absolute top-4 left-4 flex gap-2 flex-wrap">
          {tags.map((t) => (
            <span key={t} className="text-[11px] font-semibold bg-white/90 text-navy px-2.5 py-1 rounded-full backdrop-blur-sm">
              {t}
            </span>
          ))}
        </div>
      </div>
      <div className="p-6">
        <h3 className="text-lg font-bold tracking-tight">{title}</h3>
        <p className="text-[13.5px] text-ink-secondary mt-1.5 leading-relaxed">{desc}</p>
        <Link to={href} className="inline-flex items-center gap-1.5 text-[13.5px] font-semibold text-navy mt-4 hover:underline">
          {ctaLabel} <ArrowRight size={14} />
        </Link>
      </div>
    </Card>
  )
}
