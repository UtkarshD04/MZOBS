import { useEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import {
  Search,
  LayoutDashboard,
  FileCheck,
  Video,
  Sun,
  LogOut,
} from 'lucide-react'
import { useApp } from '../../context/AppContext'
import { cn } from '../../lib/utils'

export default function CommandPalette() {
  const app = useApp()
  const { cmdkOpen, setCmdkOpen, toggleTheme } = app
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [sel, setSel] = useState(0)
  const inputRef = useRef(null)

  const commands = useMemo(() => {
    return [
      { grp: 'Navigate', icon: LayoutDashboard, label: 'Go to Dashboard', act: () => navigate('/app/dashboard') },
      { grp: 'Navigate', icon: FileCheck, label: 'Go to Resume Verification', act: () => navigate('/app/resumes') },
      { grp: 'Navigate', icon: Video, label: 'Go to Mock Interviews', act: () => navigate('/app/mock-interviews') },
      { grp: 'Actions', icon: Sun, label: 'Toggle theme', act: toggleTheme },
      { grp: 'Actions', icon: LogOut, label: 'Log out', act: () => navigate('/login') },
    ]
  }, [navigate, toggleTheme])

  const filtered = useMemo(() => commands.filter((c) => c.label.toLowerCase().includes(query.toLowerCase())), [commands, query])

  useEffect(() => {
    if (cmdkOpen) {
      setQuery('')
      setSel(0)
      setTimeout(() => inputRef.current?.focus(), 50)
    }
  }, [cmdkOpen])

  useEffect(() => {
    function onKey(e) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setCmdkOpen(true)
        return
      }
      if (!cmdkOpen) return
      if (e.key === 'Escape') setCmdkOpen(false)
      if (e.key === 'ArrowDown') {
        e.preventDefault()
        setSel((s) => Math.min(s + 1, filtered.length - 1))
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault()
        setSel((s) => Math.max(s - 1, 0))
      }
      if (e.key === 'Enter') {
        e.preventDefault()
        run(filtered[sel])
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [cmdkOpen, filtered, sel, setCmdkOpen])

  function run(cmd) {
    if (!cmd) return
    setCmdkOpen(false)
    cmd.act()
  }

  const groups = filtered.reduce((acc, c) => {
    ;(acc[c.grp] = acc[c.grp] || []).push(c)
    return acc
  }, {})

  let idx = -1

  return createPortal(
    <AnimatePresence>
      {cmdkOpen && (
        <motion.div
          className="fixed inset-0 bg-navy-950/50 backdrop-blur-[2px] z-[200] flex items-start justify-center pt-[14vh] px-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          onClick={(e) => e.target === e.currentTarget && setCmdkOpen(false)}
        >
          <motion.div
            className="w-full max-w-[560px] bg-surface rounded-2xl shadow-lg border border-border overflow-hidden"
            initial={{ opacity: 0, y: -16, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.98, transition: { duration: 0.13 } }}
            transition={{ type: 'spring', stiffness: 460, damping: 32 }}
          >
            <div className="flex items-center gap-[11px] px-[18px] py-4 border-b border-border">
              <Search size={18} className="text-ink-tertiary" />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value)
                  setSel(0)
                }}
                placeholder="Type a command or search…"
                className="border-none bg-transparent outline-none text-[15px] flex-1"
              />
              <span className="text-[11px] font-semibold text-ink-tertiary bg-surface border border-border rounded-md px-1.5 py-0.5">Esc</span>
            </div>
            <div className="max-h-[360px] overflow-y-auto p-2">
              {filtered.length === 0 && (
                <div className="flex flex-col items-center gap-2 py-8 text-ink-secondary text-sm">
                  <Search size={30} />
                  <span>No results</span>
                </div>
              )}
              {Object.keys(groups).map((g) => (
                <div key={g}>
                  <div className="text-[11px] font-bold tracking-wide uppercase text-ink-tertiary px-2.5 pt-2.5 pb-1">{g}</div>
                  {groups[g].map((c) => {
                    idx++
                    const active = idx === sel
                    return (
                      <div
                        key={c.label}
                        onClick={() => run(c)}
                        onMouseEnter={() => setSel(idx)}
                        className={cn('flex items-center gap-[11px] px-[11px] py-2.5 rounded-lg cursor-pointer text-[13.5px]', active ? 'bg-navy-tint text-navy' : 'text-ink')}
                      >
                        <c.icon size={16} className={active ? 'text-navy' : 'text-ink-secondary'} />
                        <span>{c.label}</span>
                      </div>
                    )
                  })}
                </div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  )
}
