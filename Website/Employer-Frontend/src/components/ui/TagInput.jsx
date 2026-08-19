import { useState } from 'react'
import { X } from 'lucide-react'
import { inputClass } from './Field'
import { cn } from '../../lib/utils'

export default function TagInput({ value, onChange, placeholder }) {
  const [draft, setDraft] = useState('')

  function commit() {
    const v = draft.trim()
    if (v && !value.includes(v)) onChange([...value, v])
    setDraft('')
  }

  return (
    <div className={cn(inputClass, 'h-auto min-h-10 py-2 flex flex-wrap gap-1.5 items-center cursor-text')} onClick={(e) => e.currentTarget.querySelector('input')?.focus()}>
      {value.map((tag) => (
        <span key={tag} className="inline-flex items-center gap-1 bg-navy-tint text-navy text-[12px] font-semibold pl-2.5 pr-1.5 py-1 rounded-full">
          {tag}
          <button type="button" onClick={() => onChange(value.filter((t) => t !== tag))} className="w-4 h-4 rounded-full flex items-center justify-center hover:bg-navy hover:text-white">
            <X size={11} />
          </button>
        </span>
      ))}
      <input
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault()
            commit()
          } else if (e.key === 'Backspace' && !draft && value.length) {
            onChange(value.slice(0, -1))
          }
        }}
        onBlur={commit}
        placeholder={value.length === 0 ? placeholder : ''}
        className="flex-1 min-w-[120px] outline-none bg-transparent text-[13.5px] placeholder:text-ink-tertiary"
      />
    </div>
  )
}
