import { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Controller, useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowLeft, Save, Send, Info } from 'lucide-react'
import PageHeader from '../components/layout/PageHeader'
import Card, { CardBody, CardHead, CardTitle } from '../components/ui/Card'
import Button from '../components/ui/Button'
import { Field, Input, Select, Textarea } from '../components/ui/Field'
import TagInput from '../components/ui/TagInput'
import { PageSkeleton } from '../components/ui/Skeleton'
import { jobDefaultValues, jobSchema } from '../schemas/jobSchema'
import { useCreateJob, useJobQuery, useUpdateJob } from '../hooks/useJobs'
import { PRICING } from '../data/mock'
import { fmtINR } from '../lib/utils'

const DEPARTMENTS = ['Engineering', 'Design', 'Product', 'Sales', 'Marketing', 'Operations', 'People', 'Finance']

export default function JobForm() {
  const navigate = useNavigate()
  const { id } = useParams()
  const isEdit = !!id
  const { data: existingJob, isLoading } = useJobQuery(id)
  const createJob = useCreateJob()
  const updateJob = useUpdateJob()

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ resolver: zodResolver(jobSchema), defaultValues: jobDefaultValues })

  useEffect(() => {
    if (existingJob) {
      reset({
        title: existingJob.title,
        department: existingJob.department,
        employmentType: existingJob.employmentType,
        experienceMin: existingJob.experienceMin,
        experienceMax: existingJob.experienceMax,
        salaryMin: existingJob.salaryMin,
        salaryMax: existingJob.salaryMax,
        vacancies: existingJob.vacancies,
        location: existingJob.location,
        workMode: existingJob.workMode,
        skills: existingJob.skills,
        description: existingJob.description,
        benefits: existingJob.benefits,
        deadline: existingJob.deadline,
      })
    }
  }, [existingJob, reset])

  const isPending = createJob.isPending || updateJob.isPending

  // The commercials follow the openings, so show them live as the number changes.
  const openings = useWatch({ control, name: 'vacancies' }) || 0
  const fee = openings * PRICING.perOpeningFee
  const resumes = openings * PRICING.resumesPerOpening

  function submitAs(status) {
    return handleSubmit((values) => {
      const payload = { ...values, status, hiringTeam: existingJob?.hiringTeam ?? ['RK'] }
      if (isEdit && id) {
        updateJob.mutate({ id, input: payload }, { onSuccess: () => navigate('/jobs') })
      } else {
        createJob.mutate(payload, { onSuccess: () => navigate('/jobs') })
      }
    })
  }

  if (isEdit && isLoading) return <PageSkeleton />

  return (
    <div>
      <button onClick={() => navigate('/jobs')} className="flex items-center gap-1.5 text-[12.5px] font-semibold text-ink-secondary hover:text-ink mb-4">
        <ArrowLeft size={14} /> Back to Requirements
      </button>
      <PageHeader
        title={isEdit ? 'Edit Requirement' : 'New Requirement'}
        subtitle={
          isEdit
            ? 'Update this requirement. Changes go back to Mzobs for review if it has not been paid for yet.'
            : `Tell Mzobs how many people you need. You pay ${fmtINR(PRICING.perOpeningFee)} per opening and receive ${PRICING.resumesPerOpening} screened resumes for each one.`
        }
      />

      <form onSubmit={(e) => e.preventDefault()}>
        <div className="grid grid-cols-3 gap-5 max-xl:grid-cols-1">
          <div className="col-span-2 max-xl:col-span-1 flex flex-col gap-5">
            <Card>
              <CardHead><CardTitle>Role Details</CardTitle></CardHead>
              <CardBody>
                <Field label="Job Title" error={errors.title?.message}>
                  <Input placeholder="e.g. Senior Backend Engineer" error={!!errors.title} {...register('title')} />
                </Field>
                <div className="grid grid-cols-2 gap-4">
                  <Field label="Department" error={errors.department?.message}>
                    <Select error={!!errors.department} {...register('department')}>
                      <option value="">Select department</option>
                      {DEPARTMENTS.map((d) => (
                        <option key={d} value={d}>{d}</option>
                      ))}
                    </Select>
                  </Field>
                  <Field label="Employment Type" error={errors.employmentType?.message}>
                    <Select {...register('employmentType')}>
                      <option value="Full-time">Full-time</option>
                      <option value="Part-time">Part-time</option>
                      <option value="Contract">Contract</option>
                      <option value="Internship">Internship</option>
                    </Select>
                  </Field>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <Field label="Experience (min – max, years)" error={errors.experienceMin?.message || errors.experienceMax?.message}>
                    <div className="flex items-center gap-2">
                      <Input type="number" min={0} error={!!errors.experienceMin} {...register('experienceMin', { valueAsNumber: true })} />
                      <span className="text-ink-tertiary text-[13px]">to</span>
                      <Input type="number" min={0} error={!!errors.experienceMax} {...register('experienceMax', { valueAsNumber: true })} />
                    </div>
                  </Field>
                  <Field label="Openings" hint={`Billed at ${fmtINR(PRICING.perOpeningFee)} each`} error={errors.vacancies?.message}>
                    <Input type="number" min={1} error={!!errors.vacancies} {...register('vacancies', { valueAsNumber: true })} />
                  </Field>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <Field label="Location" error={errors.location?.message}>
                    <Input placeholder="e.g. Bengaluru" error={!!errors.location} {...register('location')} />
                  </Field>
                  <Field label="Work Mode" error={errors.workMode?.message}>
                    <Select {...register('workMode')}>
                      <option value="On-site">On-site</option>
                      <option value="Hybrid">Hybrid</option>
                      <option value="Remote">Remote</option>
                    </Select>
                  </Field>
                </div>
                <Field label="Salary Range (annual, ₹)" error={errors.salaryMin?.message || errors.salaryMax?.message}>
                  <div className="flex items-center gap-2">
                    <Input type="number" min={0} placeholder="Min" error={!!errors.salaryMin} {...register('salaryMin', { valueAsNumber: true })} />
                    <span className="text-ink-tertiary text-[13px]">to</span>
                    <Input type="number" min={0} placeholder="Max" error={!!errors.salaryMax} {...register('salaryMax', { valueAsNumber: true })} />
                  </div>
                </Field>
                <Field label="Application Deadline" error={errors.deadline?.message}>
                  <Input type="date" error={!!errors.deadline} {...register('deadline')} />
                </Field>
              </CardBody>
            </Card>

            <Card>
              <CardHead><CardTitle>Skills & Description</CardTitle></CardHead>
              <CardBody>
                <Field label="Required Skills" hint="Press Enter to add a skill" error={errors.skills?.message}>
                  <Controller name="skills" control={control} render={({ field }) => <TagInput value={field.value} onChange={field.onChange} placeholder="e.g. Node.js, System Design" />} />
                </Field>
                <Field label="Job Description" error={errors.description?.message}>
                  <Textarea rows={7} placeholder="Describe the role, responsibilities and what success looks like…" error={!!errors.description} {...register('description')} />
                </Field>
                <Field label="Benefits" optional hint="Press Enter to add a benefit">
                  <Controller name="benefits" control={control} render={({ field }) => <TagInput value={field.value} onChange={field.onChange} placeholder="e.g. Health insurance, ESOPs" />} />
                </Field>
              </CardBody>
            </Card>
          </div>

          <div className="flex flex-col gap-5">
            <Card>
              <CardHead><CardTitle>What this will cost</CardTitle></CardHead>
              <CardBody>
                <div className="flex items-baseline justify-between pb-3 border-b border-border">
                  <span className="text-[13px] text-ink-secondary">
                    {openings || 0} opening{openings === 1 ? '' : 's'} × {fmtINR(PRICING.perOpeningFee)}
                  </span>
                  <span className="text-[22px] font-bold tracking-tight tabular-nums">{fmtINR(fee)}</span>
                </div>
                <div className="flex items-baseline justify-between pt-3">
                  <span className="text-[13px] text-ink-secondary">Resumes Mzobs will send</span>
                  <span className="text-[17px] font-bold tabular-nums">{resumes}</span>
                </div>
                <p className="text-[12px] text-ink-tertiary mt-3">
                  {PRICING.resumesPerOpening} screened, interview-ready profiles per opening. You choose your hires from that set.
                </p>
              </CardBody>
            </Card>

            <Card>
              <CardHead><CardTitle>Submit</CardTitle></CardHead>
              <CardBody className="flex flex-col gap-2.5">
                <div className="flex items-start gap-2 mb-1">
                  <Info size={14} className="text-navy mt-0.5 flex-shrink-0" />
                  <p className="text-[12.5px] text-ink-secondary leading-relaxed">
                    Mzobs reviews the requirement first, then raises an invoice. Sourcing begins once payment clears. Candidate applications stay with
                    Mzobs — you receive a screened batch, not a queue of applicants.
                  </p>
                </div>
                <Button type="button" variant="primary" size="md" loading={isPending} onClick={submitAs('pending_review')}>
                  <Send size={15} /> Submit to Mzobs
                </Button>
                <Button type="button" variant="secondary" size="md" loading={isPending} onClick={submitAs('draft')}>
                  <Save size={15} /> Save as Draft
                </Button>
              </CardBody>
            </Card>
          </div>
        </div>
      </form>
    </div>
  )
}
