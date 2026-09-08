import { ShieldCheck, Briefcase, UserCheck } from 'lucide-react'
import Reveal from '../../ui/Reveal'

// Three real, concise trust signals directly under the hero — no invented
// ratings or headcounts. "Live openings" is the one number here, and it's
// the exact same real total the hero's "hiring now" panel already fetched
// (see Home.jsx) rather than a separately-guessed figure. The other two are
// statements about how MZOBS actually operates (every job is admin/ops-
// approved before going public — see Backend's publicJobsController — and
// every application is reviewed before reaching an employer — see
// JobDetailPanel.jsx's identical claim), not numbers that would need to be
// fabricated to exist.
function points(total) {
  return [
    {
      icon: ShieldCheck,
      title: 'Verified employers',
      desc: 'Every company is reviewed before a role goes live.',
    },
    {
      icon: Briefcase,
      title: total != null ? `${total.toLocaleString('en-IN')} live opening${total === 1 ? '' : 's'}` : 'Live openings, updated daily',
      desc: 'Fresh roles added as employers post new requirements.',
    },
    {
      icon: UserCheck,
      title: 'Real application support',
      desc: 'Applications are reviewed by our team, not filtered by a bot.',
    },
  ]
}

export default function TrustStrip({ total, status }) {
  const items = points(status === 'ready' ? total : null)

  return (
    <section className="bg-white border-y border-(--explorer-border) py-6 px-6 md:px-10">
      <Reveal direction="up" duration={0.6} className="max-w-7xl mx-auto grid sm:grid-cols-3 gap-6 sm:gap-8">
        {items.map(({ icon: Icon, title, desc }) => (
          <div key={title} className="flex items-start gap-3">
            <span className="flex items-center justify-center w-9 h-9 rounded-full bg-(--explorer-teal-surface) text-(--explorer-teal) shrink-0" aria-hidden="true">
              <Icon size={16} strokeWidth={1.9} />
            </span>
            <div className="min-w-0">
              <p className="font-bold text-[14px] text-(--explorer-navy) leading-snug">{title}</p>
              <p className="mt-0.5 text-[12.5px] text-(--explorer-muted) leading-snug">{desc}</p>
            </div>
          </div>
        ))}
      </Reveal>
    </section>
  )
}
