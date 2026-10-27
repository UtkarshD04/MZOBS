import { useEffect, useMemo, useState } from 'react'
import clsx from 'clsx'
import { Avatar, Modal } from '../ui'
import { ErrorState, ListSkeleton, StagePill } from '../rc'
import { apiMessage, compareApplicants, STAGE_LABEL } from '../../services/recruiterService'

const NA = <span className="text-muted">Not provided</span>
const CRITERIA = [
  ['communication', 'Communication'],
  ['technical', 'Technical / functional'],
  ['roleFit', 'Role fit'],
  ['problemSolving', 'Problem-solving'],
  ['cultureFit', 'Culture / team fit'],
]
const EXP_TEXT = { within: 'Within the required range', below: 'Below the required range', above: 'Above the required range' }

const norm = (v) => JSON.stringify(v ?? null)
const differs = (values) => new Set(values.map(norm)).size > 1

// Side-by-side facts for 2–4 candidates of the same job. Everything shown is stored data; rows where the candidates
// actually differ are marked so the eye goes there. There is no overall score or ranking.
export default function CompareModal({ ids, onClose }) {
  const [data, setData] = useState(null)
  const [error, setError] = useState('')
  useEffect(() => {
    if (!ids) return
    setData(null)
    setError('')
    compareApplicants(ids).then(setData).catch((e) => setError(apiMessage(e, 'Could not load the comparison.')))
  }, [ids])

  const rows = useMemo(() => {
    if (!data) return []
    const it = data.items
    const sharedSkills = it.length ? it[0].skills.filter((s) => it.every((x) => x.skills.some((y) => y.toLowerCase() === s.toLowerCase()))) : []
    const sharedSet = new Set(sharedSkills.map((s) => s.toLowerCase()))
    return [
      {
        label: 'Match vs job requirements',
        diff: differs(it.map((c) => [c.match?.matchedSkills, c.match?.experience, c.match?.location, c.match?.salary])),
        cell: (c) => (
          <ul className="space-y-1 text-[12.5px]">
            {c.match?.requiredSkills ? <li><b>{c.match.matchedSkills.length}/{c.match.requiredSkills}</b> skills{c.match.missingSkills.length > 0 && <span className="text-muted"> · missing {c.match.missingSkills.join(', ')}</span>}</li> : <li className="text-muted">No skills listed on the job</li>}
            {c.match?.experience && <li className={c.match.experience === 'within' ? '' : 'text-warn'}>{EXP_TEXT[c.match.experience]}</li>}
            {c.match?.location != null && <li className={c.match.location ? '' : 'text-warn'}>{c.match.location ? 'Location matches' : 'Different location'}</li>}
            {c.match?.salary && <li className={c.match.salary === 'within' ? '' : 'text-warn'}>{c.match.salary === 'within' ? 'Expectation within budget' : 'Expectation above budget'}</li>}
          </ul>
        ),
      },
      {
        label: 'Skills',
        diff: differs(it.map((c) => [...c.skills].map((s) => s.toLowerCase()).sort())),
        cell: (c) => c.skills.length ? <div className="flex flex-wrap gap-1">{c.skills.map((s) => <span key={s} className={clsx('rounded px-1.5 py-px text-[11.5px]', sharedSet.has(s.toLowerCase()) ? 'bg-[#eceff0] text-ink-2' : 'bg-accent-soft font-semibold text-accent')} title={sharedSet.has(s.toLowerCase()) ? 'Everyone has this' : 'Only some candidates have this'}>{s}</span>)}</div> : NA,
      },
      { label: 'Experience', diff: differs(it.map((c) => c.experienceYears)), cell: (c) => <span className="num font-semibold">{c.experienceYears} yrs</span> },
      {
        label: 'Location',
        diff: differs(it.map((c) => [c.currentLocation, c.preferredLocations])),
        cell: (c) => (
          <div className="text-[12.5px]">
            <p>Current: {c.currentLocation ?? NA}</p>
            <p>Preferred: {c.preferredLocations ? c.preferredLocations.join(', ') : NA}</p>
            {c.workModePreference && <p className="text-muted">Work mode: {c.workModePreference.join(', ')}</p>}
          </div>
        ),
      },
      {
        label: 'Salary expectation',
        diff: differs(it.map((c) => c.salaryExpectation.lpa)),
        cell: (c) => (c.salaryExpectation.lpa != null ? <span className="num font-semibold">₹{c.salaryExpectation.lpa}{c.salaryExpectation.maxLpa ? `–${c.salaryExpectation.maxLpa}` : ''} LPA</span> : c.salaryExpectation.raw ? c.salaryExpectation.raw : NA),
      },
      { label: 'Notice / availability', diff: differs(it.map((c) => c.noticePeriod.days ?? c.noticePeriod.raw)), cell: (c) => c.noticePeriod.raw ? <span>{c.noticePeriod.raw}{c.noticePeriod.days != null && !/\d|immediate/i.test(c.noticePeriod.raw) && <span className="text-muted"> ({c.noticePeriod.days} days)</span>}</span> : NA },
      {
        label: 'Resume highlights',
        diff: false,
        cell: (c) => (
          <div className="space-y-1 text-[12.5px]">
            {c.resume.headline && <p className="font-medium">{c.resume.headline}</p>}
            {c.resume.roles.map((r) => <p key={r} className="text-ink-2">{r}</p>)}
            {c.resume.education.map((e) => <p key={e} className="text-muted">{e}</p>)}
            <p className="text-muted">{c.resume.projects} project{c.resume.projects === 1 ? '' : 's'} · {c.resume.certificates} certificate{c.resume.certificates === 1 ? '' : 's'}{c.resume.resumeVerified ? ' · resume verified' : ''}{c.resume.identityVerified ? ' · ID verified' : ''}</p>
            {!c.resume.headline && c.resume.roles.length === 0 && c.resume.education.length === 0 && NA}
          </div>
        ),
      },
      { label: 'Recruiter notes', diff: false, cell: (c) => c.notes.length ? <ul className="space-y-1.5 text-[12.5px]">{c.notes.map((n, i) => <li key={i}>{n.text}<span className="block text-[11px] text-muted">{n.byName}</span></li>)}</ul> : <span className="text-muted">No notes</span> },
      {
        label: 'Interview scores',
        diff: differs(it.map((c) => c.interview.overall)),
        cell: (c) =>
          c.interview.scorecards === 0 ? (
            <span className="text-muted">No scorecards yet</span>
          ) : (
            <div className="text-[12.5px]">
              <p><b className="num text-[15px]">{c.interview.overall}</b><span className="text-muted"> / 5 average · {c.interview.scorecards} scorecard{c.interview.scorecards === 1 ? '' : 's'}</span></p>
              <ul className="mt-1 space-y-0.5">{CRITERIA.map(([k, label]) => <li key={k} className="flex justify-between gap-3"><span className="text-muted">{label}</span><span className="num font-semibold">{c.interview.ratings[k] ?? '—'}</span></li>)}</ul>
              <p className="mt-1 text-muted">{c.interview.recommendations.join(', ')}</p>
            </div>
          ),
      },
    ]
  }, [data])

  return (
    <Modal open={!!ids} onClose={onClose} title="Compare candidates" subtitle={data?.job ? `${data.job.title} · highlighted rows are where candidates differ` : undefined} width={1100}>
      {error ? <ErrorState message={error} /> : !data ? <ListSkeleton rows={5} /> : (
        <div className="-mx-1 overflow-x-auto">
          <table className="w-full min-w-[640px] table-fixed border-collapse text-left text-[13px]">
            <colgroup><col className="w-[150px]" />{data.items.map((c) => <col key={c.id} />)}</colgroup>
            <thead>
              <tr className="border-b border-line">
                <th />
                {data.items.map((c) => (
                  <th key={c.id} className="px-3 pb-3 align-bottom font-normal">
                    <div className="flex items-center gap-2"><Avatar candidate={c} size={34} /><div className="min-w-0"><p className="truncate text-[14px] font-bold">{c.name}</p><StagePill stage={c.stage} label={STAGE_LABEL[c.stage]} /></div></div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.label} className={clsx('border-b border-line-2 align-top', r.diff && 'bg-[#f4f9f7]')}>
                  <th scope="row" className="px-3 py-3 text-[12px] font-bold uppercase tracking-[0.04em] text-ink-2">
                    {r.label}
                    {r.diff && <span className="mt-1 block text-[10.5px] font-semibold normal-case tracking-normal text-accent">Differs</span>}
                  </th>
                  {data.items.map((c) => <td key={c.id} className="px-3 py-3">{r.cell(c)}</td>)}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Modal>
  )
}
