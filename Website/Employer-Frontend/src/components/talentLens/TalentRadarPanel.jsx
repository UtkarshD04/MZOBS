import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Radar, Sparkles, Trash2, X } from 'lucide-react'
import Card, { CardBody } from '../ui/Card'
import Button from '../ui/Button'
import Avatar from '../ui/Avatar'
import Modal from '../ui/Modal'
import { Field, Input } from '../ui/Field'
import EmptyState from '../ui/EmptyState'
import { criteriaToChips } from '../../lib/talentLens/parseQuery'
import { useTalentRadar } from '../../lib/talentLens/store'
import { TALENT_POOL } from '../../lib/talentLens/mockCandidates'
import { MatchLevelBadge } from './shared'
import { fmtDate } from '../../lib/utils'

// "Keep an eye on the talent you may need next" — a saved requirement that
// keeps matching against the pool in the background. There's no real
// background job wired up yet (no server-side cron), so new matches are
// computed once, at watch-creation time, against the current mock pool —
// clearly a preview of the mechanic, not a live feed.
export default function TalentRadarPanel({ onCreateFromCriteria }) {
  const navigate = useNavigate()
  const { watches, remove, dismissNotification } = useTalentRadar()
  const [createOpen, setCreateOpen] = useState(false)

  return (
    <div>
      <div className="flex items-start justify-between gap-4 mb-4 flex-wrap">
        <p className="text-[13px] text-ink-secondary max-w-lg">Save a requirement and Mzobs will flag new candidates that match it as they appear.</p>
        <Button variant="primary" size="sm" onClick={() => setCreateOpen(true)}>
          <Radar size={14} /> Watch a requirement
        </Button>
      </div>

      {watches.length === 0 ? (
        <Card>
          <EmptyState icon={Radar} title="No requirements watched yet" body="Save one to hear about matching candidates as soon as they're available." />
        </Card>
      ) : (
        <div className="flex flex-col gap-4">
          {watches.map((watch) => (
            <Card key={watch.id}>
              <CardBody>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-navy">
                      <Sparkles size={12} /> Talent Radar
                    </div>
                    <div className="text-[14.5px] font-semibold mt-1">{watch.title}</div>
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {criteriaToChips(watch.criteria).map((chip) => (
                        <span key={chip.key} className="text-[11px] font-medium px-2 py-[3px] rounded-full bg-surface-sunken text-ink-secondary">
                          {chip.label}
                        </span>
                      ))}
                    </div>
                  </div>
                  <button onClick={() => remove(watch.id)} className="text-ink-tertiary hover:text-red flex-shrink-0" title="Stop watching">
                    <Trash2 size={15} />
                  </button>
                </div>

                {watch.notifications.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-border flex flex-col gap-2.5">
                    {watch.notifications.map((n) => {
                      const c = TALENT_POOL.find((cand) => cand.id === n.candidateId)
                      if (!c) return null
                      return (
                        <div key={n.candidateId} className="flex items-center gap-3 bg-navy-tint/40 rounded-xl p-3">
                          <Avatar initials={c.initials} size="sm" />
                          <div className="flex-1 min-w-0">
                            <div className="text-[13px] font-semibold">A new candidate matches your saved requirement.</div>
                            <div className="flex items-center gap-2.5 mt-1">
                              <MatchLevelBadge value={n.overallMatch} />
                              <span className="text-[11.5px] text-ink-tertiary">
                                {n.overallMatch}% match · {n.availabilityDays === 0 ? 'Available immediately' : `Available in ${n.availabilityDays} days`}
                              </span>
                            </div>
                          </div>
                          <Button variant="secondary" size="sm" onClick={() => navigate(`/talent-lens/candidates/${c.id}`)}>
                            View candidate
                          </Button>
                          <button onClick={() => dismissNotification(watch.id, n.candidateId)} className="text-ink-tertiary hover:text-ink" title="Dismiss">
                            <X size={15} />
                          </button>
                        </div>
                      )
                    })}
                  </div>
                )}
                <div className="text-[11px] text-ink-tertiary mt-3">Watching since {fmtDate(watch.createdAt)}</div>
              </CardBody>
            </Card>
          ))}
        </div>
      )}

      <CreateWatchModal open={createOpen} onClose={() => setCreateOpen(false)} onCreate={onCreateFromCriteria} />
    </div>
  )
}

function CreateWatchModal({ open, onClose, onCreate }) {
  const [title, setTitle] = useState('')
  const [designation, setDesignation] = useState('')
  const [expMin, setExpMin] = useState('')
  const [expMax, setExpMax] = useState('')
  const [location, setLocation] = useState('')
  const [salaryMax, setSalaryMax] = useState('')

  function submit() {
    if (!title.trim()) return
    onCreate(title.trim(), {
      designation: designation || undefined,
      experienceMin: expMin ? Number(expMin) : undefined,
      experienceMax: expMax ? Number(expMax) : undefined,
      location: location || undefined,
      salaryMaxLPA: salaryMax ? Number(salaryMax) : undefined,
    })
    setTitle('')
    setDesignation('')
    setExpMin('')
    setExpMax('')
    setLocation('')
    setSalaryMax('')
    onClose()
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Watch a requirement"
      subtitle="Mzobs checks the talent pool for new profiles that match this."
      size="sm"
      footer={
        <>
          <Button variant="secondary" size="sm" onClick={onClose}>Cancel</Button>
          <Button variant="primary" size="sm" onClick={submit}>
            <Radar size={14} /> Start watching
          </Button>
        </>
      }
    >
      <Field label="Name this watch">
        <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Senior React Developer — Bengaluru" />
      </Field>
      <Field label="Designation" optional>
        <Input value={designation} onChange={(e) => setDesignation(e.target.value)} placeholder="e.g. Senior React Developer" />
      </Field>
      <div className="grid grid-cols-2 gap-x-3">
        <Field label="Min experience (yrs)" optional>
          <Input type="number" min="0" value={expMin} onChange={(e) => setExpMin(e.target.value)} />
        </Field>
        <Field label="Max experience (yrs)" optional>
          <Input type="number" min="0" value={expMax} onChange={(e) => setExpMax(e.target.value)} />
        </Field>
      </div>
      <div className="grid grid-cols-2 gap-x-3">
        <Field label="Location" optional>
          <Input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="e.g. Bengaluru" />
        </Field>
        <Field label="Salary up to (LPA)" optional>
          <Input type="number" min="0" value={salaryMax} onChange={(e) => setSalaryMax(e.target.value)} />
        </Field>
      </div>
    </Modal>
  )
}
