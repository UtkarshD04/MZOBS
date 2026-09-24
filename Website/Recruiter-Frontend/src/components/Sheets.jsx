import { Sparkles, Check, AlertCircle } from 'lucide-react'
import { Sheet, StatusPill, Chip } from './ui'
import { MATCH_LABELS } from '../lib/talent/engine'
import { IS_DEMO } from '../lib/config'

function Bar({ value }) {
  const color = value >= 85 ? 'bg-ai' : value >= 65 ? 'bg-blue' : 'bg-[#f59e0b]'
  return (
    <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-line-2">
      <div className={`h-full rounded-full ${color}`} style={{ width: `${value}%`, transition: 'width .6s ease-out' }} />
    </div>
  )
}

export function MatchSheet({ row, onClose }) {
  const open = !!row
  const c = row?.candidate
  const m = row?.match
  const parts = m ? Object.entries(m.parts).filter(([, v]) => v != null) : []
  return (
    <Sheet open={open} onClose={onClose} title="Why this candidate matches" subtitle={c && `${c.name} · ${c.designation}`}>
      {m && (
        <div className="space-y-6">
          <div className="flex items-center gap-4 rounded-2xl bg-ai-soft p-4">
            <div className="grid h-14 w-14 place-items-center rounded-full bg-white text-[18px] font-bold text-[#0a6f64]">{m.overall}%</div>
            <div>
              <p className="flex items-center gap-1.5 text-[14px] font-semibold"><Sparkles size={14} className="text-ai" /> Overall match</p>
              <p className="text-[12.5px] text-muted">Weighted across the {parts.length} requirement{parts.length === 1 ? '' : 's'} in your search.</p>
            </div>
          </div>

          <div className="space-y-3">
            {parts.map(([k, v]) => (
              <div key={k} className="flex items-center gap-3">
                <span className="w-32 text-[13px] text-ink-2">{MATCH_LABELS[k]}</span>
                <Bar value={v} />
                <span className="w-10 text-right text-[13px] font-semibold tabular-nums">{v}%</span>
              </div>
            ))}
          </div>

          {m.strong.length > 0 && (
            <div>
              <h3 className="mb-2 flex items-center gap-1.5 text-[13px] font-semibold text-[#1a8f5a]"><Check size={14} /> Strong matches</h3>
              <div className="flex flex-wrap gap-1.5">{m.strong.map((s) => <Chip key={s} tone="ok">{s}</Chip>)}</div>
            </div>
          )}
          {(m.weak.length > 0 || m.notes.length > 0) && (
            <div>
              <h3 className="mb-2 flex items-center gap-1.5 text-[13px] font-semibold text-warn"><AlertCircle size={14} /> Missing or weaker areas</h3>
              <div className="flex flex-wrap gap-1.5">{m.weak.map((s) => <Chip key={s}>{s}</Chip>)}</div>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-[13px] text-ink-2">{m.notes.map((n) => <li key={n}>{n}</li>)}</ul>
            </div>
          )}
          <p className="rounded-lg bg-line-2 px-3 py-2 text-[12px] text-muted">
            Scores come from a transparent rule-based comparison of the candidate's profile with your filters — no model is guessing.{IS_DEMO && ' Candidates shown are demo data.'}
          </p>
        </div>
      )}
    </Sheet>
  )
}

export function TrustSheet({ row, onClose }) {
  const c = row?.candidate
  const t = row?.trust
  return (
    <Sheet open={!!row} onClose={onClose} title="Mzobs Trust Score" subtitle={c && c.name}>
      {t && (
        <div className="space-y-5">
          <div className="flex items-end gap-2"><span className="text-[40px] font-bold leading-none">{t.score}</span><span className="pb-1 text-muted">/ 100</span></div>
          <ul className="divide-y divide-line-2 rounded-2xl border border-line">
            {t.rows.map((r) => (
              <li key={r.key} className="flex items-center justify-between gap-3 px-4 py-3">
                <div>
                  <p className="text-[13.5px] font-medium">{r.label}</p>
                  {r.detail && <p className="text-[12px] text-muted">{r.detail}</p>}
                </div>
                <StatusPill status={r.status} />
              </li>
            ))}
          </ul>
          <p className="rounded-lg bg-line-2 px-3 py-2 text-[12px] text-muted">
            Only checks Mzobs has actually completed count as Verified. Pending counts partially; Not verified counts nothing. Profile completeness and activity are measured, not verified.
          </p>
        </div>
      )}
    </Sheet>
  )
}

