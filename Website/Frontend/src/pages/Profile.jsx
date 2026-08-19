import { useState } from 'react'
import { Edit, Plus, ShieldCheck, Mail, Phone, Briefcase, BadgeCheck, FileText, Download, Link as LinkIcon, X } from 'lucide-react'
import { FaLinkedin, FaGithub } from 'react-icons/fa6'
import Card from '../components/ui/Card'
import Badge from '../components/ui/Badge'
import Ring from '../components/ui/Ring'
import Button from '../components/ui/Button'
import Avatar from '../components/ui/Avatar'
import { Tabs } from '../components/ui/Tabs'
import { Field, Input } from '../components/ui/Field'
import EmptyState from '../components/ui/EmptyState'
import { StaggerGroup, StaggerItem } from '../components/ui/Stagger'
import { PageSkeleton } from '../components/ui/Skeleton'
import ErrorState from '../components/ui/ErrorState'
import { useApp } from '../context/AppContext'
import { useProfileQuery, useUpdateProfileMutation } from '../hooks/useProfile'
import { FILE_BASE_URL } from '../lib/config'

const TAB_LABELS = ['Personal', 'Education', 'Experience', 'Projects', 'Skills', 'Resume', 'Certificates', 'Portfolio', 'Social Links']

function initialsOf(name = '') {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return ''
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

export default function Profile() {
  const app = useApp()
  const [tab, setTab] = useState(0)
  const { data: profile, isLoading, isError, refetch } = useProfileQuery()
  const updateProfile = useUpdateProfileMutation()

  const [personal, setPersonal] = useState(null)
  const [newEducation, setNewEducation] = useState({ degree: '', institute: '', year: '' })
  const [newWork, setNewWork] = useState({ company: '', role: '', duration: '' })
  const [newProject, setNewProject] = useState({ name: '', description: '' })
  const [newSkill, setNewSkill] = useState('')
  const [social, setSocial] = useState(null)
  const [portfolio, setPortfolio] = useState(null)

  if (isLoading) return <PageSkeleton />
  if (isError) return <ErrorState onRetry={refetch} />

  const p = personal ?? { name: profile.name, dob: profile.dob, phone: profile.phone, currentCity: profile.currentCity, gender: profile.gender }

  function save(patch, message = 'Saved') {
    updateProfile.mutate(patch, {
      onSuccess: () => app.addToast('success', message),
      onError: (err) => app.addToast('error', err.response?.data?.message ?? 'Could not save. Please try again.'),
    })
  }

  return (
    <StaggerGroup>
      <StaggerItem>
        <Card pad className="mb-4">
          <div className="flex justify-between flex-wrap gap-4">
            <div className="flex gap-4">
              <Avatar initials={initialsOf(profile.name)} size="lg" />
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-bold tracking-tight">{profile.name}</h1>
                  {profile.resume?.status === 'verified' && (
                    <Badge tone="green" icon={<ShieldCheck size={12} />}>
                      Verified
                    </Badge>
                  )}
                </div>
                <div className="text-sm text-ink-secondary mt-1">
                  {profile.preferredRole || 'No preferred role set'} · {profile.currentCity || 'Location not set'}
                </div>
                <div className="flex items-center gap-2 mt-2.5">
                  <Mail size={13} className="text-ink-tertiary" />
                  <span className="text-xs text-ink-tertiary">{profile.email}</span>
                  {profile.phone && (
                    <>
                      <span className="text-xs text-ink-tertiary">·</span>
                      <Phone size={13} className="text-ink-tertiary" />
                      <span className="text-xs text-ink-tertiary">{profile.phone}</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </Card>
      </StaggerItem>

      <StaggerItem>
        <Card>
          <Tabs items={TAB_LABELS} active={tab} onChange={setTab} className="px-5" />
          <div className="p-[22px]">
            {tab === 0 && (
              <>
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
                  <Edit size={15} /> Save changes
                </Button>
              </>
            )}

            {tab === 1 && (
              <>
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
              </>
            )}

            {tab === 2 &&
              ((profile.workHistory ?? []).length === 0 ? (
                <>
                  <EmptyState icon={Briefcase} title="No work experience added yet" body="Add internships or jobs to strengthen your profile." />
                  <div className="border border-dashed border-border-strong rounded-xl p-4 grid md:grid-cols-3 gap-3 mt-3">
                    <Input placeholder="Company" value={newWork.company} onChange={(e) => setNewWork({ ...newWork, company: e.target.value })} />
                    <Input placeholder="Role" value={newWork.role} onChange={(e) => setNewWork({ ...newWork, role: e.target.value })} />
                    <Input placeholder="Duration (e.g. 2023 – Present)" value={newWork.duration} onChange={(e) => setNewWork({ ...newWork, duration: e.target.value })} />
                  </div>
                  <Button
                    className="mt-3"
                    disabled={!newWork.company}
                    onClick={() => {
                      save({ workHistory: [...(profile.workHistory ?? []), newWork] }, 'Experience added')
                      setNewWork({ company: '', role: '', duration: '' })
                    }}
                  >
                    <Plus size={15} /> Add experience
                  </Button>
                </>
              ) : (
                <>
                  {profile.workHistory.map((w, i) => (
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
                  ))}
                  <div className="border border-dashed border-border-strong rounded-xl p-4 grid md:grid-cols-3 gap-3">
                    <Input placeholder="Company" value={newWork.company} onChange={(e) => setNewWork({ ...newWork, company: e.target.value })} />
                    <Input placeholder="Role" value={newWork.role} onChange={(e) => setNewWork({ ...newWork, role: e.target.value })} />
                    <Input placeholder="Duration" value={newWork.duration} onChange={(e) => setNewWork({ ...newWork, duration: e.target.value })} />
                  </div>
                  <Button
                    className="mt-3"
                    disabled={!newWork.company}
                    onClick={() => {
                      save({ workHistory: [...profile.workHistory, newWork] })
                      setNewWork({ company: '', role: '', duration: '' })
                    }}
                  >
                    <Plus size={15} /> Add experience
                  </Button>
                </>
              ))}

            {tab === 3 && (
              <>
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
                    <Input
                      placeholder="Short description"
                      value={newProject.description}
                      onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                    />
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
              </>
            )}

            {tab === 4 && (
              <>
                <div className="flex flex-wrap gap-2">
                  {(profile.skills ?? []).map((s) => (
                    <span key={s} className="flex items-center gap-1.5 text-[12.5px] font-semibold text-ink-secondary bg-surface-sunken px-3 py-1.5 rounded-md">
                      {s}
                      <X size={12} className="cursor-pointer" onClick={() => save({ skills: profile.skills.filter((x) => x !== s) })} />
                    </span>
                  ))}
                </div>
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
              </>
            )}

            {tab === 5 &&
              (profile.resume?.status && profile.resume.status !== 'none' ? (
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
              ) : (
                <EmptyState icon={FileText} title="No resume uploaded" body="Upload your resume from the Resume Center." />
              ))}

            {tab === 6 && (
              <EmptyState icon={BadgeCheck} title="No certificates added" body="Certificate uploads are coming soon." />
            )}

            {tab === 7 && (
              <>
                <Field label="Portfolio URL">
                  <div className="relative">
                    <LinkIcon size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-tertiary" />
                    <Input
                      placeholder="https://yourportfolio.com"
                      className="pl-[38px]"
                      value={portfolio ?? profile.portfolioLink ?? ''}
                      onChange={(e) => setPortfolio(e.target.value)}
                    />
                  </div>
                </Field>
                <Button variant="primary" onClick={() => save({ portfolioLink: portfolio ?? profile.portfolioLink })}>
                  Save
                </Button>
              </>
            )}

            {tab === 8 && (
              <>
                <Field label="LinkedIn">
                  <div className="relative">
                    <FaLinkedin size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-tertiary" />
                    <Input
                      className="pl-[38px]"
                      value={social?.linkedin ?? profile.linkedin ?? ''}
                      onChange={(e) => setSocial({ linkedin: e.target.value, github: social?.github ?? profile.github })}
                    />
                  </div>
                </Field>
                <Field label="GitHub">
                  <div className="relative">
                    <FaGithub size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-tertiary" />
                    <Input
                      placeholder="github.com/username"
                      className="pl-[38px]"
                      value={social?.github ?? profile.github ?? ''}
                      onChange={(e) => setSocial({ github: e.target.value, linkedin: social?.linkedin ?? profile.linkedin })}
                    />
                  </div>
                </Field>
                <Button
                  variant="primary"
                  onClick={() => save({ linkedin: social?.linkedin ?? profile.linkedin, github: social?.github ?? profile.github })}
                >
                  Save
                </Button>
              </>
            )}
          </div>
        </Card>
      </StaggerItem>
    </StaggerGroup>
  )
}
