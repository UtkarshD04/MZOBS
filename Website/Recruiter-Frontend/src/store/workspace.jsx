import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'

// Recruiter workspace state: shortlists, saved/recent searches, notes,
// selection, compare tray and toasts.
//
// There is no backend for shortlists/saved searches/notes yet, so they persist
// to localStorage on this device. Each mutation below is a plain function, so
// pointing them at real endpoints later only touches this file.

const KEYS = { shortlists: 'mzt-shortlists', saved: 'mzt-saved-searches', recent: 'mzt-recent-searches', notes: 'mzt-notes', saved_ids: 'mzt-saved-candidates', messages: 'mzt-messages', interviews: 'mzt-interviews' }
const Ctx = createContext(null)

function read(key, fallback) {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}
function usePersisted(key, initial) {
  const [value, setValue] = useState(() => read(key, initial))
  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch {
      /* storage unavailable — state lives for this session only */
    }
  }, [key, value])
  return [value, setValue]
}
const uid = (p) => `${p}-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`

export function WorkspaceProvider({ children }) {
  const [shortlists, setShortlists] = usePersisted(KEYS.shortlists, [{ id: 'default', name: 'Shortlisted', candidateIds: [], createdAt: new Date().toISOString(), lastActivity: new Date().toISOString() }])
  const [saved, setSaved] = usePersisted(KEYS.saved, [])
  const [recent, setRecent] = usePersisted(KEYS.recent, [])
  const [notes, setNotes] = usePersisted(KEYS.notes, {})
  const [savedIds, setSavedIds] = usePersisted(KEYS.saved_ids, [])
  const [messages, setMessages] = usePersisted(KEYS.messages, [])
  const [interviews, setInterviews] = usePersisted(KEYS.interviews, [])
  const [selected, setSelected] = useState([])
  const [compare, setCompare] = useState([])
  const [toasts, setToasts] = useState([])
  const timers = useRef(new Map())

  const dismissToast = useCallback((id) => {
    clearTimeout(timers.current.get(id))
    timers.current.delete(id)
    setToasts((t) => t.filter((x) => x.id !== id))
  }, [])
  const toast = useCallback(
    (message, { tone = 'ok', action } = {}) => {
      const id = uid('t')
      setToasts((t) => [...t.slice(-3), { id, message, tone, action }])
      timers.current.set(id, setTimeout(() => dismissToast(id), 4200))
    },
    [dismissToast]
  )

  const api = useMemo(() => {
    const touch = (l) => ({ ...l, lastActivity: new Date().toISOString() })
    return {
      shortlists,
      saved,
      recent,
      notes,
      savedIds,
      messages,
      interviews,
      selected,
      compare,
      toasts,
      toast,
      dismissToast,

      // selection
      toggleSelect: (id) => setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id])),
      selectMany: (ids) => setSelected((s) => [...new Set([...s, ...ids])]),
      clearSelection: () => setSelected([]),

      // compare (2–5)
      toggleCompare: (id) =>
        setCompare((c) => {
          if (c.includes(id)) return c.filter((x) => x !== id)
          if (c.length >= 5) {
            toast('You can compare up to 5 candidates', { tone: 'warn' })
            return c
          }
          return [...c, id]
        }),
      setCompareIds: (ids) => setCompare(ids.slice(0, 5)),
      clearCompare: () => setCompare([]),

      // shortlists
      createShortlist: (name) => {
        const list = { id: uid('sl'), name: name.trim(), candidateIds: [], createdAt: new Date().toISOString(), lastActivity: new Date().toISOString() }
        setShortlists((s) => [...s, list])
        return list
      },
      renameShortlist: (id, name) => setShortlists((s) => s.map((l) => (l.id === id ? touch({ ...l, name }) : l))),
      deleteShortlist: (id) => setShortlists((s) => s.filter((l) => l.id !== id)),
      addToShortlist: (listId, ids) => {
        let added = 0
        setShortlists((s) =>
          s.map((l) => {
            if (l.id !== listId) return l
            const fresh = ids.filter((i) => !l.candidateIds.includes(i))
            added = fresh.length
            return touch({ ...l, candidateIds: [...l.candidateIds, ...fresh] })
          })
        )
        return added
      },
      removeFromShortlist: (listId, id) => setShortlists((s) => s.map((l) => (l.id === listId ? touch({ ...l, candidateIds: l.candidateIds.filter((x) => x !== id) }) : l))),

      // saved candidates (bookmark, distinct from shortlists)
      toggleSaved: (id) => setSavedIds((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id])),

      // saved searches
      saveSearch: (name, criteria, count) => {
        const item = { id: uid('ss'), name, criteria, createdAt: new Date().toISOString(), lastRunAt: new Date().toISOString(), lastCount: count ?? null, alert: false }
        setSaved((s) => [item, ...s])
        return item
      },
      updateSavedSearch: (id, patch) => setSaved((s) => s.map((x) => (x.id === id ? { ...x, ...patch } : x))),
      deleteSavedSearch: (id) => setSaved((s) => s.filter((x) => x.id !== id)),

      // recent searches (deduped by criteria, newest first, capped)
      pushRecent: (criteria) =>
        setRecent((r) => {
          const key = JSON.stringify(criteria)
          return [{ id: uid('rs'), criteria, at: new Date().toISOString() }, ...r.filter((x) => JSON.stringify(x.criteria) !== key)].slice(0, 8)
        }),
      clearRecent: () => setRecent([]),

      // outreach drafts and interview plans - local until a messaging/scheduling service is connected
      addMessage: (m) => setMessages((x) => [{ id: uid('m'), at: new Date().toISOString(), ...m }, ...x]),
      addInterview: (i) => setInterviews((x) => [{ id: uid('iv'), createdAt: new Date().toISOString(), status: 'planned', ...i }, ...x]),

      // notes
      addNote: (candidateId, text) => setNotes((n) => ({ ...n, [candidateId]: [{ id: uid('n'), text, at: new Date().toISOString() }, ...(n[candidateId] ?? [])] })),
    }
  }, [shortlists, saved, recent, notes, savedIds, messages, interviews, selected, compare, toasts, toast, dismissToast, setShortlists, setSaved, setRecent, setNotes, setSavedIds, setMessages, setInterviews])

  return <Ctx.Provider value={api}>{children}</Ctx.Provider>
}

export function useWorkspace() {
  const v = useContext(Ctx)
  if (!v) throw new Error('useWorkspace must be used inside WorkspaceProvider')
  return v
}
