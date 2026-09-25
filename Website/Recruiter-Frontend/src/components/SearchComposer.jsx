import { useEffect, useMemo, useRef, useState } from 'react'
import clsx from 'clsx'
import { Search, Sparkles, Braces, ChevronDown, CornerDownLeft, AlertCircle, CheckCircle2, CircleHelp, X } from 'lucide-react'
import { SCOPES } from '../lib/talent/criteria'
import { exampleQueries } from '../lib/talent/parse'
import { validateBoolean, boolToString, BOOLEAN_EXAMPLES, FIELD_HELP } from '../lib/talent/boolean'

function Toggle({ on, onClick, icon: Icon, children, tone }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={on}
      className={clsx(
        'flex h-8 items-center gap-1.5 rounded-lg border px-2.5 text-[12.5px] font-medium transition-colors',
        on ? (tone === 'ai' ? 'border-[#a9dcd3] bg-ai-soft text-[#0a6f64]' : 'border-[#bfdbfe] bg-blue-soft text-[#1f6fb2]') : 'border-line bg-white text-muted hover:text-ink'
      )}
    >
      <Icon size={13} /> {children}
      <span className={clsx('h-3.5 w-6 rounded-full p-0.5 transition-colors', on ? (tone === 'ai' ? 'bg-ai' : 'bg-blue') : 'bg-[#c4d1db]')}>
        <span className={clsx('block h-2.5 w-2.5 rounded-full bg-white transition-transform', on && 'translate-x-2.5')} />
      </span>
    </button>
  )
}

export default function SearchComposer({ criteria, onSearch, onClear, canClear, loading }) {
  const [text, setText] = useState(criteria.q)
  const [mode, setMode] = useState(criteria.mode === 'boolean' ? 'boolean' : 'ai')
  const [scope, setScope] = useState(criteria.scope)
  const [scopeOpen, setScopeOpen] = useState(false)
  const [focus, setFocus] = useState(false)
  const ref = useRef(null)

  // keep the box in sync when criteria are replaced from elsewhere (recent/saved search, job)
  useEffect(() => {
    setText(criteria.q)
    if (criteria.mode === 'ai' || criteria.mode === 'boolean') setMode(criteria.mode)
  }, [criteria.q, criteria.mode])

  const submit = (value = text) => {
    if (mode === 'boolean' && value.trim()) {
      const v = validateBoolean(value)
      if (!v.ok) {
        setTried(true)
        return
      }
    }
    setTried(false)
    onSearch(value, mode, scope)
    ref.current?.blur()
  }
  const ai = mode === 'ai'
  const isBool = mode === 'boolean'
  const check = useMemo(() => (isBool && text.trim() ? validateBoolean(text) : null), [isBool, text])
  const [showHelp, setShowHelp] = useState(false)
  const [tried, setTried] = useState(false)

  // Inserts an operator/snippet at the caret (or wraps the selection for brackets and quotes).
  const insert = (snippet) => {
    const el = ref.current
    const a = el?.selectionStart ?? text.length
    const b = el?.selectionEnd ?? text.length
    const sel = text.slice(a, b)
    let next
    let caret
    if (snippet === '()' || snippet === '""') {
      next = text.slice(0, a) + snippet[0] + sel + snippet[1] + text.slice(b)
      caret = a + 1 + sel.length
    } else {
      const pad = (text[a - 1] && !/\s|\(/.test(text[a - 1]) ? ' ' : '') + snippet + ' '
      next = text.slice(0, a) + pad + text.slice(b)
      caret = a + pad.length
    }
    setText(next)
    requestAnimationFrame(() => { el?.focus(); el?.setSelectionRange(caret, caret) })
  }

  return (
    <div className={clsx('rounded-2xl border bg-white p-3 shadow-card transition-shadow', focus ? (ai ? 'border-ai shadow-[0_0_0_4px_rgba(10,111,100,0.12)]' : 'border-blue shadow-[0_0_0_4px_rgba(31,111,178,0.12)]') : 'border-line')}>
      <div className="flex items-start gap-3 px-1.5 pt-1">
        <div className={clsx('mt-1 grid h-8 w-8 shrink-0 place-items-center rounded-lg', ai ? 'bg-ai-soft text-ai' : 'bg-blue-soft text-blue')}>
          {ai ? <Sparkles size={16} className={loading ? 'ai-pulse' : ''} /> : <Braces size={16} />}
        </div>
        <textarea
          ref={ref}
          value={text}
          rows={2}
          onChange={(e) => setText(e.target.value)}
          onFocus={() => setFocus(true)}
          onBlur={() => setFocus(false)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault()
              submit()
            }
          }}
          placeholder={ai ? 'Search skills, roles, companies, technologies or keywords…' : isBool ? 'python AND (aws OR gcp) NOT java' : 'Type keywords, separated by commas'}
          className={clsx('min-h-[52px] flex-1 resize-none bg-transparent py-1.5 text-[15px] leading-6 outline-none placeholder:text-[#8aa0b2]', isBool && 'font-mono text-[14px]')}
          aria-label="Search candidates"
        />
        {(text || canClear) && (
          <button
            type="button"
            onClick={() => {
              setText('')
              setTried(false)
              onClear?.()
              ref.current?.focus()
            }}
            aria-label="Clear search"
            title="Clear search and filters"
            className="mt-1 grid h-8 w-8 shrink-0 place-items-center rounded-lg text-muted transition-colors hover:bg-line-2 hover:text-ink"
          >
            <X size={16} />
          </button>
        )}
        <button type="button" onClick={() => submit()} disabled={check && !check.ok && tried} className={clsx('mt-0.5 flex h-10 items-center gap-1.5 rounded-2xl px-4 text-[14px] font-semibold text-white transition-colors', ai ? 'bg-accent hover:bg-ink' : 'bg-blue hover:bg-[#185a94]')}>
          <Search size={15} /> <span className="hidden sm:inline">Search</span>
        </button>
      </div>

      <div className="mt-2 flex flex-wrap items-center gap-2 border-t border-line-2 px-1.5 pt-2.5">
        <Toggle on={ai} tone="ai" icon={Sparkles} onClick={() => setMode(ai ? 'keyword' : 'ai')}>AI search</Toggle>
        <Toggle on={mode === 'boolean'} tone="blue" icon={Braces} onClick={() => setMode(mode === 'boolean' ? 'ai' : 'boolean')}>Boolean</Toggle>
        <div className="relative">
          <button type="button" onClick={() => setScopeOpen((v) => !v)} onBlur={() => setTimeout(() => setScopeOpen(false), 120)} className="flex h-8 items-center gap-1.5 rounded-lg border border-line bg-white px-2.5 text-[12.5px] font-medium text-ink-2 hover:bg-line-2">
            Search in: <b className="font-semibold text-ink">{SCOPES.find((s) => s.id === scope).label}</b> <ChevronDown size={13} />
          </button>
          {scopeOpen && (
            <div className="fade-up absolute left-0 top-9 z-20 w-44 rounded-2xl border border-line bg-white p-1 shadow-lift">
              {SCOPES.map((s) => (
                <button key={s.id} onMouseDown={() => { setScope(s.id); setScopeOpen(false) }} className={clsx('block w-full rounded-lg px-3 py-1.5 text-left text-[13px] hover:bg-line-2', s.id === scope && 'font-semibold text-accent')}>{s.label}</button>
              ))}
            </div>
          )}
        </div>
        <span className="ml-auto hidden items-center gap-1 text-[11.5px] text-muted sm:flex"><CornerDownLeft size={12} /> Enter to search</span>
      </div>

      {ai && !text && exampleQueries().length > 0 && (
        <div className="fade-up mt-3 rounded-2xl bg-[#f2fbf9] px-3 py-2.5">
          <p className="text-[12px] text-muted">Mzobs understands natural language — describe who you need and it turns it into filters you can edit. Try:</p>
          <div className="mt-2 flex flex-col gap-1.5">
            {exampleQueries().map((q) => (
              <button key={q} type="button" onClick={() => { setText(q); submit(q) }} className="w-fit max-w-full truncate rounded-lg border border-[#bfe6df] bg-white px-2.5 py-1 text-left text-[12.5px] text-[#0a6f64] hover:bg-ai-soft">
                “{q}”
              </button>
            ))}
          </div>
        </div>
      )}
      {isBool && (
        <div className="fade-up mt-3 space-y-2.5 px-1">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[11.5px] font-semibold uppercase tracking-wide text-muted">Insert</span>
            {[['AND', 'AND'], ['OR', 'OR'], ['NOT', 'NOT'], ['( )', '()'], ['" "', '""']].map(([label, snip]) => (
              <button key={label} type="button" onMouseDown={(e) => e.preventDefault()} onClick={() => insert(snip)} className="rounded-md border border-line bg-white px-2 py-0.5 font-mono text-[12px] font-semibold text-ink-2 transition-colors hover:border-blue hover:text-blue">{label}</button>
            ))}
            <button type="button" onClick={() => setShowHelp((v) => !v)} aria-expanded={showHelp} className="ml-auto flex items-center gap-1 text-[12px] font-medium text-blue hover:underline"><CircleHelp size={13} /> Syntax help</button>
          </div>

          {check && !check.ok && (
            <p role="alert" className={clsx('flex items-start gap-1.5 rounded-lg px-2.5 py-1.5 text-[12.5px]', tried ? 'bg-[#fdecec] text-bad' : 'bg-warn-soft text-warn')}>
              <AlertCircle size={14} className="mt-0.5 shrink-0" />
              <span>{check.error}{check.pos != null && <span className="ml-1 font-mono text-[11.5px] opacity-80">(at “{text.slice(check.pos, check.pos + 12).trim()}…”)</span>}</span>
            </p>
          )}
          {check?.ok && check.ast && (
            <p className="flex items-start gap-1.5 rounded-lg bg-blue-soft px-2.5 py-1.5 text-[12.5px] text-[#185a94]">
              <CheckCircle2 size={14} className="mt-0.5 shrink-0" />
              <span>Reads as <b className="font-mono text-[12px] font-semibold">{boolToString(check.ast)}</b></span>
            </p>
          )}

          {(showHelp || !text) && (
            <div className="rounded-xl border border-line bg-[#f5f9fb] p-3 text-[12.5px] text-ink-2">
              <div className="grid gap-x-6 gap-y-1 sm:grid-cols-2">
                <p><code className="font-mono font-semibold">python AND aws</code> — both (AND is optional)</p>
                <p><code className="font-mono font-semibold">react OR vue</code> — either</p>
                <p><code className="font-mono font-semibold">NOT java</code> or <code className="font-mono font-semibold">-java</code> — exclude</p>
                <p><code className="font-mono font-semibold">(a OR b) AND c</code> — group with brackets</p>
                <p><code className="font-mono font-semibold">"machine learning"</code> — exact phrase</p>
                <p><code className="font-mono font-semibold">react*</code> — wildcard</p>
              </div>
              {showHelp && (
                <div className="mt-2 border-t border-line pt-2">
                  <p className="mb-1 font-semibold text-ink">Search a specific field</p>
                  <div className="grid gap-x-6 gap-y-0.5 sm:grid-cols-2">
                    {FIELD_HELP.map(([f, d]) => <p key={f}><code className="font-mono font-semibold text-blue">{f}</code> {d}</p>)}
                  </div>
                </div>
              )}
              <div className="mt-2 flex flex-col items-start gap-1.5 border-t border-line pt-2">
                <span className="text-[11.5px] font-semibold uppercase tracking-wide text-muted">Try</span>
                {BOOLEAN_EXAMPLES.map((q) => (
                  <button key={q} type="button" onClick={() => { setText(q); submit(q) }} className="max-w-full truncate rounded-lg border border-[#bfdbfe] bg-white px-2.5 py-1 text-left font-mono text-[12px] text-[#185a94] hover:bg-blue-soft">{q}</button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
