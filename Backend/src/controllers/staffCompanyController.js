import { asyncHandler } from '../utils/asyncHandler.js'
import { logStaffActivity } from '../utils/staffActivityLog.js'
import { paginationParams, paginate, setPaginationHeaders } from '../utils/paginate.js'
import Company from '../models/Company.js'

export const listCompanies = asyncHandler(async (req, res) => {
  const { status, search } = req.query
  const query = {}

  if (status && status !== 'all') query.verificationStatus = status
  if (search) {
    const regex = new RegExp(search, 'i')
    query.$or = [{ name: regex }, { hq: regex }, { industry: regex }]
  }

  const { data, page, limit, total } = await paginate(Company, query, paginationParams(req), { sort: { createdAt: -1 } })
  setPaginationHeaders(res, { page, limit, total })
  res.json(data)
})

export const getCompany = asyncHandler(async (req, res) => {
  const company = await Company.findById(req.params.id)
  if (!company) return res.status(404).json({ message: 'Company not found' })
  res.json(company)
})

export const verifyCompany = asyncHandler(async (req, res) => {
  const { method, note } = req.body ?? {}
  const company = await Company.findById(req.params.id)
  if (!company) return res.status(404).json({ message: 'Company not found' })

  company.verificationStatus = 'verified'
  company.verificationMethod = method ?? null
  company.verificationNote = note ?? ''
  company.verifiedOn = new Date()
  company.verifiedBy = req.staff.name

  await company.save()
  await logStaffActivity(`${company.name} verified via ${method ?? 'manual review'}`, 'green')

  res.json(company)
})

export const rejectCompany = asyncHandler(async (req, res) => {
  const { note } = req.body ?? {}
  const company = await Company.findById(req.params.id)
  if (!company) return res.status(404).json({ message: 'Company not found' })

  company.verificationStatus = 'rejected'
  company.verificationNote = note ?? ''
  company.verifiedOn = new Date()
  company.verifiedBy = req.staff.name

  await company.save()
  await logStaffActivity(`${company.name} verification rejected`, 'gold')

  res.json(company)
})
