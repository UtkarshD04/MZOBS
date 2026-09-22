import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Folder, Plus, Trash2, Users } from 'lucide-react'
import Card, { CardBody, CardHead, CardTitle } from '../ui/Card'
import Button from '../ui/Button'
import Avatar from '../ui/Avatar'
import Modal from '../ui/Modal'
import { Field, Input } from '../ui/Field'
import EmptyState from '../ui/EmptyState'
import { useTalentPools } from '../../lib/talentLens/store'
import { TALENT_POOL } from '../../lib/talentLens/mockCandidates'

const EMOJI_OPTIONS = ['📁', '⭐', '⚡', '🎯', '💼', '🌱', '🚀', '🧠']

export default function TalentPoolsPanel() {
  const navigate = useNavigate()
  const { pools, createPool, removePool, toggleCandidate } = useTalentPools()
  const [createOpen, setCreateOpen] = useState(false)
  const [name, setName] = useState('')
  const [emoji, setEmoji] = useState('📁')

  function submitCreate() {
    if (!name.trim()) return
    createPool(name.trim(), emoji)
    setName('')
    setEmoji('📁')
    setCreateOpen(false)
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <p className="text-[13px] text-ink-secondary max-w-lg">Collections your hiring team can come back to — group candidates by role, urgency or anything else useful.</p>
        <Button variant="primary" size="sm" onClick={() => setCreateOpen(true)}>
          <Plus size={14} /> New pool
        </Button>
      </div>

      {pools.length === 0 ? (
        <Card>
          <EmptyState icon={Folder} title="No talent pools yet" body="Create one to start saving candidates for later." />
        </Card>
      ) : (
        <div className="grid grid-cols-2 gap-4 max-lg:grid-cols-1">
          {pools.map((pool) => (
            <Card key={pool.id}>
              <CardHead>
                <CardTitle>
                  <span className="mr-1.5">{pool.emoji}</span> {pool.name}
                </CardTitle>
                <button onClick={() => removePool(pool.id)} className="text-ink-tertiary hover:text-red" title="Delete pool">
                  <Trash2 size={15} />
                </button>
              </CardHead>
              <CardBody>
                {pool.candidateIds.length === 0 ? (
                  <p className="text-[12.5px] text-ink-tertiary">No candidates saved yet. Add some from search results.</p>
                ) : (
                  <div className="flex flex-col gap-2.5">
                    {pool.candidateIds.map((id) => {
                      const c = TALENT_POOL.find((cand) => cand.id === id)
                      if (!c) return null
                      return (
                        <div key={id} className="flex items-center gap-2.5">
                          <Avatar initials={c.initials} size="sm" />
                          <button onClick={() => navigate(`/talent-lens/candidates/${c.id}`)} className="flex-1 min-w-0 text-left">
                            <div className="text-[13px] font-semibold truncate hover:underline">{c.name}</div>
                            <div className="text-[11.5px] text-ink-tertiary truncate">{c.designation}</div>
                          </button>
                          <button onClick={() => toggleCandidate(pool.id, id)} className="text-ink-tertiary hover:text-red text-[11px] font-semibold">
                            Remove
                          </button>
                        </div>
                      )
                    })}
                  </div>
                )}
                <div className="flex items-center gap-1.5 text-[11.5px] text-ink-tertiary mt-3.5 pt-3.5 border-t border-border">
                  <Users size={13} /> {pool.candidateIds.length} candidate{pool.candidateIds.length === 1 ? '' : 's'}
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      )}

      <Modal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        title="Create a talent pool"
        size="sm"
        footer={
          <>
            <Button variant="secondary" size="sm" onClick={() => setCreateOpen(false)}>Cancel</Button>
            <Button variant="primary" size="sm" onClick={submitCreate}>Create</Button>
          </>
        }
      >
        <Field label="Name">
          <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Backend shortlist" />
        </Field>
        <Field label="Icon" optional>
          <div className="flex flex-wrap gap-2">
            {EMOJI_OPTIONS.map((e) => (
              <button
                key={e}
                onClick={() => setEmoji(e)}
                className={`w-9 h-9 rounded-lg border text-[16px] flex items-center justify-center ${emoji === e ? 'border-navy bg-navy-tint' : 'border-border-strong'}`}
              >
                {e}
              </button>
            ))}
          </div>
        </Field>
      </Modal>
    </div>
  )
}

// Reused by CandidateCard/TalentLensCandidate to save/move a candidate
// without duplicating the pool-picker UI in three places.
export function SaveToPoolMenu({ candidateId, onDone }) {
  const { pools, toggleCandidate } = useTalentPools()
  return (
    <div className="flex flex-col gap-1 min-w-[200px]">
      {pools.map((pool) => {
        const saved = pool.candidateIds.includes(candidateId)
        return (
          <button
            key={pool.id}
            onClick={() => {
              toggleCandidate(pool.id, candidateId)
              onDone?.()
            }}
            className="flex items-center gap-2.5 px-2.5 py-[9px] rounded-lg cursor-pointer hover:bg-surface-hover text-[13px] text-left"
          >
            <span>{pool.emoji}</span>
            <span className="flex-1">{pool.name}</span>
            {saved && <span className="text-[11px] font-semibold text-navy">Saved</span>}
          </button>
        )
      })}
    </div>
  )
}
