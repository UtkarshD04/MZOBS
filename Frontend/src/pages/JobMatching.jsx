import { useState } from 'react'
import { Sliders, MapPin, Bookmark, Sparkles, BarChart3, Users, ShieldCheck, CheckCircle2 } from 'lucide-react'
import Card from '../components/ui/Card'
import Badge from '../components/ui/Badge'
import Button from '../components/ui/Button'
import Ring from '../components/ui/Ring'
import { CompanyLogo } from '../components/ui/Avatar'
import { PillTabs } from '../components/ui/Tabs'
import { Select } from '../components/ui/Field'
import EmptyState from '../components/ui/EmptyState'
import { StaggerGroup, StaggerItem } from '../components/ui/Stagger'
import { JOBS, MOCK_INTERVIEW, RESUME, SKILL_TRACK } from '../lib/data'
import { categoryOf } from '../lib/category'
import { useApp } from '../context/AppContext'
import { openApplyModal, openJobDetailModal } from '../lib/modals'

const eligible = RESUME.status === 'verified' && MOCK_INTERVIEW.status === 'completed'

function JobCard({ job, saved, onToggleSave }) {
  const app = useApp()
  const cat = categoryOf(job.category)
  const onTrack = job.category === SKILL_TRACK.key

  return (
    <Card hover pad className="flex gap-4 items-start">
      <CompanyLogo initials={job.logo} tone={cat.tone} />
      <div className="flex-1 min-w-0">
        <div className="flex justify-between flex-wrap gap-2">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <div className="text-[15px] font-semibold">{job.role}</div>
              <Badge tone={cat.tone} dot={false}>
                {cat.label}
              </Badge>
              {onTrack && (
                <Badge tone="gold" icon={<Sparkles size={11} />} dot={false}>
                  Your track
                </Badge>
              )}
            </div>
            <div className="text-[13px] text-ink-secondary mt-0.5">
              {job.co} · {job.loc} · {job.mode}
            </div>
            <div className="text-xs text-ink-tertiary mt-1.5 flex items-center gap-1">
              <Users size={11} /> {job.openings} opening{job.openings > 1 ? 's' : ''} · Verified employer
            </div>
          </div>
          <Ring value={job.match} size={44} thick={5} hero={job.match >= 90} />
        </div>

        <div className="flex items-center gap-3.5 mt-2.5 text-[13px] flex-wrap">
          <span className="flex items-center gap-1 text-ink-tertiary">
            <MapPin size={12} /> {job.loc}
          </span>
          <span>{job.sal}</span>
          <span className="text-xs text-ink-tertiary">Posted {job.posted}</span>
        </div>

        <div className="flex flex-wrap gap-1.5 mt-2.5">
          {job.tags.map((t) => (
            <span key={t} className="text-[11px] font-semibold text-ink-secondary bg-surface-sunken px-2 py-1 rounded-md">
              {t}
            </span>
          ))}
        </div>

        <div className="flex items-center gap-2 mt-3.5 flex-wrap">
          {job.applied ? (
            <Badge tone="green" icon={<CheckCircle2 size={11} />} dot={false}>
              Applied — with Mzobs
            </Badge>
          ) : (
            <Button variant="primary" size="sm" disabled={!eligible} onClick={() => openApplyModal(app, job)}>
              Apply through Mzobs
            </Button>
          )}
          <Button size="sm" onClick={() => openJobDetailModal(app, job)}>
            View details
          </Button>
          <button onClick={onToggleSave} className={`ml-auto p-1.5 rounded-lg ${saved ? 'text-gold-strong' : 'text-ink-tertiary hover:bg-surface-hover hover:text-ink'}`}>
            <Bookmark size={17} fill={saved ? 'currentColor' : 'none'} />
          </button>
        </div>
      </div>
    </Card>
  )
}

export default function JobMatching() {
  const [tab, setTab] = useState(0)
  const [saved, setSaved] = useState(() => new Set())

  function toggleSave(id) {
    setSaved((s) => {
      const next = new Set(s)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const savedJobs = JOBS.filter((j) => saved.has(j.id))
  const trackJobs = JOBS.filter((j) => j.category === SKILL_TRACK.key)

  return (
    <StaggerGroup>
      <StaggerItem className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Job Openings</h1>
        <p className="text-sm text-ink-secondary mt-1">
          Live requirements from companies verified by Mzobs. Applying sends your profile to our team — never straight to the employer.
        </p>
      </StaggerItem>

      <StaggerItem className="mb-5">
        <Card pad className={`flex items-start gap-3 ${eligible ? 'border-navy-ring bg-navy-tint' : 'border-gold-dot/40 bg-gold-tint'}`}>
          <ShieldCheck size={18} className={`mt-0.5 flex-shrink-0 ${eligible ? 'text-navy' : 'text-gold-strong'}`} />
          <div className="flex-1 min-w-0">
            <div className="text-[13.5px] font-semibold">
              {eligible ? `You're eligible to apply — ${SKILL_TRACK.label}, Grade ${SKILL_TRACK.grade}` : 'Finish verification to unlock applications'}
            </div>
            <p className="text-[13px] text-ink-secondary mt-0.5">
              {eligible
                ? 'Your resume is verified and your mock interview is done. When you apply, Mzobs screens you, shortlists against the requirement, and forwards your resume to the company. You will see "Interview scheduled" the moment your profile is shared.'
                : 'Applications open once your resume is verified and you have cleared the Mzobs mock interview round.'}
            </p>
          </div>
        </Card>
      </StaggerItem>

      <StaggerItem className="flex items-center justify-between flex-wrap gap-3 mb-4">
        <PillTabs items={['All openings', 'My track', 'Saved', 'Compare']} active={tab} onChange={setTab} />
        <div className="flex gap-2">
          <Button size="sm">
            <Sliders size={14} /> Filters
          </Button>
          <Select className="h-8 text-[12.5px]" defaultValue="Best match">
            <option>Best match</option>
            <option>Newest</option>
            <option>Salary</option>
            <option>Most openings</option>
          </Select>
        </div>
      </StaggerItem>

      <StaggerItem>
        {tab === 0 && (
          <div className="flex flex-col gap-4">
            {JOBS.map((j) => (
              <JobCard key={j.id} job={j} saved={saved.has(j.id)} onToggleSave={() => toggleSave(j.id)} />
            ))}
          </div>
        )}

        {tab === 1 &&
          (trackJobs.length ? (
            <div className="flex flex-col gap-4">
              {trackJobs.map((j) => (
                <JobCard key={j.id} job={j} saved={saved.has(j.id)} onToggleSave={() => toggleSave(j.id)} />
              ))}
            </div>
          ) : (
            <Card>
              <EmptyState
                icon={Sparkles}
                title={`No live ${SKILL_TRACK.label} requirements right now`}
                body="We'll notify you the moment a company posts one matching your track."
                action={
                  <Button variant="primary" className="mt-2" onClick={() => setTab(0)}>
                    Browse all openings
                  </Button>
                }
              />
            </Card>
          ))}

        {tab === 2 &&
          (savedJobs.length ? (
            <div className="flex flex-col gap-4">
              {savedJobs.map((j) => (
                <JobCard key={j.id} job={j} saved onToggleSave={() => toggleSave(j.id)} />
              ))}
            </div>
          ) : (
            <Card>
              <EmptyState
                icon={Bookmark}
                title="No saved openings yet"
                body="Tap the bookmark icon on any opening to save it for later."
                action={
                  <Button variant="primary" className="mt-2" onClick={() => setTab(0)}>
                    Browse all openings
                  </Button>
                }
              />
            </Card>
          ))}

        {tab === 3 && (
          <Card>
            <EmptyState
              icon={BarChart3}
              title="Select openings to compare"
              body="Choose up to 3 roles to compare salary, location and requirements side by side."
              action={
                <Button variant="primary" className="mt-2" onClick={() => setTab(0)}>
                  Go to all openings
                </Button>
              }
            />
          </Card>
        )}
      </StaggerItem>
    </StaggerGroup>
  )
}
