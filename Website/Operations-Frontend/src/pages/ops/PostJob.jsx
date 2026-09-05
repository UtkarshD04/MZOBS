import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import Card, { CardHead, CardBody } from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import { Field, Input, Select, Textarea } from '../../components/ui/Field'
import { StaggerGroup, StaggerItem } from '../../components/ui/Stagger'
import { useApp } from '../../context/AppContext'
import { useCompaniesQuery } from '../../hooks/useCompanies'
import { useCreateJobMutation } from '../../hooks/useJobs'

const DEPARTMENTS = ['Engineering', 'Design', 'Product', 'Sales', 'Marketing', 'Operations', 'People', 'Finance']
const TRACKS = [
  ['', 'No specific track'],
  ['analytics', 'Analytics'],
  ['design', 'Design'],
  ['sales', 'Sales'],
  ['marketing', 'Marketing'],
  ['hr', 'HR'],
  ['support', 'Support'],
  ['tech', 'Tech'],
  ['ops', 'Ops'],
]
const NEW_COMPANY = '__new__'

const emptyForm = {
  companyId: '',
  companyName: '',
  title: '',
  department: '',
  employmentType: 'Full-time',
  experienceMin: '',
  experienceMax: '',
  salaryMin: '',
  salaryMax: '',
  vacancies: '',
  location: '',
  workMode: 'Hybrid',
  track: '',
  skills: '',
  description: '',
  benefits: '',
  deadline: '',
}

export default function PostJob() {
  const navigate = useNavigate()
  const app = useApp()
  const { data: companies = [] } = useCompaniesQuery({})
  const createJob = useCreateJobMutation()
  const [form, setForm] = useState(emptyForm)

  function set(key) {
    return (e) => setForm((f) => ({ ...f, [key]: e.target.value }))
  }

  function submit() {
    const required = {
      title: form.title,
      department: form.department,
      experienceMin: form.experienceMin,
      experienceMax: form.experienceMax,
      salaryMin: form.salaryMin,
      salaryMax: form.salaryMax,
      vacancies: form.vacancies,
      location: form.location,
      description: form.description,
      deadline: form.deadline,
    }
    const missing = Object.entries(required).filter(([, v]) => !String(v).trim())
    if (missing.length) return app.addToast('error', 'Please fill in every required field.')
    if (!form.companyId && !form.companyName.trim()) return app.addToast('error', 'Select a company or enter a new company name.')

    const payload = {
      companyId: form.companyId && form.companyId !== NEW_COMPANY ? form.companyId : undefined,
      companyName: !form.companyId || form.companyId === NEW_COMPANY ? form.companyName.trim() : undefined,
      title: form.title.trim(),
      department: form.department,
      employmentType: form.employmentType,
      experienceMin: Number(form.experienceMin),
      experienceMax: Number(form.experienceMax),
      salaryMin: Number(form.salaryMin),
      salaryMax: Number(form.salaryMax),
      vacancies: Number(form.vacancies),
      location: form.location.trim(),
      workMode: form.workMode,
      track: form.track,
      skills: form.skills.split(',').map((s) => s.trim()).filter(Boolean),
      description: form.description.trim(),
      benefits: form.benefits.split(',').map((s) => s.trim()).filter(Boolean),
      deadline: form.deadline,
    }

    createJob.mutate(payload, {
      onSuccess: () => {
        app.addToast('success', `"${payload.title}" is live on the candidate job board`)
        navigate('/app/requirements')
      },
      onError: (err) => app.addToast('error', err.response?.data?.message ?? 'Something went wrong'),
    })
  }

  return (
    <StaggerGroup>
      <StaggerItem className="mb-6">
        <button onClick={() => navigate('/app/requirements')} className="flex items-center gap-1.5 text-[12.5px] font-semibold text-ink-secondary hover:text-ink mb-4">
          <ArrowLeft size={14} /> Back to Requirements
        </button>
        <h1 className="text-2xl font-bold tracking-tight">Post a job</h1>
        <p className="text-sm text-ink-secondary mt-1">A Mzobs-posted role — no invoice, no employer review, it goes live on the candidate job board immediately.</p>
      </StaggerItem>

      <StaggerItem>
        <Card>
          <CardHead>
            <span className="text-[15px] font-semibold">Company</span>
          </CardHead>
          <CardBody>
            <Field label="Company">
              <Select value={form.companyId} onChange={set('companyId')}>
                <option value="">Select a company</option>
                {companies.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
                <option value={NEW_COMPANY}>+ Add a new company</option>
              </Select>
            </Field>
            {(!form.companyId || form.companyId === NEW_COMPANY) && (
              <Field label="New company name" hint="A bare company profile is created — fill in the rest later from Companies.">
                <Input placeholder="e.g. Brightloop Technologies" value={form.companyName} onChange={set('companyName')} />
              </Field>
            )}
          </CardBody>
        </Card>
      </StaggerItem>

      <StaggerItem className="mt-5">
        <Card>
          <CardHead>
            <span className="text-[15px] font-semibold">Role details</span>
          </CardHead>
          <CardBody>
            <Field label="Job title">
              <Input placeholder="e.g. Senior Backend Engineer" value={form.title} onChange={set('title')} />
            </Field>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Department">
                <Select value={form.department} onChange={set('department')}>
                  <option value="">Select department</option>
                  {DEPARTMENTS.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </Select>
              </Field>
              <Field label="Employment type">
                <Select value={form.employmentType} onChange={set('employmentType')}>
                  <option value="Full-time">Full-time</option>
                  <option value="Part-time">Part-time</option>
                  <option value="Contract">Contract</option>
                  <option value="Internship">Internship</option>
                </Select>
              </Field>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Experience (min – max, years)">
                <div className="flex items-center gap-2">
                  <Input type="number" min={0} value={form.experienceMin} onChange={set('experienceMin')} />
                  <span className="text-ink-tertiary text-[13px]">to</span>
                  <Input type="number" min={0} value={form.experienceMax} onChange={set('experienceMax')} />
                </div>
              </Field>
              <Field label="Openings">
                <Input type="number" min={1} value={form.vacancies} onChange={set('vacancies')} />
              </Field>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Location">
                <Input placeholder="e.g. Bengaluru" value={form.location} onChange={set('location')} />
              </Field>
              <Field label="Work mode">
                <Select value={form.workMode} onChange={set('workMode')}>
                  <option value="On-site">On-site</option>
                  <option value="Hybrid">Hybrid</option>
                  <option value="Remote">Remote</option>
                </Select>
              </Field>
            </div>
            <Field label="Salary range (annual, ₹)">
              <div className="flex items-center gap-2">
                <Input type="number" min={0} placeholder="Min" value={form.salaryMin} onChange={set('salaryMin')} />
                <span className="text-ink-tertiary text-[13px]">to</span>
                <Input type="number" min={0} placeholder="Max" value={form.salaryMax} onChange={set('salaryMax')} />
              </div>
            </Field>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Track" optional hint="Powers the employee 'My track' filter">
                <Select value={form.track} onChange={set('track')}>
                  {TRACKS.map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </Select>
              </Field>
              <Field label="Application deadline">
                <Input type="date" value={form.deadline} onChange={set('deadline')} />
              </Field>
            </div>
          </CardBody>
        </Card>
      </StaggerItem>

      <StaggerItem className="mt-5">
        <Card>
          <CardHead>
            <span className="text-[15px] font-semibold">Skills & description</span>
          </CardHead>
          <CardBody>
            <Field label="Required skills" hint="Comma-separated, e.g. Node.js, System Design">
              <Input placeholder="e.g. React, JavaScript, CSS" value={form.skills} onChange={set('skills')} />
            </Field>
            <Field label="Job description">
              <Textarea rows={7} placeholder="Describe the role, responsibilities and what success looks like…" value={form.description} onChange={set('description')} />
            </Field>
            <Field label="Benefits" optional hint="Comma-separated, e.g. Health insurance, Flexible hours">
              <Input placeholder="e.g. Health insurance, Flexible hours" value={form.benefits} onChange={set('benefits')} />
            </Field>
          </CardBody>
        </Card>
      </StaggerItem>

      <StaggerItem className="mt-5 flex justify-end">
        <Button variant="primary" size="lg" onClick={submit} disabled={createJob.isPending}>
          {createJob.isPending ? 'Posting...' : 'Post job — go live now'}
        </Button>
      </StaggerItem>
    </StaggerGroup>
  )
}
