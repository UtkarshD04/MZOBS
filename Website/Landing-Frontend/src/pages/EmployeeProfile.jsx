import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  User,
  Phone,
  Mail,
  MapPin,
  FileText,
  Sparkles,
  BadgeCheck,
  GraduationCap,
  Briefcase,
  FolderKanban,
  Target,
  Link as LinkIcon,
  Download,
  Loader2,
  Pencil,
  Plus,
  Trash2,
  Check,
  X,
  UploadCloud,
  CreditCard,
  ShieldCheck,
} from 'lucide-react'
import Seo from '../components/Seo'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import FloatingElement from '../components/ui/FloatingElement'
import ParallaxImage from '../components/ui/ParallaxImage'
import { Field, Input, Select } from '../components/ui/JobsAuthField'
import { getEmployeeSession, saveEmployeeSession } from '../lib/employeeSession'
import { getEmployeeProfile, updateEmployeeProfile } from '../lib/employeeProfile'
import { resumeDownloadUrl, uploadEmployeeResume, validateResumeFileClientSide } from '../lib/employeeResume'
import { profileCompletion } from '../lib/profileCompletion'

const SECTIONS = [
  { id: 'subscription', label: 'Subscription', icon: CreditCard },
  { id: 'resume', label: 'Resume', icon: FileText },
  { id: 'headline', label: 'Resume headline', icon: Sparkles },
  { id: 'skills', label: 'Key skills', icon: BadgeCheck },
  { id: 'education', label: 'Education', icon: GraduationCap },
  { id: 'experience', label: 'Experience', icon: Briefcase },
  { id: 'projects', label: 'Projects', icon: FolderKanban },
  { id: 'career', label: 'Career profile', icon: Target },
  { id: 'links', label: 'Portfolio & social links', icon: LinkIcon },
  { id: 'personal', label: 'Personal details', icon: User },
]

const TINTS = [
  { bg: 'bg-(--jobs-teal-tint)', text: 'text-(--jobs-teal-dark)' },
  { bg: 'bg-(--jobs-blue-tint)', text: 'text-(--jobs-blue-dark)' },
  { bg: 'bg-amber-50', text: 'text-amber-700' },
  { bg: 'bg-(--jobs-gold-soft)', text: 'text-(--jobs-gold)' },
]

const WORK_MODES = ['On-site', 'Hybrid', 'Remote']
const JOB_TYPES = ['Full-time', 'Part-time', 'Contract', 'Internship']

function initialsOf(name = '') {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return '?'
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

function jumpTo(id) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

const toCSV = (arr) => (arr ?? []).join(', ')
const fromCSV = (str) =>
  String(str ?? '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)

function Section({ id, icon: Icon, label, tone = 0, editable, editing, onEdit, onCancel, children }) {
  const t = TINTS[tone % TINTS.length]
  return (
    <div
      id={id}
      className="scroll-mt-28 bg-white rounded-2xl border border-(--jobs-border) shadow-[0_1px_2px_rgba(16,42,67,0.04),0_12px_28px_-18px_rgba(16,42,67,0.14)] transition-shadow duration-300 hover:shadow-[0_1px_2px_rgba(16,42,67,0.04),0_16px_36px_-16px_rgba(16,42,67,0.2)]"
    >
      <div className="flex items-center justify-between gap-2.5 px-6 py-4 border-b border-(--jobs-border)">
        <div className="flex items-center gap-2.5">
          <span className={`w-9 h-9 rounded-xl ${t.bg} ${t.text} flex items-center justify-center shrink-0`}>
            <Icon size={17} />
          </span>
          <span className="text-[15px] font-bold text-(--jobs-navy)">{label}</span>
        </div>
        {editable && !editing && (
          <button
            type="button"
            onClick={onEdit}
            className="flex items-center gap-1.5 text-[12.5px] font-bold text-(--jobs-blue-dark) px-2.5 py-1 rounded-lg hover:bg-(--jobs-blue-tint) transition-colors"
          >
            <Pencil size={13} /> Edit
          </button>
        )}
        {editable && editing && (
          <button
            type="button"
            onClick={onCancel}
            className="flex items-center gap-1.5 text-[12.5px] font-bold text-(--jobs-ink-soft) px-2.5 py-1 rounded-lg hover:bg-(--jobs-bg-subtle) hover:text-(--jobs-navy) transition-colors"
          >
            <X size={13} /> Cancel
          </button>
        )}
      </div>
      <div className="px-6 py-5">{children}</div>
    </div>
  )
}

function Empty({ children }) {
  return <p className="text-[13px] text-(--jobs-ink-soft)">{children}</p>
}

function SaveBar({ saving, error, onSave }) {
  return (
    <div className="mt-4 pt-4 border-t border-(--jobs-border) flex items-center gap-3">
      <button
        type="button"
        onClick={onSave}
        disabled={saving}
        className="inline-flex items-center gap-1.5 h-9 px-4 rounded-lg bg-(--jobs-teal-dark) text-white text-[12.5px] font-bold hover:bg-(--jobs-navy) transition-colors disabled:opacity-50"
      >
        {saving ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />} {saving ? 'Saving...' : 'Save'}
      </button>
      {error && <p className="text-[12px] text-red-600">{error}</p>}
    </div>
  )
}

export default function EmployeeProfile() {
  const navigate = useNavigate()
  const [profile, setProfile] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const [token, setToken] = useState(null)

  const [editing, setEditing] = useState(null)
  const [draft, setDraft] = useState({})
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState('')

  const [resumeFile, setResumeFile] = useState(null)
  const [resumeError, setResumeError] = useState('')
  const [uploading, setUploading] = useState(false)

  const fileInputRef = useRef(null)

  function reload(tok) {
    return getEmployeeProfile(tok).then((p) => {
      setProfile(p)
      return p
    })
  }

  useEffect(() => {
    const session = getEmployeeSession()
    if (!session?.token) {
      navigate('/employees/signin?redirect=%2Femployees%2Fprofile')
      return
    }
    setToken(session.token)
    reload(session.token)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [navigate])

  function startEdit(id, initial) {
    setSaveError('')
    setEditing(id)
    setDraft(initial)
  }

  function cancelEdit() {
    setEditing(null)
    setDraft({})
    setSaveError('')
  }

  async function saveEdit(fields) {
    setSaving(true)
    setSaveError('')
    try {
      const updated = await updateEmployeeProfile(token, fields)
      setProfile(updated)
      // Keep this site's own nav/session name in sync if it changed.
      if (fields.name) saveEmployeeSession({ token, employee: updated })
      setEditing(null)
      setDraft({})
    } catch (err) {
      setSaveError(err.message)
    } finally {
      setSaving(false)
    }
  }

  function handleResumeChange(e) {
    const file = e.target.files?.[0] ?? null
    e.target.value = ''
    if (!file) return
    const err = validateResumeFileClientSide(file)
    if (err) {
      setResumeError(err)
      return
    }
    setResumeError('')
    setResumeFile(file)
  }

  async function handleUploadResume() {
    if (!resumeFile || !token) return
    setUploading(true)
    setResumeError('')
    try {
      await uploadEmployeeResume(token, resumeFile)
      await reload(token)
      setResumeFile(null)
    } catch (err) {
      setResumeError(err.message)
    } finally {
      setUploading(false)
    }
  }

  if (loading || error || !profile) {
    return (
      <div className="min-h-screen bg-(--jobs-bg-subtle) text-(--jobs-navy) font-sans antialiased">
        <Seo path="/employees/profile" title="My Profile — Mzobs" noindex />
        <Navbar />
        <div className="pt-32 pb-16 px-6 text-center">
          {loading && (
            <div className="flex items-center justify-center py-24 text-(--jobs-ink-soft)">
              <Loader2 size={22} className="animate-spin mr-2" /> Loading your profile...
            </div>
          )}
          {!loading && error && (
            <div className="max-w-lg mx-auto py-24">
              <p className="text-[14px] font-semibold text-red-600">{error}</p>
              <Link to="/employees/signin?redirect=%2Femployees%2Fprofile" className="inline-block mt-4 text-[13.5px] font-bold text-(--jobs-blue-dark) hover:underline">
                Sign in again
              </Link>
            </div>
          )}
        </div>
        <Footer />
      </div>
    )
  }

  const { percent, missing } = profileCompletion(profile)
  const isPaid = profile.subscription?.status === 'paid'

  return (
    <div className="min-h-screen bg-(--jobs-bg-subtle) text-(--jobs-navy) font-sans antialiased selection:bg-blue-200">
      <Seo path="/employees/profile" title="My Profile — Mzobs" noindex />
      <Navbar />

      <section className="pt-28 pb-16 px-6 md:px-10">
        <div className="max-w-6xl mx-auto">
          {/* Header card */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-(--jobs-navy-deep) to-(--jobs-navy) text-white p-6 sm:p-8 mb-4 flex flex-col sm:flex-row sm:items-center gap-5">
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <ParallaxImage
                src="/images/new_images/employee_goal.jpg"
                alt=""
                offset={30}
                className="w-full h-full object-cover opacity-[0.14]"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-(--jobs-navy-deep) via-(--jobs-navy-deep)/80 to-(--jobs-navy)/70 pointer-events-none" />
            <FloatingElement duration={9} distance={20} className="absolute -top-12 -right-12 w-56 h-56 bg-(--jobs-teal)/20 rounded-full blur-3xl pointer-events-none" />
            <FloatingElement duration={11} distance={14} className="absolute -bottom-14 left-1/3 w-48 h-48 bg-(--jobs-gold)/10 rounded-full blur-3xl pointer-events-none" />

            <div
              className="relative z-10 w-[72px] h-[72px] rounded-full p-[3px] shrink-0"
              style={{ background: `conic-gradient(var(--jobs-teal) ${percent * 3.6}deg, rgba(255,255,255,0.18) 0deg)` }}
              title={`Profile ${percent}% complete`}
            >
              <div className="w-full h-full rounded-full bg-(--jobs-navy) flex items-center justify-center text-lg font-black">
                {initialsOf(profile.name)}
              </div>
            </div>
            <div className="relative z-10 flex-1 min-w-0">
              <h1 className="text-2xl font-black tracking-tight">{profile.name}</h1>
              <p className="text-[13.5px] text-white/75 mt-1">
                {profile.resumeHeadline || 'Add a resume headline so employers know what you do'}
              </p>
              <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5 mt-3 text-[12.5px] text-white/70">
                {profile.phone && (
                  <span className="flex items-center gap-1.5">
                    <Phone size={13} /> +91 {profile.phone}
                  </span>
                )}
                {profile.email && (
                  <span className="flex items-center gap-1.5">
                    <Mail size={13} /> {profile.email}
                  </span>
                )}
                {profile.currentCity && (
                  <span className="flex items-center gap-1.5">
                    <MapPin size={13} /> {profile.currentCity}
                    {profile.state ? `, ${profile.state}` : ''}
                  </span>
                )}
              </div>
            </div>
            <span
              className={`relative z-10 shrink-0 self-start sm:self-center px-3 py-1.5 rounded-full text-[11.5px] font-bold ${
                isPaid ? 'bg-(--jobs-teal)/20 text-(--jobs-teal)' : 'bg-white/15 text-white/80'
              }`}
            >
              {isPaid ? 'Premium active' : 'Free account'}
            </span>
          </div>

          {/* Profile completion */}
          <div className="rounded-2xl bg-white border border-(--jobs-border) shadow-[0_1px_2px_rgba(16,42,67,0.04),0_12px_28px_-18px_rgba(16,42,67,0.14)] p-5 mb-6">
            <div className="flex items-center justify-between mb-2.5">
              <span className="text-[13.5px] font-bold text-(--jobs-navy)">
                {percent === 100 ? 'Your profile is complete 🎉' : `Profile is ${percent}% complete`}
              </span>
              {missing.length > 0 && (
                <span className="text-[12px] text-(--jobs-ink-soft)">
                  {missing.length} step{missing.length === 1 ? '' : 's'} left
                </span>
              )}
            </div>
            <div className="h-2.5 rounded-full bg-(--jobs-bg-subtle) overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-(--jobs-teal) to-(--jobs-teal-dark) transition-[width] duration-700 ease-out"
                style={{ width: `${percent}%` }}
              />
            </div>
            {missing.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3.5">
                {missing.map((m) => (
                  <button
                    key={m.key}
                    onClick={() => jumpTo(m.section)}
                    className="px-2.5 py-1 rounded-full bg-(--jobs-blue-tint) text-(--jobs-blue-dark) text-[11.5px] font-bold hover:bg-(--jobs-blue)/20 transition-colors"
                  >
                    + {m.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="grid lg:grid-cols-[220px_minmax(0,1fr)] gap-6 items-start">
            {/* Jump-to sidebar */}
            <nav className="hidden lg:block sticky top-24 space-y-1 bg-white rounded-2xl border border-(--jobs-border) p-2.5">
              {SECTIONS.map((s, i) => {
                const t = TINTS[i % TINTS.length]
                return (
                  <button
                    key={s.id}
                    onClick={() => jumpTo(s.id)}
                    className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-[13px] font-semibold text-(--jobs-ink-soft) hover:text-(--jobs-navy) hover:bg-(--jobs-bg-subtle) transition-colors text-left group"
                  >
                    <span className={`w-7 h-7 rounded-lg ${t.bg} ${t.text} flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform`}>
                      <s.icon size={13} />
                    </span>
                    {s.label}
                  </button>
                )
              })}
            </nav>

            {/* Sections */}
            <div className="space-y-5">
              {/* Subscription */}
              <div id="subscription" className="scroll-mt-28 relative overflow-hidden rounded-2xl bg-gradient-to-br from-(--jobs-navy-deep) to-(--jobs-navy) text-white p-6 sm:p-7">
                <div className="absolute -top-8 -right-8 w-40 h-40 bg-(--jobs-teal)/20 rounded-full blur-3xl pointer-events-none" />
                <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                      {isPaid ? <ShieldCheck size={19} className="text-(--jobs-teal)" /> : <CreditCard size={19} className="text-white/80" />}
                    </div>
                    <div>
                      <p className="text-[14.5px] font-black">{isPaid ? 'Placement Support Programme — active' : `Unlock premium for ₹${profile.subscription?.amount ?? 99}`}</p>
                      <p className="text-[12.5px] text-white/65 mt-1 max-w-md leading-relaxed">
                        {isPaid
                          ? `${profile.subscription?.paidOn ? `Paid on ${new Date(profile.subscription.paidOn).toLocaleDateString('en-IN')} · ` : ''}One-time payment · valid for life`
                          : 'Resume verification, mock interviews and priority visibility to verified employers — one-time fee, no renewal.'}
                      </p>
                    </div>
                  </div>
                  <Link
                    to="/employees/subscription"
                    className="shrink-0 inline-flex items-center justify-center gap-2 h-10 px-5 rounded-full bg-(--jobs-teal) text-(--jobs-navy-deep) text-[13px] font-bold hover:bg-white transition-colors"
                  >
                    {isPaid ? 'View subscription' : 'Unlock now'}
                  </Link>
                </div>
              </div>

              {/* Resume */}
              <Section id="resume" icon={FileText} label="Resume" tone={0}>
                {profile.resume?.file ? (
                  <div className="flex items-center justify-between gap-3 mb-4">
                    <div className="flex items-center gap-3 min-w-0">
                      <FileText size={18} className="text-(--jobs-blue-dark) shrink-0" />
                      <div className="min-w-0">
                        <span className="text-[13.5px] font-semibold truncate block">{profile.resume.file}</span>
                        <span className="text-[11.5px] text-(--jobs-ink-soft) capitalize">{profile.resume.status}</span>
                      </div>
                    </div>
                    {profile.resume.url && (
                      <a
                        href={resumeDownloadUrl(profile.resume.url)}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-1.5 text-[12.5px] font-bold text-(--jobs-blue-dark) hover:underline shrink-0"
                      >
                        <Download size={14} /> Download
                      </a>
                    )}
                  </div>
                ) : (
                  <Empty>No resume uploaded yet.</Empty>
                )}

                <div className="mt-2">
                  {resumeFile ? (
                    <div className="flex items-center gap-3 px-4 py-3 rounded-xl border border-(--jobs-border) bg-(--jobs-bg-subtle)">
                      <FileText size={16} className="text-(--jobs-blue-dark) shrink-0" />
                      <span className="flex-1 min-w-0 text-[12.5px] font-semibold truncate">{resumeFile.name}</span>
                      <button type="button" onClick={() => setResumeFile(null)} className="text-(--jobs-ink-soft) hover:text-red-600 shrink-0">
                        <Trash2 size={15} />
                      </button>
                    </div>
                  ) : (
                    <label className="flex items-center gap-3 px-4 py-3.5 rounded-xl border-2 border-dashed border-(--jobs-border) bg-(--jobs-bg-subtle) cursor-pointer hover:border-(--jobs-blue)/50 transition-colors">
                      <UploadCloud size={18} className="text-(--jobs-ink-soft) shrink-0" />
                      <div>
                        <p className="text-[12.5px] font-semibold">{profile.resume?.file ? 'Upload a new version' : 'Click to upload your CV'}</p>
                        <p className="text-[11px] text-(--jobs-ink-soft)">PDF, DOC or DOCX — up to 5MB</p>
                      </div>
                      <input ref={fileInputRef} type="file" accept=".pdf,.doc,.docx" className="sr-only" onChange={handleResumeChange} />
                    </label>
                  )}
                  {resumeError && <p className="text-xs text-red-600 mt-2">{resumeError}</p>}
                  {resumeFile && (
                    <button
                      type="button"
                      onClick={handleUploadResume}
                      disabled={uploading}
                      className="mt-3 inline-flex items-center gap-1.5 h-9 px-4 rounded-lg bg-(--jobs-teal-dark) text-white text-[12.5px] font-bold hover:bg-(--jobs-navy) transition-colors disabled:opacity-50"
                    >
                      {uploading ? <Loader2 size={14} className="animate-spin" /> : <UploadCloud size={14} />} {uploading ? 'Uploading...' : 'Upload CV'}
                    </button>
                  )}
                </div>
              </Section>

              {/* Resume headline */}
              <Section
                id="headline"
                icon={Sparkles}
                label="Resume headline"
                tone={1}
                editable
                editing={editing === 'headline'}
                onEdit={() => startEdit('headline', { resumeHeadline: profile.resumeHeadline ?? '' })}
                onCancel={cancelEdit}
              >
                {editing === 'headline' ? (
                  <>
                    <Field label="Resume headline" hint="A one-line summary employers see first.">
                      <Input
                        value={draft.resumeHeadline}
                        onChange={(e) => setDraft({ resumeHeadline: e.target.value })}
                        placeholder="e.g. Frontend Developer with 2 years in React"
                      />
                    </Field>
                    <SaveBar saving={saving} error={saveError} onSave={() => saveEdit({ resumeHeadline: draft.resumeHeadline })} />
                  </>
                ) : profile.resumeHeadline ? (
                  <p className="text-[13.5px] leading-relaxed">{profile.resumeHeadline}</p>
                ) : (
                  <Empty>No headline added yet.</Empty>
                )}
              </Section>

              {/* Skills */}
              <Section
                id="skills"
                icon={BadgeCheck}
                label="Key skills"
                tone={2}
                editable
                editing={editing === 'skills'}
                onEdit={() => startEdit('skills', { skills: toCSV(profile.skills) })}
                onCancel={cancelEdit}
              >
                {editing === 'skills' ? (
                  <>
                    <Field label="Key skills" hint="Comma-separated, e.g. React, Node.js, SQL">
                      <Input value={draft.skills} onChange={(e) => setDraft({ skills: e.target.value })} placeholder="React, Node.js, SQL" />
                    </Field>
                    <SaveBar saving={saving} error={saveError} onSave={() => saveEdit({ skills: fromCSV(draft.skills) })} />
                  </>
                ) : profile.skills?.length ? (
                  <div className="flex flex-wrap gap-2">
                    {profile.skills.map((skill) => (
                      <span key={skill} className="px-3 py-1.5 rounded-full bg-(--jobs-teal-tint) text-(--jobs-teal-dark) text-[12.5px] font-bold">
                        {skill}
                      </span>
                    ))}
                  </div>
                ) : (
                  <Empty>No skills added yet.</Empty>
                )}
              </Section>

              {/* Education */}
              <Section
                id="education"
                icon={GraduationCap}
                label="Education"
                tone={3}
                editable
                editing={editing === 'education'}
                onEdit={() => startEdit('education', { education: profile.education?.length ? [...profile.education] : [{ degree: '', institute: '', year: '' }] })}
                onCancel={cancelEdit}
              >
                {editing === 'education' ? (
                  <>
                    <div className="space-y-3">
                      {draft.education.map((edu, i) => (
                        <div key={i} className="grid sm:grid-cols-[1fr_1fr_100px_36px] gap-2 items-start">
                          <Input
                            value={edu.degree}
                            onChange={(e) => setDraft({ education: draft.education.map((x, idx) => (idx === i ? { ...x, degree: e.target.value } : x)) })}
                            placeholder="Degree"
                          />
                          <Input
                            value={edu.institute}
                            onChange={(e) => setDraft({ education: draft.education.map((x, idx) => (idx === i ? { ...x, institute: e.target.value } : x)) })}
                            placeholder="Institute"
                          />
                          <Input
                            value={edu.year}
                            onChange={(e) => setDraft({ education: draft.education.map((x, idx) => (idx === i ? { ...x, year: e.target.value } : x)) })}
                            placeholder="Year"
                          />
                          <button
                            type="button"
                            onClick={() => setDraft({ education: draft.education.filter((_, idx) => idx !== i) })}
                            className="h-11 flex items-center justify-center text-(--jobs-ink-soft) hover:text-red-600"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      ))}
                    </div>
                    <button
                      type="button"
                      onClick={() => setDraft({ education: [...draft.education, { degree: '', institute: '', year: '' }] })}
                      className="mt-1 flex items-center gap-1.5 text-[12.5px] font-bold text-(--jobs-blue-dark) hover:underline"
                    >
                      <Plus size={13} /> Add another
                    </button>
                    <SaveBar
                      saving={saving}
                      error={saveError}
                      onSave={() => saveEdit({ education: draft.education.filter((e) => e.degree.trim() || e.institute.trim() || e.year.trim()) })}
                    />
                  </>
                ) : profile.education?.length ? (
                  <ul className="space-y-3">
                    {profile.education.map((edu, i) => (
                      <li key={i} className="text-[13.5px]">
                        <span className="font-bold">{edu.degree}</span>
                        {edu.institute && <span className="text-(--jobs-ink-soft)"> — {edu.institute}</span>}
                        {edu.year && <span className="text-(--jobs-ink-soft)"> · {edu.year}</span>}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <Empty>No education added yet.</Empty>
                )}
              </Section>

              {/* Experience */}
              <Section
                id="experience"
                icon={Briefcase}
                label="Experience"
                tone={0}
                editable
                editing={editing === 'experience'}
                onEdit={() =>
                  startEdit('experience', {
                    experience: profile.experience ?? 'fresher',
                    currentCompany: profile.currentCompany ?? '',
                    designation: profile.designation ?? '',
                    experienceYears: profile.experienceYears ?? '',
                    workHistory: profile.workHistory?.length ? [...profile.workHistory] : [],
                  })
                }
                onCancel={cancelEdit}
              >
                {editing === 'experience' ? (
                  <>
                    <Field label="I am a">
                      <Select value={draft.experience} onChange={(e) => setDraft({ ...draft, experience: e.target.value })}>
                        <option value="fresher">Fresher</option>
                        <option value="experienced">Experienced</option>
                      </Select>
                    </Field>
                    {draft.experience === 'experienced' && (
                      <div className="grid sm:grid-cols-3 gap-2">
                        <Field label="Current company">
                          <Input value={draft.currentCompany} onChange={(e) => setDraft({ ...draft, currentCompany: e.target.value })} />
                        </Field>
                        <Field label="Designation">
                          <Input value={draft.designation} onChange={(e) => setDraft({ ...draft, designation: e.target.value })} />
                        </Field>
                        <Field label="Total experience (yrs)">
                          <Input type="number" min="0" value={draft.experienceYears} onChange={(e) => setDraft({ ...draft, experienceYears: e.target.value })} />
                        </Field>
                      </div>
                    )}

                    <p className="text-[12.5px] font-bold text-(--jobs-navy) mt-2 mb-2">Previous roles</p>
                    <div className="space-y-3">
                      {draft.workHistory.map((job, i) => (
                        <div key={i} className="grid sm:grid-cols-[1fr_1fr_1fr_36px] gap-2 items-start">
                          <Input
                            value={job.company}
                            onChange={(e) => setDraft({ ...draft, workHistory: draft.workHistory.map((x, idx) => (idx === i ? { ...x, company: e.target.value } : x)) })}
                            placeholder="Company"
                          />
                          <Input
                            value={job.role}
                            onChange={(e) => setDraft({ ...draft, workHistory: draft.workHistory.map((x, idx) => (idx === i ? { ...x, role: e.target.value } : x)) })}
                            placeholder="Role"
                          />
                          <Input
                            value={job.duration}
                            onChange={(e) => setDraft({ ...draft, workHistory: draft.workHistory.map((x, idx) => (idx === i ? { ...x, duration: e.target.value } : x)) })}
                            placeholder="Duration"
                          />
                          <button
                            type="button"
                            onClick={() => setDraft({ ...draft, workHistory: draft.workHistory.filter((_, idx) => idx !== i) })}
                            className="h-11 flex items-center justify-center text-(--jobs-ink-soft) hover:text-red-600"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      ))}
                    </div>
                    <button
                      type="button"
                      onClick={() => setDraft({ ...draft, workHistory: [...draft.workHistory, { company: '', role: '', duration: '' }] })}
                      className="mt-1 flex items-center gap-1.5 text-[12.5px] font-bold text-(--jobs-blue-dark) hover:underline"
                    >
                      <Plus size={13} /> Add another
                    </button>
                    <SaveBar
                      saving={saving}
                      error={saveError}
                      onSave={() =>
                        saveEdit({
                          experience: draft.experience,
                          currentCompany: draft.currentCompany,
                          designation: draft.designation,
                          experienceYears: draft.experienceYears === '' ? 0 : Number(draft.experienceYears),
                          workHistory: draft.workHistory.filter((j) => j.company.trim() || j.role.trim() || j.duration.trim()),
                        })
                      }
                    />
                  </>
                ) : (
                  <>
                    {profile.experience === 'experienced' && (profile.currentCompany || profile.designation) && (
                      <div className="text-[13.5px] mb-3 pb-3 border-b border-(--jobs-border)">
                        <span className="font-bold">{profile.designation || 'Current role'}</span>
                        {profile.currentCompany && <span className="text-(--jobs-ink-soft)"> at {profile.currentCompany}</span>}
                        {profile.experienceYears ? <span className="text-(--jobs-ink-soft)"> · {profile.experienceYears} yrs total</span> : null}
                      </div>
                    )}
                    {profile.workHistory?.length ? (
                      <ul className="space-y-3">
                        {profile.workHistory.map((job, i) => (
                          <li key={i} className="text-[13.5px]">
                            <span className="font-bold">{job.role}</span>
                            {job.company && <span className="text-(--jobs-ink-soft)"> at {job.company}</span>}
                            {job.duration && <span className="text-(--jobs-ink-soft)"> · {job.duration}</span>}
                          </li>
                        ))}
                      </ul>
                    ) : profile.experience !== 'experienced' ? (
                      <Empty>Fresher — no work history added.</Empty>
                    ) : null}
                  </>
                )}
              </Section>

              {/* Projects */}
              <Section
                id="projects"
                icon={FolderKanban}
                label="Projects"
                tone={1}
                editable
                editing={editing === 'projects'}
                onEdit={() =>
                  startEdit('projects', {
                    projects: profile.projects?.length ? profile.projects.map((p) => ({ ...p, tech: toCSV(p.tech) })) : [],
                  })
                }
                onCancel={cancelEdit}
              >
                {editing === 'projects' ? (
                  <>
                    <div className="space-y-4">
                      {draft.projects.map((p, i) => (
                        <div key={i} className="p-3 rounded-xl border border-(--jobs-border) space-y-2">
                          <div className="flex items-center gap-2">
                            <Input
                              value={p.name}
                              onChange={(e) => setDraft({ projects: draft.projects.map((x, idx) => (idx === i ? { ...x, name: e.target.value } : x)) })}
                              placeholder="Project name"
                            />
                            <button
                              type="button"
                              onClick={() => setDraft({ projects: draft.projects.filter((_, idx) => idx !== i) })}
                              className="shrink-0 h-11 w-9 flex items-center justify-center text-(--jobs-ink-soft) hover:text-red-600"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                          <Input
                            value={p.description}
                            onChange={(e) => setDraft({ projects: draft.projects.map((x, idx) => (idx === i ? { ...x, description: e.target.value } : x)) })}
                            placeholder="Short description"
                          />
                          <Input
                            value={p.tech}
                            onChange={(e) => setDraft({ projects: draft.projects.map((x, idx) => (idx === i ? { ...x, tech: e.target.value } : x)) })}
                            placeholder="Tech used, comma-separated"
                          />
                        </div>
                      ))}
                    </div>
                    <button
                      type="button"
                      onClick={() => setDraft({ projects: [...draft.projects, { name: '', description: '', tech: '' }] })}
                      className="mt-2 flex items-center gap-1.5 text-[12.5px] font-bold text-(--jobs-blue-dark) hover:underline"
                    >
                      <Plus size={13} /> Add another
                    </button>
                    <SaveBar
                      saving={saving}
                      error={saveError}
                      onSave={() =>
                        saveEdit({
                          projects: draft.projects.filter((p) => p.name.trim()).map((p) => ({ ...p, tech: fromCSV(p.tech) })),
                        })
                      }
                    />
                  </>
                ) : profile.projects?.length ? (
                  <ul className="space-y-4">
                    {profile.projects.map((p, i) => (
                      <li key={i}>
                        <p className="text-[13.5px] font-bold">{p.name}</p>
                        {p.description && <p className="text-[13px] text-(--jobs-ink-soft) mt-0.5 leading-relaxed">{p.description}</p>}
                        {p.tech?.length ? <p className="text-[12px] text-(--jobs-ink-soft) mt-1">{p.tech.join(', ')}</p> : null}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <Empty>No projects added yet.</Empty>
                )}
              </Section>

              {/* Career profile */}
              <Section
                id="career"
                icon={Target}
                label="Career profile"
                tone={2}
                editable
                editing={editing === 'career'}
                onEdit={() =>
                  startEdit('career', {
                    preferredRole: profile.preferredRole ?? '',
                    expectedSalaryMin: profile.expectedSalaryMin ?? '',
                    expectedSalaryMax: profile.expectedSalaryMax ?? '',
                    preferredLocations: toCSV(profile.preferredLocations),
                    workModePreference: profile.workModePreference ?? [],
                    jobTypePreference: profile.jobTypePreference ?? [],
                    noticePeriod: profile.noticePeriod ?? '',
                  })
                }
                onCancel={cancelEdit}
              >
                {editing === 'career' ? (
                  <>
                    <div className="grid sm:grid-cols-2 gap-x-3">
                      <Field label="Preferred role">
                        <Input value={draft.preferredRole} onChange={(e) => setDraft({ ...draft, preferredRole: e.target.value })} />
                      </Field>
                      <Field label="Notice period">
                        <Input value={draft.noticePeriod} onChange={(e) => setDraft({ ...draft, noticePeriod: e.target.value })} placeholder="e.g. Immediate, 30 days" />
                      </Field>
                      <Field label="Expected salary — min">
                        <Input type="number" min="0" value={draft.expectedSalaryMin} onChange={(e) => setDraft({ ...draft, expectedSalaryMin: e.target.value })} />
                      </Field>
                      <Field label="Expected salary — max">
                        <Input type="number" min="0" value={draft.expectedSalaryMax} onChange={(e) => setDraft({ ...draft, expectedSalaryMax: e.target.value })} />
                      </Field>
                    </div>
                    <Field label="Preferred locations" hint="Comma-separated, e.g. Lucknow, Remote">
                      <Input value={draft.preferredLocations} onChange={(e) => setDraft({ ...draft, preferredLocations: e.target.value })} />
                    </Field>
                    <Field label="Work mode">
                      <div className="flex flex-wrap gap-2">
                        {WORK_MODES.map((mode) => (
                          <button
                            key={mode}
                            type="button"
                            onClick={() =>
                              setDraft({
                                ...draft,
                                workModePreference: draft.workModePreference.includes(mode)
                                  ? draft.workModePreference.filter((m) => m !== mode)
                                  : [...draft.workModePreference, mode],
                              })
                            }
                            className={`px-3 py-1.5 rounded-full text-[12px] font-bold border transition-colors ${
                              draft.workModePreference.includes(mode)
                                ? 'bg-(--jobs-teal-dark) text-white border-(--jobs-teal-dark)'
                                : 'bg-white text-(--jobs-navy) border-(--jobs-border)'
                            }`}
                          >
                            {mode}
                          </button>
                        ))}
                      </div>
                    </Field>
                    <Field label="Job type">
                      <div className="flex flex-wrap gap-2">
                        {JOB_TYPES.map((type) => (
                          <button
                            key={type}
                            type="button"
                            onClick={() =>
                              setDraft({
                                ...draft,
                                jobTypePreference: draft.jobTypePreference.includes(type)
                                  ? draft.jobTypePreference.filter((t) => t !== type)
                                  : [...draft.jobTypePreference, type],
                              })
                            }
                            className={`px-3 py-1.5 rounded-full text-[12px] font-bold border transition-colors ${
                              draft.jobTypePreference.includes(type)
                                ? 'bg-(--jobs-teal-dark) text-white border-(--jobs-teal-dark)'
                                : 'bg-white text-(--jobs-navy) border-(--jobs-border)'
                            }`}
                          >
                            {type}
                          </button>
                        ))}
                      </div>
                    </Field>
                    <SaveBar
                      saving={saving}
                      error={saveError}
                      onSave={() =>
                        saveEdit({
                          preferredRole: draft.preferredRole,
                          expectedSalaryMin: draft.expectedSalaryMin === '' ? null : Number(draft.expectedSalaryMin),
                          expectedSalaryMax: draft.expectedSalaryMax === '' ? null : Number(draft.expectedSalaryMax),
                          preferredLocations: fromCSV(draft.preferredLocations),
                          workModePreference: draft.workModePreference,
                          jobTypePreference: draft.jobTypePreference,
                          noticePeriod: draft.noticePeriod,
                        })
                      }
                    />
                  </>
                ) : (
                  <dl className="grid sm:grid-cols-2 gap-x-6 gap-y-3 text-[13px]">
                    <div>
                      <dt className="text-(--jobs-ink-soft)">Preferred role</dt>
                      <dd className="font-semibold mt-0.5">{profile.preferredRole || '—'}</dd>
                    </div>
                    <div>
                      <dt className="text-(--jobs-ink-soft)">Expected salary</dt>
                      <dd className="font-semibold mt-0.5">
                        {profile.expectedSalaryMin || profile.expectedSalaryMax
                          ? `₹${profile.expectedSalaryMin ?? '—'} – ₹${profile.expectedSalaryMax ?? '—'}`
                          : '—'}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-(--jobs-ink-soft)">Preferred locations</dt>
                      <dd className="font-semibold mt-0.5">{profile.preferredLocations?.length ? profile.preferredLocations.join(', ') : '—'}</dd>
                    </div>
                    <div>
                      <dt className="text-(--jobs-ink-soft)">Work mode</dt>
                      <dd className="font-semibold mt-0.5">{profile.workModePreference?.length ? profile.workModePreference.join(', ') : '—'}</dd>
                    </div>
                    <div>
                      <dt className="text-(--jobs-ink-soft)">Job type</dt>
                      <dd className="font-semibold mt-0.5">{profile.jobTypePreference?.length ? profile.jobTypePreference.join(', ') : '—'}</dd>
                    </div>
                    <div>
                      <dt className="text-(--jobs-ink-soft)">Notice period</dt>
                      <dd className="font-semibold mt-0.5">{profile.noticePeriod || '—'}</dd>
                    </div>
                  </dl>
                )}
              </Section>

              {/* Links */}
              <Section
                id="links"
                icon={LinkIcon}
                label="Portfolio & social links"
                tone={3}
                editable
                editing={editing === 'links'}
                onEdit={() =>
                  startEdit('links', {
                    portfolioLink: profile.portfolioLink ?? '',
                    linkedin: profile.linkedin ?? '',
                    github: profile.github ?? '',
                  })
                }
                onCancel={cancelEdit}
              >
                {editing === 'links' ? (
                  <>
                    <Field label="Portfolio link">
                      <Input value={draft.portfolioLink} onChange={(e) => setDraft({ ...draft, portfolioLink: e.target.value })} placeholder="https://..." />
                    </Field>
                    <Field label="LinkedIn">
                      <Input value={draft.linkedin} onChange={(e) => setDraft({ ...draft, linkedin: e.target.value })} placeholder="https://linkedin.com/in/..." />
                    </Field>
                    <Field label="GitHub">
                      <Input value={draft.github} onChange={(e) => setDraft({ ...draft, github: e.target.value })} placeholder="https://github.com/..." />
                    </Field>
                    <SaveBar saving={saving} error={saveError} onSave={() => saveEdit(draft)} />
                  </>
                ) : profile.portfolioLink || profile.linkedin || profile.github ? (
                  <ul className="space-y-2 text-[13.5px]">
                    {profile.portfolioLink && (
                      <li>
                        <a href={profile.portfolioLink} target="_blank" rel="noreferrer" className="text-(--jobs-blue-dark) font-semibold hover:underline">
                          Portfolio
                        </a>
                      </li>
                    )}
                    {profile.linkedin && (
                      <li>
                        <a href={profile.linkedin} target="_blank" rel="noreferrer" className="text-(--jobs-blue-dark) font-semibold hover:underline">
                          LinkedIn
                        </a>
                      </li>
                    )}
                    {profile.github && (
                      <li>
                        <a href={profile.github} target="_blank" rel="noreferrer" className="text-(--jobs-blue-dark) font-semibold hover:underline">
                          GitHub
                        </a>
                      </li>
                    )}
                  </ul>
                ) : (
                  <Empty>No links added yet.</Empty>
                )}
              </Section>

              {/* Personal details */}
              <Section
                id="personal"
                icon={User}
                label="Personal details"
                tone={0}
                editable
                editing={editing === 'personal'}
                onEdit={() =>
                  startEdit('personal', {
                    name: profile.name ?? '',
                    dob: profile.dob ?? '',
                    gender: profile.gender ?? '',
                    maritalStatus: profile.maritalStatus ?? '',
                    currentCity: profile.currentCity ?? '',
                    state: profile.state ?? '',
                    pincode: profile.pincode ?? '',
                    currentCtc: profile.currentCtc ?? '',
                    relocationOk: !!profile.relocationOk,
                  })
                }
                onCancel={cancelEdit}
              >
                {editing === 'personal' ? (
                  <>
                    <div className="grid sm:grid-cols-2 gap-x-3">
                      <Field label="Full name">
                        <Input value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} />
                      </Field>
                      <Field label="Date of birth">
                        <Input type="date" value={draft.dob} onChange={(e) => setDraft({ ...draft, dob: e.target.value })} />
                      </Field>
                      <Field label="Gender">
                        <Select value={draft.gender} onChange={(e) => setDraft({ ...draft, gender: e.target.value })}>
                          <option value="">Select</option>
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Other">Other</option>
                        </Select>
                      </Field>
                      <Field label="Marital status">
                        <Select value={draft.maritalStatus} onChange={(e) => setDraft({ ...draft, maritalStatus: e.target.value })}>
                          <option value="">Select</option>
                          <option value="Single">Single</option>
                          <option value="Married">Married</option>
                        </Select>
                      </Field>
                      <Field label="Current city">
                        <Input value={draft.currentCity} onChange={(e) => setDraft({ ...draft, currentCity: e.target.value })} />
                      </Field>
                      <Field label="State">
                        <Input value={draft.state} onChange={(e) => setDraft({ ...draft, state: e.target.value })} />
                      </Field>
                      <Field label="Pincode">
                        <Input value={draft.pincode} onChange={(e) => setDraft({ ...draft, pincode: e.target.value })} />
                      </Field>
                      <Field label="Current CTC">
                        <Input value={draft.currentCtc} onChange={(e) => setDraft({ ...draft, currentCtc: e.target.value })} />
                      </Field>
                    </div>
                    <label className="flex items-center gap-2 text-[13px] font-semibold mt-1 mb-2">
                      <input type="checkbox" checked={draft.relocationOk} onChange={(e) => setDraft({ ...draft, relocationOk: e.target.checked })} />
                      Open to relocation
                    </label>
                    <SaveBar saving={saving} error={saveError} onSave={() => saveEdit(draft)} />
                  </>
                ) : (
                  <dl className="grid sm:grid-cols-2 gap-x-6 gap-y-3 text-[13px]">
                    <div>
                      <dt className="text-(--jobs-ink-soft)">Date of birth</dt>
                      <dd className="font-semibold mt-0.5">{profile.dob || '—'}</dd>
                    </div>
                    <div>
                      <dt className="text-(--jobs-ink-soft)">Gender</dt>
                      <dd className="font-semibold mt-0.5">{profile.gender || '—'}</dd>
                    </div>
                    <div>
                      <dt className="text-(--jobs-ink-soft)">Marital status</dt>
                      <dd className="font-semibold mt-0.5">{profile.maritalStatus || '—'}</dd>
                    </div>
                    <div>
                      <dt className="text-(--jobs-ink-soft)">Current CTC</dt>
                      <dd className="font-semibold mt-0.5">{profile.currentCtc || '—'}</dd>
                    </div>
                    <div>
                      <dt className="text-(--jobs-ink-soft)">Pincode</dt>
                      <dd className="font-semibold mt-0.5">{profile.pincode || '—'}</dd>
                    </div>
                    <div>
                      <dt className="text-(--jobs-ink-soft)">Open to relocation</dt>
                      <dd className="font-semibold mt-0.5">{profile.relocationOk ? 'Yes' : 'No'}</dd>
                    </div>
                  </dl>
                )}
              </Section>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
