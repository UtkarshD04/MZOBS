import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Unlock, Search, FileText, Mail, Download, Eye } from 'lucide-react'
import { Avatar, Button, EmptyState, Skeleton } from '../components/ui'
import { useActions } from '../components/useActions'
import { useWorkspace } from '../store/workspace'
import { makeCriteria } from '../lib/talent/criteria'
import { listUnlocks } from '../services/liveApi'
import { getTalentMany } from '../services/talentService'
import { agoDate, years } from '../lib/format'
import { IS_DEMO } from '../lib/config'
import { isRevealed } from '../lib/reveal'

// Every candidate this company has spent a CV credit on — the recruiter's
// "downloaded CVs" folder, with contact details and the CV one click away.
export default function UnlockedCvs() {
  const { onAction, host } = useActions(makeCriteria())
  const { toast } = useWorkspace()
  const [rows, setRows] = useState(null)
  const [error, setError] = useState(false)
  const [q, setQ] = useState('')

  useEffect(() => {
    if (IS_DEMO) return setRows([])
    listUnlocks()
      .then(async (unlocks) => {
        // The unlock row only has the name; the talent pool has the full profile and unmasked contact.
        const people = await getTalentMany(unlocks.map((u) => u.candidate?.id).filter(Boolean))
        const byCandidate = new Map(people.map((p) => [p._live?.candidateId, p]))
        setRows(unlocks.map((u) => ({ ...u, person: byCandidate.get(u.candidate?.id) ?? null })))
      })
      .catch(() => setError(true))
  }, [])

  const shown = useMemo(() => {
    const t = q.trim().toLowerCase()
    if (!rows || !t) return rows
    return rows.filter((r) => [r.candidate?.name, r.job?.title, r.person?.designation, r.person?.location, ...(r.person?.skills ?? [])].some((v) => v?.toLowerCase().includes(t)))
  }, [rows, q])
  const credits = rows?.reduce((n, r) => n + (r.creditsUsed ?? 1), 0) ?? 0

  const exportCsv = () => {
    const esc = (v) => `"${String(v ?? '').replace(/"/g, '""')}"`
    const csv = [
      ['Name', 'Email', 'Phone', 'Designation', 'Experience (yrs)', 'Location', 'Job', 'Unlocked on'].join(','),
      ...shown.map((r) => [r.candidate?.name, r.person?.contact?.email, r.person?.contact?.phone, r.person?.designation, r.person?.experienceYears, r.person?.location, r.job?.title, new Date(r.unlockedAt ?? r.createdAt).toLocaleDateString('en-IN')].map(esc).join(',')),
    ].join('\n')
    const a = document.createElement('a')
    a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }))
    a.download = 'mzobs-unlocked-cvs.csv'
    a.click()
    toast(`Exported ${shown.length} candidate${shown.length === 1 ? '' : 's'}`)
  }

  return (
    <div className="mx-auto max-w-[1100px] px-4 pb-28 pt-6 lg:px-6">
      <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-[28px] font-extrabold tracking-[-0.02em]">Unlocked <em className="font-semibold italic text-accent">CVs</em></h1>
          <p className="mt-1 text-[14px] text-muted">{rows ? `${rows.length} candidate${rows.length === 1 ? '' : 's'} · ${credits} CV credit${credits === 1 ? '' : 's'} used` : 'Candidates your company has unlocked with a CV credit.'}</p>
        </div>
        {rows?.length > 0 && (
          <div className="flex flex-wrap gap-2">
            <label className="relative">
              <Search size={14} className="pointer-events-none absolute left-2.5 top-2.5 text-muted" />
              <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Name, job, skill…" aria-label="Filter unlocked CVs" className="h-9 w-56 rounded-lg border border-line bg-white pl-8 pr-3 text-[13px] outline-none focus:border-accent" />
            </label>
            <Button icon={Download} onClick={exportCsv} disabled={!shown?.length}>Export CSV</Button>
          </div>
        )}
      </div>

      {error ? (
        <EmptyState icon={Unlock} title="Couldn't load your unlocked CVs" body="Check your connection and refresh the page." />
      ) : rows === null ? (
        <div className="space-y-2">{[0, 1, 2, 3].map((i) => <Skeleton key={i} className="h-20 w-full" />)}</div>
      ) : rows.length === 0 ? (
        <EmptyState
          icon={Unlock}
          title={IS_DEMO ? 'Demo data has no unlocks' : 'No CVs unlocked yet'}
          body="View a candidate's email, phone or CV from search — one CV credit per candidate. They'll be listed here."
          action={<Link to="/" className="text-[13px] font-medium text-accent hover:underline">Search candidates</Link>}
        />
      ) : shown.length === 0 ? (
        <EmptyState icon={Search} title="No unlocked CVs match" body="Try a different name, job or skill." />
      ) : (
        <ul className="space-y-2">
          {shown.map((r) => {
            const p = r.person
            const name = r.candidate?.name ?? 'Removed candidate'
            return (
              <li key={r.id} className="flex flex-wrap items-center gap-3 rounded-2xl border border-line bg-white p-3.5 shadow-card sm:p-4">
                <Avatar candidate={p ?? { id: r.id, initials: name.slice(0, 1) }} size={42} />
                <div className="min-w-0 flex-1">
                  {p ? <Link to={`/candidate/${p.id}`} className="font-semibold hover:text-accent">{name}</Link> : <span className="font-semibold">{name}</span>}
                  <p className="truncate text-[13px] text-muted">{p ? [p.designation, years(p.experienceYears), p.location].filter(Boolean).join(' · ') : r.candidate?.headline}</p>
                  <p className="mt-0.5 text-[12px] text-muted">{r.job?.title && <>For {r.job.title} · </>}Unlocked {agoDate(r.unlockedAt ?? r.createdAt)}</p>
                </div>
                {p?.contact && (
                  <div className="min-w-[180px] text-[13px]">
                    {['email', 'phone'].map((part) =>
                      isRevealed(p, part) ? (
                        <p key={part} className={part === 'email' ? 'truncate font-medium' : 'text-ink-2'}>{p.contact[part] || '—'}</p>
                      ) : (
                        <button key={part} onClick={() => onAction('unlock', p, part)} title={`View the ${part === 'email' ? 'email' : 'phone number'} — free, the credit is already used`} className="flex items-center gap-1.5 text-ink-2 hover:text-accent">
                          {p._live?.contactPreview?.[part] ?? '—'} <Eye size={12} /> <span className="font-semibold text-accent">View</span>
                        </button>
                      )
                    )}
                  </div>
                )}
                {p && (
                  <div className="flex gap-1.5">
                    <Button size="sm" icon={FileText} onClick={() => onAction('resume', p)}>View CV</Button>
                    <Button size="sm" variant="primary" icon={Mail} onClick={() => onAction('contact', p)}>Contact</Button>
                  </div>
                )}
              </li>
            )
          })}
        </ul>
      )}
      {host}
    </div>
  )
}
