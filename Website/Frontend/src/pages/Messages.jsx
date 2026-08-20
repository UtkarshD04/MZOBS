import { useEffect, useState } from 'react'
import { Paperclip, Send } from 'lucide-react'
import Avatar from '../components/ui/Avatar'
import EmptyState from '../components/ui/EmptyState'
import ErrorState from '../components/ui/ErrorState'
import { PageSkeleton } from '../components/ui/Skeleton'
import { StaggerGroup, StaggerItem } from '../components/ui/Stagger'
import { useThreadsQuery, useThreadMessagesQuery, useSendMessageMutation } from '../hooks/useMessages'
import { cn } from '../lib/utils'

export default function Messages() {
  const [activeId, setActiveId] = useState(null)
  const [draft, setDraft] = useState('')
  const { data: threads = [], isLoading, isError, refetch } = useThreadsQuery()

  useEffect(() => {
    if (!activeId && threads.length > 0) setActiveId(threads[0].id)
  }, [activeId, threads])

  const { data: messages = [] } = useThreadMessagesQuery(activeId)
  const sendMessage = useSendMessageMutation(activeId)
  const active = threads.find((t) => t.id === activeId)

  if (isLoading) return <PageSkeleton />
  if (isError) return <ErrorState onRetry={refetch} />

  function handleSend() {
    const text = draft.trim()
    if (!text || !activeId) return
    setDraft('')
    sendMessage.mutate(text)
  }

  return (
    <StaggerGroup>
      <StaggerItem className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Messages</h1>
        <p className="text-sm text-ink-secondary mt-1">Talk directly to your recruiter, advisor and coordinator.</p>
      </StaggerItem>

      <StaggerItem>
        {threads.length === 0 ? (
          <EmptyState title="No conversations yet" body="Messages from the Mzobs team will show up here." />
        ) : (
          <div className="grid md:grid-cols-[300px_1fr] h-[calc(100vh-340px)] min-h-[460px] border border-border rounded-xl overflow-hidden bg-surface">
            <div className="border-r border-border overflow-y-auto max-md:max-h-[220px]">
              {threads.map((t) => (
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
              {active && (
                <div className="px-5 py-3.5 border-b border-border flex items-center gap-3 flex-shrink-0">
                  <Avatar initials={active.av} size="md" />
                  <div>
                    <div className="text-[13.5px] font-semibold">{active.name}</div>
                    <div className="text-xs text-ink-tertiary">{active.role}</div>
                  </div>
                </div>
              )}
              <div className="flex-1 overflow-y-auto p-[22px] flex flex-col gap-3.5">
                {messages.map((m) => (
                  <div
                    key={m.id}
                    className={cn(
                      'max-w-[62%] px-3.5 py-2.5 rounded-2xl text-[13.5px] leading-relaxed',
                      m.direction === 'in' ? 'bg-surface-sunken rounded-bl-md self-start' : 'bg-navy text-white rounded-br-md self-end'
                    )}
                  >
                    {m.text}
                    <div className={cn('text-[10.5px] mt-1', m.direction === 'in' ? 'text-ink-tertiary' : 'text-white/60')}>
                      {new Date(m.time).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                ))}
              </div>
              <div className="px-4.5 py-3.5 border-t border-border flex items-center gap-2.5 flex-shrink-0">
                <button className="w-9 h-9 rounded-[10px] flex items-center justify-center text-ink-secondary hover:bg-surface-hover">
                  <Paperclip size={17} />
                </button>
                <input
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Type a message…"
                  className="flex-1 h-10 px-4 rounded-full border border-border-strong bg-surface text-[13.5px] outline-none focus:border-navy"
                />
                <button
                  onClick={handleSend}
                  disabled={sendMessage.isPending || !draft.trim()}
                  className="w-9 h-9 rounded-[10px] bg-navy-tint text-navy flex items-center justify-center disabled:opacity-50"
                >
                  <Send size={17} />
                </button>
              </div>
            </div>
          </div>
        )}
      </StaggerItem>
    </StaggerGroup>
  )
}
