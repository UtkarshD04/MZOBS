import { useMemo, useState } from 'react'
import { FileCheck, FileText, ShieldCheck, Download, Clock } from 'lucide-react'
import Card, { CardHead } from '../../components/ui/Card'
import Badge from '../../components/ui/Badge'
import Button from '../../components/ui/Button'
import Avatar from '../../components/ui/Avatar'
import Ring from '../../components/ui/Ring'
import { PillTabs } from '../../components/ui/Tabs'
import EmptyState from '../../components/ui/EmptyState'
import CountUp from '../../components/ui/CountUp'
import { StaggerGroup, StaggerItem } from '../../components/ui/Stagger'
import { useApp } from '../../context/AppContext'
import { openCandidateDrawer, openScheduleMockModal, openVerifyResumeModal } from '../../lib/mzobsModals'
import { CANDIDATES, RESUME_STATUS } from '../../lib/mzobsData'

const TABS = ['Pending', 'Changes requested', 'Verified', 'Not uploaded']
const TAB_KEYS = ['pending', 'changes', 'verified', 'none']

export default function ResumeQueue() {
  const app = useApp()
  const [tab, setTab] = useState(0)

  const counts = useMemo(() => TAB_KEYS.map((k) => CANDIDATES.filter((c) => c.resume.status === k).length), [])
  const rows = useMemo(() => CANDIDATES.filter((c) => c.resume.status === TAB_KEYS[tab]), [tab])

  return (
    <StaggerGroup>
      <StaggerItem className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Resume Verification</h1>
        <p className="text-sm text-ink-secondary mt-1">
          Every resume uploaded on the candidate portal lands here. Nothing reaches an employer until our team clears it.
        </p>
      </StaggerItem>

      <StaggerItem className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
        {TABS.map((label, i) => (
          <Card key={label} hover pad onClick={() => setTab(i)} className="cursor-pointer">
            <span className="text-xs font-semibold tracking-wide uppercase text-ink-tertiary">{label}</span>
            <div className={`text-[30px] font-bold tracking-tight mt-2 ${i === 0 ? 'text-gold-strong' : i === 2 ? 'text-green' : 'text-navy'}`}>
              <CountUp value={counts[i]} />
            </div>
          </Card>
        ))}
      </StaggerItem>

      <StaggerItem className="mb-4">
        <PillTabs items={TABS} active={tab} onChange={setTab} />
      </StaggerItem>

      <StaggerItem>
        {rows.length === 0 ? (
          <Card>
            <EmptyState icon={FileCheck} tone="green" title="Nothing in this queue" body="All caught up here — check another tab." />
          </Card>
        ) : (
          <div className="flex flex-col gap-4">
            {rows.map((c) => {
              const st = RESUME_STATUS[c.resume.status]
              return (
                <Card key={c.id} pad>
                  <div className="flex items-start gap-4 flex-wrap">
                    <Avatar initials={c.initials} size="md" />
                    <div className="flex-1 min-w-[220px]">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[15px] font-semibold">{c.name}</span>
                        <Badge tone={st.tone}>{st.label}</Badge>
                        <Badge tone={c.subscription.status === 'paid' ? 'green' : 'red'} dot={false}>
                          {c.subscription.status === 'paid' ? '₹99 paid' : 'Unpaid'}
                        </Badge>
                      </div>
                      <div className="text-[13px] text-ink-secondary mt-1">
                        {c.id} · {c.city} · {c.exp} yrs · Expects {c.expectedCtc}
                      </div>
                      {c.skills.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mt-2.5">
                          {c.skills.map((s) => (
                            <span key={s} className="text-[11px] font-semibold text-ink-secondary bg-surface-sunken px-2 py-1 rounded-md">
                              {s}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    {c.resume.score !== null && <Ring value={c.resume.score} size={52} thick={6} hero={c.resume.score >= 85} />}
                  </div>

                  {c.resume.file ? (
                    <div className="flex items-center gap-3.5 p-3 bg-surface-sunken rounded-xl mt-4">
                      <FileText size={22} className="text-navy flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="text-[13px] font-semibold truncate">{c.resume.file}</div>
                        <div className="text-[11px] text-ink-tertiary mt-0.5 flex items-center gap-1">
                          <Clock size={11} /> Version {c.resume.version} · Uploaded {c.resume.uploadedOn}
                          {c.resume.reviewer && ` · Last reviewed by ${c.resume.reviewer}`}
                        </div>
                      </div>
                      <Button size="sm" onClick={() => app.addToast('success', `Opening ${c.resume.file}`)}>
                        <Download size={13} /> Open
                      </Button>
                    </div>
                  ) : (
                    <div className="text-[13px] text-ink-tertiary mt-4 p-3 bg-surface-sunken rounded-xl">
                      No resume uploaded yet.{' '}
                      {c.subscription.status === 'paid'
                        ? 'Candidate has paid — send a reminder to upload.'
                        : 'Candidate has not paid the ₹99 fee, so upload is still locked for them.'}
                    </div>
                  )}

                  {c.resume.note && <p className="text-[12.5px] text-ink-secondary mt-3">Reviewer note: {c.resume.note}</p>}

                  <div className="flex items-center gap-2 mt-4 pt-3.5 border-t border-border flex-wrap">
                    {c.resume.file && (
                      <Button variant="primary" size="sm" onClick={() => openVerifyResumeModal(app, c)}>
                        <ShieldCheck size={14} /> {c.resume.status === 'verified' ? 'Re-verify' : 'Review & decide'}
                      </Button>
                    )}
                    {c.resume.status === 'verified' && c.mock.status === 'not_scheduled' && (
                      <Button size="sm" onClick={() => openScheduleMockModal(app, c)}>
                        Schedule mock interview
                      </Button>
                    )}
                    {!c.resume.file && (
                      <Button size="sm" onClick={() => app.addToast('success', `Reminder sent to ${c.name}`)}>
                        Send reminder
                      </Button>
                    )}
                    <Button variant="ghost" size="sm" className="ml-auto" onClick={() => openCandidateDrawer(app, c)}>
                      Full profile
                    </Button>
                  </div>
                </Card>
              )
            })}
          </div>
        )}
      </StaggerItem>

      <StaggerItem className="mt-5">
        <Card>
          <CardHead>
            <span className="text-[15px] font-semibold">Verification standard</span>
          </CardHead>
          <div className="p-[22px] grid md:grid-cols-3 gap-4">
            {[
              ['Identity & contact', 'Phone and email verified, name matches the resume.'],
              ['Work history', 'Dates and titles cross-checked against offer letters or payslips.'],
              ['Formatting & ATS', 'Single column, parsable, no images in the text layer.'],
            ].map(([t, b]) => (
              <div key={t}>
                <div className="text-[13px] font-semibold">{t}</div>
                <div className="text-[12.5px] text-ink-secondary mt-1">{b}</div>
              </div>
            ))}
          </div>
        </Card>
      </StaggerItem>
    </StaggerGroup>
  )
}
