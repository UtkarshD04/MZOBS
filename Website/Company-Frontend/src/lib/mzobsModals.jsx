import { useMemo, useState } from 'react'
import { ShieldCheck, MapPin, FileText, Download, Send, IndianRupee, AlertTriangle, Building2, Video } from 'lucide-react'
import { DrawerHead, DrawerBody, DrawerFoot } from '../components/ui/Drawer'
import { ModalHead, ModalBody, ModalFoot } from '../components/ui/Modal'
import Button from '../components/ui/Button'
import Badge from '../components/ui/Badge'
import Ring from '../components/ui/Ring'
import Bar from '../components/ui/Bar'
import Chip from '../components/ui/Chip'
import { Field, Input, Select, Textarea } from '../components/ui/Field'
import { Tabs } from '../components/ui/Tabs'
import EmptyState from '../components/ui/EmptyState'
import Avatar from '../components/ui/Avatar'
import {
  APPLICATIONS,
  APPLICATION_STATUS,
  CANDIDATES,
  MOCK_STATUS,
  OPS_TEAM,
  PRICING,
  RESUME_STATUS,
  SKILL_TRACKS,
  candidateOf,
  companyOf,
  jobOf,
  trackOf,
} from './mzobsData'
import { fmtINR } from './utils'

const PANEL = OPS_TEAM.filter((m) => m.role === 'Interview Panel')

/* ------------------------------------------------------------------ */
/* Candidate                                                            */
/* ------------------------------------------------------------------ */

const CANDIDATE_TABS = ['Overview', 'Resume', 'Mock interview', 'Applications']

export function openCandidateDrawer(app, candidate) {
  app.openSidePanel(<CandidateDrawer app={app} candidate={candidate} />, 640)
}

function CandidateDrawer({ app, candidate: c }) {
  const [tab, setTab] = useState(0)
  const apps = useMemo(() => APPLICATIONS.filter((a) => a.candidateId === c.id), [c.id])
  const track = trackOf(c.track)
  const resume = RESUME_STATUS[c.resume.status]
  const mock = MOCK_STATUS[c.mock.status]

  return (
    <>
      <DrawerHead title={c.name} subtitle={`${c.id} · ${c.city} · ${c.exp} yrs experience`} onClose={app.closeSidePanel} />

      <div className="px-[26px] pt-4 flex items-center gap-5 border-b border-border pb-4 flex-shrink-0">
        <Avatar initials={c.initials} size="lg" />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <Badge tone={c.subscription.status === 'paid' ? 'green' : 'red'}>
              {c.subscription.status === 'paid' ? `₹${PRICING.candidateFee} paid` : 'Not subscribed'}
            </Badge>
            <Badge tone={resume.tone}>{resume.label}</Badge>
            <Badge tone={mock.tone}>Mock: {mock.label}</Badge>
            {c.track && (
              <Badge tone={track.tone} dot={false}>
                {track.label} · Grade {c.grade}
              </Badge>
            )}
          </div>
          <div className="text-xs text-ink-tertiary mt-2 flex items-center gap-1">
            <MapPin size={11} /> {c.email} · {c.phone}
          </div>
        </div>
      </div>

      <DrawerBody className="pt-4">
        <Tabs items={CANDIDATE_TABS} active={tab} onChange={setTab} className="mb-5" />

        {tab === 0 && (
          <div className="flex flex-col gap-5">
            <div className="grid grid-cols-2 gap-3">
              {[
                ['Registered on', c.registeredOn],
                ['Subscription', c.subscription.status === 'paid' ? `Paid ${c.subscription.paidOn}` : 'Pending'],
                ['Expected CTC', c.expectedCtc],
                ['Applications', `${apps.length} live`],
              ].map(([l, v]) => (
                <div key={l} className="bg-surface-sunken rounded-xl p-3.5">
                  <div className="text-xs text-ink-tertiary">{l}</div>
                  <div className="text-[13.5px] font-semibold mt-1">{v}</div>
                </div>
              ))}
            </div>
            <div>
              <div className="text-xs font-semibold tracking-wide uppercase text-ink-tertiary mb-2">Skills declared</div>
              {c.skills.length ? (
                <div className="flex flex-wrap gap-1.5">
                  {c.skills.map((s) => (
                    <span key={s} className="text-[11px] font-semibold text-ink-secondary bg-surface-sunken px-2 py-1 rounded-md">
                      {s}
                    </span>
                  ))}
                </div>
              ) : (
                <div className="text-[13px] text-ink-tertiary">No skills captured yet — candidate hasn't completed onboarding.</div>
              )}
            </div>
          </div>
        )}

        {tab === 1 &&
          (c.resume.file ? (
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3.5 p-3.5 bg-surface-sunken rounded-xl">
                <FileText size={28} className="text-navy flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="text-[13.5px] font-semibold truncate">{c.resume.file}</div>
                  <div className="text-xs text-ink-tertiary mt-0.5">
                    Version {c.resume.version} · Uploaded {c.resume.uploadedOn}
                  </div>
                </div>
                <Button size="sm" onClick={() => app.addToast('success', 'Resume downloaded')}>
                  <Download size={14} /> Open
                </Button>
              </div>
              {c.resume.score !== null && (
                <div className="flex items-center gap-4 p-3.5 border border-border rounded-xl">
                  <Ring value={c.resume.score} size={56} thick={6} hero={c.resume.score >= 85} />
                  <div>
                    <div className="text-[13.5px] font-semibold">Verification score</div>
                    <div className="text-xs text-ink-tertiary mt-0.5">Reviewed by {c.resume.reviewer}</div>
                  </div>
                </div>
              )}
              {c.resume.note && (
                <div>
                  <div className="text-xs font-semibold tracking-wide uppercase text-ink-tertiary mb-1.5">Reviewer note</div>
                  <p className="text-[13px] text-ink-secondary">{c.resume.note}</p>
                </div>
              )}
              <Button variant="primary" onClick={() => openVerifyResumeModal(app, c)}>
                <ShieldCheck size={15} /> {c.resume.status === 'verified' ? 'Re-verify resume' : 'Verify resume'}
              </Button>
            </div>
          ) : (
            <EmptyState icon={FileText} title="No resume uploaded" body={`${c.name} hasn't uploaded a resume yet. Verification starts once they do.`} />
          ))}

        {tab === 2 &&
          (c.mock.status === 'completed' ? (
            <div className="flex flex-col gap-3.5">
              <div className="flex items-center justify-between">
                <span className="text-[13px] font-semibold">Overall panel score</span>
                <span className="text-[15px] font-bold text-navy">{c.mock.overall}/100</span>
              </div>
              {[
                ['Communication', c.mock.comm],
                ['Domain knowledge', c.mock.domain],
                ['Attitude & ownership', c.mock.attitude],
              ].map(([l, v]) => (
                <div key={l}>
                  <div className="flex justify-between text-[12.5px] mb-1">
                    <span className="text-ink-secondary">{l}</span>
                    <span className="font-semibold">{v}%</span>
                  </div>
                  <Bar value={v} thin />
                </div>
              ))}
              <div className="text-xs text-ink-tertiary mt-1">
                {c.mock.when} · Panel: {c.mock.panel}
              </div>
              <Button className="mt-2" onClick={() => openAssignTrackModal(app, c)}>
                {c.track ? 'Change skill track' : 'Assign skill track'}
              </Button>
            </div>
          ) : c.mock.status === 'scheduled' ? (
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-3 p-3.5 border border-border rounded-xl">
                <div className="w-[42px] h-[42px] rounded-xl bg-gold-tint text-gold-strong flex items-center justify-center flex-shrink-0">
                  <Video size={19} />
                </div>
                <div>
                  <div className="text-[13.5px] font-semibold">{c.mock.when}</div>
                  <div className="text-xs text-ink-tertiary mt-0.5">Panel: {c.mock.panel}</div>
                </div>
              </div>
              <Button onClick={() => openScheduleMockModal(app, c)}>Reschedule</Button>
            </div>
          ) : (
            <EmptyState
              icon={Video}
              title="Mock interview not scheduled"
              body="Schedule the verification round once the resume clears review."
              action={
                <Button variant="primary" className="mt-2" onClick={() => openScheduleMockModal(app, c)}>
                  Schedule mock interview
                </Button>
              }
            />
          ))}

        {tab === 3 &&
          (apps.length ? (
            <div className="flex flex-col gap-2.5">
              {apps.map((a) => {
                const job = jobOf(a.jobId)
                const co = companyOf(job.companyId)
                const st = APPLICATION_STATUS[a.status]
                return (
                  <div key={a.id} className="flex items-center gap-3 p-3 border border-border rounded-xl">
                    <div className="w-9 h-9 rounded-[10px] bg-navy-tint text-navy flex items-center justify-center text-[11px] font-bold flex-shrink-0">{co.logo}</div>
                    <div className="flex-1 min-w-0">
                      <div className="text-[13px] font-semibold truncate">{job.title}</div>
                      <div className="text-xs text-ink-tertiary">
                        {co.name} · Applied {a.appliedOn}
                      </div>
                    </div>
                    <Badge tone={st.tone}>{st.label}</Badge>
                  </div>
                )
              })}
              <p className="text-xs text-ink-tertiary mt-1">
                These applications sit with Mzobs only. Employers see a candidate for the first time when we ship them a dispatch batch.
              </p>
            </div>
          ) : (
            <EmptyState icon={FileText} title="No applications yet" body="This candidate hasn't applied to any live requirement." />
          ))}
      </DrawerBody>

      <DrawerFoot>
        <Button onClick={() => openScheduleMockModal(app, c)}>Schedule mock</Button>
        <Button variant="primary" onClick={() => openVerifyResumeModal(app, c)}>
          <ShieldCheck size={15} /> Verify resume
        </Button>
      </DrawerFoot>
    </>
  )
}

export function openVerifyResumeModal(app, candidate) {
  app.openModal(<VerifyResumeForm app={app} candidate={candidate} />)
}

function VerifyResumeForm({ app, candidate: c }) {
  const [decision, setDecision] = useState('verified')
  const [score, setScore] = useState(c.resume.score ?? 80)

  const labels = {
    verified: 'Mark verified',
    changes: 'Request changes',
    rejected: 'Reject resume',
  }

  return (
    <>
      <ModalHead title={`Verify resume — ${c.name}`} onClose={app.closeModal} />
      <ModalBody>
        <div className="flex items-center gap-3.5 p-3.5 bg-surface-sunken rounded-xl mb-4">
          <FileText size={26} className="text-navy flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <div className="text-[13.5px] font-semibold truncate">{c.resume.file || 'No file uploaded'}</div>
            <div className="text-xs text-ink-tertiary mt-0.5">
              {c.resume.uploadedOn ? `Uploaded ${c.resume.uploadedOn}` : 'Candidate has not uploaded a resume'}
            </div>
          </div>
        </div>

        <Field label="Decision">
          <div className="flex flex-wrap gap-2">
            {Object.keys(labels).map((k) => (
              <Chip key={k} selected={decision === k} onClick={() => setDecision(k)}>
                {labels[k]}
              </Chip>
            ))}
          </div>
        </Field>

        {decision === 'verified' && (
          <Field label="Verification score" hint="Drives the candidate's resume score and their ranking inside dispatch batches.">
            <Input type="number" min={0} max={100} value={score} onChange={(e) => setScore(Number(e.target.value))} />
          </Field>
        )}

        <Field label="Note to candidate" hint="Shown in the candidate's Resume Center.">
          <Textarea placeholder={decision === 'verified' ? 'What made this resume pass?' : 'Tell them exactly what to fix before re-uploading.'} />
        </Field>

        {decision === 'verified' && (
          <div className="flex items-start gap-2.5 rounded-xl border border-border bg-surface-sunken px-3.5 py-3">
            <ShieldCheck size={15} className="text-green mt-0.5 flex-shrink-0" />
            <p className="text-[12.5px] text-ink-secondary">
              Verifying unlocks the mock interview step for {c.name.split(' ')[0]} and makes them eligible for dispatch batches.
            </p>
          </div>
        )}
      </ModalBody>
      <ModalFoot>
        <Button onClick={app.closeModal}>Cancel</Button>
        <Button
          variant={decision === 'rejected' ? 'danger' : 'primary'}
          onClick={() => {
            app.closeModal()
            app.closeSidePanel()
            const msg = {
              verified: `${c.name}'s resume marked verified`,
              changes: `Change request sent to ${c.name}`,
              rejected: `${c.name}'s resume rejected`,
            }[decision]
            app.addToast(decision === 'rejected' ? 'error' : 'success', msg)
          }}
        >
          {labels[decision]}
        </Button>
      </ModalFoot>
    </>
  )
}

export function openScheduleMockModal(app, candidate) {
  app.openModal(<ScheduleMockForm app={app} candidate={candidate} />)
}

function ScheduleMockForm({ app, candidate: c }) {
  const [panel, setPanel] = useState(PANEL[0]?.initials)

  return (
    <>
      <ModalHead title={`Schedule mock interview — ${c.name}`} onClose={app.closeModal} />
      <ModalBody>
        <div className="flex gap-3 items-center mb-4">
          <Avatar initials={c.initials} />
          <div>
            <div className="text-[15px] font-semibold">{c.name}</div>
            <div className="text-xs text-ink-tertiary">
              {c.city} · {c.exp} yrs · Resume {RESUME_STATUS[c.resume.status].label.toLowerCase()}
            </div>
          </div>
        </div>

        {c.resume.status !== 'verified' && (
          <div className="flex items-start gap-2.5 rounded-xl border border-gold-dot/30 bg-gold-tint px-3.5 py-3 mb-4">
            <AlertTriangle size={15} className="text-gold-strong mt-0.5 flex-shrink-0" />
            <p className="text-[12.5px] text-ink-secondary">
              This resume isn't verified yet. You can still book the slot, but verify it before the call so the panel has a clean profile.
            </p>
          </div>
        )}

        <Field label="Round">
          <Select defaultValue="Verification round (standard)">
            <option>Verification round (standard)</option>
            <option>Technical depth round</option>
            <option>Communication-only round</option>
            <option>Re-attempt</option>
          </Select>
        </Field>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Date">
            <Input type="date" />
          </Field>
          <Field label="Time">
            <Input type="time" defaultValue="11:00" />
          </Field>
        </div>
        <Field label="Panel member">
          <div className="flex flex-wrap gap-2">
            {PANEL.map((m) => (
              <Chip key={m.initials} selected={panel === m.initials} onClick={() => setPanel(m.initials)}>
                {m.name}
              </Chip>
            ))}
          </div>
        </Field>
        <Field label="Note for the panel" optional>
          <Textarea placeholder="Anything the panel should probe — gaps in the resume, unclear role titles…" />
        </Field>
      </ModalBody>
      <ModalFoot>
        <Button onClick={app.closeModal}>Cancel</Button>
        <Button
          variant="primary"
          onClick={() => {
            app.closeModal()
            app.addToast('success', `Mock interview scheduled with ${c.name}`)
          }}
        >
          Schedule & notify candidate
        </Button>
      </ModalFoot>
    </>
  )
}

export function openAssignTrackModal(app, candidate) {
  app.openModal(<AssignTrackForm app={app} candidate={candidate} />)
}

function AssignTrackForm({ app, candidate: c }) {
  const [track, setTrack] = useState(c.track || 'analytics')
  const [grade, setGrade] = useState(c.grade || 'B')

  return (
    <>
      <ModalHead title={`Assign skill track — ${c.name}`} onClose={app.closeModal} />
      <ModalBody>
        <p className="text-[13px] text-ink-secondary mb-4">
          The track decides which employer requirements this candidate is matched against. Grade decides their rank inside a dispatch batch.
        </p>

        {c.mock.status === 'completed' && (
          <div className="grid grid-cols-3 gap-3 mb-4">
            {[
              ['Communication', c.mock.comm],
              ['Domain', c.mock.domain],
              ['Attitude', c.mock.attitude],
            ].map(([l, v]) => (
              <div key={l} className="bg-surface-sunken rounded-xl p-3">
                <div className="text-xs text-ink-tertiary">{l}</div>
                <div className="text-[15px] font-bold mt-0.5">{v}</div>
              </div>
            ))}
          </div>
        )}

        <Field label="Skill track">
          <div className="flex flex-wrap gap-2">
            {Object.entries(SKILL_TRACKS).map(([k, t]) => (
              <Chip key={k} selected={track === k} onClick={() => setTrack(k)}>
                {t.label}
              </Chip>
            ))}
          </div>
        </Field>
        <Field label="Grade" hint="A = ships first in every batch. C = held back for training.">
          <div className="flex gap-2">
            {['A', 'B', 'C'].map((g) => (
              <Chip key={g} selected={grade === g} onClick={() => setGrade(g)}>
                Grade {g}
              </Chip>
            ))}
          </div>
        </Field>
      </ModalBody>
      <ModalFoot>
        <Button onClick={app.closeModal}>Cancel</Button>
        <Button
          variant="primary"
          onClick={() => {
            app.closeModal()
            app.closeSidePanel()
            app.addToast('success', `${c.name} assigned to ${SKILL_TRACKS[track].label} · Grade ${grade}`)
          }}
        >
          Save assignment
        </Button>
      </ModalFoot>
    </>
  )
}

/* ------------------------------------------------------------------ */
/* Employer company                                                     */
/* ------------------------------------------------------------------ */

export function openCompanyDrawer(app, company) {
  app.openSidePanel(<CompanyDrawer app={app} company={company} />, 600)
}

function CompanyDrawer({ app, company: co }) {
  return (
    <>
      <DrawerHead title={co.name} subtitle={`${co.id} · ${co.industry} · ${co.size} employees`} onClose={app.closeSidePanel} />
      <DrawerBody>
        <div className="text-xs font-semibold tracking-wide uppercase text-ink-tertiary mb-3">KYC details</div>
        <div className="grid grid-cols-2 gap-3 mb-5">
          {[
            ['GSTIN', co.gst],
            ['PAN', co.pan],
            ['Headquarters', co.hq],
            ['Website', co.website],
            ['Registered on', co.registeredOn],
            ['Verified on', co.verifiedOn || '—'],
          ].map(([l, v]) => (
            <div key={l} className="bg-surface-sunken rounded-xl p-3.5">
              <div className="text-xs text-ink-tertiary">{l}</div>
              <div className="text-[13px] font-semibold mt-1 break-words">{v}</div>
            </div>
          ))}
        </div>

        <div className="text-xs font-semibold tracking-wide uppercase text-ink-tertiary mb-3">Hiring contact</div>
        <div className="flex items-center gap-3 p-3.5 border border-border rounded-xl mb-5">
          <Avatar initials={co.contact.name.split(' ').map((p) => p[0]).join('')} />
          <div className="min-w-0">
            <div className="text-[13.5px] font-semibold">{co.contact.name}</div>
            <div className="text-xs text-ink-tertiary truncate">
              {co.contact.role} · {co.contact.email}
            </div>
            <div className="text-xs text-ink-tertiary">{co.contact.phone}</div>
          </div>
        </div>

        <div className="text-xs font-semibold tracking-wide uppercase text-ink-tertiary mb-3">Commercials</div>
        <div className="grid grid-cols-2 gap-3 mb-5">
          <div className="bg-surface-sunken rounded-xl p-3.5">
            <div className="text-xs text-ink-tertiary">Openings raised</div>
            <div className="text-[17px] font-bold mt-0.5">{co.openings}</div>
          </div>
          <div className="bg-surface-sunken rounded-xl p-3.5">
            <div className="text-xs text-ink-tertiary">Billed to date</div>
            <div className="text-[17px] font-bold mt-0.5">{fmtINR(co.paid)}</div>
          </div>
        </div>

        {co.note && (
          <>
            <div className="text-xs font-semibold tracking-wide uppercase text-ink-tertiary mb-2">Internal note</div>
            <p className="text-[13px] text-ink-secondary">{co.note}</p>
          </>
        )}
      </DrawerBody>
      <DrawerFoot>
        {co.status === 'pending' ? (
          <>
            <Button variant="danger" onClick={() => openVerifyCompanyModal(app, co, 'reject')}>
              Reject
            </Button>
            <Button variant="primary" onClick={() => openVerifyCompanyModal(app, co, 'verify')}>
              <ShieldCheck size={15} /> Verify company
            </Button>
          </>
        ) : (
          <Button onClick={() => app.addToast('success', `Note saved for ${co.name}`)}>Add internal note</Button>
        )}
      </DrawerFoot>
    </>
  )
}

export function openVerifyCompanyModal(app, company, mode = 'verify') {
  const verify = mode === 'verify'
  app.openModal(
    <>
      <ModalHead title={verify ? `Verify ${company.name}?` : `Reject ${company.name}?`} onClose={app.closeModal} />
      <ModalBody>
        <div className="flex items-start gap-3 mb-4">
          <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${verify ? 'bg-green-tint text-green' : 'bg-red-tint text-red'}`}>
            {verify ? <ShieldCheck size={20} /> : <AlertTriangle size={20} />}
          </div>
          <p className="text-[13px] text-ink-secondary">
            {verify
              ? `Verification unlocks the employer portal for ${company.name} — they can post requirements, which land in our review queue before going live to candidates.`
              : `${company.name} will be told their registration could not be verified. They keep account access but cannot post requirements.`}
          </p>
        </div>
        <Field label={verify ? 'Verification method' : 'Rejection reason'}>
          <Select defaultValue={verify ? 'GSTIN + PAN cross-check' : 'Third-party staffing reseller'}>
            {verify ? (
              <>
                <option>GSTIN + PAN cross-check</option>
                <option>MCA company master data</option>
                <option>Video call with authorised signatory</option>
                <option>Site visit</option>
              </>
            ) : (
              <>
                <option>Third-party staffing reseller</option>
                <option>Documents could not be verified</option>
                <option>Business not traceable</option>
                <option>Duplicate registration</option>
                <option>Other</option>
              </>
            )}
          </Select>
        </Field>
        <Field label="Internal note" optional>
          <Textarea placeholder="Visible to the Mzobs team only" />
        </Field>
      </ModalBody>
      <ModalFoot>
        <Button onClick={app.closeModal}>Cancel</Button>
        <Button
          variant={verify ? 'primary' : 'danger'}
          onClick={() => {
            app.closeModal()
            app.closeSidePanel()
            app.addToast(verify ? 'success' : 'error', verify ? `${company.name} verified` : `${company.name} rejected`)
          }}
        >
          {verify ? 'Verify company' : 'Reject registration'}
        </Button>
      </ModalFoot>
    </>
  )
}

/* ------------------------------------------------------------------ */
/* Requirements & dispatch                                              */
/* ------------------------------------------------------------------ */

export function openReviewJobModal(app, job) {
  app.openModal(<ReviewJobForm app={app} job={job} />)
}

function ReviewJobForm({ app, job }) {
  const co = companyOf(job.companyId)
  const [openings, setOpenings] = useState(job.openings)
  const fee = openings * PRICING.perOpeningFee
  const resumes = openings * PRICING.resumesPerOpening

  return (
    <>
      <ModalHead title="Review requirement" onClose={app.closeModal} />
      <ModalBody>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-11 h-11 rounded-xl bg-navy-tint text-navy flex items-center justify-center text-sm font-bold flex-shrink-0">{co.logo}</div>
          <div className="min-w-0">
            <div className="text-[15px] font-semibold truncate">{job.title}</div>
            <div className="text-xs text-ink-tertiary">
              {co.name} · {job.location} · {job.mode} · {job.salary}
            </div>
          </div>
        </div>

        <Field label="Openings confirmed with the employer">
          <Input type="number" min={1} value={openings} onChange={(e) => setOpenings(Math.max(1, Number(e.target.value) || 1))} />
        </Field>

        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="rounded-xl border border-border bg-surface-sunken p-3.5">
            <div className="text-xs text-ink-tertiary">Invoice to raise</div>
            <div className="text-[19px] font-bold tracking-tight mt-1">{fmtINR(fee)}</div>
            <div className="text-[11px] text-ink-tertiary mt-1">
              {openings} × {fmtINR(PRICING.perOpeningFee)}
            </div>
          </div>
          <div className="rounded-xl border border-border bg-surface-sunken p-3.5">
            <div className="text-xs text-ink-tertiary">Resumes we owe</div>
            <div className="text-[19px] font-bold tracking-tight mt-1">{resumes}</div>
            <div className="text-[11px] text-ink-tertiary mt-1">
              {PRICING.resumesPerOpening} shortlisted profiles per opening
            </div>
          </div>
        </div>

        <Field label="Publish to candidate portal">
          <Select defaultValue="Yes — show full company details">
            <option>Yes — show full company details</option>
            <option>Yes — hide salary band</option>
            <option>No — source silently from our pool</option>
          </Select>
        </Field>

        <div className="flex items-start gap-2.5 rounded-xl border border-border bg-surface-sunken px-3.5 py-3">
          <FileText size={15} className="text-navy mt-0.5 flex-shrink-0" />
          <p className="text-[12.5px] text-ink-secondary">
            Applications from this posting stay inside Mzobs. {co.name} sees candidates only when we dispatch the batch.
          </p>
        </div>
      </ModalBody>
      <ModalFoot>
        <Button variant="danger" onClick={() => { app.closeModal(); app.addToast('error', 'Requirement sent back to the employer') }}>
          Send back
        </Button>
        <Button
          variant="primary"
          onClick={() => {
            app.closeModal()
            app.addToast('success', `Approved — invoice of ${fmtINR(fee)} raised to ${co.name}`)
          }}
        >
          Approve & raise invoice
        </Button>
      </ModalFoot>
    </>
  )
}

export function openRecordPaymentModal(app, job) {
  const co = companyOf(job.companyId)
  app.openModal(
    <>
      <ModalHead title="Record payment" onClose={app.closeModal} />
      <ModalBody>
        <div className="flex items-center gap-3.5 p-3.5 bg-surface-sunken rounded-xl mb-4">
          <div className="w-10 h-10 rounded-xl bg-gold-tint text-gold-strong flex items-center justify-center flex-shrink-0">
            <IndianRupee size={18} />
          </div>
          <div>
            <div className="text-[15px] font-bold tracking-tight">{fmtINR(job.fee)}</div>
            <div className="text-xs text-ink-tertiary">
              {co.name} · {job.openings} openings × {fmtINR(PRICING.perOpeningFee)}
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Payment date">
            <Input type="date" />
          </Field>
          <Field label="Mode">
            <Select defaultValue="NEFT / RTGS">
              <option>NEFT / RTGS</option>
              <option>UPI</option>
              <option>Cheque</option>
              <option>Razorpay link</option>
            </Select>
          </Field>
        </div>
        <Field label="Reference number">
          <Input placeholder="Bank UTR or transaction id" />
        </Field>
        <p className="text-[12.5px] text-ink-secondary">
          Recording payment moves this requirement into sourcing — the dispatch batch of {job.openings * PRICING.resumesPerOpening} resumes opens up.
        </p>
      </ModalBody>
      <ModalFoot>
        <Button onClick={app.closeModal}>Cancel</Button>
        <Button
          variant="primary"
          onClick={() => {
            app.closeModal()
            app.addToast('success', `${fmtINR(job.fee)} recorded against ${job.id}`)
          }}
        >
          Mark as paid
        </Button>
      </ModalFoot>
    </>
  )
}

export function openBatchDrawer(app, batch) {
  app.openSidePanel(<BatchDrawer app={app} batch={batch} />, 640)
}

function BatchDrawer({ app, batch }) {
  const job = jobOf(batch.jobId)
  const co = companyOf(batch.companyId)
  const pool = useMemo(
    () =>
      CANDIDATES.filter((c) => c.resume.status === 'verified' && c.mock.status === 'completed').sort(
        (a, b) => (b.mock.overall || 0) - (a.mock.overall || 0)
      ),
    []
  )
  const [picked, setPicked] = useState(() => new Set(pool.slice(0, Math.min(pool.length, batch.interviewsScheduled || 0)).map((c) => c.id)))

  function toggle(id) {
    setPicked((cur) => {
      const next = new Set(cur)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const progress = Math.min(100, Math.round((batch.interviewsScheduled / batch.resumeCount) * 100))

  return (
    <>
      <DrawerHead title={`Dispatch batch ${batch.id}`} subtitle={`${job.title} · ${co.name}`} onClose={app.closeSidePanel} />
      <DrawerBody>
        <div className="grid grid-cols-3 gap-3 mb-5">
          <div className="bg-surface-sunken rounded-xl p-3.5">
            <div className="text-xs text-ink-tertiary">Openings</div>
            <div className="text-[19px] font-bold mt-0.5">{batch.openings}</div>
          </div>
          <div className="bg-surface-sunken rounded-xl p-3.5">
            <div className="text-xs text-ink-tertiary">Resumes owed</div>
            <div className="text-[19px] font-bold mt-0.5">{batch.resumeCount}</div>
          </div>
          <div className="bg-surface-sunken rounded-xl p-3.5">
            <div className="text-xs text-ink-tertiary">Locked</div>
            <div className="text-[19px] font-bold mt-0.5">{batch.interviewsScheduled}</div>
          </div>
        </div>

        <div className="mb-1.5 flex items-center justify-between text-[12.5px]">
          <span className="text-ink-secondary">Batch fill</span>
          <span className="font-semibold">{progress}%</span>
        </div>
        <Bar value={progress} className="mb-5" />

        <div className="text-xs font-semibold tracking-wide uppercase text-ink-tertiary mb-3">
          Eligible pool — verified resume + cleared mock
        </div>
        <div className="flex flex-col gap-2">
          {pool.map((c) => {
            const t = trackOf(c.track)
            return (
              <label key={c.id} className="flex items-center gap-3 p-2.5 border border-border rounded-xl cursor-pointer hover:bg-surface-hover">
                <input type="checkbox" checked={picked.has(c.id)} onChange={() => toggle(c.id)} className="accent-navy w-[15px] h-[15px] flex-shrink-0" />
                <Avatar initials={c.initials} size="sm" />
                <div className="flex-1 min-w-0">
                  <div className="text-[13px] font-semibold truncate">{c.name}</div>
                  <div className="text-xs text-ink-tertiary truncate">
                    {c.city} · {c.exp} yrs · {t.label}
                  </div>
                </div>
                <Badge tone={c.grade === 'A' ? 'green' : 'gold'} dot={false}>
                  {c.mock.overall}
                </Badge>
              </label>
            )
          })}
        </div>

        <p className="text-xs text-ink-tertiary mt-4">
          Every candidate in a dispatched batch sees "Interview scheduled" on their own portal — that is the first time {co.name} learns their name.
        </p>
      </DrawerBody>
      <DrawerFoot>
        <Button onClick={() => { app.closeSidePanel(); app.addToast('success', `Batch ${batch.id} saved as draft`) }}>Save draft</Button>
        <Button
          variant="primary"
          onClick={() => {
            app.closeSidePanel()
            app.addToast('success', `${picked.size} resumes dispatched to ${co.name}`)
          }}
        >
          <Send size={15} /> Dispatch {picked.size} resumes
        </Button>
      </DrawerFoot>
    </>
  )
}

export function openShareApplicationModal(app, application) {
  const c = candidateOf(application.candidateId)
  const job = jobOf(application.jobId)
  const co = companyOf(job.companyId)

  app.openModal(
    <>
      <ModalHead title="Share profile with employer" onClose={app.closeModal} />
      <ModalBody>
        <div className="flex items-center gap-3 mb-4">
          <Avatar initials={c.initials} size="md" />
          <div className="min-w-0">
            <div className="text-[15px] font-semibold">{c.name}</div>
            <div className="text-xs text-ink-tertiary truncate">
              {job.title} · {co.name}
            </div>
          </div>
        </div>
        <div className="rounded-xl bg-surface-sunken p-3.5 mb-4">
          {[
            ['Resume status', RESUME_STATUS[c.resume.status].label],
            ['Mock interview', c.mock.overall ? `${c.mock.overall}/100` : 'Not completed'],
            ['Skill track', c.track ? trackOf(c.track).label : 'Unassigned'],
            ['Fit score', `${application.fit}%`],
          ].map(([l, v]) => (
            <div key={l} className="flex justify-between text-[12.5px] py-1.5 border-b border-border last:border-b-0">
              <span className="text-ink-tertiary">{l}</span>
              <span className="font-semibold">{v}</span>
            </div>
          ))}
        </div>
        <p className="text-[12.5px] text-ink-secondary">
          Sharing adds {c.name.split(' ')[0]} to {co.name}'s dispatch batch and flips their candidate portal to "Interview scheduled".
        </p>
      </ModalBody>
      <ModalFoot>
        <Button onClick={app.closeModal}>Cancel</Button>
        <Button
          variant="primary"
          onClick={() => {
            app.closeModal()
            app.addToast('success', `${c.name} shared with ${co.name}`)
          }}
        >
          <Building2 size={15} /> Share profile
        </Button>
      </ModalFoot>
    </>
  )
}
