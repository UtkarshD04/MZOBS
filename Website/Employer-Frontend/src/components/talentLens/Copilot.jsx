import { useState } from 'react'
import { Sparkles, Send, X, Bot } from 'lucide-react'
import { cn } from '../../lib/utils'
import { matchLevel } from '../../lib/talentLens/matchEngine'

const SUGGESTIONS = [
  'Show candidates who can join within 15 days',
  'Show my highest-match candidates',
  'Why was this candidate recommended?',
  'Compare these candidates',
]

// A contextual assistant over the CURRENT search results — not a general
// chatbot. Every answer here is computed from `results`/`selected` (the
// same data already on screen), never invented, and it augments the normal
// controls (filters, chips, drawer) rather than replacing them: anything it
// can't honestly answer from what's on screen says so, instead of guessing.
export default function Copilot({ results, selectedIds, onApplyAvailability, onAddSkillRequirement }) {
  const [open, setOpen] = useState(false)
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState([
    { role: 'assistant', text: "I'm Mzobs Copilot. Ask me about the candidates in your current results — availability, comparisons, or why someone was recommended." },
  ])

  function respond(text) {
    const q = text.toLowerCase()
    const selected = results.filter((r) => selectedIds.includes(r.candidate.id))

    if (/join.*within\s+(\d+)|within\s+(\d+)\s*days/.test(q)) {
      const days = Number(q.match(/(\d+)\s*days?/)?.[1] ?? 30)
      onApplyAvailability(days)
      return `Filtered to candidates who can join within ${days} days.`
    }
    if (/highest.match|best match|top match/.test(q)) {
      const top = [...results].sort((a, b) => b.match.overallMatch - a.match.overallMatch).slice(0, 3)
      if (!top.length) return 'No candidates in the current results to rank.'
      return `Your top matches right now: ${top.map((r) => `${r.candidate.name} (${r.match.overallMatch}%)`).join(', ')}.`
    }
    if (/why.*recommend|why.*match/.test(q)) {
      if (selected.length !== 1) return 'Select exactly one candidate (checkbox on their card) and ask again — I\'ll pull up their match explanation.'
      return selected[0].match.explanation
    }
    if (/compare/.test(q)) {
      if (selected.length < 2) return 'Select 2–3 candidates first, then ask me to compare them.'
      return selected
        .map((r) => `${r.candidate.name}: ${r.match.overallMatch}% match (${matchLevel(r.match.overallMatch).label.toLowerCase()}), ${r.candidate.experienceYears} yrs, notice ${r.candidate.noticePeriodDays}d`)
        .join('\n')
    }
    if (/stronger\s+(\w+)|more\s+(\w+)\s+experience/.test(q)) {
      const skill = q.match(/stronger\s+(\w+)|more\s+(\w+)\s+experience/)?.slice(1).find(Boolean)
      if (skill) {
        onAddSkillRequirement(skill)
        return `Added "${skill}" as a required skill and re-ranked your results.`
      }
    }
    if (/not\s+been\s+contacted|haven'?t\s+contacted/.test(q)) {
      return "Talent Lens doesn't track outreach status yet, so I can't tell who hasn't been contacted — that needs a Hiring Flow stage to be wired up first."
    }
    return "I can help with availability filters, comparing selected candidates, or explaining a match — try one of the suggestions below, or ask in your own words."
  }

  function send(text) {
    const value = text ?? input
    if (!value.trim()) return
    setMessages((m) => [...m, { role: 'user', text: value }, { role: 'assistant', text: respond(value) }])
    setInput('')
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className={cn(
          'fixed bottom-6 right-6 z-[70] h-12 px-4 rounded-full bg-[#20251F] dark:bg-navy text-white shadow-lg flex items-center gap-2 text-[13px] font-semibold hover:-translate-y-0.5 transition-transform duration-200',
          open && 'hidden'
        )}
      >
        <Sparkles size={16} /> Copilot
      </button>

      {open && (
        <div className="fixed inset-0 z-[90] flex items-end sm:items-end sm:justify-end sm:p-6" onClick={() => setOpen(false)}>
          <div className="absolute inset-0 bg-navy-950/25 backdrop-blur-[1px] sm:hidden" />
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full sm:w-[380px] max-h-[70vh] sm:max-h-[560px] bg-surface border border-border rounded-t-2xl sm:rounded-2xl shadow-lg flex flex-col"
          >
            <div className="flex items-center justify-between gap-3 px-4 py-3.5 border-b border-border flex-shrink-0">
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-navy-tint text-navy flex items-center justify-center">
                  <Bot size={16} />
                </span>
                <div>
                  <div className="text-[13.5px] font-semibold">Mzobs Copilot</div>
                  <div className="text-[11px] text-ink-tertiary">Preview — answers from your current results</div>
                </div>
              </div>
              <button onClick={() => setOpen(false)} className="text-ink-tertiary hover:text-ink">
                <X size={18} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-4 py-3.5 flex flex-col gap-3">
              {messages.map((m, i) => (
                <div key={i} className={cn('max-w-[85%] text-[12.5px] leading-relaxed rounded-xl px-3 py-2 whitespace-pre-line', m.role === 'user' ? 'self-end bg-navy text-white' : 'self-start bg-surface-sunken text-ink')}>
                  {m.text}
                </div>
              ))}
            </div>

            <div className="px-4 pt-1 pb-2 flex-shrink-0 flex flex-wrap gap-1.5">
              {SUGGESTIONS.map((s) => (
                <button key={s} onClick={() => send(s)} className="text-[11px] font-medium px-2.5 py-1 rounded-full border border-border-strong text-ink-secondary hover:border-navy hover:text-navy">
                  {s}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2 px-4 py-3 border-t border-border flex-shrink-0">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && send()}
                placeholder="Ask Copilot about these candidates…"
                className="flex-1 h-9 px-3 rounded-full border border-border-strong bg-surface text-[12.5px] outline-none focus:border-navy"
              />
              <button onClick={() => send()} className="w-9 h-9 rounded-full bg-navy text-white flex items-center justify-center flex-shrink-0 hover:bg-navy-hover">
                <Send size={14} />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
