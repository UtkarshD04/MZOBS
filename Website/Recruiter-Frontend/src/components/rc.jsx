// Small building blocks shared by the recruiter-console pages (Overview, Applicants, Offers, Team, ...).
// Deliberately plain: compact type, 1px slate borders, no decoration beyond what carries meaning.
import clsx from 'clsx'
import { Link } from 'react-router-dom'
import { AlertCircle } from 'lucide-react'
import { Button, Skeleton } from './ui'

// No width here so toolbars can size selects freely; <Field> makes its direct input/select full-width.
export const inputCls = 'h-9 rounded-lg border border-line bg-white px-3 text-[13.5px] text-ink outline-none transition-colors placeholder:text-muted/70 focus:border-accent'
export const textareaCls = 'w-full rounded-lg border border-line bg-white px-3 py-2 text-[13.5px] text-ink outline-none transition-colors placeholder:text-muted/70 focus:border-accent'

export function PageShell({ title, sub, actions, children, wide = false }) {
  return (
    <div className={clsx('mx-auto px-4 py-6 lg:px-6', wide ? 'max-w-[1600px]' : 'max-w-[1180px]')}>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div className="min-w-0">
          <h1 className="text-[24px] font-extrabold leading-tight tracking-[-0.02em] text-ink">{title}</h1>
          {sub && <p className="mt-0.5 text-[13.5px] text-muted">{sub}</p>}
        </div>
        {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
      </div>
      <div className="mt-5">{children}</div>
    </div>
  )
}

export function Panel({ title, action, children, className, flush = false }) {
  return (
    <section className={clsx('rounded-xl border border-line bg-white', className)}>
      {title && (
        <header className="flex items-center justify-between gap-3 border-b border-line-2 px-4 py-2.5">
          <h2 className="text-[13px] font-bold uppercase tracking-[0.04em] text-ink-2">{title}</h2>
          {action}
        </header>
      )}
      <div className={flush ? '' : 'p-4'}>{children}</div>
    </section>
  )
}

export function StatTile({ label, value, hint, to, tone }) {
  const body = (
    <>
      <p className="text-[12px] font-semibold text-muted">{label}</p>
      <p className={clsx('num mt-1 text-[26px] font-extrabold leading-none tracking-[-0.02em]', tone === 'warn' ? 'text-warn' : 'text-ink')}>{value ?? '—'}</p>
      {hint && <p className="mt-1.5 text-[12px] text-muted">{hint}</p>}
    </>
  )
  const cls = 'block rounded-xl border border-line bg-white px-4 py-3.5'
  return to ? <Link to={to} className={clsx(cls, 'transition-colors hover:border-[#b9c8d2]')}>{body}</Link> : <div className={cls}>{body}</div>
}

export function ErrorState({ message = 'Could not load this.', onRetry }) {
  return (
    <div role="alert" className="mx-auto flex max-w-sm flex-col items-center gap-2 py-14 text-center">
      <AlertCircle size={22} className="text-bad" />
      <p className="text-[14px] font-semibold text-ink">{message}</p>
      {onRetry && <Button size="sm" onClick={onRetry}>Try again</Button>}
    </div>
  )
}

export function ListSkeleton({ rows = 4 }) {
  return (
    <div className="space-y-2" aria-busy="true" aria-label="Loading">
      {Array.from({ length: rows }, (_, i) => <Skeleton key={i} className="h-14 w-full !rounded-xl" />)}
    </div>
  )
}

export function Field({ label, error, hint, children }) {
  return (
    <label className="block text-[12px] font-semibold text-ink-2">
      {label}
      <div className="mt-1 font-normal [&>input]:w-full [&>select]:w-full">{children}</div>
      {error ? <span className="mt-1 block text-[12px] font-medium text-bad">{error}</span> : hint ? <span className="mt-1 block text-[12px] font-normal text-muted">{hint}</span> : null}
    </label>
  )
}

const STAGE_TONE = {
  new: 'bg-[#eef1f3] text-ink-2',
  reviewed: 'bg-[#e8eef3] text-ink-2',
  shortlisted: 'bg-accent-soft text-accent',
  interview: 'bg-[#e6eef6] text-[#24557f]',
  offer: 'bg-[#f6efdc] text-[#7a5a14]',
  hired: 'bg-ok-soft text-ok',
  rejected: 'bg-[#f5e9e7] text-[#9a3a2c]',
}
export function StagePill({ stage, label }) {
  return <span className={clsx('inline-block rounded px-1.5 py-0.5 text-[11.5px] font-semibold', STAGE_TONE[stage] ?? STAGE_TONE.new)}>{label}</span>
}

export function Tag({ children, onRemove }) {
  return (
    <span className="inline-flex items-center gap-1 rounded border border-line bg-[#faf9f6] px-1.5 py-px text-[11.5px] font-medium text-ink-2">
      {children}
      {onRemove && <button type="button" onClick={onRemove} aria-label={`Remove tag ${children}`} className="text-muted hover:text-ink">×</button>}
    </span>
  )
}

export const fmtDate = (d, opts = { day: 'numeric', month: 'short', year: 'numeric' }) => (d ? new Date(d).toLocaleDateString('en-IN', opts) : '—')
export const fmtDateTime = (d) => (d ? new Date(d).toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: 'numeric', minute: '2-digit' }) : '—')
export const ago = (d) => {
  if (!d) return ''
  const mins = Math.round((Date.now() - new Date(d).getTime()) / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  const h = Math.round(mins / 60)
  if (h < 24) return `${h}h ago`
  const days = Math.round(h / 24)
  return days < 30 ? `${days}d ago` : fmtDate(d)
}
