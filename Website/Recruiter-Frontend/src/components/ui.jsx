import { useEffect } from 'react'
import clsx from 'clsx'
import { X, Check, AlertTriangle, ShieldCheck, Clock, Minus } from 'lucide-react'
import { useWorkspace } from '../store/workspace'
import { matchTone } from '../lib/talent/engine'
import { escapeRegex } from '../lib/format'

const AVATAR_TINTS = ['bg-[#e8f8f5] text-[#0a6f64]', 'bg-[#eaf3fc] text-[#1f6fb2]', 'bg-[#e6f6ee] text-[#1a8f5a]', 'bg-[#f1ede5] text-[#7a5b2e]', 'bg-[#fbeee3] text-[#b45309]']
function tint(id) {
  let h = 0
  for (const ch of String(id)) h = (h * 31 + ch.charCodeAt(0)) >>> 0
  return AVATAR_TINTS[h % AVATAR_TINTS.length]
}

export function Avatar({ candidate, size = 44 }) {
  return (
    <div className={clsx('grid shrink-0 place-items-center rounded-full font-semibold', tint(candidate.id))} style={{ width: size, height: size, fontSize: size * 0.36 }} aria-hidden>
      {candidate.initials}
    </div>
  )
}

const BUTTON = {
  primary: 'bg-ink text-[#e8f8f5] hover:bg-accent border-transparent',
  blue: 'bg-blue text-white hover:bg-[#185a94] border-transparent',
  ai: 'bg-accent text-white hover:bg-ink border-transparent',
  outline: 'bg-white text-ink border-line hover:border-[#c4d1db] hover:bg-[#f5f9fb]',
  ghost: 'bg-transparent text-ink-2 border-transparent hover:bg-line-2',
}
export function Button({ variant = 'outline', size = 'md', className, icon: Icon, children, ...rest }) {
  return (
    <button
      {...rest}
      className={clsx(
        'inline-flex items-center justify-center gap-1.5 whitespace-nowrap rounded-full border font-bold transition-colors duration-200 disabled:opacity-50',
        size === 'sm' ? 'h-8 px-3.5 text-[12.5px]' : size === 'lg' ? 'h-11 px-6 text-[14.5px]' : 'h-9 px-4 text-[13px]',
        BUTTON[variant],
        className
      )}
    >
      {Icon && <Icon size={size === 'sm' ? 14 : 15} strokeWidth={2} />}
      {children}
    </button>
  )
}

export function IconButton({ label, icon: Icon, className, active, ...rest }) {
  return (
    <button {...rest} aria-label={label} title={label} className={clsx('grid h-8 w-8 place-items-center rounded-lg text-ink-2 transition-colors hover:bg-line-2', active && 'bg-accent-soft text-accent', className)}>
      <Icon size={16} />
    </button>
  )
}

export function Chip({ children, onRemove, tone = 'neutral', className }) {
  const tones = {
    neutral: 'bg-white border-line text-ink-2',
    accent: 'bg-accent-soft border-transparent text-[#0a6f64]',
    ai: 'bg-ai-soft border-transparent text-[#0a6f64]',
    ok: 'bg-ok-soft border-transparent text-[#1a8f5a]',
    hit: 'bg-[#eaf2ff] border-transparent text-[#1f6fb2]',
  }
  return (
    <span className={clsx('inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[12px] font-semibold', tones[tone], className)}>
      {children}
      {onRemove && (
        <button onClick={onRemove} aria-label={`Remove ${typeof children === 'string' ? children : ''}`} className="-mr-0.5 grid h-4 w-4 place-items-center rounded hover:bg-black/10">
          <X size={11} />
        </button>
      )}
    </span>
  )
}

export function Highlight({ text, terms }) {
  const list = (terms ?? []).filter(Boolean)
  if (!list.length || !text) return <>{text}</>
  const re = new RegExp(`(${list.map(escapeRegex).join('|')})`, 'ig')
  return (
    <>
      {String(text)
        .split(re)
        .map((part, i) => (list.some((t) => t.toLowerCase() === part.toLowerCase()) ? <mark key={i} className="kw">{part}</mark> : <span key={i}>{part}</span>))}
    </>
  )
}

const TONE = {
  strong: 'bg-ai-soft text-[#0a6f64] border-[#bfe6df]',
  good: 'bg-blue-soft text-[#1f6fb2] border-[#bfdbfe]',
  fair: 'bg-line-2 text-ink-2 border-line',
}
export function MatchBadge({ score, onClick }) {
  if (score == null) return null
  const t = matchTone(score)
  return (
    <button onClick={onClick} className={clsx('group inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-[12px] font-semibold transition-shadow hover:shadow-card', TONE[t])} title="Why this candidate matches">
      <span className="relative grid h-4 w-4 place-items-center">
        <svg viewBox="0 0 20 20" className="h-4 w-4 -rotate-90">
          <circle cx="10" cy="10" r="8" fill="none" stroke="currentColor" strokeOpacity="0.2" strokeWidth="3" />
          <circle cx="10" cy="10" r="8" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeDasharray={`${(score / 100) * 50.3} 50.3`} style={{ transition: 'stroke-dasharray .6s ease-out' }} />
        </svg>
      </span>
      {score}% match
    </button>
  )
}

const STATUS = {
  verified: { icon: Check, cls: 'text-ok bg-ok-soft', label: 'Verified' },
  pending: { icon: Clock, cls: 'text-warn bg-warn-soft', label: 'Pending' },
  none: { icon: Minus, cls: 'text-muted bg-line-2', label: 'Not verified' },
}
export function StatusPill({ status, label }) {
  const s = STATUS[status] ?? STATUS.none
  const Icon = s.icon
  return (
    <span className={clsx('inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[11px] font-semibold', s.cls)}>
      <Icon size={11} strokeWidth={3} />
      {label ?? s.label}
    </span>
  )
}

export function VerifiedBadge({ candidate }) {
  if (candidate.verification.identity !== 'verified') return null
  return (
    <span className="inline-flex items-center gap-1 rounded-md bg-ok-soft px-1.5 py-0.5 text-[11px] font-semibold text-[#1a8f5a]" title="Identity verified by Mzobs">
      <ShieldCheck size={12} /> Verified
    </span>
  )
}

export function TrustScore({ score, onClick, compact }) {
  const color = score >= 75 ? 'text-ok' : score >= 45 ? 'text-warn' : 'text-muted'
  return (
    <button onClick={onClick} className="inline-flex items-center gap-1.5 text-[12px] text-muted hover:text-ink" title="Mzobs Trust Score — see breakdown">
      <ShieldCheck size={13} className={color} />
      {!compact && 'Trust'} <b className={clsx('font-semibold', color)}>{score}</b>/100
    </button>
  )
}

export function Skeleton({ className }) {
  return <div className={clsx('skeleton', className)} />
}

export function CardSkeleton() {
  return (
    <div className="rounded-2xl border border-line bg-white p-5">
      <div className="flex gap-4">
        <Skeleton className="h-11 w-11 !rounded-full" />
        <div className="flex-1 space-y-3">
          <Skeleton className="h-4 w-1/3" />
          <Skeleton className="h-3 w-1/2" />
          <Skeleton className="h-3 w-2/3" />
          <div className="flex gap-2">{[0, 1, 2, 3].map((i) => <Skeleton key={i} className="h-5 w-16" />)}</div>
        </div>
      </div>
    </div>
  )
}

export function EmptyState({ icon: Icon, title, body, action }) {
  return (
    <div className="mx-auto grid max-w-sm place-items-center gap-2 py-16 text-center">
      {Icon && <div className="grid h-10 w-10 place-items-center rounded-2xl bg-line-2 text-muted"><Icon size={20} /></div>}
      <h3 className="text-[15px] font-semibold">{title}</h3>
      {body && <p className="text-[13px] text-muted">{body}</p>}
      {action}
    </div>
  )
}

/** Side drawer on desktop, bottom sheet on mobile. */
export function Sheet({ open, onClose, title, subtitle, width = 440, children, footer }) {
  useEffect(() => {
    if (!open) return
    const onKey = (e) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [open, onClose])
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-[#102a43]/40" onClick={onClose} />
      <aside
        role="dialog"
        aria-modal="true"
        aria-label={title}
        style={{ '--w': `${width}px` }}
        className="slide-up md:slide-in-right absolute bottom-0 flex max-h-[88vh] w-full flex-col rounded-t-2xl bg-white shadow-pop md:inset-y-0 md:right-0 md:bottom-auto md:max-h-none md:w-[var(--w)] md:rounded-none"
      >
        <header className="flex items-start justify-between gap-3 border-b border-line px-5 py-4">
          <div>
            <h2 className="text-[17px] font-semibold">{title}</h2>
            {subtitle && <p className="mt-0.5 text-[13px] text-muted">{subtitle}</p>}
          </div>
          <IconButton label="Close" icon={X} onClick={onClose} />
        </header>
        <div className="scroll-thin flex-1 overflow-y-auto px-5 py-4">{children}</div>
        {footer && <footer className="border-t border-line bg-[#f5f9fb] px-5 py-3">{footer}</footer>}
      </aside>
    </div>
  )
}

export function Modal({ open, onClose, title, subtitle, width = 640, children, footer }) {
  useEffect(() => {
    if (!open) return
    const onKey = (e) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [open, onClose])
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 grid place-items-end md:place-items-center md:p-6">
      <div className="absolute inset-0 h-full w-full bg-[#102a43]/40" onClick={onClose} />
      <div role="dialog" aria-modal="true" aria-label={title} style={{ '--w': `${width}px` }} className="fade-up relative flex max-h-[92vh] w-full flex-col rounded-t-2xl bg-white shadow-pop md:max-w-[var(--w)] md:rounded-2xl">
        <header className="flex items-start justify-between gap-3 border-b border-line px-5 py-4">
          <div>
            <h2 className="text-[17px] font-semibold">{title}</h2>
            {subtitle && <p className="mt-0.5 text-[13px] text-muted">{subtitle}</p>}
          </div>
          <IconButton label="Close" icon={X} onClick={onClose} />
        </header>
        <div className="scroll-thin flex-1 overflow-y-auto px-5 py-4">{children}</div>
        {footer && <footer className="flex items-center justify-end gap-2 border-t border-line bg-[#f5f9fb] px-5 py-3">{footer}</footer>}
      </div>
    </div>
  )
}

export function ToastStack() {
  const { toasts, dismissToast } = useWorkspace()
  return (
    <div className="pointer-events-none fixed bottom-20 left-1/2 z-[60] flex -translate-x-1/2 flex-col items-center gap-2 md:bottom-6">
      {toasts.map((t) => (
        <div key={t.id} className="toast-in pointer-events-auto flex items-center gap-3 rounded-2xl bg-ink px-4 py-2.5 text-[13px] text-white shadow-pop">
          {t.tone === 'warn' ? <AlertTriangle size={15} className="text-[#fbbf24]" /> : <Check size={15} className="text-[#4ade80]" />}
          <span>{t.message}</span>
          {t.action && (
            <button onClick={() => { t.action.run(); dismissToast(t.id) }} className="font-semibold text-[#a5b4fc] hover:text-white">
              {t.action.label}
            </button>
          )}
        </div>
      ))}
    </div>
  )
}

export function SectionCard({ title, action, children, className }) {
  return (
    <section className={clsx('rounded-2xl border border-line bg-white shadow-card', className)}>
      {title && (
        <div className="flex items-center justify-between px-5 pt-4">
          <h2 className="text-[15px] font-semibold">{title}</h2>
          {action}
        </div>
      )}
      <div className="px-5 pb-5 pt-3">{children}</div>
    </section>
  )
}
