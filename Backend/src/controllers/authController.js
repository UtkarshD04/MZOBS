import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { env } from '../config/env.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import { initialsOf } from '../utils/initials.js'
import User from '../models/User.js'
import Company from '../models/Company.js'

function issueToken(user, company) {
  return jwt.sign(
    { sub: user._id.toString(), companyId: company._id.toString(), role: user.role, type: 'employer' },
    env.jwtSecret,
    { expiresIn: env.jwtExpiresIn }
  )
}

function authResponse(user, company) {
  return {
    token: issueToken(user, company),
    user: {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
      initials: initialsOf(user.name),
    },
    company: {
      id: company._id.toString(),
      name: company.name,
      logo: company.logo,
    },
  }
}

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body ?? {}
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' })
  }

  const user = await User.findOne({ email: email.toLowerCase().trim() })
    .select('+passwordHash')
    .populate('company')

  if (!user || !user.passwordHash) return res.status(401).json({ message: 'Invalid email or password' })

  const matches = await bcrypt.compare(password, user.passwordHash)
  if (!matches) return res.status(401).json({ message: 'Invalid email or password' })

  user.lastActiveAt = new Date()
  await user.save()

  res.json(authResponse(user, user.company))
})

export const signup = asyncHandler(async (req, res) => {
  const { companyName, name, email, password } = req.body ?? {}
  if (!companyName || !name || !email || !password) {
    return res.status(400).json({ message: 'Company name, your name, email and password are required' })
  }
  if (password.length < 8) {
    return res.status(400).json({ message: 'Password must be at least 8 characters' })
  }

  const normalizedEmail = email.toLowerCase().trim()
  const existing = await User.findOne({ email: normalizedEmail })
  if (existing) return res.status(409).json({ message: 'An account with this email already exists' })

  const company = await Company.create({ name: companyName.trim() })

  const passwordHash = await bcrypt.hash(password, 10)
  const user = await User.create({
    company: company._id,
    name: name.trim(),
    email: normalizedEmail,
    passwordHash,
    role: 'Admin',
    status: 'active',
    lastActiveAt: new Date(),
  })

  res.status(201).json(authResponse(user, company))
})

export const getMe = asyncHandler(async (req, res) => {
  res.json({
    id: req.user._id.toString(),
    name: req.user.name,
    email: req.user.email,
    role: req.user.role,
    initials: initialsOf(req.user.name),
  })
})

export const updateMe = asyncHandler(async (req, res) => {
  const { name } = req.body ?? {}
  if (!name || !name.trim()) return res.status(400).json({ message: 'name is required' })

  req.user.name = name.trim()
  await req.user.save()

  res.json({
    id: req.user._id.toString(),
    name: req.user.name,
    email: req.user.email,
    role: req.user.role,
    initials: initialsOf(req.user.name),
  })
})
