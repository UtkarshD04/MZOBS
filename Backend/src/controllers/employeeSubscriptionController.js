import { asyncHandler } from '../utils/asyncHandler.js'
import { getRazorpayClient } from '../config/razorpay.js'
import { verifyOrderPaymentSignature } from '../utils/razorpaySignature.js'
import { env } from '../config/env.js'
import { logger } from '../config/logger.js'
import Employee from '../models/Employee.js'
import Payment from '../models/Payment.js'

const DEFAULT_FEE = 99

export const getSubscription = asyncHandler(async (req, res) => {
  res.json(req.employee.subscription)
})

// Creates a Razorpay order for the fixed, server-side subscription fee.
// The amount never comes from the client — only the order id it returns.
export const createSubscriptionOrder = asyncHandler(async (req, res) => {
  const employee = req.employee
  if (employee.subscription.status === 'paid') {
    return res.status(409).json({ message: 'Subscription is already active' })
  }

  const amount = employee.subscription.amount ?? DEFAULT_FEE
  const receipt = `sub_${employee._id}_${Date.now()}`

  const order = await getRazorpayClient().orders.create({
    amount: Math.round(amount * 100), // paise
    currency: 'INR',
    receipt,
    notes: { purpose: 'employee_subscription', employeeId: employee._id.toString() },
  })

  await Payment.create({
    purpose: 'employee_subscription',
    employee: employee._id,
    razorpayOrderId: order.id,
    amount,
    currency: 'INR',
    status: 'created',
    receipt,
  })

  res.status(201).json({
    orderId: order.id,
    amount: order.amount,
    currency: order.currency,
    keyId: env.razorpayKeyId,
    name: 'Mzobs',
    description: 'Placement Support Programme — one-time fee',
    prefill: { name: employee.name, email: employee.email, contact: employee.phone || undefined },
  })
})

// Confirms the checkout redirect result. Signature verification alone proves
// the payment came from Razorpay for this exact order; the payments.fetch
// call is a belt-and-braces check that it actually settled as 'captured'
// before we credit the account.
export const verifySubscriptionPayment = asyncHandler(async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body ?? {}
  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    return res.status(400).json({ message: 'Missing payment details' })
  }

  const employee = req.employee
  const payment = await Payment.findOne({ razorpayOrderId: razorpay_order_id, employee: employee._id })
  if (!payment) return res.status(404).json({ message: 'Order not found' })

  if (payment.status === 'paid') {
    return res.json(employee.subscription)
  }
  if (payment.status !== 'created') {
    return res.status(400).json({ message: 'This order can no longer be verified' })
  }

  if (!verifyOrderPaymentSignature(razorpay_order_id, razorpay_payment_id, razorpay_signature)) {
    payment.status = 'failed'
    await payment.save()
    logger.warn({ orderId: razorpay_order_id, employeeId: employee._id.toString() }, 'Razorpay signature verification failed')
    return res.status(400).json({ message: 'Payment verification failed' })
  }

  const captured = await getRazorpayClient().payments.fetch(razorpay_payment_id)
  if (captured.order_id !== razorpay_order_id || captured.status !== 'captured') {
    payment.status = 'failed'
    await payment.save()
    return res.status(400).json({ message: 'Payment was not captured' })
  }

  payment.razorpayPaymentId = razorpay_payment_id
  payment.razorpaySignature = razorpay_signature
  payment.status = 'paid'
  payment.paidAt = new Date()
  await payment.save()

  employee.subscription = { status: 'paid', amount: payment.amount, paidOn: payment.paidAt }
  await employee.save()

  res.json(employee.subscription)
})
