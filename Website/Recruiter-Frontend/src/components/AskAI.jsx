import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Sparkles, CornerDownLeft } from 'lucide-react'
import { Modal, Button, Chip } from './ui'
import { parseNaturalLanguage } from '../lib/talent/parse'
import { criteriaToChips } from '../lib/talent/criteria'
import { useWorkspace } from '../store/workspace'

// `ready` prompts run against the real parser today; the rest are listed
// honestly as needing the AI service instead of faking an answer.
export const AI_PROMPTS = [
  { id: 'jd', label: 'Find candidates matching this JD', hint: 'Paste a job description; Mzobs extracts skills, experience and location and searches.', ready: true },
  { id: 'nl', label: 'Describe who you need', hint: 'Plain-English search — “React developers in Pune, 3–5 years”.', ready: true },
  { id: 'explain', label: 'Explain why this candidate is relevant', hint: 'Open any AI match badge for the rule-based breakdown.', ready: false },
  { id: 'similar', label: 'Find similar candidates', hint: 'Available on every candidate profile.', ready: false },
  { id: 'outreach', label: 'Draft outreach message', hint: 'Template drafts are available in Contact; model-written drafts need the AI service.', ready: false },
  { id: 'summarise', label: 'Summarise candidate', hint: 'Needs the Mzobs AI service.', ready: false },
  { id: 'questions', label: 'Generate interview questions', hint: 'Needs the Mzobs AI service.', ready: false },
  { id: 'gaps', label: 'Identify skill gaps', hint: 'Shown as “Missing or weaker areas” in the match explanation.', ready: false },
]

export default function AskAI({ open, onClose }) {
  const nav = useNavigate()
  const { toast } = useWorkspace()
  const [text, setText] = useState('')
  useEffect(() => { if (open) setText('') }, [open])
  const parsed = text.trim() ? parseNaturalLanguage(text) : null
  const chips = parsed ? criteriaToChips(parsed) : []

  const go = () => {
    if (!parsed || !chips.length) return toast('Mzobs couldn’t find skills, roles or locations in that. Add a few details.', { tone: 'warn' })
    onClose()
    nav('/', { state: { criteria: parsed } })
  }

  return (
    <Modal open={open} onClose={onClose} title="Ask Mzobs AI" subtitle="Describe who you need, or paste a job description." width={620}
      footer={<><Button onClick={onClose}>Cancel</Button><Button variant="ai" icon={Sparkles} onClick={go} disabled={!text.trim()}>Find candidates</Button></>}>
      <textarea autoFocus value={text} onChange={(e) => setText(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) go() }} rows={6} placeholder="e.g. Senior Python developer, 4–8 years, FastAPI and AWS, Bengaluru, joins within 45 days…" className="w-full rounded-2xl border border-line p-3 text-[14px] leading-6 outline-none focus:border-ai" />
      <div className="mt-2 flex min-h-7 flex-wrap items-center gap-1.5">
        {chips.length > 0 && <span className="mr-1 text-[12px] font-medium text-[#0a6f64]">Understood:</span>}
        {chips.map((c) => <Chip key={c.key} tone="ai">{c.label}</Chip>)}
        <span className="ml-auto flex items-center gap-1 text-[11.5px] text-muted"><CornerDownLeft size={11} /> Ctrl+Enter</span>
      </div>
      <p className="mt-4 mb-2 text-[12px] font-semibold uppercase tracking-wide text-muted">What Mzobs AI can do</p>
      <ul className="grid gap-1.5 sm:grid-cols-2">
        {AI_PROMPTS.map((p) => (
          <li key={p.id} className="flex items-center justify-between gap-2 rounded-lg bg-line-2 px-3 py-2 text-[12.5px]">
            <span>{p.label}</span>
            {!p.ready && <span className="whitespace-nowrap text-[10.5px] font-medium text-muted">SOON</span>}
          </li>
        ))}
      </ul>
    </Modal>
  )
}
