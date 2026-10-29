import { useEffect, useState } from 'react'
import clsx from 'clsx'
import { Button, Modal } from './ui'
import { Field, textareaCls } from './rc'
import { apiMessage, submitScorecard } from '../services/recruiterService'

export const CRITERIA = [
  ['communication', 'Communication'],
  ['technical', 'Technical / functional skills'],
  ['roleFit', 'Role fit'],
  ['problemSolving', 'Problem-solving'],
  ['cultureFit', 'Culture / team fit'],
]
const RECOMMENDATIONS = ['Strong Yes', 'Yes', 'Maybe', 'No']
const SCALE = ['Poor', 'Fair', 'Good', 'Very good', 'Excellent']

// One interviewer's structured feedback. Resubmitting replaces your own earlier scorecard.
export default function ScorecardModal({ interview, myId, onClose, onSaved, toast }) {
  const [ratings, setRatings] = useState({})
  const [rec, setRec] = useState('')
  const [comments, setComments] = useState('')
  const [errors, setErrors] = useState({})
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    if (!interview) return
    const mine = interview.scorecards.find((s) => s.interviewer === myId)
    setRatings(mine?.ratings ?? {})
    setRec(mine?.recommendation ?? '')
    setComments(mine?.comments ?? '')
    setErrors({})
  }, [interview, myId])

  const submit = async () => {
    const e = {}
    CRITERIA.forEach(([k]) => !ratings[k] && (e[k] = 'Rate from 1 to 5.'))
    if (!rec) e.recommendation = 'Choose an overall recommendation.'
    setErrors(e)
    if (Object.keys(e).length) return
    setBusy(true)
    try {
      await submitScorecard(interview.id, { ratings, recommendation: rec, comments })
      toast('Scorecard submitted')
      onSaved()
      onClose()
    } catch (err) {
      setErrors(err.response?.data?.errors ?? { form: apiMessage(err) })
    } finally {
      setBusy(false)
    }
  }

  return (
    <Modal
      open={!!interview}
      onClose={busy ? () => {} : onClose}
      title="Interview scorecard"
      subtitle={interview ? `${interview.candidateName} · ${[interview.role, interview.round].filter(Boolean).join(' · ')}` : undefined}
      width={600}
      footer={<><Button onClick={onClose} disabled={busy}>Cancel</Button><Button variant="primary" onClick={submit} disabled={busy}>{busy ? 'Saving…' : 'Submit scorecard'}</Button></>}
    >
      <div className="space-y-4">
        <ul className="divide-y divide-line-2 rounded-lg border border-line">
          {CRITERIA.map(([k, label]) => (
            <li key={k} className="flex flex-wrap items-center justify-between gap-2 px-3 py-2.5">
              <span className="text-[13.5px] font-semibold">{label}</span>
              <span className="flex items-center gap-1" role="radiogroup" aria-label={`${label} rating`}>
                {[1, 2, 3, 4, 5].map((n) => (
                  <button key={n} type="button" role="radio" aria-checked={ratings[k] === n} title={SCALE[n - 1]} onClick={() => setRatings((r) => ({ ...r, [k]: n }))} className={clsx('num grid h-8 w-8 place-items-center rounded-lg border text-[13px] font-bold transition-colors', ratings[k] === n ? 'border-accent bg-accent text-white' : 'border-line bg-white text-ink-2 hover:border-accent')}>{n}</button>
                ))}
              </span>
              {errors[k] && <span className="basis-full text-[12px] font-medium text-bad">{errors[k]}</span>}
            </li>
          ))}
        </ul>
        <p className="-mt-2 text-[11.5px] text-muted">1 = Poor · 3 = Good · 5 = Excellent</p>

        <fieldset>
          <legend className="mb-1.5 text-[12px] font-semibold text-ink-2">Overall recommendation</legend>
          <div className="grid grid-cols-4 gap-2">
            {RECOMMENDATIONS.map((r) => (
              <button key={r} type="button" aria-pressed={rec === r} onClick={() => setRec(r)} className={clsx('h-9 rounded-lg border text-[13px] font-bold transition-colors', rec === r ? 'border-accent bg-accent-soft text-accent' : 'border-line hover:bg-[#faf9f6]')}>{r}</button>
            ))}
          </div>
          {errors.recommendation && <p className="mt-1 text-[12px] font-medium text-bad">{errors.recommendation}</p>}
        </fieldset>

        <Field label="Comments (private to your team)" error={errors.comments}>
          <textarea value={comments} onChange={(e) => setComments(e.target.value)} rows={4} maxLength={2000} className={textareaCls} />
        </Field>
        {errors.form && <p role="alert" className="text-[13px] font-medium text-bad">{errors.form}</p>}
      </div>
    </Modal>
  )
}
