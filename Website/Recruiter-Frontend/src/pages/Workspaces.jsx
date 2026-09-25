import { Video, BarChart3, Sparkles, MessageSquare, CalendarDays } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Button, EmptyState } from '../components/ui'
import { listInterviews } from '../services/liveApi'
import { useWorkspace } from '../store/workspace'
import { IS_DEMO } from '../lib/config'
import { agoDate } from '../lib/format'
import { AI_PROMPTS } from '../components/AskAI'

function Page({ title, sub, children }) {
  return (
    <div className="mx-auto max-w-[980px] px-4 py-8 lg:px-6">
      <h1 className="text-[30px] font-extrabold tracking-[-0.03em] text-ink">{title}</h1>
      {sub && <p className="mt-1 text-[14px] text-muted">{sub}</p>}
      <div className="mt-6">{children}</div>
    </div>
  )
}

export function Messages() {
  const { messages } = useWorkspace()
  return (
    <Page title="Messages" sub="Outreach drafts you've prepared from candidate profiles.">
      {messages.length === 0 ? (
        <EmptyState icon={MessageSquare} title="No messages yet" body="Use Contact on a candidate to write an email, SMS or message." />
      ) : (
        <ul className="space-y-2">
          {messages.map((m) => (
            <li key={m.id} className="rounded-2xl border border-line bg-white p-4 shadow-card">
              <div className="flex items-center justify-between gap-3">
                <p className="text-[14px] font-semibold">{m.candidateName} <span className="ml-1 rounded bg-line-2 px-1.5 py-0.5 text-[11px] font-medium uppercase text-muted">{m.channel}</span></p>
                <span className="text-[12px] text-muted">Draft · {agoDate(m.at)}</span>
              </div>
              {m.subject && <p className="mt-1 text-[13px] font-medium">{m.subject}</p>}
              <p className="mt-1 line-clamp-3 whitespace-pre-line text-[13px] text-ink-2">{m.body}</p>
            </li>
          ))}
        </ul>
      )}
      <p className="mt-5 text-[12px] text-muted">Drafts are not delivered yet — sending requires the messaging service to be connected.</p>
    </Page>
  )
}

export function Interviews() {
  const { interviews: local } = useWorkspace()
  const [live, setLive] = useState(null)
  useEffect(() => {
    if (!IS_DEMO) listInterviews().then((rows) => setLive(rows.map((r) => ({ id: r.id, candidateName: r.candidateName, type: r.round || r.mode, date: new Date(r.startsAt).toLocaleDateString('en-IN'), time: new Date(r.startsAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }), interviewers: (r.panel ?? []).join(', '), link: r.meetingLink, status: r.status })))).catch(() => setLive([]))
  }, [])
  const interviews = IS_DEMO ? local : live ?? []
  return (
    <Page title="Interviews" sub="Interviews you've planned from candidate profiles.">
      {interviews.length === 0 ? (
        <EmptyState icon={CalendarDays} title="No interviews planned" body="Open a candidate and choose Schedule interview." />
      ) : (
        <ul className="space-y-2">
          {interviews.map((i) => (
            <li key={i.id} className="flex flex-wrap items-center justify-between gap-2 rounded-2xl border border-line bg-white p-4 shadow-card">
              <div>
                <p className="text-[14px] font-semibold">{i.candidateName}</p>
                <p className="text-[13px] text-muted">{i.type} · {i.date} at {i.time}{i.interviewers ? ` · ${i.interviewers}` : ''}</p>
              </div>
              <div className="flex items-center gap-2">
                {i.link && <a href={i.link} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-[13px] font-medium text-blue"><Video size={14} /> Join link</a>}
                <span className="rounded-md bg-blue-soft px-2 py-0.5 text-[12px] font-medium text-[#1f6fb2]">{i.status ?? 'Planned'}</span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </Page>
  )
}

export function AITalent({ onAskAI }) {
  return (
    <Page title="AI Talent" sub="Ask Mzobs AI to do the legwork. Press Ctrl+K anywhere.">
      <div className="grid gap-3 sm:grid-cols-2">
        {AI_PROMPTS.map((p) => (
          <div key={p.label} className="rounded-2xl border border-line bg-white p-4 shadow-card">
            <p className="flex items-center gap-2 text-[14px] font-semibold"><Sparkles size={14} className="text-ai" /> {p.label}</p>
            <p className="mt-1 text-[13px] text-muted">{p.hint}</p>
            {p.ready ? <Button className="mt-3" size="sm" variant="ai" onClick={onAskAI}>Try it</Button> : <span className="mt-3 inline-block rounded-md bg-line-2 px-2 py-0.5 text-[11.5px] font-medium text-muted">Needs the Mzobs AI service</span>}
          </div>
        ))}
      </div>
    </Page>
  )
}

export function Reports() {
  return (
    <Page title="Reports" sub="Hiring funnel, sources, search and outreach performance.">
      <EmptyState icon={BarChart3} title="Reports aren't connected yet" body="Analytics live here, deliberately away from the search screen. They'll populate from real hiring activity once the reporting endpoints are wired — no placeholder numbers are shown." />
    </Page>
  )
}
