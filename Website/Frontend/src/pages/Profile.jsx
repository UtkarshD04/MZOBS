import { useState } from 'react'
import {
  Pencil,
  Plus,
  ShieldCheck,
  Mail,
  Phone,
  Briefcase,
  BadgeCheck,
  FileText,
  Download,
  Link as LinkIcon,
  X,
  EyeOff,
  MapPin,
  ArrowUp,
  ChevronRight,
  GraduationCap,
  Sparkles,
  Check,
  FolderKanban,
  Target,
  Award,
  User,
} from 'lucide-react'
import { FaLinkedin, FaGithub } from 'react-icons/fa6'
import Card, { CardHead } from '../components/ui/Card'
import Badge from '../components/ui/Badge'
import Ring from '../components/ui/Ring'
import Button from '../components/ui/Button'
import Avatar from '../components/ui/Avatar'
import Switch from '../components/ui/Switch'
import Chip from '../components/ui/Chip'
import { Field, Input } from '../components/ui/Field'
import EmptyState from '../components/ui/EmptyState'
import { StaggerGroup, StaggerItem } from '../components/ui/Stagger'
import { PageSkeleton } from '../components/ui/Skeleton'
import ErrorState from '../components/ui/ErrorState'
import { useApp } from '../context/AppContext'
import { useProfileQuery, useUpdateProfileMutation } from '../hooks/useProfile'
import { FILE_BASE_URL } from '../lib/config'
import { WORK_MODES, EMPLOYMENT_TYPES } from '../lib/jobFilters'
import { COMPLETION_CHECKS, profileCompletion } from '../lib/profileCompletion'

// Naukri-style layout: a completeness header up top, a jump-to sidebar of
// every profile section, and each section as its own card below — instead
// of the old tabbed editor. Only fields that exist on the Employee model
// (Backend/src/models/Employee.js) are listed here.
const SECTIONS = [
  { id: 'resume', label: 'Resume', icon: FileText, tone: 'navy', hint: (p) => (p.resume?.status && p.resume.status !== 'none' ? null : 'Upload') },
  { id: 'headline', label: 'Resume headline', icon: Sparkles, tone: 'gold', hint: (p) => (p.resumeHeadline ? null : 'Add') },
  { id: 'skills', label: 'Key skills', icon: BadgeCheck, tone: 'green', hint: (p) => ((p.skills ?? []).length > 0 ? null : 'Add') },
  { id: 'education', label: 'Education', icon: GraduationCap, tone: 'navy', hint: (p) => ((p.education ?? []).length > 0 ? null : 'Add') },
  { id: 'experience', label: 'Experience', icon: Briefcase, tone: 'gold', hint: (p) => ((p.workHistory ?? []).length > 0 ? null : 'Add') },
  { id: 'projects', label: 'Projects', icon: FolderKanban, tone: 'green', hint: (p) => ((p.projects ?? []).length > 0 ? null : 'Add') },
  { id: 'career', label: 'Career profile', icon: Target, tone: 'navy', hint: (p) => (p.preferredRole ? null : 'Add') },
  { id: 'links', label: 'Portfolio & social links', icon: LinkIcon, tone: 'gold', hint: (p) => (p.portfolioLink || p.linkedin || p.github ? null : 'Add') },
  { id: 'accomplishments', label: 'Accomplishments', icon: Award, tone: 'green', hint: () => null },
  { id: 'personal', label: 'Personal details', icon: User, tone: 'navy', hint: () => null },
  { id: 'visibility', label: 'Visibility', icon: EyeOff, tone: 'gold', hint: () => null },
]

const TONE_CLASSES = {
  navy: 'bg-navy-tint text-navy',
  gold: 'bg-gold-tint text-gold-strong',
  green: 'bg-green-tint text-green',
}

const MISSING_ICONS = {
  resumeHeadline: FileText,
  skills: BadgeCheck,
  education: GraduationCap,
  currentCity: MapPin,
  resume: FileText,
  phone: Phone,
  links: LinkIcon,
  preferredRole: Briefcase,
  preferredLocations: MapPin,
}

function initialsOf(name = '') {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return ''
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

function daysAgo(iso) {
  if (!iso) return null
  const then = new Date(iso).getTime()
  const days = Math.floor((Date.now() - then) / 86400000)
  if (days <= 0) return 'Today'
  if (days === 1) return 'Yesterday'
  if (days < 7) return `${days} days ago`
  return new Date(iso).toLocaleDateString('en-IN')
}

function jumpTo(id) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

const SECTION_BY_ID = Object.fromEntries(SECTIONS.map((s) => [s.id, s]))

function Section({ id, extra, action, children }) {
  const { label, icon: Icon, tone } = SECTION_BY_ID[id]
  return (
    <Card id={id} hover className="scroll-mt-24">
      <CardHead>
        <span className="text-[15px] font-semibold flex items-center gap-2.5">
          <span className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${TONE_CLASSES[tone]}`}>
            <Icon size={16} />
          </span>
          {label}
          {extra}
        </span>
        {action}
      </CardHead>
      <div className="p-[22px] pt-4">{children}</div>
    </Card>
  )
}

function TagList({ items, onRemove, emptyText }) {
  if ((items ?? []).length === 0) return <p className="text-[13px] text-ink-secondary">{emptyText}</p>
  return (
    <div className="flex flex-wrap gap-2">
      {items.map((tag) => (
        <span key={tag} className="flex items-center gap-1.5 text-[12.5px] font-semibold text-ink-secondary bg-surface-sunken px-3 py-1.5 rounded-md">
          {tag}
          <X size={12} className="cursor-pointer" onClick={() => onRemove(tag)} />
        </span>
      ))}
    </div>
  )
}

export default function Profile() {
  const app = useApp()
  const { data: profile, isLoading, isError, refetch } = useProfileQuery()
  const updateProfile = useUpdateProfileMutation()

  const [personal, setPersonal] = useState(null)
  const [career, setCareer] = useState(null)
  const [headline, setHeadline] = useState(null)
  const [links, setLinks] = useState(null)
  const [newSkill, setNewSkill] = useState('')
  const [newLocation, setNewLocation] = useState('')
  const [newEducation, setNewEducation] = useState({ degree: '', institute: '', year: '' })
  const [newJob, setNewJob] = useState({ company: '', role: '', duration: '' })
  const [newProject, setNewProject] = useState({ name: '', description: '' })

  if (isLoading) return <PageSkeleton />
  if (isError) return <ErrorState onRetry={refetch} />

  function save(patch, message = 'Saved') {
    updateProfile.mutate(patch, {
      onSuccess: () => app.addToast('success', message),
      onError: (err) => app.addToast('error', err.response?.data?.message ?? 'Could not save. Please try again.'),
    })
  }

  const { percent: completion, missing } = profileCompletion(profile)
  const weight = Math.round(100 / COMPLETION_CHECKS.length)
  const p = personal ?? { name: profile.name, dob: profile.dob, phone: profile.phone, currentCity: profile.currentCity }
  const c = career ?? { preferredRole: profile.preferredRole, expectedSalaryMin: profile.expectedSalaryMin, expectedSalaryMax: profile.expectedSalaryMax }
  const l = links ?? { portfolioLink: profile.portfolioLink, linkedin: profile.linkedin, github: profile.github }
  const resumeMissing = !profile.resume?.status || profile.resume.status === 'none'

  return (
    <StaggerGroup className="relative">
      {/* Soft decorative glow, matching Landing-Frontend's hero atmosphere —
          restrained here (2 blobs, low opacity) since this is a form-heavy
          page, not a hero section. */}
      <div className="glow-blob w-72 h-72 -top-10 -left-16 bg-navy/6" aria-hidden="true" />
      <div className="glow-blob w-64 h-64 top-20 -right-10 bg-gold/8" aria-hidden="true" />

      {/* ── Profile summary + completeness ─────────────────────────── */}
      <StaggerItem className="relative z-10 grid lg:grid-cols-[1.5fr_1fr] gap-5 mb-5">
        <Card pad hover className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-navy-tint/60 via-transparent to-gold-tint/40 pointer-events-none" aria-hidden="true" />
          <div className="relative flex gap-4">
            <div className="relative shrink-0">
              <div className="rounded-full ring-4 ring-navy-tint">
                <Avatar initials={initialsOf(profile.name)} size="lg" />
              </div>
              <span className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 text-[10px] font-bold text-white bg-red px-1.5 py-0.5 rounded-full whitespace-nowrap shadow-sm">
                {completion}%
              </span>
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold tracking-tight truncate">{profile.name}</h1>
                <button className="p-1 rounded-lg text-ink-tertiary hover:bg-surface-hover hover:text-ink shrink-0" onClick={() => jumpTo('personal')} aria-label="Edit">
                  <Pencil size={14} />
                </button>
              </div>
              <div className="text-xs text-ink-tertiary mt-1">Profile last updated{profile.updatedAt ? ` - ${daysAgo(profile.updatedAt)}` : ''}</div>

              <div className="h-px bg-border my-3" />

              <div className="grid sm:grid-cols-2 gap-x-4 gap-y-1.5 text-[13px]">
                {profile.currentCity ? (
                  <span className="flex items-center gap-1.5 text-ink-secondary">
                    <MapPin size={13} className="text-ink-tertiary shrink-0" /> {profile.currentCity}
                  </span>
                ) : (
                  <button className="flex items-center gap-1.5 font-semibold text-navy hover:underline w-fit" onClick={() => jumpTo('personal')}>
                    <MapPin size={13} /> Add location
                  </button>
                )}
                {profile.phone ? (
                  <span className="flex items-center gap-1.5 text-ink-secondary">
                    <Phone size={13} className="text-ink-tertiary shrink-0" /> {profile.phone}
                    {profile.phoneVerified && <ShieldCheck size={13} className="text-green shrink-0" />}
                  </span>
                ) : (
                  <button className="flex items-center gap-1.5 font-semibold text-navy hover:underline w-fit" onClick={() => jumpTo('personal')}>
                    <Phone size={13} /> Add mobile number
                  </button>
                )}
                {profile.experience && (
                  <span className="flex items-center gap-1.5 text-ink-secondary">
                    <Briefcase size={13} className="text-ink-tertiary shrink-0" /> {profile.experience === 'fresher' ? 'Fresher' : 'Experienced'}
                  </span>
                )}
                <span className="flex items-center gap-1.5 text-ink-secondary truncate">
                  <Mail size={13} className="text-ink-tertiary shrink-0" /> {profile.email}
                </span>
              </div>
            </div>
          </div>
        </Card>

        <Card pad hover className={missing.length > 0 ? 'bg-amber-tint border-transparent' : undefined}>
          <div className="flex items-center gap-3">
            <Ring value={completion} size={52} thick={5} hero />
            <div>
              <div className="text-[13.5px] font-semibold">{completion === 100 ? 'Your profile is complete' : 'Complete your profile'}</div>
              <div className="text-xs text-ink-tertiary">
                {completion === 100 ? 'Nice work — keep it up to date.' : `${missing.length} of ${COMPLETION_CHECKS.length} details left`}
              </div>
            </div>
          </div>
          {missing.length > 0 && (
            <>
              <div className="flex flex-col gap-1 mt-4">
                {missing.slice(0, 3).map((check) => {
                  const Icon = MISSING_ICONS[check.key] ?? FileText
                  return (
                    <button key={check.key} onClick={() => jumpTo(check.section)} className="flex items-center gap-3 py-1.5 text-left group">
                      <span className="w-8 h-8 rounded-full bg-surface flex items-center justify-center text-amber shrink-0">
                        <Icon size={15} />
                      </span>
                      <span className="flex-1 text-[13px] text-ink-secondary group-hover:text-navy">{check.label}</span>
                      <Badge tone="green" dot={false} icon={<ArrowUp size={10} />}>
                        {weight}%
                      </Badge>
                    </button>
                  )
                })}
              </div>
              <Button variant="primary" className="mt-3 w-full" onClick={() => jumpTo(missing[0].section)}>
                Add {missing.length} missing detail{missing.length === 1 ? '' : 's'}
              </Button>
            </>
          )}
        </Card>
      </StaggerItem>

      {/* ── Quick links + sections ──────────────────────────────────── */}
      <StaggerItem className="relative z-10 grid lg:grid-cols-[220px_1fr] gap-5 items-start">
        <Card className="hidden lg:block sticky top-20 p-2">
          {SECTIONS.map((s) => {
            const hint = s.hint(profile)
            const Icon = s.icon
            return (
              <button
                key={s.id}
                onClick={() => jumpTo(s.id)}
                className="group w-full flex items-center gap-2.5 text-left text-[13px] text-ink-secondary hover:text-navy hover:bg-surface-hover hover:pl-4 px-3 py-2 rounded-lg transition-all duration-150"
              >
                <span className={`w-6 h-6 rounded-md flex items-center justify-center shrink-0 ${TONE_CLASSES[s.tone]}`}>
                  <Icon size={12} />
                </span>
                <span className="flex-1">{s.label}</span>
                {hint ? <span className="text-navy font-semibold text-xs shrink-0">{hint}</span> : <ChevronRight size={13} className="text-ink-tertiary shrink-0 transition-transform group-hover:translate-x-0.5" />}
              </button>
            )
          })}
        </Card>

        <div className="flex flex-col gap-5">
          <Section
            id="resume"
            extra={resumeMissing && <span className="text-green text-[12.5px] font-semibold">Add {weight}%</span>}
            action={
              <a href="/app/resume" className="text-navy font-semibold text-[13px] hover:underline">
                Manage resume
              </a>
            }
          >
            {resumeMissing ? (
              <div className="flex flex-col sm:flex-row items-center gap-5">
                <div className="relative w-28 h-36 rounded-xl bg-gradient-to-br from-navy-tint to-gold-tint shrink-0 overflow-hidden border border-border">
                  <div className="absolute inset-3 bg-surface rounded-lg shadow-xs p-2.5 flex flex-col gap-1.5">
                    <div className="w-7 h-7 rounded-full bg-navy-tint mb-1" />
                    <div className="h-1.5 w-3/4 bg-border rounded-full" />
                    <div className="h-1.5 w-1/2 bg-border rounded-full" />
                    <div className="h-1 w-full bg-border-strong rounded-full mt-2" />
                    <div className="h-1 w-full bg-border-strong rounded-full" />
                    <div className="h-1 w-2/3 bg-border-strong rounded-full" />
                    <div className="h-1 w-full bg-border-strong rounded-full mt-1.5" />
                    <div className="h-1 w-4/5 bg-border-strong rounded-full" />
                  </div>
                </div>
                <div className="flex-1 w-full">
                  <p className="text-[13px] text-ink-secondary mb-3">70% of recruiters discover candidates through their resume.</p>
                  <div className="flex items-center gap-2 text-[13px] font-semibold text-ink-secondary mb-1.5">
                    <Sparkles size={14} className="text-gold" /> Get found faster:
                  </div>
                  <ol className="flex flex-col gap-1 text-[13px] text-ink-secondary mb-4 list-decimal list-inside">
                    <li>Fill in your profile details</li>
                    <li>Upload your resume (PDF or DOC)</li>
                    <li>Get it verified by the Mzobs team</li>
                  </ol>
                  <Button variant="primary" onClick={() => (window.location.href = '/app/resume')}>
                    <Plus size={15} /> Upload resume
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between p-3.5 border border-border rounded-xl">
                <div className="flex items-center gap-3">
                  <FileText size={22} className="text-navy" />
                  <div>
                    <div className="text-[13.5px] font-semibold">{profile.resume.file}</div>
                    <div className="text-xs text-ink-tertiary">
                      Uploaded {profile.resume.uploadedOn ? new Date(profile.resume.uploadedOn).toLocaleDateString('en-IN') : ''}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge tone={profile.resume.status === 'verified' ? 'green' : 'gold'}>{profile.resume.status}</Badge>
                  {profile.resume.url && (
                    <Button size="sm" onClick={() => window.open(`${FILE_BASE_URL}${profile.resume.url}`, '_blank')}>
                      <Download size={14} />
                    </Button>
                  )}
                </div>
              </div>
            )}
          </Section>

          <Section id="headline">
            <Field label="A one-line summary employers see first">
              <Input
                placeholder="e.g. Fresher — B.Com graduate seeking a role in accounts & finance"
                value={headline ?? profile.resumeHeadline ?? ''}
                onChange={(e) => setHeadline(e.target.value)}
              />
            </Field>
            <Button variant="primary" size="sm" onClick={() => save({ resumeHeadline: headline ?? profile.resumeHeadline }, 'Resume headline saved')}>
              Save
            </Button>
          </Section>

          <Section id="skills">
            <TagList items={profile.skills} onRemove={(s) => save({ skills: profile.skills.filter((x) => x !== s) })} emptyText="No skills added yet." />
            <div className="flex gap-2 mt-4 max-w-sm">
              <Input placeholder="Add a skill" value={newSkill} onChange={(e) => setNewSkill(e.target.value)} />
              <Button
                disabled={!newSkill.trim()}
                onClick={() => {
                  save({ skills: [...(profile.skills ?? []), newSkill.trim()] })
                  setNewSkill('')
                }}
              >
                <Plus size={15} /> Add
              </Button>
            </div>
          </Section>

          <Section id="education">
            {(profile.education ?? []).length === 0 && <p className="text-[13px] text-ink-secondary mb-3">No education added yet.</p>}
            {(profile.education ?? []).map((ed, i) => (
              <div key={i} className="border border-border rounded-xl p-4 flex items-center justify-between mb-3">
                <div>
                  <div className="text-[15px] font-semibold">{ed.degree}</div>
                  <div className="text-[13px] text-ink-secondary mt-1">
                    {ed.institute} {ed.year ? `· ${ed.year}` : ''}
                  </div>
                </div>
                <button
                  className="p-1.5 rounded-lg text-ink-tertiary hover:bg-surface-hover hover:text-ink"
                  onClick={() => save({ education: profile.education.filter((_, idx) => idx !== i) }, 'Removed')}
                >
                  <X size={16} />
                </button>
              </div>
            ))}
            <div className="border border-dashed border-border-strong rounded-xl p-4 grid md:grid-cols-3 gap-3">
              <Input placeholder="Degree / course" value={newEducation.degree} onChange={(e) => setNewEducation({ ...newEducation, degree: e.target.value })} />
              <Input placeholder="Institute" value={newEducation.institute} onChange={(e) => setNewEducation({ ...newEducation, institute: e.target.value })} />
              <Input placeholder="Year" value={newEducation.year} onChange={(e) => setNewEducation({ ...newEducation, year: e.target.value })} />
            </div>
            <Button
              className="mt-3"
              disabled={!newEducation.degree}
              onClick={() => {
                save({ education: [...(profile.education ?? []), newEducation] }, 'Education added')
                setNewEducation({ degree: '', institute: '', year: '' })
              }}
            >
              <Plus size={15} /> Add education
            </Button>
          </Section>

          <Section id="experience">
            {(profile.workHistory ?? []).length === 0 ? (
              <EmptyState icon={Briefcase} title="No work experience added yet" body="Add internships or jobs to strengthen your profile." />
            ) : (
              profile.workHistory.map((w, i) => (
                <div key={i} className="border border-border rounded-xl p-4 flex items-center justify-between mb-3">
                  <div>
                    <div className="text-[15px] font-semibold">{w.role}</div>
                    <div className="text-[13px] text-ink-secondary mt-1">
                      {w.company} {w.duration ? `· ${w.duration}` : ''}
                    </div>
                  </div>
                  <button
                    className="p-1.5 rounded-lg text-ink-tertiary hover:bg-surface-hover hover:text-ink"
                    onClick={() => save({ workHistory: profile.workHistory.filter((_, idx) => idx !== i) })}
                  >
                    <X size={16} />
                  </button>
                </div>
              ))
            )}
            <div className="border border-dashed border-border-strong rounded-xl p-4 grid md:grid-cols-3 gap-3 mt-1">
              <Input placeholder="Company" value={newJob.company} onChange={(e) => setNewJob({ ...newJob, company: e.target.value })} />
              <Input placeholder="Role" value={newJob.role} onChange={(e) => setNewJob({ ...newJob, role: e.target.value })} />
              <Input placeholder="Duration (e.g. 2023 – Present)" value={newJob.duration} onChange={(e) => setNewJob({ ...newJob, duration: e.target.value })} />
            </div>
            <Button
              className="mt-3"
              disabled={!newJob.company}
              onClick={() => {
                save({ workHistory: [...(profile.workHistory ?? []), newJob] }, 'Experience added')
                setNewJob({ company: '', role: '', duration: '' })
              }}
            >
              <Plus size={15} /> Add experience
            </Button>
          </Section>

          <Section id="projects">
            <div className="grid md:grid-cols-2 gap-4">
              {(profile.projects ?? []).map((pr, i) => (
                <Card key={i}>
                  <div className="p-[22px]">
                    <div className="flex items-start justify-between gap-2">
                      <div className="text-[15px] font-semibold">{pr.name}</div>
                      <button
                        className="p-1 rounded-lg text-ink-tertiary hover:bg-surface-hover hover:text-ink"
                        onClick={() => save({ projects: profile.projects.filter((_, idx) => idx !== i) })}
                      >
                        <X size={14} />
                      </button>
                    </div>
                    <div className="text-[13px] text-ink-secondary mt-1.5">{pr.description}</div>
                  </div>
                </Card>
              ))}
              <div className="border border-dashed border-border-strong rounded-xl p-4 flex flex-col gap-2 justify-center">
                <Input placeholder="Project name" value={newProject.name} onChange={(e) => setNewProject({ ...newProject, name: e.target.value })} />
                <Input placeholder="Short description" value={newProject.description} onChange={(e) => setNewProject({ ...newProject, description: e.target.value })} />
                <Button
                  variant="ghost"
                  disabled={!newProject.name}
                  onClick={() => {
                    save({ projects: [...(profile.projects ?? []), newProject] }, 'Project added')
                    setNewProject({ name: '', description: '' })
                  }}
                >
                  <Plus size={15} /> Add project
                </Button>
              </div>
            </div>
          </Section>

          <Section id="career">
            <div className="grid md:grid-cols-3 gap-4">
              <Field label="Preferred role">
                <Input placeholder="e.g. Business Analyst" value={c.preferredRole ?? ''} onChange={(e) => setCareer({ ...c, preferredRole: e.target.value })} />
              </Field>
              <Field label="Expected salary (min, ₹)">
                <Input type="number" value={c.expectedSalaryMin ?? ''} onChange={(e) => setCareer({ ...c, expectedSalaryMin: e.target.value ? Number(e.target.value) : null })} />
              </Field>
              <Field label="Expected salary (max, ₹)">
                <Input type="number" value={c.expectedSalaryMax ?? ''} onChange={(e) => setCareer({ ...c, expectedSalaryMax: e.target.value ? Number(e.target.value) : null })} />
              </Field>
            </div>
            <Button
              variant="primary"
              className="mb-5"
              onClick={() => save({ preferredRole: c.preferredRole, expectedSalaryMin: c.expectedSalaryMin, expectedSalaryMax: c.expectedSalaryMax }, 'Career preferences saved')}
            >
              <Pencil size={15} /> Save changes
            </Button>

            <div className="mb-5">
              <label className="text-[13px] font-semibold">Preferred locations</label>
              <div className="mt-2.5">
                <TagList
                  items={profile.preferredLocations}
                  onRemove={(loc) => save({ preferredLocations: profile.preferredLocations.filter((x) => x !== loc) })}
                  emptyText="No preferred locations yet."
                />
              </div>
              <div className="flex gap-2 mt-3 max-w-sm">
                <Input placeholder="Add a city" value={newLocation} onChange={(e) => setNewLocation(e.target.value)} />
                <Button
                  disabled={!newLocation.trim()}
                  onClick={() => {
                    save({ preferredLocations: [...(profile.preferredLocations ?? []), newLocation.trim()] })
                    setNewLocation('')
                  }}
                >
                  <Plus size={15} /> Add
                </Button>
              </div>
            </div>

            <div className="mb-5">
              <label className="text-[13px] font-semibold">Work mode preference</label>
              <div className="flex flex-wrap gap-2.25 mt-2.5">
                {WORK_MODES.map((mode) => (
                  <Chip
                    key={mode}
                    selected={(profile.workModePreference ?? []).includes(mode)}
                    onClick={() => {
                      const current = profile.workModePreference ?? []
                      save({ workModePreference: current.includes(mode) ? current.filter((x) => x !== mode) : [...current, mode] })
                    }}
                  >
                    {mode}
                  </Chip>
                ))}
              </div>
            </div>

            <div>
              <label className="text-[13px] font-semibold">Job type preference</label>
              <div className="flex flex-wrap gap-2.25 mt-2.5">
                {EMPLOYMENT_TYPES.map((type) => (
                  <Chip
                    key={type}
                    selected={(profile.jobTypePreference ?? []).includes(type)}
                    onClick={() => {
                      const current = profile.jobTypePreference ?? []
                      save({ jobTypePreference: current.includes(type) ? current.filter((x) => x !== type) : [...current, type] })
                    }}
                  >
                    {type}
                  </Chip>
                ))}
              </div>
            </div>
          </Section>

          <Section id="links">
            <Field label="Portfolio URL">
              <div className="relative">
                <LinkIcon size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-tertiary" />
                <Input
                  placeholder="https://yourportfolio.com"
                  className="pl-9.5"
                  value={l.portfolioLink ?? ''}
                  onChange={(e) => setLinks({ ...l, portfolioLink: e.target.value })}
                />
              </div>
            </Field>
            <Field label="LinkedIn">
              <div className="relative">
                <FaLinkedin size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-tertiary" />
                <Input className="pl-9.5" value={l.linkedin ?? ''} onChange={(e) => setLinks({ ...l, linkedin: e.target.value })} />
              </div>
            </Field>
            <Field label="GitHub">
              <div className="relative">
                <FaGithub size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-tertiary" />
                <Input placeholder="github.com/username" className="pl-9.5" value={l.github ?? ''} onChange={(e) => setLinks({ ...l, github: e.target.value })} />
              </div>
            </Field>
            <Button variant="primary" onClick={() => save({ portfolioLink: l.portfolioLink, linkedin: l.linkedin, github: l.github })}>
              Save
            </Button>
          </Section>

          <Section id="accomplishments">
            <EmptyState icon={BadgeCheck} title="No accomplishments added" body="Certificate and accomplishment uploads are coming soon." />
          </Section>

          <Section id="personal">
            <div className="grid md:grid-cols-2 gap-4">
              <Field label="Full name">
                <Input value={p.name ?? ''} onChange={(e) => setPersonal({ ...p, name: e.target.value })} />
              </Field>
              <Field label="Date of birth">
                <Input type="date" value={p.dob ?? ''} onChange={(e) => setPersonal({ ...p, dob: e.target.value })} />
              </Field>
              <Field label="Email">
                <Input value={profile.email} disabled />
              </Field>
              <Field label="Phone">
                <Input value={p.phone ?? ''} onChange={(e) => setPersonal({ ...p, phone: e.target.value })} />
              </Field>
              <Field label="Location">
                <Input value={p.currentCity ?? ''} onChange={(e) => setPersonal({ ...p, currentCity: e.target.value })} />
              </Field>
            </div>
            <Button variant="primary" className="mt-4" onClick={() => save({ name: p.name, dob: p.dob, phone: p.phone, currentCity: p.currentCity }, 'Personal details saved')}>
              <Check size={15} /> Save changes
            </Button>
          </Section>

          <Section id="visibility">
            <div className="flex items-center justify-between py-3.5">
              <div>
                <div className="text-[13px] font-semibold">Open to opportunities</div>
                <div className="text-xs text-ink-tertiary mt-1 max-w-105">
                  When off, your profile is marked "not actively looking" — Mzobs won't consider you for new requirement shortlists.
                </div>
              </div>
              <Switch
                on={profile.openToOpportunities !== false}
                onChange={(on) => save({ openToOpportunities: on }, on ? "You're marked open to opportunities" : 'Marked as not actively looking')}
              />
            </div>
            <div className="flex items-center justify-between py-3.5 border-t border-border">
              <div>
                <div className="text-[13px] font-semibold">Job alerts</div>
                <div className="text-xs text-ink-tertiary mt-1 max-w-105">Get notified when a new opening matches your profile.</div>
              </div>
              <Switch on={profile.jobAlertsEnabled !== false} onChange={(on) => save({ jobAlertsEnabled: on }, 'Job alert preference saved')} />
            </div>
            <div className="flex items-start gap-2.5 mt-4 pt-4 border-t border-border">
              <EyeOff size={14} className="text-ink-tertiary mt-0.5 shrink-0" />
              <p className="text-[12.5px] text-ink-secondary">
                Your contact details and resume are never shown in job search — only Mzobs staff see them, and only the employer you're shortlisted to ever
                receives your resume.
              </p>
            </div>
          </Section>
        </div>
      </StaggerItem>
    </StaggerGroup>
  )
}
