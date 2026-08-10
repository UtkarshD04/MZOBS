import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Combobox, ComboboxInput, ComboboxOption, ComboboxOptions, Dialog, DialogBackdrop, DialogPanel } from '@headlessui/react'
import { Briefcase, CalendarCheck, FileCheck, LayoutDashboard, Search, Users } from 'lucide-react'
import { JOBS } from '../../data/mock'
import { CANDIDATES } from '../../data/mock'
import { cn } from '../../lib/utils'

interface Item {
  id: string
  label: string
  sub: string
  to: string
  icon: typeof Search
}

const staticPages: Item[] = [
  { id: 'p-dash', label: 'Dashboard', sub: 'Hiring overview', to: '/dashboard', icon: LayoutDashboard },
  { id: 'p-jobs', label: 'Jobs', sub: 'Manage job openings', to: '/jobs', icon: Briefcase },
  { id: 'p-candidates', label: 'Candidates', sub: 'Shared by Mzobs', to: '/candidates', icon: Users },
  { id: 'p-interviews', label: 'Interviews', sub: 'Schedule & calendar', to: '/interviews', icon: CalendarCheck },
  { id: 'p-offers', label: 'Offers', sub: 'Track offer letters', to: '/offers', icon: FileCheck },
]

const jobItems: Item[] = JOBS.map((j) => ({ id: j.id, label: j.title, sub: `${j.department} · ${j.location}`, to: `/jobs`, icon: Briefcase }))
const candidateItems: Item[] = CANDIDATES.map((c) => ({ id: c.id, label: c.name, sub: c.appliedFor, to: `/candidates/${c.id}`, icon: Users }))

const allItems = [...staticPages, ...jobItems, ...candidateItems]

export default function CommandPalette({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [query, setQuery] = useState('')
  const navigate = useNavigate()

  const results = useMemo(() => {
    if (!query.trim()) return staticPages
    const q = query.toLowerCase()
    return allItems.filter((i) => i.label.toLowerCase().includes(q) || i.sub.toLowerCase().includes(q)).slice(0, 8)
  }, [query])

  function go(item: Item) {
    navigate(item.to)
    onClose()
    setQuery('')
  }

  return (
    <Dialog open={open} onClose={onClose} className="relative z-[110]">
      <DialogBackdrop transition className="fixed inset-0 bg-navy-950/45 backdrop-blur-[2px] transition duration-150 data-[closed]:opacity-0" />
      <div className="fixed inset-0 flex items-start justify-center pt-[14vh] p-4">
        <DialogPanel transition className="w-full max-w-[560px] bg-surface border border-border rounded-2xl shadow-lg overflow-hidden transition duration-150 ease-out data-[closed]:opacity-0 data-[closed]:scale-95">
          <Combobox onChange={(item: Item | null) => item && go(item)}>
            <div className="flex items-center gap-3 px-4 border-b border-border">
              <Search size={17} className="text-ink-tertiary flex-shrink-0" />
              <ComboboxInput
                autoFocus
                placeholder="Search candidates, jobs, requisitions…"
                className="h-[52px] flex-1 bg-transparent outline-none text-[14px] placeholder:text-ink-tertiary"
                onChange={(e) => setQuery(e.target.value)}
              />
              <kbd className="text-[11px] font-semibold text-ink-tertiary bg-surface-sunken border border-border rounded-md px-1.5 py-0.5">ESC</kbd>
            </div>
            <ComboboxOptions static className="max-h-[360px] overflow-y-auto p-1.5">
              {results.length === 0 && <div className="px-3 py-8 text-center text-[13px] text-ink-tertiary">No results for “{query}”</div>}
              {results.map((item) => (
                <ComboboxOption
                  key={item.id}
                  value={item}
                  className={({ focus }) => cn('flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer', focus && 'bg-surface-hover')}
                >
                  <span className="w-8 h-8 rounded-lg bg-navy-tint text-navy flex items-center justify-center flex-shrink-0">
                    <item.icon size={15} />
                  </span>
                  <span className="flex-1 min-w-0">
                    <span className="block text-[13.5px] font-medium truncate">{item.label}</span>
                    <span className="block text-[11.5px] text-ink-tertiary truncate">{item.sub}</span>
                  </span>
                </ComboboxOption>
              ))}
            </ComboboxOptions>
          </Combobox>
        </DialogPanel>
      </div>
    </Dialog>
  )
}
