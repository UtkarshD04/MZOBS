import { Router } from 'express'
import { requireEmployeeAuth } from '../middleware/employeeAuth.js'
import { paymentLimiter } from '../middleware/rateLimit.js'
import { getSubscription, createSubscriptionOrder, verifySubscriptionPayment } from '../controllers/employeeSubscriptionController.js'

const router = Router()

router.get('/', requireEmployeeAuth, getSubscription)
router.post('/order', requireEmployeeAuth, paymentLimiter, createSubscriptionOrder)
router.post('/verify', requireEmployeeAuth, paymentLimiter, verifySubscriptionPayment)

export default router
