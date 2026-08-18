import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { env } from '../config/env.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import { initialsOf } from '../utils/initials.js'
import Employee from '../models/Employee.js'

function issueToken(employee) {
  return jwt.sign({ sub: employee._id.toString(), type: 'employee' }, env.jwtSecret, {
    expiresIn: env.jwtExpiresIn,
  })
}

function employeeSummary(employee) {
  return {
    id: employee._id.toString(),
    name: employee.name,
    email: employee.email,
    phone: employee.phone,
    experience: employee.experience,
    graduation: employee.graduation,
    initials: initialsOf(employee.name),
  }
}

function authResponse(employee) {
  return { token: issueToken(employee), employee: employeeSummary(employee) }
}

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body ?? {}
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' })
  }

  const employee = await Employee.findOne({ email: email.toLowerCase().trim() }).select('+passwordHash')
  if (!employee) return res.status(401).json({ message: 'Invalid email or password' })

  const matches = await bcrypt.compare(password, employee.passwordHash)
  if (!matches) return res.status(401).json({ message: 'Invalid email or password' })

  employee.lastActiveAt = new Date()
  await employee.save()

  res.json(authResponse(employee))
})

export const signup = asyncHandler(async (req, res) => {
  const { name, email, phone, password, experience, graduation } = req.body ?? {}
  if (!name || !email || !phone || !password || !graduation) {
    return res.status(400).json({ message: 'Name, email, phone, password and graduation are required' })
  }
  if (password.length < 8) {
    return res.status(400).json({ message: 'Password must be at least 8 characters' })
  }

  const normalizedEmail = email.toLowerCase().trim()
  const existing = await Employee.findOne({ email: normalizedEmail })
  if (existing) return res.status(409).json({ message: 'An account with this email already exists' })

  const passwordHash = await bcrypt.hash(password, 10)
  const employee = await Employee.create({
    name: name.trim(),
    email: normalizedEmail,
    phone: phone.trim(),
    passwordHash,
    experience: experience === 'experienced' ? 'experienced' : 'fresher',
    graduation,
    status: 'active',
    lastActiveAt: new Date(),
  })

  res.status(201).json(authResponse(employee))
})

export const getMe = asyncHandler(async (req, res) => {
  res.json(employeeSummary(req.employee))
})

export const updateMe = asyncHandler(async (req, res) => {
  const { name } = req.body ?? {}
  if (!name || !name.trim()) return res.status(400).json({ message: 'name is required' })

  req.employee.name = name.trim()
  await req.employee.save()

  res.json(employeeSummary(req.employee))
})
