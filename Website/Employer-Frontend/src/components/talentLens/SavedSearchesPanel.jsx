import { useState } from 'react'
import { Bookmark, Play, Save, Trash2 } from 'lucide-react'
import Card, { CardBody } from '../ui/Card'
import Button from '../ui/Button'
import Modal from '../ui/Modal'
import { Field, Input } from '../ui/Field'
import EmptyState from '../ui/EmptyState'
import { criteriaToChips } from '../../lib/talentLens/parseQuery'
import { useSavedSearches } from '../../lib/talentLens/store'

export default function SavedSearchesPanel({ onRun }) {
  const { searches, remove } = useSavedSearches()

  if (searches.length === 0) {
    return (
      <Card>
        <EmptyState icon={Bookmark} title="No saved searches yet" body="Save a search from Find candidates to quickly run it again later, or turn it into a Talent Radar alert." />
      </Card>
    )
  }

  return (
    <div className="flex flex-col gap-3">
      {searches.map((s) => (
        <Card key={s.id}>
          <CardBody className="flex items-center gap-4 flex-wrap">
            <div className="flex-1 min-w-[220px]">
              <div className="text-[14px] font-semibold">{s.name}</div>
              <div className="flex flex-wrap gap-1.5 mt-2">
                {criteriaToChips(s.criteria).map((chip) => (
                  <span key={chip.key} className="text-[11px] font-medium px-2 py-[3px] rounded-full bg-surface-sunken text-ink-secondary">
                    {chip.label}
                  </span>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="secondary" size="sm" onClick={() => onRun(s.criteria)}>
                <Play size={13} /> Run search
              </Button>
              <Button variant="ghost" size="sm" iconOnly title="Delete" onClick={() => remove(s.id)}>
                <Trash2 size={14} />
              </Button>
            </div>
          </CardBody>
        </Card>
      ))}
    </div>
  )
}

export function SaveSearchModal({ open, onClose, criteria, onSaved }) {
  const { save } = useSavedSearches()
  const [name, setName] = useState('')

  function submit() {
    if (!name.trim()) return
    save(name.trim(), criteria)
    setName('')
    onClose()
    onSaved?.()
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Save this search"
      subtitle="Come back to it later, or turn it into a Talent Radar alert."
      size="sm"
      footer={
        <>
          <Button variant="secondary" size="sm" onClick={onClose}>Cancel</Button>
          <Button variant="primary" size="sm" onClick={submit}>
            <Save size={14} /> Save search
          </Button>
        </>
      }
    >
      <Field label="Name">
        <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Senior React Developers — Bengaluru" autoFocus />
      </Field>
    </Modal>
  )
}
