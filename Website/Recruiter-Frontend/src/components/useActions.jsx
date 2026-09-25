import { useCallback, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { GitCompareArrows, X, Bookmark, FolderPlus, MessageSquare, Mail, Download } from 'lucide-react'
import { useWorkspace } from '../store/workspace'
import { getTalentMany } from '../services/talentService'
import { MatchSheet, TrustSheet } from './Sheets'
import { IS_DEMO } from '../lib/config'
import { getResumeLink } from '../services/liveApi'
import { ResumeViewer } from './ResumeViewer'
import { UnlockModal, ShortlistModal, AddToJobModal, OutreachModal, InterviewModal, NoteModal } from './ActionModals'
import CompareModal from './CompareModal'
import { Button } from './ui'

/**
 * One place that wires every recruiter action (card menus, profile header,
 * bulk bar) to its modal/sheet. Returns `onAction(type, payload)` plus the
 * `host` element to render once per page. `onUnlocked(result)` runs after a
 * CV credit is spent, so the page can reload the now-unmasked candidate.
 */
export function useActions(criteria, { onUnlocked } = {}) {
  const nav = useNavigate()
  const { toast, compare, selected, clearSelection, setCompareIds } = useWorkspace()
  const [why, setWhy] = useState(null)
  const [trust, setTrust] = useState(null)
  const [shortlistIds, setShortlistIds] = useState([])
  const [jobIds, setJobIds] = useState([])
  const [outreach, setOutreach] = useState({ list: [], channel: 'email' })
  const [interview, setInterview] = useState(null)
  const [note, setNote] = useState({ c: null, kind: 'note' })
  const [compareOpen, setCompareOpen] = useState(false)
  const [unlock, setUnlock] = useState(null)
  const [resume, setResume] = useState(null)

  const onAction = useCallback(
    (type, payload) => {
      const c = payload?.candidate ?? payload
      switch (type) {
        case 'open': return nav(`/candidate/${c.id}`)
        case 'why': return setWhy(payload)
        case 'trust': return setTrust(payload)
        case 'shortlist': return setShortlistIds([c.id])
        case 'job': return setJobIds([c.id])
        case 'contact': case 'email': return !IS_DEMO && !c._live?.unlocked ? setUnlock(c) : setOutreach({ list: [c], channel: 'email' })
        case 'message': return setOutreach({ list: [c], channel: 'message' })
        case 'sms': return setOutreach({ list: [c], channel: 'sms' })
        case 'call': case 'unlock': return IS_DEMO ? toast('Demo data has no phone numbers.', { tone: 'warn' }) : setUnlock(c)
        case 'resume': {
          if (IS_DEMO) return toast('Demo data has no resumes.', { tone: 'warn' })
          // Opens the CV when the plan or an earlier unlock allows it; otherwise offers the CV-credit unlock.
          return getResumeLink(c)
            .then((f) => setResume({ ...f, name: c.name }))
            .catch((e) => (e.code === 'LOCKED' ? setUnlock(c) : toast(e.code === 'NO_RESUME' ? `${c.name} has no verified CV yet.` : 'Could not open the CV — try again.', { tone: 'warn' })))
        }
        case 'interview': {
          // Interviews hang off a pipeline row, which a resume-database profile only gets when it's unlocked for a job.
          if (!IS_DEMO && !c._live?.candidateId) {
            toast('Unlock this candidate first — that adds them to one of your jobs.', { tone: 'warn' })
            return setUnlock(c)
          }
          return setInterview(c)
        }
        case 'note': return setNote({ c, kind: 'note' })
        case 'reminder': return setNote({ c, kind: 'reminder' })
        case 'share': {
          const url = `${window.location.origin}/candidate/${c.id}`
          navigator.clipboard?.writeText(url)
          return toast('Profile link copied')
        }
        default:
      }
    },
    [nav, toast]
  )

  const bulk = useCallback(
    async (type) => {
      if (type === 'shortlist') return setShortlistIds(selected)
      if (type === 'job') return setJobIds(selected)
      if (type === 'compare') {
        if (selected.length < 2) return toast('Select at least 2 candidates to compare', { tone: 'warn' })
        setCompareIds(selected)
        return setCompareOpen(true)
      }
      if (type === 'export') {
        const rows = await getTalentMany(selected)
        const esc = (v) => `"${String(v ?? '').replace(/"/g, '""')}"`
        const csv = [['Name', 'Designation', 'Company', 'Experience (yrs)', 'Location', 'Expected LPA', 'Notice (days)', 'Skills'].join(','), ...rows.map((r) => [r.name, r.designation, r.currentCompany, r.experienceYears, r.location, r.expectedSalaryLPA, r.noticePeriodDays, r.skills.join('; ')].map(esc).join(','))].join('\n')
        const a = document.createElement('a')
        a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }))
        a.download = 'mzobs-candidates.csv'
        a.click()
        return toast(`Exported ${rows.length} candidates`)
      }
      const list = await getTalentMany(selected)
      setOutreach({ list, channel: type })
    },
    [selected, toast, setCompareIds]
  )

  const host = (
    <>
      <MatchSheet row={why} onClose={() => setWhy(null)} />
      <TrustSheet row={trust} onClose={() => setTrust(null)} />
      <ShortlistModal ids={shortlistIds} onClose={(ok) => { setShortlistIds([]); if (ok) clearSelection() }} />
      <AddToJobModal ids={jobIds} onClose={() => setJobIds([])} />
      <OutreachModal candidates={outreach.list} channel={outreach.channel} onClose={() => setOutreach({ list: [], channel: 'email' })} />
      <UnlockModal
        candidate={unlock}
        onClose={() => setUnlock(null)}
        onUnlocked={onUnlocked}
        onViewResume={(c, f) => { setUnlock(null); setResume({ ...f, name: c.name }) }}
        onCompose={(c, contact) => { setUnlock(null); setOutreach({ list: [{ ...c, contact, _live: { ...c._live, unlocked: true } }], channel: 'email' }) }}
      />
      <ResumeViewer file={resume} onClose={() => setResume(null)} />
      <InterviewModal candidate={interview} onClose={() => setInterview(null)} />
      <NoteModal candidate={note.c} kind={note.kind} onClose={() => setNote({ c: null, kind: 'note' })} />
      <CompareModal open={compareOpen} onClose={() => setCompareOpen(false)} criteria={criteria} />
      <CompareTray count={compare.length} onOpen={() => setCompareOpen(true)} />
      <SelectionBar onBulk={bulk} />
    </>
  )
  return { onAction, host }
}

function CompareTray({ count, onOpen }) {
  const { clearCompare, selected } = useWorkspace()
  if (count === 0 || selected.length > 0) return null
  return (
    <div className="fade-up fixed bottom-20 right-4 z-40 flex items-center gap-2 rounded-2xl bg-ink px-3 py-2 text-[13px] text-white shadow-pop md:bottom-6">
      <GitCompareArrows size={15} /> {count} to compare
      <Button size="sm" variant="ai" disabled={count < 2} onClick={onOpen}>Compare</Button>
      <button onClick={clearCompare} aria-label="Clear compare" className="text-white/70 hover:text-white"><X size={14} /></button>
    </div>
  )
}

function SelectionBar({ onBulk }) {
  const { selected, clearSelection } = useWorkspace()
  if (!selected.length) return null
  const btn = 'flex h-9 items-center gap-1.5 rounded-lg px-3 text-[13px] font-medium text-white/90 hover:bg-white/10'
  return (
    <div className="slide-up fixed inset-x-0 bottom-0 z-40 flex justify-center px-3 pb-3 md:pb-6">
      <div className="flex max-w-full items-center gap-1 overflow-x-auto rounded-2xl bg-ink p-1.5 pl-4 text-white shadow-pop">
        <span className="mr-2 whitespace-nowrap text-[13px] font-semibold">{selected.length} selected</span>
        <button className={btn} onClick={() => onBulk('shortlist')}><Bookmark size={14} /> Shortlist</button>
        <button className={btn} onClick={() => onBulk('job')}><FolderPlus size={14} /> Add to job</button>
        <button className={btn} onClick={() => onBulk('message')}><MessageSquare size={14} /> Message</button>
        <button className={btn} onClick={() => onBulk('email')}><Mail size={14} /> Email</button>
        <button className={btn} onClick={() => onBulk('compare')}><GitCompareArrows size={14} /> Compare</button>
        <button className={btn} onClick={() => onBulk('export')}><Download size={14} /> Export</button>
        <button onClick={clearSelection} aria-label="Clear selection" className="ml-1 grid h-9 w-9 place-items-center rounded-lg hover:bg-white/10"><X size={15} /></button>
      </div>
    </div>
  )
}
