import { asyncHandler } from '../utils/asyncHandler.js'

export const getSubscription = asyncHandler(async (req, res) => {
  res.json(req.employee.subscription)
})

export const paySubscription = asyncHandler(async (req, res) => {
  const employee = req.employee
  if (employee.subscription.status === 'paid') {
    return res.status(409).json({ message: 'Subscription is already active' })
  }

  employee.subscription = { status: 'paid', amount: employee.subscription.amount ?? 99, paidOn: new Date() }
  await employee.save()

  res.json(employee.subscription)
})
