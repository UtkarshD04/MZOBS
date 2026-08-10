import { useState } from 'react'
import { Paperclip, Send } from 'lucide-react'
import Avatar from '../components/ui/Avatar'
import { StaggerGroup, StaggerItem } from '../components/ui/Stagger'
import { MESSAGES_THREADS, CONVERSATIONS } from '../lib/data'
import { cn } from '../lib/utils'

export default function Messages() {
  const [activeId, setActiveId] = useState(1)
  const convo = CONVERSATIONS[activeId] || []
  const active = MESSAGES_THREADS.find((t) => t.id === activeId)

  return (
    <StaggerGroup>
      <StaggerItem className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Messages</h1>
        <p className="text-sm text-ink-secondary mt-1">Talk directly to your recruiter, advisor and coordinator.</p>
      </StaggerItem>

      <StaggerItem>
        <div className="grid md:grid-cols-[300px_1fr] h-[calc(100vh-340px)] min-h-[460px] border border-border rounded-xl overflow-hidden bg-surface">
          <div className="border-r border-border overflow-y-auto max-md:max-h-[220px]">
            {MESSAGES_THREADS.map((t) => (
              <div
                key={t.id}
                onClick={() => setActiveId(t.id)}
                className={cn('flex gap-2.5 px-4 py-3.5 cursor-pointer border-b border-border hover:bg-surface-hover', activeId === t.id && 'bg-navy-tint')}
              >
                <Avatar initials={t.av} size="md" />
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center">
                    <span className="text-[13.5px] font-semibold">{t.name}</span>
                    <span className="text-xs text-ink-tertiary">{t.time}</span>
                  </div>
                  <div className="text-xs text-ink-tertiary">{t.role}</div>
                  <div className="text-xs text-ink-tertiary mt-0.5 truncate">{t.last}</div>
                </div>
                {t.unread > 0 && <span className="w-2 h-2 rounded-full bg-gold-dot self-center flex-shrink-0" />}
              </div>
            ))}
          </div>

          <div className="flex flex-col min-w-0">
            <div className="px-5 py-3.5 border-b border-border flex items-center gap-3 flex-shrink-0">
              <Avatar initials={active.av} size="md" />
              <div>
                <div className="text-[13.5px] font-semibold">{active.name}</div>
                <div className="text-xs text-ink-tertiary">{active.role}</div>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-[22px] flex flex-col gap-3.5">
              {convo.map(([dir, text], i) => (
                <div
                  key={i}
                  className={cn(
                    'max-w-[62%] px-3.5 py-2.5 rounded-2xl text-[13.5px] leading-relaxed',
                    dir === 'in' ? 'bg-surface-sunken rounded-bl-md self-start' : 'bg-navy text-white rounded-br-md self-end'
                  )}
                >
                  {text}
                  <div className={cn('text-[10.5px] mt-1', dir === 'in' ? 'text-ink-tertiary' : 'text-white/60')}>10:4{i} AM</div>
                </div>
              ))}
            </div>
            <div className="px-4.5 py-3.5 border-t border-border flex items-center gap-2.5 flex-shrink-0">
              <button className="w-9 h-9 rounded-[10px] flex items-center justify-center text-ink-secondary hover:bg-surface-hover">
                <Paperclip size={17} />
              </button>
              <input placeholder="Type a message…" className="flex-1 h-10 px-4 rounded-full border border-border-strong bg-surface text-[13.5px] outline-none focus:border-navy" />
              <button className="w-9 h-9 rounded-[10px] bg-navy-tint text-navy flex items-center justify-center">
                <Send size={17} />
              </button>
            </div>
          </div>
        </div>
      </StaggerItem>
    </StaggerGroup>
  )
}
