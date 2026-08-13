import { asyncHandler } from '../utils/asyncHandler.js'
import { feeFor, resumesFor } from '../utils/jobPricing.js'
import { logActivity } from '../utils/activityLog.js'
import { paginationParams, paginate, setPaginationHeaders } from '../utils/paginate.js'
import Job from '../models/Job.js'
import Invoice from '../models/Invoice.js'

const INPUT_FIELDS = [
  'title',
  'department',
  'employmentType',
  'experienceMin',
  'experienceMax',
  'salaryMin',
  'salaryMax',
  'vacancies',
  'location',
  'workMode',
  'skills',
  'track',
  'description',
  'benefits',
  'deadline',
  'hiringTeam',
]

function pickInput(body) {
  const input = {}
  for (const field of INPUT_FIELDS) {
    if (body[field] !== undefined) input[field] = body[field]
  }
  return input
}

async function findScopedJob(req) {
  return Job.findOne({ _id: req.params.id, company: req.company._id })
}

export const listJobs = asyncHandler(async (req, res) => {
  const { search, status, department } = req.query
  const query = { company: req.company._id }

  if (status && status !== 'all') query.status = status
  if (department && department !== 'all') query.department = department
  if (search) {
    const regex = new RegExp(search, 'i')
    query.$or = [{ title: regex }, { department: regex }, { location: regex }]
  }

  const { data, page, limit, total } = await paginate(Job, query, paginationParams(req), { sort: { updatedOn: -1 } })
  setPaginationHeaders(res, { page, limit, total })
  res.json(data)
})

export const getJob = asyncHandler(async (req, res) => {
  const job = await findScopedJob(req)
  if (!job) return res.status(404).json({ message: 'Job not found' })
  res.json(job)
})

export const createJob = asyncHandler(async (req, res) => {
  const input = pickInput(req.body)
  const submitted = req.body.status === 'pending_review'

  const job = await Job.create({
    ...input,
    company: req.company._id,
    createdBy: req.user._id,
    status: req.body.status ?? 'draft',
    feeTotal: feeFor(input.vacancies),
    feeStatus: 'unpaid',
    resumesPromised: resumesFor(input.vacancies),
    candidatesShared: 0,
    hiresSelected: 0,
    submittedOn: submitted ? new Date() : null,
    postedOn: null,
    updatedOn: new Date(),
  })

  if (submitted) await logActivity(req.company._id, `Requirement "${job.title}" submitted to Mzobs for review`, 'navy')

  res.status(201).json(job)
})

export const updateJob = asyncHandler(async (req, res) => {
  const job = await findScopedJob(req)
  if (!job) return res.status(404).json({ message: 'Job not found' })

  const input = pickInput(req.body)
  Object.assign(job, input)
  if (input.vacancies !== undefined) {
    job.feeTotal = feeFor(input.vacancies)
    job.resumesPromised = resumesFor(input.vacancies)
  }
  job.updatedOn = new Date()

  await job.save()
  res.json(job)
})

export const setJobStatus = asyncHandler(async (req, res) => {
  const job = await findScopedJob(req)
  if (!job) return res.status(404).json({ message: 'Job not found' })

  const { status } = req.body ?? {}
  if (!status) return res.status(400).json({ message: 'status is required' })

  const enteringAwaitingPayment = status === 'awaiting_payment' && job.status !== 'awaiting_payment' && !job.invoiceId

  job.status = status
  if (status === 'pending_review' && !job.submittedOn) job.submittedOn = new Date()
  if (status === 'sourcing' && !job.postedOn) job.postedOn = new Date()
  job.updatedOn = new Date()

  if (enteringAwaitingPayment) {
    const invoice = await Invoice.create({
      company: req.company._id,
      job: job._id,
      description: `${job.title} — ${job.vacancies} opening${job.vacancies === 1 ? '' : 's'}`,
      amount: job.feeTotal,
      status: 'due',
    })
    job.invoiceId = invoice._id.toString()
  }

  await job.save()

  if (status === 'sourcing') await logActivity(req.company._id, `"${job.title}" released to Mzobs sourcing`, 'gold')
  if (status === 'pending_review') await logActivity(req.company._id, `Requirement "${job.title}" submitted to Mzobs for review`, 'navy')

  res.json(job)
})

export const payJobInvoice = asyncHandler(async (req, res) => {
  const job = await findScopedJob(req)
  if (!job) return res.status(404).json({ message: 'Job not found' })

  if (job.invoiceId) {
    await Invoice.findByIdAndUpdate(job.invoiceId, { status: 'paid' })
  } else {
    const invoice = await Invoice.create({
      company: req.company._id,
      job: job._id,
      description: `${job.title} — ${job.vacancies} opening${job.vacancies === 1 ? '' : 's'}`,
      amount: job.feeTotal,
      status: 'paid',
    })
    job.invoiceId = invoice._id.toString()
  }

  job.feeStatus = 'paid'
  job.paidOn = new Date()
  job.status = 'sourcing'
  if (!job.postedOn) job.postedOn = new Date()
  job.updatedOn = new Date()

  await job.save()

  await logActivity(req.company._id, `Payment received for "${job.title}" — Mzobs is now sourcing ${job.resumesPromised} resumes`, 'green')

  res.json(job)
})

export const duplicateJob = asyncHandler(async (req, res) => {
  const src = await findScopedJob(req)
  if (!src) return res.status(404).json({ message: 'Job not found' })

  const copy = await Job.create({
    company: src.company,
    createdBy: req.user._id,
    title: `${src.title} (Copy)`,
    department: src.department,
    employmentType: src.employmentType,
    experienceMin: src.experienceMin,
    experienceMax: src.experienceMax,
    salaryMin: src.salaryMin,
    salaryMax: src.salaryMax,
    vacancies: src.vacancies,
    location: src.location,
    workMode: src.workMode,
    skills: src.skills,
    track: src.track,
    description: src.description,
    benefits: src.benefits,
    deadline: src.deadline,
    hiringTeam: src.hiringTeam,
    status: 'draft',
    feeTotal: feeFor(src.vacancies),
    feeStatus: 'unpaid',
    resumesPromised: resumesFor(src.vacancies),
    candidatesShared: 0,
    hiresSelected: 0,
    submittedOn: null,
    postedOn: null,
    updatedOn: new Date(),
  })

  res.status(201).json(copy)
})

export const deleteJob = asyncHandler(async (req, res) => {
  const job = await Job.findOneAndDelete({ _id: req.params.id, company: req.company._id })
  if (!job) return res.status(404).json({ message: 'Job not found' })
  res.json({ success: true })
})
