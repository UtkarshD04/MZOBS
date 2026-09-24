import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import clsx from 'clsx'
import { ArrowLeft, Briefcase, MapPin, Clock, IndianRupee, Users, Sparkles, AlertTriangle } from 'lucide-react'
import { Button, Chip, Skeleton, EmptyState } from '../components/ui'
import { TagInput } from '../components/FilterPanel'
import { vocab } from '../lib/talent/vocab'
import { useWorkspace } from '../store/workspace'
import { getPlanSnapshot, subscribePlan } from '../services/planService'
import { IS_DEMO } from '../lib/config'
import { EMPLOYMENT_TYPES, WORK_MODES, TRACKS, FEE_PER_OPENING, RESUMES_PER_OPENING, createJob, updateJob, setJobStatus, getJob, toPayload, toForm, validate, jobError } from '../services/jobsService'

const BLANK = { title: '', department: '', employmentType: 'Full-time', experienceMin: 0, experienceMax: 3, salaryMin: '', salaryMax: '', vacancies: 1, location: '', workMode: 'Hybrid', skills: [], track: '', description: '', benefits: [], deadline: '' }

const input = (bad) => clsx('h-10 w-full rounded-lg border bg-white px-3 text-[14px] outline-none focus:border-accent', bad ? 'border-bad' : 'border-line')

function Field({ label, error, hint, children, className }) {
  return (
    <label className={clsx('block', className)}>
      <span className="text-[12.5px] font-medium text-ink-2">{label}</span>
      <div className="mt-1">{children}</div>
      {error ? <p role="alert" className="mt-1 text-[12px] text-bad">{error}</p> : hint && <p className="mt-1 text-[12px] text-muted">{hint}</p>}
    </label>
  )
}

function Section({ title, sub, children }) {
  return (
    <section className="rounded-2xl border border-line bg-white p-5 shadow-card">
      <h2 className="text-[15px] font-semibold">{title}</h2>
      {sub && <p className="text-[12.5px] text-muted">{sub}</p>}
      <div className="mt-4 grid gap-4 sm:grid-cols-2">{children}</div>
    </section>
  )
}

export default function JobForm() {
  const { id } = useParams()
  const nav = useNavigate()
  const { toast } = useWorkspace()
  const editing = !!id
  const [f, setF] = useState(BLANK)
  const [status, setStatus] = useState('draft')
  const [loading, setLoading] = useState(editing)
  const [missing, setMissing] = useState(false)
  const [errors, setErrors] = useState({})
  const [busy, setBusy] = useState(false)
  const [planError, setPlanError] = useState('')
  const [apiError, setApiError] = useState('')
  const set = (patch) => setF((x) => ({ ...x, ...patch }))
  const [plan, setPlan] = useState(getPlanSnapshot())
  useEffect(() => subscribePlan(setPlan), [])
  const noPlan = !IS_DEMO && plan && !plan.active

  useEffect(() => {
    if (!editing) return
    getJob(id)
      .then((j) => {
        if (!j) return setMissing(true)
        setF(toForm(j))
        setStatus(j.status)
      })
      .catch(() => setMissing(true))
      .finally(() => setLoading(false))
  }, [id, editing])

  const live = status !== 'draft'
  const fee = useMemo(() => (Number(f.vacancies) || 0) * FEE_PER_OPENING, [f.vacancies])

  const save = async (publish) => {
    setApiError('')
    setPlanError('')
    // The API needs the same required fields for a draft as for a live job; a draft may just have a shorter description.
    const errs = validate(f)
    if (!publish && f.description.trim()) delete errs.description
    setErrors(errs)
    if (Object.keys(errs).length) return window.scrollTo({ top: 0, behavior: 'smooth' })
    setBusy(true)
    try {
      const body = toPayload(f)
      let job
      if (editing) {
        job = await updateJob(id, body)
        if (publish && status === 'draft') job = await setJobStatus(id, 'pending_review')
      } else {
        job = await createJob(body, publish)
      }
      const wentLive = publish && status === 'draft'
      toast(wentLive ? `“${job.title}” is live for candidates` : publish ? 'Changes saved' : 'Draft saved')
      nav('/jobs', { state: { justPosted: wentLive ? job.id : null } })
    } catch (e) {
      const err = jobError(e)
      if (err.plan) setPlanError(err.message)
      else setApiError(err.message)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } finally {
      setBusy(false)
    }
  }

  if (loading) return <div className="mx-auto max-w-[1100px] space-y-4 px-4 py-8"><Skeleton className="h-24 w-full" /><Skeleton className="h-64 w-full" /></div>
  if (missing) return <EmptyState icon={Briefcase} title="Job not found" action={<Button onClick={() => nav('/jobs')}>Back to jobs</Button>} />

  return (
    <div className="mx-auto max-w-[1100px] px-4 pb-28 pt-6 lg:px-6">
      <Link to="/jobs" className="mb-3 inline-flex items-center gap-1.5 text-[13px] font-medium text-muted hover:text-ink"><ArrowLeft size={14} /> Jobs</Link>
      <h1 className="text-[30px] font-extrabold tracking-[-0.03em] text-ink">{editing ? 'Edit job' : 'Post a job'}</h1>
      <p className="mt-1 text-[14px] text-muted">Publish a requirement and Mzobs sources verified candidates for it. You can search talent for this job right after.</p>

      {noPlan && !planError && (
        <div role="status" className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[#f3dfb8] bg-warn-soft px-4 py-3 text-[13.5px] text-warn">
          <span className="flex items-center gap-2"><AlertTriangle size={16} /> You need an active employer plan to save or publish jobs.</span>
          <Link to="/credits" className="font-semibold underline">Subscribe</Link>
        </div>
      )}
      {planError && (
        <div role="alert" className="mt-4 flex items-start gap-3 rounded-2xl border border-[#f3dfb8] bg-warn-soft px-4 py-3 text-[13.5px] text-warn">
          <AlertTriangle size={16} className="mt-0.5 shrink-0" />
          <div>
            <p className="font-semibold">Your employer plan is inactive</p>
            <p>{planError} <Link to="/credits" className="font-semibold underline">Subscribe on Plan & credits</Link>, then come back — your form is kept.</p>
          </div>
        </div>
      )}
      {apiError && <p role="alert" className="mt-4 rounded-lg bg-[#fdecec] px-4 py-2.5 text-[13.5px] text-bad">{apiError}</p>}
      {IS_DEMO && <p className="mt-4 rounded-lg bg-warn-soft px-4 py-2.5 text-[13px] text-warn">Demo mode: jobs are saved on this device only and are not sent to candidates.</p>}

      <div className="mt-5 grid gap-5 lg:grid-cols-[1fr_320px]">
        <div className="space-y-5">
          <Section title="Role">
            <Field label="Job title" error={errors.title} className="sm:col-span-2"><input value={f.title} onChange={(e) => set({ title: e.target.value })} placeholder="e.g. Senior Python Developer" className={input(errors.title)} autoFocus /></Field>
            <Field label="Department" error={errors.department}><input value={f.department} onChange={(e) => set({ department: e.target.value })} placeholder="e.g. Engineering" className={input(errors.department)} /></Field>
            <Field label="Employment type">
              <select value={f.employmentType} onChange={(e) => set({ employmentType: e.target.value })} className={input()}>{EMPLOYMENT_TYPES.map((t) => <option key={t}>{t}</option>)}</select>
            </Field>
            <Field label="Location" error={errors.location}><input value={f.location} onChange={(e) => set({ location: e.target.value })} placeholder="City, or Remote" list="job-cities" className={input(errors.location)} /><datalist id="job-cities">{vocab.cities.map((c) => <option key={c} value={c} />)}</datalist></Field>
            <Field label="Work mode">
              <div className="flex gap-1.5">{WORK_MODES.map((m) => <button type="button" key={m} onClick={() => set({ workMode: m })} className={clsx('h-10 flex-1 rounded-lg border text-[13px] font-medium', f.workMode === m ? 'border-accent bg-accent-soft text-[#0a6f64]' : 'border-line hover:bg-line-2')}>{m}</button>)}</div>
            </Field>
          </Section>

          <Section title="Requirements">
            <Field label="Experience (years)" error={errors.experience}>
              <div className="flex items-center gap-2">
                <input type="number" min="0" step="0.5" value={f.experienceMin} onChange={(e) => set({ experienceMin: e.target.value })} aria-label="Minimum experience" className={input(errors.experience)} />
                <span className="text-muted">to</span>
                <input type="number" min="0" step="0.5" value={f.experienceMax} onChange={(e) => set({ experienceMax: e.target.value })} aria-label="Maximum experience" className={input(errors.experience)} />
              </div>
            </Field>
            <Field label="Function" hint="Helps candidates on the matching track find this job.">
              <select value={f.track} onChange={(e) => set({ track: e.target.value })} className={input()}>{TRACKS.map((t) => <option key={t.id} value={t.id}>{t.label}</option>)}</select>
            </Field>
            <div className="sm:col-span-2">
              <span className="text-[12.5px] font-medium text-ink-2">Key skills</span>
              <div className="mt-1"><TagInput values={f.skills} onChange={(skills) => set({ skills })} placeholder="Add a skill and press Enter" suggestions={vocab.skills} /></div>
            </div>
          </Section>

          <Section title="Compensation & openings">
            <Field label="Annual salary (₹ LPA)" error={errors.salary}>
              <div className="flex items-center gap-2">
                <input type="number" min="0" step="0.5" value={f.salaryMin} onChange={(e) => set({ salaryMin: e.target.value })} placeholder="Min" aria-label="Minimum salary" className={input(errors.salary)} />
                <span className="text-muted">to</span>
                <input type="number" min="0" step="0.5" value={f.salaryMax} onChange={(e) => set({ salaryMax: e.target.value })} placeholder="Max" aria-label="Maximum salary" className={input(errors.salary)} />
              </div>
            </Field>
            <Field label="Openings" error={errors.vacancies}><input type="number" min="1" value={f.vacancies} onChange={(e) => set({ vacancies: e.target.value })} className={input(errors.vacancies)} /></Field>
            <Field label="Apply by" error={errors.deadline}><input type="date" value={f.deadline} min={new Date().toISOString().slice(0, 10)} onChange={(e) => set({ deadline: e.target.value })} className={input(errors.deadline)} /></Field>
          </Section>

          <Section title="Description">
            <Field label="About the role" error={errors.description} className="sm:col-span-2">
              <textarea rows={8} value={f.description} onChange={(e) => set({ description: e.target.value })} placeholder="What will this person own? What does success look like in 6 months?" className={clsx('w-full rounded-lg border bg-white p-3 text-[14px] leading-6 outline-none focus:border-accent', errors.description ? 'border-bad' : 'border-line')} />
            </Field>
            <div className="sm:col-span-2">
              <span className="text-[12.5px] font-medium text-ink-2">Benefits <span className="font-normal text-muted">(optional)</span></span>
              <div className="mt-1"><TagInput values={f.benefits} onChange={(benefits) => set({ benefits })} placeholder="Health insurance, ESOPs…" /></div>
            </div>
          </Section>
        </div>

        <aside className="space-y-4 lg:sticky lg:top-[72px] lg:self-start">
          <div className="rounded-2xl border border-line bg-white p-5 shadow-card">
            <p className="text-[11.5px] font-medium uppercase tracking-wide text-muted">Preview</p>
            <h3 className="mt-1 text-[17px] font-semibold">{f.title || 'Job title'}</h3>
            <p className="text-[13px] text-muted">{f.department || 'Department'} · {f.employmentType}</p>
            <ul className="mt-3 space-y-1.5 text-[13px] text-ink-2">
              <li className="flex items-center gap-2"><MapPin size={13} className="text-muted" /> {f.location || 'Location'} · {f.workMode}</li>
              <li className="flex items-center gap-2"><Clock size={13} className="text-muted" /> {f.experienceMin}–{f.experienceMax} yrs</li>
              <li className="flex items-center gap-2"><IndianRupee size={13} className="text-muted" /> {f.salaryMin !== '' && f.salaryMax !== '' ? `${f.salaryMin}–${f.salaryMax} LPA` : 'Salary range'}</li>
              <li className="flex items-center gap-2"><Users size={13} className="text-muted" /> {f.vacancies || 0} opening{Number(f.vacancies) === 1 ? '' : 's'}</li>
            </ul>
            {f.skills.length > 0 && <div className="mt-3 flex flex-wrap gap-1.5">{f.skills.map((s) => <Chip key={s} tone="accent">{s}</Chip>)}</div>}
          </div>
          <div className="rounded-2xl border border-[#bfe6df] bg-ai-soft p-4 text-[13px] text-ink-2">
            <p className="flex items-center gap-1.5 font-semibold text-[#0a6f64]"><Sparkles size={14} /> What happens next</p>
            <p className="mt-1">Publishing makes the job visible to candidates. Mzobs shares up to <b>{(Number(f.vacancies) || 0) * RESUMES_PER_OPENING}</b> verified resumes for {f.vacancies || 0} opening{Number(f.vacancies) === 1 ? '' : 's'}.</p>
            <p className="mt-1 text-muted">Estimated fee ₹{fee.toLocaleString('en-IN')} (₹{FEE_PER_OPENING.toLocaleString('en-IN')} per opening). The exact amount is confirmed by the server.</p>
          </div>
        </aside>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-white/95 px-4 py-3 backdrop-blur">
        <div className="mx-auto flex max-w-[1100px] items-center justify-end gap-2">
          <Button onClick={() => nav('/jobs')} disabled={busy}>Cancel</Button>
          {(!editing || !live) && <Button onClick={() => save(false)} disabled={busy}>{editing ? 'Save draft' : 'Save as draft'}</Button>}
          <Button variant="primary" onClick={() => save(true)} disabled={busy}>{busy ? 'Saving…' : editing && live ? 'Save changes' : 'Publish job'}</Button>
        </div>
      </div>
    </div>
  )
}
