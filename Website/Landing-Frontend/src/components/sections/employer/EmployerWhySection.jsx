import { ArrowRight, Briefcase, Inbox, UserSearch, ListChecks } from 'lucide-react'
import { Link } from 'react-router-dom'
import { FadeInView } from './employerMotion'

const CARDS = [
  {
    icon: Briefcase,
    title: 'Manage every open role from one place',
    desc: 'Live, draft or paused — every requisition sits in one dashboard instead of scattered spreadsheets and email threads, so nothing slips because it fell off someone\'s inbox.',
    cta: 'Post a role',
    to: '/employers/signup',
    size: 'lg',
    Visual: RolesFragment,
  },
  {
    icon: Inbox,
    title: 'One inbox for every application',
    desc: "Applications from every open role land in a single inbox, tagged to the role they applied for — nothing to chase down across email or forwarded resumes.",
    cta: 'Get your inbox',
    to: '/employers/signup',
    size: 'md',
    Visual: ApplicationsFragment,
  },
  {
    icon: UserSearch,
    title: 'Full candidate profiles, not bare attachments',
    desc: 'Every applicant comes with a complete profile — experience, skills and a resume our team has already reviewed — so you\'re never deciding off a forwarded PDF.',
    cta: 'See a sample profile',
    to: '#how-it-works',
    size: 'md',
  },
  {
    icon: ListChecks,
    title: 'Track offers, not just applicants',
    desc: 'Move a candidate from applied to shortlisted to offer, with status and notes kept together in one place instead of split across chats and calls.',
    cta: 'See the full workflow',
    to: '#how-it-works',
    size: 'lg',
    Visual: ShortlistFragment,
  },
]

function RolesFragment() {
  const rows = [
    { role: 'Backend Engineer', status: 'Live' },
    { role: 'Sales Associate', status: 'Live' },
    { role: 'Operations Lead', status: 'Draft' },
  ]
  return (
    <div className="rounded-xl border border-[#20251F]/12 bg-[#F1EDE5] p-4">
      <div className="space-y-2">
        {rows.map((r) => (
          <div key={r.role} className="flex items-center justify-between text-[13px] py-1.5 border-b border-[#20251F]/10 last:border-0">
            <span className="text-[#20251F] font-medium">{r.role}</span>
            <span className={`text-[10.5px] font-bold px-2 py-0.5 rounded-full ${r.status === 'Live' ? 'bg-[#DCECE3] text-[#1F5A43]' : 'bg-white text-[#526051]'}`}>
              {r.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

function ApplicationsFragment() {
  const rows = ['Applicant reviewed today', 'Applicant reviewed today', 'Applicant reviewed yesterday']
  return (
    <div className="rounded-xl border border-[#20251F]/12 bg-[#F1EDE5] p-4">
      <div className="space-y-2.5">
        {rows.map((r, i) => (
          <div key={i} className="flex items-center gap-2.5">
            <span className="w-6 h-6 rounded-full bg-[#F6C16E]/50 border border-[#20251F]/10 shrink-0" />
            <span className="text-[12px] text-[#526051] font-medium">{r}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function ShortlistFragment() {
  const cols = ['Applied', 'Shortlisted', 'Interview', 'Offer']
  return (
    <div className="rounded-xl border border-[#20251F]/12 bg-[#F1EDE5] p-4 grid grid-cols-4 gap-2">
      {cols.map((c, i) => (
        <div key={c} className="rounded-lg bg-white border border-[#20251F]/10 p-2">
          <span className="text-[8.5px] font-bold text-[#526051] uppercase tracking-wide">{c}</span>
          <div className={`mt-2 h-1.5 rounded-full ${i === 0 ? 'bg-[#F36D4C]/20' : i === 1 ? 'bg-[#F36D4C]/40' : i === 2 ? 'bg-[#F36D4C]/70' : 'bg-[#F36D4C]'}`} />
        </div>
      ))}
    </div>
  )
}

function SolutionCard({ card }) {
  const isExternalRoute = card.to.startsWith('/')
  const Wrapper = isExternalRoute ? Link : 'a'
  const wrapperProps = isExternalRoute ? { to: card.to } : { href: card.to }

  return (
    <div className="flex flex-col h-full rounded-[24px] border border-[#20251F]/15 bg-white p-6 sm:p-7 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_35px_-24px_rgba(32,37,31,0.38)]">
      <span className="w-10 h-10 rounded-full bg-[#DDE6DF] flex items-center justify-center text-[#246B5A] shrink-0">
        <card.icon size={19} strokeWidth={1.8} />
      </span>
      <h3 className="mt-4 text-lg font-bold text-[#20251F] leading-snug">{card.title}</h3>
      <p className="mt-2.5 text-[14.5px] text-[#526051] leading-relaxed">{card.desc}</p>

      {card.Visual && (
        <div className="mt-5">
          <card.Visual />
        </div>
      )}

      <Wrapper {...wrapperProps} className="mt-auto pt-5 inline-flex items-center gap-1.5 text-[13.5px] font-bold text-[#1F5A43] hover:text-[#20251F] transition-colors">
        {card.cta} <ArrowRight size={14} />
      </Wrapper>
    </div>
  )
}

export default function EmployerWhySection() {
  return (
    <section id="solutions" className="bg-[#EEF1EE] py-16 md:py-24 px-6 md:px-12">
      <div className="max-w-7xl mx-auto">
        <FadeInView className="max-w-xl">
          <h2 className="font-serif text-3xl sm:text-4xl md:text-[46px] font-bold text-[#20251F] tracking-tight leading-tight">
            One platform for every stage of hiring
          </h2>
          <p className="mt-3 text-[15px] text-[#20251F]/70 leading-relaxed">
            From posting a role to making the offer, everything your hiring team needs lives in one workspace.
          </p>
        </FadeInView>

        <div className="mt-12 grid md:grid-cols-12 gap-5">
          {CARDS.map((card, i) => (
            <FadeInView key={card.title} delay={i * 0.06} className={`h-full ${card.size === 'lg' ? 'md:col-span-7' : 'md:col-span-5'}`}>
              <SolutionCard card={card} />
            </FadeInView>
          ))}
        </div>
      </div>
    </section>
  )
}
