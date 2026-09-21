import { MessageCircle, Mail, PhoneCall, ArrowUpRight } from 'lucide-react'
import { StaggerGroup, StaggerItem } from '../../ui/Stagger'

// Three ways to reach a human, after the self-service search/FAQ above.
// "Chat with us" and "Request a callback" have no live-chat or automated
// dial-back system behind them yet, so both honestly route to the same real
// query form below rather than pretending either exists — the phone number
// underneath is the one immediate, always-real alternative for anyone who'd
// rather just call now.
export default function SupportOptions({ email, phone, onChat, onCallback }) {
  const methods = [
    { icon: MessageCircle, label: 'Chat with us', desc: 'Get help from the MZOBS support team.', cta: 'Start a conversation', onClick: onChat },
    { icon: Mail, label: 'Email support', desc: "Send us your question and we'll get back to you.", cta: 'Send an email', href: `mailto:${email}` },
    { icon: PhoneCall, label: 'Request a callback', desc: 'Tell us what you need help with.', cta: 'Request a callback', onClick: onCallback ?? onChat },
  ]

  return (
    <div>
      <StaggerGroup className="grid sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-(--explorer-border)">
        {methods.map((m) => {
          const Tag = m.href ? 'a' : 'button'
          return (
            <StaggerItem key={m.label} y={14} duration={0.5}>
              <Tag
                {...(m.href ? { href: m.href } : { type: 'button', onClick: m.onClick })}
                className="group w-full flex flex-col text-left py-7 sm:py-2 sm:px-8 first:pl-0 first:sm:pl-0"
              >
                <span className="flex items-center justify-center w-10 h-10 rounded-full bg-(--explorer-blue-surface) text-(--explorer-blue) shrink-0">
                  <m.icon size={17} strokeWidth={1.8} aria-hidden="true" />
                </span>
                <h3 className="mt-4 text-[13px] font-black uppercase tracking-wide text-(--explorer-navy)">{m.label}</h3>
                <p className="mt-1.5 text-[13.5px] text-(--explorer-muted) font-medium leading-relaxed">{m.desc}</p>
                <span className="mt-4 inline-flex w-fit items-center gap-1.5 text-[11.5px] font-bold uppercase tracking-wide text-(--explorer-blue) transition-colors duration-150">
                  {m.cta}
                  <ArrowUpRight size={12} className="motion-safe:transition-transform motion-safe:duration-200 group-hover:translate-x-1 group-hover:-translate-y-0.5" aria-hidden="true" />
                </span>
              </Tag>
            </StaggerItem>
          )
        })}
      </StaggerGroup>

      <p className="mt-8 text-center text-[13px] text-(--explorer-muted) font-medium">
        Prefer to call right now?{' '}
        <a href={`tel:${phone.replace(/\s+/g, '')}`} className="font-bold text-(--explorer-blue) hover:text-(--explorer-blue-hover)">
          {phone}
        </a>
      </p>
    </div>
  )
}
